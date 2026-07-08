import { Link, useNavigate } from "react-router-dom";

export default function Landing () {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("auth_token");

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-brand">
          <span className="live-dot" aria-hidden="true" />
          <span className="landing-brand-name">Business Monitor</span>
        </div>
        <nav className="landing-nav">
          {isLoggedIn ? (
            <button onClick={() => navigate("/dashboard")} className="btn-primary">
              Go to dashboard
            </button>
          ) : (
            <>
              <Link to="/login" className="landing-nav-link">Sign in</Link>
              <Link to="/register" className="btn-primary">Create account</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <section className="landing-hero">
          <p className="landing-eyebrow">Real-time visit tracking</p>
          <h1>
            See what's happening on the floor,
            <br />
            the moment it happens.
          </h1>
          <p className="landing-subhead">
            Business Monitor tracks how customers move through your stations —
            check-ins, durations, and busy hours — so you always know how the
            day is actually going, not just how it ended.
          </p>
          
        </section>

        <section className="landing-features">
          <div className="feature-card">
            <span className="feature-index">Live</span>
            <h3>Visits as they happen</h3>
            <p>
              Every check-in and check-out streams straight to your dashboard,
              refreshing automatically — no manual refresh, no end-of-day surprises.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-index">Per station</span>
            <h3>Where time actually goes</h3>
            <p>
              Average duration is broken down by station, so you can spot which
              parts of the visit run long before customers start complaining.
            </p>
          </div>
          <div className="feature-card">
            <span className="feature-index">By the hour</span>
            <h3>Your real busy hours</h3>
            <p>
              Visit patterns across the day show you when to staff up and when
              you're paying for coverage nobody needed.
            </p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <span>Business Monitor</span>
        <span>Built for businesses that run on foot traffic.</span>
      </footer>
    </div>
  );
}
            
        
    
