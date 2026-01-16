import prisma from '../src/config/database';

async function generateSlugs() {
  console.log('Generating slugs for vehicles...');

  const vehicles = await prisma.vehicle.findMany({
    where: {
      slug: null,
    },
  });

  console.log(`Found ${vehicles.length} vehicles without slugs`);

  for (const vehicle of vehicles) {
    const baseSlug = `${vehicle.year}-${vehicle.make.toLowerCase()}-${vehicle.model.toLowerCase()}`
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .trim();

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await prisma.vehicle.findFirst({
        where: {
          slug,
        },
      });

      if (!existing) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    await prisma.vehicle.update({
      where: {
        id: vehicle.id,
      },
      data: {
        slug,
      },
    });

    console.log(`Generated slug for ${vehicle.make} ${vehicle.model}: ${slug}`);
  }

  console.log('Slug generation complete!');
}

generateSlugs()
  .catch((e) => {
    console.error('Error generating slugs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
