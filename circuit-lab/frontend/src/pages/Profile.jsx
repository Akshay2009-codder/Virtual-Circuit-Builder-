import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import client from "../api/client";
import { useAuth } from "../context/AuthContext";
import { timeAgo } from "../utils/timeAgo";

const STATUS_LABEL = {
  complete: "Operational",
  open: "Open Loop",
  short: "Short Circuit",
  no_source: "No Power",
};

const STATUS_COLOR = {
  complete: "#2fd66f",
  open: "#ffd32a",
  short: "#ff4757",
  no_source: "#6c7a85",
};

function initials(name) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Profile() {
  const { username } = useParams();
  const { user: viewer } = useAuth();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [savingBio, setSavingBio] = useState(false);

  function load() {
    setLoading(true);
    setNotFound(false);
    Promise.all([
      client.get(`/users/${username}`),
      client.get(`/users/${username}/projects`),
    ])
      .then(([profileRes, projectsRes]) => {
        setProfile(profileRes.data.user);
        setProjects(projectsRes.data.projects || []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [username]);

  async function toggleFollow() {
    if (!viewer) return;
    setFollowLoading(true);
    try {
      const res = await client.post(`/users/${username}/follow`);
      setProfile((p) => ({
        ...p,
        is_following: res.data.following,
        follower_count: res.data.follower_count,
      }));
    } finally {
      setFollowLoading(false);
    }
  }

  function startEditBio() {
    setBioDraft(profile.bio || "");
    setEditingBio(true);
  }

  async function saveBio() {
    setSavingBio(true);
    try {
      await client.patch("/users/me/bio", { bio: bioDraft });
      setProfile((p) => ({ ...p, bio: bioDraft }));
      setEditingBio(false);
    } finally {
      setSavingBio(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: "60px 6vw" }}>
          <p style={{ color: "var(--text-dim)" }}>Loading developer profile…</p>
        </div>
      </AppShell>
    );
  }

  if (notFound || !profile) {
    return (
      <AppShell>
        <div style={{ padding: "60px 6vw", maxWidth: 500 }}>
          <div style={styles.emptyCard}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <h3 style={{ margin: "0 0 8px", color: "var(--text)" }}>Profile Not Found</h3>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-dim)" }}>
              No user found with handle <strong>@{username}</strong>.
            </p>
            <Link to="/people" style={styles.backBtn}>
              ← Explore Creators Directory
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const isMe = profile.is_me;

  return (
    <AppShell>
      <div style={styles.page}>
        {/* DEVELOPER PROFILE HERO BANNER */}
        <section style={styles.profileHero}>
          <div style={styles.avatarBox}>
            <div style={styles.avatar}>{initials(profile.name)}</div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.nameRow}>
              <div>
                <h1 style={styles.name}>{profile.name}</h1>
                <div style={styles.usernameHandle}>
                  <span>@{profile.username}</span>
                  {profile.is_admin && <span style={styles.adminBadge}>SUPERADMIN</span>}
                </div>
              </div>

              {!isMe && viewer && (
                <button
                  onClick={toggleFollow}
                  disabled={followLoading}
                  style={{
                    ...styles.followBtn,
                    background: profile.is_following ? "rgba(255, 255, 255, 0.06)" : "#2fd66f",
                    color: profile.is_following ? "var(--text)" : "#0a0e13",
                    borderColor: profile.is_following ? "var(--border)" : "transparent",
                  }}
                >
                  {profile.is_following ? "✓ Following" : "+ Follow"}
                </button>
              )}
            </div>

            {/* Bio Section */}
            {editingBio ? (
              <div style={{ marginTop: 14 }}>
                <textarea
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  maxLength={280}
                  rows={3}
                  style={styles.bioTextarea}
                  placeholder="Describe your engineering focus or hardware projects…"
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={saveBio} disabled={savingBio} style={styles.saveBioBtn}>
                    {savingBio ? "Saving…" : "Save Bio"}
                  </button>
                  <button onClick={() => setEditingBio(false)} style={styles.cancelBioBtn}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.bioContainer}>
                <p style={styles.bioText}>
                  {profile.bio || (isMe ? "No bio yet. Tell the community what you build." : "No bio provided.")}
                </p>
                {isMe && (
                  <button onClick={startEditBio} style={styles.editBioLink}>
                    ✏️ {profile.bio ? "Edit" : "Add Bio"}
                  </button>
                )}
              </div>
            )}

            {/* Stats Capsule Row */}
            <div style={styles.statsRow}>
              <Link to={`/u/${profile.username}/followers`} style={styles.statCapsule}>
                <span style={styles.statNumber}>{profile.follower_count || 0}</span>
                <span style={styles.statLabel}>Followers</span>
              </Link>
              <Link to={`/u/${profile.username}/following`} style={styles.statCapsule}>
                <span style={styles.statNumber}>{profile.following_count || 0}</span>
                <span style={styles.statLabel}>Following</span>
              </Link>
              <div style={styles.statCapsule}>
                <span style={styles.statNumber}>{projects.length}</span>
                <span style={styles.statLabel}>Public Circuits</span>
              </div>
            </div>
          </div>
        </section>

        {/* PUBLIC CIRCUITS SHOWCASE */}
        <div style={styles.showcaseHeader}>
          <h2 style={styles.sectionTitle}>Public Circuits ({projects.length})</h2>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-dim)" }}>
            Schematics published by @{profile.username} to the community.
          </p>
        </div>

        {projects.length === 0 ? (
          <div style={styles.emptyShowcase}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-dim)" }}>
              {isMe
                ? "You haven't shared any circuits publicly yet. Open a project and click 'Share' to publish."
                : `@${profile.username} hasn't published any circuits yet.`}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {projects.map((p) => {
              const statusColor = STATUS_COLOR[p.last_run_status] || "var(--text-dim)";
              return (
                <Link key={p.id} to={`/circuits/${p.id}`} style={styles.circuitCard}>
                  <div style={styles.circuitCardTop}>
                    <h3 style={styles.circuitTitle}>{p.name}</h3>
                    {p.last_run_status && (
                      <span
                        style={{
                          ...styles.statusBadge,
                          color: statusColor,
                          background: `${statusColor}18`,
                          borderColor: `${statusColor}44`,
                        }}
                      >
                        ● {STATUS_LABEL[p.last_run_status] || "Simulated"}
                      </span>
                    )}
                  </div>

                  {p.description && <p style={styles.circuitDesc}>{p.description}</p>}

                  <div style={styles.circuitCardFooter}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={styles.metaStat}>❤️ {p.like_count || 0}</span>
                      <span style={styles.metaStat}>💬 {p.comment_count || 0}</span>
                      <span style={styles.metaStat}>🧩 {p.component_count || 0} parts</span>
                    </div>
                    <span style={styles.view3dTag}>Inspect 3D ➔</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

const styles = {
  page: {
    padding: "32px 5vw 80px",
    maxWidth: 1300,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },
  profileHero: {
    display: "flex",
    gap: 28,
    alignItems: "flex-start",
    padding: "32px 36px",
    background: "linear-gradient(135deg, rgba(16, 23, 32, 0.9) 0%, rgba(10, 14, 19, 0.95) 100%)",
    border: "1px solid var(--border-bright)",
    borderRadius: "var(--radius)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
    flexWrap: "wrap",
  },
  avatarBox: {
    flexShrink: 0,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #2fd66f 0%, #1f9a51 100%)",
    color: "#0a0e13",
    fontWeight: 800,
    fontSize: 28,
    display: "grid",
    placeItems: "center",
    boxShadow: "0 8px 24px rgba(47, 214, 111, 0.35)",
  },
  nameRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },
  name: {
    margin: "0 0 4px",
    fontSize: "clamp(22px, 2.8vw, 32px)",
    fontWeight: 800,
    color: "var(--text)",
  },
  usernameHandle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    color: "var(--text-dim)",
  },
  adminBadge: {
    fontSize: 10,
    fontWeight: 800,
    fontFamily: "var(--font-mono)",
    padding: "2px 6px",
    borderRadius: 4,
    background: "rgba(255, 71, 87, 0.15)",
    color: "#ff4757",
    border: "1px solid rgba(255, 71, 87, 0.4)",
  },
  followBtn: {
    padding: "8px 18px",
    borderRadius: "var(--radius-sm)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    border: "1px solid",
    transition: "all 0.15s ease",
  },
  bioContainer: {
    margin: "12px 0 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  bioText: {
    margin: 0,
    fontSize: 14,
    color: "var(--text)",
    lineHeight: 1.5,
  },
  editBioLink: {
    background: "none",
    border: "none",
    color: "#2fd66f",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  bioTextarea: {
    width: "100%",
    maxWidth: 500,
    padding: "10px 12px",
    background: "#080c10",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 13.5,
    outline: "none",
  },
  saveBioBtn: {
    padding: "6px 14px",
    background: "#2fd66f",
    color: "#0a0e13",
    border: "none",
    borderRadius: "var(--radius-sm)",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  cancelBioBtn: {
    padding: "6px 12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    fontSize: 12.5,
    cursor: "pointer",
  },
  statsRow: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginTop: 8,
  },
  statCapsule: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 14px",
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    textDecoration: "none",
    color: "var(--text)",
    fontSize: 13,
  },
  statNumber: {
    fontWeight: 800,
    fontFamily: "var(--font-mono)",
    color: "var(--primary)",
  },
  statLabel: {
    color: "var(--text-dim)",
  },
  showcaseHeader: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    color: "var(--text)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 20,
  },
  circuitCard: {
    background: "rgba(16, 22, 29, 0.8)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "20px",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "transform 0.15s ease, border-color 0.15s ease",
  },
  circuitCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  circuitTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: "var(--text)",
  },
  statusBadge: {
    fontSize: 10.5,
    fontWeight: 700,
    fontFamily: "var(--font-mono)",
    padding: "2px 8px",
    borderRadius: 8,
    border: "1px solid",
    whiteSpace: "nowrap",
  },
  circuitDesc: {
    margin: 0,
    fontSize: 13,
    color: "var(--text-dim)",
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  circuitCardFooter: {
    marginTop: "auto",
    paddingTop: 12,
    borderTop: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaStat: {
    fontSize: 12,
    color: "var(--text-dim)",
  },
  view3dTag: {
    fontSize: 12,
    fontWeight: 700,
    color: "var(--primary)",
  },
  emptyCard: {
    padding: "40px 20px",
    textAlign: "center",
    background: "rgba(16, 22, 29, 0.6)",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius)",
  },
  backBtn: {
    display: "inline-block",
    marginTop: 14,
    color: "var(--primary)",
    fontSize: 13.5,
    textDecoration: "none",
    fontWeight: 600,
  },
  emptyShowcase: {
    padding: "40px 20px",
    textAlign: "center",
    background: "rgba(16, 22, 29, 0.6)",
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius)",
  },
};