import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Salesman } from '../types';

const SalesmenDirectory: React.FC = () => {
  const { dealerId } = useAppContext();
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        setLoading(true);
        const data = await apiService.getSalesmen(dealerId);
        setSalesmen(data);
      } catch (error) {
        console.error('Error fetching salesmen:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesmen();
  }, [dealerId]);

  const filteredSalesmen = salesmen.filter(
    (salesman) =>
      salesman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salesman.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salesman.agentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      salesman.phone.includes(searchTerm)
  );

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
          <i className="fas fa-users me-2"></i>Salesmen Directory
        </h1>
        <span className="badge bg-success fs-6">
          Total: {salesmen.length}
        </span>
      </div>

      <div className="card">
        <div className="card-header bg-light">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, agent ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Agent ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Total Sales</th>
                  <th>Total Commission</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesmen.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <i className="fas fa-inbox fa-2x text-muted mb-2 d-block"></i>
                      No salesmen found
                    </td>
                  </tr>
                ) : (
                  filteredSalesmen.map((salesman) => (
                    <tr key={salesman.id}>
                      <td>
                        <span className="badge bg-primary">{salesman.agentId}</span>
                      </td>
                      <td>
                        <strong>{salesman.name}</strong>
                      </td>
                      <td>{salesman.email}</td>
                      <td>{salesman.phone}</td>
                      <td>
                        <span className="badge bg-info">{salesman.totalSales}</span>
                      </td>
                      <td>
                        <strong className="text-success">
                          KSh {salesman.totalCommission.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        {salesman.isActive ? (
                          <span className="badge bg-success">
                            <i className="fas fa-check-circle me-1"></i>Active
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            <i className="fas fa-times-circle me-1"></i>Inactive
                          </span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-success">
                          <i className="fas fa-edit"></i>
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
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <h5>Active Salesmen</h5>
                <h2>{salesmen.filter((s) => s.isActive).length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Total Sales</h5>
                <h2>{salesmen.reduce((sum, s) => sum + s.totalSales, 0)}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5>Total Commissions</h5>
                <h2>KSh {salesmen.reduce((sum, s) => sum + s.totalCommission, 0).toLocaleString()}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesmenDirectory;
