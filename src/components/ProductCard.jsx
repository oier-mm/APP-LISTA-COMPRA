export default function ProductCard({
  name,
  type,
  quantity,
  acquired,
  onClick,
}) {
  return (
    <div
      className={`product-card ${
        acquired ? "completed" : "pending"
      }`}
      onClick={onClick}
    >
      <h2>{name}</h2>

      <p>Tipo: {type}</p>

      <p>Cantidad: {quantity}</p>
    </div>
  );
}