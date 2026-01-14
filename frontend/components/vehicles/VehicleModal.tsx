'use client';

import { Vehicle } from '@/lib/types';
import { formatPrice, formatStatus, getSeatsCount } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Phone, X, MessageCircle } from 'lucide-react';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export default function VehicleModal({
  isOpen,
  onClose,
  vehicle,
}: VehicleModalProps) {
  if (!vehicle) return null;

  const seats = getSeatsCount(vehicle.bodyType, vehicle.model);

  const specifications = [
    { label: 'Year', value: vehicle.year.toString() },
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Body Type', value: formatStatus(vehicle.bodyType) },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Drivetrain', value: vehicle.drivetrain },
    { label: 'Fuel Type', value: formatStatus(vehicle.fuelType) },
    { label: 'Exterior Color', value: vehicle.exteriorColor },
    { label: 'Interior Color', value: vehicle.interiorColor },
    { label: 'Seats', value: seats.toString() },
    { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} km` },
    { label: 'VIN', value: vehicle.vin },
    { label: 'Status', value: formatStatus(vehicle.status) },
    ...(vehicle.location ? [{ label: 'Location', value: vehicle.location }] : []),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${vehicle.make} ${vehicle.model} ${vehicle.year}`} size="xl">
      <div className="row">
        {/* Left Column - Vehicle Image */}
        <div className="col-md-5">
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="img-fluid rounded-lg"
            style={{ borderRadius: '16px', width: '100%', objectFit: 'cover' }}
          />
          
          {/* Price Display */}
          <div className="text-center mt-4 p-4 bg-light rounded-lg">
            <small className="text-muted">Price</small>
            <h3 className="h2 mb-0 fw-bold" style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {formatPrice(vehicle.priceKES)}
            </h3>
          </div>

          {/* Quick Contact Buttons */}
          <div className="d-grid gap-2 mt-3">
            <a
              href="tel:+254722000000"
              className="d-flex align-items-center justify-content-center gap-2 btn btn-outline-primary py-3"
            >
              <Phone size={20} />
              <span>Call Now</span>
            </a>
            <a
              href="https://wa.me/254722000000?text=${encodeURIComponent(
                `Hi, I'm interested in ${vehicle.make} ${vehicle.model} ${vehicle.year}`
              )}"
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center justify-content-center gap-2 py-3"
              style={{ backgroundColor: '#25D366', color: 'white', border: 'none' }}
            >
              <MessageCircle size={20} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Column - Specifications */}
        <div className="col-md-7 ps-md-4">
          {vehicle.description && (
            <p className="mb-4 text-gray-700">{vehicle.description}</p>
          )}

          {/* Specifications Grid */}
          <div className="row g-2">
            {specifications.map((spec, index) => (
              <div key={index} className="col-6 col-md-4">
                <div className="p-3 bg-light rounded-lg">
                  <small className="text-muted d-block mb-1">{spec.label}</small>
                  <span className="fw-bold" style={{ fontSize: '0.95rem' }}>{spec.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 d-flex justify-content-end gap-3 pt-3 border-top">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          <X size={18} className="me-2" />
          Close
        </button>
      </div>
    </Modal>
  );
}
