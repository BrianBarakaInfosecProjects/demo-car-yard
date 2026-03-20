import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import CarDetailClient from './CarDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reserve?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const vehicle = await api.get(`/vehicles/slug/${slug}`);
    
    if (!vehicle) {
      return {
        title: 'Vehicle Not Found | Sassy Auto Trading',
      };
    }

    const isSold = vehicle.status?.toUpperCase() === 'SOLD';
    const price = vehicle.priceKES ? `KES ${vehicle.priceKES.toLocaleString()}` : 'Contact for Price';
    
    const title = isSold 
      ? `SOLD — ${vehicle.year} ${vehicle.make} ${vehicle.model} | Meru Kenya | Sassy Auto Trading`
      : `${vehicle.year} ${vehicle.make} ${vehicle.model} For Sale — Meru Kenya | KES ${price}`;
    
    const description = `${vehicle.year} ${vehicle.make} ${vehicle.model} in ${vehicle.colour || 'Silver'}. KES ${price}. ${vehicle.mileage ? vehicle.mileage.toLocaleString() + ' km' : ''}. Sassy Auto Trading Meru Kenya. Call or WhatsApp for details.`;

    const imageUrl = vehicle.imageUrl 
      ? vehicle.imageUrl.replace('/upload/', '/upload/w_1200,h_630,c_fill/')
      : 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Vehicle Not Found | Sassy Auto Trading',
    };
  }
}

export default async function CarDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { reserve } = await searchParams;
  
  return <CarDetailClient slug={slug} autoOpenReserve={reserve === 'true'} />;
}
