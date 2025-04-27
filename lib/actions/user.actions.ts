'use server';

import { signInFormSchema, signUpFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { cookies } from 'next/headers';
import { AuthError } from 'next-auth';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/emails';

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

    const emailVerification = await sendVerificationEmail({
      email: normalizedEmail,
      username: user.name,
      verificationLink,
    });

    if (!emailVerification.success) {
      // Email sending failed
      return {
        success: false,
        message:
          'Registration completed, but we could not send a verification email. Please try to verify your account later.',
        // Optionally include more details or error info for debugging
        error: emailVerification.error,
      };
    }

    // Registered user and verication email was sent successfully
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

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Update user as verified
      await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          verificationToken: null,
          verificationTokenExpiry: null,
        },
      });

      // Create an account for the user
      await tx.account.create({
        data: {
          userId: user.id,
          type: 'credentials',
          provider: 'email',
          providerAccountId: user.email, // Using email as the providerAccountId
          // Optional fields below can be null
          refresh_token: null,
          access_token: null,
          expires_at: null,
          token_type: null,
          scope: null,
          id_token: null,
          session_state: null,
        },
      });
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
