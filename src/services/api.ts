export interface User {
  id: string;
  username: string;
  role: string;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';

export async function registerUser(role: string, username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, username, password }),
  });
  if (!res.ok) {
    let txt = await res.text();
    try { txt = (JSON.parse(txt)?.error) ?? txt; } catch {}
    throw new Error(txt || 'Registration failed');
  }
  return (await res.json()) as { user: User };
}

export async function loginUser(role: string, username: string, password: string) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, username, password }),
  });
  if (!res.ok) {
    let txt = await res.text();
    try { txt = (JSON.parse(txt)?.error) ?? txt; } catch {}
    throw new Error(txt || 'Login failed');
  }
  return (await res.json()) as { user: User };
}

export default { registerUser, loginUser };
