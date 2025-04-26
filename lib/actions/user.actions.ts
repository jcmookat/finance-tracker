'use server';

import { signInFormSchema, signUpFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { cookies } from 'next/headers';
import { AuthError } from 'next-auth';
// import { Resend } from 'resend';
// import { VerificationEmail } from '@/emails/verification-email';
import bcrypt from 'bcryptjs';
// import { APP_NAME, SENDER_EMAIL } from '@/lib/constants';
import { sendVerificationEmail } from '@/emails';

// const resend = new Resend(process.env.RESEND_API_KEY as string);

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    // from validators
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const normalizedEmail = user.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message:
          'Registration failed. If this email is already in use, please try logging in.',
      };
    }

    const hashedPassword = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Generate a verification token using bcrypt
    const salt = await bcrypt.genSalt(10);
    const rawToken = `${formData.get('email')}-${Date.now()}`;
    const token = await bcrypt.hash(rawToken, salt).then((hash) =>
      // Make it URL-safe by replacing characters that could cause issues in URLs
      hash.replace(/\//g, '_').replace(/\+/g, '-'),
    );
    // Store the token in your database with the user
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        verificationToken: token,
        verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // Create verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${encodeURIComponent(token)}`;

    // Send verification email
    // await resend.emails.send({
    //   from: `${APP_NAME} <${SENDER_EMAIL}>`,
    //   to: normalizedEmail,
    //   subject: 'Verify your email address',
    //   react: VerificationEmail({
    //     username: formData.get('name'),
    //     verificationLink,
    //   }),
    // });

    const verification = await sendVerificationEmail({
      email: normalizedEmail,
      username: user.name,
      verificationLink,
    });

    console.log(verification);

    return {
      success: true,
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Verify email
export async function verifyEmail(token: string) {
  try {
    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(), // Token hasn't expired
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired verification token',
      };
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return {
      success: true,
      message: 'Email verified successfully',
    };
  } catch (error) {
    console.error('Error verifying email:', error);
    return {
      success: false,
      message: 'Verification failed',
    };
  }
}

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const normalizedEmail = user.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!existingUser || !existingUser.password || !existingUser.email) {
      return { success: false, message: 'Invalid email or password' };
    }

    await signIn('credentials', {
      email: existingUser.email,
      password: user.password,
      redirectTo: '/dashboard',
    });

    return { success: true, message: 'User logged in successfully' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, message: 'Invalid email or password' };
        default:
          return {
            success: false,
            message: 'Please verify your email address',
          };
      }
    }
    throw error;
  }
}

export async function googleAuthenticate() {
  try {
    await signIn('google', { redirectTo: '/dashboard' });
  } catch (error) {
    if (error instanceof AuthError) {
      return 'google log in failed';
    }
    throw error;
  }
}

// Sign user out
export async function signOutUser() {
  const cookiesObject = await cookies();
  cookiesObject.set('sessionCartId', '', { expires: new Date(0) }); // Clear the cookie
  await signOut({ redirectTo: '/', redirect: true });
}
