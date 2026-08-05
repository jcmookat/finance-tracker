import { prisma } from '@/db/prisma';

// Get user by the ID
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// Get a user's saved budget-rule percentages (Reward / Savings; Budget is the remainder)
export async function getUserBudgetPreferences(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { rewardPercent: true, savingsPercent: true },
  });

  return {
    rewardPercent: user?.rewardPercent ?? 5,
    savingsPercent: user?.savingsPercent ?? 35,
  };
}
