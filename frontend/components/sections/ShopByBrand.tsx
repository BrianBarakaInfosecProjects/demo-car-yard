'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

const BRAND_LOGOS = {
  toyota: '/brands/toyota.svg',
  nissan: '/brands/nissan.svg',
  subaru: '/brands/subaru.svg',
  mazda: '/brands/mazda.svg',
  honda: '/brands/honda.svg',
  mitsubishi: '/brands/mitsubishi.svg',
  bmw: '/brands/bmw.svg',
  audi: '/brands/audi.svg',
  hyundai: '/brands/hyundai.svg',
  kia: '/brands/kia.svg',
  isuzu: '/brands/isuzu.svg',
  volkswagen: '/brands/volkswagen.svg',
  chevrolet: '/brands/chevrolet.svg',
  ford: '/brands/ford.svg',
} as const;

const brands = [
  { name: 'Toyota', key: 'toyota' as const },
  { name: 'Nissan', key: 'nissan' as const },
  { name: 'Subaru', key: 'subaru' as const },
  { name: 'Mazda', key: 'mazda' as const },
  { name: 'Honda', key: 'honda' as const },
  { name: 'Mitsubishi', key: 'mitsubishi' as const },
  { name: 'BMW', key: 'bmw' as const },
  { name: 'Audi', key: 'audi' as const },
  { name: 'Hyundai', key: 'hyundai' as const },
  { name: 'Kia', key: 'kia' as const },
  { name: 'Isuzu', key: 'isuzu' as const },
  { name: 'Volkswagen', key: 'volkswagen' as const },
  { name: 'Chevrolet', key: 'chevrolet' as const },
  { name: 'Ford', key: 'ford' as const },
];

export default function ShopByBrand() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleBrandClick = (brandName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('make', brandName);
    params.delete('search');
    params.delete('minPrice');
    params.delete('maxPrice');
    
    const queryString = params.toString();
    const url = `/inventory${queryString ? `?${queryString}` : ''}`;
    
    router.push(url);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollPos = 0;
    const speed = 3;
    let animationFrameId: number;

    const scroll = () => {
      scrollPos += speed;
      if (scrollPos >= container.scrollWidth / 2) {
        scrollPos = 0;
      }
      container.scrollLeft = scrollPos;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(scroll);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="shop-by-brand-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="shop-by-brand-title">Shop by Brand</h2>
          <p className="shop-by-brand-subtitle">Browse our inventory by your favorite car manufacturer</p>
        </div>

        <div
          className="brand-marquee-container"
          ref={scrollContainerRef}
        >
          <div className="brand-marquee-track">
            {[...brands, ...brands].map((brand, index) => (
              <button
                key={`${brand.key}-${index}`}
                onClick={() => handleBrandClick(brand.name)}
                className="brand-marquee-item"
                aria-label={`Filter by ${brand.name}`}
              >
                <div className="brand-logo-wrapper">
                  <Image
                    src={BRAND_LOGOS[brand.key]}
                    alt={`${brand.name} logo`}
                    width={64}
                    height={64}
                    className="brand-logo"
                  />
                </div>
                <span className="brand-name">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
