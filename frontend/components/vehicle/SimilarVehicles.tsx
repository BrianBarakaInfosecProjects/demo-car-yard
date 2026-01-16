'use client';

import { useState } from 'react';
import VehicleCard from '@/components/vehicles/VehicleCard';

interface SimilarVehiclesProps {
  vehicles: Array<{
    id: string;
    slug: string;
    make: string;
    model: string;
    year: number;
    priceKES: number;
    mileage: number;
    bodyType: 'SEDAN' | 'SUV' | 'TRUCK' | 'COUPE' | 'HATCHBACK' | 'WAGON';
    fuelType: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
    transmission: string;
    exteriorColor: string;
    interiorColor: string;
    engine: string;
    drivetrain: string;
    vin: string;
    status: 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED' | 'ON_SALE';
    featured: boolean;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  }>;
  loading?: boolean;
}

export default function SimilarVehicles({ vehicles, loading = false }: SimilarVehiclesProps) {
  if (loading) {
    return (
      <div className="similar-vehicles">
        <div className="container">
          <h2 className="similar-vehicles-title">Similar Vehicles</h2>
          <div className="similar-vehicles-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="similar-vehicle-item col-lg-3 col-md-4 col-sm-6">
                <div className="skeleton-card" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
