'use client';

import { signUpDefaultValues } from '@/lib/constants';
import Link from 'next/link';
import { useActionState, useEffect, useTransition } from 'react';
import { signUpUser } from '@/lib/actions/user.actions';
import { useSearchParams } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signUpFormSchema } from '@/lib/validators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import SubmitButton from '@/components/shared/submit-button';
import { toast } from 'sonner';
import BaseFormField from '@/components/shared/base-form-field';
import { Check, X } from 'lucide-react';
import GoogleLogin from '@/components/auth/google-button';

const SignUpForm = () => {
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: '',
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: signUpDefaultValues,
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!data.success && data.message) {
      toast('Sign up failed', {
        description: data.message,
        duration: 3500,
        icon: <X />,
      });
    } else {
      toast('Sign up success', {
        description: data.message,
        duration: 3500,
        icon: <Check />,
      });
    }
  }, [data]);

  const onSubmit: SubmitHandler<z.infer<typeof signUpFormSchema>> = async (
    values,
  ) => {
    startTransition(async () => {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        // Convert non-string values to strings
        formData.append(
          key,
          typeof value === 'object' ? JSON.stringify(value) : String(value),
        );
      });

      if (callbackUrl) {
        formData.append('callbackUrl', callbackUrl);
      }

      action(formData);
    });
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <BaseFormField<typeof signUpFormSchema>
              name="name"
              label="Name"
              placeholder="Name"
              formControl={form.control}
            />
            <BaseFormField<typeof signUpFormSchema>
              name="email"
              label="Email"
              placeholder="Email"
              inputType="email"
              formControl={form.control}
            />
            <BaseFormField<typeof signUpFormSchema>
              name="password"
              label="Password"
              placeholder="Password"
              inputType="password"
              formControl={form.control}
            />
            <BaseFormField<typeof signUpFormSchema>
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm Password"
              inputType="password"
              formControl={form.control}
            />
            <div>
              <SubmitButton
                isPending={isPending}
                buttonLabel="Sign Up"
                isPendingLabel="Creating account..."
              />
            </div>
            {data &&
              (data.success ? (
                <div className="text-center text-green-500">
                  Success! Your operation completed.
                </div>
              ) : (
                <div className="text-center text-destructive">
                  {data.message}
                </div>
              ))}
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/sign-in" target="self" className="link">
                Sign In
              </Link>
            </div>
          </div>
        </form>
      </Form>
      <GoogleLogin />
    </>
  );
};

export default SignUpForm;
