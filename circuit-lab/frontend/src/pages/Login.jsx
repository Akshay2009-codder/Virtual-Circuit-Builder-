import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PowerButton from "../components/PowerButton";
import OtpPanel from "../components/OtpPanel";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [formError, setFormError] = useState("");
  const [verifyEmail, setVerifyEmail] = useState(null);

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
      if (err.response?.data?.needs_verification) {
        // Show the OTP step right here instead of bouncing to another page.
        // Use the resolved email from the backend, not form.email - the
        // person may have typed their username, which won't work for OTP lookup.
        setVerifyEmail(err.response.data.email);
        setStatus("idle");
        return;
      }
      setStatus("error");
      setFormError(err.response?.data?.error || "Couldn't sign in. Check your details and try again.");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  if (verifyEmail) {
    return (
      <AuthLayout
        eyebrow="Verify your email"
        title="One more step"
        subtitle="Your account isn't verified yet — enter the code we sent to finish signing in."
      >
        <OtpPanel
          email={verifyEmail}
          onVerified={() => navigate("/dashboard")}
          onBack={() => setVerifyEmail(null)}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Sign in"
      title="Welcome back"
      subtitle="Pick up your circuits where you left off."
    >
      <form onSubmit={handleSubmit}>
        <FormField
          label="Email or username"
          required
          value={form.email}
          onChange={update("email")}
          placeholder="you@example.com or username"
          autoComplete="username"
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