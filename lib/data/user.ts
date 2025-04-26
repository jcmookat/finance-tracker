import { prisma } from '@/db/prisma';

// Get user by the ID
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new Error('User not found');
  return user;
}
