'use client';

import { useEffect, useState, Suspense } from 'react';
import { api } from '@/lib/api';
import { Inquiry } from '@/lib/types';

function InquiriesContent() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED'>('ALL');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const data = await api.get('/inquiries');
      setInquiries(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status });
      fetchInquiries();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) {
      return;
    }

    try {
      await api.delete(`/inquiries/${id}`);
      fetchInquiries();
    } catch (error) {
      alert('Failed to delete inquiry');
    }
  };

  const filteredInquiries =
    filter === 'ALL'
      ? inquiries
      : inquiries.filter((i) => i.status === filter);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Manage Inquiries</h1>

      <div className="card shadow border-0 mb-4" style={{ borderRadius: '15px' }}>
        <div className="card-body p-3">
          <div className="btn-group">
            <button
              className={`btn ${
                filter === 'ALL' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setFilter('ALL')}
            >
              All ({inquiries.length})
            </button>
            <button
              className={`btn ${
                filter === 'PENDING' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setFilter('PENDING')}
            >
              Pending ({inquiries.filter((i) => i.status === 'PENDING').length})
            </button>
            <button
              className={`btn ${
                filter === 'RESOLVED' ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setFilter('RESOLVED')}
            >
              Resolved ({inquiries.filter((i) => i.status === 'RESOLVED').length})
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Vehicle</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      {new Date(inquiry.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <strong>{inquiry.name}</strong>
                      <br />
                      <small className="text-muted">{inquiry.email}</small>
                    </td>
                    <td>
                      <i className="fas fa-phone me-1 text-primary"></i>
                      {inquiry.phone}
                    </td>
                    <td>
                      {inquiry.vehicle ? (
                        <div>
                          <strong>{inquiry.vehicle.make} {inquiry.vehicle.model}</strong>
                          <br />
                          <small className="text-muted">
                            {inquiry.vehicle.year} • KSh {inquiry.vehicle.priceKES.toLocaleString()}
                          </small>
                        </div>
                      ) : (
                        <span className="text-muted">General Inquiry</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          inquiry.status === 'PENDING'
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: '120px' }}
                          value={inquiry.status}
                          onChange={(e) => updateStatus(inquiry.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="btn btn-danger"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInquiries.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-envelope-open fa-3x text-muted mb-3"></i>
              <p className="text-muted">No inquiries found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InquiriesContent />
    </Suspense>
  );
}
