'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Car, Fuel, Calendar, DollarSign, Sliders, X, Check } from 'lucide-react';
import Link from 'next/link';

interface SearchFormData {
  make: string;
  model: string;
  priceRange: string;
  bodyType: string;
  fuelType: string;
  yearFrom: string;
  yearTo: string;
  location: string;
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
};

export default function FindYourPerfectCar() {
  const router = useRouter();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');
  const [formData, setFormData] = useState<SearchFormData>({
    make: 'all',
    model: 'all',
    priceRange: 'all',
    bodyType: 'all',
    fuelType: 'all',
    yearFrom: '',
    yearTo: '',
    location: 'all',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (formData.make !== 'all') params.set('make', formData.make);
    if (formData.model !== 'all') params.set('model', formData.model);
    if (formData.priceRange !== 'all') params.set('priceRange', formData.priceRange);
    if (formData.bodyType !== 'all') params.set('bodyType', formData.bodyType);
    if (formData.fuelType !== 'all') params.set('fuelType', formData.fuelType);
    if (formData.yearFrom) params.set('yearFrom', formData.yearFrom);
    if (formData.yearTo) params.set('yearTo', formData.yearTo);
    if (formData.location !== 'all') params.set('location', formData.location);

    router.push(`/inventory?${params.toString()}#inventory`);
  };

  const handleQuickSearch = () => {
    if (quickSearch.trim()) {
      router.push(`/inventory?search=${encodeURIComponent(quickSearch)}#inventory`);
    }
  };

  const clearFilters = () => {
    setFormData({
      make: 'all',
      model: 'all',
      priceRange: 'all',
      bodyType: 'all',
      fuelType: 'all',
      yearFrom: '',
      yearTo: '',
      location: 'all',
    });
    setQuickSearch('');
  };

  const popularSearches = [
    { make: 'toyota', label: 'Toyota Harrier', icon: '🚗' },
    { make: 'bmw', label: 'BMW X5', icon: '🚙' },
    { make: 'mercedes', label: 'Mercedes C-Class', icon: '🚘' },
    { make: 'nissan', label: 'Nissan Note', icon: '🚙' },
    { make: 'toyota', label: 'Toyota RAV4', icon: '🚗' },
  ];

  return (
    <section className="find-perfect-car-section">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h2 className="section-title">Find Your Perfect Car</h2>
          <p className="text-muted mt-2 fs-5">
            Browse our extensive inventory of quality vehicles
          </p>
        </div>

        {/* Main Search Section */}
        <div className="search-main-container">
          {/* Quick Search Bar */}
          <div className="quick-search-wrapper">
            <div className="quick-search-input">
              <Search className="search-icon" size={24} />
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                className="quick-search-field"
              />
              {quickSearch && (
                <button
                  onClick={() => setQuickSearch('')}
                  className="clear-search-btn"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              onClick={handleQuickSearch}
              className="btn-search-action"
            >
              Search
            </button>
          </div>

          {/* Toggle Advanced Filters */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-advanced-toggle"
          >
            <Sliders size={20} />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </button>
        </div>

        {/* Advanced Filters - Grid Layout */}
        {showAdvanced && (
          <form onSubmit={handleSubmit} className="advanced-filters-form">
            <div className="row g-3">
              {/* Make & Model */}
              <div className="col-md-6 col-lg-3">
                <label className="filter-label">
                  <Car size={16} className="label-icon" />
                  Make
                </label>
                <select
                  className="filter-select"
                  value={formData.make}
                  onChange={(e) => {
                    setFormData({ ...formData, make: e.target.value, model: 'all' });
                  }}
                >
                  <option value="all">All Makes</option>
                  <option value="toyota">Toyota</option>
                  <option value="honda">Honda</option>
                  <option value="nissan">Nissan</option>
                  <option value="bmw">BMW</option>
                  <option value="mercedes">Mercedes-Benz</option>
                  <option value="audi">Audi</option>
                  <option value="ford">Ford</option>
                  <option value="hyundai">Hyundai</option>
                  <option value="kia">Kia</option>
                  <option value="mazda">Mazda</option>
                  <option value="subaru">Subaru</option>
                  <option value="volkswagen">Volkswagen</option>
                  <option value="lexus">Lexus</option>
                  <option value="chevrolet">Chevrolet</option>
                  <option value="jeep">Jeep</option>
                  <option value="tesla">Tesla</option>
                </select>
              </div>

              <div className="col-md-6 col-lg-3">
                <label className="filter-label">
                  <Car size={16} className="label-icon" />
                  Model
                </label>
                <select
                  className="filter-select"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  disabled={formData.make === 'all'}
                >
                  <option value="all">All Models</option>
                  {formData.make !== 'all' && makeModels[formData.make]?.map((model) => (
                    <option key={model} value={model.toLowerCase()}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="col-md-6 col-lg-3">
                <label className="filter-label">
                  <DollarSign size={16} className="label-icon" />
                  Price Range (KSh)
                </label>
                <select
                  className="filter-select"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                >
                  <option value="all">Any Price</option>
                  <option value="0-3000000">Up to 3M</option>
                  <option value="3000000-6000000">3M - 6M</option>
                  <option value="6000000-9000000">6M - 9M</option>
                  <option value="9000000-12000000">9M - 12M</option>
                  <option value="12000000+">Over 12M</option>
                </select>
              </div>

              {/* Body Type */}
              <div className="col-md-6 col-lg-3">
                <label className="filter-label">
                  <Car size={16} className="label-icon" />
                  Body Type
                </label>
                <select
                  className="filter-select"
                  value={formData.bodyType}
                  onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
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

              {/* Fuel Type */}
              <div className="col-md-4 col-lg-2">
                <label className="filter-label">
                  <Fuel size={16} className="label-icon" />
                  Fuel Type
                </label>
                <select
                  className="filter-select"
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                >
                  <option value="all">Any Fuel</option>
                  <option value="gasoline">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              </div>

              {/* Year From */}
              <div className="col-md-4 col-lg-2">
                <label className="filter-label">
                  <Calendar size={16} className="label-icon" />
                  Year From
                </label>
                <select
                  className="filter-select"
                  value={formData.yearFrom}
                  onChange={(e) => setFormData({ ...formData, yearFrom: e.target.value })}
                >
                  <option value="">From</option>
                  {Array.from({ length: 30 }, (_, i) => {
                    const year = 2025 - i;
                    return <option key={year} value={year.toString()}>{year}</option>;
                  })}
                </select>
              </div>

              {/* Year To */}
              <div className="col-md-4 col-lg-2">
                <label className="filter-label">
                  <Calendar size={16} className="label-icon" />
                  Year To
                </label>
                <select
                  className="filter-select"
                  value={formData.yearTo}
                  onChange={(e) => setFormData({ ...formData, yearTo: e.target.value })}
                >
                  <option value="">To</option>
                  {Array.from({ length: 30 }, (_, i) => {
                    const year = 2025 - i;
                    return <option key={year} value={year.toString()}>{year}</option>;
                  })}
                </select>
              </div>

              {/* Location */}
              <div className="col-md-4 col-lg-2">
                <label className="filter-label">
                  <Car size={16} className="label-icon" />
                  Location
                </label>
                <select
                  className="filter-select"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="all">Any Location</option>
                  <option value="Nairobi Showroom">Nairobi Showroom</option>
                  <option value="Mombasa Road">Mombasa Road</option>
                  <option value="Westlands">Westlands</option>
                  <option value="Karen">Karen</option>
                  <option value="Industrial Area">Industrial Area</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="col-12 mt-4">
                <div className="filter-actions">
                  <button type="submit" className="btn-search-filters">
                    <Search size={20} />
                    Search Vehicles
                  </button>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="btn-clear-filters"
                  >
                    <X size={20} />
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Popular Searches */}
        <div className="popular-searches">
          <h4 className="popular-title">Popular Searches</h4>
          <div className="popular-tags">
            {popularSearches.map((search, index) => (
              <Link
                key={index}
                href={`/inventory?make=${search.make}#inventory`}
                className="popular-tag"
              >
                <span className="tag-emoji">{search.icon}</span>
                <span>{search.label}</span>
              </Link>
            ))}
            <Link
              href="/inventory#inventory"
              className="popular-tag popular-tag-all"
            >
              View All
              <Check size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
