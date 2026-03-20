'use client';

import { Vehicle } from '@/lib/types';
import { formatPrice, formatStatus } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { gridImage } from '@/lib/cloudinary';
import ShareButton from '@/components/ShareButton';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const router = useRouter();
  const [dealerPhone, setDealerPhone] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings/public`)
      .then(res => res.json())
      .then(data => {
        if (data.dealerPhone) {
          setDealerPhone(data.dealerPhone.replace(/^0/, ''));
          localStorage.setItem('dealerPhone', data.dealerPhone);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('dealerPhone');
        if (saved) setDealerPhone(saved.replace(/^0/, ''));
      });
  }, []);

  const getVehicleImage = (vehicle: Vehicle): string => {
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }
    return vehicle.imageUrl;
  };

  const isSold = vehicle.status?.toUpperCase() === 'SOLD';
  const isReserved = vehicle.status?.toUpperCase() === 'RESERVED';
  const isAvailable = vehicle.status === 'Available';

  const handleCardClick = () => {
    if (vehicle.slug) {
      router.push(`/cars/${vehicle.slug}`);
    }
  };

  const whatsAppMessage = `Hi Sassy Auto Trading,\n\nI'm interested in:\n${vehicle.year} ${vehicle.make} ${vehicle.model}\nPrice: KES ${vehicle.priceKES?.toLocaleString()}\nMileage: ${vehicle.mileage?.toLocaleString()} km`;
  const whatsAppLink = `https://wa.me/254${dealerPhone}?text=${encodeURIComponent(whatsAppMessage)}`;

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

  return (
    <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden group hover:border-accent transition-all duration-200">
      <div className="relative aspect-[4/3] overflow-hidden bg-bg-elevated cursor-pointer" onClick={handleCardClick}>
        <Image
          src={gridImage(getVehicleImage(vehicle))}
          alt={`${vehicle.make} ${vehicle.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          quality={90}
        />
        <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full ${
          isAvailable 
            ? 'bg-accent text-text-primary' 
            : isReserved
            ? 'bg-warning text-ink'
            : 'bg-text-secondary text-text-primary'
        }`}>
          {isAvailable ? 'NEW' : formatStatus(vehicle.status)}
        </span>
        <div className="absolute top-2 right-2">
          <ShareButton car={shareableCar} variant="overlay" />
        </div>
        <span className="absolute bottom-3 right-3 bg-black/60 text-cream text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
          {vehicle.year}
        </span>
      </div>

      <div className="p-4">
        <div className="cursor-pointer" onClick={handleCardClick}>
          <h3 className="font-heading text-xl font-semibold text-text-primary leading-tight truncate">
            {vehicle.make} {vehicle.model}
          </h3>
          <div className="flex items-center gap-3 mt-1 mb-3">
            <span className="text-text-secondary text-base font-normal">
              {vehicle.year}
            </span>
            <span className="text-border-subtle">·</span>
            <span className="text-text-secondary text-base font-normal">
              {vehicle.mileage?.toLocaleString()} km
            </span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading text-2xl font-bold text-accent">
              KES {formatPrice(vehicle.priceKES)}
            </span>
            <span className="text-text-secondary text-sm font-medium border border-border-subtle rounded px-2.5 py-1">
              {vehicle.fuelType}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <a 
            href={`tel:${dealerPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-accent text-text-primary px-5 py-2 rounded-lg text-sm font-semibold text-center no-underline hover:bg-accent-hover transition-colors"
          >
            Call
          </a>
          <a 
            href={whatsAppLink}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-whatsapp text-white px-5 py-2 rounded-lg text-sm font-semibold text-center no-underline hover:bg-whatsapp/90 transition-colors"
          >
            WhatsApp
          </a>
        </div>

        <div 
          className="flex items-center justify-center gap-1.5 w-full mt-2 px-5 py-2 border border-border-subtle rounded-lg text-sm font-semibold text-text-primary no-underline cursor-pointer hover:border-accent hover:text-accent transition-colors"
          onClick={handleCardClick}
        >
          View Full Details →
        </div>

        {isReserved && (
          <div className="flex items-center justify-center gap-2 px-2 py-2 mt-2 bg-accent/15 text-accent-light rounded-lg text-xs font-semibold">
            Reserved
          </div>
        )}
        {isSold && (
          <div className="flex items-center justify-center px-2 py-2 mt-2 bg-red-900/15 text-red-700 rounded-lg text-xs font-semibold">
            Sold
          </div>
        )}
      </div>
    </div>
  );
}
