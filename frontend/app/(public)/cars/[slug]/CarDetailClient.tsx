'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Vehicle } from '@/lib/types';
import { api } from '@/lib/api';
import VehicleGallery from '@/components/vehicle/VehicleGallery';
import VehicleHeader from '@/components/vehicle/VehicleHeader';
import VehicleSpecsTabs from '@/components/vehicle/VehicleSpecsTabs';
import { Phone, ArrowLeft, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { gridImage } from '@/lib/cloudinary';
import Image from 'next/image';
import ShareButton from '@/components/ShareButton';

interface CarDetailClientProps {
  slug: string;
  autoOpenReserve?: boolean;
}

export default function CarDetailClient({ slug, autoOpenReserve }: CarDetailClientProps) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [softInterestModalOpen, setSoftInterestModalOpen] = useState(false);
  const [reserveModalOpen, setReserveModalOpen] = useState(false);
  const [reservation, setReservation] = useState<any>(null);
  const [countdown, setCountdown] = useState('');
  const [currentStatus, setCurrentStatus] = useState<string>('available');

  const [notifyForm, setNotifyForm] = useState({ name: '', phone: '', maxBudget: '' });
  const [softInterestForm, setSoftInterestForm] = useState({ name: '', phone: '' });
  const [reserveForm, setReserveForm] = useState({ name: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dealerPhone, setDealerPhone] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings/public`);
      if (response.ok) {
        const data = await response.json();
        if (data.dealerPhone) {
          setDealerPhone(data.dealerPhone);
        }
      }
    } catch (err) {
      const savedPhone = localStorage.getItem('dealerPhone');
      if (savedPhone) setDealerPhone(savedPhone);
    }
  };

  const isSold = currentStatus?.toUpperCase() === 'SOLD';
  const isReserved = currentStatus?.toUpperCase() === 'RESERVED';

  const fetchVehicle = useCallback(async () => {
    try {
      const data = await api.get(`/vehicles/slug/${slug}`);
      setVehicle(data);
      setCurrentStatus(data.status);
      
      if (data.id) {
        const similar = await api.get(`/vehicles/similar/${data.id}`, { limit: 3 });
        setSimilarVehicles(Array.isArray(similar) ? similar : []);
        
        const activeRes = await api.get(`/reservations/active/${data.id}`);
        if (activeRes) {
          setReservation(activeRes);
        }
      }
    } catch (err) {
      console.error('Error fetching vehicle:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  useEffect(() => {
    if (autoOpenReserve && !isSold && !isReserved) {
      setReserveModalOpen(true);
    }
  }, [autoOpenReserve, isSold, isReserved]);

  useEffect(() => {
    if (isReserved && reservation?.expiresAt) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(reservation.expiresAt).getTime();
        const diff = expiry - now;
        
        if (diff <= 0) {
          setCountdown('00:00:00');
          clearInterval(interval);
        } else {
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isReserved, reservation]);

  const handleSoftInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      await api.post('/soft-interests', {
        name: softInterestForm.name,
        phone: softInterestForm.phone.replace(/^0/, '254'),
        vehicleId: vehicle?.id,
      });
      setSuccess('Thanks! We\'ll be in touch soon.');
      setTimeout(() => {
        setSoftInterestModalOpen(false);
        setSuccess(null);
        setSoftInterestForm({ name: '', phone: '' });
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const RESERVATION_FEE = 2000;

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const res = await api.post('/mpesa/stk-push', {
        phone: reserveForm.phone.replace(/^0/, '254'),
        amount: RESERVATION_FEE,
        vehicleId: vehicle?.id,
        buyerName: reserveForm.name,
      });
      
      if (res.success) {
        setSuccess('STK Push sent! Check your phone to complete payment.');
      } else {
        setError(res.message || 'Payment initiation failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post('/notify-subscribers', {
        name: notifyForm.name,
        phone: notifyForm.phone.replace(/^254/, ''),
        maxBudget: parseInt(notifyForm.maxBudget) || 0,
        intentMake: vehicle?.make,
        intentModel: vehicle?.model,
      });
      setSuccess('We\'ll notify you!');
      setTimeout(() => {
        setNotifyModalOpen(false);
        setSuccess(null);
        setNotifyForm({ name: '', phone: '', maxBudget: '' });
      }, 2000);
    } catch (err) {
      console.error('Notify error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const soldDays = vehicle?.soldAt && vehicle?.createdAt 
    ? Math.ceil((new Date(vehicle.soldAt).getTime() - new Date(vehicle.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const whatsAppLink = vehicle && dealerPhone
    ? `https://wa.me/254${dealerPhone.replace(/^0/, '')}?text=${encodeURIComponent(`Hi Sassy Auto Trading,\n\nI'm interested in:\n${vehicle.year} ${vehicle.make} ${vehicle.model}\nPrice: KES ${vehicle.priceKES?.toLocaleString()}\nMileage: ${vehicle.mileage?.toLocaleString()} km\n\nPlease share more details.`)}`
    : '#';

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-20 px-4">
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Vehicle Not Found</h1>
        <Link href="/inventory" className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-bold">
          <ArrowLeft size={18} /> Browse Showroom
        </Link>
      </div>
    );
  }

  const images = vehicle.images?.length ? vehicle.images : [vehicle.imageUrl];
  const primaryImage = vehicle.imageUrl?.replace('/upload/', '/upload/w_1200,h_630,c_fill/') || '';

  const shareableCar = {
    make:     vehicle.make,
    model:    vehicle.model,
    year:     vehicle.year,
    price:    vehicle.priceKES,
    imageUrl: vehicle.images?.[0] ?? vehicle.imageUrl ?? '',
    slug:     vehicle.slug,
    mileage:  vehicle.mileage,
    fuelType: vehicle.fuelType,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    description: `${vehicle.year} ${vehicle.make} ${vehicle.model} in ${vehicle.colour || 'Silver'}. KES ${vehicle.priceKES?.toLocaleString()}. Sassy Auto Trading Meru Kenya.`,
    image: primaryImage,
    offers: {
      '@type': 'Offer',
      price: vehicle.priceKES || 0,
      priceCurrency: 'KES',
      availability: isSold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      seller: { '@type': 'LocalBusiness', name: 'Sassy Auto Trading', address: 'Meru, Kenya' },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-2">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-[var(--stone)] hover:text-[var(--gold)] text-sm font-semibold mb-2">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Status Banner */}
      {isSold && (
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
            <span className="font-black text-lg uppercase">SOLD</span>
            <span className="text-sm">Sold in {soldDays} days</span>
            <span className="text-sm">{vehicle.viewCount || 0} people viewed</span>
          </div>
        </div>
      )}

      {isReserved && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
            <Clock className="w-5 h-5" />
            <span className="font-bold">Reserved</span>
            <span className="font-mono text-lg">{countdown}</span>
            <span className="text-sm">remaining</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
        <div className="grid lg:grid-cols-2 gap-4">
          <div>
            <VehicleGallery 
              images={images} 
              title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              shareButton={<ShareButton car={shareableCar} variant="overlay" />}
            />
          </div>
          
          <div className="space-y-4">
            <VehicleHeader vehicle={vehicle} status={currentStatus} />
            
            {/* CTA Buttons */}
            <div className="space-y-2 mt-2">
              <a href={dealerPhone ? `tel:${dealerPhone}` : '#'} className="flex items-center justify-center gap-2 w-full border border-[var(--gold)] text-[var(--gold)] text-sm font-medium rounded-lg py-2.5 hover:bg-[var(--gold)] hover:text-[var(--ink)] transition-colors">
                <Phone className="inline w-4 h-4" /> Call Dealer
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-sm font-semibold rounded-lg py-2.5 hover:bg-[#1ebe5d] transition-colors">
                  <svg className="inline w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.133 4.653 4.327.256.12.454.198.648.198.198 0 .495-.1.712-.3.273-.25.434-.571.591-.846.198-.297.693-1.02 1.044-1.965.345-.93.576-1.913.576-2.191 0-.298-.1-.595-.149-.92-.05-.326-.05-.652-.05-.975l-.015-.045c-.148-.596-.247-1.227-.247-1.893 0-2.532.865-4.82 2.443-5.735 1.515-.878 3.19-1.415 4.873-1.415 1.683 0 3.279.537 4.432 1.595 1.157 1.058 1.825 2.58 1.825 4.297 0 2.275-1.043 4.345-2.92 5.208l.003.001z"/></svg>
                  WhatsApp
                </a>
                <button onClick={() => setReserveModalOpen(true)} className="flex items-center justify-center bg-[var(--gold)] text-[var(--ink)] text-sm font-semibold rounded-lg py-2.5 hover:opacity-90 transition-colors">
                  Reserve · KES 2K
                </button>
              </div>
              <p className="text-xs text-[var(--stone)] text-center">Reserve with KES {RESERVATION_FEE.toLocaleString()} to hold for 48 hours</p>
            </div>
          </div>
        </div>

        {/* Vehicle Description - Below */}
        {vehicle.description && (
          <div className="bg-[var(--ink)] border border-[var(--border)] rounded-lg px-4 py-3 mt-4">
            <h3 className="font-semibold text-[var(--cream-warm)] mb-1 text-sm">Description</h3>
            <p className="text-sm text-[var(--stone)] leading-relaxed">{vehicle.description}</p>
          </div>
        )}

        <div className="mt-4"><VehicleSpecsTabs vehicle={vehicle} /></div>

        {similarVehicles.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
            <h2 className="text-lg font-semibold text-[var(--cream-warm)] mb-4">Similar Cars</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarVehicles.map((car) => (
                <Link key={car.id} href={`/cars/${car.slug}`} className="bg-[var(--ink)] border border-[var(--border)] rounded-lg overflow-hidden hover:border-[var(--gold)] transition-colors group">
                  <div className="aspect-[4/3] relative bg-[var(--ink-soft)]">
                    <Image src={gridImage(car.imageUrl || '/placeholder-car.jpg')} alt={`${car.make} ${car.model}`} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" quality={90} />
                    {car.status?.toUpperCase() === 'SOLD' && <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">SOLD</div>}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-[var(--cream-warm)] text-sm truncate">{car.make} {car.model}</h3>
                    <p className="text-[var(--gold)] font-bold text-sm mt-0.5">{car.priceKES ? `KES ${car.priceKES.toLocaleString()}` : 'Contact for price'}</p>
                    <p className="text-xs text-[var(--stone)] mt-1">{car.year} · {car.mileage?.toLocaleString()} km</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Soft Interest Modal */}
      {softInterestModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-xl font-black mb-2">I'm Interested (Free)</h3>
            <p className="text-slate-500 text-sm mb-4">Leave your details and we'll call you about this car.</p>
            {success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center">
                <CheckCircle className="inline w-5 h-5 mr-1" /> {success}
              </div>
            ) : (
              <form onSubmit={handleSoftInterestSubmit} className="space-y-4">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{error}</div>}
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  This triggers an M-Pesa STK Push. We do not store your PIN.
                </div>
                <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-semibold" value={softInterestForm.name} onChange={(e) => setSoftInterestForm({...softInterestForm, name: e.target.value})} />
                <input type="tel" placeholder="Phone (e.g. 722000000)" required className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-semibold" value={softInterestForm.phone} onChange={(e) => setSoftInterestForm({...softInterestForm, phone: e.target.value})} />
                <button type="submit" disabled={submitting} className="w-full bg-accent text-white py-4 rounded-xl font-bold">
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
                <button type="button" onClick={() => setSoftInterestModalOpen(false)} className="w-full text-slate-500 py-2 text-sm">Cancel</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reserve Modal */}
      {reserveModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-xl font-black mb-2">Reserve Your Car</h3>
            <p className="text-slate-500 text-sm mb-4">Pay a refundable KES {RESERVATION_FEE.toLocaleString()} deposit to hold this car for 48 hours. We'll send you an M-Pesa request.</p>
            {success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center">
                <CheckCircle className="inline w-5 h-5 mr-1" /> {success}
              </div>
            ) : (
              <form onSubmit={handleReserveSubmit} className="space-y-4">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">{error}</div>}
                <div className="bg-accent border border-accent p-3 rounded-xl text-xs text-accent">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  This is a refundable deposit. Pay via M-Pesa STK Push.
                </div>
                <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-semibold" value={reserveForm.name} onChange={(e) => setReserveForm({...reserveForm, name: e.target.value})} />
                <input type="tel" placeholder="Phone (e.g. 722000000)" required className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-semibold" value={reserveForm.phone} onChange={(e) => setReserveForm({...reserveForm, phone: e.target.value})} />
                <button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold">
                  {submitting ? 'Sending Request...' : `Pay KES ${RESERVATION_FEE.toLocaleString()} via M-Pesa`}
                </button>
                <button type="button" onClick={() => setReserveModalOpen(false)} className="w-full text-slate-500 py-2 text-sm">Cancel</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Notify Modal */}
      {notifyModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-xl font-black mb-2">Notify Me</h3>
            <p className="text-slate-500 text-sm mb-4">We'll let you know if this car becomes available.</p>
            {success ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center">
                <CheckCircle className="inline w-5 h-5 mr-1" /> {success}
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <input type="text" placeholder="Your Name" required className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-semibold" value={notifyForm.name} onChange={(e) => setNotifyForm({...notifyForm, name: e.target.value})} />
                <input type="tel" placeholder="Phone" required className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-semibold" value={notifyForm.phone} onChange={(e) => setNotifyForm({...notifyForm, phone: e.target.value})} />
                <input type="number" placeholder="Max Budget (KES)" className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl font-semibold" value={notifyForm.maxBudget} onChange={(e) => setNotifyForm({...notifyForm, maxBudget: e.target.value})} />
                <button type="submit" disabled={submitting} className="w-full bg-accent text-white py-4 rounded-xl font-bold">
                  {submitting ? 'Sending...' : 'Notify Me'}
                </button>
                <button type="button" onClick={() => setNotifyModalOpen(false)} className="w-full text-slate-500 py-2 text-sm">Cancel</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
