import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PowerButton from "../components/PowerButton";
import { useAuth } from "../context/AuthContext";

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.08 * i, ease: "easeOut" } }),
};

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [formError, setFormError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setStatus("loading");
    try {
      await adminLogin(form.username.trim().toLowerCase(), form.password);
      setLoggedIn(true);
      setTimeout(() => navigate("/admin"), 550);
    } catch (err) {
      setStatus("error");
      // Deliberately the same message for "no such account", "wrong
      // password", and "not an admin" - see admin.py for why.
      setFormError(err.response?.data?.error || "Invalid admin credentials.");
      setTimeout(() => setStatus("idle"), 1200);
    }
  }

  return (
    <motion.div
      animate={loggedIn ? { y: "-100vh", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
    >
      <AuthLayout eyebrow="Admin" title="Admin sign in" subtitle="Restricted access - admin accounts only.">
        <form onSubmit={handleSubmit}>
          <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="show">
            <FormField
              label="Username"
              required
              value={form.username}
              onChange={update("username")}
              placeholder="admin_username"
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
            <PowerButton type="submit" status={loggedIn ? "idle" : status}>
              {loggedIn ? "✓ Verified" : "Sign in"}
            </PowerButton>
          </motion.div>
        </form>
      </AuthLayout>
    </motion.div>
  );
}