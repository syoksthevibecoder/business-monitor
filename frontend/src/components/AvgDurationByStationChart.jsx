import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Average the duration of completed visits per station, converted to minutes.
function buildByStation(visits) {
  const totals = {};
  for (const visit of visits) {
    if (visit.duration_seconds == null) continue; // skip visits still in progress
    const station = visit.station_id || "unknown";
    if (!totals[station]) totals[station] = { sum: 0, count: 0 };
    totals[station].sum += visit.duration_seconds;
    totals[station].count += 1;
  }
  return Object.entries(totals).map(([station, { sum, count }]) => ({
    station,
    minutes: Math.round(sum / count / 60),
  }));
}

function AvgDurationByStationChart({ visits }) {
  const data = buildByStation(visits);

  return (
    <div className="chart-card">
      <h2 className="chart-title">Avg duration by station (min)</h2>
      {data.length === 0 ? (
        <p className="chart-empty">No completed visits yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E4DD" vertical={false} />
            <XAxis dataKey="station" tick={{ fontSize: 12, fill: "#6B6F6B" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6B6F6B" }} />
            <Tooltip cursor={{ fill: "rgba(199,122,40,0.10)" }} />
            <Bar dataKey="minutes" fill="#C77A28" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default AvgDurationByStationChart;
