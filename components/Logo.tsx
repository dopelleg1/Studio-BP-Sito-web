'use client';

import React from 'react';

export function LogoRound({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldGradRound" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd99e" />
          <stop offset="30%" stopColor="#d4af37" />
          <stop offset="70%" stopColor="#aa7c11" />
          <stop offset="100%" stopColor="#ffebb3" />
        </linearGradient>
      </defs>
      {/* Cerchio Esterno Sfondo */}
      <circle cx="250" cy="250" r="240" fill="#131313" stroke="url(#goldGradRound)" strokeWidth="10" />
      {/* Cerchio Interno Sottile */}
      <circle cx="250" cy="250" r="222" fill="none" stroke="url(#goldGradRound)" strokeWidth="3" />
      
      {/* Testo "STUDIO" leggermente curvato tramite textPath */}
      <path id="curveStudioPath" d="M 120 180 A 140 140 0 0 1 380 180" fill="none" />
      <text fill="url(#goldGradRound)" className="font-sans" fontSize="48" letterSpacing="12" fontWeight="300">
        <textPath href="#curveStudioPath" startOffset="50%" textAnchor="middle">
          STUDIO
        </textPath>
      </text>

      {/* Testo Centrale "BP" molto grande */}
      <text 
        x="250" 
        y="325" 
        fill="url(#goldGradRound)" 
        className="font-sans" 
        fontSize="175" 
        fontWeight="800" 
        letterSpacing="2" 
        textAnchor="middle"
      >
        BP
      </text>

      {/* Testo "BUSINESS & HOUSES" sul fondo, curvato o dritto */}
      <text 
        x="250" 
        y="370" 
        fill="url(#goldGradRound)" 
        className="font-sans" 
        fontSize="24" 
        fontWeight="400" 
        letterSpacing="7" 
        textAnchor="middle"
      >
        BUSINESS & HOUSES
      </text>
    </svg>
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
