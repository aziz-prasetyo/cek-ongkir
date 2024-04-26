export async function POST(request: Request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
  const method = 'POST';

  const results = await request.json();

  const options = {
    method: method,
    headers: {
      key: API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(results),
  };

  const url = `${API_URL}/cost`;

  const res = await fetch(url, options);
  const final = await res.json();

  return Response.json(final);
}
