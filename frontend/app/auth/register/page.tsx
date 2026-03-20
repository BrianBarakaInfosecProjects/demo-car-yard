'use client';

import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RegisterPage() {
  return (
    <section className="vehicles-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#0c0a08' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px', background: '#1c1814', border: '1px solid #2d2d2d' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto' }}>
                      <circle cx="32" cy="32" r="30" stroke="#2d2d2d" strokeWidth="2" strokeDasharray="4 4"/>
                      <path d="M32 20v24M20 32h24" stroke="#a09888" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <h2 className="mb-3" style={{ color: '#faf6ef' }}>Registration Disabled</h2>
                  <p className="text-muted" style={{ color: '#a09888' }}>
                    Public registration is disabled. Admin accounts can only be created by existing administrators.
                  </p>
                </div>

                <div className="alert alert-info" role="alert" style={{ background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: '12px', color: '#93c5fd' }}>
                  <div className="d-flex align-items-start gap-2">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M9 6v3M9 11v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <div>
                      <strong style={{ color: '#c4933f' }}>For Administrators</strong>
                      <p className="mb-0 mt-1" style={{ color: '#a09888' }}>
                        To create new admin accounts, please log in and go to <strong>Settings → User Management</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-grid mt-4">
                  <Link href="/auth/login" className="btn btn-primary py-3" style={{ background: '#c4933f', border: 'none', color: '#0c0a08' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '8px' }}>
                      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
