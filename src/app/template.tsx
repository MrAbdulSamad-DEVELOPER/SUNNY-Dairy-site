'use client';

import React from 'react';

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-transition-wrapper min-h-full w-full">
      {children}
    </div>
  );
}
