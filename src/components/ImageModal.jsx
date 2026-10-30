import { useState } from "react";
import "../styles/modal.css";

export default function ImageModal({ imageUrl, onClose }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="image-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="image-close-btn"
          onClick={onClose}
          title="Cerrar"
        >
          ✕
        </button>

        <div className="image-modal-container">
          {!hasError && imageUrl ? (
            <img
              src={imageUrl}
              alt="Imagen adjunta del producto"
              className="modal-image-preview"
              onError={() => setHasError(true)}
            />
          ) : (
            <div style={{ padding: "30px", textAlign: "center", color: "#718096" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>🖼️</div>
              <p style={{ margin: 0, fontWeight: "600" }}>
                No se pudo cargar la imagen adjunta.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}