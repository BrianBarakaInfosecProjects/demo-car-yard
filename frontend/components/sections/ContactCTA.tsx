import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="py-16" style={{ background: 'var(--ink)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="section-title" style={{ color: 'var(--cream-warm)' }}>Ready to Find Your Perfect Car?</h2>
            <p className="mb-5 fs-5" style={{ color: 'var(--stone)' }}>
              Contact our team today for personalized assistance and transparent pricing. We're here to help you find the vehicle that fits your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="btn"
                style={{ background: 'var(--cream-warm)', color: 'var(--ink)' }}
              >
                <Phone size={20} className="me-2" />
                Contact Us
              </Link>
              <Link
                href="/inventory"
                className="btn"
                style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)' }}
              >
                Browse Showroom <ArrowRight size={20} className="ms-2" />
              </Link>
            </div>
          </div>
          <div>
            <div className="p-5" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', backdropFilter: 'blur(8px)', border: '1px solid var(--border-color)' }}>
              <h3 className="mb-4 fw-bold" style={{ color: 'var(--cream-warm)' }}>Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex align-items-center gap-3">
                  <div className="flex align-items-center justify-center" style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                    <Phone size={24} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold" style={{ color: 'var(--cream-warm)' }}>Call Us</p>
                    <p className="mb-0" style={{ color: 'var(--stone)' }}>+254 704 416 897</p>
                  </div>
                </div>
                <div className="flex align-items-center gap-3">
                  <div className="flex align-items-center justify-center" style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                    <Mail size={24} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold" style={{ color: 'var(--cream-warm)' }}>Email Us</p>
                    <p className="mb-0" style={{ color: 'var(--stone)' }}>info@sassyauto.co.ke</p>
                  </div>
                </div>
                <div className="flex align-items-center gap-3">
                  <div className="flex align-items-center justify-center" style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                    <MapPin size={24} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold" style={{ color: 'var(--cream-warm)' }}>Visit Us</p>
                    <p className="mb-0" style={{ color: 'var(--stone)' }}>Mombasa Road, Nairobi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
