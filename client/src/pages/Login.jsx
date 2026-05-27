import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-panel auth-panel-form">
        <div className="auth-header">
          <span className="brand-icon lg">💼</span>
          <h1>Bienvenido de nuevo</h1>
          <p>Inicia sesión para gestionar empleos</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="demo-credentials">
          <strong>Cuenta admin (local)</strong>
          <p>
            Email: <code>admin@example.com</code>
            <br />
            Contraseña: <code>admin123</code>
          </p>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setEmail("admin@example.com");
              setPassword("admin123");
            }}
          >
            Rellenar credenciales admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="tu@email.com"
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Entrando…" : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>

      <div className="auth-panel auth-panel-visual">
        <div className="visual-content">
          <h2>Publica y gestiona vacantes</h2>
          <p>
            Dashboard moderno para employers y admins. Los employees reciben
            alertas por correo al publicar un nuevo empleo.
          </p>
        </div>
      </div>
    </div>
  );
}
