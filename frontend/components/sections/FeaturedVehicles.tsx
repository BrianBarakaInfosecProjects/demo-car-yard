'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleModal from '@/components/vehicles/VehicleModal';
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
            <Link
              key={vehicle.id}
              href={vehicle.slug ? `/vehicles/${vehicle.slug}` : '/inventory'}
              className="w-full"
            >
              <VehicleCard vehicle={vehicle} />
            </Link>
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
