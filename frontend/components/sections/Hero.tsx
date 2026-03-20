'use client';

import 'animate.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Home, Car, Phone } from 'lucide-react';

const MAKES = [
  'All Brands', 'Toyota', 'Nissan', 'Honda', 'Mazda', 'Mercedes', 'BMW', 
  'Subaru', 'Mitsubishi', 'Ford', 'Chevrolet', 'Kia', 'Hyundai', 'Volkswagen',
  'Lexus', 'Audi', 'Porsche', 'Tesla', 'Jeep', 'Land Rover'
];

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('1M - 3M');
  const [selectedMake, setSelectedMake] = useState('All Brands');
  const [selectedYear, setSelectedYear] = useState('Any Year');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedMake !== 'All Brands') params.set('make', selectedMake);
    if (selectedYear !== 'Any Year') params.set('year', selectedYear.replace('+', ''));
    if (selectedBudget) params.set('budget', selectedBudget);
    router.push(`/inventory?${params.toString()}`);
  };

  const budgetOptions = ['Under 1M', '1M - 3M', '3M - 5M', 'Above 5M'];

  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'linear-gradient(135deg, #020617 35%, rgba(2, 6, 23, 0.7) 100%), url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1920)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Navigation */}
      <nav className="relative z-50 w-full border-b border-white/5 px-4 lg:px-8 py-3 flex justify-between items-center bg-slate-950/40 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Sassy Auto Trading" className="h-10 w-auto" />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300">
          <Link href="/inventory" className="nav-link text-white hover:text-white transition-all duration-300 relative">
            Showroom
            <span className="absolute w-0 h-0.5 bg-blue-500 bottom-[-4px] left-0 transition-all duration-300 hover:w-full"></span>
          </Link>
          <Link href="/services" className="nav-link hover:text-white transition-all duration-300 relative">
            Our Services
            <span className="absolute w-0 h-0.5 bg-blue-500 bottom-[-4px] left-0 transition-all duration-300 hover:w-full"></span>
          </Link>
          <Link href="/contact" className="nav-link hover:text-white transition-all duration-300 relative">
            About Us
            <span className="absolute w-0 h-0.5 bg-blue-500 bottom-[-4px] left-0 transition-all duration-300 hover:w-full"></span>
          </Link>
          <a href="tel:0722000000" className="bg-blue-600 text-white px-5 xl:px-6 py-2.5 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-900/20">
            0722 000 000
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white/10 rounded-xl text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-xs font-bold uppercase">Menu</span>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu-container absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 lg:hidden">
            <div className="px-4 py-4 space-y-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link href="/inventory" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-400 bg-white/5 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                <Car size={18} />
                <span>Showroom</span>
              </Link>
              <Link href="/services" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                <span>Our Services</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-white hover:bg-white/10 rounded-xl" onClick={() => setMobileMenuOpen(false)}>
                <span>Contact</span>
              </Link>
              <a href="tel:0722000000" className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl">
                <Phone size={16} />
                <span>0722 000 000</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center px-4 lg:px-8 py-6 lg:py-8">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Left Content */}
          <div className="text-white space-y-4 lg:space-y-5 animate__animated animate__fadeInLeft">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Drive Your <br/><span className="text-blue-500 italic">Pride & Joy.</span>
            </h1>
            <p className="text-sm lg:text-base text-slate-400 max-w-md lg:max-w-lg leading-relaxed">
              From <span className="text-white font-semibold">fresh imports</span> to <span className="text-white font-semibold">certified local units</span>, we handle all <span className="text-white font-semibold">NTSA transfers</span> so you can focus on the road.
            </p>
          </div>

          {/* Right - Search Form */}
          <div className="lg:col-span-1 animate__animated animate__fadeInRight">
            <div className="rounded-[2.5rem] p-4 lg:p-6 xl:p-8" style={{
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)'
            }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-5 lg:mb-6">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Search Showroom</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="e.g. Prado, Harrier, Mazda..." 
                      className="w-full px-5 lg:px-6 py-3.5 lg:py-4 bg-slate-100 border-2 border-transparent rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-sm lg:text-base font-semibold text-slate-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                </div>

                <div className="mb-6 lg:mb-8">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 lg:mb-4 ml-1">Budget (KES)</label>
                  <div className="flex flex-wrap gap-2">
                    {budgetOptions.map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setSelectedBudget(budget)}
                        className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-[11px] font-bold border-2 rounded-lg lg:rounded-xl bg-white transition-all duration-200 whitespace-nowrap ${
                          selectedBudget === budget
                            ? 'border-blue-600 text-white bg-blue-600 shadow-md'
                            : 'border-slate-100 text-slate-500 hover:border-blue-200'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Make</label>
                    <select 
                      className="w-full p-3.5 lg:p-4 bg-slate-100 border-none rounded-2xl text-base font-bold outline-none cursor-pointer"
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                    >
                      {MAKES.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Year</label>
                    <select 
                      className="w-full p-3.5 lg:p-4 bg-slate-100 border-none rounded-2xl text-base font-bold outline-none cursor-pointer"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option>Any Year</option>
                      <option>2018+</option>
                      <option>2019+</option>
                      <option>2020+</option>
                      <option>2021+</option>
                      <option>2022+</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-950 text-white py-4 lg:py-5 rounded-[1.5rem] font-black text-base lg:text-lg hover:bg-blue-600 transition-all duration-300 shadow-xl uppercase tracking-widest active:scale-95"
                >
                  Search Vehicles
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
