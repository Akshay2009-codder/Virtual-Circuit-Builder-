import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, "")}/api`
  : "/api";

const client = axios.create({
  baseURL: apiBase,
});

client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("cl_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default client;
