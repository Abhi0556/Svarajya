'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// /register redirects to the real auth gateway at /start (signup mode prefilled)
// The /start page handles both login and signup via internal state
export default function RegisterRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/start');
  }, [router]);
  return null;
}
