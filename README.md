# Maroom Studio

Studio pembuat video animasi vertikal (9:16): tokoh kartun 2D di dunia 3D, narasi teks kata-demi-kata. Mobile-first, UI mengikuti referensi "Moments".

- **Wizard 6 langkah**: cara (tulis sendiri / bantu AI) → naskah → gaya → tokoh → episode → pratinjau & simpan.
- **Episode**: dikelompokkan per seri, bisa diubah, dihapus, dan diekspor ke `.webm` langsung dari browser.
- **Contoh gaya**: Ngarai 1880, Kota Senja, Ngarai Fajar (lihat contoh sebelum dipakai).
- **Statistik**: grafik episode per gaya (minggu/bulan/tahun).

Situs statis tanpa build. Jalankan lokal: `python3 -m http.server 8765` lalu buka `http://localhost:8765`. Tanpa konfigurasi, aplikasi berjalan di **mode lokal** (data di `localStorage`).

## Menyambungkan Supabase ("Maroom-Studio")
1. SQL Editor: jalankan `supabase/schema.sql` (tabel `series`, `episodes`, plus RLS).
2. Authentication: aktifkan provider Email.
3. Isi `config.js` dengan Project URL dan anon key (Project Settings → API). Jangan pakai service_role.
4. AI naskah (opsional): `supabase secrets set ANTHROPIC_API_KEY=...` lalu `supabase functions deploy ai-script`. Tanpa ini, tombol "Buatkan naskah" memakai kerangka otomatis.

## Berkas
`index.html`, `css/app.css`, `js/app.js` (layar + wizard + data), `js/studio.js` (mesin animasi WebGL2), `supabase/`.

## Batasan
- Belum ada suara narasi; ekspor berupa video tanpa audio.
- Ekspor merekam secara real-time (video 20 detik = 20 detik), butuh browser dengan WebGL2 dan MediaRecorder.
