'use client';

import { useEffect, useState, Suspense } from 'react';
import { api } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function VehiclesContent() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await api.get('/vehicles');
      setVehicles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      await api.delete(`/vehicles/${id}`);
      fetchVehicles();
    } catch (error) {
      alert('Failed to delete vehicle');
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Vehicles</h1>
        <Link
          href="/admin/vehicles/new"
          className="btn btn-primary"
        >
          <i className="fas fa-plus me-2"></i>
          Add Vehicle
        </Link>
      </div>

      <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Vehicle</th>
                  <th>Year</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={vehicle.imageUrl}
                          alt={vehicle.make}
                          className="rounded me-2"
                          style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <strong>{vehicle.make} {vehicle.model}</strong>
                          <br />
                          <small className="text-muted">{vehicle.vin}</small>
                        </div>
                      </div>
                    </td>
                    <td>{vehicle.year}</td>
                    <td>{formatPrice(vehicle.priceKES)}</td>
                    <td>
                      <span className={`badge bg-${
                        vehicle.status === 'NEW' ? 'primary' :
                        vehicle.status === 'ON_SALE' ? 'warning' :
                        vehicle.status === 'CERTIFIED_PRE_OWNED' ? 'success' :
                        'secondary'
                      }`}>
                        {vehicle.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {vehicle.featured ? (
                        <span className="badge bg-warning">
                          <i className="fas fa-star"></i> Featured
                        </span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link
                          href={`/admin/vehicles/${vehicle.id}`}
                          className="btn btn-primary"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
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

          {vehicles.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-car fa-3x text-muted mb-3"></i>
              <p className="text-muted">No vehicles found</p>
              <Link href="/admin/vehicles/new" className="btn btn-primary">
                Add Your First Vehicle
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminVehiclesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehiclesContent />
    </Suspense>
  );
}
