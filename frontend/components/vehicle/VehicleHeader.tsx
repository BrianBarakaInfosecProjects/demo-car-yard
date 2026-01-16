'use client';

import { Fuel, Gauge, Settings, MapPin, Calendar, Shield } from 'lucide-react';

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
    <div className="vehicle-header">
      <div className="vehicle-header-main">
        <h1 className="vehicle-title">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>

        <div className="vehicle-price-section">
          <div className="vehicle-price">{formatPrice(vehicle.priceKES)}</div>
          <div
            className="vehicle-status-badge"
            style={{ backgroundColor: getStatusColor() }}
          >
            {getStatusLabel()}
          </div>
        </div>
      </div>

      <div className="vehicle-specs">
        <div className="spec-item">
          <Fuel className="spec-icon" size={18} />
          <div className="spec-content">
            <span className="spec-label">Fuel</span>
            <span className="spec-value">{vehicle.fuelType}</span>
          </div>
        </div>

        <div className="spec-item">
          <Gauge className="spec-icon" size={18} />
          <div className="spec-content">
            <span className="spec-label">Mileage</span>
            <span className="spec-value">{formatMileage(vehicle.mileage)} km</span>
          </div>
        </div>

        <div className="spec-item">
          <Settings className="spec-icon" size={18} />
          <div className="spec-content">
            <span className="spec-label">Transmission</span>
            <span className="spec-value">{vehicle.transmission}</span>
          </div>
        </div>

        <div className="spec-item">
          <Shield className="spec-icon" size={18} />
          <div className="spec-content">
            <span className="spec-label">Body Type</span>
            <span className="spec-value">{vehicle.bodyType}</span>
          </div>
        </div>

        {vehicle.location && (
          <div className="spec-item">
            <MapPin className="spec-icon" size={18} />
            <div className="spec-content">
              <span className="spec-label">Location</span>
              <span className="spec-value">{vehicle.location}</span>
            </div>
          </div>
        )}
      </div>

      <div className="vehicle-ctas">
        <button className="cta-btn cta-primary" aria-label="Contact dealer">
          <span>Contact Dealer</span>
        </button>

        <a
          href={`https://wa.me/254700000000?text=Hi, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-btn cta-whatsapp"
          aria-label="Contact via WhatsApp"
        >
          <span>WhatsApp</span>
        </a>

        <button className="cta-btn cta-secondary" aria-label="Schedule test drive">
          <span>Schedule Test Drive</span>
        </button>

        <button className="cta-btn cta-tertiary" aria-label="Request financing">
          <span>Request Financing</span>
        </button>
      </div>
    </div>
  );
}
