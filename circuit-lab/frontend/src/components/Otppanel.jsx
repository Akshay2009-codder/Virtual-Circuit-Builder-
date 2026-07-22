import { useEffect, useState } from "react";
import FormField from "./FormField";
import PowerButton from "./PowerButton";
import { useAuth } from "../context/AuthContext";

const RESEND_COOLDOWN = 30;

export default function OtpPanel({ email: initialEmail, onVerified, onBack }) {
  const { verifyOtp, resendOtp } = useAuth();

  const [email, setEmail] = useState(initialEmail || "");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setResendMessage("");
    setStatus("loading");
    try {
      await verifyOtp(email.trim().toLowerCase(), otp.trim());
      onVerified?.();
    } catch (err) {
      setStatus("error");
      setFormError(err.response?.data?.error || "Couldn't verify that code. Try again.");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  async function handleResend() {
    if (!email.trim() || cooldown > 0) return;
    setFormError("");
    setResendMessage("");
    try {
      await resendOtp(email.trim().toLowerCase());
      setResendMessage("A new code is on its way.");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setFormError(err.response?.data?.error || "Couldn't resend a code right now.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <FormField
        label="Verification code"
        required
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="123456"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
      />

      {formError && (
        <p style={{ color: "var(--danger)", fontSize: 13, margin: "-6px 0 14px" }}>{formError}</p>
      )}
      {resendMessage && (
        <p style={{ color: "var(--primary)", fontSize: 13, margin: "-6px 0 14px" }}>{resendMessage}</p>
      )}

      <PowerButton type="submit" status={status}>
        Verify & continue
      </PowerButton>

      <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 20, textAlign: "center" }}>
        Didn't get a code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            font: "inherit",
            color: cooldown > 0 ? "var(--text-faint)" : "var(--accent)",
            cursor: cooldown > 0 ? "default" : "pointer",
          }}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </p>

      {onBack && (
        <p style={{ color: "var(--text-faint)", fontSize: 12.5, marginTop: 10, textAlign: "center" }}>
          <button
            type="button"
            onClick={onBack}
            style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "var(--text-faint)", cursor: "pointer" }}
          >
            ← Back
          </button>
        </p>
      )}
    </form>
  );
}