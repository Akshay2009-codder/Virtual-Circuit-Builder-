import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";
import client from "../api/client";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "users", label: "Users" },
  { key: "projects", label: "Projects" },
  { key: "components", label: "Components" },
];

export default function Admin() {
  const [tab, setTab] = useState("overview");

  return (
    <AppShell>
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Panel</h1>
          <p style={styles.subtitle}>Manage users, circuits, and the component catalog.</p>
        </div>

        <div style={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                ...styles.tabBtn,
                color: tab === t.key ? "var(--primary)" : "var(--text-dim)",
                borderBottomColor: tab === t.key ? "var(--primary)" : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={styles.content}>
          {tab === "overview" && <OverviewTab />}
          {tab === "users" && <UsersTab />}
          {tab === "projects" && <ProjectsTab />}
          {tab === "components" && <ComponentsTab />}
        </div>
      </div>
    </AppShell>
  );
}

/* ---------------------------- Overview ---------------------------- */

function OverviewTab() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    client
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Couldn't load stats."));
  }, []);

  if (error) return <p style={styles.error}>{error}</p>;
  if (!stats) return <p style={styles.muted}>Loading…</p>;

  const cards = [
    { label: "Users", value: stats.user_count, sub: `+${stats.new_users_7d} this week` },
    { label: "Circuits", value: stats.project_count, sub: `+${stats.new_projects_7d} this week` },
    { label: "Public circuits", value: stats.public_project_count },
    { label: "Components in catalog", value: stats.component_count },
    { label: "Total simulation runs", value: stats.total_runs },
  ];

  return (
    <div style={styles.statGrid}>
      {cards.map((c) => (
        <div key={c.label} style={styles.statCard}>
          <div style={styles.statValue}>{c.value}</div>
          <div style={styles.statLabel}>{c.label}</div>
          {c.sub && <div style={styles.statSub}>{c.sub}</div>}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- Users ---------------------------- */

function UsersTab() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  function load(query) {
    setLoading(true);
    client
      .get("/admin/users", { params: { q: query, per_page: 50 } })
      .then((res) => setUsers(res.data.users))
      .catch(() => setError("Couldn't load users."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(() => load(q), 300); // debounce search
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function toggleAdmin(u) {
    setBusyId(u.id);
    try {
      const res = await client.patch(`/admin/users/${u.id}`, { is_admin: !u.is_admin });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? res.data.user : x)));
    } catch (err) {
      alert(err.response?.data?.error || "Couldn't update that user.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeUser(u) {
    if (!confirm(`Delete ${u.name} (@${u.username})? This also deletes their circuits. This can't be undone.`)) return;
    setBusyId(u.id);
    try {
      await client.delete(`/admin/users/${u.id}`);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err) {
      alert(err.response?.data?.error || "Couldn't delete that user.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name, username, or email…"
        style={styles.search}
      />

      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <p style={styles.muted}>Loading…</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Circuits</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Admin</th>
              <th style={styles.th} />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={styles.tr}>
                <td style={styles.td}>{u.name}</td>
                <td style={styles.td}>@{u.username}</td>
                <td style={styles.td}>{u.project_count}</td>
                <td style={styles.td}>{timeAgo(u.created_at)}</td>
                <td style={styles.td}>
                  <label style={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={u.is_admin}
                      disabled={busyId === u.id || u.id === me?.id}
                      onChange={() => toggleAdmin(u)}
                    />
                    {u.is_admin ? "Admin" : "—"}
                  </label>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => removeUser(u)}
                    disabled={busyId === u.id || u.id === me?.id}
                    style={styles.dangerBtn}
                    title={u.id === me?.id ? "You can't delete your own account here" : "Delete user"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={6}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------------------------- Projects ---------------------------- */

function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  function load(query) {
    setLoading(true);
    client
      .get("/admin/projects", { params: { q: query, per_page: 50 } })
      .then((res) => setProjects(res.data.projects))
      .catch(() => setError("Couldn't load circuits."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const t = setTimeout(() => load(q), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function togglePublic(p) {
    setBusyId(p.id);
    try {
      const res = await client.patch(`/admin/projects/${p.id}`, { is_public: !p.is_public });
      setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, ...res.data.project } : x)));
    } catch {
      alert("Couldn't update that circuit.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeProject(p) {
    if (!confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    setBusyId(p.id);
    try {
      await client.delete(`/admin/projects/${p.id}`);
      setProjects((prev) => prev.filter((x) => x.id !== p.id));
    } catch {
      alert("Couldn't delete that circuit.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search circuits by name…"
        style={styles.search}
      />

      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <p style={styles.muted}>Loading…</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Owner</th>
              <th style={styles.th}>Last status</th>
              <th style={styles.th}>Runs</th>
              <th style={styles.th}>Updated</th>
              <th style={styles.th}>Public</th>
              <th style={styles.th} />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.name}</td>
                <td style={styles.td}>@{p.owner_username}</td>
                <td style={styles.td}>{p.last_run_status || "not run"}</td>
                <td style={styles.td}>{p.run_count}</td>
                <td style={styles.td}>{timeAgo(p.updated_at)}</td>
                <td style={styles.td}>
                  <label style={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={p.is_public}
                      disabled={busyId === p.id}
                      onChange={() => togglePublic(p)}
                    />
                    {p.is_public ? "Public" : "Private"}
                  </label>
                </td>
                <td style={styles.td}>
                  <button onClick={() => removeProject(p)} disabled={busyId === p.id} style={styles.dangerBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={7}>
                  No circuits found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ---------------------------- Components ---------------------------- */

const EMPTY_FORM = {
  key: "",
  name: "",
  category: "",
  description: "",
  model_type: "",
  unit: "",
  default_value: "",
  terminal_count: 2,
};

function ComponentsTab() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null); // null = not editing, "new" = creating
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    client
      .get("/components")
      .then((res) => setComponents(res.data.components))
      .catch(() => setError("Couldn't load components."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditingId("new");
  }

  function startEdit(c) {
    setForm({
      key: c.key,
      name: c.name,
      category: c.category,
      description: c.description || "",
      model_type: c.model_type,
      unit: c.unit || "",
      default_value: c.default_value ?? "",
      terminal_count: c.terminal_count ?? 2,
    });
    setEditingId(c.id);
  }

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      default_value: form.default_value === "" ? null : Number(form.default_value),
      terminal_count: Number(form.terminal_count) || 2,
    };
    try {
      if (editingId === "new") {
        const res = await client.post("/admin/components", payload);
        setComponents((prev) => [...prev, res.data.component]);
      } else {
        const res = await client.put(`/admin/components/${editingId}`, payload);
        setComponents((prev) => prev.map((c) => (c.id === editingId ? res.data.component : c)));
      }
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.error || "Couldn't save that component.");
    } finally {
      setSaving(false);
    }
  }

  async function removeComponent(c) {
    if (!confirm(`Delete "${c.name}" from the catalog? Existing circuits keep their placed parts, but new ones can't add it.`)) return;
    try {
      await client.delete(`/admin/components/${c.id}`);
      setComponents((prev) => prev.filter((x) => x.id !== c.id));
    } catch {
      alert("Couldn't delete that component.");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={startCreate} style={styles.primaryBtn}>
          + Add component
        </button>
      </div>

      {editingId !== null && (
        <div style={styles.formCard}>
          <div style={styles.formGrid}>
            <Field label="Key (unique)">
              <input
                value={form.key}
                onChange={(e) => setForm({ ...form, key: e.target.value })}
                style={styles.input}
                disabled={editingId !== "new"}
                placeholder="e.g. resistor"
              />
            </Field>
            <Field label="Name">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={styles.input}
                placeholder="e.g. Resistor"
              />
            </Field>
            <Field label="Category">
              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={styles.input}
                placeholder="passive | active | source | control | board"
              />
            </Field>
            <Field label="Model type (3D)">
              <input
                value={form.model_type}
                onChange={(e) => setForm({ ...form, model_type: e.target.value })}
                style={styles.input}
                placeholder="matches MODEL_BY_TYPE key"
              />
            </Field>
            <Field label="Unit">
              <input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                style={styles.input}
                placeholder="Ω, F, V, A…"
              />
            </Field>
            <Field label="Default value">
              <input
                type="number"
                value={form.default_value}
                onChange={(e) => setForm({ ...form, default_value: e.target.value })}
                style={styles.input}
              />
            </Field>
            <Field label="Terminal count">
              <input
                type="number"
                value={form.terminal_count}
                onChange={(e) => setForm({ ...form, terminal_count: e.target.value })}
                style={styles.input}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...styles.input, width: "100%", minHeight: 60 }}
            />
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <button onClick={save} disabled={saving} style={styles.primaryBtn}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditingId(null)} style={styles.ghostBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <p style={styles.muted}>Loading…</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Key</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Model type</th>
              <th style={styles.th}>Unit</th>
              <th style={styles.th} />
            </tr>
          </thead>
          <tbody>
            {components.map((c) => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.td}>{c.name}</td>
                <td style={styles.td}>{c.key}</td>
                <td style={styles.td}>{c.category}</td>
                <td style={styles.td}>{c.model_type}</td>
                <td style={styles.td}>{c.unit || "—"}</td>
                <td style={styles.td}>
                  <button onClick={() => startEdit(c)} style={styles.ghostBtn}>
                    Edit
                  </button>
                  <button onClick={() => removeComponent(c)} style={styles.dangerBtn}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {components.length === 0 && (
              <tr>
                <td style={styles.td} colSpan={6}>
                  No components yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  );
}

const styles = {
  page: { maxWidth: 1080, margin: "0 auto", padding: "40px 6vw 80px" },
  header: { marginBottom: 24 },
  title: { fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text)", margin: 0 },
  subtitle: { color: "var(--text-dim)", fontSize: 13.5, marginTop: 6 },
  tabs: { display: "flex", gap: 22, borderBottom: "1px solid var(--border)", marginBottom: 24 },
  tabBtn: {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "8px 2px 12px",
    fontFamily: "var(--font-display)",
    fontSize: 13,
    letterSpacing: "0.03em",
    cursor: "pointer",
  },
  content: { minHeight: 300 },
  statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 },
  statCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "18px 20px",
  },
  statValue: { fontSize: 28, fontFamily: "var(--font-display)", color: "var(--primary)" },
  statLabel: { color: "var(--text-dim)", fontSize: 13, marginTop: 4 },
  statSub: { color: "var(--text-faint)", fontSize: 11.5, marginTop: 6 },
  search: {
    width: "100%",
    maxWidth: 360,
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "9px 12px",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
    marginBottom: 16,
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    textAlign: "left",
    color: "var(--text-faint)",
    fontFamily: "var(--font-display)",
    fontWeight: 500,
    fontSize: 11.5,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    padding: "8px 10px",
    borderBottom: "1px solid var(--border)",
  },
  tr: { borderBottom: "1px solid var(--border)" },
  td: { padding: "10px 10px", color: "var(--text)", verticalAlign: "middle" },
  toggleLabel: { display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-dim)", cursor: "pointer" },
  dangerBtn: {
    background: "transparent",
    border: "1px solid var(--danger)",
    color: "var(--danger)",
    borderRadius: "var(--radius-sm)",
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer",
    marginLeft: 6,
  },
  ghostBtn: {
    background: "transparent",
    border: "1px solid var(--border-bright)",
    color: "var(--text-dim)",
    borderRadius: "var(--radius-sm)",
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer",
    marginRight: 6,
  },
  primaryBtn: {
    background: "var(--primary)",
    border: "none",
    color: "#062011",
    borderRadius: "var(--radius-sm)",
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  formCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: 18,
    marginBottom: 20,
  },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0 16px" },
  fieldLabel: { display: "block", color: "var(--text-faint)", fontSize: 11.5, marginBottom: 4 },
  input: {
    width: "100%",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "7px 10px",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  muted: { color: "var(--text-faint)", fontSize: 13 },
  error: { color: "var(--danger)", fontSize: 13 },
};