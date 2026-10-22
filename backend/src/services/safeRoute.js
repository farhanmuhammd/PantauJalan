import Report from "../models/Report.js";
import { fetchRoutes } from "./osrm.js";
import { nearestOnLine, offsetPerpendicular, bboxPolygon } from "../utils/geo.js";

const num = (v, fallback) => {
  if (v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const CFG = {
  // Status laporan yang dianggap "masih merusak jalan" dan harus dihindari.
  statuses: (process.env.ROUTING_BLOCK_STATUSES || "menunggu,diverifikasi,diproses")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  // Rute dianggap "melewati" laporan jika jaraknya <= nilai ini (meter).
  bufferM: num(process.env.ROUTING_BUFFER_METERS, 40),
  // Seberapa jauh titik belok (via) digeser dari lokasi kerusakan (meter).
  detourM: num(process.env.ROUTING_DETOUR_METERS, 400),
  // Maksimum percobaan pengalihan berurutan.
  maxIter: num(process.env.ROUTING_MAX_ITER, 3),
  // Penalti waktu (detik) per bobot kerusakan. ringan=1, sedang=3, berat=10.
  penaltySec: num(process.env.ROUTING_PENALTY_SEC, 120),
  // Rute pengalihan ditolak jika lebih lama dari faktor ini x rute tercepat.
  maxDetourFactor: num(process.env.ROUTING_MAX_DETOUR_FACTOR, 2),
};

const WEIGHT = { ringan: 1, sedang: 3, berat: 10 };

// Laporan aktif yang berada di dekat garis rute.
const findHazardsOnRoute = async (coords) => {
  const candidates = await Report.find({
    status: { $in: CFG.statuses },
    location: { $geoWithin: { $geometry: bboxPolygon(coords, CFG.bufferM * 2) } },
  })
    .select("title severity status address location")
    .lean();

  const hazards = [];
  for (const r of candidates) {
    const [lng, lat] = r.location.coordinates;
    const near = nearestOnLine([lng, lat], coords);
    if (near.distance > CFG.bufferM) continue;
    hazards.push({
      id: r._id.toString(),
      title: r.title,
      address: r.address,
      severity: r.severity,
      status: r.status,
      lat,
      lng,
      distanceToRoute: Math.round(near.distance),
      weight: WEIGHT[r.severity] ?? 1,
      position: near.index, // urutan sepanjang rute
    });
  }
  return hazards.sort((a, b) => a.position - b.position);
};

const evaluate = async (route, vias = []) => {
  const coords = route.geometry.coordinates;
  const hazards = await findHazardsOnRoute(coords);
  const hazardScore = hazards.reduce((sum, h) => sum + h.weight, 0);
  return {
    distance: route.distance,
    duration: route.duration,
    geometry: route.geometry,
    coords,
    hazards,
    hazardScore,
    cost: route.duration + hazardScore * CFG.penaltySec,
    vias,
  };
};

const pickBest = (list) => list.reduce((a, b) => (b.cost < a.cost ? b : a));

const publicRoute = ({ distance, duration, geometry, hazards }) => ({
  distance: Math.round(distance),
  duration: Math.round(duration),
  geometry,
  hazards: hazards.map(({ position, weight, ...h }) => h),
});

/**
 * Cari rute dari origin ke destination yang menghindari laporan jalan rusak.
 *
 * Strategi (OSRM tidak bisa "memblokir" titik arbitrer, jadi kita pakai waypoint):
 *  1. Ambil rute tercepat + alternatifnya dari OSRM.
 *  2. Nilai tiap rute: cari laporan aktif dalam radius `bufferM` dari garis rute.
 *     cost = durasi + (total bobot kerusakan x penalti).
 *  3. Jika rute terbaik masih melewati kerusakan, paksa rute melambung lewat titik via
 *     yang digeser tegak lurus dari lokasi kerusakan (kiri & kanan), nilai ulang,
 *     ulangi sampai `maxIter` kali atau tidak ada perbaikan lagi.
 */
export const findSafeRoute = async (origin, destination) => {
  const A = [origin.lng, origin.lat];
  const B = [destination.lng, destination.lat];

  const osrmRoutes = await fetchRoutes([A, B], { alternatives: true });
  const candidates = await Promise.all(osrmRoutes.map((r) => evaluate(r)));

  const baseline = candidates[0]; // rute tercepat murni
  const maxDuration = Math.max(baseline.duration * CFG.maxDetourFactor, baseline.duration + 600);
  let best = pickBest(candidates);
  const tried = new Set();

  for (let i = 0; i < CFG.maxIter && best.hazards.length > 0; i++) {
    const target = [...best.hazards]
      .filter((h) => !tried.has(h.id))
      .sort((a, b) => b.weight - a.weight)[0];
    if (!target) break;
    tried.add(target.id);

    const near = nearestOnLine([target.lng, target.lat], best.coords);
    const attempts = await Promise.allSettled(
      [1, -1].map(async (side) => {
        const via = offsetPerpendicular(near.point, near.direction, CFG.detourM, side);
        const vias = [...best.vias, via]
          .map((v) => ({ v, pos: nearestOnLine(v, best.coords).index }))
          .sort((a, b) => a.pos - b.pos)
          .map((x) => x.v);
        const [route] = await fetchRoutes([A, ...vias, B]);
        return evaluate(route, vias);
      })
    );

    const valid = attempts
      .filter((a) => a.status === "fulfilled" && a.value.duration <= maxDuration)
      .map((a) => a.value);
    if (valid.length === 0) continue;

    const candidate = pickBest(valid);
    if (candidate.cost < best.cost) best = candidate;
  }

  const baselineIds = new Set(baseline.hazards.map((h) => h.id));
  const bestIds = new Set(best.hazards.map((h) => h.id));
  const avoided = baseline.hazards.filter((h) => !bestIds.has(h.id));

  let status;
  let message;
  if (best.hazards.length === 0 && baselineIds.size === 0) {
    status = "aman";
    message = "Rute tercepat tidak melewati jalan rusak";
  } else if (best.hazards.length === 0) {
    status = "dialihkan";
    message = `Rute dialihkan untuk menghindari ${avoided.length} titik jalan rusak`;
  } else if (avoided.length > 0) {
    status = "sebagian";
    message = `Rute dialihkan menghindari ${avoided.length} titik, tetapi masih melewati ${best.hazards.length} titik jalan rusak`;
  } else {
    status = "tidak_terhindarkan";
    message = "Tidak ditemukan jalur alternatif yang wajar; rute masih melewati jalan rusak";
  }

  return {
    status,
    message,
    route: publicRoute(best),
    baseline: publicRoute(baseline),
    avoided: avoided.map(({ position, weight, ...h }) => h),
  };
};

// Laporan aktif untuk ditampilkan di peta (GeoJSON FeatureCollection).
export const getActiveHazardsGeoJSON = async (bbox) => {
  const filter = { status: { $in: CFG.statuses }, "location.coordinates.0": { $exists: true } };
  if (bbox) {
    const [w, s, e, n] = bbox;
    filter.location = {
      $geoWithin: { $geometry: { type: "Polygon", coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] } },
    };
  }
  const reports = await Report.find(filter)
    .select("title severity status address location")
    .limit(1000)
    .lean();

  return {
    type: "FeatureCollection",
    features: reports.map((r) => ({
      type: "Feature",
      geometry: r.location,
      properties: {
        id: r._id.toString(),
        title: r.title,
        address: r.address,
        severity: r.severity,
        status: r.status,
      },
    })),
  };
};