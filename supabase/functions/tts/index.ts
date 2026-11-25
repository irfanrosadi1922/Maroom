// Edge Function "tts": teks -> suara (ElevenLabs). Hanya pengguna yang masuk (verify_jwt aktif).
// Secret: ELEVENLABS_API_KEY (Dashboard > Edge Functions > Secrets). Satu panggilan = satu kalimat.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const key = Deno.env.get('ELEVENLABS_API_KEY');
  if (!key) return json({ error: 'ELEVENLABS_API_KEY belum diisi' }, 500);

  const { text, voice_id } = await req.json().catch(() => ({}));
  if (typeof text !== 'string' || !text.trim() || text.length > 300) return json({ error: 'teks tidak valid (maks 300 karakter)' }, 400);
  if (typeof voice_id !== 'string' || !/^[A-Za-z0-9]{15,30}$/.test(voice_id)) return json({ error: 'voice_id tidak valid' }, 400);

  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'content-type': 'application/json' },
    body: JSON.stringify({ text: text.trim(), model_id: 'eleven_multilingual_v2' }),
  });
  if (!r.ok) return json({ error: 'layanan suara gagal', status: r.status }, 502);
  // octet-stream agar supabase-js mengembalikan Blob, bukan teks.
  return new Response(r.body, { headers: { ...cors, 'Content-Type': 'application/octet-stream' } });
});
