'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GoToPage({page}) {
  const router = useRouter();

  useEffect(() => {
    router.push(page);
  }, []);

  return null;
}
