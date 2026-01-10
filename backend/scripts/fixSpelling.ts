import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSpelling() {
  console.log('Fixing spelling in database...');

  const vehicles = await prisma.vehicle.findMany();

  for (const vehicle of vehicles) {
    const updates: any = {};

    // Fix bodyType
    if (vehicle.bodyType === 'SEDAN') {
      updates.bodyType = 'SEDAN' as const;
    }

    // Fix fuelType
    if (vehicle.fuelType === 'GASOLINE') {
      updates.fuelType = 'GASOLINE' as const;
    }

    // Fix status
    if (vehicle.status === 'USED') {
      updates.status = 'USED' as const;
    } else if (vehicle.status === 'NEW') {
      updates.status = 'NEW' as const;
    } else if (vehicle.status === 'CERTIFIED_PRE_OWNED') {
      updates.status = 'CERTIFIED_PRE_OWNED' as const;
    } else if (vehicle.status === 'ON_SALE') {
      updates.status = 'ON_SALE' as const;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: updates,
      });
      console.log(`Updated vehicle: ${vehicle.make} ${vehicle.model}`);
    }
  }

  console.log('Fixed all spelling issues!');
}

fixSpelling()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
