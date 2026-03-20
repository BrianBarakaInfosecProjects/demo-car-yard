/**
 * seed-cars.ts
 * ─────────────────────────────────────────────────────────────
 * Kenyan Market Car Database Seed Script
 * Drop this file at:  backend/prisma/seed-cars.ts
 * Drop car-database.json at:  backend/src/data/car-database.json
 *
 * Run with:  npx ts-node prisma/seed-cars.ts
 *
 * Requires two new Prisma models — add to schema.prisma:
 *
 *   model CarMake {
 *     id        String     @id @default(uuid())
 *     name      String     @unique
 *     key       String     @unique
 *     logoUrl   String?
 *     models    CarModel[]
 *     createdAt DateTime   @default(now())
 *   }
 *
 *   model CarModel {
 *     id            String   @id @default(uuid())
 *     makeId        String
 *     make          CarMake  @relation(fields: [makeId], references: [id])
 *     name          String
 *     yearStart     Int
 *     yearEnd       Int?
 *     bodyTypes     String   // JSON array  ["SEDAN","HATCHBACK"]
 *     fuelTypes     String   // JSON array  ["GASOLINE","HYBRID"]
 *     transmissions String   // JSON array  ["Automatic","Manual"]
 *     engines       String   // JSON array of engine objects
 *     createdAt     DateTime @default(now())
 *     @@unique([makeId, name, yearStart])
 *   }
 */

import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

const dbPath = path.join(__dirname, '../src/data/car-database.json');
const carDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

async function seedCars() {
  console.log('🚗  Seeding Kenyan market car database…\n');

  let makesCreated = 0;
  let modelsCreated = 0;

  for (const make of carDb.makes) {
    const createdMake = await prisma.carMake.upsert({
      where: { key: make.key },
      update: { name: make.name },
      create: { name: make.name, key: make.key },
    });
    makesCreated++;
    console.log(`  ✅ Make: ${createdMake.name}`);

    for (const model of make.models) {
      await prisma.carModel.upsert({
        where: {
          makeId_name_yearStart: {
            makeId: createdMake.id,
            name: model.name,
            yearStart: model.yearStart,
          },
        },
        update: {
          yearEnd:       model.yearEnd ?? null,
          bodyTypes:     JSON.stringify(model.bodyTypes),
          fuelTypes:     JSON.stringify(model.fuelTypes),
          transmissions: JSON.stringify(model.transmissions),
          engines:       JSON.stringify(model.engines),
        },
        create: {
          makeId:        createdMake.id,
          name:          model.name,
          yearStart:     model.yearStart,
          yearEnd:       model.yearEnd ?? null,
          bodyTypes:     JSON.stringify(model.bodyTypes),
          fuelTypes:     JSON.stringify(model.fuelTypes),
          transmissions: JSON.stringify(model.transmissions),
          engines:       JSON.stringify(model.engines),
        },
      });
      modelsCreated++;
      console.log(`     └─ ${model.name}  (${model.yearStart}–${model.yearEnd ?? 'present'})  [${model.engines.length} engines]`);
    }
  }

  console.log(`\n🏁  Done — ${makesCreated} makes · ${modelsCreated} models seeded.\n`);
}

seedCars()
  .catch((e) => { console.error('Seed error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
