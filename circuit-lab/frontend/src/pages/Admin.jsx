import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminShell from "../components/admin/AdminShell";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminProjects from "./admin/AdminProjects";
import AdminComponents from "./admin/AdminComponents";
import AdminReports from "./admin/AdminReports";
import AdminSettings from "./admin/AdminSettings";

export default function Admin() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL pathname
  function getTabFromPath(path) {
    if (path.includes("/users")) return "users";
    if (path.includes("/projects")) return "projects";
    if (path.includes("/components")) return "components";
    if (path.includes("/reports")) return "reports";
    if (path.includes("/settings")) return "settings";
    return "dashboard";
  }

  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  function handleSelectTab(tabKey) {
    setActiveTab(tabKey);
    const targetPath = tabKey === "dashboard" ? "/admin" : `/admin/${tabKey}`;
    navigate(targetPath);
  }

  return (
    <AdminShell activeTab={activeTab} onSelectTab={handleSelectTab}>
      {activeTab === "dashboard" && <AdminDashboard onNavigateTab={handleSelectTab} />}
      {activeTab === "users" && <AdminUsers />}
      {activeTab === "projects" && <AdminProjects />}
      {activeTab === "components" && <AdminComponents />}
      {activeTab === "reports" && <AdminReports />}
      {activeTab === "settings" && <AdminSettings />}
    </AdminShell>
  );
}