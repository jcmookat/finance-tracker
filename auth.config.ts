import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';

export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Credentials({}),
	],
} satisfies NextAuthConfig;

// export const authConfig = {
// 	providers: [
//     Google({}),
//   ], // Required by NextAuthConfig type
// 	callbacks: {
// 		authorized({ request, auth }: any) {
// 			// Array of regex patterns of paths we want to protect
// 			const protectedPaths = [
// 				/\/shipping-address/,
// 				/\/payment-method/,
// 				/\/place-order/,
// 				/\/profile/,
// 				/\/user\/(.*)/,
// 				/\/order\/(.*)/,
// 				/\/admin/,
// 			];

// 			// Get pathname from the req URL object
// 			const { pathname } = request.nextUrl;

// 			// Check if user is not authenticated and accessing a protected path
// 			if (!auth && protectedPaths.some((p) => p.test(pathname))) return false;

// 			return true;
// 		},
// 	},
// } satisfies NextAuthConfig;
