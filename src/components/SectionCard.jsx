export default function SectionCard({
  icon,
  name,
  members,
  onClick,
}) {
  return (
    <div
      className="section-card"
      onClick={onClick}
    >
      <h2>
        {icon} {name}
      </h2>

      <p>{members} miembros</p>
    </div>
  );
}