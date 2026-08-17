const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const error = new Error((body && body.error) || `Request failed (${res.status})`);
    error.details = body && body.details;
    error.status = res.status;
    throw error;
  }

  return body;
}

// ---- Public estimator ----

export function fetchConfig() {
  return request("/config");
}

export function submitEstimate(payload) {
  return request("/estimate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---- Owner auth ----

export function login(username, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// ---- Owner admin (authenticated) ----

function authHeaders() {
  const token = localStorage.getItem("wantace_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function fetchAdminConfig() {
  return request("/admin/config", { headers: authHeaders() });
}

export function saveAdminConfig(config) {
  return request("/admin/config", {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(config),
  });
}

export function fetchLeads() {
  return request("/admin/leads", { headers: authHeaders() });
}
