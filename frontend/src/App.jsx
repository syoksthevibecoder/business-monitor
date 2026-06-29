import { useState, useEffect, useCallback } from "react";
import { getSummary, getVisits, formatTime } from "./api";
import SummaryCards from "./components/SummaryCards";
import VisitsByHourChart from "./components/VisitsByHourChart";
import AvgDurationByStationChart from "./components/AvgDurationByStationChart";
import VisitsTable from "./components/VisitsTable";

// Which business this dashboard shows. Matches the test business you created
// in the Django shell. Later this can become a dropdown of the owner's businesses.
const BUSINESS_ID = "barber_005";

// How often to automatically refresh the data, in milliseconds.
const REFRESH_MS = 5000;

function App() {
  const [summary, setSummary] = useState(null);
  const [visits, setVisits] = useState([]);
  const [phase, setPhase] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  // Load both endpoints together. Wrapped in useCallback so the effect and the
  // Refresh button can share the exact same function.
  const load = useCallback(async () => {
    try {
      const [summaryData, visitsData] = await Promise.all([
        getSummary(BUSINESS_ID),
        getVisits(BUSINESS_ID),
      ]);
      setSummary(summaryData);
      setVisits(visitsData);
      setUpdatedAt(new Date());
      setError("");
      setPhase("ready");
    } catch (err) {
      setError(err.message);
      setPhase("error");
    }
  }, []);

  // Load once on mount, then poll every REFRESH_MS. Clean up on unmount.
  useEffect(() => {
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => clearInterval(timer);
  }, [load]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-left">
          <span className="live-dot" aria-hidden="true" />
          <div>
            <h1 className="brand">{summary ? summary.business_id : BUSINESS_ID}</h1>
            <p className="brand-sub">
              {summary ? summary.business_type : "monitoring dashboard"}
            </p>
          </div>
        </div>
        <div className="topbar-right">
          {updatedAt && (
            <span className="updated">
              Updated {formatTime(updatedAt.toISOString())}
            </span>
          )}
          <button className="refresh" onClick={load}>
            Refresh
          </button>
        </div>
      </header>

      {phase === "loading" && <p className="message">Loading dashboard…</p>}

      {phase === "error" && (
        <div className="message error">
          <p>Couldn't reach the backend: {error}</p>
          <p className="message-hint">
            Make sure Django is running on http://localhost:8000 and that you've
            posted some test events.
          </p>
        </div>
      )}

      {phase === "ready" && (
        <main className="dashboard">
          <SummaryCards summary={summary} />
          <section className="charts">
            <VisitsByHourChart visits={visits} />
            <AvgDurationByStationChart visits={visits} />
          </section>
          <VisitsTable visits={visits} />
        </main>
      )}
    </div>
  );
}

export default App;
