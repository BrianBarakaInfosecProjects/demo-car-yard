'use client';

import { useState } from 'react';

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
    <div style={{ background: 'var(--ink-soft)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              padding: '8px 12px', 
              fontSize: '11px', 
              fontWeight: 600, 
              whiteSpace: 'nowrap', 
              borderBottom: `2px solid ${activeTab === tab.id ? 'var(--gold)' : 'transparent'}`,
              color: activeTab === tab.id ? 'var(--gold)' : 'var(--stone)',
              background: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '-1px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            <div style={{ background: 'var(--ink)', borderRadius: '6px', padding: '8px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: '2px' }}>Engine</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>{vehicle.engine}</p>
            </div>
            <div style={{ background: 'var(--ink)', borderRadius: '6px', padding: '8px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: '2px' }}>Trans</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>{vehicle.transmission}</p>
            </div>
            <div style={{ background: 'var(--ink)', borderRadius: '6px', padding: '8px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: '2px' }}>Drive</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>{vehicle.drivetrain}</p>
            </div>
            <div style={{ background: 'var(--ink)', borderRadius: '6px', padding: '8px', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700, marginBottom: '2px' }}>Fuel</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff' }}>{vehicle.fuelType}</p>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '13px' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}><span style={{ color: 'var(--gold)' }}>✓</span> Power windows</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}><span style={{ color: 'var(--gold)' }}>✓</span> Power mirrors</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}><span style={{ color: 'var(--gold)' }}>✓</span> LED headlights</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}><span style={{ color: 'var(--gold)' }}>✓</span> Alloy wheels</li>
            </ul>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}><span style={{ color: 'var(--gold)' }}>✓</span> Air conditioning</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}><span style={{ color: 'var(--gold)' }}>✓</span> Bluetooth</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}><span style={{ color: 'var(--gold)' }}>✓</span> USB ports</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff' }}><span style={{ color: 'var(--gold)' }}>✓</span> ABS Brakes</li>
            </ul>
          </div>
        )}

        {activeTab === 'condition' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '10px' }}>
              <p style={{ fontWeight: 600, color: '#10b981' }}>Excellent Condition</p>
              <p style={{ color: '#ffffff', fontSize: '11px', marginTop: '2px' }}>Thoroughly inspected</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '11px' }}>
              <div style={{ background: 'var(--ink)', borderRadius: '4px', padding: '6px', color: '#ffffff' }}>Owners: 1</div>
              <div style={{ background: 'var(--ink)', borderRadius: '4px', padding: '6px', color: '#ffffff' }}>Title: Clean</div>
              <div style={{ background: 'var(--ink)', borderRadius: '4px', padding: '6px', color: '#ffffff' }}>Accidents: 0</div>
              <div style={{ background: 'var(--ink)', borderRadius: '4px', padding: '6px', color: '#ffffff' }}>Service: Done</div>
            </div>
          </div>
        )}

        {activeTab === 'seller' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div>
              <p style={{ fontWeight: 700, color: 'var(--gold)' }}>Sassy Auto Trading</p>
              <p style={{ color: '#ffffff', fontSize: '12px' }}>{vehicle.location || 'Nairobi, Kenya'}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px' }}>
              <a href="tel:+254722100200" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Call: +254 722 100 200</a>
            </div>
            <p style={{ fontSize: '11px', color: '#ffffff' }}>Mon-Fri: 8AM-6PM | Sat: 9AM-4PM</p>
          </div>
        )}
      </div>
    </div>
  );
}
