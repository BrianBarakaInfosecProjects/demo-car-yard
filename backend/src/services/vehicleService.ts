import prisma from '../config/database';
import { VehicleInput, VehicleFilter } from '../utils/validators';

export const getVehicles = async (filters: VehicleFilter) => {
  const where: any = {
    isDraft: false,
  };

  if (filters.make) {
    where.make = { equals: filters.make, mode: 'insensitive' };
  }

  if (filters.bodyType) {
    where.bodyType = filters.bodyType;
  }

  if (filters.fuelType) {
    where.fuelType = filters.fuelType;
  }

  if (filters.priceMin) {
    where.priceKES = { ...where.priceKES, gte: filters.priceMin };
  }

  if (filters.priceMax) {
    where.priceKES = { ...where.priceKES, lte: filters.priceMax };
  }

  if (filters.featured !== undefined) {
    where.featured = filters.featured;
  }

  let orderBy: any = { createdAt: 'desc' };

  switch (filters.sortBy) {
    case 'price-low':
      orderBy = { priceKES: 'asc' };
      break;
    case 'price-high':
      orderBy = { priceKES: 'desc' };
      break;
    case 'year-new':
      orderBy = { year: 'desc' };
      break;
    case 'year-old':
      orderBy = { year: 'asc' };
      break;
    case 'brand':
      orderBy = { make: 'asc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy,
  });

  return vehicles;
};

export const getVehicleById = async (id: string) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  await prisma.vehicle.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  return vehicle;
};

export const createVehicle = async (input: VehicleInput) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { vin: input.vin },
  });

  if (existingVehicle) {
    throw new Error('Vehicle with this VIN already exists');
  }

  const vehicle = await prisma.vehicle.create({
    data: input,
  });

  return vehicle;
};

export const updateVehicle = async (id: string, input: Partial<VehicleInput>) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!existingVehicle) {
    throw new Error('Vehicle not found');
  }

  if (input.vin && input.vin !== existingVehicle.vin) {
    const duplicateVin = await prisma.vehicle.findUnique({
      where: { vin: input.vin },
    });

    if (duplicateVin) {
      throw new Error('Vehicle with this VIN already exists');
    }
  }

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: input,
  });

  return vehicle;
};

export const deleteVehicle = async (id: string) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!existingVehicle) {
    throw new Error('Vehicle not found');
  }

  await prisma.vehicle.delete({
    where: { id },
  });

  return { message: 'Vehicle deleted successfully' };
};

export const getFeaturedVehicles = async () => {
  const vehicles = await prisma.vehicle.findMany({
    where: { featured: true, isDraft: false },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return vehicles;
};
