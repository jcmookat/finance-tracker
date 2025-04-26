// import { compareSync } from 'bcrypt-ts-edge';
import NextAuth from 'next-auth';
import authConfig from './auth.config';
// import CredentialsProvider from 'next-auth/providers/credentials';

import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { getUserById } from '@/lib/data/user';
import { getAccountByUserId } from './lib/data/account';

// export const config = {
// 	pages: {
// 		signIn: '/sign-in',
// 		error: '/sign-in',
// 	},
// 	session: {
// 		strategy: 'jwt',
// 		maxAge: 30 * 24 * 60 * 60, // 30 days
// 	},
// 	adapter: PrismaAdapter(prisma),
// 	providers: [
// 		CredentialsProvider({
// 			credentials: {
// 				email: {
// 					type: 'email',
// 				},
// 				password: { type: 'password' },
// 			},
// 			async authorize(credentials) {
// 				if (credentials == null) return null;

// 				// Find user in database
// 				const user = await prisma.user.findFirst({
// 					where: {
// 						email: credentials.email as string,
// 					},
// 				});
// 				// Check if user exists and password is correct
// 				if (user && user.password) {
// 					const isMatch = compareSync(
// 						credentials.password as string,
// 						user.password,
// 					);
// 					// If password is correct, return user object
// 					if (isMatch) {
// 						return {
// 							id: user.id,
// 							name: user.name,
// 							email: user.email,
// 							role: user.role,
// 						};
// 					}
// 				}
// 				// If user doesn't exist or password is incorrect, return null
// 				return null;
// 			},
// 		}),
// 	],
// 	callbacks: {
// 		async session({ session, user, trigger, token }: any) {
// 			// Set the user ID from the token
// 			session.user.id = token.sub;
// 			session.user.role = token.role;
// 			session.user.name = token.name;

// 			// If there is an update, set the user name
// 			if (trigger === 'update') {
// 				session.user.name = user.name;
// 			}

// 			return session;
// 		},
// 		async jwt({ token, user, trigger, session }: any) {
// 			// Assign user fields to token
// 			if (user) {
// 				token.id = user.id;
// 				token.role = user.role;

// 				// If user has no name, then use the first part of email (ex, google auth provider)
// 				if (user.name === 'NO_NAME') {
// 					token.name = user.email!.split('@')[0];

// 					// Update database to reflect token name
// 					await prisma.user.update({
// 						where: { id: user.id },
// 						data: { name: token.name },
// 					});
// 				}
// 			}

// 			// Handle session updates
// 			if (session?.user.name && trigger === 'update') {
// 				token.name = session.user.name;
// 			}
// 			return token;
// 		},
// 		...authConfig.callbacks,
// 	},
// };
export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  // pages: {
  // 	signIn: '/sign-in',
  // 	error: '/sign-in',
  // },
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
