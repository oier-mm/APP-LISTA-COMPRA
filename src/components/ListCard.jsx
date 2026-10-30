export default function ListCard({
  name,
  onOpen,
  onDelete,
}) {
  return (
    <div className="list-card">
      <div
        className="list-content"
        onClick={onOpen}
      >
        <h2>🛒 {name}</h2>
      </div>

      <button
        className="delete-button"
        onClick={onDelete}
      >
        🗑️
      </button>
    </div>
  );
}