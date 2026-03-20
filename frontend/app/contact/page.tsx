'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Menu, X, Home, Car, Phone, Mail } from 'lucide-react';
import DealerPhone from '@/components/DealerPhone';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    vehicleId: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/inquiries', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        vehicleId: '',
      });
    } catch (err: any) {
      let errorMessage = 'Failed to send inquiry';
      if (err.response?.data?.error) {
        if (typeof err.response.data.error === 'object' && err.response.data.error !== null) {
          errorMessage = err.response.data.error.message || 'Failed to send inquiry';
        } else {
          errorMessage = err.response.data.error;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sassy-theme bg-bg-page min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full px-4 lg:px-12 py-3 lg:py-4 flex justify-between items-center" style={{ background: 'var(--navbar-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <Link href="/" className="flex items-center gap-2">
          <span style={{ fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 600, color: 'var(--cream-warm)' }}>Sassy Auto Trading</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--stone)' }}>
          <Link href="/" className="hover:text-accent transition">Home</Link>
          <Link href="/inventory" className="hover:text-accent transition">Showroom</Link>
          <Link href="/services" className="hover:text-accent transition">Sell Your Car</Link>
          <Link href="/contact" className="text-accent border-b-2 border-accent pb-1">Contact</Link>
          <span className="bg-accent text-ink px-5 xl:px-6 py-2.5 rounded-full hover:opacity-90 transition-all"><DealerPhone /></span>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: 'var(--ink)', color: 'var(--cream-warm)' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="text-xs font-bold uppercase">Menu</span>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 lg:hidden" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl" style={{ color: 'var(--stone)' }} onClick={() => setMobileMenuOpen(false)}>
                <Home size={18} />
                <span>Home</span>
              </Link>
              <Link href="/inventory" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl" style={{ color: 'var(--stone)' }} onClick={() => setMobileMenuOpen(false)}>
                <Car size={18} />
                <span>Showroom</span>
              </Link>
              <Link href="/services" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl" style={{ color: 'var(--stone)' }} onClick={() => setMobileMenuOpen(false)}>
                <Phone size={18} />
                <span>Sell Your Car</span>
              </Link>
              <Link href="/contact" className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl bg-accent text-ink" onClick={() => setMobileMenuOpen(false)}>
                <Mail size={18} />
                <span>Contact</span>
              </Link>
              <a href="tel:0722000000" className="flex items-center justify-center gap-2 px-4 py-3 bg-accent text-ink font-bold rounded-xl">
                <Phone size={16} />
                <DealerPhone />
              </a>
            </div>
          </div>
        )}
      </nav>

      <section className="py-12 lg:py-16" style={{ background: 'var(--bg-page)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-12">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
              <span className="w-6 lg:w-8 h-[2px]" style={{ background: 'var(--accent)' }}></span>
              Get in Touch
              <span className="w-6 lg:w-8 h-[2px]" style={{ background: 'var(--accent)' }}></span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tight" style={{ color: 'var(--cream-warm)' }}>Contact <span className="italic" style={{ color: 'var(--accent)' }}>Us.</span></h1>
            <p className="mt-3 max-w-lg mx-auto" style={{ color: 'var(--stone)' }}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="rounded-[2rem] p-6 lg:p-10 shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
              {success && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>Thank you! Your inquiry has been sent successfully.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl flex items-center gap-3" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--stone)' }}>Full Name</label>
                    <input
                      type="text"
                      className="w-full rounded-lg px-4 py-3 focus:outline-none"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--cream-warm)' }}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--stone)' }}>Phone</label>
                    <input
                      type="tel"
                      className="w-full rounded-lg px-4 py-3 focus:outline-none"
                      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--cream-warm)' }}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--stone)' }}>Email</label>
                  <input
                    type="email"
                    className="w-full rounded-lg px-4 py-3 focus:outline-none"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--cream-warm)' }}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mt-5">
                  <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--stone)' }}>Message</label>
                  <textarea
                    className="w-full rounded-lg px-4 py-3 focus:outline-none"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--cream-warm)', minHeight: '120px' }}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 py-4 rounded-xl font-bold text-base transition-all"
                  style={{ background: 'var(--accent)', color: 'var(--ink)' }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-block w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>Send Message <i className="fas fa-paper-plane ml-2"></i></>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
