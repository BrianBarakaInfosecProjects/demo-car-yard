'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface VehicleGalleryProps {
  images: string[];
  title: string;
}

export default function VehicleGallery({ images, title }: VehicleGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className="vehicle-gallery">
        <div className="gallery-placeholder">No images available</div>
      </div>
    );
  }

  return (
    <>
      <div className="vehicle-gallery">
        <div className="gallery-main">
          <button
            onClick={handlePrevious}
            className="gallery-nav gallery-nav-prev"
            aria-label="Previous image"
            disabled={images.length <= 1}
          >
            <ChevronLeft size={24} />
          </button>

          <div className="gallery-image-wrapper">
            <img
              src={images[currentIndex] || ''}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="gallery-main-image"
            />
            <button
              onClick={openLightbox}
              className="gallery-zoom-btn"
              aria-label="View full size"
            >
              <Maximize2 size={20} />
            </button>
          </div>

          <button
            onClick={handleNext}
            className="gallery-nav gallery-nav-next"
            aria-label="Next image"
            disabled={images.length <= 1}
          >
            <ChevronRight size={24} />
          </button>

          <div className="gallery-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {images.length > 1 && (
          <div className="gallery-thumbnails">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`gallery-thumbnail ${index === currentIndex ? 'active' : ''}`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${title} - Thumbnail ${index + 1}`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {isLightboxOpen && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button
            onClick={closeLightbox}
            className="lightbox-close"
            aria-label="Close lightbox"
          >
            ×
          </button>
          <img
            src={images[currentIndex] || ''}
            alt={`${title} - Full size`}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
