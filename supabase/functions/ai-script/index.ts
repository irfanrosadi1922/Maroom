// Edge Function "ai-script": membuat naskah narasi dari topik. Hanya untuk pengguna yang masuk (verify_jwt aktif secara bawaan).
// Setup: supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   lalu: supabase functions deploy ai-script
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const TONES = ['Seru', 'Misterius', 'Lucu', 'Edukatif'];
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) return json({ error: 'ANTHROPIC_API_KEY belum diisi' }, 500);

  const { topic, tone, scenes } = await req.json().catch(() => ({}));
  if (typeof topic !== 'string' || topic.trim().length < 3 || topic.length > 200) return json({ error: 'topik tidak valid' }, 400);
  if (!TONES.includes(tone)) return json({ error: 'nuansa tidak valid' }, 400);
  if (!Number.isInteger(scenes) || scenes < 3 || scenes > 12) return json({ error: 'jumlah adegan tidak valid' }, 400);

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({
      model: Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-sonnet-5-5',
      max_tokens: 800,
      system: 'Kamu penulis naskah video animasi pendek bergaya TikTok dalam bahasa Indonesia. Balas hanya dengan naskahnya.',
      messages: [{
        role: 'user',
        content: `Tulis naskah narasi dengan nuansa ${tone} tentang: "${topic.trim()}". ` +
          `Tepat ${scenes} kalimat, satu kalimat per adegan, maksimal 14 kata per kalimat. ` +
          'Buka dengan kalimat pembuka yang memikat dan tutup dengan akhir yang menggantung atau penutup kuat. ' +
          'Setiap kalimat berakhir dengan tanda titik, seru, atau tanya. Tanpa nomor, judul, atau markdown.',
      }],
    }),
  });
  if (!r.ok) return json({ error: 'layanan AI gagal', status: r.status }, 502);
  const data = await r.json();
  const script = (data.content?.[0]?.text ?? '').replace(/\s+/g, ' ').trim();
  return script ? json({ script }) : json({ error: 'naskah kosong' }, 502);
});
