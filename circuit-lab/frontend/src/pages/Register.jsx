import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PowerButton from "../components/PowerButton";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setStatus("loading");
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setStatus("error");
      setFormError(err.response?.data?.error || "Couldn't create your account. Try again.");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Start building"
      subtitle="Set up your bench in under a minute."
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label="Name"
          required
          value={form.name}
          onChange={update("name")}
          placeholder="Ada Lovelace"
          autoComplete="name"
        />
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
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />

        {formError && (
          <p style={{ color: "var(--danger)", fontSize: 13, margin: "-6px 0 14px" }}>{formError}</p>
        )}

        <PowerButton type="submit" status={status}>
          Create account
        </PowerButton>
      </form>

      <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 20, textAlign: "center" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--teal)" }}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
