import prisma from '../config/database';
import { VehicleInput, VehicleFilter } from '../utils/validators';
import { notificationService } from './notificationService';
import { deleteMultipleFromCloudinary } from '../config/cloudinary';

const MAX_FEATURED_VEHICLES = 6;

function parseVehicleImages(vehicle: any) {
  return {
    ...vehicle,
    images: vehicle.images ? JSON.parse(vehicle.images) : [],
    imagePublicIds: vehicle.imagePublicIds || [],
  };
}

function generateSlug(make: string, model: string, year: number, colour?: string): string {
  const colourPart = colour ? `-${colour.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '';
  const baseSlug = `${year}-${make.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${model.toLowerCase().replace(/[^a-z0-9]/g, '-')}${colourPart}`
    .replace(/-+/g, '-')
    .trim();
  return baseSlug;
}

async function ensureUniqueSlug(make: string, model: string, year: number, colour?: string, maxAttempts: number = 100): Promise<string> {
  const baseSlug = generateSlug(make, model, year, colour);
  let slug = baseSlug;
  let counter = 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const existing = await prisma.vehicle.findFirst({
      where: { slug, deletedAt: null },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  throw new Error(`Failed to generate unique slug after ${maxAttempts} attempts for ${make} ${model} ${year}`);
}

// ==================== LIFECYCLE HELPERS ====================

export const lifecycle = {
  /**
   * Mark vehicle as sold
   * - Sets status to SOLD
   * - Removes from featured (if featured)
   * - Records soldAt timestamp
   * - Creates notification
   */
  markAsSold: async (id: string, userId: string) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id, deletedAt: null } });
    if (!vehicle) throw new Error('Vehicle not found');

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        status: 'SOLD',
        featured: false,
        soldAt: new Date(),
        updatedAt: new Date(),
      },
    });

    try {
      await notificationService.create({
        type: 'SUCCESS',
        message: `Vehicle marked as sold: ${vehicle.make} ${vehicle.model} (${vehicle.year})`,
        userId,
        action: 'VEHICLE_SOLD',
        entityType: 'VEHICLE',
        entityId: id,
        vehicleId: id,
      });
    } catch (e) { console.warn('Notification skipped in markAsSold', { error: (e as Error)?.message }); }

    return updated;
  },

  /**
   * Archive vehicle (soft delete)
   * - Sets deletedAt timestamp
   * - Does not remove from database
   * - Vehicle remains hidden but recoverable
   */
  archiveVehicle: async (id: string, userId: string) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new Error('Vehicle not found');

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        featured: false,
        updatedAt: new Date(),
      },
    });

    await notificationService.create({
      type: 'INFO',
      message: `Vehicle archived: ${vehicle.make} ${vehicle.model} (${vehicle.year})`,
      userId,
      action: 'VEHICLE_ARCHIVED',
      entityType: 'VEHICLE',
      entityId: id,
      vehicleId: id,
    });

    return updated;
  },

  /**
   * Restore archived vehicle
   * - Clears deletedAt timestamp
   * - Vehicle becomes visible again
   */
  restoreVehicle: async (id: string, userId: string) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new Error('Vehicle not found');

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
      },
    });

    await notificationService.create({
      type: 'SUCCESS',
      message: `Vehicle restored: ${vehicle.make} ${vehicle.model} (${vehicle.year})`,
      userId,
      action: 'VEHICLE_RESTORED',
      entityType: 'VEHICLE',
      entityId: id,
      vehicleId: id,
    });

    return updated;
  },

  /**
   * Permanently delete vehicle
   * - Removes from database
   * - Cleans up related records if needed
   */
  permanentDelete: async (id: string, userId: string) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new Error('Vehicle not found');

    const publicIds = vehicle.imagePublicIds || [];
    if (publicIds.length > 0) {
      try {
        await deleteMultipleFromCloudinary(publicIds);
      } catch (error) {
        console.error('Failed to delete images from Cloudinary:', error);
      }
    }

    // Delete the vehicle
    await prisma.vehicle.delete({
      where: { id },
    });

    await notificationService.create({
      type: 'ERROR',
      message: `Vehicle permanently deleted: ${vehicle.make} ${vehicle.model} (${vehicle.year})`,
      userId,
      action: 'VEHICLE_DELETED',
      entityType: 'VEHICLE',
      entityId: id,
      vehicleId: id,
    });

    return vehicle;
  },

  /**
   * Toggle featured status
   * - If featured: unfeature
   * - If not featured: feature
   * - Checks max featured count
   */
  toggleFeatured: async (id: string, userId: string) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id, deletedAt: null } });
    if (!vehicle) throw new Error('Vehicle not found');

    const newFeaturedStatus = !vehicle.featured;

    // Enforce max featured limit
    if (newFeaturedStatus) {
      const featuredCount = await prisma.vehicle.count({
        where: {
          featured: true,
          deletedAt: null,
        },
      });

      if (featuredCount >= MAX_FEATURED_VEHICLES) {
        throw new Error(`Maximum of ${MAX_FEATURED_VEHICLES} featured vehicles reached. Unfeature another vehicle first.`);
      }
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        featured: newFeaturedStatus,
        updatedAt: new Date(),
      },
    });

    try {
      await notificationService.create({
        type: newFeaturedStatus ? 'SUCCESS' : 'INFO',
        message: `Vehicle ${newFeaturedStatus ? 'featured' : 'unfeatured'}: ${vehicle.make} ${vehicle.model}`,
        userId,
        action: 'FEATURED_TOGGLED',
        entityType: 'VEHICLE',
        entityId: id,
        vehicleId: id,
      });
    } catch (e) {
      console.warn('Notification skipped in toggleFeatured');
    }

    return updated;
  },

  /**
   * Update vehicle status
   * - Handles all lifecycle status changes
   * - Automatically unfeatures sold vehicles
   */
  updateStatus: async (id: string, status: string, userId: string) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id, deletedAt: null } });
    if (!vehicle) throw new Error('Vehicle not found');

    // If marking as sold, automatically unfeature
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'SOLD') {
      updateData.featured = false;
      updateData.soldAt = new Date();
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: updateData,
    });

    try {
      await notificationService.create({
        type: status === 'SOLD' ? 'SUCCESS' : 'INFO',
        message: `Vehicle status updated to ${status}: ${vehicle.make} ${vehicle.model}`,
        userId,
        action: 'STATUS_UPDATED',
        entityType: 'VEHICLE',
        entityId: id,
        vehicleId: id,
      });
    } catch (e) {
      console.warn('Notification skipped in toggleFeatured');
    }

    return updated;
  },
};

export const getVehicles = async (filters: VehicleFilter & { page?: number; limit?: number; includeDrafts?: boolean; includeDeleted?: boolean }) => {
  const conditions: any = [];

  // Filter out deleted vehicles by default
  if (!filters.includeDeleted) {
    conditions.push({ deletedAt: null });
  }

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
    vehicles: vehicles.map(parseVehicleImages),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getVehicleById = async (id: string, options?: { trackView?: boolean }) => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id, deletedAt: null },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // Only increment view count when explicitly tracking a public view
  // Not during admin operations or internal calls
  let viewCount = vehicle.viewCount || 0;
  if (options?.trackView) {
    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
    });
    viewCount = updated.viewCount;
  }

  return { ...parseVehicleImages(vehicle), viewCount };
};

export const getVehicleBySlug = async (slug: string) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { slug, deletedAt: null },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  const updated = await prisma.vehicle.update({
    where: { id: vehicle.id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });

  return { ...parseVehicleImages(vehicle), viewCount: updated.viewCount };
};

export const getSimilarVehicles = async (vehicleId: string, limit: number = 3) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id: vehicleId, deletedAt: null },
  });

  if (!vehicle) {
    return [];
  }

  const availableStatus = ['AVAILABLE', 'available'];
  
  // Priority 1: Same make + model
  const sameMakeModel = await prisma.vehicle.findMany({
    where: {
      id: { not: vehicleId },
      deletedAt: null,
      isDraft: false,
      status: { in: availableStatus },
      make: vehicle.make,
      model: vehicle.model,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  if (sameMakeModel.length >= limit) {
    return sameMakeModel.map(parseVehicleImages);
  }

  // Priority 2: Same make + body type + price ±30%
  const priceRange30 = {
    gte: Math.floor(vehicle.priceKES * 0.7),
    lte: Math.ceil(vehicle.priceKES * 1.3),
  };

  const sameMakeBodyType = await prisma.vehicle.findMany({
    where: {
      id: { not: vehicleId },
      deletedAt: null,
      isDraft: false,
      status: { in: availableStatus },
      make: vehicle.make,
      bodyType: vehicle.bodyType,
      priceKES: priceRange30,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });


  // Priority 3 & 4: Parallel queries for same body type and any available
  const priceRange20 = {
    gte: Math.floor(vehicle.priceKES * 0.8),
    lte: Math.ceil(vehicle.priceKES * 1.2),
  };

  const [sameBodyType, anyAvailable] = await Promise.all([
    prisma.vehicle.findMany({
      where: {
        id: { not: vehicleId },
        deletedAt: null,
        isDraft: false,
        status: { in: availableStatus },
        bodyType: vehicle.bodyType,
        priceKES: priceRange20,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
    prisma.vehicle.findMany({
      where: {
        id: { not: vehicleId },
        deletedAt: null,
        isDraft: false,
        status: { in: availableStatus },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
  ]);

  const result = [...sameMakeModel];
  const seen = new Set(result.map(v => v.id));

  for (const v of [...sameMakeBodyType, ...sameBodyType, ...anyAvailable]) {
    if (result.length >= limit) break;
    if (!seen.has(v.id)) {
      result.push(v);
      seen.add(v.id);
    }
  }

  return result.map(parseVehicleImages);
};

export const createVehicle = async (input: VehicleInput, userId: string) => {
  const slug = await ensureUniqueSlug(input.make, input.model, input.year, input.exteriorColor);

  const { scheduledAt, images, imagePublicIds, ...inputWithoutScheduledAt } = input;

  const vehicle = await prisma.vehicle.create({
    data: {
      ...inputWithoutScheduledAt,
      slug,
      images: images ? JSON.stringify(images) : '[]',
      imagePublicIds: imagePublicIds || [],
      isDraft: input.isDraft ?? true,
      featured: false,
      scheduledAt: scheduledAt || null,
    },
  });

  await notificationService.create({
    type: 'SUCCESS',
    message: `Vehicle created: ${vehicle.make} ${vehicle.model} (${vehicle.year})`,
    userId,
    action: 'VEHICLE_CREATED',
    entityType: 'VEHICLE',
    entityId: vehicle.id,
    vehicleId: vehicle.id,
  });

  return vehicle;
};

export const updateVehicle = async (id: string, input: Partial<VehicleInput>, userId: string) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!existingVehicle) {
    throw new Error('Vehicle not found');
  }

  const { scheduledAt, images, imagePublicIds, ...inputWithoutScheduledAt } = input;
  const updateData: any = {
    ...inputWithoutScheduledAt,
    scheduledAt: scheduledAt || null,
  };

  if (images !== undefined) {
    updateData.images = images ? JSON.stringify(images) : '[]';
  }
  if (imagePublicIds !== undefined) {
    updateData.imagePublicIds = imagePublicIds || [];
  }

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: updateData,
  });

  // Only create notification if userId is valid
  if (userId && userId !== 'admin-user-id') {
    try {
      await notificationService.create({
        type: 'INFO',
        message: `Vehicle updated: ${vehicle.make} ${vehicle.model} (${vehicle.year})`,
        userId,
        action: 'VEHICLE_UPDATED',
        entityType: 'VEHICLE',
        entityId: id,
        vehicleId: id,
      });
    } catch (e) {
      console.debug('Notification skipped:', e);
    }
  }

  return vehicle;
};

export const deleteVehicle = async (id: string, userId: string) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id },
  });

  if (!existingVehicle) {
    throw new Error('Vehicle not found');
  }

  // Soft delete by setting deletedAt
  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      featured: false,
      updatedAt: new Date(),
    },
  });

  await notificationService.create({
    type: 'INFO',
    message: `Vehicle deleted: ${vehicle.make} ${vehicle.model} (${vehicle.year})`,
    userId,
    action: 'VEHICLE_DELETED',
    entityType: 'VEHICLE',
    entityId: id,
    vehicleId: id,
  });

  return { message: 'Vehicle deleted successfully' };
};

export const getFeaturedVehicles = async () => {
  const vehicles = await prisma.vehicle.findMany({
    where: { featured: true, isDraft: false, deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return vehicles;
};

export const getVehicleSuggestions = async (search: string) => {
  const vehicles = await prisma.vehicle.findMany({
    where: {
      isDraft: false,
      deletedAt: null,
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

export const getArchivedVehicles = async () => {
  const vehicles = await prisma.vehicle.findMany({
    where: { deletedAt: { not: null } },
    orderBy: { deletedAt: 'desc' },
    take: 100,
  });

  return vehicles;
};
