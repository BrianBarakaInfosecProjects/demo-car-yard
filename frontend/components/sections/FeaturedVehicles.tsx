'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleModal from '@/components/vehicles/VehicleModal';
import { formatPrice } from '@/lib/utils';
import { ArrowRight, Car } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedVehicles() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await api.get('/vehicles/featured');
        const vehicles = Array.isArray(data) ? data : [];
        setFeaturedVehicles(vehicles.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch featured vehicles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredVehicles.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="section-title">Featured Vehicles</h2>
            <p className="text-gray-600">Hand-picked quality cars available now</p>
          </div>
          <Link href="/inventory" className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:underline">
            View All <ArrowRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="col-lg-3 col-md-6">
              <div
                className="car-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                onClick={() => setSelectedVehicle(vehicle)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedVehicle(vehicle);
                  }
                }}
              >
                <div className="car-image-wrapper">
                  <img
                    src={vehicle.imageUrl}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="car-image"
                  />
                  {vehicle.featured && (
                    <span className="badge-overlay badge bg-danger">Featured</span>
                  )}
                </div>

                <div className="car-body">
                  <div className="car-year-badge">
                    {vehicle.year}
                  </div>
                  <h5 className="car-title">
                    {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
                  </h5>

                  <div className="car-meta">
                    <div className="meta-grid">
                      <div className="meta-item">
                        <div className="meta-icon">
                          <i className="fas fa-tachometer-alt"></i>
                        </div>
                        <div>
                          <span className="meta-value">{vehicle.mileage.toLocaleString()} km</span>
                        </div>
                      </div>
                      <div className="meta-item">
                        <div className="meta-icon">
                          <i className="fas fa-gas-pump"></i>
                        </div>
                        <div>
                          <span className="meta-value">{vehicle.fuelType.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="car-price-section">
                    <div className="car-price">{formatPrice(vehicle.priceKES)}</div>
                  </div>

                  <div className="mt-3">
                    <Link
                      href={`/vehicle/${vehicle.id}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:text-white hover:shadow-md group w-full"
                    >
                      <span>View Details</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/inventory"
            className="btn btn-primary btn-lg px-8 py-3 inline-flex items-center gap-2"
          >
            <Car size={20} />
            <span>Browse Full Inventory</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      <VehicleModal
        isOpen={!!selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        vehicle={selectedVehicle}
      />
    </section>
  );
}
