'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AuthLoading from '@/components/AuthLoading';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    // Timeout zabezpieczający - po 5 sekundach przekieruj na główną
    const maxTimeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    // Jak tylko sesja jest załadowana, przekieruj natychmiast
    if (status === 'authenticated') {
      clearTimeout(maxTimeout);
      router.push('/');
    }

    return () => clearTimeout(maxTimeout);
  }, [status, router]);

  return <AuthLoading />;
}
