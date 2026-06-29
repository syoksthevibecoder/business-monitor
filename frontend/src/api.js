// Central place for talking to the Django backend.
// If your backend runs somewhere other than localhost:8000, change API_BASE.
const API_BASE = "http://localhost:8000/api/v1";

// GET /api/v1/businesses/<id>/summary/  -> the headline numbers for the cards.
export async function getSummary(businessId) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/summary/`);
  if (!res.ok) {
    throw new Error(`Summary request failed (${res.status})`);
  }
  return res.json();
}

// GET /api/v1/businesses/<id>/visits/  -> the recent visits for the table and charts.
export async function getVisits(businessId) {
  const res = await fetch(`${API_BASE}/businesses/${businessId}/visits/`);
  if (!res.ok) {
    throw new Error(`Visits request failed (${res.status})`);
  }
  return res.json();
}

// Turn 1500 -> "25m", or 1530 -> "25m 30s". Used for durations.
export function formatDuration(seconds) {
  if (seconds == null) return "—";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return remainder === 0 ? `${minutes}m` : `${minutes}m ${remainder}s`;
}

// Turn an ISO timestamp into a short local time like "10:05".
export function formatTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
