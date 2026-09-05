function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconClass
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <div>
          <p>{title}</p>
          <h2>{value}</h2>
        </div>

        <div className={`stat-icon ${iconClass}`}>
          <Icon size={22} />
        </div>

      </div>

      <div className="stat-change">
        <span>↑ {change}</span>
        <small>vs last month</small>
      </div>

    </div>
  );
}

export default StatCard;