'use client';

import { Vehicle } from '@/lib/types';
import { formatPrice, formatStatus, getSeatsCount, getStatusClass } from '@/lib/utils';
import { MapPin, ArrowRight } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const statusClass = getStatusClass(vehicle.status);
  const seats = getSeatsCount(vehicle.bodyType, vehicle.model);

  const getVehicleImage = (vehicle: Vehicle): string => {
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }
    return vehicle.imageUrl;
  };

  return (
    <div className="car-card transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <div className="car-image-wrapper">
        <img
          src={getVehicleImage(vehicle)}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="car-image"
        />
        {vehicle.featured && (
          <span className="badge-overlay badge bg-danger">Featured</span>
        )}
        <span className={`badge-bottom badge ${statusClass}`}>
          {formatStatus(vehicle.status)}
        </span>
      </div>

      <div className="car-body">
        <div className="car-year-badge">
          {vehicle.year} {formatStatus(vehicle.bodyType)}
        </div>
        <h5 className="car-title">
          {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
        </h5>

        <div className="car-meta">
          <div className="meta-grid">
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-wrench"></i>
              </div>
              <div>
                <span className="meta-value">{vehicle.make}</span>
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-palette"></i>
              </div>
              <div>
                <span className="meta-value">{vehicle.exteriorColor}</span>
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <div>
                <span className="meta-value">{vehicle.engine}</span>
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-calendar"></i>
              </div>
              <div>
                <span className="meta-value">{vehicle.year}</span>
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-gas-pump"></i>
              </div>
              <div>
                <span className="meta-value">{formatStatus(vehicle.fuelType)}</span>
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <div>
                <span className="meta-value">{vehicle.transmission}</span>
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-chair"></i>
              </div>
              <div>
                <span className="meta-value">{vehicle.interiorColor}</span>
              </div>
            </div>
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-users"></i>
              </div>
              <div>
                <span className="meta-value">{seats} Seats</span>
              </div>
            </div>
            {vehicle.location && (
              <div className="meta-item">
                <div className="meta-icon">
                  <MapPin size={18} className="text-gray-600" />
                </div>
                <div>
                  <span className="meta-value">{vehicle.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="car-price-section">
        <div className="car-price">{formatPrice(vehicle.priceKES)}</div>
      </div>

      <div className="mt-3">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:text-white hover:shadow-md group">
          <span>View Details</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
}
