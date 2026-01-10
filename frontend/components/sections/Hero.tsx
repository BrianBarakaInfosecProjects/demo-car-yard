'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchFormData {
  make: string;
  priceRange: string;
  bodyType: string;
  fuelType: string;
}

export default function Hero() {
  const router = useRouter();
  const [formData, setFormData] = useState<SearchFormData>({
    make: 'all',
    priceRange: 'all',
    bodyType: 'all',
    fuelType: 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.make !== 'all') params.set('make', formData.make);
    if (formData.priceRange !== 'all') params.set('priceRange', formData.priceRange);
    if (formData.bodyType !== 'all') params.set('bodyType', formData.bodyType);
    if (formData.fuelType !== 'all') params.set('fuelType', formData.fuelType);

    router.push(`/inventory?${params.toString()}#inventory`);
  };

  return (
    <section id="home" className="hero-section">
      <div className="container hero-content">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <h1 className="hero-title">Quality Used Cars You Can Trust</h1>
            <p className="hero-subtitle">
              12+ Years Experience • 1000+ Happy Customers • NTSA Assistance
            </p>
            <div className="trust-badges">
              <span className="trust-badge">
                <i className="fas fa-check-circle"></i>
                500+ Vehicles Sold
              </span>
              <span className="trust-badge">
                <i className="fas fa-shield-alt"></i>
                All Paperwork Handled
              </span>
              <span className="trust-badge">
                <i className="fas fa-handshake"></i>
                Fair Pricing
              </span>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="search-box">
              <h3>
                <i className="fas fa-search me-2"></i>Find Your Perfect Car
              </h3>
              <form id="searchForm" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Make</label>
                    <select
                      className="form-select"
                      id="makeFilter"
                      value={formData.make}
                      onChange={(e) =>
                        setFormData({ ...formData, make: e.target.value })
                      }
                    >
                      <option value="all">Any Make</option>
                      <option value="toyota">Toyota</option>
                      <option value="ford">Ford</option>
                      <option value="honda">Honda</option>
                      <option value="bmw">BMW</option>
                      <option value="tesla">Tesla</option>
                      <option value="chevrolet">Chevrolet</option>
                      <option value="jeep">Jeep</option>
                      <option value="mazda">Mazda</option>
                      <option value="hyundai">Hyundai</option>
                      <option value="subaru">Subaru</option>
                      <option value="mercedes">Mercedes-Benz</option>
                      <option value="ram">Ram</option>
                      <option value="nissan">Nissan</option>
                      <option value="audi">Audi</option>
                      <option value="kia">Kia</option>
                      <option value="lexus">Lexus</option>
                      <option value="gmc">GMC</option>
                      <option value="volkswagen">Volkswagen</option>
                      <option value="porsche">Porsche</option>
                      <option value="genesis">Genesis</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price Range (KSh)</label>
                    <select
                      className="form-select"
                      id="priceFilter"
                      value={formData.priceRange}
                      onChange={(e) =>
                        setFormData({ ...formData, priceRange: e.target.value })
                      }
                    >
                      <option value="all">Any Price</option>
                      <option value="0-3000000">Up to 3M</option>
                      <option value="3000000-6000000">3M - 6M</option>
                      <option value="6000000-9000000">6M - 9M</option>
                      <option value="9000000-12000000">9M - 12M</option>
                      <option value="12000000+">Over 12M</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Body Type</label>
                    <select
                      className="form-select"
                      id="bodyTypeFilter"
                      value={formData.bodyType}
                      onChange={(e) =>
                        setFormData({ ...formData, bodyType: e.target.value })
                      }
                    >
                      <option value="all">Any Type</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="truck">Truck</option>
                      <option value="coupe">Coupe</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="wagon">Wagon</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Fuel Type</label>
                    <select
                      className="form-select"
                      id="fuelTypeFilter"
                      value={formData.fuelType}
                      onChange={(e) =>
                        setFormData({ ...formData, fuelType: e.target.value })
                      }
                    >
                      <option value="all">Any Fuel</option>
                      <option value="gasoline">Petrol</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary w-100 py-3">
                      <i className="fas fa-search me-2"></i>Search 24+ Vehicles
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
