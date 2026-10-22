// Klien OSRM (Open Source Routing Machine) di atas data OpenStreetMap.
//
// PENTING: server publik https://router.project-osrm.org hanya untuk demo/pengembangan
// (profil mobil saja, ada pembatasan pemakaian). Untuk produksi, jalankan OSRM sendiri
// dengan data OSM Indonesia/Sumatera lalu isi OSRM_URL di .env.

const BASE_URL = (process.env.OSRM_URL || "https://router.project-osrm.org").replace(/\/$/, "");
const PROFILE = process.env.OSRM_PROFILE || "driving";
const TIMEOUT_MS = Number(process.env.OSRM_TIMEOUT_MS) || 10000;

export class RoutingError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "RoutingError";
    this.statusCode = statusCode;
  }
}

/**
 * Ambil rute dari OSRM.
 * @param {Array<[number, number]>} points daftar [lng, lat]: asal, (via...), tujuan
 * @param {{alternatives?: boolean}} opts alternatif hanya didukung untuk 2 titik
 * @returns {Promise<Array>} array rute OSRM (geometry GeoJSON, distance m, duration detik)
 */
export const fetchRoutes = async (points, { alternatives = false } = {}) => {
  const coords = points.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const params = new URLSearchParams({
    overview: "full",
    geometries: "geojson",
    steps: "false",
    alternatives: alternatives && points.length === 2 ? "3" : "false",
  });
  const url = `${BASE_URL}/route/v1/${PROFILE}/${coords}?${params}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, { signal: controller.signal, headers: { "User-Agent": "pantau-jalan/1.0" } });
  } catch (e) {
    throw new RoutingError(
      e.name === "AbortError"
        ? "Server routing (OSRM) tidak merespons"
        : "Tidak dapat menghubungi server routing (OSRM)",
      502
    );
  } finally {
    clearTimeout(timer);
  }

  const data = await res.json().catch(() => null);
  if (data?.code === "NoRoute") throw new RoutingError("Rute tidak ditemukan di antara kedua titik", 404);
  if (data?.code === "NoSegment") {
    throw new RoutingError("Salah satu titik terlalu jauh dari jalan yang dikenal", 422);
  }
  if (!res.ok || data?.code !== "Ok" || !data.routes?.length) {
    throw new RoutingError(`Server routing mengembalikan error: ${data?.code || res.status}`, 502);
  }
  return data.routes;
};