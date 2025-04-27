import { PrismaClient } from '../lib/generated/prisma';

async function main() {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      id: '33684824-ac65-42bb-aba0-dd53f48d55e6',
    },
  });
  if (!user) {
    console.error('No user found. Seed a user first!');
    return;
  }

  try {
    await prisma.transaction.createMany({
      data: [
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Salary',
          amount: 2500.0,
          description: 'Monthly salary',
          transactionDate: new Date('2025-04-01'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Groceries',
          amount: 120.45,
          description: 'Walmart groceries',
          transactionDate: new Date('2025-04-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Utilities',
          amount: 80.75,
          description: 'Electric bill',
          transactionDate: new Date('2025-04-07'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Freelance',
          amount: 500.0,
          description: 'Freelance website project',
          transactionDate: new Date('2025-04-10'),
        },
      ],
    });
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    // Disconnect from the database when done
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
