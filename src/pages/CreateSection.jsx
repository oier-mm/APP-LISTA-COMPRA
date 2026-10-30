import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSection } from "../services/sectionService";
import Navbar from "../components/Navbar";

import "../styles/products.css";

const ICONOS_SECCION = [
  "🎉", "🥳", "🍻", "🍷", "🍸", "🍹", "🍾", "🥂", 
  "🥃", "🥤", "🎵", "🎶", "🎤", "🎧", "🎸", "🎷", 
  "🍕", "🍔", "🍟", "🍿", "🎂", "🧁", "🍩", "🍫",
  "🏠", "👨‍👩‍👧‍👦", "🏢", "🧹", "💡", "🎯", "🛍️", "🛒",
  "⭐", "🔥", "🚀", "🔑", "💼", "⚽", "🎮"
];

export default function CreateSection() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("🎉");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert("Por favor, introduce un nombre para la sección.");
      return;
    }

    setLoading(true);
    try {
      const idSeccion = await createSection({
        nombre: nombre.trim().toUpperCase(),
        icono: icono, // Se guarda explícitamente el icono elegido
      });

      localStorage.setItem("seccionActual", idSeccion);
      navigate("/listas");
    } catch (error) {
      console.error("Error al crear la sección:", error);
      alert("Hubo un error al crear la sección. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

        <div className="fixed-header-area">
          <div className="top-bar">
            <h1>Nueva Sección</h1>
            <button
              type="button"
              className="profile-button"
              onClick={() => navigate("/perfil")}
            >
              👤
            </button>
          </div>
        </div>

        <div className="scrollable-products-area" style={{ paddingBottom: "110px" }}>
          <form onSubmit={handleSubmit} id="create-section-form">
            
            <div className="card" style={{ marginBottom: "12px", padding: "16px" }}>
              <label style={{ display: "block", fontWeight: "800", fontSize: "14px", color: "#2d3748", marginBottom: "8px" }}>
                Nombre de la sección
              </label>
              <input
                type="text"
                className="input"
                placeholder="Ej: Cuadrilla, Fiesta Piso, Cumple..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoFocus
                style={{ marginBottom: "0" }}
              />
            </div>

            <div className="card" style={{ padding: "16px" }}>
              <label style={{ display: "block", fontWeight: "800", fontSize: "14px", color: "#2d3748", marginBottom: "8px" }}>
                Elige un icono
              </label>
              <div 
                className="categories-grid" 
                style={{ 
                  maxHeight: "150px", 
                  overflowY: "auto", 
                  paddingRight: "4px",
                  border: "1.5px solid #edf2f7",
                  borderRadius: "12px",
                  padding: "8px"
                }}
              >
                {ICONOS_SECCION.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    className={`category-btn ${icono === ic ? "selected" : ""}`}
                    onClick={() => setIcono(ic)}
                    style={{ padding: "8px 4px" }}
                  >
                    <span className="category-icon" style={{ fontSize: "22px" }}>{ic}</span>
                  </button>
                ))}
              </div>
            </div>

          </form>
        </div>

        <div style={{
          position: "absolute",
          bottom: "75px",
          left: "20px",
          right: "20px",
          background: "#eaf5ea",
          paddingTop: "10px",
          zIndex: 5
        }}>
          <button
            type="submit"
            form="create-section-form"
            className="primary-button"
            disabled={loading}
            style={{ marginBottom: "8px" }}
          >
            {loading ? "CREANDO..." : "CREAR SECCIÓN"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/secciones")}
          >
            CANCELAR
          </button>
        </div>

        <Navbar />

      </div>
    </div>
  );
}