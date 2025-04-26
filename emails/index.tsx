import { Resend } from 'resend';
import { APP_NAME, SENDER_EMAIL } from '../lib/constants';

import dotenv from 'dotenv';
dotenv.config();

import { VerificationEmail } from './verification-email';

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const sendVerificationEmail = async ({
  email,
  username,
  verificationLink,
}: {
  email: string;
  username: string;
  verificationLink: string;
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: email,
      subject: 'Verify your email address',
      react: VerificationEmail({
        username,
        verificationLink,
      }),
    });
    if (error) {
      console.error('Email sending error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending exception:', error);
    return { success: false, error };
  }
};
