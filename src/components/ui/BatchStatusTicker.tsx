'use client';

import React from 'react';
import { Sparkles, Clock, ShieldCheck, ThermometerSnowflake } from 'lucide-react';

export default function BatchStatusTicker() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-forest-900 via-forest-850 to-forest-900 text-cream-100 rounded-2xl p-3 sm:p-4 border border-forest-700/60 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-[13px]">
          <div className="flex items-center space-x-2.5">
            <span className="relative flex h-3 w-3 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="font-semibold text-white">
              <span className="text-gold-400 font-bold uppercase tracking-wider text-[11px] block sm:inline sm:mr-2">
                Live Farm Update
              </span>
              <span>Next Morning Batch: Milking at 4:30 AM · Insulated Cold-Chain Chilled</span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-3 sm:gap-5 text-forest-200 text-xs">
            <span className="inline-flex items-center space-x-1.5">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-gold-400" />
              <span>Chilled below 4°C</span>
            </span>
            <span className="inline-flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lactometer Verified: 0% Water</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 text-gold-300 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Doorstep: 7:00 AM – 11:30 AM</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
