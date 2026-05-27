import { Navigate, useNavigate } from "react-router-dom";
import { jobsApi } from "../api/client";
import JobForm from "../components/JobForm";
import { useAuth } from "../context/AuthContext";

export default function PostJob() {
  const { canPostJobs } = useAuth();
  const navigate = useNavigate();

  if (!canPostJobs) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCreate = async (data) => {
    await jobsApi.create(data);
    navigate("/dashboard");
  };

  return (
    <div className="page page-narrow">
      <header className="page-header">
        <div>
          <h1>Publicar empleo</h1>
          <p className="page-subtitle">
            Los employees recibirán un correo con los detalles
          </p>
        </div>
      </header>
      <JobForm
        onSubmit={handleCreate}
        onCancel={() => navigate("/dashboard")}
        submitLabel="Publicar empleo"
      />
    </div>
  );
}
