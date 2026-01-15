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
      <ShopByBrand />
      <Stats />
      <Services />
      <ContactCTA />
    </main>
  );
}
