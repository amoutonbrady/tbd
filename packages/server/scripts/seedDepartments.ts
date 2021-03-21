import { resolve } from 'path';
import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import slugify from '@sindresorhus/slugify';

interface Department {
  id: number;
  region_code: string;
  code: string;
  name: string;
  slug: string;
}

async function main() {
  const client = new PrismaClient();

  const file = resolve(__dirname, 'departments.json');
  const content = readFileSync(file, { encoding: 'utf-8' });
  const departments: Department[] = JSON.parse(content);

  console.log(`${departments.length} departments to process`);

  for (const { name, code } of departments) {
    const slug = slugify(name);

    const department = await client.department.upsert({
      create: { name, slug, code },
      update: { name, slug, code },
      where: { code },
    });

    const isUpdate = department.createdAt !== department.updateAt;

    console.log(`[${isUpdate ? 'UPDATED' : 'CREATED'}] `, name);
  }

  console.log(`Done, bye!`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
