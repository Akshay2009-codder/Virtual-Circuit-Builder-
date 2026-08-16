import React from "react";

export function TableLoadingOverlay({ text = "Loading data…" }) {
  return (
    <div style={styles.loadingOverlay}>
      <div style={styles.spinner} />
      <span style={{ fontSize: 13, color: "var(--text-dim)", fontFamily: "var(--font-display)" }}>{text}</span>
    </div>
  );
}

export function TableEmptyState({ icon = "📦", title = "No records found", subtitle = "Try adjusting your search or filters." }) {
  return (
    <div style={styles.emptyContainer}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--text-dim)" }}>{subtitle}</div>
    </div>
  );
}

export function SortableTh({ field, currentSort, order, onSort, label, align = "left", width }) {
  const isActive = currentSort === field;
  return (
    <th
      onClick={() => onSort && onSort(field)}
      style={{
        ...styles.th,
        textAlign: align,
        width: width,
        cursor: onSort ? "pointer" : "default",
        userSelect: "none",
        color: isActive ? "var(--primary)" : "var(--text-dim)",
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        <span>{label}</span>
        {onSort && (
          <span style={{ fontSize: 10, opacity: isActive ? 1 : 0.4 }}>
            {isActive ? (order === "asc" ? "▲" : "▼") : "⇅"}
          </span>
        )}
      </div>
    </th>
  );
}

export function TablePagination({ total, page, perPage = 20, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (total <= 0) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(total, page * perPage);

  return (
    <div style={styles.paginationBar}>
      <div style={styles.pageInfo}>
        Showing <span style={{ color: "var(--text)", fontWeight: 600 }}>{start}</span> -{" "}
        <span style={{ color: "var(--text)", fontWeight: 600 }}>{end}</span> of{" "}
        <span style={{ color: "var(--text)", fontWeight: 600 }}>{total}</span> entries
      </div>

      <div style={styles.pageNav}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          style={styles.pageBtn}
          title="Previous page"
        >
          ← Prev
        </button>

        <span style={styles.pageIndicator}>
          Page <strong style={{ color: "var(--primary)" }}>{page}</strong> of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          style={styles.pageBtn}
          title="Next page"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

const styles = {
  loadingOverlay: {
    padding: "60px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  spinner: {
    width: 28,
    height: 28,
    border: "2.5px solid rgba(47, 214, 111, 0.2)",
    borderTopColor: "var(--primary)",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  emptyContainer: {
    padding: "50px 20px",
    textAlign: "center",
  },
  th: {
    padding: "12px 16px",
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontFamily: "var(--font-display)",
    borderBottom: "1px solid var(--border)",
    background: "rgba(16, 22, 29, 0.6)",
  },
  paginationBar: {
    padding: "14px 20px",
    borderTop: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    background: "rgba(14, 20, 27, 0.4)",
  },
  pageInfo: {
    fontSize: 12.5,
    color: "var(--text-dim)",
  },
  pageNav: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  pageIndicator: {
    fontSize: 12.5,
    color: "var(--text-dim)",
    margin: "0 4px",
  },
  pageBtn: {
    padding: "6px 12px",
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};
