import prisma from '../config/database';

export const bulkDeleteVehicles = async (ids: string[]) => {
  const vehicles = await prisma.vehicle.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      imagePublicIds: true,
    },
  });

  const { deleteMultipleFromCloudinary } = await import('../config/cloudinary');
  
  for (const vehicle of vehicles) {
    if (vehicle.imagePublicIds && vehicle.imagePublicIds.length > 0) {
      await deleteMultipleFromCloudinary(vehicle.imagePublicIds);
    }
  }

  await prisma.vehicle.deleteMany({
    where: { id: { in: ids } },
  });

  return { message: `Deleted ${vehicles.length} vehicles` };
};

export const bulkUpdateVehicleStatus = async (ids: string[], status: any) => {
  const result = await prisma.vehicle.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });

  return { message: `Updated ${result.count} vehicles to ${status}` };
};

export const bulkUpdateVehicleLocation = async (ids: string[], location: string) => {
  const result = await prisma.vehicle.updateMany({
    where: { id: { in: ids } },
    data: { location },
  });

  return { message: `Updated ${result.count} vehicles location` };
};

export const bulkSetFeatured = async (ids: string[], featured: boolean) => {
  const result = await prisma.vehicle.updateMany({
    where: { id: { in: ids } },
    data: { featured },
  });

  return { message: `Set ${result.count} vehicles as ${featured ? 'featured' : 'not featured'}` };
};

export const bulkPublishVehicles = async (ids: string[]) => {
  const result = await prisma.vehicle.updateMany({
    where: { id: { in: ids } },
    data: { isDraft: false, publishedAt: new Date() },
  });

  return { message: `Published ${result.count} vehicles` };
};

export const bulkUnpublishVehicles = async (ids: string[]) => {
  const result = await prisma.vehicle.updateMany({
    where: { id: { in: ids } },
    data: { isDraft: true, publishedAt: null },
  });

  return { message: `Unpublished ${result.count} vehicles` };
};