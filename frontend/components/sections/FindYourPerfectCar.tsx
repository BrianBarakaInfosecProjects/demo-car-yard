'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  kia: ['Sportage', 'Sorento', 'Seltos', 'Ceed', 'Rio'],
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
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
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
    if (searchQuery.trim()) {
      router.push(`/inventory?search=${encodeURIComponent(searchQuery)}#inventory`);
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
    setSearchQuery('');
  };

  return (
    <section className="find-perfect-car-section">
      <div className="container">
        <div className="compact-search-bar">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-input-icon"></i>
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickSearch()}
                className="search-input-field"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            <div className="filter-dropdowns">
              <select
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value, model: 'all' })}
                className="filter-dropdown"
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

              <select
                value={formData.priceRange}
                onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                className="filter-dropdown"
              >
                <option value="all">Any Price</option>
                <option value="0-3000000">Under 3M</option>
                <option value="3000000-6000000">3M - 6M</option>
                <option value="6000000-9000000">6M - 9M</option>
                <option value="9000000-12000000">9M - 12M</option>
                <option value="12000000+">Over 12M</option>
              </select>

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="advanced-filter-toggle"
              >
                <i className="fas fa-sliders"></i>
                <span>Filters</span>
                <i className={`fas fa-chevron-down toggle-icon ${showAdvanced ? 'open' : ''}`}></i>
              </button>

              <button
                type="submit"
                className="search-submit-btn"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>

          {showAdvanced && (
            <div className="compact-filters">
              <div className="filters-row">
                <select
                  value={formData.bodyType}
                  onChange={(e) => setFormData({ ...formData, bodyType: e.target.value })}
                  className="compact-filter-select"
                >
                  <option value="all">Body Type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="coupe">Coupe</option>
                  <option value="hatchback">Hatchback</option>
                  <option value="wagon">Wagon</option>
                </select>

                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="compact-filter-select"
                >
                  <option value="all">Fuel Type</option>
                  <option value="gasoline">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-filters-compact"
                >
                  <i className="fas fa-times"></i>
                  <span>Clear</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
