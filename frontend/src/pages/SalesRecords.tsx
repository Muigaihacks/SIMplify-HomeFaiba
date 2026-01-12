import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Application } from '../types';

const SalesRecords: React.FC = () => {
  const { dealerId, agentId, userRole } = useAppContext();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await apiService.getApplications(
          dealerId,
          userRole === 'agent' ? agentId : undefined
        );
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [dealerId, agentId, userRole]);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customerPhone.includes(searchTerm) ||
      app.agentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-warning',
      dispatched: 'bg-info',
      active: 'bg-success',
      cancelled: 'bg-danger',
    };
    return badges[status as keyof typeof badges] || 'bg-secondary';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: 'fa-clock',
      dispatched: 'fa-truck',
      active: 'fa-check-circle',
      cancelled: 'fa-times-circle',
    };
    return icons[status as keyof typeof icons] || 'fa-question';
  };

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
          <i className="fas fa-shopping-cart me-2"></i>Sales Records
        </h1>
        <div className="d-flex gap-2">
          <span className="badge bg-primary fs-6">
            Total: {applications.length}
          </span>
          <span className="badge bg-success fs-6">
            Active: {applications.filter((a) => a.status === 'active').length}
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-light">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by customer name, application number, phone, or agent..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="dispatched">Dispatched</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Application #</th>
                  <th>Customer Name</th>
                  <th>Phone</th>
                  <th>Package</th>
                  <th>Agent</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-4">
                      <i className="fas fa-inbox fa-2x text-muted mb-2 d-block"></i>
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.applicationNumber}</strong>
                      </td>
                      <td>{app.customerName}</td>
                      <td>{app.customerPhone}</td>
                      <td>
                        <span className="badge bg-info">{app.packageName}</span>
                      </td>
                      <td>{app.agentName}</td>
                      <td>
                        <small>
                          {app.physicalAddress.building}, {app.physicalAddress.area}
                        </small>
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadge(app.status)}`}>
                          <i className={`fas ${getStatusIcon(app.status)} me-1`}></i>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <small>
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </small>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5>Pending</h5>
                <h2>{applications.filter((a) => a.status === 'pending').length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5>Dispatched</h5>
                <h2>{applications.filter((a) => a.status === 'dispatched').length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Active</h5>
                <h2>{applications.filter((a) => a.status === 'active').length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-secondary text-white">
              <div className="card-body">
                <h5>Total Revenue</h5>
                <h2>
                  KSh{' '}
                  {applications
                    .filter((a) => a.status === 'active')
                    .reduce((sum, a) => {
                      const packagePrices: { [key: string]: number } = {
                        Bronze: 2500,
                        Silver: 4500,
                        Gold: 7500,
                        Platinum: 12000,
                      };
                      return sum + (packagePrices[a.packageName] || 0);
                    }, 0)
                    .toLocaleString()}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesRecords;
