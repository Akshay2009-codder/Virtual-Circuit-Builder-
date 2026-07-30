import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("cl_token");
    if (!token) {
      setLoading(false);
      return;
    }
    client
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("cl_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const res = await client.post("/auth/login", { username, password });
    localStorage.setItem("cl_token", res.data.token);
    setUser(res.data.user);
    return res.data;
  }

  // Separate from login() above - posts to /admin/login, which only issues
  // a token if the account has is_admin set. A non-admin's correct
  // password still gets rejected here.
  async function adminLogin(username, password) {
    const res = await client.post("/admin/login", { username, password });
    localStorage.setItem("cl_token", res.data.token);
    setUser(res.data.user);
    return res.data;
  }

  async function register(name, username, password) {
    const res = await client.post("/auth/register", { name, username, password });
    localStorage.setItem("cl_token", res.data.token);
    setUser(res.data.user);
    return res.data;
  }

  function logout() {
    localStorage.removeItem("cl_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}