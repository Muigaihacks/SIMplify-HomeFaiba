import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const RoleSwitcher: React.FC = () => {
  const { userRole, setUserRole, setAgentId } = useAppContext();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole: 'dealer' | 'agent') => {
    setUserRole(newRole);
    if (newRole === 'agent') {
      // Set a default agent ID for demo
      setAgentId(1);
    } else {
      setAgentId(null);
    }
    // Navigate to dashboard when switching roles
    navigate('/');
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-outline-light dropdown-toggle"
        type="button"
        id="roleDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="fas fa-user-cog me-1"></i>
        View as: {userRole === 'dealer' ? 'Dealer' : 'Agent'}
      </button>
      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="roleDropdown">
        <li>
          <button
            className={`dropdown-item ${userRole === 'dealer' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('dealer')}
          >
            <i className="fas fa-building me-2"></i>Dealer View
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item ${userRole === 'agent' ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('agent')}
          >
            <i className="fas fa-user-tie me-2"></i>Agent View
          </button>
        </li>
      </ul>
    </div>
  );
};

export default RoleSwitcher;
