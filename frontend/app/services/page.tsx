'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Car, Phone, Mail, ArrowRight } from 'lucide-react';
import DealerPhone from '@/components/DealerPhone';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ServicesPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      ),
      title: 'Buy a Car',
      description: 'Browse our verified inventory with transparent pricing and detailed vehicle information.',
      link: '/inventory',
      buttonText: 'Browse Showroom'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      title: 'Sell Your Car',
      description: 'Get fair market value for your vehicle with our quick and hassle-free selling process.',
      link: '/contact',
      buttonText: 'Get Valuation'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
        </svg>
      ),
      title: 'Trade-In',
      description: 'Upgrade to a new vehicle with our convenient trade-in program. Fast and easy.',
      link: '/contact',
      buttonText: 'Trade Today'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      ),
      title: 'NTSA Transfer',
      description: 'Complete NTSA transfer assistance included. We handle all the paperwork for you.',
      link: '/contact',
      buttonText: 'Learn More'
    }
  ];

  return (
    <div className="sassy-theme" style={{ background: '#0c0a08', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full px-4 lg:px-8 py-3 flex justify-between items-center" style={{ background: 'rgba(12,10,8,0.92)', borderBottom: '1px solid #2d2d2d' }}>
        <Link href="/" className="flex items-center gap-2">
          <span style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 600, color: '#faf6ef' }}>Sassy Auto Trading</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: '#a09888' }}>
          <Link href="/" className="hover:text-[#c4933f] transition">Home</Link>
          <Link href="/inventory" className="hover:text-[#c4933f] transition">Showroom</Link>
          <Link href="/services" style={{ color: '#c4933f', borderBottom: '2px solid #c4933f', paddingBottom: '4px' }}>Sell Your Car</Link>
          <Link href="/contact" className="hover:text-[#c4933f] transition">Contact</Link>
          <span style={{ background: '#c4933f', color: '#0c0a08', padding: '8px 16px', borderRadius: '9999px' }}><DealerPhone /></span>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: '#1c1814', color: '#faf6ef' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          <span className="text-xs font-bold">Menu</span>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 lg:hidden" style={{ background: '#1c1814', borderBottom: '1px solid #2d2d2d' }}>
            <div className="px-4 py-3 space-y-2">
              <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg" style={{ color: '#a09888' }} onClick={() => setMobileMenuOpen(false)}>
                <Home size={16} /><span>Home</span>
              </Link>
              <Link href="/inventory" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg" style={{ color: '#a09888' }} onClick={() => setMobileMenuOpen(false)}>
                <Car size={16} /><span>Showroom</span>
              </Link>
              <Link href="/services" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg" style={{ background: 'rgba(196,147,63,0.1)', color: '#c4933f' }} onClick={() => setMobileMenuOpen(false)}>
                <Phone size={16} /><span>Sell Your Car</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold rounded-lg" style={{ color: '#a09888' }} onClick={() => setMobileMenuOpen(false)}>
                <Mail size={16} /><span>Contact</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 0', background: '#0c0a08' }}>
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#c4933f' }}>
              <span className="w-8 h-[2px]" style={{ background: '#c4933f' }}></span>
              Our Services
              <span className="w-8 h-[2px]" style={{ background: '#c4933f' }}></span>
            </div>
            <h1 className="display-3 fw-bold mb-4" style={{ color: '#faf6ef' }}>
              How Can We <span style={{ color: '#c4933f', fontStyle: 'italic' }}>Help?</span>
            </h1>
            <p className="lead mx-auto mb-5" style={{ color: '#a09888', maxWidth: '600px' }}>
              From buying your dream car to selling your current vehicle — we've got you covered with professional services tailored to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '40px 0 100px', background: '#0c0a08' }}>
        <div className="container">
          <div className="row g-4">
            {services.map((service, index) => (
              <div className="col-md-6 col-lg-3" key={index}>
                <div className="card h-100" style={{ background: '#1c1814', border: '1px solid #2d2d2d', borderRadius: '16px' }}>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="mb-3" style={{ color: '#c4933f' }}>{service.icon}</div>
                    <h3 className="h5 fw-bold mb-2" style={{ color: '#faf6ef' }}>{service.title}</h3>
                    <p className="mb-4 flex-grow-1" style={{ color: '#a09888', fontSize: '14px' }}>{service.description}</p>
                    <Link href={service.link} className="btn w-100" style={{ background: '#c4933f', color: '#0c0a08', borderRadius: '8px' }}>
                      {service.buttonText} <ArrowRight size={16} className="ms-2" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
