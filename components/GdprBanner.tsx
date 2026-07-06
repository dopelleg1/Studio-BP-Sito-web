'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GdprBanner() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('sbp_gdpr_accepted');
    if (!accepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sbp_gdpr_accepted', 'true');
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('sbp_gdpr_accepted', 'false');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:max-w-2xl md:mx-auto bg-slate-900/95 backdrop-blur-md text-white border border-slate-800 p-5 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4 transition-all duration-500 animate-slide-up">
      <div className="flex-1 space-y-1.5 text-center md:text-left">
        <p className="text-xs md:text-sm font-extrabold tracking-wide uppercase text-amber-500">Informativa sui Cookie &amp; Privacy</p>
        <p className="text-[10px] md:text-xs text-slate-300 leading-relaxed font-semibold">
          Studio BP Italia utilizza i cookie per ottimizzare la navigazione e migliorare l&apos;esperienza d&apos;uso. Cliccando su &quot;Accetta Tutti&quot; acconsenti al trattamento dei dati in conformità con la nostra{' '}
          <Link href="/privacy" className="text-amber-400 hover:text-amber-300 underline cursor-pointer">
            Privacy Policy
          </Link>.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-center">
        <button
          onClick={handleDecline}
          className="px-4 py-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
        >
          Rifiuta
        </button>
        <button
          onClick={handleAccept}
          className="px-5 py-2.5 text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all hover:scale-102 cursor-pointer shadow-md shadow-amber-500/10"
        >
          Accetta Tutti
        </button>
      </div>
    </div>
  );
}
