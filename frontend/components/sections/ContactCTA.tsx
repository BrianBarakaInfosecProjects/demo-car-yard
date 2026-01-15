import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

export default function ContactCTA() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="row">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <h2 className="section-title text-white mb-4">Ready to Find Your Perfect Car?</h2>
            <p className="text-white opacity-90 mb-5 fs-5">
              Contact our team today for personalized assistance and transparent pricing. We're here to help you find the vehicle that fits your needs and budget.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link
                href="/contact"
                className="btn btn-lg px-5 py-3 bg-white text-primary hover:bg-gray-100 transition-all"
              >
                <Phone size={20} className="me-2" />
                Contact Us
              </Link>
              <Link
                href="/inventory"
                className="btn btn-lg px-5 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all"
              >
                Browse Inventory <ArrowRight size={20} className="ms-2" />
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-5">
              <h3 className="text-white mb-4 fw-bold">Get in Touch</h3>
              <div className="space-y-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-center bg-white bg-opacity-20 rounded-circle" style={{ width: '50px', height: '50px' }}>
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white mb-0 fw-semibold">Call Us</p>
                    <p className="text-white opacity-80 mb-0">+254 700 000 000</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-center bg-white bg-opacity-20 rounded-circle" style={{ width: '50px', height: '50px' }}>
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white mb-0 fw-semibold">Email Us</p>
                    <p className="text-white opacity-80 mb-0">info@trustauto.co.ke</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center justify-center bg-white bg-opacity-20 rounded-circle" style={{ width: '50px', height: '50px' }}>
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white mb-0 fw-semibold">Visit Us</p>
                    <p className="text-white opacity-80 mb-0">Nairobi, Kenya</p>
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
