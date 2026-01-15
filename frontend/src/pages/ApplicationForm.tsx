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
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Kenyan cities - this will be replaced by backend data
  const kenyanCities = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Malindi',
    'Kitale',
    'Garissa',
    'Kakamega',
    'Nyeri',
    'Meru',
    'Machakos',
    'Embu',
    'Kericho',
    'Bungoma',
    'Busia',
    'Homa Bay',
    'Kisii',
    'Lamu',
  ];

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerNationalId: '',
    idType: 'id' as 'id' | 'passport',
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
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        physicalAddress: {
          ...formData.physicalAddress,
          [addressField]: value,
        },
      });
    } else if (name === 'idType') {
      setFormData({
        ...formData,
        idType: value as 'id' | 'passport',
        customerNationalId: '', // Clear ID when switching type
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

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Phone validation - must start with +254
  const validatePhone = (phone: string): boolean => {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');
    // Must start with +254 and have 9 more digits (total 13 characters)
    return /^\+254\d{9}$/.test(cleaned);
  };

  // Format phone to +254 format
  const formatPhone = (phone: string): string => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // If starts with 0, replace with +254
    if (digits.startsWith('0') && digits.length === 10) {
      return '+254' + digits.substring(1);
    }
    // If starts with 254, add +
    if (digits.startsWith('254') && digits.length === 12) {
      return '+' + digits;
    }
    // If already has +254, return as is
    if (phone.startsWith('+254')) {
      return phone.replace(/[\s-]/g, '');
    }
    // Otherwise, assume it's a 9-digit number and add +254
    if (digits.length === 9) {
      return '+254' + digits;
    }
    return phone;
  };

  // ID validation - 8 digits for Kenyan ID
  const validateId = (id: string): boolean => {
    return /^\d{8}$/.test(id);
  };

  // Passport validation - typically 6-9 alphanumeric characters
  const validatePassport = (passport: string): boolean => {
    // Passport numbers are typically 6-9 alphanumeric characters
    return /^[A-Z0-9]{6,9}$/i.test(passport);
  };

  const validateStep = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      // Package selection
      if (!formData.packageId) {
        setToast({ show: true, message: 'Please select a package', type: 'warning' });
        return false;
      }
    } else if (step === 2) {
      // Customer information
      if (!formData.customerName.trim()) {
        errors.customerName = 'Full name is required';
      }
      
      if (!formData.customerEmail.trim()) {
        errors.customerEmail = 'Email address is required';
      } else if (!validateEmail(formData.customerEmail)) {
        errors.customerEmail = 'Please enter a valid email address';
      }
      
      if (!formData.customerPhone.trim()) {
        errors.customerPhone = 'Phone number is required';
      } else {
        const formatted = formatPhone(formData.customerPhone);
        if (!validatePhone(formatted)) {
          errors.customerPhone = 'Phone must be in format +254XXXXXXXXX (e.g., +254712345678)';
        } else {
          // Update with formatted phone
          setFormData({ ...formData, customerPhone: formatted });
        }
      }
      
      if (!formData.customerNationalId.trim()) {
        errors.customerNationalId = `${formData.idType === 'id' ? 'National ID' : 'Passport number'} is required`;
      } else {
        if (formData.idType === 'id') {
          if (!validateId(formData.customerNationalId)) {
            errors.customerNationalId = 'National ID must be exactly 8 digits';
          }
        } else {
          if (!validatePassport(formData.customerNationalId)) {
            errors.customerNationalId = 'Passport number must be 6-9 alphanumeric characters';
          }
        }
      }
      
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        setToast({ show: true, message: 'Please correct the errors in the form', type: 'warning' });
        return false;
      }
    } else if (step === 3) {
      // Physical address - only building and city are required
      if (!formData.physicalAddress.building.trim()) {
        setToast({ show: true, message: 'Building/Estate name is required', type: 'warning' });
        return false;
      }
      if (!formData.physicalAddress.city.trim()) {
        setToast({ show: true, message: 'City is required', type: 'warning' });
        return false;
      }
    }
    
    setValidationErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setValidationErrors({});
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
        idType: formData.idType,
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
            {/* Step 1: Package Selection */}
            {step === 1 && (
              <div>
                <h4 className="mb-3">Select WiFi Package</h4>
                <p className="text-muted mb-4">Please select the package that best suits your customer's needs.</p>
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

            {/* Step 2: Customer Information */}
            {step === 2 && (
              <div>
                <h4 className="mb-3">Customer Information</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.customerName ? 'is-invalid' : ''}`}
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.customerName && (
                      <div className="invalid-feedback">{validationErrors.customerName}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className={`form-control ${validationErrors.customerEmail ? 'is-invalid' : ''}`}
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      required
                    />
                    {validationErrors.customerEmail && (
                      <div className="invalid-feedback">{validationErrors.customerEmail}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text">+254</span>
                      <input
                        type="tel"
                        className={`form-control ${validationErrors.customerPhone ? 'is-invalid' : ''}`}
                        name="customerPhone"
                        value={formData.customerPhone.replace('+254', '')}
                        onChange={(e) => {
                          const value = e.target.value;
                          const formatted = formatPhone('+254' + value.replace(/\D/g, ''));
                          setFormData({ ...formData, customerPhone: formatted });
                          if (validationErrors.customerPhone) {
                            setValidationErrors({ ...validationErrors, customerPhone: '' });
                          }
                        }}
                        placeholder="712345678"
                        required
                      />
                    </div>
                    {validationErrors.customerPhone && (
                      <div className="invalid-feedback">{validationErrors.customerPhone}</div>
                    )}
                    <small className="text-muted">Format: +254XXXXXXXXX (e.g., +254712345678)</small>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ID Type *</label>
                    <select
                      className="form-control"
                      name="idType"
                      value={formData.idType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="id">National ID</option>
                      <option value="passport">Passport</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      {formData.idType === 'id' ? 'National ID *' : 'Passport Number *'}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.customerNationalId ? 'is-invalid' : ''}`}
                      name="customerNationalId"
                      value={formData.customerNationalId}
                      onChange={handleInputChange}
                      placeholder={formData.idType === 'id' ? '12345678 (8 digits)' : 'A1234567 (6-9 characters)'}
                      required
                    />
                    {validationErrors.customerNationalId && (
                      <div className="invalid-feedback">{validationErrors.customerNationalId}</div>
                    )}
                    <small className="text-muted">
                      {formData.idType === 'id'
                        ? 'Kenyan National ID: 8 digits'
                        : 'Passport: 6-9 alphanumeric characters'}
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Physical Address */}
            {step === 3 && (
              <div>
                <h4 className="mb-3">Physical Address</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Building/Estate Name *</label>
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
                    <label className="form-label">Floor</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.floor"
                      value={formData.physicalAddress.floor}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Unit/House No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.unit"
                      value={formData.physicalAddress.unit}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Street</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address.street"
                        value={formData.physicalAddress.street}
                        onChange={handleInputChange}
                      />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Area</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.area"
                      value={formData.physicalAddress.area}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City *</label>
                    <select
                      className="form-control"
                      name="address.city"
                      value={formData.physicalAddress.city}
                      onChange={handleInputChange}
                      required
                    >
                      {kenyanCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address.postalCode"
                      value={formData.physicalAddress.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: KYC Documents */}
            {step === 4 && (
              <div>
                <h4 className="mb-3">KYC Documents</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      {formData.idType === 'id' ? 'National ID Copy' : 'Passport Copy'}
                    </label>
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
                    <p><strong>Address:</strong> {formData.physicalAddress.building}, {formData.physicalAddress.area || formData.physicalAddress.city}</p>
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
