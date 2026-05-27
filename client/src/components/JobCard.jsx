export default function JobCard({ job, onEdit, onDelete, canManage }) {
  const salary =
    job.salary != null && job.salary !== ""
      ? `$${Number(job.salary).toLocaleString()}`
      : "—";

  return (
    <article className="job-card">
      <div className="job-card-header">
        <h3>{job.title}</h3>
        <time dateTime={job.createdAt}>
          {new Date(job.createdAt).toLocaleDateString("es-MX", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
      </div>
      <ul className="job-meta">
        <li>
          <span>Empresa</span>
          <strong>{job.company || "—"}</strong>
        </li>
        <li>
          <span>Ubicación</span>
          <strong>{job.location || "—"}</strong>
        </li>
        <li>
          <span>Salario</span>
          <strong>{salary}</strong>
        </li>
      </ul>
      {canManage && (
        <div className="job-card-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(job)}>
            Editar
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(job)}
          >
            Eliminar
          </button>
        </div>
      )}
    </article>
  );
}
