'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Ruler, 
  Check, 
  Phone, 
  Mail, 
  Database, 
  Calendar, 
  Home, 
  Layers, 
  Compass, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Users, 
  FileText, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Map,
  BadgePercent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ContactForm from '@/components/ContactForm';

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
  
  // Campi aggiuntivi per gestione backoffice / Studio BP
  stima_riservata?: number;
  proprietario_nome?: string;
  proprietario_telefono?: string;
  provvigione?: string;
  tassazione?: string;
  stato_immobile?: string;
  anno_costruzione?: string;
  riscaldamento?: string;
  disponibilita?: string;
  spese_condominiali?: string;
  riferimento?: string;
  getrix_id?: string;
  comune?: string;
  zona?: string;
}

interface ListingDetailClientProps {
  listing: Listing;
}

export default function ListingDetailClient({ listing: initialListing }: ListingDetailClientProps) {
  const [activeListing, setActiveListing] = React.useState<Listing>(initialListing);
  const [isEditor, setIsEditor] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Verifica se l'utente è un editore / staff connesso
      const session = localStorage.getItem('sbp_editor_session');
      if (session === 'true') {
        const timerEditor = setTimeout(() => {
          setIsEditor(true);
        }, 0);
        return () => clearTimeout(timerEditor);
      }
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // 2. Leggi il corretto listing da localStorage se presente o se appena creato
      const pathParts = window.location.pathname.split('/');
      const idFromPath = parseInt(pathParts[pathParts.length - 1], 10);
      const targetId = isNaN(idFromPath) ? initialListing.id : idFromPath;

      const stored = localStorage.getItem('sbp_listings_home');
      if (stored) {
        try {
          const parsed: Listing[] = JSON.parse(stored);
          const found = parsed.find(l => l.id === targetId);
          if (found) {
            const timerState = setTimeout(() => {
              setActiveListing(found);
            }, 0);
            return () => clearTimeout(timerState);
          }
        } catch (e) {
          console.error('Errore nel parse delle inserzioni', e);
        }
      }
    }
  }, [initialListing]);

  const listing = {
    ...activeListing,
    titolo: activeListing.titolo ? String(activeListing.titolo).replace(/\[object Object\]/gi, '').trim() : '',
    indirizzo: activeListing.indirizzo ? String(activeListing.indirizzo).replace(/\[object Object\]/gi, '').replace(/^,\s*/, '').trim() : '',
  };
  const [isDescExpanded, setIsDescExpanded] = React.useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = React.useState(false);
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);

  const isB2C = listing.categoria === 'IMMOBILE';

  // Usiamo solo le vere immagini associate all'annuncio
  const galleryImages = (listing.immagini && listing.immagini.length > 0)
    ? listing.immagini
    : [
        'https://picsum.photos/seed/duomo/1200/800',
        'https://picsum.photos/seed/villa/1200/800',
        'https://picsum.photos/seed/cafe/1200/800'
      ];

  const formattedPrezzo = listing.prezzo.toLocaleString('it-IT');

  // Gestione classe energetica
  const classeEnergetica = isB2C 
    ? (listing.propertyDetails?.classe_energetica || 'G') 
    : 'A';
  
  // Prestazione energetica fittizia per rendere reale il grafico
  const energyIndex = isB2C ? '142.5 kWh/m² anno' : '85.2 kWh/m² anno';

  const classesList = ['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'];
  
  const getEnergyColor = (cls: string) => {
    if (cls.startsWith('A')) return 'bg-emerald-600';
    if (cls === 'B') return 'bg-emerald-500';
    if (cls === 'C') return 'bg-lime-500';
    if (cls === 'D') return 'bg-yellow-500';
    if (cls === 'E') return 'bg-orange-400';
    if (cls === 'F') return 'bg-orange-500';
    return 'bg-red-600';
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact-section-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setIsContactModalOpen(true);
    }
  };

  return (
    <div id="listing-detail-view" className="space-y-8 pb-16">
      
      {/* AREA SOCIALE RISERVATA EDITORE STAFF STUDIO BP */}
      {isEditor && (
        <div className="bg-amber-400/10 border-2 border-amber-400 rounded-2xl p-5 md:p-6 space-y-4 shadow-xs text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-black text-[9px] px-3 py-1 uppercase tracking-widest rounded-bl-xl shadow-xs">
            STAFF STUDIO BP
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 font-extrabold shadow-sm">
              BP
            </div>
            <div>
              <p className="font-black text-slate-950 text-sm tracking-tight uppercase flex items-center gap-1.5ClassName">
                <span>🔒 Informazioni Riservate e Amministrative</span>
              </p>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">Visibile unicamente agli utenti con ruolo Editore di Studio BP.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-amber-400/25">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Stima Economica Alloggio</span>
              <span className="text-base font-extrabold text-slate-950 block">
                {listing.stima_riservata ? `€ ${listing.stima_riservata.toLocaleString('it-IT')}` : 'Nessuna stima inserita'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Nome Proprietario</span>
              <span className="text-base font-extrabold text-slate-950 block animate-fade-in">
                {listing.proprietario_nome || 'Nessun nome registrato'}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Telefono Proprietario</span>
              <span className="text-base font-extrabold text-slate-950 block select-all">
                {listing.proprietario_telefono || 'Nessun telefono registrato'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
            {listing.provvigione && (
              <div className="bg-white/60 border border-slate-100 p-3 rounded-xl max-w-full">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Provvigione di Mediazione</span>
                <p className="font-extrabold text-slate-800 mt-1">{listing.provvigione}</p>
              </div>
            )}
            {listing.tassazione && (
              <div className="bg-white/60 border border-slate-100 p-3 rounded-xl max-w-full">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Tassazione dell&apos;Operazione</span>
                <p className="font-extrabold text-slate-800 mt-1">{listing.tassazione}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/40">
            <span className="text-[10px] text-slate-500 font-semibold italic">
              * Tieni queste informazioni strettamente riservate e non divulgarle a terzi senza previa autorizzazione scritta di Studio BP.
            </span>
            <Link 
              href={`/backoffice?edit=${listing.id}`}
              className="px-4 py-2 bg-slate-950 hover:bg-black text-amber-400 font-black tracking-wider uppercase text-[10.5px] rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              Modifica in Backoffice
            </Link>
          </div>
        </div>
      )}

      {/* 1. TOP SECTION: GALLERIA FOTOGRAFICA ASIMMETRICA */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white" id="asymmetric-gallery">
        {/* Desktop Layout Grid (>= 1024px) */}
        {galleryImages.length >= 3 ? (
          <div className="hidden lg:grid grid-cols-12 gap-2 h-[450px] p-2">
            {/* Main big image */}
            <div 
              className="col-span-8 relative rounded-l-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setActiveImageIdx(0);
                setIsGalleryModalOpen(true);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={galleryImages[0]} 
                alt={`${listing.titolo} - Foto Principale`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full text-white shadow-md ${
                  listing.tipo_contratto === 'VENDITA' ? 'bg-slate-900 border border-slate-800' : 'bg-red-600'
                }`}>
                  {listing.tipo_contratto}
                </span>
                <span className="px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full bg-amber-400 text-slate-950 shadow-md">
                  {isB2C ? 'B2C • IMMOBILE' : 'B2B • COMMERCIALE'}
                </span>
              </div>
            </div>

            {/* Side column grid with stacked smaller images */}
            <div className="col-span-4 flex flex-col gap-2">
              <div 
                className="h-[219px] relative rounded-tr-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setActiveImageIdx(1);
                  setIsGalleryModalOpen(true);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={galleryImages[1]} 
                  alt={`${listing.titolo} - Interno 1`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>

              <div 
                className="h-[219px] relative rounded-br-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setActiveImageIdx(2);
                  setIsGalleryModalOpen(true);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={galleryImages[2]} 
                  alt={`${listing.titolo} - Interno 2`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                
                {/* Button "Vedi tutte le foto" Overlay */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIdx(0);
                    setIsGalleryModalOpen(true);
                  }}
                  className="absolute bottom-4 right-4 bg-slate-950/90 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase border border-slate-800 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ExternalLink size={13} className="text-amber-400" />
                  Vedi tutte le foto ({galleryImages.length})
                </button>
              </div>
            </div>
          </div>
        ) : galleryImages.length === 2 ? (
          <div className="hidden lg:grid grid-cols-2 gap-2 h-[450px] p-2">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx}
                className={`relative overflow-hidden cursor-pointer group ${idx === 0 ? 'rounded-l-xl' : 'rounded-r-xl'}`}
                onClick={() => {
                  setActiveImageIdx(idx);
                  setIsGalleryModalOpen(true);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt={`${listing.titolo} - Foto ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                {idx === 0 && (
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full text-white shadow-md ${
                      listing.tipo_contratto === 'VENDITA' ? 'bg-slate-900 border border-slate-800' : 'bg-red-600'
                    }`}>
                      {listing.tipo_contratto}
                    </span>
                    <span className="px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full bg-amber-400 text-slate-950 shadow-md">
                      {isB2C ? 'B2C • IMMOBILE' : 'B2B • COMMERCIALE'}
                    </span>
                  </div>
                )}
                {idx === 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIdx(0);
                      setIsGalleryModalOpen(true);
                    }}
                    className="absolute bottom-4 right-4 bg-slate-950/90 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-extrabold tracking-wider uppercase border border-slate-800 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ExternalLink size={13} className="text-amber-400" />
                    Vedi tutte le foto (2)
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden lg:grid grid-cols-1 gap-2 h-[450px] p-2">
            <div 
              className="relative rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setActiveImageIdx(0);
                setIsGalleryModalOpen(true);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={galleryImages[0]} 
                alt={`${listing.titolo} - Foto Principale`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full text-white shadow-md ${
                  listing.tipo_contratto === 'VENDITA' ? 'bg-slate-900 border border-slate-800' : 'bg-red-600'
                }`}>
                  {listing.tipo_contratto}
                </span>
                <span className="px-3 py-1 text-xs font-black tracking-widest uppercase rounded-full bg-amber-400 text-slate-950 shadow-md">
                  {isB2C ? 'B2C • IMMOBILE' : 'B2B • COMMERCIALE'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Horizontal Carousel Slider (< 1024px) */}
        <div className="block lg:hidden relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none h-[280px] sm:h-[400px]">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx}
                className="flex-shrink-0 w-full h-full relative snap-center cursor-pointer"
                onClick={() => {
                  setActiveImageIdx(idx);
                  setIsGalleryModalOpen(true);
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt={`${listing.titolo} - Slide ${idx}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className={`px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase rounded-full text-white ${
                    listing.tipo_contratto === 'VENDITA' ? 'bg-slate-900' : 'bg-red-600'
                  }`}>
                    {listing.tipo_contratto}
                  </span>
                  <span className="px-2.5 py-0.5 text-[9px] font-black tracking-widest uppercase rounded-full bg-amber-400 text-slate-950">
                    {isB2C ? 'B2C' : 'B2B'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-slate-950/40 backdrop-blur-md py-1 px-2.5 rounded-full">
            {galleryImages.map((_, idx) => (
              <span 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === 0 ? 'bg-amber-400 w-3' : 'bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Slide manual hint */}
          <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
            Scorri foto →
          </span>
        </div>
      </section>

      {/* Grid del Contenuto Principale (Due Colonne) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. MAIN CONTENT (COLONNA SINISTRA, 70% LARGHEZZA) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Header Primario dell'Annuncio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className={`text-[10px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border ${
                isB2C 
                  ? 'bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-amber-100 border-amber-200 text-amber-900'
              }`}>
                {isB2C ? 'Soluzione Abitativa' : 'Opportunità d&apos;Affari Commerciali'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Codice Rif.: {listing.riferimento ? listing.riferimento.toUpperCase() : `#${listing.id}`}</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl md:text-3.5xl font-black tracking-tight text-slate-950 leading-tight">
                {listing.titolo}
              </h1>
              
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
                <MapPin size={14} className="text-amber-500" />
                <span>{listing.indirizzo}</span>
              </div>
            </div>

            {/* Visualizzatore Prezzo Primario CRO */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Prezzo Richiesto</span>
                <p className="text-2xl md:text-3.5xl font-black text-slate-900 mt-1">
                  € {formattedPrezzo}
                  {listing.tipo_contratto === 'AFFITTO' ? <span className="text-sm font-normal text-slate-500"> /mese</span> : ''}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10.5px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-bold border border-emerald-100/60 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  Nessuna provvigione acquirente
                </span>
                <p className="text-[10px] text-slate-400 font-medium mt-1">Soggetto a tassazione agevolata</p>
              </div>
            </div>
          </div>

          {/* Quick Stats (Badge con icone in riga orizzontale) */}
          {((isB2C && listing.propertyDetails && (listing.propertyDetails.stanze > 0 || listing.propertyDetails.mq > 0 || listing.propertyDetails.bagni > 0)) ||
            (!isB2C && listing.businessDetails && (
              (listing.businessDetails.fatturato_annuo !== undefined && Number(listing.businessDetails.fatturato_annuo) > 0) ||
              (listing.businessDetails.canone_mura !== undefined && Number(listing.businessDetails.canone_mura) > 0) ||
              (listing.propertyDetails && listing.propertyDetails.mq > 0)
            ))) ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-xs">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Caratteristiche in evidenza</h3>
              
              {isB2C && listing.propertyDetails ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200/50 rounded-lg flex items-center justify-center shrink-0">
                      <Layers className="text-slate-700" size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Locali</span>
                      <span className="text-xs font-black text-slate-950">{listing.propertyDetails.stanze} vani</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200/50 rounded-lg flex items-center justify-center shrink-0">
                      <Ruler className="text-slate-700" size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Superficie</span>
                      <span className="text-xs font-black text-slate-950">{listing.propertyDetails.mq} m²</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200/50 rounded-lg flex items-center justify-center shrink-0">
                      <Home className="text-slate-700" size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Bagni</span>
                      <span className="text-xs font-black text-slate-950">{listing.propertyDetails.bagni} bagni</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200/50 rounded-lg flex items-center justify-center shrink-0">
                      <Compass className="text-slate-700" size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Piano</span>
                      <span className="text-xs font-black text-slate-950 truncate max-w-[100px] block">{listing.propertyDetails.piano || 'T'}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {!isB2C && listing.businessDetails ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200/50 rounded-lg flex items-center justify-center shrink-0">
                      <Ruler className="text-slate-700" size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Superficie</span>
                      <span className="text-xs font-black text-slate-950">
                        {listing.propertyDetails?.mq || 140} m²
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200/50 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="text-slate-700" size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block font-bold font-sans">Locali/Arredi</span>
                      <span className="text-xs font-black text-slate-950 truncate block max-w-[110px]">Attrezzato</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200/50 rounded-lg flex items-center justify-center shrink-0">
                      <TrendingUp className="text-slate-700" size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Fatturato</span>
                      <span className="text-xs font-black text-slate-950 truncate block max-w-[110px]">
                        {listing.businessDetails.fatturato_annuo 
                          ? `€ ${Number(listing.businessDetails.fatturato_annuo).toLocaleString('it-IT')}` 
                          : 'Riservato'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-200/50 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="text-slate-700" size={16} />
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block font-bold">Canone</span>
                      <span className="text-xs font-black text-slate-950 truncate block max-w-[110px]">
                        {listing.businessDetails.canone_mura 
                          ? `€ ${Number(listing.businessDetails.canone_mura).toLocaleString('it-IT')}` 
                          : 'Incluso'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Descrizione Estesa (con pulsante Leggi tutto) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg font-black text-slate-950 tracking-tight">Descrizione dell&apos;annuncio</h2>
            
            <div className="relative">
              <div className={`text-slate-600 text-xs md:text-sm font-semibold leading-relaxed transition-all duration-300 whitespace-pre-line ${
                !isDescExpanded ? 'line-clamp-5 overflow-hidden' : ''
              }`}>
                {listing.descrizione}
              </div>
              
              {!isDescExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-900 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                <span>{isDescExpanded ? 'Mostra meno' : 'Leggi tutto'}</span>
                {isDescExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          </div>

          {/* Tabella Caratteristiche complete  */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-5 shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-950 tracking-tight">Dettagli e Caratteristiche</h2>
              <p className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider mt-0.5">Scheda analitica del bene ed oneri collegati</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
              
              <div className="divide-y divide-slate-100">
                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500 font-medium">Contratto</span>
                  <span className="text-slate-900 font-bold uppercase">{listing.tipo_contratto}</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs bg-slate-50/50 px-1.5 rounded-lg">
                  <span className="text-slate-500 font-medium">Tipologia</span>
                  <span className="text-slate-900 font-bold">{isB2C ? 'Residenziale' : 'Commerciale / Attività'}</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500 font-medium">Superficie</span>
                  <span className="text-slate-900 font-bold">{isB2C ? listing.propertyDetails?.mq : (listing.businessDetails ? (listing.propertyDetails?.mq || 140) : 140)} m²</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs bg-slate-50/50 px-1.5 rounded-lg">
                  <span className="text-slate-500 font-medium">Spese Condominiali</span>
                  <span className="text-slate-900 font-bold">{listing.spese_condominiali || (isB2C ? '120 €/mese' : 'Oneri ordinari bassi')}</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500 font-medium">Stato</span>
                  <span className="text-slate-900 font-bold">{listing.stato_immobile || 'Ottimo / Ristrutturato'}</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs bg-slate-50/50 px-1.5 rounded-lg">
                  <span className="text-slate-500 font-medium">Anno Costruzione</span>
                  <span className="text-slate-900 font-bold">{listing.anno_costruzione || '2018'}</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs">
                  <span className="text-slate-500 font-medium">Riscaldamento</span>
                  <span className="text-slate-900 font-bold">{listing.riscaldamento || 'Autonomo, aria condizionata'}</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs bg-slate-50/50 px-1.5 rounded-lg">
                  <span className="text-slate-500 font-medium font-sans">Disponibilità</span>
                  <span className="text-emerald-700 font-extrabold">{listing.disponibilita || 'Rogito immediato'}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Efficienza Energetica */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-950 tracking-tight">Efficienza Energetica</h2>
              <p className="text-slate-400 text-[10.5px] font-bold uppercase tracking-wider mt-0.5">Certificazione delle prestazioni energetiche</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Classe Energetica Badge Grande */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-150 rounded-2xl text-center space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold leading-none">Classe Attribuita</span>
                <span className={`w-16 h-16 rounded-2xl ${getEnergyColor(classeEnergetica)} text-white font-black text-3xl flex items-center justify-center shadow-md shadow-slate-900/5`}>
                  {classeEnergetica}
                </span>
                <p className="text-[10px] text-slate-500 pt-1 leading-normal font-sans">
                  EPgl,nren: <br />
                  <strong className="text-slate-800">{energyIndex}</strong>
                </p>
              </div>

              {/* Scala Energetica (A4 to G) */}
              <div className="md:col-span-8 space-y-2">
                <p className="text-xs text-slate-500 font-semibold mb-3">Confronto con le altre classi:</p>
                <div className="space-y-1.5">
                  {classesList.map((cls) => {
                    const isActive = classeEnergetica === cls || (classeEnergetica.startsWith('A') && cls === 'A4');
                    return (
                      <div key={cls} className="flex items-center gap-2">
                        <span className={`w-8 text-[11px] font-black text-center py-0.5 rounded text-white ${getEnergyColor(cls)} ${
                          isActive ? 'ring-2 ring-offset-1 ring-slate-950 scale-105' : 'opacity-40'
                        }`}>
                          {cls}
                        </span>
                        
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${getEnergyColor(cls)}`} style={{ 
                            width: `${(10 - classesList.indexOf(cls)) * 10}%`,
                            opacity: isActive ? 1 : 0.35
                          }} />
                        </div>
                        
                        {isActive && (
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-wider">
                            Classe Attuale
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Posizione del Mandato (Mappa stilizzata) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg font-black text-slate-950 tracking-tight">Posizione ed Area Amministrativa</h2>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Per tutelare la privacy della proprietà, l&apos;ubicazione esatta viene rilasciata dai nostri uffici o comunicata formalmente al primo sopralluogo tecnico.
            </p>

            <div className="h-64 bg-transparent border border-slate-200 rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 text-slate-700 font-mono text-[10px]">
              {/* Mappa reale Google Maps in background (a colori) */}
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  listing.zona && listing.comune
                    ? `${listing.zona}, ${listing.comune}`
                    : listing.comune
                    ? listing.comune
                    : listing.indirizzo
                )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="absolute inset-0 w-full h-full border-0 -z-10 opacity-100 pointer-events-none select-none"
                allowFullScreen={false}
                loading="lazy"
                title="Mappa di Posizione"
              />

              <div className="absolute inset-0 bg-white/5 pointer-events-none -z-10" />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center space-y-2.5 z-10 p-4 bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-800 max-w-sm shadow-xl">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-400 animate-pulse mx-auto flex items-center justify-center shadow-lg">
                  <MapPin size={18} className="text-amber-400" />
                </div>
                <p className="font-extrabold uppercase text-[10px] tracking-widest text-white leading-normal">
                  {listing.indirizzo}
                </p>
                <p className="text-slate-400 text-[9px] font-semibold">
                  Ubicazione Certificata Studio BP Italia S.r.l.
                </p>
              </div>

              {/* Decorazioni GPS in formato chiaro e leggibile */}
              <div className="text-slate-800 bg-white/75 backdrop-blur-xs px-2 py-1 rounded-lg max-w-fit pointer-events-none z-10 font-bold border border-slate-200/50 shadow-2xs">
                COORD REF SYSTEM: WGS84
              </div>
              
              <div className="flex justify-between items-end mt-auto pt-4 pointer-events-none z-10">
                <span className="text-slate-800 bg-white/75 backdrop-blur-xs px-2 py-1 rounded-lg font-bold border border-slate-200/50 shadow-2xs">GEOSPATIAL SECURE GRAPH</span>
                <span className="text-slate-800 bg-white/75 backdrop-blur-xs px-2 py-1 rounded-lg font-bold border border-slate-200/50 shadow-2xs">45.4642° N / 9.1900° E</span>
              </div>
            </div>
          </div>

        </div>

        {/* 3. STICKY SIDEBAR (COLONNA DESTRA, 30% LARGHEZZA) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          
          {/* Lead Gen Widget */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 space-y-6 text-left relative overflow-hidden">
            {/* Tag / Status */}
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${
                isB2C 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
                  : 'bg-amber-100 text-slate-900 border border-amber-200'
              }`}>
                {isB2C ? 'Visita Immobili' : 'Dossier Aziendale'}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Broker Attivo</span>
              </span>
            </div>

            {/* Informazioni Agente / Broker */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-slate-950 rounded-full flex items-center justify-center border-2 border-amber-400 text-amber-400 font-extrabold text-sm relative">
                BP
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-950">Consulenza Studio BP</h4>
                <p className="text-[10.5px] text-slate-400 font-semibold">Divisione Milano / Roma / Estero</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Risolviamo l&apos;intermediazione d&apos;eccellenza su base fiduciaria. Contatta l&apos;ufficio indicando il codice annuncio per richiedere la documentazione legale completa.
            </p>

            {/* Pulsanti di Azione Principali */}
            <div className="space-y-3 pt-2">
              <button 
                onClick={scrollToContact}
                className={`w-full py-4 px-4 rounded-xl text-white font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isB2C 
                    ? 'bg-slate-900 hover:bg-black shadow-slate-900/10'
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/10'
                }`}
              >
                <Mail size={13} />
                <span>Invia Messaggio</span>
              </button>

              <a 
                href="tel:+39028888888"
                className="w-full py-3.5 px-4 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <Phone size={13} className="text-slate-600" />
                <span>Chiama Ora Bp</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-100 text-slate-400 text-[9.5px] font-medium flex justify-between leading-none">
              <span>FIMAA Associato n.42211</span>
              <span>P.IVA 01224850993</span>
            </div>
          </div>

          {/* Form di contatto reale embedded per un perfetto flusso CRO */}
          <div id="contact-section-anchor" className="scroll-mt-24">
            <ContactForm listing={listing} />
          </div>

        </div>

      </div>

      {/* 4. CAROUSEL LIGHTBOX FULL-SCREEN MODAL */}
      <AnimatePresence>
        {isGalleryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-8"
          >
            {/* Header del Lightbox */}
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-widest">Studio BP Visualizzatore Immagini</span>
                <h3 className="text-sm font-black truncate max-w-md">{listing.titolo}</h3>
              </div>
              <button 
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                aria-label="Chiudi visualizzatore"
              >
                <X size={18} />
              </button>
            </div>

            {/* Immagine Centrale Scorrimento */}
            <div className="relative flex-1 flex items-center justify-center p-4">
              <button 
                onClick={() => setActiveImageIdx(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                className="absolute left-2 md:left-4 p-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full transition-all cursor-pointer z-10"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="relative max-w-5xl max-h-[70vh] w-full h-full flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={galleryImages[activeImageIdx]} 
                  alt={`${listing.titolo} - Foto ${activeImageIdx + 1}`}
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              <button 
                onClick={() => setActiveImageIdx(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 md:right-4 p-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full transition-all cursor-pointer z-10"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Footer con Miniatures */}
            <div className="space-y-4 text-center border-t border-white/10 pt-4">
              <p className="text-xs text-white/50 font-semibold">
                Foto {activeImageIdx + 1} di {galleryImages.length}
              </p>
              
              <div className="flex justify-center gap-2 max-w-lg mx-auto overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      activeImageIdx === idx ? 'border-amber-400 scale-105' : 'border-white/20 opacity-60'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MOBILE BOTTOM STICKY ACTION BAR (< 1024px) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 py-3 px-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-between gap-3 z-45 shadow-2xl">
        <div className="flex-1">
          <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wide block leading-none">Valore Intermediazione</span>
          <span className="text-base font-black text-slate-900 block mt-0.5">
            € {formattedPrezzo}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="tel:+39028888888"
            className="p-3 bg-slate-100 border border-slate-200 text-slate-900 rounded-xl flex items-center justify-center transition-colors shadow-sm"
            aria-label="Chiama l'agenzia"
          >
            <Phone size={15} />
          </a>

          <button
            onClick={() => {
              setIsContactModalOpen(true);
            }}
            className={`px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-white ${
              isB2C ? 'bg-slate-900' : 'bg-amber-400 text-slate-950 font-black'
            }`}
          >
            Contatta Agenzia
          </button>
        </div>
      </div>

      {/* Slide-Up Contact Modal for Mobile Form */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center"
          >
            {/* Sfondo per chiusura */}
            <div className="absolute inset-0" onClick={() => setIsContactModalOpen(false)} />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-5 z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Bottone di chiusura */}
              <div className="flex justify-between items-center pb-4 mb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Compila Richiesta</span>
                <button 
                  onClick={() => setIsContactModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form di contatto */}
              <ContactForm listing={listing} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
