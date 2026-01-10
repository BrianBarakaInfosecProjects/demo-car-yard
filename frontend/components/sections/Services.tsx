import Link from 'next/link';

export default function Services() {
  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Our Services</h2>
          <p className="text-muted mt-4 fs-5">
            Everything you need for a hassle-free car buying experience
          </p>
        </div>
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-car"></i>
              </div>
              <h4>Buy a Car</h4>
              <p>
                Browse verified inventory with transparent pricing and detailed
                information
              </p>
              <Link href="/inventory" className="btn btn-outline-primary">
                Browse Now
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <h4>Sell Your Car</h4>
              <p>
                Get fair market value and sell your car quickly with our expert
                assistance
              </p>
              <Link href="/contact" className="btn btn-outline-primary">
                Get Valuation
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-exchange-alt"></i>
              </div>
              <h4>Trade-In</h4>
              <p>Upgrade your vehicle with our convenient trade-in program</p>
              <Link href="/contact" className="btn btn-outline-primary">
                Trade Today
              </Link>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h4>NTSA Transfer</h4>
              <p>
                Complete paperwork and NTSA transfer assistance included
              </p>
              <Link href="/contact" className="btn btn-outline-primary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
