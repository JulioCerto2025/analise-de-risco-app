import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    // Obter IP real do cabeçalho x-forwarded-for (pode ser uma lista separada por vírgula)
    const xff = req.headers.get('x-forwarded-for');
    const ip = xff ? xff.split(',')[0].trim() : '127.0.0.1';
    
    // Usar um SET no Redis para garantir IPs únicos
    // SADD adiciona se for novo, retorna 1 se adicionou, 0 se já existia
    await kv.sadd('unique_ips_set', ip);
    
    // Obter o número total de elementos únicos no SET
    const count = await kv.scard('unique_ips_set');
    
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Counter API Error:', error);
    return new Response(JSON.stringify({ count: 0, error: 'Failed to fetch count' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}
