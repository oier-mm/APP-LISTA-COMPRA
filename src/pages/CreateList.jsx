import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createList } from "../services/listService";
import Navbar from "../components/Navbar";

import "../styles/products.css"; // Reutilizamos estilos limpios

const ICONOS_LISTA = ["📋", "🛒", "🛍️", "🍎", "🏠", "🍕", "🧹", "💊", "🎉"];

export default function CreateList() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("📋");
  const [loading, setLoading] = useState(false);

  const idSeccion = localStorage.getItem("seccionActual");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert("Por favor, introduce un nombre para la lista.");
      return;
    }

    if (!idSeccion) {
      alert("No hay ninguna sección seleccionada.");
      navigate("/secciones");
      return;
    }

    setLoading(true);
    try {
      const idLista = await createList({
        nombre: nombre.trim().toUpperCase(),
        icono: icono,
        idSeccion: idSeccion,
      });

      // Guardamos la lista actual y redirigimos a productos
      localStorage.setItem("listaActual", idLista);
      navigate("/productos");
    } catch (error) {
      console.error("Error al crear la lista:", error);
      alert("Hubo un error al crear la lista. Inténtalo de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container mobile-layout">

        <div className="fixed-header-area">
          <div className="top-bar">
            <h1>Nueva Lista</h1>
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
          <form onSubmit={handleSubmit} className="card" style={{ marginTop: "10px" }}>
            
            <label style={{ display: "block", fontWeight: "800", fontSize: "14px", color: "#2d3748", marginBottom: "8px" }}>
              Nombre de la lista
            </label>
            <input
              type="text"
              className="input"
              placeholder="Ej: Mercadona, Fruta semanal..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />

            <label style={{ display: "block", fontWeight: "800", fontSize: "14px", color: "#2d3748", margin: "16px 0 8px 0" }}>
              Elige un icono
            </label>
            <div className="categories-grid" style={{ marginBottom: "20px" }}>
              {ICONOS_LISTA.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  className={`category-btn ${icono === ic ? "selected" : ""}`}
                  onClick={() => setIcono(ic)}
                >
                  <span className="category-icon">{ic}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? "CREANDO..." : "CREAR LISTA"}
            </button>

            <button
              type="button"
              className="secondary-button"
              style={{ marginTop: "10px" }}
              onClick={() => navigate("/listas")}
            >
              CANCELAR
            </button>
          </form>
        </div>

        <Navbar />

      </div>
    </div>
  );
}