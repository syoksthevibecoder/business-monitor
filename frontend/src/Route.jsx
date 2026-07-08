import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your authentication & landing pages
import Landing from './Landing';
import Register from './Register';
import VerifyOTP from './VerifyOTP';
import Login from './Login';

// Import your existing dashboard elements
import AvgDurationByStationChart from "./components/AvgDurationByStationChart";
import VisitsTable from "./components/VisitsTable";

//import app as dashboard
import App from './App';

// Wrap the dashboard elements into a single layout component
function DashboardLayout() {
  return (
    <div className="dashboard-wrapper">
      <header style={{ padding: '20px', background: '#fff', marginBottom: '20px' }}>
        <h1>Gnovation Analytics Dashboard</h1>
      </header>
      <main style={{ padding: '0 20px' }}>
        <AvgDurationByStationChart />
        <VisitsTable />
      </main>
    </div>
  );
}

// Export the complete routing system
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<App />} /> 
      </Routes>
    </Router>
  );
}

