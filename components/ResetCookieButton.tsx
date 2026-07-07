'use client';

import React from 'react';

export default function ResetCookieButton() {
  const handleReset = () => {
    localStorage.removeItem('sbp_gdpr_accepted');
    window.location.reload();
  };

  return (
    <button 
      onClick={handleReset}
      className="hover:text-amber-500 transition-colors cursor-pointer uppercase font-bold text-[10px]"
    >
      Consenso Cookie
    </button>
  );
}
