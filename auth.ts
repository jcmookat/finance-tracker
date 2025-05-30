import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { getUserById } from '@/lib/data/user';
import { getAccountByUserId } from './lib/data/account';
import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';

export const {
	auth,
	handlers: { GET, POST },
	signIn,
	signOut,
} = NextAuth({
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	adapter: PrismaAdapter(prisma),
	...authConfig,
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider !== 'credentials') {
				return true;
			}
			if (!user.id) return false;
			const existingUser = await getUserById(user.id);

			if (!existingUser?.emailVerified) {
				return false;
			}

			return true;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);
			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);
			if (!existingAccount) return token;

			token.isOauth = !!existingAccount;
			token.name = existingUser.name;
			token.email = existingUser.email;
			token.image = existingUser.image;
			token.role = existingUser.role;

			return token;
		},
		async session({ token, session }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.sub,
					role: token.role,
					isOauth: token.isOauth,
				},
			};
		},
	},
});
