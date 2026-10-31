export default function StatCard({ label, value, change, icon: Icon, tone = "purple", note }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={19}/></div></div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot"><span className="trend">{change}</span><span>{note}</span></div>
    </article>
  );
}