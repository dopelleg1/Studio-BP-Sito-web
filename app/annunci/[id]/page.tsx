import React from 'react';
import { ChevronLeft, Database, Phone } from 'lucide-react';
import Link from 'next/link';
import ListingDetailClient from '@/components/ListingDetailClient';
import { LogoRound, LogoRectangular } from '@/components/Logo';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Definizione del tipo ed estensioni per supportare il rendering asincrono
interface PropertyDetails {
  mq: number;
  stanze: number;
  bagni: number;
  classe_energetica: string;
  piano?: string;
  posto_auto: boolean;
  giardino: boolean;
}

interface BusinessDetails {
  settore_merceologico: string;
  fatturato_annuo?: number;
  canone_mura?: number;
  utile_netto?: number;
  numero_dipendenti?: number;
}

interface Listing {
  id: number;
  titolo: string;
  descrizione: string;
  prezzo: number;
  indirizzo: string;
  tipo_contratto: 'VENDITA' | 'AFFITTO';
  categoria: 'IMMOBILE' | 'BUSINESS';
  immagini: string[];
  propertyDetails?: PropertyDetails;
  businessDetails?: BusinessDetails;
  data_creazione: string;
  riferimento?: string;
  getrix_id?: string;
}

// Data seed duplicato qui sul server-side per l'id routing dinamico
const FallbackListings: Listing[] = [
  {
    id: 101,
    titolo: 'Attico Vista Duomo',
    descrizione: 'Prestigioso attico situato nel cuore di Milano con vista panoramica sul Duomo, interamente ristrutturato con materiali di pregio e domotica di ultima generazione. Offre una terrazza perimetrale di 60 mq, impianto di rinfrescamento canalizzato e finiture esclusive in marmo di Carrara.',
    prezzo: 1250000,
    indirizzo: 'Via Manzoni 12, Milano',
    tipo_contratto: 'VENDITA',
    categoria: 'IMMOBILE',
    immagini: ['https://picsum.photos/seed/duomo/1200/800'],
    data_creazione: '2026-06-10T14:30:00Z',
    propertyDetails: {
      mq: 180,
      stanze: 5,
      bagni: 3,
      classe_energetica: 'A+',
      piano: '4° con ascensore',
      posto_auto: true,
      giardino: false
    }
  },
  {
    id: 102,
    titolo: 'Bar Storico "Caffè Centrale"',
    descrizione: 'Cessione ramo d\'azienda di uno storico locale nel centro nevralgico di Roma. Elevato passaggio pedonale, arredi d\'epoca perfettamente manutenuti ed eccellente avviamento commerciale storico verificabile. Ideale per investitori che cercano una rendita finanziaria immediata sul territorio.',
    prezzo: 185000, 
    indirizzo: 'Corso Umberto I, Roma',
    tipo_contratto: 'VENDITA',
    categoria: 'BUSINESS',
    immagini: ['https://picsum.photos/seed/cafe/1200/800'],
    data_creazione: '2026-06-12T09:15:00Z',
    businessDetails: {
      settore_merceologico: 'Ristorazione / Bar',
      fatturato_annuo: 450000,
      canone_mura: 3500,
      utile_netto: 85000,
      numero_dipendenti: 4
    }
  },
  {
    id: 103,
    titolo: 'Villa Unifamiliare Girasole',
    descrizione: 'Splendida villa circondata dall\'ampio verde privato con piscina privata interrata, porticato esterno in cotto toscano e ampie vetrate ad elevato risparmio energetico. Pavimenti in legno di ulivo spazzolato, impianto fotovoltaico da 6kW e colonnina di ricarica per veicoli elettrici integrata.',
    prezzo: 680000,
    indirizzo: 'Via dei Girasoli 44, Forte dei Marmi',
    tipo_contratto: 'VENDITA',
    categoria: 'IMMOBILE',
    immagini: ['https://picsum.photos/seed/villa/1200/800'],
    data_creazione: '2026-06-13T11:00:00Z',
    propertyDetails: {
      mq: 250,
      stanze: 7,
      bagni: 4,
      classe_energetica: 'A4',
      piano: 'Terra e Primo',
      posto_auto: true,
      giardino: true
    }
  },
  {
    id: 104,
    titolo: 'Capannone Logistico di Testa',
    descrizione: 'Hub di logistica industriale d\'avanguardia situato a ridosso immediato dei principali snodi autostradali. Struttura antisismica in cemento armato precompresso, altezza utile interna 10 metri, 4 baie di carico e scarico automatizzate e spogliatoi, uffici di rappresentanza finemente rifiniti su 2 livelli.',
    prezzo: 12000,
    indirizzo: 'Zona Industriale Nord, Bologna',
    tipo_contratto: 'AFFITTO',
    categoria: 'BUSINESS',
    immagini: ['https://picsum.photos/seed/industrial/1200/800'],
    data_creazione: '2026-06-14T08:20:00Z',
    businessDetails: {
      settore_merceologico: 'Trasporti / Logistica',
      fatturato_annuo: 1800000,
      canone_mura: 12000,
      utile_netto: 320000,
      numero_dipendenti: 12
    }
  },
  {
    id: 105,
    titolo: 'Bilocale Design Brera',
    descrizione: 'Elegante bilocale interamente ristrutturato e arredato da primario studio milanese di architettura in una delle vie più storiche ed iconiche del quartiere Brera. Pavimenti in parquet massello posato a spina d\'pesce, impianto di climatizzazione autonomo a scomparsa, sanitari sospesi e balconata graziosa con affaccio interno cortile silenzioso.',
    prezzo: 450000,
    indirizzo: 'Via Solferino 18, Milano',
    tipo_contratto: 'VENDITA',
    categoria: 'IMMOBILE',
    immagini: ['https://picsum.photos/seed/brera/1200/800'],
    data_creazione: '2026-06-15T10:00:00Z',
    propertyDetails: {
      mq: 70,
      stanze: 2,
      bagni: 1,
      classe_energetica: 'B',
      piano: '2° con ascensore',
      posto_auto: false,
      giardino: false
    }
  },
  {
    id: 106,
    titolo: 'Albergo Boutique Riviera',
    descrizione: 'Splendido hotel boutique di 18 camere fronte mare con ristorante climatizzato, dehor perimetrale fiorito e ampio solarium attrezzato. Perfetto investimento turistico-ricettivo con bilanci consolidati ad elevata marginalità d\'esercizio storica. La proprietà include un parcheggio riservato per gli ospiti con 15 stalli auto.',
    prezzo: 1400000,
    indirizzo: 'Lungomare Adriatico 12, Rimini',
    tipo_contratto: 'VENDITA',
    categoria: 'BUSINESS',
    immagini: ['https://picsum.photos/seed/hotel/1200/800'],
    data_creazione: '2026-06-16T15:20:00Z',
    businessDetails: {
      settore_merceologico: 'Hotellerie',
      fatturato_annuo: 890000,
      canone_mura: 0,
      utile_netto: 195000,
      numero_dipendenti: 8
    }
  }
];

export default async function DettaglioAnnuncio({ params }: { params: Promise<{ id: string }> }) {
  // Risoluzione asincrona sicura del parametro in Next.js 15
  const resolvedParams = await params;
  const idInt = parseInt(resolvedParams.id, 10);

  let activeListing = FallbackListings[0];

  try {
    const dbl = await db.listing.findUnique({
      where: { id: idInt },
      include: {
        propertyDetails: true,
        businessDetails: true,
      }
    });

    if (dbl) {
      activeListing = {
        id: dbl.id,
        titolo: dbl.titolo,
        descrizione: dbl.descrizione,
        prezzo: Number(dbl.prezzo),
        indirizzo: dbl.indirizzo,
        tipo_contratto: dbl.tipo_contratto as 'VENDITA' | 'AFFITTO',
        categoria: dbl.categoria as 'IMMOBILE' | 'BUSINESS',
        immagini: Array.isArray(dbl.immagini) ? (dbl.immagini as string[]) : [],
        data_creazione: dbl.data_creazione.toISOString(),
        riferimento: dbl.riferimento || undefined,
        getrix_id: dbl.getrix_id || undefined,
        propertyDetails: dbl.propertyDetails ? {
          mq: Number(dbl.propertyDetails.mq),
          stanze: Number(dbl.propertyDetails.stanze),
          bagni: Number(dbl.propertyDetails.bagni),
          classe_energetica: dbl.propertyDetails.classe_energetica,
          piano: dbl.propertyDetails.piano || undefined,
          posto_auto: Boolean(dbl.propertyDetails.posto_auto),
          giardino: Boolean(dbl.propertyDetails.giardino),
        } : undefined,
        businessDetails: dbl.businessDetails ? {
          settore_merceologico: dbl.businessDetails.settore_merceologico,
          fatturato_annuo: dbl.businessDetails.fatturato_annuo ? Number(dbl.businessDetails.fatturato_annuo) : undefined,
          canone_mura: dbl.businessDetails.canone_mura ? Number(dbl.businessDetails.canone_mura) : undefined,
          utile_netto: dbl.businessDetails.utile_netto ? Number(dbl.businessDetails.utile_netto) : undefined,
          numero_dipendenti: dbl.businessDetails.numero_dipendenti || undefined,
        } : undefined,
      };
    } else {
      const found = FallbackListings.find(l => l.id === idInt);
      if (found) {
        activeListing = found;
      }
    }
  } catch (err) {
    console.error("Errore nel caricamento del listing dal db:", err);
    const found = FallbackListings.find(l => l.id === idInt);
    if (found) {
      activeListing = found;
    }
  }

  const isB2C = activeListing.categoria === 'IMMOBILE';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      
      {/* Navigazione Superiore Condivisa */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs px-4 md:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <LogoRound className="w-12 h-12 shadow-md shrink-0" />
          <div className="flex flex-col">
            <LogoRectangular className="h-8 w-auto block text-slate-950" />
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Link href="/#hero-section" className="hover:text-slate-900 transition-colors">Scegli Percorso</Link>
          <Link href="/?filter=immobili" className="hover:text-slate-900 transition-colors">Immobili</Link>
          <Link href="/?filter=attivita" className="hover:text-slate-900 transition-colors">Attività in vendita</Link>
          <Link 
            href="/"
            className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white hover:text-amber-400 transition-colors rounded-lg flex items-center gap-2 text-[10px] font-mono font-bold"
          >
            <Database size={12} />
            Schema Prisma Sincronizzato
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:+3906123456" 
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-950 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Phone size={13} className="text-slate-500" />
            <span>+39 06 123456</span>
          </a>
        </div>
      </nav>

      {/* Intestazione breadcrumb con link di ritorno */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-800 transition-colors flex items-center justify-center"
              aria-label="Torna indietro alla home"
            >
              <ChevronLeft size={16} />
            </Link>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
                <span>Intermediazione Studio BP</span>
                <span>/</span>
                <span className="text-slate-600">{isB2C ? 'Immobili Residenziali' : 'Cessioni d&apos;Azienda'}</span>
              </p>
              <h1 className="text-lg font-black tracking-tight text-slate-950 truncate max-w-sm sm:max-w-md md:max-w-xl">
                {activeListing.titolo}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] self-start sm:self-auto">
            <span className="text-slate-400">Prisma Database Entity:</span>
            <span className="px-2 py-0.5 bg-slate-950 text-emerald-400 rounded font-bold border border-slate-800">
              {isB2C ? 'PropertyDetails B2C' : 'BusinessDetails B2B'}
            </span>
          </div>
        </div>
      </header>

      {/* Database sync banner */}
      <div className="bg-slate-950 text-amber-400 px-4 py-3 border-b border-amber-500/20 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono flex items-center gap-1.5 leading-relaxed">
            <Database size={13} className="text-amber-500" />
            <span>Riferimento Annuncio Correntemente Caricato: <strong className="text-white">{activeListing.riferimento ? activeListing.riferimento.toUpperCase() : `#${activeListing.id}`}</strong> • Stato SQL Sincronizzato con schema relazionale.</span>
          </p>
          <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded uppercase font-bold tracking-wider leading-none shrink-0">
            Prisma Schema Live Simulator
          </span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 py-8 md:py-12 flex-1">
        <ListingDetailClient listing={activeListing} />
      </main>

      {/* FOOTER BAR Condiviso */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 md:px-8 shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3">
              <LogoRound className="w-12 h-12 shrink-0" />
              <LogoRectangular className="h-9 w-auto" />
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-slate-400 font-semibold">
              Società accreditata iscritta alla FIMAA. Agenzia professionale per la cessione di rami d&apos;azienda e intermediazione immobiliare di pregio su base fiduciaria nazionale.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Sede Centrale</p>
            <p className="font-semibold text-slate-400">Via dei Condotti 12, Roma (RM)</p>
            <p className="font-semibold text-slate-400">P.IVA 092834571295</p>
            <p className="font-semibold text-slate-400">Iscrizione REA 248102</p>
          </div>

          <div className="space-y-2 text-xs font-semibold">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Database Tech Stack</p>
            <p className="text-slate-400">ORM Client: Prisma v5.9</p>
            <p className="text-slate-400">Database Engine: MySQL (Native)</p>
            <p className="text-slate-400">Next.js 15 App Router</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500 gap-4">
          <p>© 2026 Studio BP Italia S.r.l. Tutti i diritti riservati.</p>
          <div className="flex gap-4">
            <span>Ingegneria Prisma Client</span>
            <span>MySQL Connection Secured</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
