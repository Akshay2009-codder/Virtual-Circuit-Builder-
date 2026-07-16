import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PowerButton from "../components/PowerButton";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [formError, setFormError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setStatus("loading");
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setStatus("error");
      setFormError(err.response?.data?.error || "Couldn't sign in. Check your details and try again.");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Pick up your circuits where you left off."
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={update("email")}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <FormField
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={update("password")}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {formError && (
          <p style={{ color: "var(--danger)", fontSize: 13, margin: "-6px 0 14px" }}>{formError}</p>
        )}

        <PowerButton type="submit" status={status}>
          Sign in
        </PowerButton>
      </form>

      <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 20, textAlign: "center" }}>
        New to CircuitLab?{" "}
        <Link to="/register" style={{ color: "var(--accent)" }}>
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}