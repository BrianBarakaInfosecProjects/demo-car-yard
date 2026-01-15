import Link from 'next/link';

const brands = [
  { name: 'Toyota', logo: '/brands/toyota.svg' },
  { name: 'Nissan', logo: '/brands/nissan.svg' },
  { name: 'Subaru', logo: '/brands/subaru.svg' },
  { name: 'Mazda', logo: '/brands/mazda.svg' },
  { name: 'Honda', logo: '/brands/honda.svg' },
  { name: 'Mitsubishi', logo: '/brands/mitsubishi.svg' },
  { name: 'Mercedes-Benz', logo: '/brands/mercedes.svg' },
  { name: 'BMW', logo: '/brands/bmw.svg' },
  { name: 'Audi', logo: '/brands/audi.svg' },
  { name: 'Hyundai', logo: '/brands/hyundai.svg' },
  { name: 'Kia', logo: '/brands/kia.svg' },
  { name: 'Isuzu', logo: '/brands/isuzu.svg' },
  { name: 'Land Rover', logo: '/brands/landrover.svg' },
];

export default function ShopByBrand() {
  return (
    <section className="py-12 bg-gray-50 border-y overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="text-center">
          <h2 className="section-title">Shop by Brand</h2>
          <p className="text-gray-600">Browse our inventory by your favorite car manufacturer</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

        <div className="flex animate-scroll-brands">
          {brands.map((brand, index) => (
            <Link
              key={`brand-1-${index}`}
              href={`/inventory?brand=${brand.name}`}
              className="flex-shrink-0 mx-6 group"
            >
              <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary hover:shadow-lg transition-all">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-20 h-20 object-contain mb-2 filter grayscale group-hover:grayscale-0 transition"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLSpanElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-2xl font-bold text-gray-400">{brand.name.charAt(0)}</span>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-primary transition">{brand.name}</p>
              </div>
            </Link>
          ))}

          {brands.map((brand, index) => (
            <Link
              key={`brand-2-${index}`}
              href={`/inventory?brand=${brand.name}`}
              className="flex-shrink-0 mx-6 group"
            >
              <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center hover:border-primary hover:shadow-lg transition-all">
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-20 h-20 object-contain mb-2 filter grayscale group-hover:grayscale-0 transition"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLSpanElement;
                    if (fallback) fallback.classList.remove('hidden');
                  }}
                />
                <span className="hidden text-2xl font-bold text-gray-400">{brand.name.charAt(0)}</span>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-primary transition">{brand.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link href="/inventory" className="text-primary font-semibold hover:underline">
          View All Brands <span className="ml-1">→</span>
        </Link>
      </div>
    </section>
  );
}
