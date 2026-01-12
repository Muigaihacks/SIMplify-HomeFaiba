import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import type { Package } from '../types';

const PackagesComparison: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPackages();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

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
      <h1 className="mb-4">
        <i className="fas fa-box me-2"></i>WiFi Packages Comparison
      </h1>

      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        Use this tool to help customers choose the right package for their needs.
      </div>

      <div className="row g-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="col-md-6 col-lg-3">
            <div
              className="card h-100 shadow-sm"
              style={{
                borderTop: `4px solid ${pkg.color}`,
              }}
            >
              <div
                className="card-header text-white text-center"
                style={{ backgroundColor: pkg.color }}
              >
                <h3 className="mb-0">{pkg.name}</h3>
                <p className="mb-0">
                  <small>Package</small>
                </p>
              </div>
              <div className="card-body d-flex flex-column">
                <div className="text-center mb-3">
                  <h2 className="text-primary mb-0">
                    KSh {pkg.price.toLocaleString()}
                  </h2>
                  <small className="text-muted">per month</small>
                </div>

                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="fas fa-tachometer-alt fa-2x text-primary me-2"></i>
                    <h4 className="mb-0">{pkg.speed}</h4>
                  </div>
                  <p className="text-muted text-center small">{pkg.description}</p>
                </div>

                <hr />

                <div className="mb-3">
                  <h6 className="mb-3">
                    <i className="fas fa-check-circle text-success me-2"></i>Features:
                  </h6>
                  <ul className="list-unstyled">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="mb-2">
                        <i className="fas fa-check text-success me-2"></i>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto">
                  <button className="btn btn-success w-100">
                    <i className="fas fa-shopping-cart me-2"></i>Select Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-5">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="fas fa-table me-2"></i>Comparison Table
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead className="table-light">
                <tr>
                  <th>Feature</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="text-center">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Speed</strong>
                  </td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="text-center">
                      {pkg.speed}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Price (Monthly)</strong>
                  </td>
                  {packages.map((pkg) => (
                    <td key={pkg.id} className="text-center">
                      KSh {pkg.price.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>
                    <strong>Features</strong>
                  </td>
                  {packages.map((pkg) => (
                    <td key={pkg.id}>
                      <ul className="list-unstyled mb-0">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx}>
                            <i className="fas fa-check text-success me-1"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="alert alert-success mt-4">
        <h5>
          <i className="fas fa-lightbulb me-2"></i>Tips for Agents:
        </h5>
        <ul className="mb-0">
          <li>
            <strong>Bronze:</strong> Best for single users or small households with
            basic internet needs
          </li>
          <li>
            <strong>Silver:</strong> Ideal for families with multiple devices and
            moderate usage
          </li>
          <li>
            <strong>Gold:</strong> Perfect for large families, home offices, and
            streaming enthusiasts
          </li>
          <li>
            <strong>Platinum:</strong> Ultimate choice for power users, gamers, and
            small businesses
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PackagesComparison;
