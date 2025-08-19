import { useAuth } from '../hooks/use-auth';

export async function apiFetch(url: string, options: { method?: string; body?: any; token?: string } = {}) {
  const { method = 'GET', body, token } = options;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export function useApi() {
  const { session } = useAuth();
  const token = session?.access_token;
  
  return {
    get: (url: string) => apiFetch(url, { method: 'GET', token }),
    post: (url: string, body: any) => apiFetch(url, { method: 'POST', body, token }),
    put: (url: string, body: any) => apiFetch(url, { method: 'PUT', body, token }),
    del: (url: string) => apiFetch(url, { method: 'DELETE', token }),
  };
}
