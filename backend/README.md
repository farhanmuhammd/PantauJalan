# PantauJalan Backend

Backend untuk pelaporan jalan rusak. Tahap ini berisi auth dengan role, CRUD laporan, upload gambar lokal, pagination, dan responseFormatter. Belum memakai OSM dan OSRM.

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
2. petugas: mengelola semua laporan dan mengubah status
3. admin: semua hak petugas, ditambah mengelola user dan role

## Endpoint

Auth
1. POST /api/auth/register
2. POST /api/auth/login
3. GET /api/auth/me (perlu token)

Laporan
1. GET /api/reports (publik, query: page, limit, search, status, severity, order)
2. GET /api/reports/:id (publik)
3. POST /api/reports (perlu token, form data, field images maksimal 5 file)
4. PUT /api/reports/:id (perlu token, pemilik atau staf)
5. DELETE /api/reports/:id (perlu token, pemilik atau staf)

User (khusus admin)
1. GET /api/users
2. PATCH /api/users/:id/role

Header token: Authorization: Bearer TOKEN
