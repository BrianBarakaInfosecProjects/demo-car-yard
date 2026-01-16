'use client';

import { useState } from 'react';
import { Car, Settings, Shield, Droplets, Zap, Smartphone, Users } from 'lucide-react';

interface VehicleSpecsTabsProps {
  vehicle: {
    make: string;
    model: string;
    year: number;
    priceKES: number;
    mileage: number;
    bodyType: 'SEDAN' | 'SUV' | 'TRUCK' | 'COUPE' | 'HATCHBACK' | 'WAGON';
    fuelType: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
    transmission: string;
    drivetrain: string;
    exteriorColor: string;
    interiorColor: string;
    engine: string;
    vin: string;
    location?: string;
    description: string;
  };
}

export default function VehicleSpecsTabs({ vehicle }: VehicleSpecsTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features & Equipment' },
    { id: 'condition', label: 'Condition & History' },
    { id: 'seller', label: 'Seller Information' },
  ];

  return (
    <div className="vehicle-specs">
      <div className="specs-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`specs-tab ${activeTab === tab.id ? 'active' : ''}`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="specs-content">
        {activeTab === 'overview' && (
          <div className="specs-panel specs-overview">
            <div className="specs-group">
              <h3 className="specs-group-title">Engine & Performance</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <Car className="spec-icon" size={20} />
                  <span className="spec-label">Engine</span>
                  <span className="spec-value">{vehicle.engine}</span>
                </div>
                <div className="spec-item">
                  <Settings className="spec-icon" size={20} />
                  <span className="spec-label">Transmission</span>
                  <span className="spec-value">{vehicle.transmission}</span>
                </div>
                <div className="spec-item">
                  <Zap className="spec-icon" size={20} />
                  <span className="spec-label">Drivetrain</span>
                  <span className="spec-value">{vehicle.drivetrain}</span>
                </div>
              </div>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">Dimensions & Capacity</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <Users className="spec-icon" size={20} />
                  <span className="spec-label">Body Type</span>
                  <span className="spec-value">{vehicle.bodyType}</span>
                </div>
                <div className="spec-item">
                  <Droplets className="spec-icon" size={20} />
                  <span className="spec-label">Fuel Type</span>
                  <span className="spec-value">{vehicle.fuelType}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="specs-panel specs-features">
            <div className="specs-group">
              <h3 className="specs-group-title">Exterior Features</h3>
              <ul className="feature-list">
                <li>Power windows</li>
                <li>Power mirrors</li>
                <li>LED headlights</li>
                <li>Alloy wheels</li>
              </ul>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">Interior Features</h3>
              <ul className="feature-list">
                <li>Air conditioning</li>
                <li>Cruise control</li>
                <li>Bluetooth connectivity</li>
                <li>USB ports</li>
              </ul>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">Safety Features</h3>
              <ul className="feature-list">
                <li>Anti-lock brakes (ABS)</li>
                <li>Airbags</li>
                <li>Stability control</li>
                <li>Traction control</li>
              </ul>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">Technology</h3>
              <ul className="feature-list">
                <li>Touchscreen display</li>
                <li>Backup camera</li>
                <li>Navigation system</li>
                <li>Smartphone integration</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'condition' && (
          <div className="specs-panel specs-condition">
            <div className="specs-group">
              <h3 className="specs-group-title">Vehicle Condition</h3>
              <div className="condition-info">
                <Shield className="condition-icon" size={24} />
                <div className="condition-details">
                  <p className="condition-status">Excellent Condition</p>
                  <p className="condition-description">
                    This vehicle has been thoroughly inspected and is in excellent working condition.
                    All major systems are functioning properly.
                  </p>
                </div>
              </div>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">Service History</h3>
              <div className="service-history">
                <p>Regular maintenance performed at authorized service centers</p>
                <p>Oil changes every 5,000 km</p>
                <p>Tire rotations every 10,000 km</p>
              </div>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">Ownership</h3>
              <div className="ownership-info">
                <p><strong>Previous Owners:</strong> 1 owner</p>
                <p><strong>Title Status:</strong> Clean title</p>
                <p><strong>Accident History:</strong> No accidents reported</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'seller' && (
          <div className="specs-panel specs-seller">
            <div className="specs-group">
              <h3 className="specs-group-title">Dealer Information</h3>
              <div className="seller-info">
                <h4 className="seller-name">TrustAuto Kenya</h4>
                <p className="seller-location">
                  {vehicle.location || 'Nairobi, Kenya'}
                </p>
                <div className="seller-contact">
                  <a href="tel:+254700000000" className="contact-link">
                    +254 700 000 000
                  </a>
                  <a href="mailto:info@trustauto.co.ke" className="contact-link">
                    info@trustauto.co.ke
                  </a>
                </div>
              </div>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">Operating Hours</h3>
              <div className="operating-hours">
                <p><strong>Monday - Friday:</strong> 8:00 AM - 6:00 PM</p>
                <p><strong>Saturday:</strong> 9:00 AM - 4:00 PM</p>
                <p><strong>Sunday:</strong> Closed</p>
              </div>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">Why Buy From Us?</h3>
              <div className="why-buy">
                <ul className="why-buy-list">
                  <li>Certified pre-owned vehicles</li>
                  <li>Comprehensive inspection process</li>
                  <li>Flexible financing options</li>
                  <li>After-sales support</li>
                  <li>Warranty available</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
