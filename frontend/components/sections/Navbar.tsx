'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Home, Car, Phone, Mail, User } from 'lucide-react';

export function FontAwesomeLink() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const targetPosition = (target as HTMLElement).offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`navbar fixed-top ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link href="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <i className="fas fa-car"></i>
            <span className="brand-text">TrustAuto</span>
          </div>
        </Link>

        <div className="navbar-right" ref={dropdownRef}>
          <button
            className="navbar-menu-trigger"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="menu-label">Menu</span>
          </button>

          <div className={`navbar-dropdown ${isOpen ? 'show' : ''}`}>
            <div className="dropdown-content">
              <div className="dropdown-section">
                <div className="dropdown-label">Navigation</div>
                <ul className="dropdown-links">
                  <li>
                    <Link href="/" className="dropdown-link">
                      <Home size={16} />
                      <span>Home</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/inventory" className="dropdown-link">
                      <Car size={16} />
                      <span>Browse Cars</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="dropdown-link">
                      <i className="fas fa-tools"></i>
                      <span>Services</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="dropdown-link">
                      <Mail size={16} />
                      <span>Contact</span>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="dropdown-section dropdown-actions">
                <a href="tel:+254722000000" className="dropdown-contact">
                  <Phone size={16} />
                  <div>
                    <span className="contact-label">Call Now</span>
                    <span className="contact-number">0722 000 000</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
