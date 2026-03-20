'use client';

import { useEffect, useState } from 'react';

export default function WhatsAppFloat() {
  const [dealerPhone, setDealerPhone] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings/public`)
      .then(res => res.json())
      .then(data => {
        if (data.dealerPhone) {
          const phone = data.dealerPhone.replace(/^0/, '');
          setDealerPhone(phone);
          localStorage.setItem('dealerPhone', data.dealerPhone);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('dealerPhone');
        if (saved) setDealerPhone(saved.replace(/^0/, ''));
      });
  }, []);

  if (!dealerPhone) return null;

  const waLink = `https://wa.me/254${dealerPhone}?text=Hello,%20I'm%20interested%20in%20your%20vehicles`;

  return (
    <a
      href={waLink}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
    </a>
  );
}
