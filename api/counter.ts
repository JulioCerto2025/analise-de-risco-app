// Serverless function para contagem de visitantes
// Nota: @vercel/kv foi removido pois não está configurado neste projeto.
// O VisitorCounter.tsx usa counterapi.dev como provedor externo.
// Esta função retorna um fallback seguro para evitar erros de build.

export default async function handler(req: Request) {
  return new Response(JSON.stringify({ count: 0 }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store, max-age=0',
      'access-control-allow-origin': '*',
    },
  });
}
