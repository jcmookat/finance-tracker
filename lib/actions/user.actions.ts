'use server';

import { z } from 'zod';
import { signInFormSchema, signUpFormSchema } from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { cookies } from 'next/headers';
import { AuthError } from 'next-auth';

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

    // const plainPassword = user.password;

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

    // await signIn('credentials', {
    //   email: user.email,
    //   password: plainPassword,
    // });

    return {
      success: true,
      message: 'Success! Verify your email address.',
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
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
    // if (isRedirectError(error)) {
    //   throw error;
    // }
    // return { success: false, message: 'Invalid email or password' };
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

// Get user by the ID
export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// Get account by user ID
export async function getAccountByUserId(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
    },
  });
  if (!account) throw new Error('Account not found');
  return account;
}
