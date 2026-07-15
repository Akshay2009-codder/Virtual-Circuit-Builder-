import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div style={{ minHeight: "100vh", padding: "40px 6vw" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1 style={{ margin: "6px 0 0", fontSize: 26, fontFamily: "var(--font-body)" }}>
            Welcome, {user?.name}
          </h1>
        </div>
        <button
          onClick={logout}
          style={{
            background: "transparent",
            border: "1px solid var(--border-bright)",
            color: "var(--text-dim)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>

      <div
        style={{
          border: "1px dashed var(--border-bright)",
          borderRadius: "var(--radius)",
          padding: "40px",
          color: "var(--text-dim)",
          textAlign: "center",
        }}
      >
        Project cards, completion status, and stats land here in Phase 5.
        <br />
        Auth is fully wired — you're seeing this because your JWT checked out.
      </div>
    </div>
  );
}
