/** The one place where browser code communicates with the Django REST API. */
export const API_BASE_URL = "http://127.0.0.1:8000/api";

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ApiError";
    this.details = details;
  }
}

function csrfToken() {
  return document.cookie.split("; ").find((cookie) => cookie.startsWith("csrftoken="))?.split("=")[1];
}

export async function ensureCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/auth/csrf/`, { credentials: "include" });
  if (!response.ok) throw new ApiError("The server could not prepare a secure request. Please try again.");
}

export async function request(path, { method = "GET", body } = {}) {
  const headers = { Accept: "application/json" };
  if (body) { headers["Content-Type"] = "application/json"; headers["X-CSRFToken"] = csrfToken() ?? ""; }
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, credentials: "include" });
  } catch {
    throw new ApiError("The AniWorld server is unavailable. Check that Django is running.");
  }
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.detail || "Your request could not be completed.";
    throw new ApiError(message, data);
  }
  return data;
}

export const authApi = {
  register: (payload) => request("/auth/register/", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login/", { method: "POST", body: payload }),
  logout: () => request("/auth/logout/", { method: "POST", body: {} }),
  currentUser: () => request("/auth/me/"),
};
