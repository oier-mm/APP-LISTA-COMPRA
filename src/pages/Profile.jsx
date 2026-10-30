import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, deleteUserAccount } from "../services/authService";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "../components/Navbar";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para el modal de borrar cuenta
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          nombre: currentUser.displayName || currentUser.email.split("@")[0],
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!password) {
      setDeleteError("Por favor, introduce tu contraseña.");
      return;
    }

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteUserAccount(password);
      navigate("/");
    } catch (error) {
      console.error("Error al borrar cuenta:", error);
      setDeleteError("Contraseña incorrecta o error al eliminar la cuenta.");
      setDeleting(false);
    }
  };

  return (
    <div className="page-container" style={{ overflow: "hidden" }}>
      <div className="content-container mobile-layout" style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>

        <div className="fixed-header-area" style={{ flexShrink: 0 }}>
          <div className="top-bar" style={{ marginBottom: "8px" }}>
            <h1>Mi Perfil</h1>
            <button
              type="button"
              className="profile-button"
              onClick={() => navigate(-1)}
            >
              ←
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBottom: "70px", overflow: "hidden" }}>
          
          {loading ? (
            <p style={{ textAlign: "center", color: "#666" }}>Cargando perfil...</p>
          ) : (
            <>
              {/* Tarjeta de Información Personal más compacta */}
              <div className="card" style={{ textAlign: "center", marginBottom: "14px", padding: "16px" }}>
                <div style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  backgroundColor: "#2f855a",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  margin: "0 auto 10px auto",
                  fontWeight: "bold"
                }}>
                  {user?.email ? user.email.charAt(0).toUpperCase() : "👤"}
                </div>

                <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#1a202c", margin: "0 0 2px 0", textTransform: "capitalize" }}>
                  {user?.nombre || "Usuario"}
                </h2>
                <p style={{ fontSize: "13px", color: "#718096", margin: "0 0 12px 0" }}>
                  {user?.email || "No disponible"}
                </p>

                {/* Detalles extra */}
                <div style={{ 
                  background: "#f7fafc", 
                  borderRadius: "10px", 
                  padding: "8px 12px", 
                  textAlign: "left",
                  border: "1px solid #edf2f7",
                  fontSize: "12px",
                  color: "#4a5568",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  wordBreak: "break-all"
                }}>
                  <div><strong>ID de Usuario:</strong> <span style={{ color: "#718096", fontSize: "10px" }}>{user?.uid || "N/A"}</span></div>
                  <div><strong>Método de acceso:</strong> Correo electrónico</div>
                </div>
              </div>

              {/* Acciones */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleLogout}
                  style={{ backgroundColor: "#3182ce", padding: "12px" }}
                >
                  CERRAR SESIÓN
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => navigate(-1)}
                  style={{ padding: "12px" }}
                >
                  ← VOLVER
                </button>

                <div style={{ textAlign: "center", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e53e3e",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: "4px"
                    }}
                  >
                    ⚠️ Borrar cuenta permanentemente
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

        <Navbar />

        {/* MODAL PARA CONFIRMAR BORRADO DE CUENTA CON CONTRASEÑA */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ padding: "20px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#e53e3e", marginBottom: "10px" }}>
                ¿Eliminar cuenta?
              </h2>
              <p style={{ fontSize: "12px", color: "#4a5568", marginBottom: "12px", lineHeight: "1.4" }}>
                Esta acción es irreversible. Se borrarán todos tus datos y listas asociadas. Introduce tu contraseña para confirmar:
              </p>

              <form onSubmit={handleDeleteAccount}>
                <input
                  type="password"
                  className="input"
                  placeholder="Introduce tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ marginBottom: "10px" }}
                  autoFocus
                />

                {deleteError && (
                  <div style={{ color: "#e53e3e", fontSize: "11px", marginBottom: "10px", fontWeight: "bold" }}>
                    ⚠️ {deleteError}
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setPassword("");
                      setDeleteError("");
                    }}
                    disabled={deleting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="primary-button"
                    style={{ backgroundColor: "#e53e3e" }}
                    disabled={deleting}
                  >
                    {deleting ? "BORRANDO..." : "ELIMINAR"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}