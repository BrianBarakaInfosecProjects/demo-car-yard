'use client';

import { useState } from 'react';
import { Vehicle } from '@/lib/types';
import { formatPrice, formatStatus, getSeatsCount } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Car, Mail, Phone, Send, X, DollarSign } from 'lucide-react';

interface NegotiateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export default function NegotiateModal({
  isOpen,
  onClose,
  vehicle,
}: NegotiateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    offeredPrice: '',
    currency: 'KES',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!vehicle) return null;

  const seats = getSeatsCount(vehicle.bodyType, vehicle.model);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send negotiation inquiry to backend
    const whatsappMsg = encodeURIComponent(
      `Hi, I'm interested in negotiating the price for ${vehicle.make} ${vehicle.model} ${vehicle.year}.\n\nCurrent Price: ${formatPrice(vehicle.priceKES)}\nMy Offer: ${formData.currency === 'KES' ? 'KSh ' + formData.offeredPrice : '$' + formData.offeredPrice}\n\nMy Details:\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}`
    );
    
    window.open(`https://wa.me/254722000000?text=${whatsappMsg}`, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  const specifications = [
    { label: 'Make', value: vehicle.make },
    { label: 'Model', value: vehicle.model },
    { label: 'Year', value: vehicle.year.toString() },
    { label: 'Body Type', value: formatStatus(vehicle.bodyType) },
    { label: 'Fuel Type', value: formatStatus(vehicle.fuelType) },
    { label: 'Engine', value: vehicle.engine },
    { label: 'Transmission', value: vehicle.transmission },
    { label: 'Drivetrain', value: vehicle.drivetrain },
    { label: 'Exterior Color', value: vehicle.exteriorColor },
    { label: 'Interior Color', value: vehicle.interiorColor },
    { label: 'Seats', value: seats.toString() },
    { label: 'Mileage', value: `${vehicle.mileage.toLocaleString()} km` },
    { label: 'VIN', value: vehicle.vin },
    ...(vehicle.location ? [{ label: 'Location', value: vehicle.location }] : []),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Negotiate" size="xl">
      <div className="row">
        {/* Left Column - Vehicle Image and Quick Info */}
        <div className="col-md-5">
          <div className="position-relative">
            <img
              src={vehicle.imageUrl}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="img-fluid rounded-lg"
              style={{ borderRadius: '16px', width: '100%', objectFit: 'cover' }}
            />
            {vehicle.featured && (
              <span className="position-absolute top-3 left-3 badge bg-danger px-3 py-2 rounded-pill">
                Featured
              </span>
            )}
          </div>
          
          {/* Quick Contact Buttons */}
          <div className="d-grid gap-2 mt-4">
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
              <Car size={20} />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Current Price Display */}
          <div className="text-center mt-4 p-4 bg-light rounded-lg">
            <small className="text-muted">Current Price</small>
            <h3 className="h2 mb-0 fw-bold" style={{ 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {formatPrice(vehicle.priceKES)}
            </h3>
          </div>
        </div>

        {/* Right Column - Specifications and Negotiation Form */}
        <div className="col-md-7 ps-md-4">
          {/* Vehicle Specifications */}
          <div className="mb-4">
            <h5 className="fw-bold mb-3 pb-2 border-bottom">
              <Car size={18} className="me-2" style={{ color: 'var(--primary)' }} />
              Vehicle Specifications
            </h5>
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

          {/* Negotiation Form */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h5 className="fw-bold mb-3">
              <DollarSign size={18} className="me-2" style={{ color: 'var(--primary)' }} />
              Make an Offer
            </h5>
            
            {submitted ? (
              <div className="text-center py-4">
                <div className="mb-3 text-success">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <h6 className="fw-bold mb-2">Offer Sent!</h6>
                <p className="text-muted mb-0">Opening WhatsApp to complete your negotiation...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="07XX XXX XXX"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Currency</label>
                    <select
                      className="form-select"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    >
                      <option value="KES">KES (Kenyan Shilling)</option>
                      <option value="USD">USD (US Dollar)</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Your Offered Price *</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        {formData.currency === 'KES' ? 'KSh' : '$'}
                      </span>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.offeredPrice}
                        onChange={(e) => setFormData({ ...formData, offeredPrice: e.target.value })}
                        required
                        placeholder={`Enter your offer (current: ${formatPrice(vehicle.priceKES)})`}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-3 py-3 fw-bold">
                  <Send size={18} className="me-2" />
                  Submit Offer
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
