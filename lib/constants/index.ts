export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Gastos ni Grasya';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Finance tracker of gastos ni Grasya';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const signInDefaultValues = {
  email: '',
  password: '',
};
export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};
export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
