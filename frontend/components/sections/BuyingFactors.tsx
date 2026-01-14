'use client';

import { Gauge, Wrench, FileText, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

interface Factor {
  icon: React.ReactNode;
  title: string;
  description: string;
  tips: string[];
  importance: 'high' | 'medium';
}

const factors: Factor[] = [
  {
    icon: <Gauge size={32} className="text-blue-600" />,
    title: 'Mileage',
    description: 'Lower mileage often means better longevity and less wear on engine components.',
    tips: [
      'Check mileage vs age - average is 12,000-15,000 km/year',
      'Low mileage (<60,000 km) is ideal for used cars',
      'High mileage (>150,000 km) requires more maintenance',
      'Service history is more important than low mileage',
    ],
    importance: 'high',
  },
  {
    icon: <Wrench size={32} className="text-green-600" />,
    title: 'Engine Condition',
    description: 'Ensure the engine runs smoothly without major repairs or unusual noises.',
    tips: [
      'Listen for unusual noises during cold start and acceleration',
      'Check for smoke from exhaust (blue, black, or white)',
      'Look for oil leaks or fluid spots under the car',
      'Test drive to check acceleration and smooth operation',
    ],
    importance: 'high',
  },
  {
    icon: <FileText size={32} className="text-orange-600" />,
    title: 'Vehicle History',
    description: 'Check the accident and service records for complete transparency.',
    tips: [
      'Request NTSA logbook for ownership history',
      'Check for previous accidents or major repairs',
      'Verify mileage authenticity with service records',
      'Ask for inspection reports if available',
    ],
    importance: 'high',
  },
  {
    icon: <MapPin size={32} className="text-purple-600" />,
    title: 'Location & Inspection',
    description: 'We offer pre-purchase inspections and transparent location-based service.',
    tips: [
      'Schedule a test drive at our Nairobi showroom',
      'Request independent mechanic inspection',
      'NTSA inspection can be arranged on request',
      'Compare with similar vehicles in the market',
    ],
    importance: 'medium',
  },
];

export default function BuyingFactors() {
  return (
    <section id="buying-factors" className="buying-factors-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Important Factors When Buying a Used Car</h2>
          <p className="text-muted mt-4 fs-5">
            Before purchasing a used car, it's essential to evaluate several factors.
            We offer pre-purchase inspections, financing options, and warranties.
          </p>
        </div>

        <div className="row g-4">
          {factors.map((factor, index) => (
            <div key={index} className="col-lg-3 col-md-6">
              <div className="factor-card">
                <div className="factor-icon-wrapper">
                  {factor.icon}
                  <span className={`importance-badge importance-${factor.importance}`}>
                    {factor.importance === 'high' ? (
                      <><AlertTriangle size={14} className="me-1" />Critical</>
                    ) : (
                      <><CheckCircle size={14} className="me-1" />Important</>
                    )}
                  </span>
                </div>
                <h4 className="factor-title">{factor.title}</h4>
                <p className="factor-description">{factor.description}</p>
                <ul className="factor-tips">
                  {factor.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>
                      <i className="fas fa-check-circle text-success me-2"></i>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <div className="info-box">
            <h5 className="mb-3">
              <i className="fas fa-shield-alt text-primary me-2"></i>
              TrustAuto Kenya Promise
            </h5>
            <p className="mb-0">
              All our vehicles undergo thorough inspection, come with complete documentation,
              and include NTSA transfer assistance. We provide transparent pricing and
              stand behind every vehicle we sell.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
