const BASE_URL = import.meta.env.VITE_BASE_URL;

export const loginAPI = async (credentials) => {
  const res = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Login failed");
  return data;
};

export const logoutAPI = async () => {
  const res = await fetch(`${BASE_URL}/users/logout`, { method: 'POST' });
  return await res.json();
};
