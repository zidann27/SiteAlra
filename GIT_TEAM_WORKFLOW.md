# Git Workflow Tim (3 Orang)

Repo: https://github.com/AgnanToro/SiteAlra

## Aturan Inti
- Jangan push langsung ke `main`.
- Kerja pakai branch masing-masing.
- Merge ke `main` lewat Pull Request (PR).

## Setup Awal (Sekali Saja)
```bash
git clone https://github.com/AgnanToro/SiteAlra.git
cd SiteAlra
git checkout main
git pull origin main
git checkout -b fitur-nama-kamu
```

Contoh branch: `fitur-agnan`, `fitur-budi`, `fitur-citra`.

## Cara Upload Perubahan
```bash
git status
git add .
git commit -m "feat: deskripsi perubahan"
git push -u origin fitur-nama-kamu
```

Lalu buka GitHub dan buat PR:
- from: `fitur-nama-kamu`
- to: `main`

## Cara Ambil Update Terbaru dari Teman
```bash
git checkout main
git pull origin main
git checkout fitur-nama-kamu
git merge main
```

## Kalau Ada Konflik
1. Buka file yang konflik.
2. Rapikan isi kodenya.
3. Lanjutkan:
```bash
git add .
git commit
```

## Rutinitas Harian (Singkat)
```bash
git checkout main
git pull origin main
git checkout fitur-nama-kamu
# ngoding...
git add .
git commit -m "feat/fix: ..."
git push
```
