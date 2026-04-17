'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// /login redirects to the real auth gateway at /start (the Svarajya auth screen)
export default function LoginRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/start');
  }, [router]);
  return null;
}
