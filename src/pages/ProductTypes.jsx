import { useNavigate } from "react-router-dom";

export default function ProductTypes() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="card">

        <h1>Tipos de Pan</h1>

        <div className="type-item">
          Barra
        </div>

        <div className="type-item">
          Chapata
        </div>

        <div className="type-item">
          Baguette
        </div>

        <div className="type-item">
          Integral
        </div>

        <button className="primary-button">
          + NUEVO TIPO
        </button>

        <button
          className="back-button"
          onClick={() => navigate("/nuevo-producto")}
        >
          ← VOLVER
        </button>

      </div>
    </div>
  );
}