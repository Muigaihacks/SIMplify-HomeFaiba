import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Salesman } from '../types';
import Toast from '../components/Toast';

const SalesmenDirectory: React.FC = () => {
  const { dealerId } = useAppContext();
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSalesman, setEditingSalesman] = useState<Salesman | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agentId: '',
  });

  useEffect(() => {
    fetchSalesmen();
  }, [dealerId]);

  const fetchSalesmen = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSalesmen(dealerId);
      setSalesmen(data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
      setToast({ show: true, message: 'Failed to load salesmen', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenModal = (salesman?: Salesman) => {
    if (salesman) {
      setEditingSalesman(salesman);
      setFormData({
        name: salesman.name,
        email: salesman.email,
        phone: salesman.phone,
        agentId: salesman.agentId,
      });
    } else {
      setEditingSalesman(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        agentId: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSalesman(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      agentId: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSalesman) {
        // Update existing salesman
        await apiService.updateSalesman(parseInt(editingSalesman.id.toString()), {
          ...formData,
          dealerId,
        });
        setToast({ show: true, message: 'Salesperson updated successfully', type: 'success' });
      } else {
        // Create new salesman
        await apiService.createSalesman({
          ...formData,
          dealerId,
          isActive: true,
          totalSales: 0,
          totalCommission: 0,
          createdAt: new Date().toISOString(),
        });
        setToast({ show: true, message: 'Salesperson added successfully', type: 'success' });
      }
      handleCloseModal();
      fetchSalesmen();
    } catch (error) {
      console.error('Error saving salesman:', error);
      setToast({ show: true, message: 'Failed to save salesperson', type: 'error' });
    }
  };

  const handleDeactivate = async (salesman: Salesman) => {
    if (window.confirm(`Are you sure you want to deactivate ${salesman.name}? This will archive their record.`)) {
      try {
        await apiService.deactivateSalesman(parseInt(salesman.id.toString()));
        setToast({ show: true, message: 'Salesperson deactivated successfully', type: 'success' });
        fetchSalesmen();
      } catch (error) {
        console.error('Error deactivating salesman:', error);
        setToast({ show: true, message: 'Failed to deactivate salesperson', type: 'error' });
      }
    }
  };

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
        <div className="d-flex gap-2 align-items-center">
          <button className="btn btn-success" onClick={() => handleOpenModal()}>
            <i className="fas fa-plus me-2"></i>Add New Salesperson
          </button>
          <span className="badge bg-success fs-6">
            Total: {salesmen.length}
          </span>
        </div>
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
                        <button
                          className="btn btn-sm btn-outline-danger me-1"
                          onClick={() => handleDeactivate(salesman)}
                          title="Deactivate (Archive)"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleOpenModal(salesman)}
                          title="Edit"
                        >
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  {editingSalesman ? 'Edit Salesperson' : 'Add New Salesperson'}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254712345678"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Agent ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="agentId"
                      value={formData.agentId}
                      onChange={handleInputChange}
                      placeholder="AG001"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingSalesman ? 'Update' : 'Add'} Salesperson
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default SalesmenDirectory;
