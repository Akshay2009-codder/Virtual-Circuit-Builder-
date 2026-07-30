import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh", color: "var(--text-dim)" }}>
        Checking session…
      </div>
    );
  }

  if (!user || !user.is_admin) return <Navigate to="/admin/login" replace />;
  return children;
}