import prisma from '../config/database';
import { VehicleInput, VehicleFilter } from '../utils/validators';

function generateSlug(make: string, model: string, year: number): string {
  const baseSlug = `${year}-${make.toLowerCase()}-${model.toLowerCase()}`
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .trim();
  return baseSlug;
}

async function ensureUniqueSlug(make: string, model: string, year: number, maxAttempts: number = 100): Promise<string> {
  const baseSlug = generateSlug(make, model, year);
  let slug = baseSlug;
  let counter = 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const existing = await prisma.vehicle.findFirst({
      where: { slug },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  throw new Error(`Failed to generate unique slug after ${maxAttempts} attempts for ${make} ${model} ${year}`);
}

export const getVehicles = async (filters: VehicleFilter & { page?: number; limit?: number; includeDrafts?: boolean }) => {
  const conditions: any = [];

  if (!filters.includeDrafts) {
    conditions.push({ isDraft: false });
  }

  if (filters.search) {
    conditions.push({
      OR: [
        { make: { contains: filters.search, mode: 'insensitive' } },
        { model: { contains: filters.search, mode: 'insensitive' } },
      ],
    });
  }

  if (filters.make) {
    conditions.push({ make: { equals: filters.make, mode: 'insensitive' } });
  }

  if (filters.bodyType) {
    conditions.push({ bodyType: filters.bodyType });
  }

  if (filters.fuelType) {
    conditions.push({ fuelType: filters.fuelType });
  }

  if (filters.priceMin) {
    conditions.push({ priceKES: { gte: filters.priceMin } });
  }

  if (filters.priceMax) {
    conditions.push({ priceKES: { lte: filters.priceMax } });
  }

  if (filters.featured !== undefined) {
    conditions.push({ featured: filters.featured });
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

  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        AND: conditions,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.vehicle.count({
      where: {
        AND: conditions,
      },
    }),
  ]);

  return {
    vehicles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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

export const getVehicleBySlug = async (slug: string) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { slug },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  await prisma.vehicle.update({
    where: { id: vehicle.id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  return vehicle;
};

export const getSimilarVehicles = async (vehicleId: string, limit: number = 4) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    return [];
  }

  const similar = await prisma.vehicle.findMany({
    where: {
      id: { not: vehicleId },
      isDraft: false,
      OR: [
        { make: vehicle.make },
        { bodyType: vehicle.bodyType },
        {
          priceKES: {
            gte: Math.floor(vehicle.priceKES * 0.8),
            lte: Math.ceil(vehicle.priceKES * 1.2),
          },
        },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return similar;
};

export const createVehicle = async (input: VehicleInput) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { vin: input.vin },
  });

  if (existingVehicle) {
    throw new Error('Vehicle with this VIN already exists');
  }

  const slug = await ensureUniqueSlug(input.make, input.model, input.year);

  const vehicle = await prisma.vehicle.create({
    data: {
      ...input,
      slug,
      isDraft: input.isDraft ?? true,
    },
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

export const getVehicleSuggestions = async (search: string) => {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      isDraft: false,
      OR: [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      make: true,
      model: true,
      year: true,
      priceKES: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return vehicles;
};
