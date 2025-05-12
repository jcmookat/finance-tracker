'use client';

import { ArrowRight, Loader, LogIn, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubmitButton = ({
  buttonLabel = 'Submit',
  isPending = false,
  isPendingLabel = 'Submitting',
  withIcon = true,
}: {
  buttonLabel?: string;
  isPending: boolean;
  isPendingLabel?: string;
  withIcon?: boolean;
}) => {
  return (
    <Button
      type="submit"
      disabled={isPending}
      className="w-full"
      variant="default"
    >
      {isPending ? (
        <>
          <Loader className="w-4 h-4 animate-spin" /> {isPendingLabel}
        </>
      ) : (
        <>
          {withIcon &&
            (buttonLabel === 'Sign In' ? (
              <LogIn className="w-4 h-4 mr-2" />
            ) : buttonLabel === 'Sign Up' ? (
              <UserIcon className="w-4 h-4 mr-2" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            ))}
          {buttonLabel}
        </>
      )}
    </Button>
  );
};
export default SubmitButton;
