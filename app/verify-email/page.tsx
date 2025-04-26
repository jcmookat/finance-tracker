// app/verify-email/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/lib/actions/user.actions';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('invalid');
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setStatus('success');
          // Redirect to login after short delay
          setTimeout(() => router.push('/sign-in'), 3000);
        } else {
          setStatus('failed');
        }
      } catch (error) {
        setStatus('error');
        console.log('error', error);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center p-8 max-w-md border rounded-lg shadow-sm">
        {status === 'verifying' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
            <p>Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-600">
              Email Verified!
            </h1>
            <p>
              Your email has been successfully verified. You&apos;ll be
              redirected to login shortly.
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              Verification Failed
            </h1>
            <p>
              The verification link may have expired or is invalid. Please try
              registering again.
            </p>
          </>
        )}

        {status === 'invalid' && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">
              Invalid Request
            </h1>
            <p>No verification token was provided.</p>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
            <p>
              An error occurred during verification. Please try again later.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
