import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user only
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trustauto.co.ke' },
    update: {},
    create: {
      email: 'admin@trustauto.co.ke',
      password: '$2a$10$BEytcMDkTdWgFRedt2fl1O.Etc3jpY61ppFPsKa5LSZVRcQwWkFKS',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);
  console.log('Starting with clean inventory - no vehicles seeded');
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
