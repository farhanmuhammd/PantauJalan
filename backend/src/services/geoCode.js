// Reverse geocoding: koordinat -> alamat, memakai Nominatim (OpenStreetMap).
//
// Kebijakan server publik Nominatim (https://operations.osmfoundation.org/policies/nominatim/):
//  - maksimal 1 permintaan per detik (diatur oleh antrean di bawah),
//  - wajib memakai User-Agent yang mengenali aplikasi Anda (isi NOMINATIM_USER_AGENT, sertakan email kontak),
//  - tidak untuk pemakaian berat. Untuk trafik besar, jalankan Nominatim sendiri dan isi NOMINATIM_URL.

const BASE_URL = (process.env.NOMINATIM_URL || "https://nominatim.openstreetmap.org").replace(/\/$/, "");
const USER_AGENT = process.env.NOMINATIM_USER_AGENT || "PantauJalan/1.0 (backend pelaporan jalan rusak)";
const TIMEOUT_MS = Number(process.env.NOMINATIM_TIMEOUT_MS) || 4000;
const MIN_GAP_MS = 1100;
const CACHE_MAX = 500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Antrean agar tidak lebih dari 1 permintaan per detik. Hasil dikembalikan segera;
// jeda hanya berlaku untuk permintaan berikutnya.
let chain = Promise.resolve();
const throttled = (fn) => {
  const result = chain.then(fn);
  chain = result.then(
    () => sleep(MIN_GAP_MS),
    () => sleep(MIN_GAP_MS)
  );
  return result;
};

// Cache sederhana: koordinat dibulatkan 5 desimal (~1 m). Hanya hasil yang berhasil yang disimpan.
const cache = new Map();
const cacheKey = (lat, lng) => `${lat.toFixed(5)},${lng.toFixed(5)}`;

const first = (...values) => values.find((v) => typeof v === "string" && v.trim() !== "");

/** Susun alamat singkat dari komponen Nominatim, mis. "Jalan Sunggal, Sei Sikambing B, Medan Sunggal, Medan, Sumatera Utara". */
export const formatAddress = (data) => {
  const a = data?.address;
  if (a) {
    const parts = [
      first(a.road, a.pedestrian, a.footway, a.path),
      first(a.neighbourhood, a.quarter, a.suburb, a.village, a.hamlet),
      first(a.city_district, a.municipality, a.district),
      first(a.city, a.town, a.county, a.regency),
      a.state,
    ].filter(Boolean);
    const unique = parts.filter((p, i) => p !== parts[i - 1]);
    if (unique.length > 0) return unique.join(", ");
  }
  return first(data?.display_name) ?? null;
};

/** Alamat dari koordinat, atau null jika gagal (jaringan, timeout, lokasi tidak dikenal). Tidak pernah melempar error. */
export const reverseGeocode = async (lat, lng) => {
  const key = cacheKey(lat, lng);
  if (cache.has(key)) return cache.get(key);

  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(lat),
    lon: String(lng),
    zoom: "18",
    addressdetails: "1",
    "accept-language": "id",
  });
  const url = `${BASE_URL}/reverse?${params}`;

  try {
    const data = await throttled(async () => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
        });
        if (!res.ok) return null;
        return await res.json();
      } finally {
        clearTimeout(timer);
      }
    });
    if (!data || data.error) return null;

    const address = formatAddress(data);
    if (address) {
      if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value);
      cache.set(key, address);
    }
    return address;
  } catch (err) {
    console.warn("[geocode] reverse geocoding gagal:", err.message);
    return null;
  }
};

/** Alamat untuk disimpan di laporan. Jika geocoding gagal, pakai teks koordinat agar laporan tetap bisa dibuat. */
export const resolveAddress = async (lat, lng) =>
  (await reverseGeocode(lat, lng)) ?? `Koordinat ${lat.toFixed(5)}, ${lng.toFixed(5)}`;