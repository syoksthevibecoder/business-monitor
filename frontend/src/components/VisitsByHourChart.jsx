import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Count how many visits started in each hour, then drop the empty hours so the
// chart shows only the part of the day that had activity.
function buildHourly(visits) {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${String(hour).padStart(2, "0")}:00`,
    visits: 0,
  }));
  for (const visit of visits) {
    if (!visit.started_at) continue;
    const hour = new Date(visit.started_at).getHours();
    buckets[hour].visits += 1;
  }
  return buckets.filter((bucket) => bucket.visits > 0);
}

function VisitsByHourChart({ visits }) {
  const data = buildHourly(visits);

  return (
    <div className="chart-card">
      <h2 className="chart-title">Visits by hour</h2>
      {data.length === 0 ? (
        <p className="chart-empty">No visits yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DD" vertical={false} />
            <XAxis dataKey="hour" tick={{ fontSize: 12, fill: "#6B6F6B" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6B6F6B" }} />
            <Tooltip cursor={{ fill: "rgba(15,138,107,0.08)" }} />
            <Bar dataKey="visits" fill="#0F8A6B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default VisitsByHourChart;
