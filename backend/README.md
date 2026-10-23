# PantauJalan Backend

Backend untuk pelaporan jalan rusak. Berisi auth dengan role, CRUD laporan, upload gambar lokal, pagination, progres perbaikan jalan dengan foto bukti, serta rute aman yang menghindari jalan rusak (OpenStreetMap dan OSRM).

## Persyaratan

1. Node.js 18 ke atas
2. MongoDB berjalan lokal (tanpa Docker) atau MongoDB Atlas

## Instalasi

1. Jalankan npm install
2. Periksa file .env, sesuaikan MONGO_URI dan ganti JWT_SECRET untuk produksi
   (file .env di zip ini sudah berisi secret acak untuk development, .env.example sebagai contoh)
3. Jalankan npm run seed:admin untuk membuat akun admin pertama
4. Jalankan npm run dev

Server berjalan di http://localhost:5000

## Role

1. masyarakat: register sendiri, membuat laporan, mengubah dan menghapus laporan miliknya
2. petugas: mengelola semua laporan, mengubah status, dan mencatat progres perbaikan
3. admin: semua hak petugas, ditambah mengelola user dan role

## Endpoint

Auth
1. POST /api/auth/register
2. POST /api/auth/login
3. GET /api/auth/me (perlu token)

Laporan
1. GET /api/reports (publik, query: page, limit, search, status, severity, order)
2. GET /api/reports/:id (publik)
3. POST /api/reports (perlu token, form data, field images maksimal 5 file; latitude dan longitude WAJIB, dikirim dari FE)
4. PUT /api/reports/:id (perlu token, pemilik atau staf)
5. DELETE /api/reports/:id (perlu token, pemilik atau staf; progres dan fotonya ikut terhapus)

Status laporan "selesai" tidak bisa diatur manual lewat PUT /api/reports/:id. Statusnya otomatis dari progres perbaikan (lihat di bawah).

Progres perbaikan jalan (setiap progres wajib memiliki foto bukti, minimal 1 dan maksimal 5)
1. GET /api/reports/:reportId/progress (publik, timeline dari yang terlama)
2. POST /api/reports/:reportId/progress (admin/petugas, form data: title wajib, description, status, images wajib)
3. GET /api/progress/:id (publik)
4. PUT /api/progress/:id (admin/petugas, form data: title, description, status, removeImages, images)
5. DELETE /api/progress/:id (admin/petugas)

Status progres: direncanakan, dikerjakan (default), selesai. Sinkron otomatis ke status laporan:
1. Progres "dikerjakan" pada laporan menunggu/diverifikasi -> laporan menjadi "diproses"
2. Progres "selesai" -> laporan menjadi "selesai"
3. Progres "selesai" diubah atau dihapus -> laporan kembali "diproses"
4. Laporan "ditolak" tidak bisa diberi progres. Laporan "selesai" tidak bisa ditambah progres baru
   (ubah atau hapus progres "selesai" dahulu untuk membuka kembali)

Rute dan titik rusak (publik)
1. GET /api/routes/hazards (query bbox opsional: minLng,minLat,maxLng,maxLat) -> GeoJSON titik rusak berstatus "diproses"
2. POST /api/routes/safe -> body: origin {lat,lng}, destination {lat,lng}, vehicle (mobil | motor | jalan_kaki, default mobil)

Aturan kendaraan: kerusakan "ringan" masih bisa dilewati motor dan pejalan kaki (tidak memicu pengalihan,
dilaporkan di route.passableHazards), sedangkan mobil menghindari semua tingkat kerusakan.
Pejalan kaki memakai server OSRM profil foot (OSRM_FOOT_URL). Semua nilai bisa diatur lewat .env, lihat .env.example.

User (khusus admin)
1. GET /api/users
2. PATCH /api/users/:id/role

Header token: Authorization: Bearer TOKEN
