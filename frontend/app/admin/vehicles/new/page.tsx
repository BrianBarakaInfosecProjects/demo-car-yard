'use client';

import { useEffect, useState, Suspense } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  priceKES: number;
  mileage: number;
  bodyType: 'SEDAN' | 'SUV' | 'TRUCK' | 'COUPE' | 'HATCHBACK' | 'WAGON';
  fuelType: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  vin: string;
  status: 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED' | 'ON_SALE';
  featured: boolean;
  description: string;
  imageUrl: string;
}

function VehicleFormContent({ vehicleId }: { vehicleId?: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<VehicleFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    priceKES: 0,
    mileage: 0,
    bodyType: 'SEDAN',
    fuelType: 'GASOLINE',
    transmission: 'Automatic',
    drivetrain: 'FWD',
    exteriorColor: '',
    interiorColor: '',
    engine: '',
    vin: '',
    status: 'USED',
    featured: false,
    description: '',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (vehicleId) {
      setIsEditing(true);
      fetchVehicle(vehicleId);
    }
  }, [vehicleId]);

  const fetchVehicle = async (id: string) => {
    try {
      const data = await api.get(`/vehicles/${id}`);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/vehicles/${vehicleId}`, formData);
      } else {
        await api.post('/vehicles', formData);
      }
      router.push('/admin/vehicles');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save vehicle');
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
        <Link href="/admin/vehicles" className="btn btn-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Back to Vehicles
        </Link>
      </div>

      <div className="card shadow border-0" style={{ borderRadius: '15px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Make</label>
                <select
                  className="form-select"
                  value={formData.make}
                  onChange={(e) =>
                    setFormData({ ...formData, make: e.target.value })
                  }
                  required
                >
                  <option value="">Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Ford">Ford</option>
                  <option value="Honda">Honda</option>
                  <option value="BMW">BMW</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Jeep">Jeep</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Hyundai">Hyundai</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Ram">Ram</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Audi">Audi</option>
                  <option value="Kia">Kia</option>
                  <option value="Lexus">Lexus</option>
                  <option value="GMC">GMC</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Genesis">Genesis</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.model}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Year</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  min="1990"
                  max="2030"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Price (KSh)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.priceKES}
                  onChange={(e) =>
                    setFormData({ ...formData, priceKES: parseInt(e.target.value) })
                  }
                  min="0"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Mileage (km)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.mileage}
                  onChange={(e) =>
                    setFormData({ ...formData, mileage: parseInt(e.target.value) })
                  }
                  min="0"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Body Type</label>
                <select
                  className="form-select"
                  value={formData.bodyType}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyType: e.target.value as any })
                  }
                  required
                >
                  <option value="SEDAN">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="TRUCK">Truck</option>
                  <option value="COUPE">Coupe</option>
                  <option value="HATCHBACK">Hatchback</option>
                  <option value="WAGON">Wagon</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Fuel Type</label>
                <select
                  className="form-select"
                  value={formData.fuelType}
                  onChange={(e) =>
                    setFormData({ ...formData, fuelType: e.target.value as any })
                  }
                  required
                >
                  <option value="GASOLINE">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ELECTRIC">Electric</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Transmission</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.transmission}
                  onChange={(e) =>
                    setFormData({ ...formData, transmission: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Drivetrain</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.drivetrain}
                  onChange={(e) =>
                    setFormData({ ...formData, drivetrain: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Engine</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.engine}
                  onChange={(e) =>
                    setFormData({ ...formData, engine: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Exterior Color</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.exteriorColor}
                  onChange={(e) =>
                    setFormData({ ...formData, exteriorColor: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Interior Color</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.interiorColor}
                  onChange={(e) =>
                    setFormData({ ...formData, interiorColor: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">VIN</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.vin}
                  onChange={(e) =>
                    setFormData({ ...formData, vin: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as any })
                  }
                  required
                >
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                  <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
                  <option value="ON_SALE">On Sale</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">&nbsp;</label>
                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                  />
                  <label className="form-check-label" htmlFor="featured">
                    Featured Vehicle
                  </label>
                </div>
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                ></textarea>
              </div>
              <div className="col-12">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  required
                />
                <small className="text-muted">
                  Enter the URL of the vehicle image
                </small>
              </div>
              <div className="col-12 mt-4">
                <div className="d-flex gap-3">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
                      </>
                    )}
                  </button>
                  <Link
                    href="/admin/vehicles"
                    className="btn btn-secondary"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VehicleFormPage({
  params,
}: {
  params: { id?: string };
}) {
  const vehicleId = params?.id;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VehicleFormContent vehicleId={vehicleId} />
    </Suspense>
  );
}
