import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLists, completeList, deleteList } from "../services/listService";
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";

import "../styles/lists.css";

export default function Lists() {
  const navigate = useNavigate();
  const [listas, setListas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado del desplegable activo (ID de la lista abierta)
  const [openMenuId, setOpenMenuId] = useState(null);

  // Estado para el modal de confirmación "Completar lista"
  const [listToComplete, setListToComplete] = useState(null);
  const [completing, setCompleting] = useState(false);

  // Estado para el modal de confirmación "Borrar lista"
  const [listToDelete, setListToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const idSeccion = localStorage.getItem("seccionActual");

  useEffect(() => {
    if (!idSeccion) {
      navigate("/secciones");
      return;
    }
    fetchListasYProgreso();
  }, [idSeccion]);

  // Listener global para cerrar el desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".list-card-wrapper")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchListasYProgreso = async () => {
    setLoading(true);
    try {
      const rawLists = await getLists(idSeccion);

      if (rawLists.length === 0) {
        setListas([]);
        setLoading(false);
        return;
      }

      const idsListas = rawLists.map((l) => l.id);
      const qProductos = query(
        collection(db, "productos"),
        where("idLista", "in", idsListas.slice(0, 30))
      );
      const prodSnap = await getDocs(qProductos);

      const conteoMap = {};
      prodSnap.docs.forEach((doc) => {
        const p = doc.data();
        if (!conteoMap[p.idLista]) {
          conteoMap[p.idLista] = { total: 0, cogidos: 0 };
        }
        conteoMap[p.idLista].total += 1;
        if (p.cogido) {
          conteoMap[p.idLista].cogidos += 1;
        }
      });

      const listasConProgreso = rawLists.map((lista) => {
        const stats = conteoMap[lista.id] || { total: 0, cogidos: 0 };
        return {
          ...lista,
          totalProductos: stats.total,
          cogidosProductos: stats.cogidos,
        };
      });

      setListas(listasConProgreso);
    } catch (error) {
      console.error("Error al cargar listas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenList = (idLista) => {
    localStorage.setItem("listaActual", idLista);
    navigate("/productos");
  };

  // Alternar apertura/cierre de los 3 puntos
  const handleToggleMenu = (id, e) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // Abrir modal completar
  const handleOpenCompleteModal = (lista, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setListToComplete(lista);
  };

  const handleConfirmComplete = async () => {
    if (!listToComplete) return;
    setCompleting(true);
    try {
      await completeList(listToComplete.id);
      if (localStorage.getItem("listaActual") === listToComplete.id) {
        localStorage.removeItem("listaActual");
      }
      setListas((prev) => prev.filter((l) => l.id !== listToComplete.id));
      setListToComplete(null);
    } catch (error) {
      console.error("Error al completar la lista:", error);
    } finally {
      setCompleting(false);
    }
  };

  // Abrir modal borrar
  const handleOpenDeleteModal = (lista, e) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setListToDelete(lista);
  };

  const handleConfirmDelete = async () => {
    if (!listToDelete) return;
    setDeleting(true);
    try {
      await deleteList(listToDelete.id);
      if (localStorage.getItem("listaActual") === listToDelete.id) {
        localStorage.removeItem("listaActual");
      }
      setListas((prev) => prev.filter((l) => l.id !== listToDelete.id));
      setListToDelete(null);
    } catch (error) {
      console.error("Error al borrar la lista:", error);
      alert("No se pudo borrar la lista. Inténtalo de nuevo.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

        <div className="fixed-header-area">
          <div className="top-bar">
            <h1>Mis Listas</h1>
            <button
              type="button"
              className="profile-button"
              onClick={() => navigate("/perfil")}
            >
              👤
            </button>
          </div>

          <button
            type="button"
            className="primary-button"
            style={{ marginBottom: "16px" }}
            onClick={() => navigate("/crear-lista")}
          >
            NUEVA LISTA
          </button>
        </div>

        <div className="scrollable-products-area">
          {loading ? (
            <p style={{ textAlign: "center", color: "#666" }}>Cargando listas...</p>
          ) : listas.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", marginTop: "40px" }}>
              No hay ninguna lista activa en esta sección. ¡Crea una nueva!
            </p>
          ) : (
            listas.map((lista) => {
              const total = lista.totalProductos || 0;
              const cogidos = lista.cogidosProductos || 0;
              const porcentaje = total > 0 ? Math.round((cogidos / total) * 100) : 0;
              const isComplete = total > 0 && cogidos === total;
              const isOpen = openMenuId === lista.id;

              return (
                <div key={lista.id} className="list-card-wrapper">
                  <div
                    className={`list-card-fancy ${isOpen ? "expanded" : ""}`}
                    onClick={() => handleOpenList(lista.id)}
                  >
                    <div className="list-card-header">
                      <div className="list-title-row">
                        {/* AQUÍ ESTÁ EL CAMBIO: Usa lista.icono en lugar del fijo */}
                        <span className="list-icon">{lista.icono || "📋"}</span>
                        <h2 className="list-title">{lista.nombre}</h2>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className={`list-progress-badge ${isComplete ? "complete" : ""}`}>
                          {cogidos} / {total} {isComplete ? "✅" : ""}
                        </span>

                        <button
                          type="button"
                          className="section-menu-btn"
                          onClick={(e) => handleToggleMenu(lista.id, e)}
                        >
                          ⋮
                        </button>
                      </div>
                    </div>

                    <div className="list-card-progress-bg">
                      <div
                        className="list-card-progress-fill"
                        style={{ width: porcentaje + "%" }}
                      />
                    </div>

                    {/* DESPLEGABLE DE LOS 3 PUNTOS (BORRAR LISTA) */}
                    {isOpen && (
                      <div
                        className="section-dropdown-panel"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="leave-section-btn"
                          onClick={(e) => handleOpenDeleteModal(lista, e)}
                        >
                          Borrar lista
                        </button>
                      </div>
                    )}

                    {/* BOTÓN DE LISTA COMPLETADA */}
                    {isComplete && (
                      <div style={{ marginTop: "12px" }}>
                        <button
                          type="button"
                          className="complete-list-btn-card"
                          onClick={(e) => handleOpenCompleteModal(lista, e)}
                        >
                          🎉 LISTA COMPLETADA
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <Navbar />

        {/* MODAL DE CONFIRMACIÓN: COMPLETAR LISTA */}
        {listToComplete && (
          <div className="modal-overlay" onClick={() => setListToComplete(null)}>
            <div className="modal-container leave-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-leave-title">Completar lista</h2>
              <p className="modal-leave-text">
                ¿Seguro que quieres dar por completada la lista <strong>"{listToComplete.nombre}"</strong>? Sus datos se guardarán para las estadísticas.
              </p>

              <div className="modal-leave-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setListToComplete(null)}
                  disabled={completing}
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  className="primary-button leave-confirm-btn"
                  onClick={handleConfirmComplete}
                  disabled={completing}
                >
                  {completing ? "GUARDANDO..." : "COMPLETAR"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE CONFIRMACIÓN: BORRAR LISTA */}
        {listToDelete && (
          <div className="modal-overlay" onClick={() => setListToDelete(null)}>
            <div className="modal-container leave-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="modal-leave-title">Borrar lista</h2>
              <p className="modal-leave-text">
                ¿Seguro que quieres borrar la lista <strong>"{listToDelete.nombre}"</strong>? Se eliminará para todos los miembros de la sección.
              </p>

              <div className="modal-leave-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setListToDelete(null)}
                  disabled={deleting}
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  className="primary-button leave-confirm-btn"
                  style={{ backgroundColor: "#e53e3e !important" }}
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "BORRANDO..." : "BORRAR"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}