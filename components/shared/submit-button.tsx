'use client';

import { ArrowRight, Loader } from 'lucide-react';
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
          {withIcon && <ArrowRight className="w-4 h-4" />}
          {buttonLabel}
        </>
      )}
    </Button>
  );
};
export default SubmitButton;
