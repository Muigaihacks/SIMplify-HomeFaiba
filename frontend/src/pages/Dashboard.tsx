import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/api';
import type { Application, Salesman } from '../types';

const Dashboard: React.FC = () => {
  const { dealerId, agentId, userRole } = useAppContext();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    activeApplications: 0,
    totalSalesmen: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        if (userRole === 'dealer') {
          const [applications, salesmen] = await Promise.all([
            apiService.getApplications(dealerId),
            apiService.getSalesmen(dealerId),
          ]);

          setStats({
            totalApplications: applications.length,
            pendingApplications: applications.filter((a: Application) => a.status === 'pending').length,
            activeApplications: applications.filter((a: Application) => a.status === 'active').length,
            totalSalesmen: salesmen.length,
          });
        } else if (agentId) {
          const applications = await apiService.getApplications(dealerId, agentId);
          setStats({
            totalApplications: applications.length,
            pendingApplications: applications.filter((a: Application) => a.status === 'pending').length,
            activeApplications: applications.filter((a: Application) => a.status === 'active').length,
            totalSalesmen: 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [dealerId, agentId, userRole]);

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
        <i className="fas fa-tachometer-alt me-2"></i>Dashboard
      </h1>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-file-alt me-2"></i>Total Applications
              </h5>
              <h2 className="card-text">{stats.totalApplications}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-clock me-2"></i>Pending
              </h5>
              <h2 className="card-text">{stats.pendingApplications}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-check-circle me-2"></i>Active
              </h5>
              <h2 className="card-text">{stats.activeApplications}</h2>
            </div>
          </div>
        </div>

        {userRole === 'dealer' && (
          <div className="col-md-3">
            <div className="card text-white bg-info">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-users me-2"></i>Salesmen
                </h5>
                <h2 className="card-text">{stats.totalSalesmen}</h2>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="mb-3">Quick Actions</h3>
        <div className="row g-3">
          {userRole === 'agent' ? (
            <>
              <div className="col-md-6">
                <a href="/application" className="btn btn-success btn-lg w-100">
                  <i className="fas fa-plus-circle me-2"></i>Create New Application
                </a>
              </div>
              <div className="col-md-6">
                <a href="/packages" className="btn btn-primary btn-lg w-100">
                  <i className="fas fa-box me-2"></i>View Packages
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-4">
                <a href="/salesmen" className="btn btn-primary btn-lg w-100">
                  <i className="fas fa-users me-2"></i>Manage Salesmen
                </a>
              </div>
              <div className="col-md-4">
                <a href="/sales" className="btn btn-success btn-lg w-100">
                  <i className="fas fa-shopping-cart me-2"></i>View Sales
                </a>
              </div>
              <div className="col-md-4">
                <a href="/commissions" className="btn btn-warning btn-lg w-100">
                  <i className="fas fa-money-bill-wave me-2"></i>Commissions
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
