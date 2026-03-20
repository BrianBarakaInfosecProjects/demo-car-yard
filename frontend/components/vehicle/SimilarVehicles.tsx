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
      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 300, color: 'var(--gold)', marginBottom: '24px' }}>Similar Vehicles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ background: 'var(--ink-soft)', borderRadius: '12px', height: '300px', border: '1px solid var(--border)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) return null;

  return (
    <div style={{ marginTop: '32px' }}>
      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 300, color: 'var(--gold)', marginBottom: '24px' }}>Similar Vehicles</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle as any} />
        ))}
      </div>
    </div>
  );
}
