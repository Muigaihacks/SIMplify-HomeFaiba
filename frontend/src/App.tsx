import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import SalesmenDirectory from './pages/SalesmenDirectory';
import SalesRecords from './pages/SalesRecords';
import CommissionsDashboard from './pages/CommissionsDashboard';
import Leaderboard from './pages/Leaderboard';
import PackagesComparison from './pages/PackagesComparison';
import InstallationsTracker from './pages/InstallationsTracker';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="container-fluid" style={{ minHeight: 'calc(100vh - 56px)' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/application" element={<ApplicationForm />} />
              <Route path="/salesmen" element={<SalesmenDirectory />} />
              <Route path="/sales" element={<SalesRecords />} />
              <Route path="/commissions" element={<CommissionsDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/packages" element={<PackagesComparison />} />
              <Route path="/installations" element={<InstallationsTracker />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
