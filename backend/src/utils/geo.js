// Utilitas geometri. Semua koordinat memakai format GeoJSON: [lng, lat].
const EARTH_R = 6371000;
const toRad = (d) => (d * Math.PI) / 180;

// Konversi derajat -> meter di sekitar lintang tertentu (proyeksi equirectangular lokal,
// cukup akurat untuk jarak puluhan-ratusan meter).
const metersPerDegree = (lat) => ({
  kx: ((EARTH_R * Math.PI) / 180) * Math.cos(toRad(lat)),
  ky: (EARTH_R * Math.PI) / 180,
});

/**
 * Titik terdekat pada polyline terhadap sebuah titik.
 * Mengembalikan jarak (meter), indeks pecahan sepanjang garis (untuk mengurutkan),
 * titik terdekat, dan vektor arah segmen (dalam meter, [timur, utara]).
 */
export const nearestOnLine = (point, line) => {
  const { kx, ky } = metersPerDegree(point[1]);
  let best = { distance: Infinity, index: 0, point: line[0], direction: [1, 0] };

  for (let i = 0; i < line.length - 1; i++) {
    const a = line[i];
    const b = line[i + 1];
    const ax = (a[0] - point[0]) * kx;
    const ay = (a[1] - point[1]) * ky;
    const bx = (b[0] - point[0]) * kx;
    const by = (b[1] - point[1]) * ky;
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2));
    const dist = Math.hypot(ax + t * dx, ay + t * dy);

    if (dist < best.distance) {
      best = {
        distance: dist,
        index: i + t,
        point: [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])],
        direction: [dx, dy],
      };
    }
  }
  return best;
};

/** Geser titik tegak lurus terhadap arah (side: 1 = kiri, -1 = kanan). */
export const offsetPerpendicular = (point, direction, meters, side = 1) => {
  const len = Math.hypot(direction[0], direction[1]) || 1;
  const nx = (-direction[1] / len) * side;
  const ny = (direction[0] / len) * side;
  const { kx, ky } = metersPerDegree(point[1]);
  return [point[0] + (nx * meters) / kx, point[1] + (ny * meters) / ky];
};

/** Polygon GeoJSON (kotak) yang membungkus polyline + padding dalam meter. */
export const bboxPolygon = (line, padMeters = 0) => {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
  for (const [lng, lat] of line) {
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  }
  const { kx, ky } = metersPerDegree((minLat + maxLat) / 2);
  const padLng = padMeters / kx;
  const padLat = padMeters / ky;
  const w = minLng - padLng, e = maxLng + padLng, s = minLat - padLat, n = maxLat + padLat;
  return {
    type: "Polygon",
    coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]],
  };
};