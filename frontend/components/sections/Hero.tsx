'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SearchFormData {
  make: string;
  model: string;
  priceRange: string;
  bodyType: string;
  fuelType: string;
}

const makeModels: Record<string, string[]> = {
  all: [],
  toyota: ['Corolla', 'Harrier', 'Land Cruiser', 'RAV4', 'Hilux', 'Prado', 'Vitz'],
  honda: ['Civic', 'Fit', 'CR-V', 'Accord', 'Vezel', 'HR-V'],
  nissan: ['Note', 'X-Trail', 'Juke', 'Frontier', 'Qashqai', 'Altima'],
  bmw: ['X5', '3 Series', '5 Series', 'X3', 'M5', 'M3'],
  mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class'],
  audi: ['A4', 'A6', 'Q5', 'Q7', 'S3'],
  ford: ['Ranger', 'Explorer', 'F-150', 'Escape', 'Mustang'],
  hyundai: ['Tucson', 'Santa Fe', 'Elantra', 'Sonata', 'Creta'],
  kia: ['Sportage', 'Sorento', 'Seltos', 'Cerato', 'Rio'],
  mazda: ['CX-5', 'CX-9', 'Mazda3', 'Mazda6', 'BT-50'],
  subaru: ['Forester', 'Outback', 'XV', 'Impreza', 'Legacy'],
  volkswagen: ['Tiguan', 'Golf', 'Passat', 'Touareg', 'Atlas'],
  lexus: ['RX', 'NX', 'ES', 'GX', 'LX'],
  porsche: ['Cayenne', 'Macan', '911', 'Panamera'],
  chevrolet: ['Equinox', 'Traverse', 'Silverado', 'Camaro'],
  jeep: ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass'],
  tesla: ['Model 3', 'Model Y', 'Model S', 'Model X'],
  ram: ['1500', '2500', '3500'],
  gmc: ['Sierra', 'Acadia', 'Terrain', 'Yukon'],
  genesis: ['G70', 'G80', 'G90', 'GV70', 'GV80'],
};

export default function Hero() {
  const router = useRouter();
  const [formData, setFormData] = useState<SearchFormData>({
    make: 'all',
    model: 'all',
    priceRange: 'all',
    bodyType: 'all',
    fuelType: 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formData.make !== 'all') params.set('make', formData.make);
    if (formData.model !== 'all') params.set('model', formData.model);
    if (formData.priceRange !== 'all') params.set('priceRange', formData.priceRange);
    if (formData.bodyType !== 'all') params.set('bodyType', formData.bodyType);
    if (formData.fuelType !== 'all') params.set('fuelType', formData.fuelType);

    router.push(`/inventory?${params.toString()}#inventory`);
  };

  const handleMakeChange = (make: string) => {
    setFormData({ ...formData, make, model: 'all' });
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
            <div className="search-box">
              <h3>
                <i className="fas fa-search me-2"></i>Quick Search
              </h3>
              <form id="searchForm" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Make</label>
                    <select
                      className="form-select"
                      id="makeFilter"
                      value={formData.make}
                      onChange={(e) => handleMakeChange(e.target.value)}
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
                    <label className="form-label">Model</label>
                    <select
                      className="form-select"
                      id="modelFilter"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      disabled={formData.make === 'all'}
                    >
                      <option value="all">Any Model</option>
                      {formData.make !== 'all' && makeModels[formData.make]?.map((model) => (
                        <option key={model} value={model.toLowerCase()}>
                          {model}
                        </option>
                      ))}
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
                    <button type="submit" className="btn btn-primary w-100 py-3 btn-gradient">
                      <i className="fas fa-search me-2"></i>Find Your Perfect Car
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
