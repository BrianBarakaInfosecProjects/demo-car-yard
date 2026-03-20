import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user only
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trustauto.co.ke' },
    update: { password: '$2a$10$djJIiiNR1YHfAx6hlgy4b.t91llQPX5l7R0IC8WkuGsjVXvwLFNym' },
    create: {
      email: 'admin@trustauto.co.ke',
      password: '$2a$10$djJIiiNR1YHfAx6hlgy4b.t91llQPX5l7R0IC8WkuGsjVXvwLFNym',
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
