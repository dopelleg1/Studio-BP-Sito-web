'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Briefcase, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  Database, 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  LogOut, 
  ChevronLeft, 
  Lock, 
  Shield, 
  Euro, 
  Percent, 
  Activity, 
  FileText, 
  Check, 
  Zap, 
  Home,
  CheckCircle,
  HelpCircle,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoRound, LogoRectangular } from '@/components/Logo';

// Tipi definiti per la gestione della scheda
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
  
  // Informazioni riservate e caratteristiche tecniche integrate
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

// Data seed iniziale in coordinamento con la homepage
const INITIAL_LISTINGS: Listing[] = [
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
    },
    stima_riservata: 1150000,
    proprietario_nome: 'Margherita Borromeo',
    proprietario_telefono: '+39 347 1122334',
    provvigione: '3% a carico venditore, 0% acquirente',
    tassazione: 'Imposta di registro agevolata prima casa 2%',
    stato_immobile: 'Ottimo / Finemente Ristrutturato',
    anno_costruzione: '1935 (Ristrutturato 2024)',
    riscaldamento: 'Centralizzato a soffitto con contatori autonomi',
    disponibilita: 'Immediata al Rogito',
    spese_condominiali: '450 € / mese'
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
    },
    stima_riservata: 170000,
    proprietario_nome: 'Filippo Moretti',
    proprietario_telefono: '+39 335 8877665',
    provvigione: '4% flat sul prezzo pattuito di cessione',
    tassazione: 'Cessione d\'azienda soggetta ad imposta di registro fissa',
    stato_immobile: 'Arredi storici in perfetto stato di manutenzione',
    anno_costruzione: 'Attivo dal 1974',
    riscaldamento: 'Autonomo con pompe di calore inverter',
    disponibilita: 'Passaggio di consegne affiancato di 3 mesi',
    spese_condominiali: 'Nessuna spesa condominiale comune'
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
    },
    stima_riservata: 650000,
    proprietario_nome: 'Ing. Carlo Geri',
    proprietario_telefono: '+39 328 4455667',
    provvigione: '2% + IVA sul venduto',
    tassazione: 'IVA 4% se acquistata come prima casa da impresa costruttrice',
    stato_immobile: 'Nuova Costruzione 2025',
    anno_costruzione: '2025',
    riscaldamento: 'Riscaldamento a pavimento termodinamico',
    disponibilita: 'In pronta consegna',
    spese_condominiali: 'Nessuna spesa'
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

// Preset di foto stock per test immediati
const STOCK_PHOTOS = [
  { id: 'duomo', label: 'Milano Duomo Penthouse', url: 'https://picsum.photos/seed/duomo/1200/800' },
  { id: 'cafe', label: 'Bar / Caffè Storico', url: 'https://picsum.photos/seed/cafe/1200/800' },
  { id: 'villa', label: 'Villa Moderna con Piscina', url: 'https://picsum.photos/seed/villa/1200/800' },
  { id: 'industrial', label: 'Capannone Industriale', url: 'https://picsum.photos/seed/industrial/1200/800' },
  { id: 'brera', label: 'Appartamento di Design Brera', url: 'https://picsum.photos/seed/brera/1200/800' },
  { id: 'hotel', label: 'Hotel Boutique Riviera', url: 'https://picsum.photos/seed/hotel/1200/800' }
];

export default function Backoffice() {
  // Autenticazione fittizia richiesta per l'Editore
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('editore');
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Liste dati
  const [listings, setListings] = useState<Listing[]>(() => {
    if (typeof window !== 'undefined') {
      const storedListings = localStorage.getItem('sbp_listings_home');
      if (storedListings) {
        try {
          return JSON.parse(storedListings);
        } catch {
          return INITIAL_LISTINGS;
        }
      }
    }
    return INITIAL_LISTINGS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window !== 'undefined') {
      const storedLeads = localStorage.getItem('sbp_leads_home');
      if (storedLeads) {
        try {
          return JSON.parse(storedLeads);
        } catch {
          return INITIAL_LEADS;
        }
      }
    }
    return INITIAL_LEADS;
  });

  // Vista Corrente: 'list' | 'create_edit' | 'leads'
  const [activeTab, setActiveTab] = useState<'listings' | 'leads'>('listings');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Filtri nella tabella
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('Tutti');

  // Notifiche Banner
  const [notification, setNotification] = useState<string | null>(null);

  // Campi del form di inserimento/modifica
  const [formCategory, setFormCategory] = useState<CategoriaListing>('IMMOBILE');
  const [formContratto, setFormContratto] = useState<TipoContratto>('VENDITA');
  const [formTitolo, setFormTitolo] = useState<string>('');
  const [formPrezzo, setFormPrezzo] = useState<number>(0);
  const [formIndirizzo, setFormIndirizzo] = useState<string>('');
  const [formImmagini, setFormImmagini] = useState<string[]>(['https://picsum.photos/seed/duomo/1200/800']);
  const [formDescrizione, setFormDescrizione] = useState<string>('');

  // Campi Dettagli e Caratteristiche (Specifici per Immobile)
  const [formMq, setFormMq] = useState<number>(100);
  const [formStanze, setFormStanze] = useState<number>(3);
  const [formBagni, setFormBagni] = useState<number>(2);
  const [formPiano, setFormPiano] = useState<string>('Piano Terra');
  const [formPostoAuto, setFormPostoAuto] = useState<boolean>(true);
  const [formGiardino, setFormGiardino] = useState<boolean>(false);
  const [formClasseEnergetica, setFormClasseEnergetica] = useState<string>('A4');
  const [formEPgl, setFormEPgl] = useState<string>('29.4 kWh/m² anno');

  // Campi Dettagli e Caratteristiche (Specifici per Attività)
  const [formSettore, setFormSettore] = useState<string>('Ristorazione / Bar');
  const [formFatturato, setFormFatturato] = useState<number>(0);
  const [formCanoneMura, setFormCanoneMura] = useState<number>(0);
  const [formUtile, setFormUtile] = useState<number>(0);
  const [formDipendenti, setFormDipendenti] = useState<number>(0);

  // Informazioni Amministrative aggiuntive richieste
  const [formProvvigione, setFormProvvigione] = useState<string>('3% + IVA');
  const [formTassazione, setFormTassazione] = useState<string>('Imposta di Registro');
  const [formStatoImmobile, setFormStatoImmobile] = useState<string>('Ottimo / Abitabile subito');
  const [formAnnoCostruzione, setFormAnnoCostruzione] = useState<string>('2018');
  const [formRiscaldamento, setFormRiscaldamento] = useState<string>('Autonomo con pompa di calore');
  const [formDisponibilita, setFormDisponibilita] = useState<string>('Libero al rogito');
  const [formSpeseCondo, setFormSpeseCondo] = useState<string>('120 €/mese');

  // Informazioni Riservate solo per lo Studio BP
  const [formStimaRiservata, setFormStimaRiservata] = useState<number>(0);
  const [formProprietarioNome, setFormProprietarioNome] = useState<string>('');
  const [formProprietarioTelefono, setFormProprietarioTelefono] = useState<string>('');



  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'editore' && password === 'sbp') {
      setIsAuthenticated(true);
      localStorage.setItem('sbp_editor_session', 'true');
      showToast('Autenticato con successo come Editore Studio BP');
      setAuthError('');
    } else {
      setAuthError('Credenziali non valide. Inserisci "editore" e "sbp" per accedere.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sbp_editor_session');
    showToast('Sessione terminata correttamente.');
  };

  // Cambia stato lead fittizio nel CRM
  const handleLeadStatusChange = (leadId: number, nextStatus: LeadStatus) => {
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status: nextStatus };
      }
      return lead;
    });
    setLeads(updatedLeads);
    localStorage.setItem('sbp_leads_home', JSON.stringify(updatedLeads));
    showToast(`Stato Lead #${leadId} aggiornato in: ${nextStatus}.`);
  };

  // Elimina inserzione
  const handleDeleteListing = (listingId: number) => {
    if (confirm('Sei sicuro di voler rimuovere definitivamente questo annuncio? Questa azione è irreversibile.')) {
      const updated = listings.filter(l => l.id !== listingId);
      setListings(updated);
      localStorage.setItem('sbp_listings_home', JSON.stringify(updated));
      showToast('Annuncio rimosso dal database con successo.');
    }
  };

  // Edit click: pre-compila lo stato locale del form
  const handleEditClick = (listing: Listing) => {
    setEditingListing(listing);
    setFormCategory(listing.categoria);
    setFormContratto(listing.tipo_contratto);
    setFormTitolo(listing.titolo);
    setFormPrezzo(listing.prezzo);
    setFormIndirizzo(listing.indirizzo);
    setFormImmagini(listing.immagini && listing.immagini.length > 0 ? listing.immagini : ['https://picsum.photos/seed/duomo/1200/800']);
    setFormDescrizione(listing.descrizione);

    // Dettagli Immobile
    if (listing.propertyDetails) {
      setFormMq(listing.propertyDetails.mq);
      setFormStanze(listing.propertyDetails.stanze);
      setFormBagni(listing.propertyDetails.bagni);
      setFormPiano(listing.propertyDetails.piano || 'Piano Terra');
      setFormPostoAuto(listing.propertyDetails.posto_auto);
      setFormGiardino(listing.propertyDetails.giardino);
      setFormClasseEnergetica(listing.propertyDetails.classe_energetica || 'G');
    } else {
      setFormMq(120);
      setFormStanze(3);
      setFormBagni(2);
      setFormPiano('Contemporaneo');
      setFormPostoAuto(true);
      setFormGiardino(false);
      setFormClasseEnergetica('G');
    }

    // Dettagli Attività
    if (listing.businessDetails) {
      setFormSettore(listing.businessDetails.settore_merceologico);
      setFormFatturato(listing.businessDetails.fatturato_annuo || 0);
      setFormCanoneMura(listing.businessDetails.canone_mura || 0);
      setFormUtile(listing.businessDetails.utile_netto || 0);
      setFormDipendenti(listing.businessDetails.numero_dipendenti || 0);
    } else {
      setFormSettore('Ristorazione / Bar');
      setFormFatturato(0);
      setFormCanoneMura(0);
      setFormUtile(0);
      setFormDipendenti(0);
    }

    // Amministrativi ed Extra
    setFormProvvigione(listing.provvigione || '3% + IVA');
    setFormTassazione(listing.tassazione || 'Cedolare Secca / Imposta Registro');
    setFormStatoImmobile(listing.stato_immobile || 'Ottimo / Ristrutturato');
    setFormAnnoCostruzione(listing.anno_costruzione || '2018');
    setFormRiscaldamento(listing.riscaldamento || 'Autonomo, aria condizionata');
    setFormDisponibilita(listing.disponibilita || 'Immediata al Rogito');
    setFormSpeseCondo(listing.spese_condominiali || '120 €/mese');

    // Segreti Studio BP
    setFormStimaRiservata(listing.stima_riservata || Math.round(listing.prezzo * 0.9));
    setFormProprietarioNome(listing.proprietario_nome || 'Mario Rossi');
    setFormProprietarioTelefono(listing.proprietario_telefono || '+39 333 1122334');

    setIsFormOpen(true);
  };

  // Apertura form per NUOVO inserimento
  const handleCreateNewClick = () => {
    setEditingListing(null);
    setFormCategory('IMMOBILE');
    setFormContratto('VENDITA');
    setFormTitolo('');
    setFormPrezzo(0);
    setFormIndirizzo('');
    setFormImmagini(['https://picsum.photos/seed/duomo/1200/800']);
    setFormDescrizione('');

    setFormMq(110);
    setFormStanze(4);
    setFormBagni(2);
    setFormPiano('1° con ascensore');
    setFormPostoAuto(true);
    setFormGiardino(false);
    setFormClasseEnergetica('B');
    setFormEPgl('125.4 kWh/m² anno');

    setFormSettore('Ristorazione');
    setFormFatturato(150000);
    setFormCanoneMura(1800);
    setFormUtile(35000);
    setFormDipendenti(2);

    setFormProvvigione('3% a carico acquirente');
    setFormTassazione('Imposta di Registro 9%');
    setFormStatoImmobile('Ottimo stato conservativo');
    setFormAnnoCostruzione('2015');
    setFormRiscaldamento('Autonomo a radiatori');
    setFormDisponibilita('Entro 6 mesi dal compromesso');
    setFormSpeseCondo('90 €/mese');

    setFormStimaRiservata(0);
    setFormProprietarioNome('');
    setFormProprietarioTelefono('');

    setIsFormOpen(true);
  };

  // Submit del Form (Salvataggio o aggiornamento)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitolo.trim()) {
      alert('Il titolo è obbligatorio!');
      return;
    }
    if (formPrezzo <= 0) {
      alert('Il prezzo deve essere maggiore di zero!');
      return;
    }

    const payload: Listing = {
      id: editingListing ? editingListing.id : Date.now(), // ID univoco temporale per i nuovi
      titolo: formTitolo,
      descrizione: formDescrizione,
      prezzo: Number(formPrezzo),
      indirizzo: formIndirizzo || 'Città d\'Ufficio, Italia',
      tipo_contratto: formContratto,
      categoria: formCategory,
      immagini: formImmagini,
      data_creazione: editingListing ? editingListing.data_creazione : new Date().toISOString(),
      
      // Amministrativi ed Extra
      provvigione: formProvvigione,
      tassazione: formTassazione,
      stato_immobile: formStatoImmobile,
      anno_costruzione: formAnnoCostruzione,
      riscaldamento: formRiscaldamento,
      disponibilita: formDisponibilita,
      spese_condominiali: formSpeseCondo,

      // Riservati Studio BP
      stima_riservata: formStimaRiservata > 0 ? Number(formStimaRiservata) : Math.round(Number(formPrezzo) * 0.92),
      proprietario_nome: formProprietarioNome || 'In attesa di scheda proprietario',
      proprietario_telefono: formProprietarioTelefono || '+39 000 000000',
    };

    // Costruisci i dettagli specifici in base alla categoria
    if (formCategory === 'IMMOBILE') {
      payload.propertyDetails = {
        mq: Number(formMq),
        stanze: Number(formStanze),
        bagni: Number(formBagni),
        classe_energetica: formClasseEnergetica,
        piano: formPiano,
        posto_auto: formPostoAuto,
        giardino: formGiardino
      };
    } else {
      payload.businessDetails = {
        settore_merceologico: formSettore,
        fatturato_annuo: formFatturato ? Number(formFatturato) : undefined,
        canone_mura: formCanoneMura ? Number(formCanoneMura) : undefined,
        utile_netto: formUtile ? Number(formUtile) : undefined,
        numero_dipendenti: formDipendenti ? Number(formDipendenti) : undefined
      };
    }

    let updatedListings: Listing[] = [];

    if (editingListing) {
      // Inserzione esistente in modifica
      updatedListings = listings.map(l => l.id === editingListing.id ? payload : l);
      showToast('Annuncio aggiornato con successo nel database locale.');
    } else {
      // Nuova inserzione
      updatedListings = [payload, ...listings];
      showToast('Nuovo annuncio salvato e posizionato in cima alla lista.');
    }

    setListings(updatedListings);
    localStorage.setItem('sbp_listings_home', JSON.stringify(updatedListings));
    setIsFormOpen(false);
    setEditingListing(null);

    // Rimuove query param di edit dall'URL per pulizia
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Seleziona una foto pre-impostata
  const handleSelectStockPhoto = (url: string) => {
    setFormImmagini([url]);
    showToast('Immagine di copertina impostata con successo.');
  };

  // Carica i dati all'avvio dal localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('sbp_editor_session');
      if (session === 'true') {
        const timerAuth = setTimeout(() => {
          setIsAuthenticated(true);
        }, 0);
        return () => clearTimeout(timerAuth);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedListings = localStorage.getItem('sbp_listings_home');
      const storedLeads = localStorage.getItem('sbp_leads_home');

      if (!storedListings) {
        localStorage.setItem('sbp_listings_home', JSON.stringify(INITIAL_LISTINGS));
      }
      if (!storedLeads) {
        localStorage.setItem('sbp_leads_home', JSON.stringify(INITIAL_LEADS));
      }

      // Rileva se un parametro URL "?edit=[id]" indica di avviare subito la modifica
      const params = new URLSearchParams(window.location.search);
      const editParam = params.get('edit');
      if (editParam) {
        const idInt = parseInt(editParam, 10);
        const currentListings = storedListings ? JSON.parse(storedListings) : INITIAL_LISTINGS;
        const found = currentListings.find((l: Listing) => l.id === idInt);
        if (found) {
          const timerEdit = setTimeout(() => {
            handleEditClick(found);
          }, 200);
          return () => clearTimeout(timerEdit);
        }
      }
    }
  }, []);

  // Filtra listings in tempo reale per la schermata
  const filteredListings = listings.filter(l => {
    const matchesSearch = l.titolo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.indirizzo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.id.toString() === searchTerm;
    const matchesCategory = filterCategory === 'Tutti' || l.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 border-t-4 border-amber-400 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Testata Superiore */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="hover:opacity-95 transition-opacity shrink-0">
            <LogoRound className="w-10 h-10 shadow-lg shrink-0" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-widest uppercase text-slate-100">
               Studio BP <span className="text-amber-400">Backoffice</span>
            </h1>
            <span className="text-[10px] text-slate-400 font-mono">Gestione Riservata Editore</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            href="/"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer text-[10px] font-black uppercase tracking-wider"
          >
            <ChevronLeft size={12} />
            Torna al Sito
          </Link>
          
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white border border-red-900/60 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut size={11} />
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Sezione Notifiche Toast in posizionamento locale */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-amber-400 text-slate-950 text-xs font-black px-6 py-3 text-center uppercase tracking-widest sticky top-16 z-50 shadow-md flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* SCHERMO 1: RICHIESTA CREDENZIALI DI ACCESSO EDITORE (SHIELD) */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl -z-10" />
            
            <div className="text-center space-y-4">
              <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                <Lock size={22} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-black uppercase tracking-widest text-white">Accesso Riservato</h2>
                <p className="text-slate-400 text-xs">Pannello di Caricamento e Controllo Studio BP Italia</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="mt-8 space-y-5 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Identificativo Utente (Role)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="E.g. editore"
                    className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Parola Chiave d&apos;Accesso</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci password securizzata..."
                  className="w-full bg-slate-900 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  required
                />
              </div>

              {authError && (
                <div className="bg-red-950/50 border border-red-900 px-3 py-2.5 rounded-xl text-[10.5px] font-bold text-red-400 leading-relaxed">
                  ⚠️ {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl transition-colors cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Shield size={14} />
                Sblocca Console Amministratore
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-900 text-center space-y-2">
              <span className="text-[9.5px] text-slate-500 uppercase tracking-wider font-extrabold block">🔑 credenziali demo integrate</span>
              <p className="text-[11px] text-amber-500/80 font-mono bg-slate-900/60 py-2 px-4 rounded-xl border border-slate-800/85">
                Nome: <strong className="text-white">editore</strong> / Password: <strong className="text-white">sbp</strong>
              </p>
            </div>
          </div>
        ) : (
          
          /* SCHERMO 2: AREA EDITORE CONNESSO */
          <div className="space-y-8">
            
            {/* Banner Informativo di Benvenuto */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 relative z-10 text-left">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-400 text-slate-950 text-[9px] font-black tracking-widest uppercase rounded">EDITORE ABILITATO</span>
                  <span className="text-slate-500 text-[10.5px] font-semibold">Sessione Sicura Locale</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">Benvenuto nel Gestore Studio BP</h2>
                <p className="text-slate-400 text-xs md:text-sm max-w-xl">
                  Qui puoi gestire integralmente le schede immobiliari B2C e le attività commerciali B2B. I dati salvati verranno scritti in <code className="text-amber-400 font-mono">localStorage</code> e saranno visibili istantaneamente sia in home page che nelle pagine dettaglio.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={handleCreateNewClick}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={15} />
                  Nuovo Annuncio
                </button>
              </div>
            </div>

            {/* Widget Informativi KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] uppercase font-black text-slate-500 tracking-wider">Immobili Totali</span>
                  <p className="text-2.5xl font-black text-white mt-1">{listings.filter(l => l.categoria === 'IMMOBILE').length}</p>
                </div>
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 border border-slate-800">
                  <Home size={18} />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] uppercase font-black text-slate-500 tracking-wider">Attività Commerciali</span>
                  <p className="text-2.5xl font-black text-white mt-1">{listings.filter(l => l.categoria === 'BUSINESS').length}</p>
                </div>
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 border border-slate-800">
                  <Briefcase size={18} />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] uppercase font-black text-slate-500 tracking-wider">Contatti Ricevuti</span>
                  <p className="text-2.5xl font-black text-amber-400 mt-1">{leads.length}</p>
                </div>
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-amber-400 border border-amber-900/40">
                  <Mail size={18} />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[9.5px] uppercase font-black text-slate-500 tracking-wider">Ruolo Operativo</span>
                  <p className="text-sm font-extrabold text-emerald-400 mt-2.5 uppercase tracking-wider">Editor in Chief</p>
                </div>
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-950">
                  <ShieldCheck size={18} />
                </div>
              </div>
            </div>

            {/* SEZIONE FILTRI E CONTROLLO TAB MULTI-SCHERMO */}
            <div className="flex border-b border-slate-800 p-1 bg-slate-950 rounded-2xl max-w-md">
              <button
                onClick={() => { setActiveTab('listings'); setIsFormOpen(false); }}
                className={`flex-1 py-3 text-center text-xs uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'listings' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database size={13} />
                Gestione Annunci
              </button>
              <button
                onClick={() => { setActiveTab('leads'); setIsFormOpen(false); }}
                className={`flex-1 py-3 text-center text-xs uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'leads' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={13} />
                Leads CRM ({leads.filter(l => l.status === 'NEW').length} nuovi)
              </button>
            </div>

            {/*******************************************************
             * SCHERMO 3: IL MODULO DI INSERIMENTO / MODIFICA (FORM)
             *******************************************************/}
            <AnimatePresence>
              {isFormOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 text-left relative"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest font-black">
                        {editingListing ? 'Modalità Modifica' : 'Procedura Nuovo Mandato'}
                      </span>
                      <h3 className="text-lg font-black uppercase text-white mt-0.5">
                        {editingListing ? `Modifica Scheda #${editingListing.id}` : 'Inserimento Nuova Scheda Bene'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsFormOpen(false)}
                      className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      Annulla ed Esci
                    </button>
                  </div>

                  <form onSubmit={handleSubmitForm} className="space-y-8">
                    
                    {/* Sezione 1: Parametri Chiave e Tipologia della Scheda */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-400 pl-2">1. Configurazione Categoria & Contratto</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Tipo di Annuncio</label>
                          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
                            <button
                              type="button"
                              onClick={() => setFormCategory('IMMOBILE')}
                              className={`py-2 text-center text-xs font-bold uppercase rounded-lg transition-colors ${
                                formCategory === 'IMMOBILE' ? 'bg-slate-900 text-white border border-slate-800' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Immobile (B2C)
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormCategory('BUSINESS')}
                              className={`py-2 text-center text-xs font-bold uppercase rounded-lg transition-colors ${
                                formCategory === 'BUSINESS' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Attività (B2B)
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Regime Contrattuale <strong className="text-red-500">*</strong></label>
                          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
                            <button
                              type="button"
                              onClick={() => setFormContratto('VENDITA')}
                              className={`py-2 text-center text-xs font-bold uppercase rounded-lg transition-all ${
                                formContratto === 'VENDITA' ? 'bg-slate-900 text-white border border-slate-800' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              IN VENDITA
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormContratto('AFFITTO')}
                              className={`py-2 text-center text-xs font-bold uppercase rounded-lg transition-all ${
                                formContratto === 'AFFITTO' ? 'bg-slate-900 text-red-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              IN LOCAZIONE
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sezione 2: Informazioni Pubbliche Base */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-400 pl-2">2. Informazioni Base Pubbliche</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Titolo dell&apos;Annuncio <strong className="text-red-500">*</strong></label>
                          <input
                            type="text"
                            value={formTitolo}
                            onChange={(e) => setFormTitolo(e.target.value)}
                            placeholder="E.g. Splendido Attico di Design Brera..."
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Prezzo Richiesto (€) <strong className="text-red-500">*</strong></label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-xs text-slate-500 font-mono font-bold">€</span>
                            <input
                              type="number"
                              value={formPrezzo}
                              onChange={(e) => setFormPrezzo(Number(e.target.value))}
                              placeholder="E.g. 450000"
                              className="w-full bg-slate-950 border border-slate-800 pl-9 pr-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                              required
                            />
                            {formContratto === 'AFFITTO' && (
                              <span className="absolute right-4 top-3 text-[10px] text-slate-500 font-mono">/ mese</span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Indirizzo Pubblico</label>
                          <input
                            type="text"
                            value={formIndirizzo}
                            onChange={(e) => setFormIndirizzo(e.target.value)}
                            placeholder="E.g. Via Solferino 18, Milano"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Impostazioni Immagine Copertina SBP</label>
                          <input
                            type="text"
                            value={formImmagini[0] || ''}
                            onChange={(e) => setFormImmagini([e.target.value])}
                            placeholder="Paster URL di un'immagine o seleziona qui sotto..."
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      </div>

                      {/* Selettore rapido foto pre-selezionate */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Foto stock pronte all&apos;uso (Scegli una per riempire la scheda):</span>
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                          {STOCK_PHOTOS.map(p => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => handleSelectStockPhoto(p.url)}
                              className={`p-1.5 bg-slate-950 hover:bg-slate-900 border text-center rounded-lg text-[9px] font-bold text-slate-350 truncate focus:outline-none ${
                                formImmagini[0] === p.url ? 'border-amber-400 ring-1 ring-amber-400 text-amber-400' : 'border-slate-850'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sezione 3: Amministrative & Provvigione (Provvigione, Tassazione) */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-400 pl-2">3. Provvigioni, Tassazione ed Oneri</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Schema Provvigione (Fiscale / Agenzia)</label>
                          <input
                            type="text"
                            value={formProvvigione}
                            onChange={(e) => setFormProvvigione(e.target.value)}
                            placeholder="E.g. 3% a carico venditore, 0% acquirente"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          <span className="text-[9.5px] text-slate-500 italic block">Specifica chi versa gli oneri di mediazione e la percentuale concordata.</span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Regime Fiscale e Tassazione</label>
                          <input
                            type="text"
                            value={formTassazione}
                            onChange={(e) => setFormTassazione(e.target.value)}
                            placeholder="E.g. Esente IVA, imposta registro prima casa 2%"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sezione 4: Caratteristiche in evidenza (Dinamico per Tipo) */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-400 pl-2">
                        {formCategory === 'IMMOBILE' ? '4. Caratteristiche Residenziali (IMMOBILE)' : '4. Report Economico Attività (BUSINESS)'}
                      </h4>

                      {formCategory === 'IMMOBILE' ? (
                        /* Campi specifici per Immobile */
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Superficie (Mq) <strong className="text-red-500">*</strong></label>
                            <input
                              type="number"
                              value={formMq}
                              onChange={(e) => setFormMq(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 px-3 py-3 rounded-xl text-xs text-white font-mono"
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Stanze / Locali</label>
                            <input
                              type="number"
                              value={formStanze}
                              onChange={(e) => setFormStanze(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 px-3 py-3 rounded-xl text-xs text-white font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Bagni</label>
                            <input
                              type="number"
                              value={formBagni}
                              onChange={(e) => setFormBagni(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 px-3 py-3 rounded-xl text-xs text-white font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Piano dell&apos;Appartamento</label>
                            <input
                              type="text"
                              value={formPiano}
                              onChange={(e) => setFormPiano(e.target.value)}
                              placeholder="E.g. 2° con ascensore"
                              className="w-full bg-slate-950 border border-slate-800 px-3 py-3 rounded-xl text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Classe Energetica</label>
                            <select
                              value={formClasseEnergetica}
                              onChange={(e) => setFormClasseEnergetica(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 px-3 py-3 rounded-xl text-xs text-white font-bold text-amber-400"
                            >
                              {['A4', 'A3', 'A2', 'A1', 'B', 'C', 'D', 'E', 'F', 'G'].map(cls => (
                                <option key={cls} value={cls} className="bg-slate-900 text-white font-bold">{cls}</option>
                              ))}
                            </select>
                          </div>

                          <div className="col-span-2 flex items-center gap-6 pt-5">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formPostoAuto}
                                onChange={(e) => setFormPostoAuto(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-800 text-amber-400 bg-slate-950 focus:ring-0 focus:ring-offset-0"
                              />
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Posto Auto Inclusivo</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formGiardino}
                                onChange={(e) => setFormGiardino(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-800 text-amber-400 bg-slate-950 focus:ring-0 focus:ring-offset-0"
                              />
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Giardino Privato</span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        /* Campi specifici per Attività Commerciale */
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Settore Merceologico</label>
                            <input
                              type="text"
                              value={formSettore}
                              onChange={(e) => setFormSettore(e.target.value)}
                              placeholder="E.g. Bar rionali / Hotel / Retail"
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Fatturato Annuo Consolidato (€)</label>
                            <input
                              type="number"
                              value={formFatturato}
                              onChange={(e) => setFormFatturato(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Utile Netto Annuo (€)</label>
                            <input
                              type="number"
                              value={formUtile}
                              onChange={(e) => setFormUtile(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Mensile Canone Mura (€)</label>
                            <input
                              type="number"
                              value={formCanoneMura}
                              onChange={(e) => setFormCanoneMura(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white font-mono"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 block">Numero Dipendenti in organico</label>
                            <input
                              type="number"
                              value={formDipendenti}
                              onChange={(e) => setFormDipendenti(Number(e.target.value))}
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white font-mono"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sezione 5: Descrizione Annuncio dettagliata */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-400 pl-2">5. Testo Descrittivo Pubblico</h4>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Descrizione Estesa <strong className="text-red-500">*</strong></label>
                        <textarea
                          value={formDescrizione}
                          onChange={(e) => setFormDescrizione(e.target.value)}
                          placeholder="Inserisci qui un testo accattivante e persuasivo per l'utenza..."
                          rows={6}
                          className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                          required
                        />
                      </div>
                    </div>

                    {/* Sezione 6: Dettagli Tecnici Scheda */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-400 pl-2">6. Dettagli Generali e Caratteristiche Tecniche</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Stato del Bene</label>
                          <input
                            type="text"
                            value={formStatoImmobile}
                            onChange={(e) => setFormStatoImmobile(e.target.value)}
                            placeholder="E.g. Ottimo / Ristrutturato recentemente"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Anno Costruzione / Inaugurazione</label>
                          <input
                            type="text"
                            value={formAnnoCostruzione}
                            onChange={(e) => setFormAnnoCostruzione(e.target.value)}
                            placeholder="E.g. 2018"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Riscaldamento ed Impianti</label>
                          <input
                            type="text"
                            value={formRiscaldamento}
                            onChange={(e) => setFormRiscaldamento(e.target.value)}
                            placeholder="E.g. Autonoma radiatori, rinfrescamento canalizzato"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Disponibilità sul mercato</label>
                          <input
                            type="text"
                            value={formDisponibilita}
                            onChange={(e) => setFormDisponibilita(e.target.value)}
                            placeholder="E.g. Rogito immediato / Libero subito"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Entità Spese Condominiali</label>
                          <input
                            type="text"
                            value={formSpeseCondo}
                            onChange={(e) => setFormSpeseCondo(e.target.value)}
                            placeholder="E.g. 120 €/mese comprensivo di riscaldamento"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Indice Prestazione EPgl,nren</label>
                          <input
                            type="text"
                            value={formEPgl}
                            onChange={(e) => setFormEPgl(e.target.value)}
                            placeholder="E.g. 142.5 kWh/m² anno"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mappa - coordinata visualizzata */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-400 pl-2">7. Mappa ed Ubicazione</h4>
                      <p className="text-[11px] text-slate-400">
                        Compila l&apos;ubicazione dell&apos;asset. Studio BP genera fittiziamente la mappa geopolitica securizzata WGS84 per l&apos;utente nella pagina pubblica a tutela della privacy proprietario.
                      </p>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-slate-400 block">Punto e Coordinate di Riferimento GPS</label>
                        <input
                          type="text"
                          placeholder="Fittizio o Reale e.g. 45.4642° N / 9.1900° E"
                          className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-slate-500 font-mono focus:outline-none"
                          disabled
                          value="COORD ACCURATE GENERATE AUTOMATICAMENTE BASATE SU INDIRIZZO"
                        />
                      </div>
                    </div>

                    {/* Sezione 7: Informazioni Riservate e Amministrative (SOLO STUDIO BP) */}
                    <div className="bg-amber-400/5 border-2 border-dashed border-amber-400 rounded-2xl p-5 md:p-6 space-y-5">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-slate-950 text-amber-400 rounded-lg"><Lock size={15} /></span>
                        <div>
                          <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">🔒 AREA RISERVATA ED INFORMAZIONI TUTELATE (STUDIO BP PRIVATE ONLY)</h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">Questi campi sono visualizzati unicamente nello staff banner del dettaglio e nel backoffice locale.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-amber-400 block tracking-wider">Stima Economica Alloggio / Bene (€)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-xs text-amber-500 font-mono font-bold">€</span>
                            <input
                              type="number"
                              value={formStimaRiservata}
                              onChange={(e) => setFormStimaRiservata(Number(e.target.value))}
                              placeholder="E.g. 1100000"
                              className="w-full bg-slate-950 border border-amber-400/40 pl-9 pr-4 py-3 rounded-xl text-xs text-amber-400 focus:outline-none focus:border-amber-400 font-mono"
                            />
                          </div>
                          <span className="text-[9px] text-slate-500 block">Stima commerciale reale per la consulenza asimmetrica Studio BP.</span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-amber-400 block tracking-wider">Nome e Cognome Proprietario</label>
                          <input
                            type="text"
                            value={formProprietarioNome}
                            onChange={(e) => setFormProprietarioNome(e.target.value)}
                            placeholder="E.g. Ing. Giovanni Rossi"
                            className="w-full bg-slate-950 border border-amber-400/40 px-4 py-3 rounded-xl text-xs text-amber-400 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-amber-400 block tracking-wider">Telefono del Proprietario</label>
                          <input
                            type="text"
                            value={formProprietarioTelefono}
                            onChange={(e) => setFormProprietarioTelefono(e.target.value)}
                            placeholder="E.g. +39 334 1234567"
                            className="w-full bg-slate-950 border border-amber-400/40 px-4 py-3 rounded-xl text-xs text-amber-400 focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bottoni di Invio */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-850">
                      <button
                        type="button"
                        onClick={() => { setIsFormOpen(false); setEditingListing(null); }}
                        className="px-5 py-3 bg-slate-900 hover:bg-slate-850 text-slate-350 hover:text-white rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer"
                      >
                        Annulla e Torna Indietro
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg cursor-pointer"
                      >
                        {editingListing ? 'Salva Modifiche Scheda' : 'Invia e Pubblica Scheda'}
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB CORRENTE TRASPARENTE: TABELLA DELLE SCHEDE ATTIVE */}
            {activeTab === 'listings' && !isFormOpen && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-white tracking-wider">Catalogo Inserzioni Attive</h3>
                    <p className="text-slate-500 text-xs">Cerca ed effettua manutenzione o cancella inserzioni presenti.</p>
                  </div>

                  <div className="flex flex-wrap gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Cerca per Titolo, Indirizzo o ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 w-full sm:w-60"
                    />

                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-400 font-bold"
                    >
                      <option value="Tutti">Tutti i rami</option>
                      <option value="IMMOBILE">B2C • Immobili</option>
                      <option value="BUSINESS">B2B • Attività</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-900">
                  <table className="w-full text-xs text-left text-slate-300 border-collapse">
                    <thead className="bg-slate-900/80 text-[9.5px] uppercase text-slate-400 font-mono tracking-widest border-b border-slate-850">
                      <tr>
                        <th className="px-4 py-3.5">ID</th>
                        <th className="px-4 py-3.5">Scheda Annuncio</th>
                        <th className="px-4 py-3.5">Ramo</th>
                        <th className="px-4 py-3.5">Ubicazione</th>
                        <th className="px-4 py-3.5 text-right">Richiesta (€)</th>
                        <th className="px-4 py-3.5 text-right">Stima Int (€)</th>
                        <th className="px-4 py-3.5">Proprietario</th>
                        <th className="px-4 py-3.5 text-center">Azioni</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 font-medium">
                      {filteredListings.length > 0 ? (
                        filteredListings.map(l => (
                          <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-4 py-4 font-mono text-[10.5px] text-slate-500 font-bold">#{l.id}</td>
                            <td className="px-4 py-4 min-w-[200px]">
                              <p className="font-extrabold text-white text-xs hover:text-amber-400 transition-colors">{l.titolo}</p>
                              <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 inline-block">{l.tipo_contratto}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest rounded-full ${
                                l.categoria === 'IMMOBILE' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' : 'bg-amber-950 text-amber-400 border border-amber-900'
                              }`}>
                                {l.categoria === 'IMMOBILE' ? 'Immobile' : 'Attività'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-slate-400">{l.indirizzo}</td>
                            <td className="px-4 py-4 text-right font-mono font-black text-white text-xs">
                              € {l.prezzo.toLocaleString('it-IT')}
                              {l.tipo_contratto === 'AFFITTO' ? <span className="text-[10px] font-normal text-slate-500"> /m</span> : ''}
                            </td>
                            <td className="px-4 py-4 text-right font-mono font-extrabold text-amber-400">
                              € {l.stima_riservata ? l.stima_riservata.toLocaleString('it-IT') : Math.round(l.prezzo * 0.92).toLocaleString('it-IT')}
                            </td>
                            <td className="px-4 py-4 text-slate-300">
                              <p className="font-extrabold text-xs">{l.proprietario_nome || 'Carlo Geri'}</p>
                              <span className="text-[10.5px] text-slate-500 font-mono italic">{l.proprietario_telefono || '+39 328...'}</span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <Link
                                  href={`/annunci/${l.id}`}
                                  target="_blank"
                                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-850"
                                  title="Anteprima Annuncio"
                                >
                                  <Eye size={12} />
                                </Link>
                                <button
                                  onClick={() => handleEditClick(l)}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white rounded-lg border border-slate-850 cursor-pointer"
                                  title="Modifica scheda"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteListing(l.id)}
                                  className="p-1.5 bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white rounded-lg border border-red-950 cursor-pointer"
                                  title="Elimina inserzione"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-slate-500 text-xs font-semibold">
                            Nessun annuncio trovato nel database locale.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/*******************************************************
             * SCHERMO 4: LEADS CRM GESTIONE CONTATTI
             *******************************************************/}
            {activeTab === 'leads' && !isFormOpen && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-5">
                <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2 justify-start">
                    <Users size={16} className="text-amber-400" />
                    <span>Inbound Leads CRM (Messaggi Ricevuti)</span>
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Gestisci le richieste di sopralluogo e i dossier inviati dai clienti.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {leads.length > 0 ? (
                    leads.map(lead => {
                      // Risolve la scheda collegata se esiste
                      const matchingListing = listings.find(l => l.id === lead.id_listing_associato);
                      
                      return (
                        <div key={lead.id} className="bg-slate-900/60 border border-slate-850 rounded-2xl p-4 md:p-5 text-left grid grid-cols-1 md:grid-cols-12 gap-4 items-start relative">
                          <div className="md:col-span-4 space-y-1.5">
                            <span className="text-[10px] text-slate-500 font-mono block">Data: {new Date(lead.data_creazione).toLocaleString('it-IT')}</span>
                            <h4 className="font-extrabold text-sm text-white">{lead.nome}</h4>
                            <div className="space-y-1 text-slate-400 text-xs pt-1">
                              <p className="flex items-center gap-1.5"><Mail size={12} /> {lead.email}</p>
                              {lead.telefono && <p className="flex items-center gap-1.5"><Phone size={12} /> {lead.telefono}</p>}
                            </div>
                          </div>

                          <div className="md:col-span-5 space-y-1.5 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                            <span className="text-[9.5px] uppercase font-black text-slate-500 tracking-wider">Messaggio del Cliente:</span>
                            <p className="text-xs text-slate-200 leading-relaxed font-sans">{lead.messaggio}</p>

                            {matchingListing && (
                              <div className="pt-2 mt-2 border-t border-slate-900 text-[10.5px] text-slate-400 font-semibold flex items-center justify-between">
                                <span>Interessato a: <strong>{matchingListing.titolo}</strong></span>
                                <Link href={`/annunci/${matchingListing.id}`} target="_blank" className="text-amber-400 hover:underline inline-flex items-center gap-0.5">
                                  Vedi scheda <Eye size={10} />
                                </Link>
                              </div>
                            )}
                          </div>

                          <div className="md:col-span-3 space-y-2 flex flex-col justify-between h-full">
                            <span className="text-[9.5px] uppercase font-black text-slate-500 tracking-wider block">CRM Work Status:</span>
                            
                            <div className="space-y-2">
                              {/* Status Badge */}
                              <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg block text-center ${
                                lead.status === 'NEW' ? 'bg-amber-400 text-slate-950 font-black' :
                                lead.status === 'CONTACTED' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' :
                                lead.status === 'IN_PROGRESS' ? 'bg-blue-950 text-blue-400 border border-blue-900' :
                                'bg-slate-900 text-slate-500 border border-slate-800'
                              }`}>
                                {lead.status}
                              </span>

                              {/* Status Select switcher */}
                              <select
                                value={lead.status}
                                onChange={(e) => handleLeadStatusChange(lead.id, e.target.value as LeadStatus)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-350 focus:outline-none"
                              >
                                <option value="NEW">Rilascia come Nuovo</option>
                                <option value="IN_PROGRESS">Segna In Lavorazione</option>
                                <option value="CONTACTED">Segna Contattato</option>
                                <option value="CLOSED">Segna Chiuso / Qualificato</option>
                                <option value="CANCELLED">Segna Annullato</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="bg-slate-900/30 border border-slate-850 p-6 text-center text-slate-500 text-xs font-semibold rounded-2xl">
                       Nessun messaggio lead pervenuto al CRM.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-center text-slate-500 text-[10.5px] font-mono mt-auto uppercase tracking-widest">
        <span>Amministrazione Integrata Studio BP Italia S.r.l. — Console Editore v2.6 -- All Rights Reserved © 2026</span>
      </footer>

    </div>
  );
}
