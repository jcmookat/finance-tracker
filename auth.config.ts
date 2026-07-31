import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

// Edge-safe by design: middleware.ts builds its NextAuth instance straight from this file, so keep Credentials/bcrypt/Prisma out of here (see auth.ts) or the Edge Function bundle blows past Vercel's size limit.
export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
	],
} satisfies NextAuthConfig;
