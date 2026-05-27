import { useCallback, useEffect, useState } from "react";
import { usersApi } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    setError("");
    usersApi
      .list()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (target) => {
    if (target._id === currentUser?._id) {
      alert("No puedes eliminar tu propia cuenta.");
      return;
    }

    if (
      !window.confirm(
        `¿Eliminar a "${target.name}" (${target.email})? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    setDeletingId(target._id);
    try {
      await usersApi.delete(target._id);
      setUsers((prev) => prev.filter((u) => u._id !== target._id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Usuarios</h1>
          <p className="page-subtitle">Panel de administración</p>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="page-center">
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u._id === currentUser?._id;
                return (
                  <tr key={u._id}>
                    <td>
                      <div className="table-user">
                        {u.pic ? (
                          <img src={u.pic} alt="" className="avatar avatar-sm" />
                        ) : (
                          <div className="avatar avatar-sm avatar-fallback">
                            {u.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                        {u.name}
                        {isSelf && (
                          <span className="you-badge">Tú</span>
                        )}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge role-${u.role}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {isSelf ? (
                        <span className="text-muted">—</span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={deletingId === u._id}
                          onClick={() => handleDelete(u)}
                        >
                          {deletingId === u._id ? "Eliminando…" : "Eliminar"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
