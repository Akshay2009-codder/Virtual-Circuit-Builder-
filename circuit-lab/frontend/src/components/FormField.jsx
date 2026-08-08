export default function FormField({ label, error, helperText, ...inputProps }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={styles.label}>{label}</span>
      <input
        {...inputProps}
        aria-invalid={Boolean(error)}
        style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
      />
      {helperText && !error && <span style={styles.helper}>{helperText}</span>}
      {error && <span style={styles.error}>{error}</span>}
    </label>
  );
}

const styles = {
  label: {
    display: "block",
    fontSize: 12.5,
    color: "var(--text-dim)",
    marginBottom: 6,
    letterSpacing: "0.01em",
  },
  input: {
    width: "100%",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "10px 12px",
    color: "var(--text)",
    fontSize: 14.5,
    fontFamily: "var(--font-body)",
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  inputError: {
    borderColor: "var(--danger)",
  },
  helper: {
    display: "block",
    color: "var(--text-dim)",
    fontSize: 12,
    marginTop: 5,
  },
  error: {
    display: "block",
    color: "var(--danger)",
    fontSize: 12,
    marginTop: 5,
  },
};