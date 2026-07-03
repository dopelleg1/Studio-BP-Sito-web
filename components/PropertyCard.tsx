'use client';

import React from 'react';
import { MapPin, Building, Ruler, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface PropertyDetails {
  mq: number;
  stanze: number;
  bagni: number;
  classe_energetica: string;
  piano?: string | null;
  posto_auto: boolean;
  giardino: boolean;
}

interface PropertyCardProps {
  listing: {
    id: number;
    titolo: string;
    descrizione: string;
    prezzo: number | string;
    indirizzo: string;
    tipo_contratto: 'VENDITA' | 'AFFITTO';
    immagini: string | string[] | any;
    riferimento?: string;
  };
  details: PropertyDetails;
  onSelect?: (id: number) => void;
}

export default function PropertyCard({ listing, details, onSelect }: PropertyCardProps) {
  // Parsing sicuro delle immagini
  let imageUrl = 'https://picsum.photos/seed/property/800/500';
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

  // Pulizia dei testi per evitare la dicitura [object Object] residua o passata
  const titleSanitized = listing.titolo ? listing.titolo.replace(/\[object Object\]/gi, '').trim() : '';
  const addressSanitized = listing.indirizzo ? listing.indirizzo.replace(/\[object Object\]/gi, '').replace(/^,\s*/, '').trim() : '';

  return (
    <div 
      id={`property-card-${listing.id}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl hover:border-accent/60 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        {/* Immagine di Copertina con Badge contratto */}
        <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={imageUrl} 
            alt={titleSanitized} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 flex gap-1.5">
            <span className="px-3 py-1 text-[10px] font-extrabold tracking-widest uppercase rounded-full text-white bg-primary shadow-sm border border-slate-700/30">
              {listing.tipo_contratto}
            </span>
            <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded-full bg-accent text-primary font-black shadow-sm">
              B2C • IMMOBILE
            </span>
          </div>
        </div>

        {/* Contenuti di Testo */}
        <div className="p-5 md:p-6 pb-4">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">
            <Building size={12} className="text-accent" />
            <span>Codice Rif.: {listing.riferimento ? listing.riferimento.toUpperCase() : `#${listing.id}`}</span>
          </div>

          <h3 className="text-base font-black text-primary leading-snug group-hover:text-accent transition-colors duration-200 line-clamp-1">
            {titleSanitized}
          </h3>
          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1 mt-1">
            <MapPin size={11} className="shrink-0 text-accent font-bold" />
            <span className="truncate">{addressSanitized}</span>
          </p>
          <p className="text-xs text-slate-500 leading-relaxed mt-2.5 line-clamp-2 min-h-[32px]">
            {listing.descrizione}
          </p>

          {/* Griglia delle Caratteristiche B2C (Mq, Locali, Classe) con icone color Accent */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-slate-100">
            <div className="p-2 bg-slate-50 border border-slate-200/50 rounded-xl text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Superficie</span>
              <span className="text-xs font-black text-primary">{details.mq} mq</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200/50 rounded-xl text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Locali</span>
              <span className="text-xs font-black text-primary">{details.stanze} vani</span>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-200/50 rounded-xl text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Classe</span>
              <span className="text-xs font-black text-accent">{details.classe_energetica}</span>
            </div>
          </div>

          {/* Servizi Aggiuntivi sotto forma di mini badge */}
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {details.posto_auto && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">
                Auto
              </span>
            )}
            {details.giardino && (
              <span className="px-2 py-0.5 bg-accent/10 text-accent-hover rounded text-[9px] font-bold border border-accent/20">
                Giardino Privato
              </span>
            )}
            {details.piano && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-mono truncate max-w-[120px]">
                {details.piano}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Card con Prezzo ed Azioni CRO dual-button */}
      <div className="bg-slate-50 border-t border-slate-100 px-5 py-4 md:px-6 space-y-3.5 mt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest leading-none block">Prezzo Richiesto</span>
            <span className="text-base font-black text-primary mt-0.5 block">
              € {formattedPrezzo}
              {listing.tipo_contratto === 'AFFITTO' && <span className="text-[11px] font-normal text-slate-400"> /mese</span>}
            </span>
          </div>
          <span className="text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded font-black tracking-wider uppercase font-sans">
            Esclusiva B2C
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/annunci/${listing.id}`}
            className="flex-1 bg-white hover:bg-slate-100 text-primary border border-slate-200 hover:border-slate-350 font-black text-[10.5px] uppercase tracking-wide py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all text-center"
          >
            <span>Scopri Dettagli</span>
          </Link>

          <button 
            type="button"
            onClick={() => onSelect?.(listing.id)}
            className="flex-1 bg-accent hover:bg-amber-500 text-primary font-black text-[10.5px] uppercase tracking-wide py-2.5 rounded-xl flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
          >
            <span>Richiedi Info</span>
            <ArrowRight size={11} />
          </button>

          {/* Pulsante WhatsApp Diretto */}
          <a
            href={`https://wa.me/393792319582?text=${encodeURIComponent(
              `Salve Studio BP, vorrei maggiori informazioni per l'immobile: *${titleSanitized}* (Rif: ${listing.riferimento || 'N/D'} - ID: #${listing.id}) da € ${formattedPrezzo}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Contatta via WhatsApp"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.63 2.028 14.16 1.001 11.53 1.002c-5.437 0-9.862 4.371-9.865 9.801a9.74 9.74 0 0.0 1.502 4.845L1.921 20.62l5.064-1.32c1.547.84 3.097 1.272 4.662 1.272l.001-.018zM17.47 14.39c-.326-.162-1.926-.948-2.221-1.055-.297-.108-.513-.162-.73.162-.216.324-.838 1.055-1.027 1.27-.189.217-.378.243-.704.082-.325-.162-1.372-.505-2.613-1.613-.966-.862-1.618-1.927-1.808-2.251-.19-.324-.02-.499.143-.66.147-.145.325-.378.487-.568.162-.189.216-.324.325-.54.109-.217.054-.405-.027-.568-.08-.162-.73-1.758-1.002-2.407-.265-.636-.53-.55-.73-.56-.19-.01-.405-.01-.62-.01-.215 0-.567.08-.864.405-.297.324-1.135 1.108-1.135 2.703 0 1.594 1.162 3.134 1.324 3.35.162.216 2.284 3.488 5.533 4.894.773.334 1.377.534 1.847.683.777.247 1.484.212 2.04.13.62-.092 1.925-.786 2.196-1.517.27-.73.27-1.353.19-1.485-.08-.135-.297-.216-.622-.38z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
