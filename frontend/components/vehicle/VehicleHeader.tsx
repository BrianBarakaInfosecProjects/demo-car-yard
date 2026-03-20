'use client';

import { Fuel, Gauge, Settings, MapPin } from 'lucide-react';

interface VehicleHeaderProps {
  vehicle: {
    make: string;
    model: string;
    year: number;
    priceKES: number;
    mileage: number;
    fuelType: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
    transmission: string;
    bodyType: 'SEDAN' | 'SUV' | 'TRUCK' | 'COUPE' | 'HATCHBACK' | 'WAGON';
    exteriorColor: string;
    interiorColor: string;
    engine: string;
    vin: string;
    location?: string;
  };
  status: 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED' | 'ON_SALE';
}

export default function VehicleHeader({ vehicle, status }: VehicleHeaderProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-KE', {
      maximumFractionDigits: 0,
    }).format(mileage);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'NEW':
        return '#10b981';
      case 'CERTIFIED_PRE_OWNED':
        return '#8b5cf6';
      case 'ON_SALE':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'CERTIFIED_PRE_OWNED':
        return 'Certified';
      case 'ON_SALE':
        return 'On Sale';
      default:
        return 'Used';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--ink-soft)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span
            style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 700, color: 'white', borderRadius: '20px', textTransform: 'uppercase', backgroundColor: getStatusColor() }}
          >
            {getStatusLabel()}
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700, color: 'var(--gold)', marginTop: '4px' }}>
          {formatPrice(vehicle.priceKES)}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
        <div style={{ background: 'var(--ink)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Fuel size={12} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em' }}>Fuel</span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{vehicle.fuelType}</p>
        </div>
        <div style={{ background: 'var(--ink)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Gauge size={12} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em' }}>Mileage</span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{formatMileage(vehicle.mileage)} km</p>
        </div>
        <div style={{ background: 'var(--ink)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <Settings size={12} style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em' }}>Transmission</span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{vehicle.transmission}</p>
        </div>
        <div style={{ background: 'var(--ink)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)' }}>
          <div style={{ marginBottom: '2px' }}>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em' }}>Body</span>
          </div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{vehicle.bodyType}</p>
        </div>
        {vehicle.location && (
          <div style={{ background: 'var(--ink)', borderRadius: '8px', padding: '12px', border: '1px solid var(--border)', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <MapPin size={12} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.1em' }}>Location</span>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>{vehicle.location}</p>
          </div>
        )}
      </div>
    </div>
  );
}
