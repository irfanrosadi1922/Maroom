# Maroom Studio

Studio pembuat video animasi vertikal (9:16): tokoh kartun 2D di dunia 3D, narasi teks kata-demi-kata. Mobile-first, UI mengikuti referensi "Moments".

- **Wizard 6 langkah**: cara (tulis sendiri / bantu AI) → naskah → gaya → tokoh → episode → pratinjau & simpan.
- **Episode**: dikelompokkan per seri, bisa diubah, dihapus, dan diekspor ke `.webm` langsung dari browser.
- **Contoh gaya**: Ngarai 1880, Kota Senja, Ngarai Fajar (lihat contoh sebelum dipakai).
- **Statistik**: grafik episode per gaya (minggu/bulan/tahun).

Situs statis tanpa build. Jalankan lokal: `python3 -m http.server 8765` lalu buka `http://localhost:8765`. Tanpa konfigurasi, aplikasi berjalan di **mode lokal** (data di `localStorage`).

## Supabase ("Maroom", ap-southeast-1)
Sudah terpasang: tabel `series` dan `episodes` (RLS per pengguna), bucket privat `voice` untuk audio, dan edge function `ai-script` serta `tts`. `config.js` berisi URL dan kunci anon proyek. Untuk proyek baru: jalankan `supabase/schema.sql`, aktifkan login Email, deploy kedua fungsi, isi `config.js`.

**Secret yang wajib diisi** (Dashboard → Edge Functions → Secrets), tanpa ini fungsinya membalas error 500:
- `ELEVENLABS_API_KEY` untuk suara narasi (`tts`, model `eleven_multilingual_v2`, satu panggilan per kalimat, maks 300 karakter).
- `ANTHROPIC_API_KEY` untuk naskah AI (`ai-script`). Tanpa ini tombol "Buatkan naskah" memakai kerangka otomatis.

Suara dibuat di langkah Pratinjau, disimpan di bucket `voice` (`<user_id>/<episode_id>/<n>.mp3`), dan durasi adegan mengikuti panjang suara. Suara library ElevenLabs hanya bisa dipakai lewat API jika akunmu mengizinkan; daftar suara ada di `VOICES` di `js/app.js`.

**Biaya:** setiap pengguna yang masuk bisa memicu pembuatan suara dan naskah dengan kreditmu. Matikan pendaftaran publik (Authentication → Sign In / Providers → "Allow new users to sign up") atau batasi penggunanya.

## Berkas
`index.html`, `css/app.css`, `js/app.js` (layar + wizard + data), `js/studio.js` (mesin animasi WebGL2), `supabase/` (schema, `functions/ai-script`, `functions/tts`).

## Batasan
- Suara hanya untuk pengguna yang masuk (butuh Supabase); mode lokal tanpa suara dan tanpa AI.
- Ekspor merekam secara real-time (video 20 detik = 20 detik), butuh browser dengan WebGL2 dan MediaRecorder.
