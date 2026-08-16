import React, { useEffect, useState } from "react";
import client from "../../api/client";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { SortableTh, TablePagination, TableLoadingOverlay, TableEmptyState } from "../../components/admin/AdminTable";

const CATEGORIES = [
  "all",
  "power",
  "passive",
  "semiconductor",
  "sensor",
  "board",
  "output",
  "control",
  "ic",
];

const INITIAL_FORM = {
  key: "",
  name: "",
  category: "passive",
  description: "",
  model_type: "resistor",
  unit: "Ω",
  default_value: "1000",
  terminal_count: 2,
  spec_json: "{}",
};

export default function AdminComponents() {
  const [components, setComponents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals & forms
  const [modalOpen, setModalOpen] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [deleteModalComp, setDeleteModalComp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  function triggerToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  }

  function loadComponents() {
    setLoading(true);
    setError("");
    client
      .get("/admin/components", {
        params: {
          q: search,
          category: categoryFilter,
          page: page,
          per_page: perPage,
        },
      })
      .then((res) => {
        setComponents(res.data.components || []);
        setTotal(res.data.total || 0);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load component catalog.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadComponents();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, page]);

  function handleOpenCreate() {
    setEditingComponent(null);
    setFormData(INITIAL_FORM);
    setFormError("");
    setModalOpen(true);
  }

  function handleOpenEdit(comp) {
    setEditingComponent(comp);
    setFormData({
      key: comp.key,
      name: comp.name,
      category: comp.category,
      description: comp.description || "",
      model_type: comp.model_type || comp.key,
      unit: comp.unit || "",
      default_value: comp.default_value !== undefined && comp.default_value !== null ? String(comp.default_value) : "",
      terminal_count: comp.terminal_count || 2,
      spec_json: JSON.stringify(comp.spec || {}, null, 2),
    });
    setFormError("");
    setModalOpen(true);
  }

  async function handleSaveComponent(e) {
    e.preventDefault();
    setFormError("");

    let parsedSpec = {};
    if (formData.spec_json && formData.spec_json.trim()) {
      try {
        parsedSpec = JSON.parse(formData.spec_json);
      } catch (err) {
        setFormError("Invalid JSON in Spec / Pin Definitions.");
        return;
      }
    }

    const payload = {
      key: formData.key.trim().toLowerCase(),
      name: formData.name.trim(),
      category: formData.category.trim().toLowerCase(),
      description: formData.description.trim(),
      model_type: formData.model_type.trim().toLowerCase(),
      unit: formData.unit.trim() || null,
      default_value: formData.default_value ? parseFloat(formData.default_value) : null,
      terminal_count: parseInt(formData.terminal_count, 10) || 2,
      spec: parsedSpec,
    };

    setActionLoading(true);
    try {
      if (editingComponent) {
        const res = await client.put(`/admin/components/${editingComponent.id}`, payload);
        setComponents((prev) => prev.map((c) => (c.id === editingComponent.id ? res.data.component : c)));
        triggerToast(`Updated component "${payload.name}".`);
      } else {
        const res = await client.post("/admin/components", payload);
        setComponents((prev) => [res.data.component, ...prev]);
        setTotal((t) => t + 1);
        triggerToast(`Created new component "${payload.name}".`);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.error || "Failed to save component.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleConfirmDelete() {
    if (!deleteModalComp) return;
    setActionLoading(true);
    try {
      await client.delete(`/admin/components/${deleteModalComp.id}`);
      setComponents((prev) => prev.filter((c) => c.id !== deleteModalComp.id));
      setTotal((t) => Math.max(0, t - 1));
      triggerToast(`Deleted component "${deleteModalComp.name}".`);
      setDeleteModalComp(null);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete component.");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toastMsg && <div style={styles.toast}>{toastMsg}</div>}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>HARDWARE DEFINITIONS</div>
          <h1 style={styles.title}>Component Catalog</h1>
          <p style={styles.subtitle}>
            Manage parts table feeding the Component Palette. Add new sensors, ICs, boards, and passives live.
          </p>
        </div>

        <button onClick={handleOpenCreate} style={styles.createBtn}>
          <span>+</span>
          <span>Add New Component</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search components by name, key, or category…"
            style={styles.searchInput}
          />
          {search && (
            <button onClick={() => setSearch("")} style={styles.clearSearchBtn}>
              ✕
            </button>
          )}
        </div>

        <div style={styles.filterTabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategoryFilter(cat);
                setPage(1);
              }}
              style={{
                ...styles.filterTabBtn,
                background: categoryFilter === cat ? "rgba(47, 214, 111, 0.15)" : "rgba(255, 255, 255, 0.03)",
                color: categoryFilter === cat ? "#2fd66f" : "var(--text-dim)",
                borderColor: categoryFilter === cat ? "rgba(47, 214, 111, 0.4)" : "var(--border)",
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div style={styles.tableCard}>
        {error && <div style={styles.errorText}>⚠️ {error}</div>}

        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Component Name</th>
                <th style={styles.th}>Key</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Default Rating</th>
                <th style={styles.th}>Model Type</th>
                <th style={styles.th}>Terminals</th>
                <th style={{ ...styles.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7}>
                    <TableLoadingOverlay text="Loading hardware catalog…" />
                  </td>
                </tr>
              ) : components.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <TableEmptyState
                      icon="🧩"
                      title="No components found"
                      subtitle="Add your first custom component or clear category filters."
                    />
                  </td>
                </tr>
              ) : (
                components.map((comp) => (
                  <tr key={comp.id} style={styles.tr}>
                    {/* Name + Description */}
                    <td style={styles.td}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text)" }}>{comp.name}</div>
                        {comp.description && <div style={styles.compDesc}>{comp.description}</div>}
                      </div>
                    </td>

                    {/* Key */}
                    <td style={styles.td}>
                      <span style={styles.codePill}>{comp.key}</span>
                    </td>

                    {/* Category */}
                    <td style={styles.td}>
                      <span style={styles.catBadge}>{comp.category}</span>
                    </td>

                    {/* Default Value & Unit */}
                    <td style={styles.td}>
                      <span style={{ fontSize: 12.5, color: "var(--text)" }}>
                        {comp.default_value !== undefined && comp.default_value !== null ? `${comp.default_value} ${comp.unit || ""}` : "—"}
                      </span>
                    </td>

                    {/* Model Type */}
                    <td style={styles.td}>
                      <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--font-display)" }}>
                        {comp.model_type || comp.key}
                      </span>
                    </td>

                    {/* Terminal Count */}
                    <td style={styles.td}>
                      <span style={styles.termBadge}>{comp.terminal_count || 2} pins</span>
                    </td>

                    {/* Actions */}
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          onClick={() => handleOpenEdit(comp)}
                          style={{ ...styles.actionIconBtn, color: "var(--primary)" }}
                          title="Edit component specifications"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteModalComp(comp)}
                          style={{ ...styles.actionIconBtn, color: "var(--danger)" }}
                          title="Delete component from catalog"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <TablePagination
          total={total}
          page={page}
          perPage={perPage}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div style={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: "var(--text)" }}>
                {editingComponent ? `Edit Component: ${editingComponent.name}` : "Create New Component"}
              </h3>
              <button onClick={() => setModalOpen(false)} style={styles.closeBtn}>
                ×
              </button>
            </div>

            {formError && <div style={styles.formErrorText}>{formError}</div>}

            <form onSubmit={handleSaveComponent} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={styles.formRow2}>
                <div>
                  <label style={styles.label}>Display Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Ultrasonic HC-SR04"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Unique Key *</label>
                  <input
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    required
                    disabled={!!editingComponent}
                    placeholder="e.g. ultrasonic_sensor"
                    style={{ ...styles.input, fontFamily: "var(--font-display)" }}
                  />
                </div>
              </div>

              <div style={styles.formRow3}>
                <div>
                  <label style={styles.label}>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.select}
                  >
                    {CATEGORIES.filter((c) => c !== "all").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={styles.label}>3D Model Type *</label>
                  <input
                    value={formData.model_type}
                    onChange={(e) => setFormData({ ...formData, model_type: e.target.value })}
                    required
                    placeholder="e.g. ultrasonic, led, resistor"
                    style={{ ...styles.input, fontFamily: "var(--font-display)" }}
                  />
                </div>

                <div>
                  <label style={styles.label}>Pins Count</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formData.terminal_count}
                    onChange={(e) => setFormData({ ...formData, terminal_count: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow2}>
                <div>
                  <label style={styles.label}>Default Value (Optional)</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.default_value}
                    onChange={(e) => setFormData({ ...formData, default_value: e.target.value })}
                    placeholder="e.g. 220, 5.0, 100"
                    style={styles.input}
                  />
                </div>

                <div>
                  <label style={styles.label}>Unit (Optional)</label>
                  <input
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. Ω, V, µF, cm"
                    style={styles.input}
                  />
                </div>
              </div>

              <div>
                <label style={styles.label}>Description</label>
                <input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short explanation for component tooltip in builder"
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Spec / Pin JSON Definitions</label>
                <textarea
                  value={formData.spec_json}
                  onChange={(e) => setFormData({ ...formData, spec_json: e.target.value })}
                  rows={4}
                  placeholder='{"pins": [{"terminal": "vcc", "label": "VCC", "role": "power"}]}'
                  style={{ ...styles.input, fontFamily: "var(--font-display)", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} style={styles.saveBtn}>
                  {actionLoading ? "Saving…" : editingComponent ? "Save Changes" : "Create Component"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalComp && (
        <ConfirmModal
          isOpen={!!deleteModalComp}
          title={`Delete Component "${deleteModalComp.name}"?`}
          message={`Are you sure you want to remove "${deleteModalComp.key}" from the component catalog? This will prevent new circuits from adding this part.`}
          confirmText="Delete Component"
          type="danger"
          loading={actionLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalComp(null)}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 22,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 16,
    flexWrap: "wrap",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "#2fd66f",
    fontFamily: "var(--font-display)",
    marginBottom: 4,
  },
  title: {
    margin: "0 0 6px",
    fontSize: 24,
    fontWeight: 800,
    color: "var(--text)",
  },
  subtitle: {
    margin: 0,
    fontSize: 13.5,
    color: "var(--text-dim)",
  },
  createBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 18px",
    background: "#2fd66f",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(47, 214, 111, 0.3)",
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  searchBox: {
    position: "relative",
    flex: 1,
    minWidth: 280,
    maxWidth: 450,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: 14,
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "9px 34px 9px 36px",
    background: "rgba(16, 22, 29, 0.8)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  clearSearchBtn: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    cursor: "pointer",
    fontSize: 12,
  },
  filterTabs: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
  },
  filterTabBtn: {
    padding: "6px 12px",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    fontSize: 11.5,
    fontWeight: 700,
    fontFamily: "var(--font-display)",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  tableCard: {
    background: "rgba(16, 22, 29, 0.75)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontFamily: "var(--font-display)",
    color: "var(--text-dim)",
    borderBottom: "1px solid var(--border)",
    background: "rgba(16, 22, 29, 0.6)",
  },
  tr: {
    borderBottom: "1px solid rgba(35, 46, 58, 0.5)",
    transition: "background 0.12s ease",
  },
  td: {
    padding: "12px 16px",
    fontSize: 13,
    color: "var(--text)",
    verticalAlign: "middle",
  },
  compDesc: {
    fontSize: 11.5,
    color: "var(--text-dim)",
    marginTop: 2,
  },
  codePill: {
    fontSize: 11.5,
    fontFamily: "var(--font-display)",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border)",
    borderRadius: 4,
    padding: "2px 6px",
    color: "var(--text)",
  },
  catBadge: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    background: "rgba(69, 216, 196, 0.12)",
    color: "#45d8c4",
    border: "1px solid rgba(69, 216, 196, 0.3)",
    borderRadius: 10,
    padding: "2px 8px",
  },
  termBadge: {
    fontSize: 11,
    color: "var(--text-dim)",
  },
  actionIconBtn: {
    width: 30,
    height: 30,
    borderRadius: "var(--radius-sm)",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    display: "grid",
    placeItems: "center",
    fontSize: 13,
    color: "var(--text)",
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    top: 24,
    right: 24,
    zIndex: 3000,
    background: "rgba(16, 22, 29, 0.95)",
    border: "1px solid #2fd66f",
    color: "#2fd66f",
    padding: "10px 18px",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
  },
  errorText: {
    padding: "12px 16px",
    color: "var(--danger)",
    background: "rgba(255, 71, 87, 0.1)",
    fontSize: 13,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 2000,
    background: "rgba(6, 10, 15, 0.82)",
    backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 620,
    maxHeight: "90vh",
    overflowY: "auto",
    background: "rgba(16, 22, 29, 0.97)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
    padding: 24,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    fontSize: 22,
    cursor: "pointer",
  },
  formErrorText: {
    padding: "10px 14px",
    background: "rgba(255, 71, 87, 0.12)",
    border: "1px solid var(--danger)",
    borderRadius: "var(--radius-sm)",
    color: "var(--danger)",
    fontSize: 12.5,
    marginBottom: 10,
  },
  formRow2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },
  formRow3: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 14,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-dim)",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    background: "#0c1219",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "9px 12px",
    background: "#0c1219",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13,
    outline: "none",
    textTransform: "capitalize",
  },
  cancelBtn: {
    padding: "8px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-dim)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  },
  saveBtn: {
    padding: "8px 18px",
    background: "var(--primary)",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
  },
};
