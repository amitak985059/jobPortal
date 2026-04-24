const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getJobs = async (filters, page = 1, limit = 12) => {
  const queryParams = new URLSearchParams();
  if (filters.city) queryParams.append("city", filters.city);
  if (filters.type) queryParams.append("type", filters.type);
  if (filters.companyType)
    queryParams.append("companyType", filters.companyType);
  if (filters.role) queryParams.append("role", filters.role);
  queryParams.append("page", page);
  queryParams.append("limit", limit);

  const res = await fetch(`${BASE_URL}/jobs/getjobs?${queryParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return await res.json();
};

export const matchResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await fetch(`${BASE_URL}/jobs/match-resume`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to match resume");
  return await res.json();
};

export const lazyApplyToJob = async (jobId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/jobs/${jobId}/lazy-apply`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to apply automatically');
  }
  return await res.json();
};
