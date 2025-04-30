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
          category: 'Freelance',
          amount: 1446.34,
          description: 'Freelance Project',
          transactionDate: new Date('2025-04-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Dining',
          amount: 740.79,
          description: 'Cafe',
          transactionDate: new Date('2025-04-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Freelance',
          amount: 941.75,
          description: 'Freelance Project',
          transactionDate: new Date('2025-03-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Transport',
          amount: 231.14,
          description: 'Bus Fare',
          transactionDate: new Date('2025-03-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Salary',
          amount: 1030.97,
          description: 'Monthly Salary',
          transactionDate: new Date('2025-01-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Health',
          amount: 351.67,
          description: 'Pharmacy',
          transactionDate: new Date('2025-01-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Bonus',
          amount: 1481.52,
          description: 'Performance Bonus',
          transactionDate: new Date('2025-01-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Entertainment',
          amount: 735.2,
          description: 'Streaming Subscription',
          transactionDate: new Date('2025-01-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Freelance',
          amount: 1498.29,
          description: 'Freelance Project',
          transactionDate: new Date('2024-12-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Groceries',
          amount: 570.54,
          description: 'Market',
          transactionDate: new Date('2024-12-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Freelance',
          amount: 1038.65,
          description: 'Freelance Project',
          transactionDate: new Date('2024-11-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Entertainment',
          amount: 116.37,
          description: 'Streaming Subscription',
          transactionDate: new Date('2024-11-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Salary',
          amount: 1062.16,
          description: 'Monthly Salary',
          transactionDate: new Date('2024-10-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Transport',
          amount: 346.33,
          description: 'Bus Fare',
          transactionDate: new Date('2024-10-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Bonus',
          amount: 834.01,
          description: 'Performance Bonus',
          transactionDate: new Date('2024-09-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Entertainment',
          amount: 597.3,
          description: 'Concert',
          transactionDate: new Date('2024-09-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Bonus',
          amount: 1455.18,
          description: 'Performance Bonus',
          transactionDate: new Date('2024-08-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Dining',
          amount: 222.37,
          description: 'Restaurant',
          transactionDate: new Date('2024-08-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Bonus',
          amount: 930.21,
          description: 'Performance Bonus',
          transactionDate: new Date('2024-07-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Transport',
          amount: 641.95,
          description: 'Taxi',
          transactionDate: new Date('2024-07-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Bonus',
          amount: 1115.22,
          description: 'Performance Bonus',
          transactionDate: new Date('2024-06-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Groceries',
          amount: 140.32,
          description: 'Market',
          transactionDate: new Date('2024-06-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Freelance',
          amount: 1041.34,
          description: 'Freelance Project',
          transactionDate: new Date('2024-05-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Transport',
          amount: 489.6,
          description: 'Taxi',
          transactionDate: new Date('2024-05-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Bonus',
          amount: 1471.37,
          description: 'Performance Bonus',
          transactionDate: new Date('2024-04-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Groceries',
          amount: 223.59,
          description: 'Market',
          transactionDate: new Date('2024-04-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Bonus',
          amount: 1317.85,
          description: 'Performance Bonus',
          transactionDate: new Date('2024-03-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Transport',
          amount: 786.93,
          description: 'Gas',
          transactionDate: new Date('2024-03-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Salary',
          amount: 1170.8,
          description: 'Monthly Salary',
          transactionDate: new Date('2024-02-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Dining',
          amount: 399.23,
          description: 'Fast Food',
          transactionDate: new Date('2024-02-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Salary',
          amount: 800.33,
          description: 'Monthly Salary',
          transactionDate: new Date('2024-01-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Health',
          amount: 307.35,
          description: 'Pharmacy',
          transactionDate: new Date('2024-01-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Freelance',
          amount: 593.22,
          description: 'Freelance Project',
          transactionDate: new Date('2023-12-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Groceries',
          amount: 370.61,
          description: 'Supermarket',
          transactionDate: new Date('2023-12-15'),
        },
        {
          userId: user.id,
          type: 'INCOME',
          category: 'Salary',
          amount: 778.87,
          description: 'Monthly Salary',
          transactionDate: new Date('2023-11-05'),
        },
        {
          userId: user.id,
          type: 'EXPENSE',
          category: 'Entertainment',
          amount: 671.93,
          description: 'Streaming Subscription',
          transactionDate: new Date('2023-11-15'),
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
