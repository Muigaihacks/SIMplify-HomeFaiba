import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Salesman } from '../types';

const Leaderboard: React.FC = () => {
  const { dealerId } = useAppContext();
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'sales' | 'commission'>('sales');

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

  const sortedSalesmen = [...salesmen].sort((a, b) => {
    if (sortBy === 'sales') {
      return b.totalSales - a.totalSales;
    } else {
      return b.totalCommission - a.totalCommission;
    }
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return 'fa-trophy text-warning';
    if (index === 1) return 'fa-medal text-secondary';
    if (index === 2) return 'fa-award text-danger';
    return 'fa-star text-info';
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return 'bg-warning text-dark';
    if (index === 1) return 'bg-secondary text-white';
    if (index === 2) return 'bg-danger text-white';
    return 'bg-light text-dark';
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
          <i className="fas fa-trophy me-2"></i>Agent Performance Leaderboard
        </h1>
        <div>
          <label className="me-2">Sort by:</label>
          <select
            className="form-select d-inline-block"
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'sales' | 'commission')}
          >
            <option value="sales">Total Sales</option>
            <option value="commission">Total Commission</option>
          </select>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {sortedSalesmen.slice(0, 3).map((salesman, index) => (
          <div key={salesman.id} className="col-md-4">
            <div className={`card ${index === 0 ? 'border-warning border-3' : ''}`}>
              <div className={`card-header ${getRankBadge(index)}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className={`fas ${getRankIcon(index)} me-2`}></i>
                    Rank #{index + 1}
                  </h5>
                  {index === 0 && (
                    <i className="fas fa-crown fa-2x"></i>
                  )}
                </div>
              </div>
              <div className="card-body text-center">
                <h4 className="card-title">{salesman.name}</h4>
                <p className="text-muted mb-3">{salesman.agentId}</p>
                <div className="row">
                  <div className="col-6">
                    <div className="border-end">
                      <h5 className="text-primary">{salesman.totalSales}</h5>
                      <small className="text-muted">Total Sales</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <h5 className="text-success">
                      KSh {salesman.totalCommission.toLocaleString()}
                    </h5>
                    <small className="text-muted">Commission</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">Full Leaderboard</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }}>Rank</th>
                  <th>Agent Name</th>
                  <th>Agent ID</th>
                  <th>Total Sales</th>
                  <th>Total Commission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sortedSalesmen.map((salesman, index) => (
                  <tr key={salesman.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className={`badge ${getRankBadge(index)} me-2`}>
                          #{index + 1}
                        </span>
                        {index < 3 && (
                          <i className={`fas ${getRankIcon(index)}`}></i>
                        )}
                      </div>
                    </td>
                    <td>
                      <strong>{salesman.name}</strong>
                    </td>
                    <td>
                      <span className="badge bg-primary">{salesman.agentId}</span>
                    </td>
                    <td>
                      <span className="badge bg-info fs-6">{salesman.totalSales}</span>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <h5>Top Performer</h5>
                <h4>{sortedSalesmen[0]?.name || 'N/A'}</h4>
                <p className="mb-0">
                  {sortedSalesmen[0]?.totalSales || 0} sales
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body">
                <h5>Average Sales per Agent</h5>
                <h4>
                  {salesmen.length > 0
                    ? Math.round(
                        salesmen.reduce((sum, s) => sum + s.totalSales, 0) /
                          salesmen.length
                      )
                    : 0}
                </h4>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-info text-white">
              <div className="card-body">
                <h5>Total Team Sales</h5>
                <h4>
                  {salesmen.reduce((sum, s) => sum + s.totalSales, 0)}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
