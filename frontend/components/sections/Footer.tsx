import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4">
            <h4>
              <i className="fas fa-car me-2"></i>TrustAuto Kenya
            </h4>
            <p className="mt-3">
              Your trusted partner for quality used cars in Kenya. Over 12 years of
              serving customers with transparent pricing and excellent service.
            </p>
            <div className="footer-social mt-4">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://wa.me/254722000000"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2">
                <Link href="/">Home</Link>
              </li>
              <li className="mb-2">
                <Link href="/inventory">Browse Cars</Link>
              </li>
              <li className="mb-2">
                <Link href="/services">Services</Link>
              </li>
              <li className="mb-2">
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5>Contact Us</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2">
                <i className="fas fa-map-marker-alt me-2"></i>
                Mombasa Road, Nairobi
              </li>
              <li className="mb-2">
                <i className="fas fa-phone me-2"></i>
                <a href="tel:+254722000000">0722 000 000</a>
              </li>
              <li className="mb-2">
                <i className="fas fa-envelope me-2"></i>
                <a href="mailto:info@trustauto.co.ke">info@trustauto.co.ke</a>
              </li>
              <li className="mb-2">
                <i className="fab fa-whatsapp me-2"></i>
                <a href="https://wa.me/254722000000">WhatsApp Us</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 mb-4">
            <h5>Business Hours</h5>
            <ul className="list-unstyled mt-3">
              <li className="mb-2">
                <i className="far fa-clock me-2"></i>Mon - Fri: 8:00 AM - 6:00
                PM
              </li>
              <li className="mb-2">
                <i className="far fa-clock me-2"></i>Saturday: 9:00 AM - 4:00 PM
              </li>
              <li className="mb-2">
                <i className="far fa-clock me-2"></i>Sunday: 10:00 AM - 2:00 PM
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} TrustAuto Kenya. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="#" className="me-3">
              Privacy Policy
            </a>
            <a href="#" className="me-3">
              Terms of Service
            </a>
            <a href="#">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
