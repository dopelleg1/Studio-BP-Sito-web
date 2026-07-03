'use client';

import React from 'react';

export function LogoRound({ className = "w-9 h-9" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src="/logo.png" 
      alt="Studio BP" 
      className={`rounded-full object-contain ${className}`}
    />
  );
}

export function LogoRectangular({ className = "h-14 w-auto" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 850 240" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGradRect" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffd9a6" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b4966d" />
        </linearGradient>
      </defs>
      {/* Testo Primo Livello "STUDIO BP" */}
      <text 
        x="0" 
        y="115" 
        fill="url(#goldGradRect)" 
        className="font-sans" 
        fontSize="125" 
        fontWeight="300" 
        letterSpacing="18"
      >
        STUDIO BP
      </text>
      
      {/* Testo Secondo Livello "Business & Houses" */}
      <text 
        x="45" 
        y="200" 
        fill="url(#goldGradRect)" 
        className="font-sans" 
        fontSize="64" 
        fontWeight="300" 
        letterSpacing="7"
      >
        Business & Houses
      </text>
    </svg>
  );
}
