'use server';

import { z } from 'zod';
import { signUpFormSchema } from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { cookies } from 'next/headers';

// Sign up user
// export const signUpUser = async (
//   formData: z.infer<typeof signUpFormSchema>,
// ) => {
//   try {
//     const validatedData = signUpFormSchema.parse(formData);
//
//     if (!validatedData) {
//       return { error: 'Invalid input data' };
//     }
//
//     const { email, name, password, confirmPassword } = validatedData;
//
//     if (password !== confirmPassword) {
//       return { error: 'Passwords do not match' };
//     }
//
//     const hashedPassword = await bcrypt.hash(password, 10);
//
//     const userExist = await prisma.user.findFirst({
//       where: {
//         email,
//       },
//     });
//
//     if (userExist) {
//       return { error: 'User already exists' };
//     }
//
//     const lowerCaseEmail = email.toLowerCase();
//
//     await prisma.user.create({
//       data: {
//         email: lowerCaseEmail,
//         password: hashedPassword,
//         name,
//       },
//     });
//
//     return { success: 'User created successfully' };
//   } catch (error) {
//     console.error(error);
//     return { error: 'Error occurred' };
//   }
// };

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

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    // await signIn('credentials', {
    //   email: user.email,
    //   password: plainPassword,
    // });

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: formatError(error) };
  }
}

// Sign user out
export async function signOutUser() {
  const cookiesObject = await cookies();
  cookiesObject.set('sessionCartId', '', { expires: new Date(0) }); // Clear the cookie
  await signOut({ redirectTo: '/', redirect: true });
}
