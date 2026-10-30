# PantauJalan Backend

REST API untuk aplikasi **PantauJalan**. Backend menangani autentikasi dan otorisasi pengguna, pengelolaan laporan kerusakan fasilitas umum, dokumentasi progres perbaikan, statistik laporan, serta pencarian rute yang mempertimbangkan titik kerusakan jalan.

## Teknologi

- Node.js (ES Modules) dan Express 5
- MongoDB dengan Mongoose
- JWT dan bcryptjs untuk autentikasi
- Multer untuk menerima file upload
- Cloudinary untuk penyimpanan media
- OSRM dan OpenStreetMap untuk perhitungan rute

## Persyaratan

- Node.js versi 18 atau lebih baru
- MongoDB lokal atau MongoDB Atlas
- Akun Cloudinary untuk penyimpanan gambar
- Koneksi internet untuk layanan geocoding/routing eksternal

## Menjalankan secara lokal

1. Masuk ke direktori backend:

   ```bash
   cd backend
   ```

2. Install dependency:

   ```bash
   npm install
   ```

3. Salin `.env.example` menjadi `.env`, lalu isi konfigurasi yang diperlukan.

   ```bash
   cp .env.example .env
   ```

4. Jalankan seed untuk membuat akun admin awal:

   ```bash
   npm run seed:admin
   ```

5. Jalankan server development:

   ```bash
   npm run dev
   ```

Server berjalan pada `http://localhost:5000` secara default. Untuk menjalankan tanpa nodemon:

```bash
npm start
```

Endpoint `GET /` dapat digunakan untuk memeriksa apakah API aktif.

## Konfigurasi environment

| Variabel                      |          Wajib | Keterangan                                                     |
| ----------------------------- | -------------: | -------------------------------------------------------------- |
| `PORT`                        |          Tidak | Port server. Default `5000`.                                   |
| `MONGO_URI`                   |             Ya | Connection string MongoDB.                                     |
| `BASE_URL`                    |          Tidak | Base URL backend, jika diperlukan oleh proses aplikasi.        |
| `JWT_SECRET`                  |             Ya | Secret untuk menandatangani JWT. Gunakan nilai acak yang kuat. |
| `JWT_EXPIRES_IN`              |          Tidak | Masa berlaku token, contoh `7d`.                               |
| `ADMIN_NAME`                  |     Untuk seed | Nama akun admin awal.                                          |
| `ADMIN_EMAIL`                 |     Untuk seed | Email akun admin awal.                                         |
| `ADMIN_PASSWORD`              |     Untuk seed | Password akun admin awal. Ganti setelah deployment.            |
| `CLOUDINARY_CLOUD_NAME`       | Ya untuk media | Cloud name Cloudinary.                                         |
| `CLOUDINARY_API_KEY`          | Ya untuk media | API key Cloudinary.                                            |
| `CLOUDINARY_API_SECRET`       | Ya untuk media | API secret Cloudinary.                                         |
| `OSRM_URL`                    |          Tidak | URL server OSRM utama.                                         |
| `OSRM_PROFILE`                |          Tidak | Profil OSRM utama.                                             |
| `OSRM_FOOT_URL`               |          Tidak | URL OSRM untuk rute pejalan kaki.                              |
| `OSRM_FOOT_PROFILE`           |          Tidak | Profil OSRM pejalan kaki.                                      |
| `OSRM_TIMEOUT_MS`             |          Tidak | Batas waktu request ke OSRM.                                   |
| `ROUTING_BLOCK_STATUSES`      |          Tidak | Status laporan yang menjadi penghalang rute.                   |
| `ROUTING_BUFFER_METERS`       |          Tidak | Jarak buffer rute terhadap titik kerusakan.                    |
| `ROUTING_DETOUR_METERS`       |          Tidak | Jarak titik pengalihan dari lokasi kerusakan.                  |
| `ROUTING_MAX_ITER`            |          Tidak | Batas iterasi pencarian rute alternatif.                       |
| `ROUTING_PENALTY_SEC`         |          Tidak | Penalti waktu untuk titik kerusakan.                           |
| `ROUTING_MAX_DETOUR_FACTOR`   |          Tidak | Batas faktor panjang rute alternatif.                          |
| `ROUTING_PASSABLE_MOBIL`      |          Tidak | Tingkat kerusakan yang masih dapat dilewati mobil.             |
| `ROUTING_PASSABLE_MOTOR`      |          Tidak | Tingkat kerusakan yang masih dapat dilewati motor.             |
| `ROUTING_PASSABLE_JALAN_KAKI` |          Tidak | Tingkat kerusakan yang masih dapat dilewati pejalan kaki.      |

Nilai default konfigurasi routing dan contoh formatnya tersedia di `.env.example`. Server OSRM publik hanya cocok untuk pengujian; untuk penggunaan produksi, siapkan layanan OSRM sendiri dan sesuaikan profil kendaraannya. OSRM standar tidak menyediakan profil motor khusus, sehingga konfigurasi motor dapat menggunakan profil driving.

## Role dan hak akses

| Role         | Hak akses utama                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `masyarakat` | Registrasi/login, melihat laporan publik, membuat laporan, serta mengubah atau menghapus laporan miliknya sesuai aturan akses. |
| `petugas`    | Mengelola laporan dan mencatat progres perbaikan.                                                                              |
| `admin`      | Hak petugas serta pengelolaan pengguna dan role.                                                                               |

Endpoint yang membutuhkan autentikasi menggunakan header:

```http
Authorization: Bearer <TOKEN>
```

## Struktur direktori

```text
backend/
├── src/
│   ├── config/          # Koneksi MongoDB dan konfigurasi Cloudinary
│   ├── controllers/     # Handler request dan response
│   ├── middlewares/     # Autentikasi, otorisasi, upload, error handler
│   ├── models/          # Schema User, Report, RepairProgress
│   ├── routes/          # Definisi endpoint API
│   ├── seeds/           # Data awal, termasuk akun admin
│   ├── services/        # Geocoding, OSRM, dan safe routing
│   ├── utils/           # Helper, formatter, validasi status, dan utilitas
│   ├── app.js           # Konfigurasi Express dan registrasi route
│   └── server.js        # Entry point server
├── uploads/             # Direktori lokal untuk kebutuhan upload sementara
├── .env.example
└── package.json
```

## API

Base URL lokal: `http://localhost:5000`

### Health check

| Method | Endpoint | Akses  | Keterangan            |
| ------ | -------- | ------ | --------------------- |
| `GET`  | `/`      | Publik | Memeriksa status API. |

### Authentication — `/api/auth`

| Method  | Endpoint    | Akses  | Keterangan                                     |
| ------- | ----------- | ------ | ---------------------------------------------- |
| `POST`  | `/register` | Publik | Registrasi akun masyarakat.                    |
| `POST`  | `/login`    | Publik | Login dan memperoleh token.                    |
| `GET`   | `/me`       | Login  | Mendapatkan profil pengguna yang sedang login. |
| `PATCH` | `/me`       | Login  | Memperbarui profil sendiri.                    |

### Reports — `/api/reports`

| Method   | Endpoint   | Akses                           | Keterangan                                        |
| -------- | ---------- | ------------------------------- | ------------------------------------------------- |
| `GET`    | `/`        | Publik                          | Daftar laporan dengan dukungan filter/pagination. |
| `GET`    | `/summary` | Publik                          | Ringkasan statistik laporan.                      |
| `GET`    | `/:id`     | Publik                          | Detail laporan.                                   |
| `POST`   | `/`        | Publik sesuai aturan controller | Membuat laporan.                                  |
| `PUT`    | `/:id`     | Login                           | Memperbarui laporan sesuai hak akses.             |
| `DELETE` | `/:id`     | Login                           | Menghapus laporan sesuai hak akses.               |

Query daftar laporan dapat mencakup `page`, `limit`, `search`, `status`, `severity`, `type`, `order`, dan parameter filter lain yang didukung controller. Periksa implementasi `report.controller.js` untuk daftar parameter serta format response terkini.

Pembuatan laporan menggunakan `multipart/form-data`. Field gambar bernama `images`; unggah maksimal 5 file. `latitude` dan `longitude` diperlukan untuk menyimpan lokasi laporan. File media disimpan melalui Cloudinary ketika kredensialnya tersedia.

### Repair progress — `/api/reports` dan `/api/progress`

| Method   | Endpoint                          | Akses         | Keterangan                      |
| -------- | --------------------------------- | ------------- | ------------------------------- |
| `GET`    | `/api/reports/:reportId/progress` | Publik        | Timeline progres suatu laporan. |
| `GET`    | `/api/progress/:id`               | Publik        | Detail satu progres.            |
| `POST`   | `/api/reports/:reportId/progress` | Admin/Petugas | Menambahkan progres perbaikan.  |
| `PUT`    | `/api/progress/:id`               | Admin/Petugas | Memperbarui progres.            |
| `DELETE` | `/api/progress/:id`               | Admin/Petugas | Menghapus progres.              |

Request create/update progres menggunakan `multipart/form-data`. Progres harus menyertakan foto bukti (minimal 1 dan maksimal 5 pada proses pembuatan). Field `removeImages` dapat digunakan pada proses update untuk menghapus foto lama.

Status progres:

- `direncanakan`
- `dikerjakan`
- `selesai`

Status laporan disinkronkan berdasarkan progres:

1. Progres `dikerjakan` pada laporan `menunggu` atau `diverifikasi` akan mengubah laporan menjadi `diproses`.
2. Jika terdapat progres `selesai`, status laporan menjadi `selesai`.
3. Jika progres `selesai` diubah atau dihapus sehingga tidak ada progres selesai, laporan dapat kembali menjadi `diproses`.
4. Laporan `ditolak` tidak dapat diproses melalui progres.
5. Laporan `selesai` tidak dapat ditambahkan progres baru sebelum progres selesai yang ada diubah atau dihapus.

### Routing — `/api/routes`

| Method | Endpoint   | Akses  | Keterangan                                               |
| ------ | ---------- | ------ | -------------------------------------------------------- |
| `GET`  | `/hazards` | Publik | Mengambil titik kerusakan dalam format GeoJSON.          |
| `POST` | `/safe`    | Publik | Menghitung rute dengan mempertimbangkan titik kerusakan. |

Contoh request `POST /api/routes/safe`:

```json
{
  "origin": {
    "lat": 3.5952,
    "lng": 98.6722
  },
  "destination": {
    "lat": 3.5833,
    "lng": 98.6667
  },
  "vehicle": "motor"
}
```

Pilihan `vehicle`: `mobil`, `motor`, atau `jalan_kaki`. Jika tidak dikirim, backend menggunakan `mobil`.

Endpoint hazards mendukung parameter bounding box opsional: `minLng`, `minLat`, `maxLng`, dan `maxLat`.

Secara default, laporan dengan tingkat kerusakan `ringan` dapat tetap dilewati motor dan pejalan kaki, sedangkan mobil menghindari semua tingkat kerusakan. Aturan aktual dapat disesuaikan melalui environment routing. Periksa `route.controller.js` dan service routing untuk detail algoritma dan response rute.

### Users — `/api/users`

Seluruh endpoint berikut hanya dapat diakses oleh admin.

| Method   | Endpoint    | Keterangan                 |
| -------- | ----------- | -------------------------- |
| `GET`    | `/`         | Daftar pengguna.           |
| `GET`    | `/:id`      | Detail pengguna.           |
| `PATCH`  | `/:id`      | Memperbarui data pengguna. |
| `PATCH`  | `/:id/role` | Mengubah role pengguna.    |
| `DELETE` | `/:id`      | Menghapus pengguna.        |

## Status dan kategori data

**Status laporan:** `menunggu`, `diverifikasi`, `diproses`, `selesai`, `ditolak`.

**Severity:** `ringan`, `sedang`, `berat`.

**Jenis laporan:** `jalan`, `lampu-jalan`, `trotoar`, `halte`, `taman`, `lainnya`.
