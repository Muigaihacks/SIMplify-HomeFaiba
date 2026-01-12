import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Package, PhysicalAddress } from '../types';
import Toast from '../components/Toast';

const ApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const { dealerId, agentId } = useAppContext();
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' | 'warning' });

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerNationalId: '',
    physicalAddress: {
      building: '',
      floor: '',
      unit: '',
      street: '',
      area: '',
      city: 'Nairobi',
      postalCode: '',
    } as PhysicalAddress,
    packageId: 0,
    kycDocuments: {
      nationalId: null as File | null,
      proofOfAddress: null as File | null,
    },
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await apiService.getPackages();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setToast({ show: true, message: 'Failed to load packages', type: 'error' });
      }
    };
    fetchPackages();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        physicalAddress: {
          ...formData.physicalAddress,
          [addressField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        kycDocuments: {
          ...formData.kycDocuments,
          [name]: files[0],
        },
      });
    }
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.customerNationalId) {
        setToast({ show: true, message: 'Please fill all customer information fields', type: 'warning' });
        return false;
      }
    } else if (step === 2) {
      const addr = formData.physicalAddress;
      if (!addr.building || !addr.floor || !addr.unit || !addr.street || !addr.area || !addr.postalCode) {
        setToast({ show: true, message: 'Please fill all address fields', type: 'warning' });
        return false;
      }
    } else if (step === 3) {
      if (!formData.packageId) {
        setToast({ show: true, message: 'Please select a package', type: 'warning' });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const selectedPackage = packages.find((p) => p.id === formData.packageId);
      const applicationData = {
        dealerId,
        agentId,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerNationalId: formData.customerNationalId,
        physicalAddress: formData.physicalAddress,
        packageId: formData.packageId,
        packageName: selectedPackage?.name || '',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        kycDocuments: {
          nationalId: formData.kycDocuments.nationalId ? 'uploaded' : 'pending',
          proofOfAddress: formData.kycDocuments.proofOfAddress ? 'uploaded' : 'pending',
        },
      };

      await apiService.createApplication(applicationData);
      setToast({ show: true, message: 'Application submitted successfully!', type: 'success' });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      setToast({ show: true, message: 'Failed to submit application', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedPackage = packages.find((p) => p.id === formData.packageId);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">
        <i className="fas fa-file-alt me-2"></i>Fixed Service Application Form
      </h1>

      <div className="card">
        <div className="card-header bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Step {step} of 4</h5>
            <div>
              {[1, 2, 3, 4].map((s) => (
                <span
                  key={s}
                  className={`badge ${s <= step ? 'bg-light text-dark' : 'bg-secondary'} me-1`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Customer Information */}
            {step === 1 && (
              <div>
                <h4 className="mb-3">Customer Information</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">National ID *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="customerNationalId"
                      value={formData.customerNationalId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Physical Address */}
            {step === 2 && (
              <div>
                <h4 className="mb-3">Physical Address</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Building Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.building"
                      value={formData.physicalAddress.building}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Floor *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.floor"
                      value={formData.physicalAddress.floor}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Unit/Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.unit"
                      value={formData.physicalAddress.unit}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Street *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.street"
                      value={formData.physicalAddress.street}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Area *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.area"
                      value={formData.physicalAddress.area}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.city"
                      value={formData.physicalAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Postal Code *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.postalCode"
                      value={formData.physicalAddress.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Package Selection */}
            {step === 3 && (
              <div>
                <h4 className="mb-3">Select Package</h4>
                <div className="row g-3">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="col-md-6">
                      <div
                        className={`card h-100 ${formData.packageId === pkg.id ? 'border-success border-3' : ''}`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFormData({ ...formData, packageId: pkg.id })}
                      >
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="card-title">{pkg.name}</h5>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: pkg.color,
                                color: pkg.color === '#ffd700' || pkg.color === '#c0c0c0' ? '#000' : '#fff',
                              }}
                            >
                              KSh {pkg.price.toLocaleString()}/month
                            </span>
                          </div>
                          <p className="text-muted">{pkg.description}</p>
                          <p className="fw-bold">
                            <i className="fas fa-tachometer-alt me-1"></i>
                            {pkg.speed}
                          </p>
                          <ul className="list-unstyled">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx}>
                                <i className="fas fa-check text-success me-2"></i>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: KYC Documents */}
            {step === 4 && (
              <div>
                <h4 className="mb-3">KYC Documents</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">National ID Copy</label>
                    <input
                      type="file"
                      className="form-control"
                      name="nationalId"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />
                    {formData.kycDocuments.nationalId && (
                      <small className="text-success">
                        <i className="fas fa-check me-1"></i>File selected
                      </small>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Proof of Address</label>
                    <input
                      type="file"
                      className="form-control"
                      name="proofOfAddress"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />
                    {formData.kycDocuments.proofOfAddress && (
                      <small className="text-success">
                        <i className="fas fa-check me-1"></i>File selected
                      </small>
                    )}
                  </div>
                </div>

                {selectedPackage && (
                  <div className="mt-4 p-3 bg-light rounded">
                    <h5>Application Summary</h5>
                    <p><strong>Customer:</strong> {formData.customerName}</p>
                    <p><strong>Package:</strong> {selectedPackage.name} - {selectedPackage.speed}</p>
                    <p><strong>Monthly Fee:</strong> KSh {selectedPackage.price.toLocaleString()}</p>
                    <p><strong>Address:</strong> {formData.physicalAddress.building}, {formData.physicalAddress.area}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 d-flex justify-content-between">
              {step > 1 && (
                <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                  <i className="fas fa-arrow-left me-1"></i>Previous
                </button>
              )}
              <div className="ms-auto">
                {step < 4 ? (
                  <button type="button" className="btn btn-primary" onClick={handleNext}>
                    Next<i className="fas fa-arrow-right ms-1"></i>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-1"></i>Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
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

export default ApplicationForm;
