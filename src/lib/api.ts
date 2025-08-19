import { useAuth } from '../hooks/use-auth';

export async function apiFetch(url, { method = 'GET', body, token } = {}) {
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
  const { token } = useAuth();
  return {
    get: (url) => apiFetch(url, { method: 'GET', token }),
    post: (url, body) => apiFetch(url, { method: 'POST', body, token }),
    put: (url, body) => apiFetch(url, { method: 'PUT', body, token }),
    del: (url) => apiFetch(url, { method: 'DELETE', token }),
  };
}
