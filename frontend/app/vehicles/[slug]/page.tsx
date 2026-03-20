'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Vehicle } from '@/lib/types';
import { VehicleDetailsSkeleton } from '@/components/vehicles/VehicleSkeleton';
import ReservationModal from '@/components/vehicles/ReservationModal';
import { api } from '@/lib/api';
import { Menu, X, Home, Car, Phone, Mail, ArrowLeft, Fuel, Gauge, Settings, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReservationModal, setShowReservationModal] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await api.get(`/vehicles/slug/${params.slug}`);
        setVehicle(data);
        setLoading(false);

        if (data.id) {
          const similar = await api.get(`/vehicles/similar/${data.id}`, { limit: 6 });
          setSimilarVehicles(similar);
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        setLoading(false);
        setVehicle(null);
      }
    };

    fetchVehicle();
  }, [params.slug]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-green-500';
      case 'CERTIFIED_PRE_OWNED': return 'bg-violet-500';
      case 'ON_SALE': return 'bg-amber-500';
      case 'SOLD': return 'bg-red-500';
      case 'RESERVED': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW': return 'NEW';
      case 'CERTIFIED_PRE_OWNED': return 'CERTIFIED';
      case 'ON_SALE': return 'ON SALE';
      case 'SOLD': return 'SOLD';
      case 'RESERVED': return 'RESERVED';
      default: return 'USED';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <VehicleDetailsSkeleton />;
  }

  if (!vehicle) {
    return (
      <main className="bg-brand-ink h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-brand-cream-warm mb-3">Vehicle Not Found</h1>
          <Link href="/inventory" className="text-brand-gold underline">Browse Showroom</Link>
        </div>
      </main>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [vehicle.imageUrl];

  return (
    <main className="bg-brand-ink min-h-screen flex flex-col">
      {/* Minimal Nav */}
      <nav className="sticky top-0 z-50 h-13 flex items-center justify-between px-6 bg-brand-ink-mid/95 border-b border-brand-gold/20 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-base font-medium text-brand-cream-warm">Sassy Auto Trading</span>
        </Link>
        <div className="hidden md:flex gap-5">
          <Link href="/" className="text-[11px] uppercase tracking-widest text-text-secondary hover:text-brand-gold transition-colors">Home</Link>
          <Link href="/inventory" className="text-[11px] uppercase tracking-widest text-brand-gold">Showroom</Link>
          <Link href="/contact" className="text-[11px] uppercase tracking-widest text-text-secondary hover:text-brand-gold transition-colors">Contact</Link>
        </div>
      </nav>

      {/* TWO-PANEL LAYOUT - Desktop */}
      <div className="hidden md:grid flex-1" style={{ gridTemplateColumns: '55% 45%', overflow: 'hidden' }}>
        
        {/* LEFT PANEL - Image Carousel + Similar */}
        <div className="flex flex-col border-r border-brand-gold/15 overflow-hidden">
          {/* Main Image Carousel */}
          <div className="flex-[0_0_65%] relative bg-brand-ink-soft">
            <Image
              src={images[currentImageIndex]?.replace('/upload/', '/upload/w_1200,q_90,f_auto/') || ''}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-contain"
            />
            {/* Carousel Controls */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border-none rounded-full flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border-none rounded-full flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight size={20} className="text-white" />
                </button>
                <div className="absolute bottom-3 right-3 bg-black/70 px-2.5 py-1 rounded-full text-[11px] text-white">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
            {/* Status Badge */}
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wide ${getStatusColor(vehicle.status)}`}>
              {getStatusLabel(vehicle.status)}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex-[0_0_48px] flex gap-1.5 p-2 bg-neutral-900 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`flex-[0_0_56px] h-10 rounded overflow-hidden border-2 cursor-pointer p-0 bg-transparent ${idx === currentImageIndex ? 'border-brand-gold' : 'border-transparent'}`}
                style={{ opacity: idx === currentImageIndex ? 1 : 0.6 }}
              >
                <Image src={img?.replace('/upload/', '/upload/w_100,h_60,c_fill,q_70,f_auto/') || ''} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>

          {/* Similar Cars Strip */}
          <div className="flex-1 overflow-hidden bg-brand-ink p-3">
            <div className="text-[10px] uppercase tracking-widest text-brand-gold mb-2">Similar Vehicles</div>
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {similarVehicles.map((v) => (
                <Link
                  key={v.id}
                  href={`/cars/${v.slug}`}
                  className="flex-[0_0_140px] flex flex-col bg-brand-ink-soft rounded-md overflow-hidden no-underline"
                >
                  <div className="h-[70px] overflow-hidden relative">
                    <Image src={v.imageUrl?.replace('/upload/', '/upload/w_200,h_120,c_fill,q_70,f_auto/') || ''} alt={v.model} fill className="object-cover" />
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] font-semibold text-brand-cream-warm truncate">{v.make} {v.model}</div>
                    <div className="text-[10px] text-brand-gold font-bold">{formatPrice(v.priceKES)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Details */}
        <div className="flex flex-col bg-brand-ink overflow-hidden">
          <div className="flex-1 overflow-auto p-5">
            {/* Title & Price */}
            <div className="mb-4">
              <h1 className="font-serif text-[28px] font-semibold text-white leading-tight mb-1">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <div className="text-[26px] font-bold text-brand-gold">
                {formatPrice(vehicle.priceKES)}
              </div>
            </div>

            {/* Specs Grid - 2x3 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-brand-ink-soft rounded-md p-2.5">
                <div className="text-[9px] uppercase text-gray-400 mb-0.5 flex items-center gap-1"><Fuel size={10} /> Fuel</div>
                <div className="text-[13px] font-semibold text-white">{vehicle.fuelType}</div>
              </div>
              <div className="bg-brand-ink-soft rounded-md p-2.5">
                <div className="text-[9px] uppercase text-gray-400 mb-0.5 flex items-center gap-1"><Gauge size={10} /> Mileage</div>
                <div className="text-[13px] font-semibold text-white">{vehicle.mileage?.toLocaleString()} km</div>
              </div>
              <div className="bg-brand-ink-soft rounded-md p-2.5">
                <div className="text-[9px] uppercase text-gray-400 mb-0.5 flex items-center gap-1"><Settings size={10} /> Trans</div>
                <div className="text-[13px] font-semibold text-white">{vehicle.transmission}</div>
              </div>
              <div className="bg-brand-ink-soft rounded-md p-2.5">
                <div className="text-[9px] uppercase text-gray-400 mb-0.5">Body</div>
                <div className="text-[13px] font-semibold text-white">{vehicle.bodyType}</div>
              </div>
              <div className="bg-brand-ink-soft rounded-md p-2.5">
                <div className="text-[9px] uppercase text-gray-400 mb-0.5">Engine</div>
                <div className="text-[13px] font-semibold text-white truncate">{vehicle.engine}</div>
              </div>
              <div className="bg-brand-ink-soft rounded-md p-2.5">
                <div className="text-[9px] uppercase text-gray-400 mb-0.5">Drive</div>
                <div className="text-[13px] font-semibold text-white">{vehicle.drivetrain}</div>
              </div>
            </div>

            {/* Location Pill */}
            <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 bg-brand-ink-soft rounded-full w-fit">
              <MapPin size={12} className="text-brand-gold" />
              <span className="text-xs text-white">{vehicle.location || 'Nairobi, Kenya'}</span>
            </div>

            {/* Description - max 2 lines */}
            <p className="text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">
              {vehicle.description}
            </p>

            {/* Tabs */}
            <div className="flex gap-1 mb-3 flex-wrap">
              {['Overview', 'Features', 'Condition', 'Seller'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-3.5 py-1.5 text-[11px] font-semibold rounded-full border-none cursor-pointer uppercase tracking-wide ${activeTab === tab.toLowerCase() ? 'bg-brand-gold text-brand-ink' : 'bg-brand-ink-soft text-gray-400'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-brand-ink-soft rounded-lg p-3 mb-4 h-[140px] overflow-auto">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-400">Ext Color:</span> <span className="text-white">{vehicle.exteriorColor}</span></div>
                  <div><span className="text-gray-400">Int Color:</span> <span className="text-white">{vehicle.interiorColor}</span></div>
                  <div><span className="text-gray-400">VIN:</span> <span className="text-white">{vehicle.vin || 'N/A'}</span></div>
                  <div><span className="text-gray-400">Fuel:</span> <span className="text-white">{vehicle.fuelType}</span></div>
                </div>
              )}
              {activeTab === 'features' && (
                <div className="grid grid-cols-2 gap-1.5 text-xs text-white">
                  <div>✓ Power Windows</div><div>✓ Power Mirrors</div>
                  <div>✓ LED Headlights</div><div>✓ Alloy Wheels</div>
                  <div>✓ Air Conditioning</div><div>✓ Bluetooth</div>
                  <div>✓ USB Ports</div><div>✓ ABS Brakes</div>
                </div>
              )}
              {activeTab === 'condition' && (
                <div className="text-xs">
                  <div className="text-green-500 mb-2">✓ Excellent Condition</div>
                  <div className="grid grid-cols-2 gap-1.5 text-gray-400">
                    <span>Owners: 1</span><span>Title: Clean</span>
                    <span>Accidents: None</span><span>Service: Complete</span>
                  </div>
                </div>
              )}
              {activeTab === 'seller' && (
                <div className="text-xs">
                  <div className="text-brand-gold font-semibold mb-1">Sassy Auto Trading</div>
                  <div className="text-gray-400">Nairobi, Kenya</div>
                  <div className="text-gray-400 mt-1">Mon-Fri: 8AM-6PM | Sat: 9AM-4PM</div>
                </div>
              )}
            </div>
          </div>

          {/* CTA Row */}
          <div className="flex-[0_0_auto] p-4 bg-neutral-900 border-t border-white/10">
            <div className="flex gap-2.5 mb-2">
              <a href="tel:+254722100200" className="flex-1 flex items-center justify-center gap-2 p-3 bg-transparent border border-gray-600 rounded-lg text-white text-xs font-semibold no-underline uppercase">
                <Phone size={16} /> Call Dealer
              </a>
              <a href="https://wa.me/254722100200" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-500 border-none rounded-lg text-white text-xs font-semibold no-underline uppercase">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              <button 
                onClick={() => setShowReservationModal(true)}
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-500 border-none rounded-lg text-white text-xs font-semibold cursor-pointer uppercase hover:bg-blue-600 transition-colors"
              >
                Reserve KES 2,000
              </button>
            </div>
            <p className="text-[11px] text-gray-500 text-center m-0">Reserve with KES 2,000 to hold for 48 hours</p>
          </div>
        </div>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden flex flex-col px-4 pb-6">
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] bg-brand-ink-soft rounded-xl overflow-hidden mb-4">
          <Image src={images[currentImageIndex]?.replace('/upload/', '/upload/w_800,q_90,f_auto/') || ''} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} fill className="object-contain" />
          {images.length > 1 && (
            <>
              <button onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border-none rounded-full flex items-center justify-center cursor-pointer">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/60 border-none rounded-full flex items-center justify-center cursor-pointer">
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded text-[10px] font-bold text-white uppercase ${getStatusColor(vehicle.status)}`}>
            {getStatusLabel(vehicle.status)}
          </div>
        </div>

        {/* Title & Price */}
        <div className="mb-4">
          <h1 className="font-serif text-2xl font-semibold text-white mb-1">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
          <div className="text-[22px] font-bold text-brand-gold">{formatPrice(vehicle.priceKES)}</div>
        </div>

        {/* Specs Grid - 2 columns */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-brand-ink-soft rounded-lg p-3">
            <div className="text-[10px] uppercase text-gray-400 mb-0.5">Fuel</div>
            <div className="text-sm font-semibold text-white">{vehicle.fuelType}</div>
          </div>
          <div className="bg-brand-ink-soft rounded-lg p-3">
            <div className="text-[10px] uppercase text-gray-400 mb-0.5">Mileage</div>
            <div className="text-sm font-semibold text-white">{vehicle.mileage?.toLocaleString()} km</div>
          </div>
          <div className="bg-brand-ink-soft rounded-lg p-3">
            <div className="text-[10px] uppercase text-gray-400 mb-0.5">Transmission</div>
            <div className="text-sm font-semibold text-white">{vehicle.transmission}</div>
          </div>
          <div className="bg-brand-ink-soft rounded-lg p-3">
            <div className="text-[10px] uppercase text-gray-400 mb-0.5">Body</div>
            <div className="text-sm font-semibold text-white">{vehicle.bodyType}</div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-brand-ink-soft rounded-full w-fit">
          <MapPin size={14} className="text-brand-gold" />
          <span className="text-xs text-white">{vehicle.location || 'Nairobi, Kenya'}</span>
        </div>

        {/* Tabs - Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto mb-3 pb-1">
          {['Overview', 'Features', 'Condition', 'Seller'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} className={`px-4 py-2 text-xs font-semibold rounded-full border-none cursor-pointer whitespace-nowrap uppercase ${activeTab === tab.toLowerCase() ? 'bg-brand-gold text-brand-ink' : 'bg-brand-ink-soft text-gray-400'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-brand-ink-soft rounded-lg p-3 mb-4 min-h-[100px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-400">Ext Color:</span> <span className="text-white">{vehicle.exteriorColor}</span></div>
              <div><span className="text-gray-400">Int Color:</span> <span className="text-white">{vehicle.interiorColor}</span></div>
              <div><span className="text-gray-400">Engine:</span> <span className="text-white">{vehicle.engine}</span></div>
              <div><span className="text-gray-400">VIN:</span> <span className="text-white">{vehicle.vin || 'N/A'}</span></div>
            </div>
          )}
          {activeTab === 'features' && (
            <div className="grid grid-cols-2 gap-1.5 text-xs text-white">
              <div>✓ Power Windows</div><div>✓ Power Mirrors</div>
              <div>✓ LED Headlights</div><div>✓ Alloy Wheels</div>
              <div>✓ Air Conditioning</div><div>✓ Bluetooth</div>
            </div>
          )}
          {activeTab === 'condition' && (
            <div className="text-xs">
              <div className="text-green-500 mb-2">✓ Excellent Condition</div>
              <div className="grid grid-cols-2 gap-1.5 text-gray-400">
                <span>Owners: 1</span><span>Title: Clean</span>
                <span>Accidents: None</span><span>Service: Complete</span>
              </div>
            </div>
          )}
          {activeTab === 'seller' && (
            <div className="text-xs">
              <div className="text-brand-gold font-semibold mb-1">Sassy Auto Trading</div>
              <div className="text-gray-400">Nairobi, Kenya</div>
              <div className="text-gray-400 mt-1">Mon-Fri: 8AM-6PM | Sat: 9AM-4PM</div>
            </div>
          )}
        </div>

        {/* CTA Buttons - Stacked */}
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <a href="tel:+254722100200" className="flex-1 flex items-center justify-center gap-2 p-3.5 bg-transparent border border-gray-600 rounded-lg text-white text-xs font-semibold no-underline uppercase">
              <Phone size={18} /> Call
            </a>
            <a href="https://wa.me/254722100200" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-3.5 bg-green-500 border-none rounded-lg text-white text-xs font-semibold no-underline uppercase">
              WhatsApp
            </a>
          </div>
          <button 
            onClick={() => setShowReservationModal(true)}
            className="w-full flex items-center justify-center gap-2 p-3.5 bg-blue-500 border-none rounded-lg text-white text-xs font-semibold cursor-pointer uppercase hover:bg-blue-600 transition-colors"
          >
            Reserve KES 2,000
          </button>
          <p className="text-[11px] text-gray-500 text-center m-0">Reserve with KES 2,000 to hold for 48 hours</p>
        </div>

        {/* Similar Cars */}
        {similarVehicles.length > 0 && (
          <div className="mt-6">
            <div className="text-[11px] uppercase tracking-widest text-brand-gold mb-3">Similar Vehicles</div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {similarVehicles.map((v) => (
                <Link key={v.id} href={`/cars/${v.slug}`} className="flex-[0_0_160px] flex flex-col bg-brand-ink-soft rounded-lg overflow-hidden no-underline">
                  <div className="h-[90px] overflow-hidden relative">
                    <Image src={v.imageUrl?.replace('/upload/', '/upload/w_200,h_120,c_fill,q_70,f_auto/') || ''} alt={v.model} fill className="object-cover" />
                  </div>
                  <div className="p-2.5">
                    <div className="text-xs font-semibold text-white truncate">{v.make} {v.model}</div>
                    <div className="text-xs text-brand-gold font-bold">{formatPrice(v.priceKES)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ReservationModal 
        isOpen={showReservationModal} 
        onClose={() => setShowReservationModal(false)} 
        vehicle={vehicle} 
      />

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
