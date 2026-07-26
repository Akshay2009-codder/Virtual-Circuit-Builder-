import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PowerButton from "../components/PowerButton";
import { useAuth } from "../context/AuthContext";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;
// 8-20 chars, at least one uppercase, one lowercase, one number, one special char
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
const PASSWORD_HINT =
  "8-20 characters, with an uppercase letter, a lowercase letter, a number, and a special character.";

// Staggered "power-on" entrance — each field lights up a beat after the
// last, like current reaching successive nodes on a rail.
const formVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", username: "", password: "" });
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!USERNAME_RE.test(form.username)) {
      setFormError("Username must be 3-20 characters: letters, numbers, and underscores only.");
      return;
    }
    const password = form.password.trim();
    console.log("DEBUG password from state:", JSON.stringify(password), "length:", password.length);
    if (!PASSWORD_RE.test(password)) {
      setFormError(`Password must be ${PASSWORD_HINT}`);
      return;
    }

    setStatus("loading");
    try {
      await register(form.name, form.username, password);
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
      <motion.form
        onSubmit={handleSubmit}
        variants={formVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fieldVariants}>
          <FormField
            label="Name"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Ada Lovelace"
            autoComplete="name"
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <FormField
            label="Username"
            required
            value={form.username}
            onChange={update("username")}
            placeholder="ada_lovelace"
            autoComplete="username"
          />
        </motion.div>

        <motion.div variants={fieldVariants}>
          <FormField
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={update("password")}
            placeholder="8-20 characters"
            autoComplete="new-password"
          />
          <p style={{ color: "var(--text-faint)", fontSize: 11.5, margin: "-8px 0 14px" }}>{PASSWORD_HINT}</p>
        </motion.div>

        {formError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ color: "var(--danger)", fontSize: 13, margin: "-6px 0 14px" }}
          >
            {formError}
          </motion.p>
        )}

        <motion.div variants={fieldVariants}>
          <PowerButton type="submit" status={status}>
            Create account
          </PowerButton>
        </motion.div>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        style={{ color: "var(--text-dim)", fontSize: 13.5, marginTop: 20, textAlign: "center" }}
      >
        Already have an account?{" "}
        <Link to="/login" style={{ color: "var(--accent)" }}>
          Sign in
        </Link>
      </motion.p>
    </AuthLayout>
  );
}