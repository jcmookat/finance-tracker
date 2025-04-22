import { z, ZodType } from 'zod';
import { signUpFormSchema } from '@/lib/validators';
import { FieldPath, Control } from 'react-hook-form';

// Base type for form field props
export type BaseFormFieldProps<TSchema extends ZodType> = {
  name: FieldPath<z.infer<TSchema>>;
  label: string;
  placeholder?: string;
  description?: string;
  inputType?: string;
  disabled?: boolean;
  dataArr?: string[];
  selectIcon?: boolean;
  disabledLabel?: string;
  enabledLabel?: string;
  formControl: Control<z.infer<TSchema>>;
};

export type SignupFormFieldProps = BaseFormFieldProps<typeof signUpFormSchema>;
