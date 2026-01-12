import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Installation } from '../types';

const InstallationsTracker: React.FC = () => {
  const { agentId } = useAppContext();
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!agentId) return;

    const fetchInstallations = async () => {
      try {
        setLoading(true);
        const data = await apiService.getInstallations(agentId);
        setInstallations(data);
      } catch (error) {
        console.error('Error fetching installations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstallations();
  }, [agentId]);

  const filteredInstallations = installations.filter((inst) => {
    return statusFilter === 'all' || inst.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: 'bg-info',
      'in-progress': 'bg-warning',
      completed: 'bg-success',
      cancelled: 'bg-danger',
    };
    return badges[status as keyof typeof badges] || 'bg-secondary';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      scheduled: 'fa-calendar',
      'in-progress': 'fa-tools',
      completed: 'fa-check-circle',
      cancelled: 'fa-times-circle',
    };
    return icons[status as keyof typeof icons] || 'fa-question';
  };

  if (!agentId) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Please set your agent ID to view installations.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-tools me-2"></i>Installation Tracker
        </h1>
        <div className="d-flex gap-2">
          <span className="badge bg-primary fs-6">
            Total: {installations.length}
          </span>
          <span className="badge bg-success fs-6">
            Completed: {installations.filter((i) => i.status === 'completed').length}
          </span>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-light">
          <div className="row">
            <div className="col-md-6">
              <label className="me-2">Filter by Status:</label>
              <select
                className="form-select d-inline-block"
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filteredInstallations.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                <p className="text-muted">No installations found</p>
              </div>
            </div>
          </div>
        ) : (
          filteredInstallations.map((installation) => (
            <div key={installation.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{installation.applicationNumber}</strong>
                    <span className={`badge ${getStatusBadge(installation.status)}`}>
                      <i className={`fas ${getStatusIcon(installation.status)} me-1`}></i>
                      {installation.status.charAt(0).toUpperCase() +
                        installation.status.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title">{installation.customerName}</h6>
                  <p className="text-muted mb-2">
                    <i className="fas fa-phone me-2"></i>
                    {installation.customerPhone}
                  </p>
                  <p className="text-muted mb-2">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    <small>{installation.address}</small>
                  </p>
                  <p className="mb-2">
                    <span className="badge bg-info">{installation.packageName}</span>
                  </p>

                  {installation.scheduledDate && (
                    <p className="mb-2">
                      <i className="fas fa-calendar me-2"></i>
                      <strong>Scheduled:</strong>{' '}
                      {new Date(installation.scheduledDate).toLocaleDateString()}
                    </p>
                  )}

                  {installation.technicianAssigned && (
                    <p className="mb-2">
                      <i className="fas fa-user-cog me-2"></i>
                      <strong>Technician:</strong> {installation.technicianAssigned}
                    </p>
                  )}

                  {installation.completedAt && (
                    <p className="mb-2 text-success">
                      <i className="fas fa-check-circle me-2"></i>
                      <strong>Completed:</strong>{' '}
                      {new Date(installation.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="card-footer bg-light">
                  <button className="btn btn-sm btn-primary w-100">
                    <i className="fas fa-eye me-1"></i>View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5>Scheduled</h5>
                <h2>
                  {installations.filter((i) => i.status === 'scheduled').length}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5>In Progress</h5>
                <h2>
                  {installations.filter((i) => i.status === 'in-progress').length}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Completed</h5>
                <h2>
                  {installations.filter((i) => i.status === 'completed').length}
                </h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-secondary text-white">
              <div className="card-body">
                <h5>Total</h5>
                <h2>{installations.length}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallationsTracker;
