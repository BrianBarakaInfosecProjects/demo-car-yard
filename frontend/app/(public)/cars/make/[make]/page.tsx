import { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';
import VehicleCard from '@/components/vehicles/VehicleCard';
import DealerPhone from '@/components/DealerPhone';

interface Props {
  params: Promise<{ make: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { make } = await params;
  const makeFormatted = make.charAt(0).toUpperCase() + make.slice(1);
  
  return {
    title: `${makeFormatted} Cars For Sale in Meru, Kenya — Sassy Auto Trading`,
    description: `Browse quality used ${makeFormatted} cars for sale in Meru, Kenya. Best prices, NTSA verified, financing available.`,
  };
}

export default async function MakeLandingPage({ params }: Props) {
  const { make } = await params;
  const makeFormatted = make.charAt(0).toUpperCase() + make.slice(1);

  let vehicles = [];
  try {
    const data = await api.get('/vehicles', { make: makeFormatted, limit: 50 });
    vehicles = Array.isArray(data) ? data : data.vehicles || [];
  } catch (error) {
    console.error('Error fetching vehicles:', error);
  }

  const availableVehicles = vehicles.filter((v: any) => v.status?.toUpperCase() !== 'SOLD');

  return (
    <>
      <NavBar />
      
      <section className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl lg:text-4xl font-black text-slate-900">
            {makeFormatted} Cars For Sale in <span className="text-accent">Meru, Kenya</span>
          </h1>
          <p className="text-slate-500 mt-2">
            Quality used {makeFormatted} vehicles at the best prices. NTSA verified dealership.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {availableVehicles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableVehicles.map((vehicle: any) => (
              <Link key={vehicle.id} href={`/cars/${vehicle.slug}`}>
                <VehicleCard vehicle={vehicle} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-bold text-slate-900 mb-2">No {makeFormatted} cars available</h2>
            <p className="text-slate-500 mb-6">Check back soon or browse other makes.</p>
            <Link href="/inventory" className="bg-accent text-white px-6 py-3 rounded-xl font-bold">
              Browse All Cars
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

function NavBar() {
  return (
    <nav className="sticky top-0 z-50 w-full px-4 lg:px-8 py-3 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-slate-200">
      <Link href="/" className="flex items-center gap-2">
        <img src="/logo.svg" alt="Sassy Auto Trading" className="h-10 w-auto" />
      </Link>
      
      <div className="hidden lg:flex items-center gap-8 text-base font-bold uppercase tracking-[0.15em] text-slate-500">
        <Link href="/" className="hover:text-accent">Home</Link>
        <Link href="/inventory" className="hover:text-accent">Showroom</Link>
        <Link href="/services" className="hover:text-accent">Sell Your Car</Link>
        <Link href="/contact" className="hover:text-accent">Contact</Link>
        <span className="bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-accent text-sm"><DealerPhone /></span>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-5 lg:py-6 px-4 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <Link href="/" className="text-lg lg:text-xl font-black italic">Sassy Auto Trading<span className="text-accent">.</span></Link>
        <div className="flex gap-5 text-base font-bold uppercase tracking-widest text-slate-500">
          <Link href="/" className="hover:text-white">Privacy</Link>
          <Link href="/" className="hover:text-white">Terms</Link>
        </div>
        <p className="text-base font-bold text-slate-500">© 2026 TRUSTAUTO</p>
      </div>
    </footer>
  );
}
