import { formatDuration, formatTime } from "../api";

function VisitsTable({ visits }) {
  return (
    <section className="table-card">
      <h2 className="chart-title">Recent visits</h2>
      {visits.length === 0 ? (
        <p className="chart-empty">No visits recorded yet.</p>
      ) : (
        <div className="table-scroll">
          <table className="visits-table">
            <thead>
              <tr>
                <th>Station</th>
                <th>Service</th>
                <th>Started</th>
                <th>Ended</th>
                <th>Duration</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td>{visit.station_id || "—"}</td>
                  <td>{visit.service || "—"}</td>
                  <td>{formatTime(visit.started_at)}</td>
                  <td>{visit.ended_at ? formatTime(visit.ended_at) : "—"}</td>
                  <td>{formatDuration(visit.duration_seconds)}</td>
                  <td>
                    {visit.ended_at ? (
                      <span className="badge badge-done">Done</span>
                    ) : (
                      <span className="badge badge-live">In chair</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default VisitsTable;
