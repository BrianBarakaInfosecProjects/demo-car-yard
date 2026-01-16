'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import VehicleGallery from '@/components/vehicle/VehicleGallery';
import VehicleHeader from '@/components/vehicle/VehicleHeader';
import VehicleSpecsTabs from '@/components/vehicle/VehicleSpecsTabs';
import SimilarVehicles from '@/components/vehicle/SimilarVehicles';

export default function VehicleDetailsPage() {
  const params = useParams();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await api.get(`/vehicles/slug/${params.slug}`);
        setVehicle(data);
        setLoading(false);

        if (data.id) {
          const similar = await api.get(`/vehicles/similar/${data.id}`, { limit: 4 });
          setSimilarVehicles(similar);
          setSimilarLoading(false);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        setLoading(false);
        setVehicle(null);
      }
    };

    fetchVehicle();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-16 bg-gray-50">
        <div className="container">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Vehicle Not Found</h1>
          <p className="text-gray-600 text-lg mb-6">
            The vehicle you're looking for doesn't exist or may have been removed.
          </p>
          <a
            href="/inventory"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Browse All Vehicles
          </a>
        </div>
      </div>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.imageUrl];

  return (
    <div className="vehicle-details-page">
      <div className="container">
        <div className="vehicle-details-layout">
          <div className="vehicle-gallery-section">
            <VehicleGallery
              images={images}
              title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />
          </div>

          <div className="vehicle-details-panel">
            <VehicleHeader
              vehicle={vehicle}
              status={vehicle.status}
            />
          </div>
        </div>

        <div className="vehicle-specs-section">
          <VehicleSpecsTabs
            vehicle={vehicle}
          />
        </div>

        <div className="vehicle-description-section">
          <h2 className="description-title">About This Vehicle</h2>
          <div className="description-content">
            <p>{vehicle.description}</p>
          </div>
        </div>

        {similarVehicles.length > 0 && (
          <div className="similar-vehicles-section">
            <SimilarVehicles vehicles={similarVehicles} loading={similarLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
