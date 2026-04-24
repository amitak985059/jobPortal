const BASE_URL = import.meta.env.VITE_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const saveJobAPI = async (jobId) => {
  const res = await fetch(`${BASE_URL}/users/save-job/${jobId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return await res.json();
};

export const getSavedJobsAPI = async () => {
  const res = await fetch(`${BASE_URL}/users/saved-jobs`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });
  return await res.json();
};

export const registerAPI = async (userData) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || 'Registration failed');
  return data;
};

export const getJobByIdAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`);
  if (!res.ok) throw new Error('Job not found');
  return await res.json();
};
