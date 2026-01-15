import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
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
        <AppContent />
      </Router>
    </AppProvider>
  );
}

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasRole = localStorage.getItem('userRole');
  
  if (!hasRole) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const hasRole = localStorage.getItem('userRole');
  const showNavbar = hasRole !== null;

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <main className={showNavbar ? "container-fluid" : ""} style={{ minHeight: showNavbar ? 'calc(100vh - 56px)' : '100vh' }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/application"
            element={
              <ProtectedRoute>
                <ApplicationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salesmen"
            element={
              <ProtectedRoute>
                <SalesmenDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <SalesRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/commissions"
            element={
              <ProtectedRoute>
                <CommissionsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/packages"
            element={
              <ProtectedRoute>
                <PackagesComparison />
              </ProtectedRoute>
            }
          />
          <Route
            path="/installations"
            element={
              <ProtectedRoute>
                <InstallationsTracker />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={hasRole ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
