import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultUser: Prisma.UserCreateInput[] = [
  {
    email: 'admin@qvant.com',
    firstName: 'Super',
    lastName: 'User',
    password: '',
    role: 'ADMINISTRATOR',
  },
];

async function main() {
  await prisma.user.deleteMany();

  console.log(`Start seeding ...`);
  for (const u of defaultUser) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
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
