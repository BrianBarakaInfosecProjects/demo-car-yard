'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', formData);
      
      if (!response.token) {
        throw new Error('No token received from server');
      }
      
      setToken(response.token);
      router.push('/admin/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                       err.message || 
                       'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="vehicles-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#0c0a08' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '20px', background: '#1c1814', border: '1px solid #2d2d2d' }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="mb-3" style={{ color: '#faf6ef' }}>Admin Login</h2>
                  <p className="text-muted" style={{ color: '#a09888' }}>Sign in to access the admin panel</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label" style={{ color: '#faf6ef' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      style={{ background: '#161310', border: '1px solid #2d2d2d', color: '#faf6ef' }}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label" style={{ color: '#faf6ef' }}>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      style={{ background: '#161310', border: '1px solid #2d2d2d', color: '#faf6ef' }}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary py-3"
                      style={{ background: '#c4933f', border: 'none', color: '#0c0a08' }}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0" style={{ color: '#a09888', fontSize: '12px' }}>
                    Contact your administrator if you need access.
                  </p>
                </div>

                <div className="text-center mt-3">
                  <Link href="/" className="text-muted" style={{ color: '#c4933f' }}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Home
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
