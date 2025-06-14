import { z, ZodType } from 'zod';
import { signUpFormSchema } from '@/lib/validators/user';
import { FieldPath, Control } from 'react-hook-form';
import { DefaultSession } from 'next-auth';
import { LucideIcon } from 'lucide-react';

// Base type for form field props
export type BaseFormFieldProps<TSchema extends ZodType> = {
	name: FieldPath<z.infer<TSchema>>;
	label?: string;
	placeholder?: string;
	description?: string;
	inputType?: string;
	disabled?: boolean;
	dataArr?: Array<{ label: string; value: string; icon?: LucideIcon }>;
	disabledLabel?: string;
	enabledLabel?: string;
	formControl: Control<z.infer<TSchema>>;
};

export type SignupFormFieldProps = BaseFormFieldProps<typeof signUpFormSchema>;

// Define your role type if you have specific roles
export type UserRole = 'user' | 'admin';

// Charts
export type ChartEntry = {
	date: string;
	INCOME: number;
	EXPENSE: number;
};

// Session user schema
export const sessionUserSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	image: z.string().optional(),
	role: z.string(),
	isOauth: z.boolean(),
});

export const sessionSchema = z.object({
	user: sessionUserSchema,
	expires: z.string(),
});

// Session types
export type SessionUser = {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role: string;
	isOauth: boolean;
};
export interface Session extends DefaultSession {
	user: SessionUser;
}

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			role: string;
			isOauth: boolean;
		} & DefaultSession['user'];
	}
}
