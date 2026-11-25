export const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const WRAP_CREATE_IN_ARRAY = false;

const getToken = () => localStorage.getItem("token");

const msgOf = (d) => {
  const m = d?.msg ?? d?.errorText ?? d?.message ?? d?.error ?? d?.data;
  if (Array.isArray(m)) {
    return m.map((x) => x.msg || x.message || JSON.stringify(x)).join(", ");
  }
  return typeof m === "string" ? m : null;
};

async function request(path, { method = "GET", json, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body;
  if (form) body = form; 
  else if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body });
  } catch {
    throw new Error(`Can't reach the server at ${BASE}. Check that the backend is running.`);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(msgOf(data) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

const pickList = (d, key) =>
  Array.isArray(d) ? d : d?.[key] || d?.data?.[key] || d?.data || [];

export const api = {
  login: (email, password) =>
    request("/api/users/login", { method: "POST", json: { email, password } }),
  register: (form) => request("/api/users/sign", { method: "POST", form }),
  users: async () => pickList(await request("/api/users/"), "users"),
  courses: async () => pickList(await request("/api/courses"), "courses"),
  createCourse: (c) =>
    request("/api/courses/", { method: "POST", json: WRAP_CREATE_IN_ARRAY ? [c] : c }),
  updateCourse: (id, c) => request(`/api/courses/${id}`, { method: "PATCH", json: c }),
  deleteCourse: (id) => request(`/api/courses/${id}`, { method: "DELETE" }),
};

export const extractToken = (d) =>
  d?.token ||
  d?.accessToken ||
  d?.data?.token ||
  d?.data?.accessToken ||
  d?.user?.token ||
  d?.data?.user?.token ||
  null;