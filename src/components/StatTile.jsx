export default function StatTile({ label, value }) {
  return (
    <div className="card flex flex-col items-center">
      <div className="text-4xl font-extrabold">{value}</div>
      <div className="text-slate-400 mt-2">{label}</div>
    </div>
  );
}
