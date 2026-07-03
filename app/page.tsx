'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Database, 
  Download, 
  Sparkles, 
  Info,
  X,
  FileCode,
  Sliders,
  TrendingUp,
  Heart,
  ChevronRight,
  ShieldCheck,
  Check,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SearchWidget from '@/components/SearchWidget';
import PropertyCard from '@/components/PropertyCard';
import BusinessCard from '@/components/BusinessCard';
import { LogoRound, LogoRectangular } from '@/components/Logo';

// Tipi definiti coerenti con lo schema Prisma
type TipoContratto = 'VENDITA' | 'AFFITTO';
type CategoriaListing = 'IMMOBILE' | 'BUSINESS';
type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'CLOSED' | 'CANCELLED';

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
  tipo_contratto: TipoContratto;
  categoria: CategoriaListing;
  immagini: string[];
  propertyDetails?: PropertyDetails;
  businessDetails?: BusinessDetails;
  data_creazione: string;
  
  // Campi Getrix
  riferimento?: string;
  getrix_id?: string;
  comune?: string;
  zona?: string;
  tipologia?: string;
  
  // Campi aggiuntivi per gestione backoffice
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
}

interface Lead {
  id: number;
  nome: string;
  email: string;
  telefono?: string;
  messaggio: string;
  id_listing_associato?: number;
  status: LeadStatus;
  data_creazione: string;
}

// Data seed iniziale eccellente per la demo
const INITIAL_LISTINGS: Listing[] = [
  {
    id: 101,
    titolo: 'Attico Vista Duomo',
    descrizione: 'Prestigioso attico situato nel cuore di Milano con vista panoramica sul Duomo, interamente ristrutturato con materiali di pregio e domotica di ultima generazione.',
    prezzo: 1250000,
    indirizzo: 'Via Manzoni 12, Milano',
    tipo_contratto: 'VENDITA',
    categoria: 'IMMOBILE',
    immagini: ['https://picsum.photos/seed/duomo/800/500'],
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
    descrizione: 'Cessione ramo d\'azienda di uno storico locale nel centro nevralgico di Roma. Elevato passaggio pedonale, arredi storici d\'epoca ed eccellente avviamento commerciale.',
    prezzo: 185000, 
    indirizzo: 'Corso Umberto I, Roma',
    tipo_contratto: 'VENDITA',
    categoria: 'BUSINESS',
    immagini: ['https://picsum.photos/seed/cafe/800/500'],
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
    descrizione: 'Splendida villa circondata dall\'ampio verde privato con piscina, porticato esterno e ampie vetrate ad elevato risparmio energetico. Ideale per famiglie esigenti.',
    prezzo: 680000,
    indirizzo: 'Via dei Girasoli 44, Forte dei Marmi',
    tipo_contratto: 'VENDITA',
    categoria: 'IMMOBILE',
    immagini: ['https://picsum.photos/seed/villa/800/500'],
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
    descrizione: 'Hub di logistica industriale situato a ridosso dell\'imbocco autostradale. Altezza utile interna 10 metri, 4 baie di carico e scarico e ampi uffici di rappresentanza integrati.',
    prezzo: 12000, // Canone locazione mensile
    indirizzo: 'Zona Industriale Nord, Bologna',
    tipo_contratto: 'AFFITTO',
    categoria: 'BUSINESS',
    immagini: ['https://picsum.photos/seed/industrial/800/500'],
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
    descrizione: 'Elegante bilocale arredato da architetto in una delle vie più iconiche di Brera. Finiture in parquet massello, impianto clima autonomo e balcone vivibile.',
    prezzo: 450000,
    indirizzo: 'Via Solferino 18, Milano',
    tipo_contratto: 'VENDITA',
    categoria: 'IMMOBILE',
    immagini: ['https://picsum.photos/seed/brera/800/500'],
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
    descrizione: 'Splendida combinazione alberghiera di 18 camere fronte mare con ristorante, dehor e solarium attrezzato. Perfetto investimento turistico-ricettivo con ottima rendita storica.',
    prezzo: 1400000,
    indirizzo: 'Lungomare Adriatico 12, Rimini',
    tipo_contratto: 'VENDITA',
    categoria: 'BUSINESS',
    immagini: ['https://picsum.photos/seed/hotel/800/500'],
    data_creazione: '2026-06-16T15:20:00Z',
    businessDetails: {
      settore_merceologico: 'Hotellerie',
      fatturato_annuo: 890000,
      canone_mura: 0, // Mura incluse
      utile_netto: 195000,
      numero_dipendenti: 8
    }
  }
];

const INITIAL_LEADS: Lead[] = [
  {
    id: 1,
    nome: 'Alessandro Moretti',
    email: 'a.moretti@valoremail.it',
    telefono: '+39 333 456789',
    messaggio: 'Sarei interessato ad effettuare un sopralluogo per l\'Attico Vista Duomo di Milano. Gradito contatto telefonico nel pomeriggio.',
    id_listing_associato: 101,
    status: 'NEW',
    data_creazione: '2026-06-16T16:45:00Z'
  },
  {
    id: 2,
    nome: 'Investimenti Capital S.r.l.',
    email: 'acquisizioni@capital.it',
    telefono: '+39 06 9876543',
    messaggio: 'Richiediamo bilancio degli ultimi 3 anni e book descrittivo completo dell\'avviamento commerciale del Caffè Centrale di Roma.',
    id_listing_associato: 102,
    status: 'CONTACTED',
    data_creazione: '2026-06-17T11:15:00Z'
  }
];

export default function Homepage() {
  // Database simulati locali per supportare l'interazione senza database esterni
  const [listings, setListings] = useState<Listing[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Filtri ricercati correntemente tramite il SearchWidget
  const [currentFilters, setCurrentFilters] = useState<{
    category: 'IMMOBILE' | 'BUSINESS';
    tipologiaOrSettore: string;
    localiOrFatturato: string;
    budget: string;
  } | null>(null);

  // Stato Modale Lead
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isSubmitLeadSuccess, setIsSubmitLeadSuccess] = useState(false);
  const [leadContactMethod, setLeadContactMethod] = useState<'EMAIL' | 'WHATSAPP'>('EMAIL');
  const [newLeadForm, setNewLeadForm] = useState({
    nome: '',
    email: '',
    telefono: '',
    messaggio: '',
  });

  // Stato Visualizzazione Database / Console SQL finta per dimostrare l'unione dei due mondi
  const [showSqlViewer, setShowSqlViewer] = useState(false);

  // Feed Notifiche toast
  const [notification, setNotification] = useState<string | null>(null);

  // Caricamento asincrono sicuro da API (MySQL) o localStorage come fallback offline-first
  useEffect(() => {
    const loadData = async () => {
      let loadedListings: Listing[] = [];
      let loadedLeads: Lead[] = [];

      try {
        const resListings = await fetch('/api/listings');
        if (resListings.ok) {
          loadedListings = await resListings.json();
          setListings(loadedListings);
          localStorage.setItem('sbp_listings_home', JSON.stringify(loadedListings));
        } else {
          throw new Error('Database listings offline');
        }
      } catch (err) {
        console.warn("Utilizzo localStorage per listings (fallback):", err);
        const storedListings = localStorage.getItem('sbp_listings_home');
        if (storedListings) {
          try {
            loadedListings = JSON.parse(storedListings);
            setListings(loadedListings);
          } catch {
            setListings(INITIAL_LISTINGS);
          }
        } else {
          setListings(INITIAL_LISTINGS);
          localStorage.setItem('sbp_listings_home', JSON.stringify(INITIAL_LISTINGS));
        }
      }

      try {
        const resLeads = await fetch('/api/leads');
        if (resLeads.ok) {
          loadedLeads = await resLeads.json();
          setLeads(loadedLeads);
          localStorage.setItem('sbp_leads_home', JSON.stringify(loadedLeads));
        } else {
          throw new Error('Database leads offline');
        }
      } catch (err) {
        console.warn("Utilizzo localStorage per leads (fallback):", err);
        const storedLeads = localStorage.getItem('sbp_leads_home');
        if (storedLeads) {
          try {
            loadedLeads = JSON.parse(storedLeads);
            setLeads(loadedLeads);
          } catch {
            setLeads(INITIAL_LEADS);
          }
        } else {
          setLeads(INITIAL_LEADS);
          localStorage.setItem('sbp_leads_home', JSON.stringify(INITIAL_LEADS));
        }
      }
    };

    loadData();
  }, []);

  // Rileva filtri passati da parametri URL per navigazione esterna o click diretti
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const filterParam = params.get('filter');
      if (filterParam === 'immobili') {
        const timer = setTimeout(() => {
          setCurrentFilters({
            category: 'IMMOBILE',
            tipologiaOrSettore: 'Tutti',
            localiOrFatturato: 'Tutti',
            budget: 'Qualsiasi'
          });
          setTimeout(() => {
            const element = document.getElementById('search-results-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        }, 100);
        return () => clearTimeout(timer);
      } else if (filterParam === 'attivita') {
        const timer = setTimeout(() => {
          setCurrentFilters({
            category: 'BUSINESS',
            tipologiaOrSettore: 'Tutti',
            localiOrFatturato: 'Qualsiasi',
            budget: 'Qualsiasi'
          });
          setTimeout(() => {
            const element = document.getElementById('search-results-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 200);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const saveState = (updatedListings: Listing[], updatedLeads: Lead[]) => {
    localStorage.setItem('sbp_listings_home', JSON.stringify(updatedListings));
    localStorage.setItem('sbp_leads_home', JSON.stringify(updatedLeads));
  };

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Callback del SearchWidget
  const handleSearchSubmit = (filters: {
    category: 'IMMOBILE' | 'BUSINESS';
    tipologiaOrSettore: string;
    localiOrFatturato: string;
    budget: string;
  }) => {
    setCurrentFilters(filters);
    showToast(`Dati filtrati con successo: Categoria: ${filters.category} • Filtri applicati.`);
    
    // Auto-scroll fino alla sezione featured o della ricerca
    const element = document.getElementById('search-results-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Invio Lead reale su MySQL Prisma
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.nome || !newLeadForm.email) {
      alert('Per favore, compila i campi obbligatori Nome ed Email.');
      return;
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: newLeadForm.nome,
          email: newLeadForm.email,
          telefono: newLeadForm.telefono || undefined,
          messaggio: newLeadForm.messaggio || `Richiesta di informazioni per l'annuncio #${selectedListing?.id}`,
          id_listing_associato: selectedListing?.id,
          status: 'NEW'
        })
      });

      if (!response.ok) {
        throw new Error("Impossibile salvare il lead su database remoto");
      }

      const savedLead: Lead = await response.json();
      const updatedLeads = [savedLead, ...leads];
      setLeads(updatedLeads);
      saveState(listings, updatedLeads);

      // Se il metodo scelto è WHATSAPP, apriamo WhatsApp con il messaggio precompilato strutturato
      if (leadContactMethod === 'WHATSAPP' && selectedListing) {
        const isImmobile = selectedListing.categoria === 'IMMOBILE';
        const formattedPrezzo = selectedListing.prezzo.toLocaleString('it-IT');

        const textMsg = `Salve Studio BP, sono *${newLeadForm.nome.trim()}* (Email: ${newLeadForm.email.trim()}${newLeadForm.telefono ? `, Tel: ${newLeadForm.telefono.trim()}` : ''}).
Desidero ricevere informazioni per l'annuncio:
👉 *${selectedListing.titolo}* (Rif: ${selectedListing.riferimento || 'N/D'} - ID: #${selectedListing.id})
${isImmobile 
  ? `Valore: € ${formattedPrezzo} - Zona: ${selectedListing.zona || 'N/D'}, ${selectedListing.comune || 'N/D'}` 
  : `Valore: € ${formattedPrezzo} - Settore: ${selectedListing.businessDetails?.settore_merceologico || 'N/D'}`}

Messaggio: ${newLeadForm.messaggio.trim() || 'Desidero essere ricontattato per questo annuncio.'}`;

        const waUrl = `https://wa.me/393792319582?text=${encodeURIComponent(textMsg)}`;
        window.open(waUrl, '_blank');
      }

      setIsSubmitLeadSuccess(true);
      showToast(leadContactMethod === 'WHATSAPP' 
        ? `Richiesta salvata nel DB e chat WhatsApp aperta!`
        : `Lead #${savedLead.id} salvato con successo nel database MySQL di Studio BP!`);
    } catch (err: any) {
      console.error(err);
      
      // Fallback in locale offline in caso di disconnessione
      const nextId = leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1;
      const fallbackLead: Lead = {
        id: nextId,
        nome: newLeadForm.nome,
        email: newLeadForm.email,
        telefono: newLeadForm.telefono || undefined,
        messaggio: newLeadForm.messaggio || `Richiesta di informazioni per l'annuncio #${selectedListing?.id}`,
        id_listing_associato: selectedListing?.id,
        status: 'NEW',
        data_creazione: new Date().toISOString()
      };

      const updatedLeads = [fallbackLead, ...leads];
      setLeads(updatedLeads);
      saveState(listings, updatedLeads);

      // Se il metodo scelto è WHATSAPP, apriamo comunque WhatsApp
      if (leadContactMethod === 'WHATSAPP' && selectedListing) {
        const isImmobile = selectedListing.categoria === 'IMMOBILE';
        const formattedPrezzo = selectedListing.prezzo.toLocaleString('it-IT');

        const textMsg = `Salve Studio BP, sono *${newLeadForm.nome.trim()}* (Email: ${newLeadForm.email.trim()}${newLeadForm.telefono ? `, Tel: ${newLeadForm.telefono.trim()}` : ''}).
Desidero ricevere informazioni per l'annuncio:
👉 *${selectedListing.titolo}* (Rif: ${selectedListing.riferimento || 'N/D'} - ID: #${selectedListing.id})
${isImmobile 
  ? `Valore: € ${formattedPrezzo} - Zona: ${selectedListing.zona || 'N/D'}, ${selectedListing.comune || 'N/D'}` 
  : `Valore: € ${formattedPrezzo} - Settore: ${selectedListing.businessDetails?.settore_merceologico || 'N/D'}`}

Messaggio: ${newLeadForm.messaggio.trim() || 'Desidero essere ricontattato per questo annuncio.'}`;

        const waUrl = `https://wa.me/393792319582?text=${encodeURIComponent(textMsg)}`;
        window.open(waUrl, '_blank');
      }

      setIsSubmitLeadSuccess(true);
      showToast(`Richiesta salvata localmente offline (MySQL in attesa di connessione).`);
    }

    setTimeout(() => {
      setIsSubmitLeadSuccess(false);
      setNewLeadForm({ nome: '', email: '', telefono: '', messaggio: '' });
      setLeadContactMethod('EMAIL');
      setSelectedListing(null);
    }, 2800);
  };

  // Funzione di ripristino per simulare di nuovo
  const handleResetFilters = () => {
    setCurrentFilters(null);
    showToast('Filtri di ricerca rimossi. Visualizzazione tutti gli annunci.');
  };

  // Logica avanzata di filtraggio combinato per gli annunci
  const filteredListings = listings.filter(l => {
    if (!currentFilters) return true; // Se nessun filtro, mostra tutti

    // Filtro per categoria macro (Immobile o Business)
    if (l.categoria !== currentFilters.category) return false;

    // Filtro per Tipologia o Settore
    if (currentFilters.tipologiaOrSettore !== 'Tutti') {
      if (currentFilters.category === 'IMMOBILE') {
        const titleMatch = l.titolo.toLowerCase().includes(currentFilters.tipologiaOrSettore.toLowerCase()) ||
                           l.descrizione.toLowerCase().includes(currentFilters.tipologiaOrSettore.toLowerCase());
        if (!titleMatch) return false;
      } else {
        // Business
        if (l.businessDetails?.settore_merceologico !== currentFilters.tipologiaOrSettore) return false;
      }
    }

    // Filtro per Locali (Immobili) o Fatturato (Business)
    if (currentFilters.category === 'IMMOBILE' && currentFilters.localiOrFatturato !== 'Tutti') {
      const stanzeTarget = parseInt(currentFilters.localiOrFatturato);
      if (l.propertyDetails && l.propertyDetails.stanze < stanzeTarget) return false;
    } else if (currentFilters.category === 'BUSINESS' && currentFilters.localiOrFatturato !== 'Qualsiasi') {
      const fatturatoVal = l.businessDetails?.fatturato_annuo || 0;
      if (currentFilters.localiOrFatturato === 'Fino a €150k' && fatturatoVal > 150000) return false;
      if (currentFilters.localiOrFatturato === '€150k - €500k' && (fatturatoVal < 150000 || fatturatoVal > 500000)) return false;
      if (currentFilters.localiOrFatturato === 'Oltre €500k' && fatturatoVal < 500000) return false;
    }

    // Filtro per Budget
    if (currentFilters.category === 'IMMOBILE' && currentFilters.budget !== 'Qualsiasi') {
      if (currentFilters.budget === 'Fino a €250.000' && l.prezzo > 250000) return false;
      if (currentFilters.budget === 'Fino a €500.000' && l.prezzo > 500000) return false;
      if (currentFilters.budget === 'Fino a €1.000.000' && l.prezzo > 1000000) return false;
      if (currentFilters.budget === 'Oltre €1.000.000' && l.prezzo <= 1000000) return false;
    } else if (currentFilters.category === 'BUSINESS' && currentFilters.budget !== 'Qualsiasi') {
      if (currentFilters.budget === 'Fino a €5.000/mese' && l.prezzo > 5000) return false;
      if (currentFilters.budget === 'Fino a €25.000/mese' && l.prezzo > 25000) return false;
      if (currentFilters.budget === 'A Cessione' && l.prezzo < 50000) return false;
    }

    return true;
  });

  // Lista fissa degli annunci rilevanti (Primi 3 del database da mostrare per default come "Featured Listings"
  const defaultFeaturedListings = listings.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* Toast Notifiche */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 px-5 py-3 md:px-6 md:py-4 rounded-2xl shadow-xl bg-slate-900 text-amber-300 border border-amber-500/20 text-xs md:text-sm font-semibold max-w-sm flex items-center gap-3.5"
          >
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping shrink-0" />
            <div className="flex-1">{notification}</div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigazione Superiore */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoRound className="w-12 h-12 shadow-md shrink-0" />
          <div className="flex flex-col">
            <LogoRectangular className="h-8 w-auto block text-slate-950" />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <a href="#hero-section" className="hover:text-slate-900 transition-colors">Scegli Percorso</a>
          <button 
            onClick={() => {
              setCurrentFilters({
                category: 'IMMOBILE',
                tipologiaOrSettore: 'Tutti',
                localiOrFatturato: 'Tutti',
                budget: 'Qualsiasi'
              });
              setTimeout(() => {
                const element = document.getElementById('search-results-section');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            className="hover:text-slate-900 transition-colors uppercase font-semibold text-xs text-slate-550 hover:underline hover:decoration-amber-500 hover:underline-offset-4 cursor-pointer"
          >
            Immobili
          </button>
          <button 
            onClick={() => {
              setCurrentFilters({
                category: 'BUSINESS',
                tipologiaOrSettore: 'Tutti',
                localiOrFatturato: 'Qualsiasi',
                budget: 'Qualsiasi'
              });
              setTimeout(() => {
                const element = document.getElementById('search-results-section');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            className="hover:text-slate-900 transition-colors uppercase font-semibold text-xs text-slate-550 hover:underline hover:decoration-amber-500 hover:underline-offset-4 cursor-pointer"
          >
            Attività in vendita
          </button>
          <button 
            onClick={() => setShowSqlViewer(!showSqlViewer)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-900 text-white hover:text-amber-400 transition-colors rounded-lg flex items-center gap-2 text-[10px] font-mono font-bold cursor-pointer"
          >
            <Database size={12} />
            {showSqlViewer ? 'Nascondi DB' : 'Verifica Schema Prisma'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/backoffice"
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-amber-400 hover:text-white font-black uppercase text-[10px] tracking-wider px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer shrink-0"
          >
            <ShieldCheck size={13} className="text-amber-400" />
            <span>Area Editore</span>
          </Link>
          <a
            href="tel:+3906123456" 
            className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-950 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Phone size={13} className="text-slate-500" />
            <span>+39 06 123456</span>
          </a>
          <button 
            onClick={() => setShowSqlViewer(!showSqlViewer)}
            className="lg:hidden p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700"
            title="Mostra database"
          >
            <Database size={15} />
          </button>
        </div>
      </nav>

      {/* Sezione di Schema Prisma & Monitor DB (Finto DBMS sincronizzato) */}
      <AnimatePresence>
        {showSqlViewer && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-950 text-slate-300 border-b border-amber-500/20 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto p-5 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      schema.prisma (Tabelle &amp; Relazioni Inizializzate)
                    </h3>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Relational Structure</span>
                </div>
                
                <pre className="bg-slate-900 p-4 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-64 border border-slate-800 leading-relaxed shadow-inner">
{`model Listing {
  id              Int              @id @default(autoincrement())
  titolo          String           @db.VarChar(255)
  prezzo          Decimal          @db.Decimal(12, 2)
  tipo_contratto  TipoContratto    // VENDITA / AFFITTO
  categoria       CategoriaListing // IMMOBILE / BUSINESS
  propertyDetails PropertyDetails? // Relazione 1:1 B2C
  businessDetails BusinessDetails? // Relazione 1:1 B2B
  leads           Lead[]           // Relazione 1:N Leads
}

model PropertyDetails {
  id                 Int      @id @default(autoincrement())
  listingId          Int      @unique
  listing            Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  mq                 Int
  stanze             Int
  classe_energetica  String
}

model BusinessDetails {
  id                  Int      @id @default(autoincrement())
  listingId           Int      @unique
  listing             Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  settore_merceologico String
  fatturato_annuo     Decimal?
}

model Lead {
  id                     Int        @id @default(autoincrement())
  nome                   String
  email                  String
  id_listing_associato   Int?
  listing                Listing?   @relation(fields: [id_listing_associato], references: [id])
}`}
                </pre>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
                    <Users size={13} />
                    Lead Log in MySQL (Relazione 1:N)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">Real-time simulator state</span>
                </div>

                <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                  {leads.map((l, i) => {
                    const matchedListing = listings.find(lst => lst.id === l.id_listing_associato);
                    return (
                      <div key={l.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl leading-relaxed">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-extrabold text-white">{l.nome}</p>
                          <span className="text-[9px] font-mono bg-blue-900/30 text-sky-300 border border-sky-800/40 px-1.5 py-0.5 rounded uppercase font-bold">
                            {l.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 italic">&quot;{l.messaggio}&quot;</p>
                        <div className="mt-2.5 pt-1.5 border-t border-slate-800/60 flex justify-between items-center text-[9px] font-mono text-slate-500">
                          <span>Listing Id: #{l.id_listing_associato || 'Generico'}</span>
                          <span className="text-amber-500 truncate max-w-[170px]">Ref: {matchedListing?.titolo || 'Nessuno'}</span>
                        </div>
                      </div>
                    );
                  })}
                  {leads.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-xs">
                      Nessun record caricato nel DB simulato. Invia una richiesta tramite le card per vederne uno in tempo reale!
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION SPLIT-SCREEN (CRO OPTIMIZED) */}
      <section id="hero-section" className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[640px] border-b border-slate-200">
        
        {/* LATO SINISTRO: IMMOBILIARE (B2C) - SAGE GREEN / AZZURRO ACQUA */}
        <div className="relative overflow-hidden flex flex-col justify-between p-8 md:p-14 lg:p-20 bg-[#e3d6b8] hover:bg-[#d5c7a9]/80 transition-colors duration-500 group border-b lg:border-b-0 lg:border-r border-slate-200">
          
          {/* Sfondo Astratto */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/20 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/60 text-slate-800 border border-white/80 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-xs">
              <Building2 size={13} className="text-slate-700" />
              <span>Divisione Residenziale B2C</span>
            </div>
 
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              Trova o valorizza <br />
              <span className="text-slate-850 relative inline">
                la tua dimora ideale.
                <span className="absolute left-0 bottom-1 w-full h-1.5 bg-white -z-10" />
              </span>
            </h1>
 
            <p className="text-slate-600 text-xs font-semibold leading-relaxed max-w-md">
              Dall&apos;attico contemporaneo alla villa colonica di charme: assistiamo i privati nella compravendita e locazione immobiliare di prestigio, garantendo analisi estimative trasparenti e tutele legali certificate.
            </p>
 
            <ul className="space-y-2 pt-3 text-slate-800 text-[11px] md:text-xs font-medium">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-slate-900 shrink-0" />
                <span>Rete esclusiva di immobili off-market</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-slate-900 shrink-0" />
                <span>Consulenza integrata per mutui e detrazioni</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-slate-900 shrink-0" />
                <span>Valorizzazione professionale (Home Staging inclusa)</span>
              </li>
            </ul>
          </div>
 
          <div className="pt-10 flex flex-wrap gap-4">
            <button
              onClick={() => {
                setCurrentFilters({
                  category: 'IMMOBILE',
                  tipologiaOrSettore: 'Tutti',
                  localiOrFatturato: 'Tutti',
                  budget: 'Qualsiasi'
                });
                const element = document.getElementById('search-results-section');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-4 rounded-xl flex items-center gap-2.5 shadow-md shadow-slate-900/15 transition-all hover:scale-102"
            >
              <span>Esplora Immobili</span>
              <ArrowRight size={14} />
            </button>
            
            <a
              href="#featured-section"
              className="bg-white/80 hover:bg-white border border-slate-300 hover:border-slate-500 text-slate-800 font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all flex items-center justify-center"
            >
              Vedi i 3 in Evidenza
            </a>
          </div>
 
        </div>
 
        {/* LATO DESTRO: BUSINESS / ATTIVITÀ (B2B) - DEEP NAVY / SABBIA */}
        <div className="relative overflow-hidden flex flex-col justify-between p-8 md:p-14 lg:p-20 bg-slate-900 text-white hover:bg-slate-950 transition-colors duration-500 group">
          
          {/* Sfondo Astratto */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />
 
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/25 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest shadow-xs">
              <Briefcase size={13} />
              <span>Divisione Commerciale B2B</span>
            </div>
 
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Cedi o rileva <br />
              <span className="text-amber-400 relative inline">
                attività d&apos;eccellenza.
                <span className="absolute left-0 bottom-1 w-full h-1.5 bg-amber-500/10 -z-10" />
              </span>
            </h1>
 
            <p className="text-slate-300 text-xs font-semibold leading-relaxed max-w-md">
              Il punto di riferimento per imprenditori e investitori. Gestiamo con riservatezza assoluta la cessione e il rilevamento di rami aziendali, bar, alberghi, settori logistici e laboratori artigianali.
            </p>
 
            <ul className="space-y-2 pt-3 text-slate-300 text-[11px] md:text-xs font-medium">
              <li className="flex items-center gap-2">
                <Check size={14} className="text-amber-400 shrink-0" />
                <span>Analisi finanziaria e audit del fatturato</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-amber-400 shrink-0" />
                <span>Accordi di riservatezza (NDA) a tutela delle parti</span>
              </li>
              <li className="flex items-center gap-2">
                <Check size={14} className="text-amber-400 shrink-0" />
                <span>Oltre 25 anni di portafoglio clienti investitori</span>
              </li>
            </ul>
          </div>
 
          <div className="pt-10 flex flex-wrap gap-4">
            <button
              onClick={() => {
                setCurrentFilters({
                  category: 'BUSINESS',
                  tipologiaOrSettore: 'Tutti',
                  localiOrFatturato: 'Qualsiasi',
                  budget: 'Qualsiasi'
                });
                const element = document.getElementById('search-results-section');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-4 rounded-xl flex items-center gap-2.5 shadow-md shadow-amber-500/10 transition-all hover:scale-102"
            >
              <span>Vedi Opportunità B2B</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => {
                setShowSqlViewer(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-[#e3d6b8] hover:bg-[#d5c7a9] text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-4 rounded-xl transition-all hover:scale-102 shadow-md shadow-[#e3d6b8]/10 border border-transparent"
            >
              Visualizza Data Schema
            </button>
          </div>
 
        </div>
 
      </section>

      {/* 2. COMPONENTE INTERATTIVO SEARCH WIDGET CORRELATO AL FLUSSO */}
      <section className="relative px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <SearchWidget onSearch={handleSearchSubmit} />
        </div>
      </section>

      {/* RISULTATI FILTRATI IN DIGITALE MEDIANTE LA RICERCA DINAMICA */}
      <section id="search-results-section" className="scroll-mt-24 px-4 py-8 max-w-7xl mx-auto w-full">
        {currentFilters && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Filtro Sincronizzato con schema.prisma</p>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                <span>Risultati Correlati per {currentFilters.category === 'IMMOBILE' ? 'Residenziale B2C' : 'Attività B2B'}</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                  {filteredListings.length} {filteredListings.length === 1 ? 'risultato trovato' : 'risultati trovati'}
                </span>
              </h2>
            </div>
            
            <button 
              onClick={handleResetFilters}
              className="text-xs font-bold text-red-650 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              Rimuovi Filtro Ricerca
            </button>
          </motion.div>
        )}

        {currentFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isImmobile = listing.categoria === 'IMMOBILE';
              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {isImmobile ? (
                    <PropertyCard 
                      listing={listing} 
                      details={listing.propertyDetails!} 
                      onSelect={(id) => {
                        const found = listings.find(l => l.id === id);
                        if (found) setSelectedListing(found);
                      }}
                    />
                  ) : (
                    <BusinessCard 
                      listing={listing} 
                      details={listing.businessDetails!} 
                      onSelect={(id) => {
                        const found = listings.find(l => l.id === id);
                        if (found) setSelectedListing(found);
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {currentFilters && filteredListings.length === 0 && (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <Info size={30} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Nessun match riscontrato</p>
            <p className="text-xs text-slate-400 mt-0.5">Prova a rilassare i filtri di budget o di tipologia per trovare alternative commerciali.</p>
          </div>
        )}
      </section>

      {/* 3. FEATURED LISTINGS GRID (3 CARD STATISTICHE) */}
      <section id="featured-section" className="px-4 py-16 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center space-y-2 mb-12">
            <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">Selezionati per voi</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Annunci in Evidenza</h2>
            <div className="w-12 h-1 bg-amber-500 mx-auto rounded-full mt-2" />
            <p className="text-slate-500 text-xs font-semibold max-w-lg mx-auto">
              Scorri le ultime proposte accreditate dai nostri broker. Clicca su &quot;Invia Richiesta Informazioni&quot; per simulare l&apos;inserimento di un lead nel database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultFeaturedListings.map((listing) => {
              const isB2C = listing.categoria === 'IMMOBILE';
              return (
                <div key={listing.id} className="h-full">
                  {isB2C ? (
                    <PropertyCard 
                      listing={listing} 
                      details={listing.propertyDetails!} 
                      onSelect={(id) => {
                        const found = listings.find(l => l.id === id);
                        if (found) setSelectedListing(found);
                      }}
                    />
                  ) : (
                    <BusinessCard 
                      listing={listing} 
                      details={listing.businessDetails!} 
                      onSelect={(id) => {
                        const found = listings.find(l => l.id === id);
                        if (found) setSelectedListing(found);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* METODO STUDIO BP ITALIA & TRUST SIGNALS */}
      <section id="how-it-works" className="px-4 py-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl space-y-3.5">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              01
            </div>
            <h3 className="text-base font-extrabold text-slate-950">Analisi Pre-Valutativa Correlata</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              I nostri broker uniscono le metriche patrimoniali fisiche dell&apos;immobile (nel modello B2C `PropertyDetails`) ai flussi di cassa o canoni di business (nel modello B2B `BusinessDetails`), offrendo relazioni stimate certificate.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl space-y-3.5">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              02
            </div>
            <h3 className="text-base font-extrabold text-slate-950">Riservatezza Assoluta B2B</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Perché la cessione d&apos;attività commerciale necessita di tatto. Lavoriamo solo con lead qualificati e catalogati, rilasciando la documentazione contabile solo previa ratifica di un accordo di non divulgazione NDA di persona.
            </p>
          </div>

          <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-2xl space-y-3.5">
            <div className="w-10 h-10 bg-sky-500/10 text-sky-600 rounded-xl flex items-center justify-center font-bold">
              03
            </div>
            <h3 className="text-base font-extrabold text-slate-950">Lead Tracking in Tempo Reale</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Adottiamo un software proprietario basato su Prisma SQL che smista le richieste degli interessati direttamente al referente di zona, accorciando del 63% la latenza classica di risposta dei portali tradizionali.
            </p>
          </div>

        </div>
      </section>

      {/* FOOTER BAR */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 md:px-8 shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
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

      {/* MODALE DI CONVERSIONE LEAD (CRO INTERACTIVE POPUP) */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-slate-950/65 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col text-left align-left"
            >
              
              {/* Stato di Invio con Successo animato */}
              {isSubmitLeadSuccess ? (
                <div className="p-8 text-center space-y-4 flex flex-col items-center justify-center min-h-[350px]">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900">Lead Ricevuto con Successo!</h3>
                  <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                    Complimenti. La richiesta di contatto è stata inserita ed associata all&apos;annuncio <strong className="text-slate-900">#{selectedListing.id}</strong> nello schema relazionale MySQL. Un consulente di Studio BP Italia ti ricontatterà a brevissimo.
                  </p>
                </div>
              ) : (
                <>
                  {/* Intestazione modale */}
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-center relative">
                    <div>
                      <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest leading-none mb-1">Invia Manifestazione di Interesse</p>
                      <h3 className="font-extrabold text-base pr-6 truncate max-w-[340px]">{selectedListing.titolo}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedListing(null)}
                      className="text-slate-300 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-2 rounded-xl"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Riassunto del record correlato a cui associamo il lead */}
                  <div className="p-4 bg-slate-50 border-b border-rose-100/50 text-xs font-semibold flex items-center justify-between text-slate-650">
                    <span className="flex items-center gap-1">
                      <Database size={12} className="text-amber-500" />
                      Associazione: <strong className="text-slate-900">Listing (id: #{selectedListing.id})</strong>
                    </span>
                    <span className="text-slate-950 font-black">€ {selectedListing.prezzo.toLocaleString('it-IT')}</span>
                  </div>

                   {/* Form Leads */}
                  <form onSubmit={handleLeadSubmit} className="p-6 space-y-4">
                    
                    {/* Selettore Metodo di Contatto */}
                    <div className="space-y-1.5 align-left text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Come preferisci essere ricontattato?</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setLeadContactMethod('EMAIL')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            leadContactMethod === 'EMAIL'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Mail size={13} />
                          <span>E-mail</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLeadContactMethod('WHATSAPP')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            leadContactMethod === 'WHATSAPP'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-500 hover:text-slate-850'
                          }`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.63 2.028 14.16 1.001 11.53 1.002c-5.437 0-9.862 4.371-9.865 9.801a9.74 9.74 0 0.0 1.502 4.845L1.921 20.62l5.064-1.32c1.547.84 3.097 1.272 4.662 1.272l.001-.018zM17.47 14.39c-.326-.162-1.926-.948-2.221-1.055-.297-.108-.513-.162-.73.162-.216.324-.838 1.055-1.027 1.27-.189.217-.378.243-.704.082-.325-.162-1.372-.505-2.613-1.613-.966-.862-1.618-1.927-1.808-2.251-.19-.324-.02-.499.143-.66.147-.145.325-.378.487-.568.162-.189.216-.324.325-.54.109-.217.054-.405-.027-.568-.08-.162-.73-1.758-1.002-2.407-.265-.636-.53-.55-.73-.56-.19-.01-.405-.01-.62-.01-.215 0-.567.08-.864.405-.297.324-1.135 1.108-1.135 2.703 0 1.594 1.162 3.134 1.324 3.35.162.216 2.284 3.488 5.533 4.894.773.334 1.377.534 1.847.683.777.247 1.484.212 2.04.13.62-.092 1.925-.786 2.196-1.517.27-.73.27-1.353.19-1.485-.08-.135-.297-.216-.622-.38z"/>
                          </svg>
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Campo Nome */}
                      <div className="space-y-1.5 align-left text-left">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nome Completo *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="es. Mario Rossi"
                          value={newLeadForm.nome}
                          onChange={(e) => setNewLeadForm({ ...newLeadForm, nome: e.target.value })}
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                        />
                      </div>

                      {/* Campo Email */}
                      <div className="space-y-1.5 align-left text-left">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Indirizzo Email *</label>
                        <input 
                          type="email" 
                          required
                          placeholder="es. mario.rossi@email.it"
                          value={newLeadForm.email}
                          onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                          className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                        />
                      </div>
                    </div>

                    {/* Telefono */}
                    <div className="space-y-1.5 align-left text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Numero di Telefono (Facoltativo)</label>
                      <input 
                        type="tel" 
                        placeholder="es. +39 333 1234567"
                        value={newLeadForm.telefono}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, telefono: e.target.value })}
                        className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>

                    {/* Messaggio */}
                    <div className="space-y-1.5 align-left text-left">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Messaggio aggiuntivo per i Broker</label>
                      <textarea
                        rows={3}
                        placeholder={`Ciao, sono molto interessato all'annuncio "${selectedListing.titolo}". Vorrei ricevere maggiori informazioni.`}
                        value={newLeadForm.messaggio}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, messaggio: e.target.value })}
                        className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className={`w-full py-3.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                          leadContactMethod === 'WHATSAPP'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : selectedListing.categoria === 'IMMOBILE'
                            ? 'bg-emerald-800 hover:bg-emerald-950'
                            : 'bg-slate-900 hover:bg-black'
                        }`}
                      >
                        {leadContactMethod === 'WHATSAPP' ? (
                          <>
                            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.63 2.028 14.16 1.001 11.53 1.002c-5.437 0-9.862 4.371-9.865 9.801a9.74 9.74 0 0.0 1.502 4.845L1.921 20.62l5.064-1.32c1.547.84 3.097 1.272 4.662 1.272l.001-.018zM17.47 14.39c-.326-.162-1.926-.948-2.221-1.055-.297-.108-.513-.162-.73.162-.216.324-.838 1.055-1.027 1.27-.189.217-.378.243-.704.082-.325-.162-1.372-.505-2.613-1.613-.966-.862-1.618-1.927-1.808-2.251-.19-.324-.02-.499.143-.66.147-.145.325-.378.487-.568.162-.189.216-.324.325-.54.109-.217.054-.405-.027-.568-.08-.162-.73-1.758-1.002-2.407-.265-.636-.53-.55-.73-.56-.19-.01-.405-.01-.62-.01-.215 0-.567.08-.864.405-.297.324-1.135 1.108-1.135 2.703 0 1.594 1.162 3.134 1.324 3.35.162.216 2.284 3.488 5.533 4.894.773.334 1.377.534 1.847.683.777.247 1.484.212 2.04.13.62-.092 1.925-.786 2.196-1.517.27-.73.27-1.353.19-1.485-.08-.135-.297-.216-.622-.38z"/>
                            </svg>
                            <span>Contatta via WhatsApp</span>
                          </>
                        ) : (
                          <>
                            <Send size={12} />
                            <span>Invia Richiesta E-mail &amp; Salva nel DB</span>
                          </>
                        )}
                      </button>
                      <p className="text-[10px] text-slate-400 text-center mt-3 font-semibold leading-relaxed">
                        {leadContactMethod === 'WHATSAPP'
                          ? `Inviando, verrai reindirizzato a WhatsApp per scrivere direttamente a +39 379 231 9582. Registreremo anche il lead nel database MySQL per tracciabilità.`
                          : `Inviando questo form, registreremo la richiesta nel database MySQL e notificheremo i broker responsabili via e-mail.`}
                      </p>
                    </div>

                  </form>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
