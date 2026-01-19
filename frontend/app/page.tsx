import { Suspense } from 'react';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import FeaturedVehicles from '@/components/sections/FeaturedVehicles';
import ShopByBrand from '@/components/sections/ShopByBrand';
import Services from '@/components/sections/Services';
import ContactCTA from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedVehicles />
      <Suspense fallback={<div className="py-16 bg-white"><div className="max-w-7xl mx-auto px-4"><div className="text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div></div></div>}>
        <ShopByBrand />
      </Suspense>
      <Stats />
      <Services />
      <ContactCTA />
    </main>
  );
}
