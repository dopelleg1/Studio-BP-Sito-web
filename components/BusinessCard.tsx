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
    riferimento?: string;
    pubblica_indirizzo?: boolean;
    trattativa_riservata?: boolean;
    asta?: boolean;
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

  // Pulizia dei testi per evitare la dicitura [object Object] residua o passata
  const titleSanitized = listing.titolo ? listing.titolo.replace(/\[object Object\]/gi, '').trim() : '';
  const addressSanitized = listing.indirizzo ? listing.indirizzo.replace(/\[object Object\]/gi, '').replace(/^,\s*/, '').trim() : '';

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
            alt={titleSanitized} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = `https://picsum.photos/seed/${listing.id}/800/500`;
            }}
          />
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
            <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full text-primary bg-accent shadow-sm">
              {listing.tipo_contratto === 'VENDITA' ? 'Cessione Azienda' : 'Locazione B2B'}
            </span>
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 shadow-sm">
              B2B • BUSINESS
            </span>
            {listing.asta && (
              <span className="px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full bg-red-600 text-white shadow-md animate-pulse">
                ASTA TRIBUNALE
              </span>
            )}
          </div>
        </div>

        {/* Contenuto Corporate */}
        <div className="p-5 md:p-6 pb-4">
          <div className="flex items-center justify-between gap-1.5 mb-2.5">
            <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent text-[9px] font-black tracking-wider uppercase rounded-md">
              Rif: {listing.riferimento ? listing.riferimento.toUpperCase() : `#${listing.id}`}
            </span>
            {listing.asta && (
              <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[9.5px] font-black uppercase rounded-md tracking-wider">
                ASTA COMMERCIALE
              </span>
            )}
          </div>
          
          <h3 className="text-base font-black text-white leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-1">
            {titleSanitized}
          </h3>
          
          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-1">
            <MapPin size={11} className="shrink-0 text-accent" />
            <span className="truncate">{listing.pubblica_indirizzo !== false ? addressSanitized : "Indirizzo Riservato"}</span>
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
            {typeof details.numero_dipendenti === 'number' && details.numero_dipendenti > 0 && (
              <span>
                Organico: {details.numero_dipendenti} {details.numero_dipendenti === 1 ? 'dipendente' : 'dipendenti'}
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
              {listing.trattativa_riservata ? (
                <span className="text-amber-500">Trattativa Riservata</span>
              ) : (
                <>
                  € {formattedPrezzo}
                  {listing.tipo_contratto === 'AFFITTO' && <span className="text-[11px] font-normal text-slate-400"> /mese</span>}
                </>
              )}
            </span>
          </div>
          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded font-black tracking-wider uppercase font-sans">
            Esclusiva B2B
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/annunci/${listing.id}`}
            className="flex-1 bg-slate-900 hover:bg-slate-850 text-white border border-slate-800 hover:border-slate-700 font-black text-[10.5px] uppercase tracking-wide py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all text-center"
          >
            <span>Scopri Dettagli</span>
          </Link>

          <button 
            type="button"
            onClick={() => onSelect?.(listing.id)}
            className="flex-1 bg-accent hover:bg-amber-400 text-slate-950 font-black text-[10.5px] uppercase tracking-wide py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-97"
          >
            <span>Richiedi Info</span>
            <ArrowRight size={11} />
          </button>

          {/* Pulsante WhatsApp Diretto */}
          <a
            href={`https://wa.me/393792319582?text=${encodeURIComponent(
              `Salve Studio BP, vorrei maggiori informazioni per l'attività commerciale: *${titleSanitized}* (Rif: ${listing.riferimento || 'N/D'} - ID: #${listing.id}) ${listing.trattativa_riservata ? 'con Trattativa Riservata' : `da € ${formattedPrezzo}`}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Contatta via WhatsApp"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.63 2.028 14.16 1.001 11.53 1.002c-5.437 0-9.862 4.371-9.865 9.801a9.74 9.74 0 0 0 1.502 4.845L1.921 20.62l5.064-1.32c1.547.84 3.097 1.272 4.662 1.272l.001-.018zM17.47 14.39c-.326-.162-1.926-.948-2.221-1.055-.297-.108-.513-.162-.73.162-.216.324-.838 1.055-1.027 1.27-.189.217-.378.243-.704.082-.325-.162-1.372-.505-2.613-1.613-.966-.862-1.618-1.927-1.808-2.251-.19-.324-.02-.499.143-.66.147-.145.325-.378.487-.568.162-.189.216-.324.325-.54.109-.217.054-.405-.027-.568-.08-.162-.73-1.758-1.002-2.407-.265-.636-.53-.55-.73-.56-.19-.01-.405-.01-.62-.01-.215 0-.567.08-.864.405-.297.324-1.135 1.108-1.135 2.703 0 1.594 1.162 3.134 1.324 3.35.162.216 2.284 3.488 5.533 4.894.773.334 1.377.534 1.847.683.777.247 1.484.212 2.04.13.62-.092 1.925-.786 2.196-1.517.27-.73.27-1.353.19-1.485-.08-.135-.297-.216-.622-.38z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
