'use client';

import { googleAuthenticate } from '@/lib/actions/user.actions';
import { useActionState } from 'react';
import { BsGoogle } from 'react-icons/bs';
import { Button } from '../ui/button';

const GoogleLogin = () => {
  const [error, dispatchGoogle] = useActionState(googleAuthenticate, undefined);
  return (
    <form className="flex mt-4" action={dispatchGoogle}>
      <Button
        variant="outline"
        className="flex flex-row items-center gap-3 w-full"
      >
        <BsGoogle /> Google Sign In
      </Button>
      <p>{error}</p>
    </form>
  );
};
export default GoogleLogin;
