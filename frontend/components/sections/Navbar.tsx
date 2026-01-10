'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <i className="fas fa-car me-2"></i>TrustAuto Kenya
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/inventory" className="nav-link">
                Browse Cars
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/services" className="nav-link">
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
            </li>
            <li className="nav-item ms-lg-3">
              <a href="tel:+254722000000" className="btn btn-primary">
                <i className="fas fa-phone me-2"></i>0722 000 000
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
