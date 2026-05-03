# Panduan Edit Code untuk AI (Konsisten Output)

Dokumen ini berisi aturan dan pola kerja agar hasil prompt dan perubahan kode tetap konsisten.

## 1) Tujuan & Ruang Lingkup
- Fokus: perubahan kode yang rapi, teruji, dan konsisten dengan style proyek.
- Jangan mengubah arsitektur besar tanpa persetujuan.
- Hindari perubahan UI yang tidak diminta.

## 2) Format Permintaan (Prompt)
Gunakan format singkat dan spesifik:
- Tujuan: apa yang ingin dicapai.
- Lokasi: file/komponen yang relevan.
- Batasan: hal yang tidak boleh diubah.
- Output: apa yang diharapkan (UI/logic/endpoint/test).

Contoh:
"Tambah validasi email di form login. Ubah hanya [src/pages/LoginPage.tsx]. Jangan ubah style. Sertakan test bila ada." 

## 3) Aturan Perubahan
- Perubahan sekecil mungkin untuk mencapai tujuan.
- Jangan hapus fitur eksisting tanpa konfirmasi.
- Jangan mengubah dependency tanpa izin.
- Pertahankan naming, struktur folder, dan pattern yang sudah ada.

## 4) Konsistensi Kode
- Ikuti style dan pola komponen yang sudah dipakai di proyek.
- Gunakan TypeScript typing yang jelas.
- Hindari util baru jika ada fungsi serupa.
- Tambahkan komentar hanya jika logika kompleks.
- Untuk halaman baru, samakan spacing dengan halaman yang sejenis (mis. login/register).

## 5) Checklist Sebelum Selesai
- Apakah semua perubahan sesuai batasan?
- Apakah ada efek samping pada fitur lain?
- Apakah build/lint/test perlu dijalankan?
- Apakah ada file yang perlu di-update (docs/README)?

## 6) Extensions yang Direkomendasikan (TypeScript)
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Language Features (built-in VS Code)

## 7) Format Jawaban AI
- Jelaskan perubahan secara singkat.
- Tampilkan file yang diubah.
- Beri saran langkah berikutnya jika perlu (test/build).

## 8) Jika Permintaan Kurang Jelas
AI harus bertanya dulu sebelum mengubah kode.

---

Jika ingin menambahkan aturan proyek spesifik (misalnya: format commit, standar API, atau pattern state management), tambahkan ke bagian ini.
