import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole, setUserRole, setDealerId, setAgentId } = useAppContext();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('dealerId');
    localStorage.removeItem('agentId');
    setUserRole('dealer');
    setDealerId(1);
    setAgentId(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-wifi me-2"></i>
          SIMplify HomeFaiba
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {userRole === 'dealer' ? (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    to="/"
                  >
                    <i className="fas fa-home me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/salesmen') ? 'active' : ''}`}
                    to="/salesmen"
                  >
                    <i className="fas fa-users me-1"></i> Salesmen
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/sales') ? 'active' : ''}`}
                    to="/sales"
                  >
                    <i className="fas fa-shopping-cart me-1"></i> Sales Records
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/commissions') ? 'active' : ''}`}
                    to="/commissions"
                  >
                    <i className="fas fa-money-bill-wave me-1"></i> Commissions
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
                    to="/leaderboard"
                  >
                    <i className="fas fa-trophy me-1"></i> Leaderboard
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/') ? 'active' : ''}`}
                    to="/"
                  >
                    <i className="fas fa-home me-1"></i> Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/application') ? 'active' : ''}`}
                    to="/application"
                  >
                    <i className="fas fa-file-alt me-1"></i> New Application
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/packages') ? 'active' : ''}`}
                    to="/packages"
                  >
                    <i className="fas fa-box me-1"></i> Packages
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/installations') ? 'active' : ''}`}
                    to="/installations"
                  >
                    <i className="fas fa-tools me-1"></i> Installations
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <button className="btn btn-outline-light" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-1"></i>Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
