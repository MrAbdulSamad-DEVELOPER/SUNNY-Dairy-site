'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 550);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!animating) return null;

  return <div className="top-nav-progress" aria-hidden="true" />;
}
