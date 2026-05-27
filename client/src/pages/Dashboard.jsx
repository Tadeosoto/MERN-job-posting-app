import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jobsApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";

export default function Dashboard() {
  const { canPostJobs } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingJob, setEditingJob] = useState(null);

  const limit = 9;

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await jobsApi.list({
        page,
        limit,
        search: search || undefined,
        sort: "-createdAt",
      });
      setJobs(res.data || []);
      setTotal(res.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleDelete = async (job) => {
    if (!window.confirm(`¿Eliminar "${job.title}"?`)) return;
    try {
      await jobsApi.delete(job._id);
      loadJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (data) => {
    await jobsApi.update(editingJob._id, data);
    setEditingJob(null);
    loadJobs();
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Empleos</h1>
          <p className="page-subtitle">
            {total} vacante{total !== 1 ? "s" : ""} en total
          </p>
        </div>
        {canPostJobs && (
          <Link to="/dashboard/new" className="btn btn-primary">
            + Publicar empleo
          </Link>
        )}
      </header>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Buscar por título…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">
          Buscar
        </button>
        {search && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
          >
            Limpiar
          </button>
        )}
      </form>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="page-center">
          <div className="spinner" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <p>No hay empleos{search ? " con ese criterio" : ""}.</p>
          {canPostJobs && (
            <Link to="/dashboard/new" className="btn btn-primary">
              Publicar el primero
            </Link>
          )}
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              canManage={canPostJobs}
              onEdit={setEditingJob}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}

      {editingJob && (
        <div className="modal-overlay" onClick={() => setEditingJob(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar empleo</h2>
            <JobForm
              initial={{
                title: editingJob.title || "",
                company: editingJob.company || "",
                location: editingJob.location || "",
                salary: editingJob.salary ?? "",
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingJob(null)}
              submitLabel="Actualizar"
            />
          </div>
        </div>
      )}
    </div>
  );
}
