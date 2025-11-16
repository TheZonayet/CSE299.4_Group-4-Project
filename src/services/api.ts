export interface User {
  id: string;
  email: string;
  role: string;
}

export interface VerificationRecord {
  id: string;
  userId: string;
  type: 'educational' | 'medicine' | 'product' | 'tutorial';
  qrCode?: string;
  verifiedAt: string;
  status: string;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000';
const TOKEN_KEY = 'asure_token';

// Token management
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Role-based registration
export async function registerUser(role: string, formData: Record<string, any>) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, ...formData }),
  });
  if (!res.ok) {
    let txt = await res.text();
    try { txt = (JSON.parse(txt)?.error) ?? txt; } catch {}
    throw new Error(txt || 'Registration failed');
  }
  return (await res.json()) as { user: User };
}

// Login with token storage
export async function loginUser(role: string, formData: Record<string, any>) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role, ...formData }),
  });
  if (!res.ok) {
    let txt = await res.text();
    try { txt = (JSON.parse(txt)?.error) ?? txt; } catch {}
    throw new Error(txt || 'Login failed');
  }
  const data = (await res.json()) as { user: User; token: string };
  if (data.token) setToken(data.token);
  return data;
}

// Get current user profile
export async function getProfile() {
  const res = await fetch(`${API_BASE}/api/me`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new Error('Failed to fetch profile');
  }
  return (await res.json()) as { user: any };
}

// Update user profile
export async function updateProfile(updates: Record<string, any>) {
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    let txt = await res.text();
    try { txt = (JSON.parse(txt)?.error) ?? txt; } catch {}
    throw new Error(txt || 'Failed to update profile');
  }
  return (await res.json()) as { user: any };
}

// Verification endpoints
export async function createVerification(type: string, data: Record<string, any>) {
  const res = await fetch(`${API_BASE}/api/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ type, ...data }),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    let txt = await res.text();
    try { txt = (JSON.parse(txt)?.error) ?? txt; } catch {}
    throw new Error(txt || 'Verification failed');
  }
  return (await res.json()) as { verification: VerificationRecord };
}

export async function getVerificationHistory() {
  const res = await fetch(`${API_BASE}/api/verification-history`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new Error('Failed to fetch history');
  }
  return (await res.json()) as { verifications: VerificationRecord[] };
}

export async function getVerificationLimits() {
  const res = await fetch(`${API_BASE}/api/verification-limits`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new Error('Failed to fetch limits');
  }
  return (await res.json()) as { credits: number };
}

export default { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateProfile,
  createVerification,
  getVerificationHistory,
  getVerificationLimits,
  getToken,
  setToken,
  clearToken
};
