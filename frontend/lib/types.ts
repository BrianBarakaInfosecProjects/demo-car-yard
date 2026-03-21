export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  priceKES: number;
  mileage: number;
  bodyType: 'SEDAN' | 'SUV' | 'TRUCK' | 'COUPE' | 'HATCHBACK' | 'WAGON';
  fuelType: 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC';
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  engine: string;
  vin: string;
  location?: string;
  status: 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED' | 'ON_SALE' | 'SOLD' | 'RESERVED';
  featured: boolean;
  description: string;
  imageUrl: string;
  images?: string[];
  imagePublicIds?: string[];
  viewCount?: number;
  isDraft?: boolean;
  scheduledAt?: string;
  publishedAt?: string;
  soldAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  vehicleId?: string;
  status: 'NEW' | 'PENDING' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

export interface VehicleFilter {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  featured?: boolean;
  status?: string;
}
