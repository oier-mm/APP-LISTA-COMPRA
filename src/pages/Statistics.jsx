import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getSections } from "../services/sectionService";
import Navbar from "../components/Navbar";

import "../styles/products.css";

const CATEGORIAS_FILTRO = [
  { id: "todas", nombre: "Todas", icono: "🛒" },
  { id: "Lácteos y Huevos", nombre: "Lácteos", icono: "🧀" },
  { id: "Pan y Bollería", nombre: "Panadería", icono: "🍞" },
  { id: "Carne", nombre: "Carne", icono: "🥩" },
  { id: "Pescado y Marisco", nombre: "Pescado", icono: "🐟" },
  { id: "Verduras y Hortalizas", nombre: "Verduras", icono: "🥦" },
  { id: "Frutas", nombre: "Frutas", icono: "🍎" },
  { id: "Conservas y Enlatados", nombre: "Conservas", icono: "🥫" },
  { id: "Snacks y Frutos Secos", nombre: "Snacks", icono: "🍿" },
  { id: "Despensa y Repostería", nombre: "Despensa", icono: "🌾" },
  { id: "Aceites y Condimentos", nombre: "Condimentos", icono: "🫒" },
  { id: "Dulces y Galletas", nombre: "Dulces", icono: "🍪" },
  { id: "Bebidas", nombre: "Bebidas", icono: "🥤" },
  { id: "Limpieza y Hogar", nombre: "Limpieza", icono: "🧹" },
];

export default function Statistics() {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [selectedSeccionId, setSelectedSeccionId] = useState("");
  const [productosRaw, setProductosRaw] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de Filtro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriaSel, setCategoriaSel] = useState("todas");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [orden, setOrden] = useState("desc");

  // 1. Verificar Usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchSecciones(user.uid);
      } else {
        const localUid = localStorage.getItem("userId") || localStorage.getItem("uid");
        if (localUid) {
          fetchSecciones(localUid);
        } else {
          setLoading(false);
          navigate("/login");
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Cargar Secciones
  const fetchSecciones = async (uid) => {
    try {
      let docs = [];
      try {
        docs = await getSections(uid);
      } catch (err) {
        const q = query(collection(db, "secciones"), where("uid", "==", uid));
        const snap = await getDocs(q);
        docs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      }

      setSecciones(docs || []);
      if (docs && docs.length > 0) {
        setSelectedSeccionId(docs[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error al obtener secciones:", error);
      setLoading(false);
    }
  };

  // 3. Cargar Productos SÓLO de las Listas Completadas
  useEffect(() => {
    if (selectedSeccionId) {
      fetchProductosSeccion(selectedSeccionId);
    }
  }, [selectedSeccionId]);

  const fetchProductosSeccion = async (seccionId) => {
    setLoading(true);
    try {
      // FILTRAR SOLO LISTAS QUE ESTÉN COMPLETADAS / ARCHIVADAS
      const qListas = query(
        collection(db, "listas"),
        where("idSeccion", "==", seccionId),
        where("archivada", "==", true)
      );
      const listasSnap = await getDocs(qListas);
      const idsListas = listasSnap.docs.map((doc) => doc.id);

      if (idsListas.length === 0) {
        setProductosRaw([]);
        setTopProductos([]);
        setLoading(false);
        return;
      }

      const qProductos = query(
        collection(db, "productos"),
        where("idLista", "in", idsListas.slice(0, 30))
      );
      const prodSnap = await getDocs(qProductos);
      const listaProds = prodSnap.docs.map((d) => d.data());

      setProductosRaw(listaProds);
    } catch (error) {
      console.error("Error al obtener productos de listas completadas:", error);
    } finally {
      setLoading(false);
    }
  };

  // 4. Aplicar Filtros
  useEffect(() => {
    if (!productosRaw) return;

    const conteoMap = {};

    productosRaw.forEach((data) => {
      if (!data.cogido) return;

      if (categoriaSel !== "todas" && data.categoria !== categoriaSel) {
        return;
      }

      const fechaRef = data.fechaCompra || data.fechaCreacion || data.fecha;
      if (fechaRef) {
        const fechaProd = new Date(fechaRef);
        if (fechaDesde) {
          const fDesde = new Date(fechaDesde);
          fDesde.setHours(0, 0, 0, 0);
          if (fechaProd < fDesde) return;
        }
        if (fechaHasta) {
          const fHasta = new Date(fechaHasta);
          fHasta.setHours(23, 59, 59, 999);
          if (fechaProd > fHasta) return;
        }
      }

      const nombreClean = (data.nombre || data.tipo || "Producto").toUpperCase().trim();
      const cantidad = Number(data.cantidad) || 1;

      if (conteoMap[nombreClean]) {
        conteoMap[nombreClean] += cantidad;
      } else {
        conteoMap[nombreClean] = cantidad;
      }
    });

    const listaOrdenada = Object.entries(conteoMap)
      .map(([nombre, total]) => ({ nombre, total }))
      .sort((a, b) => (orden === "desc" ? b.total - a.total : a.total - b.total));

    setTopProductos(listaOrdenada);
  }, [productosRaw, categoriaSel, fechaDesde, fechaHasta, orden]);

  const handleRestablecer = () => {
    setCategoriaSel("todas");
    setFechaDesde("");
    setFechaHasta("");
    setOrden("desc");
  };

  const filtrosActivosCount =
    (categoriaSel !== "todas" ? 1 : 0) +
    (fechaDesde ? 1 : 0) +
    (fechaHasta ? 1 : 0) +
    (orden !== "desc" ? 1 : 0);

  const renderResultados = () => {
    if (loading) {
      return <p style={{ textAlign: "center", color: "#666" }}>Cargando datos...</p>;
    }
    if (topProductos.length === 0) {
      return (
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
          No hay estadísticas todavía. Debes dar por completada una lista para incluir sus productos.
        </p>
      );
    }

    const maxTotal = topProductos[0]?.total || 1;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {topProductos.map((item, index) => {
          const porcentajeBarra = Math.round((item.total / maxTotal) * 100);
          return (
            <div key={item.nombre}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "800",
                  fontSize: "14px",
                  marginBottom: "4px",
                  color: "#1a202c",
                }}
              >
                <span>{"#" + (index + 1) + " " + item.nombre}</span>
                <span style={{ color: "#2e7d32" }}>{item.total + " ud."}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: porcentajeBarra + "%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

        <div className="fixed-header-area">
          <div className="top-bar">
            <h1>Estadísticas</h1>
            <button
              type="button"
              className="profile-button"
              onClick={() => navigate("/perfil")}
            >
              👤
            </button>
          </div>
        </div>

        <div className="scrollable-products-area">

          <div className="card" style={{ marginBottom: "16px" }}>
            <span className="section-label">1. Selecciona una sección:</span>
            <select
              className="input"
              style={{ marginBottom: "12px" }}
              value={selectedSeccionId}
              onChange={(e) => setSelectedSeccionId(e.target.value)}
            >
              {secciones.length === 0 ? (
                <option value="">No hay secciones creadas</option>
              ) : (
                secciones.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.nombre.toUpperCase()}
                  </option>
                ))
              )}
            </select>

            <button
              type="button"
              className="filter-trigger-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <span>⚙️ Filtros</span>
              {filtrosActivosCount > 0 && (
                <span className="filter-badge-count">{filtrosActivosCount}</span>
              )}
            </button>
          </div>

          <div className="card">
            <h2 className="section-label" style={{ fontSize: "15px", marginBottom: "16px" }}>
              🏆 Productos más comprados
            </h2>
            {renderResultados()}
          </div>

        </div>

        <Navbar />

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              
              <div className="modal-header">
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>
                <h2 className="modal-title">Filtros</h2>
                <div style={{ width: "28px" }} />
              </div>

              <div className="modal-body">

                <div className="filter-section">
                  <h3 className="filter-subtitle">Categoría de producto</h3>
                  <div className="filter-categories-grid">
                    {CATEGORIAS_FILTRO.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className={`filter-cat-card ${
                          categoriaSel === cat.id ? "selected" : ""
                        }`}
                        onClick={() => setCategoriaSel(cat.id)}
                      >
                        <span className="filter-cat-icon">{cat.icono}</span>
                        <span className="filter-cat-name">{cat.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <hr className="modal-divider" />

                <div className="filter-section">
                  <h3 className="filter-subtitle">Rango de fecha de compra</h3>
                  <div className="date-inputs-row">
                    <div className="date-field">
                      <label>Desde:</label>
                      <input
                        type="date"
                        className="input"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                      />
                    </div>
                    <div className="date-field">
                      <label>Hasta:</label>
                      <input
                        type="date"
                        className="input"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <hr className="modal-divider" />

                <div className="filter-section">
                  <h3 className="filter-subtitle">Ordenar por</h3>
                  <div className="sort-chips-row">
                    <button
                      type="button"
                      className={`sort-chip ${orden === "desc" ? "selected" : ""}`}
                      onClick={() => setOrden("desc")}
                    >
                      🔥 Más comprados primero
                    </button>
                    <button
                      type="button"
                      className={`sort-chip ${orden === "asc" ? "selected" : ""}`}
                      onClick={() => setOrden("asc")}
                    >
                      ❄️ Menos comprados primero
                    </button>
                  </div>
                </div>

              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="reset-btn"
                  onClick={handleRestablecer}
                >
                  Restablecer
                </button>
                <button
                  type="button"
                  className="primary-button apply-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Ver resultados ({topProductos.length})
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}