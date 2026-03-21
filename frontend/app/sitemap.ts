import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://trustauto.co.ke';
  
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/inventory`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.7 },
  ];

  let vehicleUrls: MetadataRoute.Sitemap = [];

  try {
    const data = await api.get('/vehicles', { limit: 500 });
    const vehicles = Array.isArray(data) ? data : data.vehicles || [];

    vehicleUrls = vehicles.map((vehicle: any) => ({
      url: `${baseUrl}/cars/${vehicle.slug}`,
      lastModified: vehicle.updatedAt ? new Date(vehicle.updatedAt) : new Date(),
      priority: 0.8,
    }));

    // Make landing pages
    const makes: string[] = [...new Set(vehicles.map((v: any) => v.make).filter(Boolean))] as string[];
    const makeUrls: MetadataRoute.Sitemap = makes.map((make: string) => ({
      url: `${baseUrl}/cars/make/${make.toLowerCase()}`,
      lastModified: new Date(),
      priority: 0.6,
    }));

    // Budget landing pages
    const budgetUrls: MetadataRoute.Sitemap = [
      { url: `${baseUrl}/cars/budget/under-1m`, lastModified: new Date(), priority: 0.6 },
      { url: `${baseUrl}/cars/budget/under-2m`, lastModified: new Date(), priority: 0.6 },
      { url: `${baseUrl}/cars/budget/under-3m`, lastModified: new Date(), priority: 0.6 },
      { url: `${baseUrl}/cars/budget/under-5m`, lastModified: new Date(), priority: 0.6 },
      { url: `${baseUrl}/cars/budget/under-10m`, lastModified: new Date(), priority: 0.6 },
    ];

    return [...staticPages, ...vehicleUrls, ...makeUrls, ...budgetUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
