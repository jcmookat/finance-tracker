import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import CredentialsSignInForm from './credentials-signin-form';
import logo from '@/public/images/wallet.svg';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
export const metadata: Metadata = {
  title: 'Sign In',
};
const SignInPage = async (props: {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams?.callbackUrl;

  const session = await auth();

  if (session) {
    return redirect(callbackUrl || '/dashboard');
  }
  return (
    <div className="flex-center min-h-screen w-full">
      <div className="w-full max-w-md mx-auto">
        <Card>
          <CardHeader className="space-y-4">
            <Link href="/" className="flex-center">
              <Image
                src={logo}
                width={100}
                height={100}
                alt={`${APP_NAME} logo`}
                priority={true}
              />
            </Link>
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CredentialsSignInForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
