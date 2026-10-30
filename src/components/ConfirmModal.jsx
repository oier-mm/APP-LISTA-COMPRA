import "../styles/modal.css";

export default function ConfirmModal({
  title,
  message,
  confirmText = "BORRAR",
  cancelText = "CANCELAR",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {title && <h2>{title}</h2>}
        {message && <p>{message}</p>}

        <div className="modal-buttons">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className="primary-button"
            style={{ backgroundColor: "#e53e3e" }}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}