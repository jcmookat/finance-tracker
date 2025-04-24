import authConfig from './auth.config';
import NextAuth from 'next-auth';
import { privateRoutes } from './routes';

const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.includes('/auth');
  const isApiRoute = nextUrl.pathname.includes('/api');

  console.log(isAuthRoute);

  if (isApiRoute) {
    return;
  }

  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/dashboard`);
  }

  if (isAuthRoute && !isLoggedIn) {
    return;
  }

  if (!isLoggedIn && isPrivateRoute) {
    return Response.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/sign-in`);
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
