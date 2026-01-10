'use client';

import { Vehicle } from '@/lib/types';
import { formatPrice, formatStatus, getSeatsCount, getStatusClass } from '@/lib/utils';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface VehicleCardProps {
  vehicle: Vehicle;
  onDetailsClick?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onDetailsClick }: VehicleCardProps) {
  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in the ${vehicle.make} ${vehicle.model} ${vehicle.year} listed for ${formatPrice(vehicle.priceKES)}. Is it still available?`
  );

  const emailSubject = encodeURIComponent(
    `Inquiry: ${vehicle.make} ${vehicle.model} ${vehicle.year}`
  );
  const emailBody = encodeURIComponent(
    `Hello,\n\nI'm interested in the following vehicle:\n\n${vehicle.make} ${vehicle.model} ${vehicle.year}\nPrice: ${formatPrice(vehicle.priceKES)}\n\nPlease provide more details.\n\nThank you.`
  );

  const statusClass = getStatusClass(vehicle.status);

  const seats = getSeatsCount(vehicle.bodyType, vehicle.model);

  return (
    <div className="col-lg-4 col-md-6">
      <div className="car-card">
        <div className="car-image-wrapper">
          <img
            src={vehicle.imageUrl}
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
                  <i className="fas fa-calendar-day"></i>
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
                  <i className="fas fa-tachometer-alt"></i>
                </div>
                <div>
                  <span className="meta-value">{vehicle.engine}</span>
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
            </div>
          </div>

          <div className="car-price-section">
            <div className="car-price">{formatPrice(vehicle.priceKES)}</div>
          </div>

          <div className="contact-methods">
            <div className="contact-buttons">
              <a
                href={`https://wa.me/254722000000?text=${whatsappMsg}`}
                className="contact-btn btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </a>
              <a href="tel:+254722000000" className="contact-btn btn-phone">
                <i className="fas fa-phone"></i>
                <span>Call</span>
              </a>
              <a
                href={`mailto:info@trustauto.co.ke?subject=${emailSubject}&body=${emailBody}`}
                className="contact-btn btn-email"
              >
                <i className="fas fa-envelope"></i>
                <span>Email</span>
              </a>
              <button
                className="contact-btn btn-details"
                onClick={() => onDetailsClick?.(vehicle)}
              >
                <i className="fas fa-info-circle"></i>
                <span>View Details</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
