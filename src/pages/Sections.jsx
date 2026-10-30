import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getSections, leaveOrDeleteSection } from "../services/sectionService";
import Navbar from "../components/Navbar";

import "../styles/sections.css";

export default function Sections() {
  const navigate = useNavigate();
  
  // Cargamos primero de localStorage si existe para que aparezcan al instante
  const [secciones, setSecciones] = useState(() => {
    const cached = localStorage.getItem("cached_secciones");
    return cached ? JSON.parse(cached) : [];
  });
  
  const [loading, setLoading] = useState(secciones.length === 0);
  const [openMenuId, setOpenMenuId] = useState(null);

  // Estado para el modal de confirmar salida/borrado
  const [sectionToLeave, setSectionToLeave] = useState(null);
  const [leaving, setLeaving] = useState(false);

  // Estado para mostrar aviso visual de "Copiado"
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    // Esperamos a que Firebase confirme el usuario logueado de forma segura
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      await fetchSecciones();
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Cerrar menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".section-card-wrapper")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchSecciones = async () => {
    try {
      const data = await getSections();
      setSecciones(data);
      localStorage.setItem("cached_secciones", JSON.stringify(data));
    } catch (error) {
      console.error("Error al cargar secciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSection = (idSeccion) => {
    localStorage.setItem("seccionActual", idSeccion);
    navigate("/listas");
  };

  const handleToggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const handleCopyCode = (codigo, idSec, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(codigo);
    setCopiedId(idSec);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleOpenLeaveModal = (sec, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setSectionToLeave(sec);
  };

  const handleConfirmLeave = async () => {
    if (!sectionToLeave) return;
    setLeaving(true);
    try {
      await leaveOrDeleteSection(sectionToLeave.id);
      if (localStorage.getItem("seccionActual") === sectionToLeave.id) {
        localStorage.removeItem("seccionActual");
      }
      const nuevasSecciones = secciones.filter((s) => s.id !== sectionToLeave.id);
      setSecciones(nuevasSecciones);
      localStorage.setItem("cached_secciones", JSON.stringify(nuevasSecciones));
      setSectionToLeave(null);
    } catch (error) {
      console.error("Error al abandonar la sección:", error);
      alert("No se pudo completar la acción. Inténtalo de nuevo.");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

        <div className="fixed-header-area">
          <div className="top-bar">
            <h1>Mis Secciones</h1>
            <button
              type="button"
              className="profile-button"
              onClick={() => navigate("/perfil")}
            >
              👤
            </button>
          </div>

          {/* Botones para Crear y Unirse a una sección */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button
              type="button"
              className="primary-button"
              style={{ flex: 1, margin: 0 }}
              onClick={() => navigate("/crear-seccion")}
            >
              NUEVA SECCIÓN
            </button>

            <button
              type="button"
              className="secondary-button"
              style={{ flex: 1, margin: 0, backgroundColor: "#edf2f7", color: "#2d3748", border: "1px solid #cbd5e0", fontWeight: "bold", borderRadius: "8px", cursor: "pointer" }}
              onClick={() => navigate("/unirse-seccion")}
            >
              UNIRSE A SECCIÓN
            </button>
          </div>
        </div>

        <div className="scrollable-products-area">
          {loading && secciones.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>Cargando secciones...</p>
          ) : secciones.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
              No tienes ninguna sección. ¡Crea una o únete a una existente!
            </p>
          ) : (
            secciones.map((sec) => {
              const isOpen = openMenuId === sec.id;
              const numPersonas = sec.miembros ? sec.miembros.length : 1;
              
              // AQUÍ ESTÁ EL CAMBIO: Usamos el ID completo en lugar de recortarlo
              const codigoSeccion = sec.codigo || sec.id;

              return (
                <div key={sec.id} className="section-card-wrapper" style={{ position: "relative", marginBottom: "12px" }}>
                  <div
                    className={`card ${isOpen ? "expanded" : ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      padding: "16px 20px"
                    }}
                    onClick={() => handleSelectSection(sec.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span style={{ fontSize: "28px" }}>{sec.icono || "🏠"}</span>
                      <div>
                        <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#1a202c", margin: 0 }}>
                          {sec.nombre}
                        </h2>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#718096" }}>
                          👤 {numPersonas} {numPersonas === 1 ? "persona" : "personas"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button
                        type="button"
                        className="section-menu-btn"
                        onClick={(e) => handleToggleMenu(sec.id, e)}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "#718096",
                          cursor: "pointer",
                          padding: "4px 8px"
                        }}
                      >
                        ⋮
                      </button>
                    </div>
                  </div>

                  {/* Panel desplegable con código completo y botón de copiar */}
                  {isOpen && (
                    <div
                      className="section-dropdown-panel"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        zIndex: 20,
                        padding: "12px",
                        marginTop: "8px"
                      }}
                    >
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "#f7fafc",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1px solid #edf2f7",
                        marginBottom: "10px",
                        gap: "8px",
                        overflowX: "auto"
                      }}>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#4a5568", wordBreak: "break-all" }}>
                          CÓDIGO: <strong style={{ color: "#2f855a", letterSpacing: "0.5px" }}>{codigoSeccion}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(codigoSeccion, sec.id, e)}
                          style={{
                            background: "#eaf5ea",
                            border: "1px solid #a5d6a7",
                            color: "#2f855a",
                            fontWeight: "700",
                            fontSize: "12px",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            flexShrink: 0
                          }}
                        >
                          {copiedId === sec.id ? "¡Copiado! ✓" : "Copiar 📋"}
                        </button>
                      </div>

                      <button
                        type="button"
                        className="leave-section-btn"
                        onClick={(e) => handleOpenLeaveModal(sec, e)}
                        style={{
                          background: "#fff5f5",
                          border: "1px solid #feb2b2",
                          color: "#e53e3e",
                          fontWeight: "700",
                          fontSize: "13px",
                          padding: "10px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          textAlign: "center",
                          width: "100%"
                        }}
                      >
                        Abandonar sección
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <Navbar />

        {/* MODAL DE CONFIRMACIÓN PARA ABANDONAR */}
        {sectionToLeave && (
          <div className="modal-overlay" onClick={() => setSectionToLeave(null)}>
            <div className="modal-container leave-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-leave-title">Abandonar sección</h2>
              <p className="modal-leave-text">
                {sectionToLeave.miembros && sectionToLeave.miembros.length <= 1 ? (
                  <>
                    Al ser la <strong>única persona</strong> en esta sección, si la abandonas <strong>se borrará por completo</strong>. ¿Estás seguro?
                  </>
                ) : (
                  <>
                    ¿Seguro que quieres abandonar la sección <strong>"{sectionToLeave.nombre}"</strong>?
                  </>
                )}
              </p>

              <div className="modal-leave-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setSectionToLeave(null)}
                  disabled={leaving}
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  className="primary-button leave-confirm-btn"
                  style={{ backgroundColor: "#e53e3e !important" }}
                  onClick={handleConfirmLeave}
                  disabled={leaving}
                >
                  {leaving ? "PROCESANDO..." : "ABANDONAR"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}