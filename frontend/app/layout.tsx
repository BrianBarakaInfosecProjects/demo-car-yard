import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import { FontAwesomeLink } from '@/components/sections/Navbar';

export const metadata: Metadata = {
  title: 'TrustAuto Kenya | Quality Used Cars - Buy, Sell, Trade-In',
  description: 'Quality used cars in Kenya. 12+ years experience, 500+ vehicles sold, transparent pricing, NTSA transfer assistance.',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <FontAwesomeLink />
      </head>
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <a
          href="https://wa.me/254722000000?text=Hello,%20I'm%20interested%20in%20your%20vehicles"
          className="whatsapp-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </body>
    </html>
  );
}
