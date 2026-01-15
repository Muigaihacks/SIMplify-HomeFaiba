import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Application, Package } from '../types';
import Toast from '../components/Toast';

const SalesRecords: React.FC = () => {
  const { dealerId, agentId, userRole } = useAppContext();
  const [applications, setApplications] = useState<Application[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });
  const [editFormData, setEditFormData] = useState({
    packageId: 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    physicalAddress: {
      building: '',
      floor: '',
      unit: '',
      street: '',
      area: '',
      city: '',
      postalCode: '',
    },
  });

  useEffect(() => {
    fetchData();
  }, [dealerId, agentId, userRole]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appsData, packagesData] = await Promise.all([
        apiService.getApplications(
          dealerId,
          userRole === 'agent' ? agentId : undefined
        ),
        apiService.getPackages(),
      ]);
      setApplications(appsData);
      setPackages(packagesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({ show: true, message: 'Failed to load data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getPackageColor = (packageName: string): string => {
    const pkg = packages.find((p) => p.name === packageName);
    return pkg?.color || '#6c757d';
  };

  const handleEdit = (app: Application) => {
    setEditingApplication(app);
    setEditFormData({
      packageId: app.packageId,
      customerName: app.customerName,
      customerEmail: app.customerEmail,
      customerPhone: app.customerPhone,
      physicalAddress: app.physicalAddress,
    });
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingApplication(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setEditFormData({
        ...editFormData,
        physicalAddress: {
          ...editFormData.physicalAddress,
          [addressField]: value,
        },
      });
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleUpdateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication) return;

    try {
      const selectedPackage = packages.find((p) => p.id === editFormData.packageId);
      await apiService.updateApplication(editingApplication.id, {
        packageId: editFormData.packageId,
        packageName: selectedPackage?.name || editingApplication.packageName,
        customerName: editFormData.customerName,
        customerEmail: editFormData.customerEmail,
        customerPhone: editFormData.customerPhone,
        physicalAddress: editFormData.physicalAddress,
      });
      setToast({ show: true, message: 'Application updated successfully', type: 'success' });
      handleCloseEditModal();
      fetchData();
    } catch (error) {
      console.error('Error updating application:', error);
      setToast({ show: true, message: 'Failed to update application', type: 'error' });
    }
  };

  const handleCancel = async (app: Application) => {
    if (window.confirm(`Are you sure you want to cancel application ${app.applicationNumber}?`)) {
      try {
        await apiService.cancelApplication(app.id);
        setToast({ show: true, message: 'Application cancelled successfully', type: 'success' });
        fetchData();
      } catch (error) {
        console.error('Error cancelling application:', error);
        setToast({ show: true, message: 'Failed to cancel application', type: 'error' });
      }
    }
  };

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
                        <span
                          className="badge"
                          style={{
                            backgroundColor: getPackageColor(app.packageName),
                            color: getPackageColor(app.packageName) === '#ffd700' || getPackageColor(app.packageName) === '#c0c0c0' ? '#000' : '#fff',
                          }}
                        >
                          {app.packageName}
                        </span>
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
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleEdit(app)}
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        {app.status !== 'cancelled' && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancel(app)}
                            title="Cancel"
                          >
                            <i className="fas fa-times"></i>
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

      {/* Edit Modal */}
      {showEditModal && editingApplication && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit Application: {editingApplication.applicationNumber}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseEditModal}
                ></button>
              </div>
              <form onSubmit={handleUpdateApplication}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Package *</label>
                      <select
                        className="form-select"
                        name="packageId"
                        value={editFormData.packageId}
                        onChange={handleEditInputChange}
                        required
                      >
                        <option value="">Select Package</option>
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} - {pkg.speed} (KSh {pkg.price.toLocaleString()}/month)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Customer Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerName"
                        value={editFormData.customerName}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="customerEmail"
                        value={editFormData.customerEmail}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="customerPhone"
                        value={editFormData.customerPhone}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Building/Estate Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.building"
                        value={editFormData.physicalAddress.building}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Floor</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.floor"
                        value={editFormData.physicalAddress.floor}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Unit/House No</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.unit"
                        value={editFormData.physicalAddress.unit}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Street</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.street"
                        value={editFormData.physicalAddress.street}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Area</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.area"
                        value={editFormData.physicalAddress.area}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.city"
                        value={editFormData.physicalAddress.city}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.postalCode"
                        value={editFormData.physicalAddress.postalCode}
                        onChange={handleEditInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Application
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

export default SalesRecords;
