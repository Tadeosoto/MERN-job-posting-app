import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout, isAdmin, canPostJobs } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">💼</span>
          <div>
            <strong>JobBoard</strong>
            <small>Posting dashboard</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" end className="nav-link">
            <span>📋</span> Empleos
          </NavLink>
          {canPostJobs && (
            <NavLink to="/dashboard/new" className="nav-link">
              <span>➕</span> Publicar
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/users" className="nav-link">
              <span>👥</span> Usuarios
            </NavLink>
          )}
        </nav>

        <div className="sidebar-user">
          {user?.pic ? (
            <img src={user.pic} alt="" className="avatar" />
          ) : (
            <div className="avatar avatar-fallback">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="sidebar-user-info">
            <strong>{user?.name}</strong>
            <span className={`role-badge role-${user?.role}`}>
              {user?.role}
            </span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
