import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Toast from '../components/Toast';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setUserRole, setDealerId, setAgentId } = useAppContext();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });

  // Mock authentication - in production, this would call the backend API
  const mockUsers = {
    // Agent credentials
    'agent1': { password: 'agent123', role: 'agent' as const, dealerId: 1, agentId: 1 },
    'agent': { password: 'agent123', role: 'agent' as const, dealerId: 1, agentId: 1 },
    'salesman': { password: 'sales123', role: 'agent' as const, dealerId: 1, agentId: 2 },
    
    // Dealer credentials
    'dealer1': { password: 'dealer123', role: 'dealer' as const, dealerId: 1, agentId: null },
    'dealer': { password: 'dealer123', role: 'dealer' as const, dealerId: 1, agentId: null },
    'admin': { password: 'admin123', role: 'dealer' as const, dealerId: 1, agentId: null },
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user = mockUsers[credentials.username.toLowerCase() as keyof typeof mockUsers];
    
    if (user && user.password === credentials.password) {
      // Set user context
      setUserRole(user.role);
      setDealerId(user.dealerId);
      if (user.agentId) {
        setAgentId(user.agentId);
      } else {
        setAgentId(null);
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('dealerId', user.dealerId.toString());
      if (user.agentId) {
        localStorage.setItem('agentId', user.agentId.toString());
      } else {
        localStorage.removeItem('agentId');
      }
      
      // Navigate to dashboard
      navigate('/');
      setToast({ show: true, message: `Welcome! Logged in as ${user.role}`, type: 'success' });
    } else {
      setToast({ show: true, message: 'Invalid username or password', type: 'error' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-header bg-success text-white text-center">
              <h3 className="mb-0">
                <i className="fas fa-wifi me-2"></i>
                SIMplify HomeFaiba
              </h3>
              <p className="mb-0 mt-2">Login to your account</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    <i className="fas fa-user me-2"></i>Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                    placeholder="Enter your username"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your password"
                  />
                </div>
                <button type="submit" className="btn btn-success w-100">
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </button>
              </form>
              
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Demo Credentials:</strong>
                  <br />
                  <strong>Agents:</strong> agent / agent123
                  <br />
                  <strong>Dealers:</strong> dealer / dealer123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default Login;
