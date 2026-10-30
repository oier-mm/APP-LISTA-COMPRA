export default function ProductModal({
  product,
  onAcquired,
  onEdit,
  onDelete,
  onClose,
}) {
  if (!product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>{product.name}</h2>

        <p>Tipo: {product.type}</p>

        <p>Cantidad: {product.quantity}</p>

        <button
          className="primary-button"
          onClick={onAcquired}
        >
          ✅ ADQUIRIDO
        </button>

        <button
          className="secondary-button"
          onClick={onEdit}
        >
          ✏ MODIFICAR
        </button>

        <button
          className="danger-button"
          onClick={onDelete}
        >
          🗑 BORRAR
        </button>

        <button
          className="secondary-button"
          onClick={onClose}
        >
          CANCELAR
        </button>
      </div>
    </div>
  );
}