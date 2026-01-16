'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/inventory?search=${encodeURIComponent(searchQuery)}#inventory`);
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container hero-content">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <h1 className="hero-title">Find Your Perfect Used Car</h1>
            <p className="hero-subtitle">
              Quality Vehicles • Transparent Pricing • NTSA Support Included
            </p>
            <div className="hero-cta mt-4">
              <Link
                href="/inventory#inventory"
                className="btn-cta-browse"
              >
                <Car size={20} />
                <span>Browse Full Inventory</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="search-box-compact">
              <h3>
                <Search className="search-icon-compact" size={18} />
                Quick Search
              </h3>
              <form id="searchForm" onSubmit={handleSubmit}>
                <div className="search-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by make, model, or year..."
                    className="search-input-compact"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn-search-compact" aria-label="Search">
                    <Search size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
