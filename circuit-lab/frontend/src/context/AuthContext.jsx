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

  async function login(email, password) {
    // throws with err.response.data.needs_verification === true if the
    // account exists but hasn't verified its email yet - callers should
    // check for that and route to the verify-email flow.
    const res = await client.post("/auth/login", { email, password });
    localStorage.setItem("cl_token", res.data.token);
    setUser(res.data.user);
  }

  async function register(name, username, email, password) {
    // No token comes back here anymore - registering only sends an OTP.
    // The caller must route to /verify-email and call verifyOtp() to
    // actually finish signing in.
    await client.post("/auth/register", { name, username, email, password });
  }

  async function verifyOtp(email, otp) {
    const res = await client.post("/auth/verify-otp", { email, otp });
    localStorage.setItem("cl_token", res.data.token);
    setUser(res.data.user);
  }

  async function resendOtp(email) {
    await client.post("/auth/resend-otp", { email });
  }

  function logout() {
    localStorage.removeItem("cl_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOtp, resendOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}