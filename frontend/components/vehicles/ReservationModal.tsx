'use client';

import { useState } from 'react';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

export default function ReservationModal({ isOpen, onClose, vehicle }: ReservationModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !buyerName || !buyerPhone) return;

    setLoading(true);
    setError('');

    try {
      await api.post('/reservations', {
        vehicleId: vehicle.id,
        buyerName,
        buyerPhone,
        amount: 2000,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-brand-ink border border-border rounded-2xl w-full max-w-md overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-text-secondary hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-brand-cream-warm mb-2">Reservation Confirmed!</h3>
            <p className="text-text-secondary mb-6">
              Your vehicle has been reserved for 48 hours. We&apos;ll contact you shortly.
            </p>
            <a
              href={`https://wa.me/254722100200?text=My%20reservation%20for%20${vehicle.make}%20${vehicle.model}%20is%20confirmed`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
            >
              Contact via WhatsApp
            </a>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-brand-cream-warm">Reserve Vehicle</h3>
              <p className="text-sm text-text-secondary mt-1">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-brand-gold">
                  <strong>KES 2,000</strong> reservation fee (refundable)
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Holds vehicle for 48 hours
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-cream-warm mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-brand-ink-soft border border-border rounded-lg text-brand-cream-warm placeholder:text-text-muted focus:outline-none focus:border-brand-gold"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-cream-warm mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-brand-ink-soft border border-border rounded-lg text-brand-cream-warm placeholder:text-text-muted focus:outline-none focus:border-brand-gold"
                  placeholder="07XX XXX XXX"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-gold text-brand-ink rounded-lg font-bold hover:bg-brand-gold-lt transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Reserve for KES 2,000'
                )}
              </button>

              <p className="text-xs text-text-muted text-center">
                By reserving, you agree to our terms. Payment via M-Pesa.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
