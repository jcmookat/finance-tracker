import {
  Shirt,
  Utensils,
  Gamepad2,
  Fuel,
  Gift,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Dumbbell,
  Train,
  GraduationCap,
  Carrot,
  Wallet,
  Briefcase,
  Repeat,
  PenTool,
  JapaneseYen,
} from 'lucide-react';
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

export const transactionDefaultValues = () => ({
  userId: '',
  type: 'EXPENSE' as 'EXPENSE' | 'INCOME',
  category: 'General',
  amount: 100,
  description: '',
  transactionDate: new Date(),
});

export const expenseCategories = [
  { label: 'General', value: 'General', icon: ShoppingCart },
  { label: 'Clothes', value: 'Clothes', icon: Shirt },
  { label: 'Eating Out', value: 'Eating Out', icon: Utensils },
  { label: 'Education', value: 'Education', icon: GraduationCap },
  { label: 'Entertainment', value: 'Entertainment', icon: Gamepad2 },
  { label: 'Fuel', value: 'Fuel', icon: Fuel },
  { label: 'Gifts', value: 'Gifts', icon: Gift },
  { label: 'Groceries', value: 'Groceries', icon: Carrot },
  { label: 'Holidays', value: 'Holidays', icon: Plane },
  { label: 'Wants', value: 'Wants', icon: ShoppingBag },
  { label: 'Sports', value: 'Sports', icon: Dumbbell },
  { label: 'Travel', value: 'Travel', icon: Train },
];

export const incomeCategories = [
  { label: 'Salary', value: 'Salary', icon: Briefcase },
  { label: 'Carry Over', value: 'Carry Over', icon: Repeat },
  { label: 'Freelance', value: 'Freelance', icon: PenTool },
];

export const transactionType = [
  { label: 'EXPENSE', value: 'EXPENSE', icon: JapaneseYen },
  { label: 'INCOME', value: 'INCOME', icon: Wallet },
];
