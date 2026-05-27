const API_BASE = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(path, options = {}) {
  const headers = { ...options.headers };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data.message || data.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const authApi = {
  signIn: (email, password) =>
    apiRequest("/users/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (formData) =>
    apiRequest("/users", {
      method: "POST",
      body: formData,
    }),

  getMe: () => apiRequest("/users/me"),
};

function buildQuery(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );
  const query = new URLSearchParams(clean).toString();
  return query ? `?${query}` : "";
}

export const jobsApi = {
  list: (params = {}) => apiRequest(`/jobs${buildQuery(params)}`),
  get: (id) => apiRequest(`/jobs/${id}`),
  create: (job) =>
    apiRequest("/jobs", { method: "POST", body: JSON.stringify(job) }),
  update: (id, job) =>
    apiRequest(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(job) }),
  delete: (id) => apiRequest(`/jobs/${id}`, { method: "DELETE" }),
};

export const usersApi = {
  list: () => apiRequest("/users"),
  delete: (id) => apiRequest(`/users/${id}`, { method: "DELETE" }),
};
