'use client';

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-2 bg-forest-800 hover:bg-forest-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all"
    >
      <Printer className="w-4 h-4 text-gold-400" />
      <span>Print / Save PDF</span>
    </button>
  );
}
