import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PowerButton from "../components/PowerButton";
import OtpPanel from "../components/OtpPanel";
import { useAuth } from "../context/AuthContext";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.08 * i, ease: "easeOut" } }),
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
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
      const res = await login(form.username.trim().toLowerCase(), form.password);
      setVerifyEmail(res.email);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setFormError(err.response?.data?.error || "Couldn't sign in. Check your details and try again.");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <AuthLayout eyebrow="Sign in" title={verifyEmail ? "Enter your code" : "Welcome back"}>
      <AnimatePresence mode="wait">
        {verifyEmail ? (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <OtpPanel
              email={verifyEmail}
              onVerified={() => navigate("/dashboard")}
              onBack={() => setVerifyEmail(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="credentials"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <form onSubmit={handleSubmit}>
              <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="show">
                <FormField
                  label="Username"
                  required
                  value={form.username}
                  onChange={update("username")}
                  placeholder="your_username"
                  autoComplete="username"
                />
              </motion.div>
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="show">
                <FormField
                  label="Password"
                  type="password"
                  required
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </motion.div>

              {formError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: "var(--danger)", fontSize: 13, margin: "-6px 0 14px" }}
                >
                  {formError}
                </motion.p>
              )}

              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="show">
                <PowerButton type="submit" status={status}>
                  Sign in
                </PowerButton>
              </motion.div>
            </form>

            <p style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 20, textAlign: "center" }}>
              New here?{" "}
              <Link to="/register" style={{ color: "var(--accent)" }}>
                Create an account
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}