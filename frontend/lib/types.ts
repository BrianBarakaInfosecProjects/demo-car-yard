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
  status: 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED' | 'ON_SALE';
  featured: boolean;
  description: string;
  imageUrl: string;
  images?: string[];
  imagePublicIds?: string[];
  viewCount?: number;
  isDraft?: boolean;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'ADMIN' | 'STAFF';
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
  vehicle?: {
    make: string;
    model: string;
    year: number;
    priceKES: number;
  };
  userId?: string;
  user?: {
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface VehicleFilter {
  make?: string;
  bodyType?: Vehicle['bodyType'];
  fuelType?: Vehicle['fuelType'];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'default' | 'price-low' | 'price-high' | 'year-new' | 'year-old' | 'brand';
  featured?: boolean;
}
