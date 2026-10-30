# Paguyuban Batara Parkview Blok K & L
Desa Cikasungka, Solear, Kabupaten Tangerang, Banten

Penjelasan struktur kode, fungsi tiap file, dan hubungan antar file.

## 1. Gambaran umum

Aplikasi web berbasis **Next.js (App Router) + React 19 + Tailwind CSS 4**, dengan **Supabase** sebagai database dan penyimpanan file.

- **Halaman publik (`/`)**: warga melihat pengumuman berjalan (running text), buletin kegiatan, surat RT aktif (PDF), dan susunan pengurus.
- **Halaman admin (`/admin`)**: pengurus login lalu mengelola (tambah/ubah/hapus) surat, pengumuman, buletin, dan pengurus. Sesi login (token) berlaku 2 jam.

Alur data singkat:

```
Browser -> app/page.tsx -> lib/data.ts -> Supabase (baca publik, anon key)
Browser -> /admin -> lib/auth.ts (cek token) -> lib/data.ts (baca, service key)
Form admin -> lib/actions/content.ts (server action) -> Supabase DB + Storage
```

## 2. Nama & lokasi (tempat yang diubah)

| File | Isi yang diubah |
|---|---|
| `app/layout.tsx` | `title` tab browser + `description` (SEO) |
| `app/admin/page.tsx`, `app/admin/login/page.tsx` | judul tab halaman admin & login |
| `components/home/site-header.tsx` | nama + lokasi di header publik |
| `components/home/hero-section.tsx` | judul besar + baris lokasi |
| `components/home/site-footer.tsx` | hak cipta + alamat |
| `components/admin/admin-header.tsx` | nama di header admin |
| `package.json` | nama paket |

## 3. Konfigurasi proyek (root)

| File | Fungsi |
|---|---|
| `package.json` | Daftar dependensi & script (`dev`, `build`, `start`). |
| `pnpm-lock.yaml`, `pnpm-workspace.yaml` | Mengunci versi paket (pnpm). |
| `next.config.mjs` | Konfigurasi Next.js: batas upload server action 6 MB, gambar tidak dioptimasi, header keamanan (HSTS, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options untuk `/admin`). |
| `tsconfig.json` | Aturan TypeScript + alias `@/` = root proyek. |
| `postcss.config.mjs` | Mengaktifkan Tailwind CSS 4. |
| `components.json` | Pengaturan shadcn/ui (lokasi komponen, alias, ikon lucide). |
| `.gitignore` | File yang tidak ikut Git (`.env*.local`, `node_modules`, `.next`). |

Variabel lingkungan (diatur di Vercel / `.env.local`): `SUPABASE_URL` (atau `NEXT_PUBLIC_SUPABASE_URL`), `SUPABASE_ANON_KEY` (atau `NEXT_PUBLIC_SUPABASE_ANON_KEY`), `SUPABASE_SERVICE_ROLE_KEY`.

## 4. Folder `app/` (halaman)

| File | Fungsi | Berhubungan dengan |
|---|---|---|
| `layout.tsx` | Kerangka semua halaman: font Plus Jakarta Sans, metadata (judul, favicon, warna tema), bahasa `id`, Vercel Analytics (hanya production). | `globals.css`, folder `public/` (ikon) |
| `globals.css` | Warna tema (hijau + kuning), radius, animasi running text (`marquee`, berhenti saat disentuh/hover). | dipakai semua komponen via Tailwind |
| `page.tsx` | Halaman publik. Mengambil data (pengumuman aktif, 6 buletin terbaru, 5 surat aktif, pengurus) lalu menyusun komponen `components/home/*`. `force-dynamic` = selalu data terbaru. | `lib/supabase/server-clients.ts`, `lib/data.ts`, semua `components/home/*` |
| `admin/page.tsx` | Dashboard admin. `requireAdmin()` menolak yang belum login. Memuat semua data (termasuk non-aktif) dan menampilkannya dalam 5 tab. | `lib/auth.ts`, `lib/data.ts`, `components/admin/*` |
| `admin/login/page.tsx` | Halaman login. Jika sudah login langsung diarahkan ke `/admin`. Menampilkan pesan "logout" / "sesi berakhir". | `lib/auth.ts`, `login-form.tsx` |

## 5. Folder `lib/` (logika & data)

| File | Fungsi | Berhubungan dengan |
|---|---|---|
| `supabase/server-clients.ts` | Membuat 2 koneksi Supabase: **admin** (service role, melewati RLS, hanya di server) dan **publik** (anon key, mengikuti RLS). Nama bucket penyimpanan: `rt-files`. | dipakai `auth.ts`, `data.ts`, `actions/*`, `page.tsx` |
| `data.ts` | Tipe data (`Announcement`, `Bulletin`, `Letter`, `Officer`), fungsi baca tabel (`fetchAnnouncements`, `fetchBulletins`, `fetchLetters`, `fetchOfficers`), dan `formatDate` (format tanggal Indonesia). | dipakai halaman publik & admin |
| `auth.ts` | Sesi admin: membuat token acak, menyimpan **hash SHA-256**-nya di tabel `admin_sessions`, menaruh token di cookie `rt_admin_token` (httpOnly, 2 jam). Fungsi: `createSession`, `getSession`, `requireAdmin`, `destroySession`. | `actions/auth.ts`, `admin/page.tsx`, `login/page.tsx`, `actions/content.ts` |
| `actions/auth.ts` | Server action `loginAction` (cek username/password lewat fungsi database `verify_admin_password`, lalu buat sesi) dan `logoutAction` (cabut sesi). | `login-form.tsx`, `admin-header.tsx` |
| `actions/content.ts` | Server action CRUD: `saveLetter/deleteLetter`, `saveAnnouncement/deleteAnnouncement`, `saveBulletin/deleteBulletin`, `saveOfficer/deleteOfficer`. Setiap aksi: cek admin -> validasi input & file -> tulis DB/Storage -> `revalidatePath` agar halaman publik terbarui. File lama otomatis dihapus saat diganti/dihapus. | `upload-rules.ts`, `auth.ts`, semua `*-manager.tsx` |
| `upload-rules.ts` | Aturan upload: PDF maks 5 MB, gambar PNG/JPG maks 2 MB, maks 2 foto per buletin, daftar perihal surat (Pengumuman, Himbauan, Notulen Rapat, Pemberitahuan). | `actions/content.ts`, form admin |
| `utils.ts` | Fungsi `cn()` untuk menggabungkan class Tailwind. | komponen UI |

## 6. Folder `components/home/` (tampilan publik)

| File | Fungsi |
|---|---|
| `running-text.tsx` | Bar pengumuman berjalan di paling atas (hilang jika tidak ada pengumuman aktif). Kecepatan menyesuaikan panjang teks. |
| `site-header.tsx` | Header lengket (sticky): logo, nama paguyuban, menu #buletin, #surat, #pengurus. |
| `hero-section.tsx` | Banner utama dengan gambar `public/images/hero-rt.png` dan teks sambutan. |
| `section-heading.tsx` | Judul seksi yang dipakai ulang (label kecil, judul, deskripsi). |
| `bulletin-section.tsx` | Kartu buletin kegiatan (foto 0-2, tanggal, judul, keterangan). |
| `letters-section.tsx` | Daftar surat aktif + tombol "Lihat PDF". |
| `officers-section.tsx` | Kartu pengurus (foto atau inisial, jabatan, nomor HP yang bisa diklik untuk telepon). |
| `site-footer.tsx` | Footer + tautan "Login Admin". |

## 7. Folder `components/admin/` (tampilan admin)

| File | Fungsi |
|---|---|
| `login-form.tsx` | Form username/password, memanggil `loginAction`, menampilkan error. |
| `admin-header.tsx` | Header admin: nama pengguna, penghitung sesi, tombol logout. |
| `session-timer.tsx` | Hitung mundur sisa sesi; saat habis otomatis ke halaman login. |
| `admin-tabs.tsx` | Lima tab: Surat RT, Pengumuman, Buletin, Pengurus, Panduan Upload. |
| `manager-shell.tsx` | Kerangka tata letak bersama: `ManagerShell` (form tambah di kiri, daftar di kanan), `ItemCard` (kartu + panel Edit), `EmptyState`. |
| `action-form.tsx` | Pembungkus form generik: memanggil server action, status loading, pesan sukses/gagal, konfirmasi hapus. |
| `fields.tsx` | Input siap pakai: `TextField`, `TextAreaField`, `SelectField`, `CheckboxField`. |
| `letters-manager.tsx` | Kelola surat (-> `saveLetter`, `deleteLetter`). |
| `announcements-manager.tsx` | Kelola pengumuman (-> `saveAnnouncement`, `deleteAnnouncement`). |
| `bulletins-manager.tsx` | Kelola buletin + foto (-> `saveBulletin`, `deleteBulletin`). |
| `officers-manager.tsx` | Kelola pengurus + urutan + foto (-> `saveOfficer`, `deleteOfficer`). |
| `upload-guide.tsx` | Tab panduan format & ukuran file. |

Pola yang berulang: `*-manager.tsx` -> memakai `ManagerShell` + `ItemCard` + `ActionForm` + `fields` -> memanggil fungsi di `lib/actions/content.ts`.

## 8. Folder `components/ui/` (komponen dasar shadcn/ui)

`button`, `badge`, `card`, `checkbox`, `input`, `label`, `select`, `table`, `tabs`, `textarea`: komponen kecil siap pakai (berbasis `@base-ui/react`) yang dipakai komponen admin dan halaman login. Tidak perlu diubah kecuali ingin mengganti gaya dasar.

## 9. Folder `public/` (aset statis)

- `images/hero-rt.png`: gambar banner halaman depan (ganti file ini untuk mengganti gambar).
- `icon.svg`, `icon-light-32x32.png`, `icon-dark-32x32.png`, `apple-icon.png`: favicon (dirujuk di `app/layout.tsx`).
- `placeholder*`: gambar cadangan.

## 10. Tabel & bucket Supabase yang dipakai kode

`announcements`, `bulletins`, `letters`, `officers`, `admins`, `admin_sessions`, fungsi SQL `verify_admin_password`, dan bucket storage `rt-files`.
