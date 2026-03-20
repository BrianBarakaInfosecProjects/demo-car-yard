'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import DealerPhone from '@/components/DealerPhone';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function Home() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dealerPhone, setDealerPhone] = useState('');

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const data = await api.get('/vehicles');
        const allVehicles = Array.isArray(data) ? data : data.vehicles || [];
        setVehicles(allVehicles.filter((v: any) => !v.isDraft).slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVehicles();

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings/public`)
      .then(res => res.json())
      .then(data => {
        if (data.dealerPhone) {
          setDealerPhone(data.dealerPhone.replace(/^0/, ''));
          localStorage.setItem('dealerPhone', data.dealerPhone);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('dealerPhone');
        if (saved) setDealerPhone(saved.replace(/^0/, ''));
      });
  }, []);

  const getVehicleImage = (vehicle: any) => {
    if (vehicle.images && vehicle.images.length > 0) return vehicle.images[0];
    return vehicle.imageUrl;
  };

  return (
    <div className="sassy-theme bg-bg-page min-h-screen">

      {/* HERO SECTION */}
      <section className="hero relative min-h-screen flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80" 
            alt="Luxury cars" 
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.45) saturate(0.85)', transform: 'scale(1.04)', animation: 'heroZoom 12s var(--ease-out) forwards' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(12,10,8,1) 0%, rgba(12,10,8,0.6) 40%, rgba(12,10,8,0.1) 100%), linear-gradient(to right, rgba(12,10,8,0.5) 0%, transparent 60%)' }}></div>
        </div>
        
        <div className="hero-watermark">SASSY</div>

        <div className="relative z-10 px-16 pb-18 max-w-[860px]">
          <div className="hero-eyebrow flex items-center gap-3.5 mb-6" style={{ fontFamily: 'var(--cond)', fontSize: '10px', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--gold)', animation: 'fadeUp 0.9s var(--ease-out) 0.1s both' }}>
            <span className="w-9 h-px bg-accent flex-shrink-0"></span>
            Nairobi&apos;s Finest Dealership Since 2001
          </div>
          
          <h1 className="font-serif text-text-primary mb-7" style={{ fontSize: 'clamp(52px, 8vw, 110px)', fontWeight: 300, lineHeight: 0.97, letterSpacing: '-0.02em', animation: 'fadeUp 0.9s var(--ease-out) 0.22s both' }}>
            Find Your Next<br/>
            <em className="italic text-accent">Ride at Sassy Auto Trading.</em>
          </h1>
          
          <p className="text-text-secondary text-body leading-relaxed mb-11 max-w-[460px]" style={{ animation: 'fadeUp 0.9s var(--ease-out) 0.36s both' }}>
            Curated luxury and executive vehicles, hand-selected for the discerning Kenyan family. Transparent pricing, in-house financing, full NTSA transfer — all under one roof in Nairobi.
          </p>
          
          <div className="flex items-center gap-4 flex-wrap" style={{ animation: 'fadeUp 0.9s var(--ease-out) 0.48s both' }}>
            <a href="/inventory" className="bg-accent text-text-primary rounded-lg py-3 px-7 text-[15px] font-semibold hover:bg-accent-hover transition-colors inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>
              Browse Inventory
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href={dealerPhone ? `https://wa.me/254${dealerPhone}` : '#'} target="_blank" rel="noopener noreferrer" className="bg-whatsapp text-white rounded-lg py-3 px-7 text-[15px] font-semibold hover:bg-whatsapp/90 transition-colors inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
            <a href="#how-it-works" className="border border-accent text-accent rounded-lg py-3 px-7 text-[15px] font-semibold hover:bg-accent hover:text-text-primary transition-colors inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>Book Test Drive</a>
          </div>
        </div>

        {/* Hero Badges */}
        <div className="absolute right-16 bottom-18 z-10 flex flex-col gap-0.5" style={{ animation: 'fadeUp 0.9s var(--ease-out) 0.62s both' }}>
          <div className="hero-badge">
            <span className="hero-badge-num">{vehicles.length}+</span>
            <span className="hero-badge-label">In Stock</span>
          </div>
          <div className="hero-badge">
            <span className="hero-badge-num">23</span>
            <span className="hero-badge-label">Years Est.</span>
          </div>
          <div className="hero-badge">
            <span className="hero-badge-num">4,800+</span>
            <span className="hero-badge-label">Happy Clients</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll">
          <div className="w-px h-11" style={{ background: 'linear-gradient(to bottom, var(--gold), transparent)', animation: 'pulse 2.2s ease-in-out infinite' }}></div>
          Scroll
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <div className="marquee-strip">
        <div className="marquee-track">
          <span className="marquee-item">Authorised Dealer</span>
          <span className="marquee-item">Certified Pre-Owned</span>
          <span className="marquee-item">Flexible Financing</span>
          <span className="marquee-item">Trade-In Welcome</span>
          <span className="marquee-item">NTSA Transfer Handled</span>
          <span className="marquee-item">Nationwide Delivery</span>
          <span className="marquee-item">Full Inspection Reports</span>
          <span className="marquee-item">Authorised Dealer</span>
          <span className="marquee-item">Certified Pre-Owned</span>
          <span className="marquee-item">Flexible Financing</span>
          <span className="marquee-item">Trade-In Welcome</span>
          <span className="marquee-item">NTSA Transfer Handled</span>
          <span className="marquee-item">Nationwide Delivery</span>
          <span className="marquee-item">Full Inspection Reports</span>
        </div>
      </div>

      {/* FEATURED FLEET */}
      <section className="bg-bg-card py-24 px-16" id="fleet">
        <div className="flex justify-between items-end gap-8 mb-12 flex-wrap">
          <div>
            <div className="eyebrow">Current Inventory</div>
            <h2 className="section-title">Our <em>Featured</em> Fleet</h2>
            <div style={{ fontFamily: 'var(--cond)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--stone)', marginTop: '6px' }}>
              Showing <span style={{ color: 'var(--gold)' }}>{vehicles.length}</span> of {vehicles.length} vehicles
            </div>
          </div>
          <div className="flex gap-0.5 flex-wrap">
            <button className="font-cond text-[9.5px] tracking-[0.18em] uppercase text-accent border border-accent px-4 py-2" style={{ background: 'rgba(196,147,63,0.06)' }}>All</button>
            <button className="font-cond text-[9.5px] tracking-[0.18em] uppercase text-text-secondary border px-4 py-2" style={{ borderColor: 'rgba(160,152,136,0.2)' }}>SUV / 4×4</button>
            <button className="font-cond text-[9.5px] tracking-[0.18em] uppercase text-text-secondary border px-4 py-2" style={{ borderColor: 'rgba(160,152,136,0.2)' }}>Saloon</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-15">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" style={{ margin: '0 auto' }}></div>
          </div>
        ) : (
          <div className="grid grid-cols-[60fr_40fr] gap-0.5">
            {vehicles.slice(0, 1).map((vehicle, index) => (
              <Link 
                key={vehicle.id} 
                href={vehicle.slug ? `/cars/${vehicle.slug}` : '/inventory'}
                className="car-card featured"
                style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)', gridRow: 'span 2', cursor: 'pointer', display: 'block' }}
              >
                <img 
                  src={getVehicleImage(vehicle)} 
                  alt={`${vehicle.make} ${vehicle.model}`}
                  style={{ width: '100%', height: '100%', minHeight: '320px', objectFit: 'cover', filter: 'brightness(0.6) saturate(0.85)', transition: 'transform 0.8s var(--ease-out), filter 0.5s' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,10,8,0.97) 0%, rgba(12,10,8,0.3) 50%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '36px 40px' }}>
                  <div style={{ fontFamily: 'var(--cond)', fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '16px', height: '1px', background: 'var(--gold)' }}></span>
                    Featured · Editor&apos;s Pick
                  </div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '32px', fontWeight: 300, color: 'var(--cream-warm)', lineHeight: 1.2, marginBottom: '4px' }}>{vehicle.make} {vehicle.model}</h3>
                  <div style={{ fontFamily: 'var(--cond)', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--stone)', marginBottom: '20px' }}>{vehicle.year} · {vehicle.bodyType} · {vehicle.mileage?.toLocaleString()} km</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--cond)', fontSize: '7.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--stone)', display: 'block' }}>Starting From</span>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: '26px', color: 'var(--gold-lt)', fontWeight: 300 }}>KSh {vehicle.priceKES?.toLocaleString()}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--cond)', fontSize: '8.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '8px 14px' }}>Details →</span>
                  </div>
                </div>
              </Link>
            ))}
            {vehicles.slice(1).map((vehicle) => (
              <Link 
                key={vehicle.id} 
                href={vehicle.slug ? `/cars/${vehicle.slug}` : '/inventory'}
                className="car-card"
                style={{ position: 'relative', overflow: 'hidden', background: 'var(--ink)', cursor: 'pointer', display: 'block' }}
              >
                <img 
                  src={getVehicleImage(vehicle)} 
                  alt={`${vehicle.make} ${vehicle.model}`}
                  style={{ width: '100%', height: '100%', minHeight: '180px', objectFit: 'cover', filter: 'brightness(0.6) saturate(0.85)', transition: 'transform 0.8s var(--ease-out), filter 0.5s' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,10,8,0.97) 0%, rgba(12,10,8,0.3) 50%, transparent 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '28px 32px' }}>
                  <div style={{ fontFamily: 'var(--cond)', fontSize: '8px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '16px', height: '1px', background: 'var(--gold)' }}></span>
                    {vehicle.featured ? 'Popular' : 'Available'}
                  </div>
                  <h3 style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 300, color: 'var(--cream-warm)', lineHeight: 1.2, marginBottom: '4px' }}>{vehicle.make} {vehicle.model}</h3>
                  <div style={{ fontFamily: 'var(--cond)', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--stone)', marginBottom: '20px' }}>{vehicle.year} · {vehicle.bodyType}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <span style={{ fontFamily: 'var(--cond)', fontSize: '7.5px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--stone)', display: 'block' }}>Starting From</span>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: '21px', color: 'var(--gold-lt)', fontWeight: 300 }}>KSh {vehicle.priceKES?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a href="/inventory" className="bg-accent text-text-primary rounded-lg py-2 px-5 text-sm font-semibold hover:bg-accent-hover transition-colors inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>
            View Full Inventory
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>

      {/* STOCKED BRANDS */}
      <div className="brands-bar reveal" style={{ padding: '0 64px' }}>
        <div className="brands-label">Stocked Brands</div>
        <div className="brands-list">
          <div className="brands-scroll">
            {['Toyota', 'Lexus', 'Mercedes-Benz', 'BMW', 'Land Rover', 'Volkswagen', 'Audi', 'Mitsubishi'].map((brand) => (
              <span key={brand} className="brand-item">{brand}</span>
            ))}
            {['Toyota', 'Lexus', 'Mercedes-Benz', 'BMW', 'Land Rover', 'Volkswagen', 'Audi', 'Mitsubishi'].map((brand) => (
              <span key={brand + '-dup'} className="brand-item">{brand}</span>
            ))}
          </div>
        </div>
      </div>

      {/* WHY SASSY */}
      <section id="about" className="grid grid-cols-[42fr_58fr] min-h-[620px]">
        <div className="relative overflow-hidden">
          <img src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=900&q=80" alt="Sassy showroom" className="w-full h-full object-cover" style={{ filter: 'brightness(0.45) saturate(0.8)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(196,147,63,0.12) 0%, transparent 50%), linear-gradient(to top, rgba(12,10,8,0.9) 0%, transparent 50%)' }}></div>
          <div className="absolute bottom-11 left-10 right-10">
            <blockquote className="font-serif text-xl italic font-normal text-text-primary leading-relaxed mb-3.5" style={{ fontStyle: 'italic' }}>
              &ldquo;Buying a car is one of the most important decisions a Kenyan family makes. We treat it that way — every time.&rdquo;
            </blockquote>
            <cite className="font-cond text-[9px] tracking-[0.22em] uppercase text-accent not-italic">— James Kamau, Founder & Managing Director</cite>
          </div>
        </div>
        <div className="bg-bg-elevated py-20 px-16 flex flex-col justify-center">
          <div className="eyebrow">Why Sassy</div>
          <h2 className="section-title">The Standard We<br/><em>Never</em> Compromise</h2>
          <div className="mt-11">
            <div className="pillar">
              <span className="pillar-num">01</span>
              <div>
                <div className="pillar-name">120-Point Inspection</div>
                <p className="pillar-desc">Every vehicle is certified by our in-house mechanics before it enters the showroom. You receive the full written report before you sign anything.</p>
              </div>
            </div>
            <div className="pillar">
              <span className="pillar-num">02</span>
              <div>
                <div className="pillar-name">Transparent Pricing</div>
                <p className="pillar-desc">No hidden fees. No surprise charges. The price you see is the price you pay — including NTSA transfer and delivery.</p>
              </div>
            </div>
            <div className="pillar">
              <span className="pillar-num">03</span>
              <div>
                <div className="pillar-name">In-House Financing</div>
                <p className="pillar-desc">Flexible payment plans tailored to your budget. Approvals in as little as 48 hours with competitive rates.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-bg-page py-24 px-16 text-center">
        <div style={{ marginBottom: '72px' }}>
          <div className="eyebrow center">How It Works</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Your Journey to<br/><em>Ownership</em></h2>
        </div>
        
        <div className="process-steps">
          <div className="step">
            <div className="step-circle">1</div>
            <div className="step-title">Browse Online</div>
            <div className="step-desc">Explore our curated inventory from the comfort of your home.</div>
          </div>
          <div className="step">
            <div className="step-circle">2</div>
            <div className="step-title">Schedule Viewing</div>
            <div className="step-desc">Book a slot to see your chosen vehicle at our showroom.</div>
          </div>
          <div className="step">
            <div className="step-circle">3</div>
            <div className="step-title">Test Drive</div>
            <div className="step-desc">Experience the vehicle firsthand on roads across Kenya.</div>
          </div>
          <div className="step">
            <div className="step-circle">4</div>
            <div className="step-title">Drive Home</div>
            <div className="step-desc">Complete paperwork, get your keys, and hit the road — it&apos;s that simple.</div>
          </div>
        </div>

        <div className="mt-12 font-serif text-lg italic text-accent-light">
          Visit us. Book via WhatsApp in under a minute.
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <a href={dealerPhone ? `https://wa.me/254${dealerPhone}` : '#'} target="_blank" rel="noopener noreferrer" className="bg-whatsapp text-white rounded-lg py-2 px-5 text-sm font-semibold hover:bg-whatsapp/90 transition-colors inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* LOCATION & CONTACT */}
      <section id="visit-us" className="grid grid-cols-2 min-h-[520px]">
        <div className="relative overflow-hidden bg-bg-elevated">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.808287744867!2d36.8019!3d-1.2644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f16a0b4b31b3%3A0x2e2a!2sWestlands%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1600000000000!5m2!1sen!2ske" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(85%) brightness(0.7) sepia(20%)' }} 
            allowFullScreen 
            loading="lazy"
          ></iframe>
          <div className="absolute top-5 left-5 bg-bg-page border border-border-subtle px-4 py-2.5 font-cond text-[9px] tracking-[0.2em] uppercase text-accent backdrop-blur-sm">
            Our Location
          </div>
        </div>
        <div className="bg-bg-elevated py-18 px-14 flex flex-col justify-center border-l border-border-subtle">
          <div className="eyebrow">Visit Us</div>
          <h2 className="section-title">Get In <em>Touch</em></h2>
          
          <div className="mt-10 flex flex-col gap-0.5">
            <div className="contact-item">
              <span className="contact-label">Showroom</span>
              <span className="contact-val">Nairobi, Kenya</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone</span>
              <a href={dealerPhone ? `tel:+254${dealerPhone}` : '#'} className="contact-val" style={{ textDecoration: 'none' }}>+254 {dealerPhone}</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Email</span>
              <a href="mailto:info@sasyautotrading.com" className="contact-val" style={{ textDecoration: 'none' }}>info@sasyautotrading.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Hours</span>
              <span className="contact-val">Mon – Sat: 8AM – 6PM</span>
            </div>
          </div>

          <div className="mt-7 flex gap-2 flex-wrap">
          <a href={dealerPhone ? `https://wa.me/254${dealerPhone}` : '#'} target="_blank" rel="noopener noreferrer" className="bg-whatsapp text-white rounded-lg py-2 px-5 text-sm font-semibold hover:bg-whatsapp/90 transition-colors inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
            <a href="#visit-us" className="border border-accent text-accent rounded-lg py-2 px-5 text-sm font-semibold hover:bg-accent hover:text-text-primary transition-colors inline-flex items-center gap-2" style={{ textDecoration: 'none' }}>Get Directions</a>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-bg-page py-[100px] px-16 grid grid-cols-2 gap-16 items-center border-t border-border-subtle relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="font-serif text-text-primary" style={{ fontSize: 'clamp(36px, 4vw, 54px)', fontWeight: 300, lineHeight: 1.12 }}>
            Ready to Find<br/><em className="italic text-accent">Your Perfect Car?</em>
          </h2>
        </div>
        <div className="flex flex-col gap-2.5 relative z-10">
          <a href="/inventory" className="sassy-btn-primary" style={{ justifyContent: 'center' }}>
            Browse Inventory
          </a>
            <a href={dealerPhone ? `https://wa.me/254${dealerPhone}` : '#'} target="_blank" rel="noopener noreferrer" className="sassy-btn-wa" style={{ justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#070605] py-[72px] px-16 pt-10 border-t border-border-subtle">
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-12 pb-14" style={{ borderBottom: '1px solid rgba(196,147,63,0.08)' }}>
          <div>
            <span className="font-serif text-[22px] font-normal text-text-primary tracking-[0.03em] block mb-0.5">Sassy Auto Trading</span>
            <p className="text-text-secondary text-body leading-relaxed mb-5.5">
              Kenya&apos;s premier luxury car dealership. Curated vehicles, transparent pricing, and exceptional service since 2001.
            </p>
            <div className="flex gap-2">
            <a href="#" className="font-cond text-[8px] tracking-[0.18em] uppercase text-text-secondary border px-3 py-1.5 inline-block" style={{ borderColor: 'rgba(196,147,63,0.08)' }}>Facebook</a>
            <a href="#" className="font-cond text-[8px] tracking-[0.18em] uppercase text-text-secondary border px-3 py-1.5 inline-block" style={{ borderColor: 'rgba(196,147,63,0.08)' }}>Instagram</a>
            <a href="#" className="font-cond text-[8px] tracking-[0.18em] uppercase text-text-secondary border px-3 py-1.5 inline-block" style={{ borderColor: 'rgba(196,147,63,0.08)' }}>YouTube</a>
            </div>
          </div>
          <div>
            <span className="font-cond text-[8.5px] tracking-[0.28em] uppercase text-accent mb-4.5 block">Quick Links</span>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.25">
              <li><Link href="/inventory" className="text-base text-text-secondary flex items-center gap-2"><span className="w-2.5 h-px bg-accent opacity-0"></span>Inventory</Link></li>
              <li><a href="#about" className="text-base text-text-secondary flex items-center gap-2">About Us</a></li>
              <li><a href="#how-it-works" className="text-base text-text-secondary flex items-center gap-2">How It Works</a></li>
              <li><a href="#visit-us" className="text-base text-text-secondary flex items-center gap-2">Contact</a></li>
            </ul>
          </div>
          <div>
            <span className="font-cond text-[8.5px] tracking-[0.28em] uppercase text-accent mb-4.5 block">Services</span>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.25">
              <li><span className="text-base text-text-secondary">In-House Financing</span></li>
              <li><span className="text-base text-text-secondary">Trade-In</span></li>
              <li><span className="text-base text-text-secondary">NTSA Transfer</span></li>
              <li><span className="text-base text-text-secondary">Nationwide Delivery</span></li>
            </ul>
          </div>
          <div>
            <span className="font-cond text-[8.5px] tracking-[0.28em] uppercase text-accent mb-4.5 block">Contact</span>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.25">
              <li><a href={dealerPhone ? `tel:+254${dealerPhone}` : '#'} className="text-base text-text-secondary">+254 {dealerPhone}</a></li>
              <li><a href={dealerPhone ? `https://wa.me/254${dealerPhone}` : '#'} className="text-base text-text-secondary">WhatsApp Us</a></li>
              <li><span className="text-base text-text-secondary">Nairobi, Kenya</span></li>
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center pt-7 flex-wrap gap-3">
          <span className="font-cond text-[9px] tracking-[0.14em] text-text-secondary opacity-50">© 2026 Sassy Auto Trading. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="font-cond text-[9px] tracking-[0.18em] uppercase text-text-secondary opacity-40">Privacy</a>
            <a href="#" className="font-cond text-[9px] tracking-[0.18em] uppercase text-text-secondary opacity-40">Terms</a>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href={dealerPhone ? `https://wa.me/254${dealerPhone}` : '#'} target="_blank" rel="noopener noreferrer" className="wa-float">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        <span className="wa-float-label">Chat with us</span>
      </a>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
