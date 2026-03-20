'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { detailImage, thumbnailImage } from '@/lib/cloudinary';

interface VehicleGalleryProps {
  images: string[];
  title: string;
  shareButton?: React.ReactNode;
}

export default function VehicleGallery({ images, title, shareButton }: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-brand-ink-soft rounded-xl flex items-center justify-center border border-border">
        <p className="text-text-muted">No images available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[4/3] bg-brand-ink-soft rounded-xl overflow-hidden border border-border">
        <Image
          src={detailImage(images[currentIndex] || '')}
          alt={`${title} - Image ${currentIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-contain"
          quality={92}
          priority
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/80 border border-border rounded-full flex items-center justify-center text-brand-gold cursor-pointer hover:bg-black/60"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/80 border border-border rounded-full flex items-center justify-center text-brand-gold cursor-pointer hover:bg-black/60"
            >
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 right-2 bg-black/90 text-brand-gold text-xs px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
        
        {shareButton && (
          <div className="absolute top-3 right-3 z-10">
            {shareButton}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-16 h-12 rounded-md overflow-hidden border-2 cursor-pointer flex-shrink-0 ${index === currentIndex ? 'border-brand-gold' : 'border-transparent'}`}
              style={{ opacity: index === currentIndex ? 1 : 0.6 }}
            >
              <Image
                src={thumbnailImage(image)}
                alt={`${title} - Thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                quality={85}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
