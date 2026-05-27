import { useState } from "react";

const empty = { title: "", company: "", location: "", salary: "" };

export default function JobForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [form, setForm] = useState(initial || empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        salary: form.salary === "" ? undefined : Number(form.salary),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {error && <div className="alert alert-error">{error}</div>}

      <label>
        Título del puesto *
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="ej. Full Stack Developer"
        />
      </label>

      <label>
        Empresa
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Nombre de la empresa"
        />
      </label>

      <label>
        Ubicación
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Remoto, CDMX, etc."
        />
      </label>

      <label>
        Salario (anual USD)
        <input
          name="salary"
          type="number"
          min="0"
          value={form.salary}
          onChange={handleChange}
          placeholder="85000"
        />
      </label>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando…" : submitLabel || "Guardar"}
        </button>
      </div>
    </form>
  );
}
