import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import authConfig from './auth.config';
import { getUserById } from '@/lib/data/user';
import { getAccountByUserId } from './lib/data/account';
import { signInFormSchema } from '@/lib/validators/user';
import { prisma } from './db/prisma';
import { compareSync } from 'bcryptjs';
// import { PrismaAdapter } from '@auth/prisma-adapter';

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
	// adapter: PrismaAdapter(prisma),
	...authConfig,
	providers: [
		...authConfig.providers,
		Credentials({
			async authorize(credentials) {
				const validatedData = signInFormSchema.safeParse(credentials);
				if (!validatedData.success) return null;
				const { email, password } = validatedData.data;
				const user = await prisma.user.findUnique({
					where: {
						email: email,
					},
				});
				if (!user || !user.password || !user.email) {
					return null;
				}

				const passwordsMatch = compareSync(password, user.password);

				if (passwordsMatch) {
					return user;
				}

				return null;
			},
		}),
	],
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
