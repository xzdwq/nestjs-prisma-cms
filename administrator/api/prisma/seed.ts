import * as argon from 'argon2';
import * as dotenv from 'dotenv';

import { Prisma, PrismaClient } from '@prisma/client';

dotenv.config();

const prisma = new PrismaClient();

const defaultUser: Prisma.UserCreateInput[] = [
  {
    email: process.env.EMAIL,
    firstName: 'Super',
    lastName: 'User',
    password: process.env.PASSWORD,
    role: 'ADMINISTRATOR',
  },
];

async function main() {
  await prisma.user.deleteMany();

  console.log(`Start seeding ...`);
  for (const user of defaultUser) {
    const hashedPassword = await argon.hash(user.password);
    const createUser = await prisma.user.create({
      data: { ...user, password: hashedPassword },
    });
    console.log(`Created user with id: ${createUser.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
