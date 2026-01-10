import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(2100),
  priceKES: z.number().int().min(0),
  mileage: z.number().int().min(0),
  bodyType: z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'WAGON']),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'HYBRID', 'ELECTRIC']),
  transmission: z.string().min(1, 'Transmission is required'),
  drivetrain: z.string().min(1, 'Drivetrain is required'),
  exteriorColor: z.string().min(1, 'Exterior color is required'),
  interiorColor: z.string().min(1, 'Interior color is required'),
  engine: z.string().min(1, 'Engine is required'),
  vin: z.string().min(1, 'VIN is required'),
  status: z.enum(['NEW', 'USED', 'CERTIFIED_PRE_OWNED', 'ON_SALE']).default('USED'),
  featured: z.boolean().default(false),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  imageUrl: z.string().url('Invalid image URL'),
});

export const vehicleFilterSchema = z.object({
  make: z.string().optional(),
  bodyType: z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'HATCHBACK', 'WAGON']).optional(),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'HYBRID', 'ELECTRIC']).optional(),
  priceMin: z.number().int().optional(),
  priceMax: z.number().int().optional(),
  sortBy: z.enum(['default', 'price-low', 'price-high', 'year-new', 'year-old', 'brand']).default('default'),
  featured: z.boolean().optional(),
});

export const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  vehicleId: z.string().uuid().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehicleFilter = z.infer<typeof vehicleFilterSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
