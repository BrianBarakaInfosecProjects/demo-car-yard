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
  onDetailsClick?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onDetailsClick }: VehicleCardProps) {
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
        const stored = localStorage.getItem('dealerPhone');
        if (stored) setDealerPhone(stored.replace(/^0/, ''));
      });
  }, []);

  const handleClick = () => {
    if (onDetailsClick) {
      onDetailsClick(vehicle);
    } else {
      router.push(`/cars/${vehicle.slug}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <Image
          src={gridImage(vehicle.imageUrl) || '/placeholder.jpg'}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {vehicle.featured && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        </div>
        <p className="text-amber-600 font-bold text-xl mb-2">
          KES {formatPrice(vehicle.priceKES)}
        </p>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{vehicle.mileage?.toLocaleString()} km</p>
          <p>{vehicle.transmission}</p>
          <p>{vehicle.fuelType}</p>
        </div>
      </div>
    </div>
  );
}
