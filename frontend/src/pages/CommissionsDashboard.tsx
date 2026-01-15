import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Commission } from '../types';
import Toast from '../components/Toast';

const CommissionsDashboard: React.FC = () => {
  const { dealerId } = useAppContext();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-03');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCommissions(dealerId);
        const filtered = data.filter((c: Commission) => c.period === selectedPeriod);
        setCommissions(filtered);
      } catch (error) {
        console.error('Error fetching commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [dealerId, selectedPeriod]);

  const handleMarkAsPaid = async (commission: Commission) => {
    if (window.confirm(`Mark commission for ${commission.agentName} as paid?`)) {
      try {
        await apiService.markCommissionAsPaid(commission.id);
        setToast({ show: true, message: 'Commission marked as paid successfully', type: 'success' });
        // Refresh commissions
        const data = await apiService.getCommissions(dealerId);
        const filtered = data.filter((c: Commission) => c.period === selectedPeriod);
        setCommissions(filtered);
      } catch (error) {
        console.error('Error marking commission as paid:', error);
        setToast({ show: true, message: 'Failed to mark commission as paid', type: 'error' });
      }
    }
  };

  const totalCommission = commissions.reduce((sum, c) => sum + c.totalCommission, 0);
  const totalRevenue = commissions.reduce((sum, c) => sum + c.totalRevenue, 0);
  const totalSales = commissions.reduce((sum, c) => sum + c.totalSales, 0);
  const totalActivations = commissions.reduce((sum, c) => sum + c.successfulActivations, 0);

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
          <i className="fas fa-money-bill-wave me-2"></i>Commission & Reconciliation Dashboard
        </h1>
        <div>
          <label className="me-2">Period:</label>
          <input
            type="month"
            className="form-control d-inline-block"
            style={{ width: 'auto' }}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5>Total Sales</h5>
              <h2>{totalSales}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5>Successful Activations</h5>
              <h2>{totalActivations}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5>Total Revenue</h5>
              <h2>KSh {totalRevenue.toLocaleString()}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <h5>Total Commission</h5>
              <h2>KSh {totalCommission.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">Commission Breakdown by Agent</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Agent Name</th>
                  <th>Total Sales</th>
                  <th>Successful Activations</th>
                  <th>Total Revenue</th>
                  <th>Commission Rate</th>
                  <th>Commission Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <i className="fas fa-inbox fa-2x text-muted mb-2 d-block"></i>
                      No commission data for this period
                    </td>
                  </tr>
                ) : (
                  commissions.map((commission) => (
                    <tr key={commission.id}>
                      <td>
                        <strong>{commission.agentName}</strong>
                      </td>
                      <td>
                        <span className="badge bg-info">{commission.totalSales}</span>
                      </td>
                      <td>
                        <span className="badge bg-success">
                          {commission.successfulActivations}
                        </span>
                      </td>
                      <td>
                        <strong>KSh {commission.totalRevenue.toLocaleString()}</strong>
                      </td>
                      <td>
                        {(commission.commissionRate * 100).toFixed(1)}%
                      </td>
                      <td>
                        <strong className="text-success">
                          KSh {commission.totalCommission.toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        {commission.paid ? (
                          <span className="badge bg-success">
                            <i className="fas fa-check-circle me-1"></i>Paid
                          </span>
                        ) : (
                          <span className="badge bg-warning">
                            <i className="fas fa-clock me-1"></i>Pending
                          </span>
                        )}
                      </td>
                      <td>
                        {!commission.paid && (
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleMarkAsPaid(commission)}
                          >
                            <i className="fas fa-check me-1"></i>Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            <i className="fas fa-file-export me-2"></i>Reconciliation Summary
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h6>Summary for {selectedPeriod}</h6>
              <ul className="list-unstyled">
                <li>
                  <strong>Total Applications:</strong> {totalSales}
                </li>
                <li>
                  <strong>Successfully Activated:</strong> {totalActivations}
                </li>
                <li>
                  <strong>Activation Rate:</strong>{' '}
                  {totalSales > 0
                    ? ((totalActivations / totalSales) * 100).toFixed(1)
                    : 0}%
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <h6>Financial Summary</h6>
              <ul className="list-unstyled">
                <li>
                  <strong>Total Revenue:</strong> KSh {totalRevenue.toLocaleString()}
                </li>
                <li>
                  <strong>Total Commission Due:</strong> KSh{' '}
                  {totalCommission.toLocaleString()}
                </li>
                <li>
                  <strong>Net Revenue:</strong> KSh{' '}
                  {(totalRevenue - totalCommission).toLocaleString()}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary">
              <i className="fas fa-download me-2"></i>Export Report
            </button>
            <button className="btn btn-success ms-2">
              <i className="fas fa-paper-plane me-2"></i>Send to Telco
            </button>
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

export default CommissionsDashboard;
