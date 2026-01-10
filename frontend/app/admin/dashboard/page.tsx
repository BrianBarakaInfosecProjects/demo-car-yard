'use client';

import { useEffect, useState, Suspense } from 'react';
import { api } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalInquiries: 0,
    featuredVehicles: 0,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
      return;
    }

    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [vehicles, inquiries] = await Promise.all([
        api.get('/vehicles'),
        api.get('/inquiries'),
      ]);

      setStats({
        totalVehicles: vehicles.length,
        totalInquiries: inquiries.length,
        featuredVehicles: vehicles.filter((v: any) => v.featured).length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Dashboard</h1>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card shadow border-0 h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle p-3 me-3"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                    color: 'white',
                  }}
                >
                  <i className="fas fa-car fa-2x"></i>
                </div>
                <div>
                  <h5 className="card-title mb-1">Total Vehicles</h5>
                  <h2 className="display-4 fw-bold text-primary">
                    {stats.totalVehicles}
                  </h2>
                </div>
              </div>
              <a
                href="/admin/vehicles"
                className="btn btn-outline-primary w-100 mt-3"
              >
                Manage Vehicles
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle p-3 me-3"
                  style={{
                    background: 'linear-gradient(135deg, var(--success), #059669)',
                    color: 'white',
                  }}
                >
                  <i className="fas fa-envelope fa-2x"></i>
                </div>
                <div>
                  <h5 className="card-title mb-1">Total Inquiries</h5>
                  <h2 className="display-4 fw-bold text-success">
                    {stats.totalInquiries}
                  </h2>
                </div>
              </div>
              <a
                href="/admin/inquiries"
                className="btn btn-outline-success w-100 mt-3"
                style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
              >
                View Inquiries
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle p-3 me-3"
                  style={{
                    background: 'linear-gradient(135deg, var(--warning), #d97706)',
                    color: 'white',
                  }}
                >
                  <i className="fas fa-star fa-2x"></i>
                </div>
                <div>
                  <h5 className="card-title mb-1">Featured Vehicles</h5>
                  <h2 className="display-4 fw-bold text-warning">
                    {stats.featuredVehicles}
                  </h2>
                </div>
              </div>
              <a
                href="/admin/vehicles"
                className="btn btn-outline-warning w-100 mt-3"
                style={{ borderColor: 'var(--warning)', color: 'var(--warning)' }}
              >
                Manage Featured
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
        <div className="card-body p-4">
          <h4 className="card-title mb-4">Quick Actions</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <a
                href="/admin/vehicles/new"
                className="btn btn-primary w-100 py-3"
              >
                <i className="fas fa-plus me-2"></i>
                Add New Vehicle
              </a>
            </div>
            <div className="col-md-6">
              <a
                href="/admin/inquiries"
                className="btn btn-secondary w-100 py-3"
              >
                <i className="fas fa-list me-2"></i>
                View All Inquiries
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
