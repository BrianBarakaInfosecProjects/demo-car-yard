'use client';

import { useState } from 'react';

const brands = [
  { id: 'toyota', name: 'Toyota', logo: '/brands/toyota.svg' },
  { id: 'nissan', name: 'Nissan', logo: '/brands/nissan.svg' },
  { id: 'subaru', name: 'Subaru', logo: '/brands/subaru.svg' },
  { id: 'mazda', name: 'Mazda', logo: '/brands/mazda.svg' },
  { id: 'honda', name: 'Honda', logo: '/brands/honda.svg' },
  { id: 'mitsubishi', name: 'Mitsubishi', logo: '/brands/mitsubishi.svg' },
  { id: 'isuzu', name: 'Isuzu', logo: '/brands/isuzu.svg' },
  { id: 'mercedes', name: 'Mercedes-Benz', logo: '/brands/mercedes.svg' },
  { id: 'bmw', name: 'BMW', logo: '/brands/bmw.svg' },
  { id: 'audi', name: 'Audi', logo: '/brands/audi.svg' },
  { id: 'volkswagen', name: 'Volkswagen', logo: '/brands/volkswagen.svg' },
  { id: 'hyundai', name: 'Hyundai', logo: '/brands/hyundai.svg' },
  { id: 'kia', name: 'Kia', logo: '/brands/kia.svg' },
  { id: 'ford', name: 'Ford', logo: '/brands/ford.svg' },
  { id: 'landrover', name: 'Land Rover', logo: '/brands/landrover.svg' },
];

interface BrandFilterProps {
  selectedBrand: string | null;
  onBrandSelect: (brand: string | null) => void;
}

export default function BrandFilter({ selectedBrand, onBrandSelect }: BrandFilterProps) {
  return (
    <section className="brand-filter-section">
      <div className="container">
        <div className="brand-filter-header">
          <h2 className="brand-filter-title">Browse by Brand</h2>
        </div>

        <div className="brand-grid">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => onBrandSelect(selectedBrand === brand.id ? null : brand.id)}
              className={`brand-card ${selectedBrand === brand.id ? 'active' : ''}`}
              aria-label={`Filter by ${brand.name}`}
            >
              <div className="brand-logo-wrapper">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="brand-logo"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="brand-fallback">{brand.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
