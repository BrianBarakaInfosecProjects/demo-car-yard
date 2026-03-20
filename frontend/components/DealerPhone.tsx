'use client';

import { useEffect, useState } from 'react';

interface DealerPhoneProps {
  className?: string;
}

export default function DealerPhone({ className = '' }: DealerPhoneProps) {
  const [dealerPhone, setDealerPhone] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings/public`)
      .then(res => res.json())
      .then(data => {
        if (data.dealerPhone) {
          setDealerPhone(data.dealerPhone);
          localStorage.setItem('dealerPhone', data.dealerPhone);
        }
      })
      .catch(() => {
        const saved = localStorage.getItem('dealerPhone');
        if (saved) setDealerPhone(saved);
      });
  }, []);

  if (!dealerPhone) return null;

  const formattedPhone = `+254 ${dealerPhone.replace(/^0/, '')}`;
  const telLink = `tel:+254${dealerPhone.replace(/^0/, '')}`;

  return (
    <a href={telLink} className={className}>
      {formattedPhone}
    </a>
  );
}
