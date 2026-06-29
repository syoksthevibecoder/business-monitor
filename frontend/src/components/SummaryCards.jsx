import { formatDuration } from "../api";

// One stat card. `accent` optionally colours the value (e.g. "live" or "warn").
function Card({ label, value, accent }) {
  return (
    <div className={`card ${accent ? `card-${accent}` : ""}`}>
      <span className="card-value">{value}</span>
      <span className="card-label">{label}</span>
    </div>
  );
}

function SummaryCards({ summary }) {
  // busiest_station comes back as an object like { "station__station_id": "chair_3", "n": 4 }
  // or null if there are no completed visits yet.
  const busiest =
    summary.busiest_station && summary.busiest_station["station__station_id"]
      ? summary.busiest_station["station__station_id"]
      : "—";

  return (
    <section className="cards">
      <Card label="Total visits" value={summary.total_visits} />
      <Card label="Completed" value={summary.completed_visits} />
      <Card label="In progress" value={summary.in_progress} accent="live" />
      <Card
        label="Avg duration"
        value={formatDuration(summary.avg_duration_seconds)}
        accent="warn"
      />
      <Card label="Busiest station" value={busiest} />
    </section>
  );
}

export default SummaryCards;
