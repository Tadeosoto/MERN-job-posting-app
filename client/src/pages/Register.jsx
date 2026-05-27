import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employer",
  });
  const [pic, setPic] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("password", form.password);
      data.append("role", form.role);
      if (pic) data.append("pic", pic);

      await authApi.register(data);
      setSuccess("Cuenta creada. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
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
          <h1>Crear cuenta</h1>
          <p>Únete como employer o employee</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nombre
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Contraseña
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </label>
          <label>
            Rol
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="employer">Employer (publicar empleos)</option>
              <option value="employee">Employee (recibir alertas)</option>
            </select>
          </label>
          <label>
            Foto de perfil (opcional)
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPic(e.target.files?.[0] || null)}
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Creando…" : "Registrarse"}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>

      <div className="auth-panel auth-panel-visual">
        <div className="visual-content">
          <h2>Elige tu rol</h2>
          <p>
            <strong>Employer</strong> publica vacantes. <strong>Employee</strong>{" "}
            recibe notificaciones por email cuando hay nuevas oportunidades.
          </p>
        </div>
      </div>
    </div>
  );
}
