// prisma/seed.ts
import { MemberType, PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function main() {

  const memberTypes: MemberType[] = [
    { id: 'BASIC', postsLimitPerMonth: 10, discount: 2.3 },
    { id: 'BUSINESS', postsLimitPerMonth: 100, discount: 7.7 },
  ];

  for (const memberType of memberTypes) {
    await prisma.memberType.create({
      data: memberType,
    });
  }

  const user1 = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "John Doe",
      balance: 1000,
      profile: {
        create: {
          id: randomUUID(),
          isMale: true,
          yearOfBirth: 1990,
          memberTypeId: 'BASIC'
        }
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "Jane Smith",
      balance: 2000,
      profile: {
        create: {
          id: randomUUID(),
          isMale: false,
          yearOfBirth: 1995,
          memberTypeId: 'BUSINESS'
        }
      }
    }
  });

  await prisma.post.create({
    data: {
      id: randomUUID(),
      title: "Getting Started",
      content: "This is my first post!",
      authorId: user1.id
    }
  });

  await prisma.post.create({
    data: {
      id: randomUUID(),
      title: "Advanced Topics",
      content: "This is a business post",
      authorId: user2.id
    }
  });

  console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
      console.error('Error seeding data:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
