import { prisma } from '@/db/prisma';

// Get account by user ID
export async function getAccountByUserId(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
    },
  });
  if (!account) throw new Error('Account not found');
  return account;
}
