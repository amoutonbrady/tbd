import { resolve } from 'path';
import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import slugify from '@sindresorhus/slugify';

interface City {
  id: number;
  department_code: string;
  insee_code: string;
  zip_code: string;
  name: string;
  slug: string;
  gps_lat: number;
  gps_lng: number;
}

async function main() {
  const client = new PrismaClient();

  const file = resolve(__dirname, 'cities.json');
  const content = readFileSync(file, { encoding: 'utf-8' });
  const cities: City[] = JSON.parse(content);

  console.log(`${cities.length} cities to process`);

  for (const {
    name,
    department_code: code,
    zip_code: zip,
    gps_lat: latitude,
    gps_lng: longitude,
  } of cities) {
    const slug = slugify(name);

    const city = await client.city.upsert({
      create: {
        name,
        slug,
        latitude,
        longitude,
        zip,
        department: { connect: { code } },
      },
      update: {
        name,
        slug,
        latitude,
        longitude,
        zip,
        department: { connect: { code } },
      },
      where: { zip_name: { name, zip } },
    });

    const isUpdate = city.createdAt !== city.updateAt;

    console.log(`[${isUpdate ? 'UPDATED' : 'CREATED'}] `, name);
  }

  console.log(`Done, bye!`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
