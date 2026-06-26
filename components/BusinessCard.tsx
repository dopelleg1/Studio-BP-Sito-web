'use client';

import React from 'react';
import { MapPin, TrendingUp, Briefcase, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BusinessDetails {
  settore_merceologico: string;
  fatturato_annuo?: number | string | null;
  canone_mura?: number | string | null;
  utile_netto?: number | string | null;
  numero_dipendenti?: number | null;
}

interface BusinessCardProps {
  listing: {
    id: number;
    titolo: string;
    descrizione: string;
    prezzo: number | string;
    indirizzo: string;
    tipo_contratto: 'VENDITA' | 'AFFITTO';
    immagini: string | string[] | any;
  };
  details: BusinessDetails;
  onSelect?: (id: number) => void;
}

export default function BusinessCard({ listing, details, onSelect }: BusinessCardProps) {
  // Parsing sicuro delle immagini
  let imageUrl = 'https://picsum.photos/seed/business/800/500';
  if (listing.immagini) {
    if (typeof listing.immagini === 'string') {
      try {
        const parsed = JSON.parse(listing.immagini);
        if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
      } catch {
        imageUrl = listing.immagini;
      }
    } else if (Array.isArray(listing.immagini) && listing.immagini.length > 0) {
      imageUrl = listing.immagini[0];
    }
  }

  const formattedPrezzo = typeof listing.prezzo === 'number' 
    ? listing.prezzo.toLocaleString('it-IT') 
    : parseFloat(listing.prezzo.toString()).toLocaleString('it-IT');

  const formattedFatturato = details.fatturato_annuo 
    ? (typeof details.fatturato_annuo === 'number' 
        ? details.fatturato_annuo.toLocaleString('it-IT') 
        : parseFloat(details.fatturato_annuo.toString()).toLocaleString('it-IT'))
    : null;

  const formattedCanoneMura = details.canone_mura
    ? (typeof details.canone_mura === 'number'
        ? details.canone_mura.toLocaleString('it-IT')
        : parseFloat(details.canone_mura.toString()).toLocaleString('it-IT'))
    : null;

  return (
    <div 
      id={`business-card-${listing.id}`}
      className="group bg-primary text-white rounded-2xl border border-slate-850 overflow-hidden shadow-md hover:shadow-2xl hover:border-accent/60 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        {/* Immagine di Copertina Corporate */}
        <div className="relative h-52 w-full bg-slate-950 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt={listing.titolo} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 flex gap-1.5">
            <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full text-primary bg-accent shadow-sm">
              {listing.tipo_contratto === 'VENDITA' ? 'Cessione Azienda' : 'Locazione B2B'}
            </span>
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 shadow-sm">
              B2B • BUSINESS
            </span>
          </div>
        </div>

        {/* Contenuto Corporate */}
        <div className="p-5 md:p-6 pb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-accent mb-1.5">
            <Briefcase size={12} />
            <span>Codice Id: #{listing.id}</span>
          </div>
          
          <h3 className="text-base font-black text-white leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-1">
            {listing.titolo}
          </h3>
          
          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-1">
            <MapPin size={11} className="shrink-0 text-accent" />
            <span className="truncate">{listing.indirizzo}</span>
          </p>
          
          <p className="text-xs text-slate-350 leading-relaxed mt-2.5 line-clamp-2 min-h-[32px]">
            {listing.descrizione}
          </p>

          {/* Sezione Numeri & Indicatori Finanziari (Corporate B2B) */}
          <div className="grid grid-cols-1 gap-2 mt-4 pt-3.5 border-t border-slate-800/80">
            {/* Settore */}
            <div className="flex justify-between items-center text-xs p-2 bg-slate-950/50 border border-slate-800/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settore</span>
              <span className="font-extrabold text-accent">{details.settore_merceologico}</span>
            </div>

            {/* Fatturato Estimato */}
            <div className="flex justify-between items-center text-xs p-2 bg-slate-950/50 border border-slate-800/40 rounded-xl">
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <TrendingUp size={11} className="text-accent" />
                <span>Fatturato Stima</span>
              </div>
              <span className="font-extrabold text-white">
                {formattedFatturato ? `€ ${formattedFatturato}/anno` : 'Riservato'}
              </span>
            </div>

            {/* Canone Locazione / Mura */}
            <div className="flex justify-between items-center text-xs p-2 bg-slate-950/50 border border-slate-800/40 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Canone Mura</span>
              <span className="font-extrabold text-white">
                {formattedCanoneMura ? `€ ${formattedCanoneMura}/mese` : 'Mura Incluse'}
              </span>
            </div>
          </div>

          {/* Indicatori Extra */}
          <div className="flex gap-2.5 justify-between items-center mt-3 text-[9px] text-slate-400 font-bold">
            {details.utile_netto && (
              <span className="flex items-center gap-1 text-emerald-400">
                Utile Netto: € {parseFloat(details.utile_netto.toString()).toLocaleString('it-IT')}/anno
              </span>
            )}
            {details.numero_dipendenti && (
              <span>
                Organico: {details.numero_dipendenti} dipendenti
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer della Card con Valore di Cessione e Azioni CRO dual-button */}
      <div className="bg-slate-950 border-t border-slate-850 px-5 py-4 md:px-6 space-y-3.5 mt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none block">Valutazione</span>
            <span className="text-base font-black text-accent mt-0.5 block">
              € {formattedPrezzo}
              {listing.tipo_contratto === 'AFFITTO' && <span className="text-[11px] font-normal text-slate-500"> /mese</span>}
            </span>
          </div>
          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded font-black tracking-wider uppercase font-sans">
            Esclusiva B2B
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href={`/annunci/${listing.id}`}
            className="bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 hover:border-slate-700 font-black text-[10.5px] uppercase tracking-wide py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all text-center"
          >
            <span>Scopri Dettagli</span>
          </Link>

          <button 
            type="button"
            onClick={() => onSelect?.(listing.id)}
            className="bg-accent hover:bg-amber-400 text-slate-950 font-black text-[10.5px] uppercase tracking-wide py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-97"
          >
            <span>Richiedi Info</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
