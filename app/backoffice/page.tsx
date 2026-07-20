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
  LayoutDashboard,
  UploadCloud,
  Star,
  Instagram,
  Share2,
  ExternalLink,
  Tag,
  Archive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LogoRound, LogoRectangular } from '@/components/Logo';

// Funzioni helper pure esterne per aggirare i controlli severi di reattività sui render
const getUniqueId = (): number => {
  return Date.now();
};

const getNowTimestamp = (): number => {
  return Date.now();
};

const getISODateString = (): string => {
  return new Date().toISOString();
};

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
  in_evidenza?: boolean;
  
  // Campi Getrix
  riferimento?: string;
  getrix_id?: string;
  comune?: string;
  zona?: string;
  tipologia?: string;
  
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
  pubblica_indirizzo?: boolean;
  trattativa_riservata?: boolean;
  asta?: boolean;
  latitudine?: string | null;
  longitudine?: string | null;
  zoom?: number;
  archiviato?: boolean;
  data_archiviazione?: string;
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
  metodo_contatto?: string;
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
  const [isDbConnected, setIsDbConnected] = useState<boolean | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

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

  // Vista Corrente: 'listings' | 'leads' | 'social' | 'taxonomies' | 'smtp' | 'archive'
  const [activeTab, setActiveTab] = useState<'listings' | 'leads' | 'social' | 'taxonomies' | 'smtp' | 'archive'>('listings');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Stati per la gestione della configurazione SMTP
  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: 587,
    secure: false,
    user: '',
    pass: '',
    fromEmail: '',
    toEmail: ''
  });
  const [smtpLoading, setSmtpLoading] = useState(false);
  const [smtpSaving, setSmtpSaving] = useState(false);

  // Stati per la gestione dei Post Social
  const [socialPosts, setSocialPosts] = useState<any[]>([]);
  const [socialLoading, setSocialLoading] = useState<boolean>(true);
  const [newSocialPlatform, setNewSocialPlatform] = useState<'INSTAGRAM' | 'TIKTOK'>('INSTAGRAM');
  const [newSocialUrl, setNewSocialUrl] = useState<string>('');
  const [newSocialEmbed, setNewSocialEmbed] = useState<string>('');
  const [newSocialCaption, setNewSocialCaption] = useState<string>('');

  // Stati per la gestione delle Tassonomie
  const [taxonomies, setTaxonomies] = useState<Record<string, string[]>>({
    TIPO_ANNUNCIO: [],
    REGIME_CONTRATTUALE: [],
    SETTORE_MERCEOLOGICO: [],
    STATO_DEL_BENE: [],
    RISCALDAMENTO_IMPIANTI: [],
    DISPONIBILITA_SUL_MERCATO: [],
    CATEGORIA: []
  });
  const [selectedTaxonomyName, setSelectedTaxonomyName] = useState<string>('TIPO_ANNUNCIO');
  const [newTaxonomyValue, setNewTaxonomyValue] = useState<string>('');
  const [editingTaxonomyValue, setEditingTaxonomyValue] = useState<string>('');
  const [editingTaxonomyIndex, setEditingTaxonomyIndex] = useState<number | null>(null);
  const [taxonomiesLoading, setTaxonomiesLoading] = useState<boolean>(true);

  // Stato opzione Getrix solo tassonomie
  const [importOnlyTaxonomies, setImportOnlyTaxonomies] = useState<boolean>(false);

  // Nuovi stati per l'inserimento di tassonomie personalizzate nel form di creazione/modifica
  const [customTipologia, setCustomTipologia] = useState<string>('');
  const [customStato, setCustomStato] = useState<string>('');
  const [customRiscaldamento, setCustomRiscaldamento] = useState<string>('');
  const [customDisponibilita, setCustomDisponibilita] = useState<string>('');
  const [customSettore, setCustomSettore] = useState<string>('');

  // Filtri nella tabella
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('Tutti');

  // Notifiche Banner
  const [notification, setNotification] = useState<string | null>(null);

  // Campi del form di inserimento/modifica
  const [formCategory, setFormCategory] = useState<CategoriaListing>('IMMOBILE');
  const [formContratto, setFormContratto] = useState<TipoContratto>('VENDITA');
  const [formTitolo, setFormTitolo] = useState<string>('');
  const [formTipologia, setFormTipologia] = useState<string>('Appartamento');
  const [formRiferimento, setFormRiferimento] = useState<string>('');
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

  // Campi gestionali visibilità, aste e mappe
  const [formPubblicaIndirizzo, setFormPubblicaIndirizzo] = useState<boolean>(true);
  const [formTrattativaRiservata, setFormTrattativaRiservata] = useState<boolean>(false);
  const [formAsta, setFormAsta] = useState<boolean>(false);
  const [formLatitudine, setFormLatitudine] = useState<string>('');
  const [formLongitudine, setFormLongitudine] = useState<string>('');
  const [formZoom, setFormZoom] = useState<number>(12);

  // Stati per l'importazione Getrix
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importUrl, setImportUrl] = useState<string>('http://feed.getrix.it/xml/62E6BB7C-0F18-4F3F-AE2A-4CBADDBFF53B.zip');
  const [importForce, setImportForce] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importStats, setImportStats] = useState<{
    added: number;
    updated: number;
    skipped: number;
    total: number;
  } | null>(null);
  const [lastImportDate, setLastImportDate] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sbp_last_getrix_import');
    }
    return null;
  });

  // Funzione per calcolare l'utilizzo delle caratteristiche
  const getFeaturesUsage = () => {
    const usage = {
      giardino: { label: 'Giardino Privato', used: false },
      posto_auto: { label: 'Box / Posto Auto', used: false },
      riscaldamento: { label: 'Dettagli Riscaldamento', used: false },
      spese_condominiali: { label: 'Spese Condominiali', used: false },
      utile_netto: { label: 'Utile Netto (B2B)', used: false },
      canone_mura: { label: 'Canone Mura (B2B)', used: false },
      numero_dipendenti: { label: 'Personale Dipendente (B2B)', used: false },
      classe_energetica: { label: 'Classe Energetica', used: false },
    };

    listings.forEach(l => {
      if (l.propertyDetails) {
        if (l.propertyDetails.giardino) usage.giardino.used = true;
        if (l.propertyDetails.posto_auto) usage.posto_auto.used = true;
        if (l.propertyDetails.classe_energetica && l.propertyDetails.classe_energetica !== 'G') usage.classe_energetica.used = true;
      }
      if (l.businessDetails) {
        if (l.businessDetails.utile_netto && l.businessDetails.utile_netto > 0) usage.utile_netto.used = true;
        if (l.businessDetails.canone_mura && l.businessDetails.canone_mura > 0) usage.canone_mura.used = true;
        if (l.businessDetails.numero_dipendenti && l.businessDetails.numero_dipendenti > 0) usage.numero_dipendenti.used = true;
      }
      if (l.riscaldamento) usage.riscaldamento.used = true;
      if (l.spese_condominiali) usage.spese_condominiali.used = true;
    });

    return usage;
  };

  // Funzione per l'importazione Getrix
  const handleGetrixImport = async (urlToFetch: string, forceOverwrite: boolean, onlyTaxonomies: boolean = false, isAutomatic: boolean = false) => {
    setIsImporting(true);
    setImportStats(null);
    try {
      const response = await fetch('/api/import-getrix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToFetch, force: forceOverwrite, onlyTaxonomies })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Errore durante l\'importazione Getrix');
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Formato di risposta non valido dall\'API Getrix');
      }

      if (onlyTaxonomies) {
        showToast(result.message || "Tassonomie importate con successo!");
        fetchTaxonomies();
        setIsImporting(false);
        return;
      }

      // Recuperiamo gli annunci aggiornati direttamente da MySQL
      const resListings = await fetch('/api/listings');
      if (resListings.ok) {
        const dbListings = await resListings.json();
        setListings(dbListings);
        localStorage.setItem('sbp_listings_home', JSON.stringify(dbListings));
      }

      const addedCount = result.added ?? 0;
      const updatedCount = result.updated ?? 0;
      const skippedCount = result.skipped ?? 0;

      const nowStr = new Date().toLocaleString('it-IT');
      localStorage.setItem('sbp_last_getrix_import', nowStr);
      setLastImportDate(nowStr);

      const stats = {
        added: addedCount,
        updated: updatedCount,
        skipped: skippedCount,
        total: result.count ?? 0
      };
      setImportStats(stats);

      if (isAutomatic) {
        showToast(`Import automatico completato: +${addedCount} aggiunti, ~${updatedCount} aggiornati.`);
      } else {
        showToast(`Sincronizzazione completata nel DB MySQL: +${addedCount} nuovi, ~${updatedCount} aggiornati.`);
      }
    } catch (error: any) {
      console.error(error);
      if (!isAutomatic) {
        alert(`Errore nell'importazione Getrix: ${error.message || error}`);
      } else {
        showToast(`Import automatico Getrix fallito: ${error.message || error}`);
      }
    } finally {
      setIsImporting(false);
    }
  };



  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        showToast('Autenticato con successo come Editore Studio BP');
        setAuthError('');
      } else {
        setAuthError(data.error || 'Credenziali non valide. Inserisci "editore" e "sbp" per accedere.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Errore durante la connessione al server.');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error("Errore richiamando API logout:", err);
    }
    setIsAuthenticated(false);
    localStorage.removeItem('sbp_editor_session');
    showToast('Sessione terminata correttamente.');
  };

  // Recupero configurazione SMTP
  const fetchSmtpConfig = async () => {
    try {
      setSmtpLoading(true);
      const res = await fetch('/api/smtp-config');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          setSmtpConfig(data.config);
        }
      }
    } catch (err) {
      console.error("Errore nel recupero della config SMTP:", err);
    } finally {
      setSmtpLoading(false);
    }
  };

  // Salvataggio configurazione SMTP
  const handleSmtpSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSmtpSaving(true);
      const res = await fetch('/api/smtp-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpConfig)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Configurazione SMTP salvata con successo!");
      } else {
        showToast(data.error || "Errore nel salvataggio della configurazione SMTP.");
      }
    } catch (err) {
      console.error("Errore nel salvataggio SMTP:", err);
      showToast("Errore di connessione durante il salvataggio SMTP.");
    } finally {
      setSmtpSaving(false);
    }
  };

  // Caricamento dei post social
  const fetchSocialPosts = async () => {
    try {
      setSocialLoading(true);
      const res = await fetch('/api/social-posts');
      if (res.ok) {
        const data = await res.json();
        setSocialPosts(data);
      }
    } catch (e) {
      console.error("Errore caricamento posts in backoffice:", e);
    } finally {
      setSocialLoading(false);
    }
  };

  // Creazione nuovo post social
  const handleAddSocialPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialUrl) {
      alert("L'URL del post o del video originale è obbligatorio.");
      return;
    }
    try {
      const res = await fetch('/api/social-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          piattaforma: newSocialPlatform,
          url_post: newSocialUrl,
          codice_embed: newSocialEmbed,
          didascalia: newSocialCaption
        })
      });
      if (res.ok) {
        const newPost = await res.json();
        setSocialPosts([newPost, ...socialPosts]);
        setNewSocialUrl('');
        setNewSocialEmbed('');
        setNewSocialCaption('');
        showToast("Nuovo post social integrato con successo!");
      } else {
        alert("Impossibile salvare il post social. Riprova.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Errore di rete durante il salvataggio.");
    }
  };

  // Cancellazione post social
  const handleDeleteSocialPost = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare definitivamente questo post social dal feed?")) return;
    try {
      const res = await fetch(`/api/social-posts?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSocialPosts(socialPosts.filter(p => p.id !== id));
        showToast("Post social eliminato correttamente.");
      } else {
        alert("Impossibile eliminare il post social.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cambia stato lead reale nel CRM su MySQL Prisma
  const handleLeadStatusChange = async (leadId: number, nextStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!response.ok) throw new Error("Impossibile aggiornare lo stato del lead su MySQL");
      
      const updatedLeads = leads.map(lead => {
        if (lead.id === leadId) {
          return { ...lead, status: nextStatus };
        }
        return lead;
      });
      setLeads(updatedLeads);
      localStorage.setItem('sbp_leads_home', JSON.stringify(updatedLeads));
      showToast(`Stato Lead #${leadId} aggiornato in: ${nextStatus}.`);
    } catch (err: any) {
      console.error(err);
      showToast(`Errore: ${err.message || 'Impossibile aggiornare lo stato'}`);
    }
  };

  // Caricamento delle tassonomie dal file JSON
  const fetchTaxonomies = async () => {
    try {
      setTaxonomiesLoading(true);
      const res = await fetch('/api/taxonomies');
      if (res.ok) {
        const data = await res.json();
        setTaxonomies(data);
      }
    } catch (e) {
      console.error("Errore caricamento tassonomie in backoffice:", e);
    } finally {
      setTaxonomiesLoading(false);
    }
  };

  // Creazione nuovo termine tassonomia
  const handleAddTaxonomy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaxonomyValue || newTaxonomyValue.trim() === '') {
      alert("Il valore non può essere vuoto.");
      return;
    }
    try {
      const res = await fetch('/api/taxonomies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          taxonomy: selectedTaxonomyName,
          value: newTaxonomyValue
        })
      });
      if (res.ok) {
        const updatedTax = await res.json();
        setTaxonomies(updatedTax);
        setNewTaxonomyValue('');
        showToast(`Nuova voce aggiunta a ${selectedTaxonomyName}!`);
      } else {
        const errData = await res.json();
        alert(errData.error || "Impossibile aggiungere la voce. Riprova.");
      }
    } catch (err) {
      console.error(err);
      alert("Errore di rete.");
    }
  };

  // Aggiornamento termine tassonomia
  const handleUpdateTaxonomy = async (oldValue: string, newValue: string) => {
    if (!newValue || newValue.trim() === '') {
      alert("Il valore non può essere vuoto.");
      return;
    }
    try {
      const res = await fetch('/api/taxonomies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          taxonomy: selectedTaxonomyName,
          oldValue,
          newValue
        })
      });
      if (res.ok) {
        const updatedTax = await res.json();
        setTaxonomies(updatedTax);
        setEditingTaxonomyIndex(null);
        setEditingTaxonomyValue('');
        showToast("Voce aggiornata con successo!");
      } else {
        const errData = await res.json();
        alert(errData.error || "Impossibile aggiornare la voce.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancellazione termine tassonomia
  const handleDeleteTaxonomy = async (value: string) => {
    if (!confirm(`Sei sicuro di voler eliminare definitivamente "${value}" da ${selectedTaxonomyName}?`)) return;
    try {
      const res = await fetch('/api/taxonomies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          taxonomy: selectedTaxonomyName,
          value
        })
      });
      if (res.ok) {
        const updatedTax = await res.json();
        setTaxonomies(updatedTax);
        showToast("Voce eliminata correttamente.");
      } else {
        const errData = await res.json();
        alert(errData.error || "Impossibile eliminare la voce.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Elimina inserzione da MySQL Prisma
  const handleDeleteListing = (listingId: number) => {
    setDeleteConfirmId(listingId);
  };

  const handleExecuteDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const response = await fetch(`/api/listings/${deleteConfirmId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error("Errore durante l'eliminazione dell'annuncio su MySQL");

      const updated = listings.filter(l => l.id !== deleteConfirmId);
      setListings(updated);
      localStorage.setItem('sbp_listings_home', JSON.stringify(updated));
      showToast('Annuncio rimosso dal database con successo.');
    } catch (err: any) {
      console.error(err);
      showToast(`Errore: ${err.message || "Impossibile eliminare l'annuncio"}`);
    } finally {
      setDeleteConfirmId(null);
    }
  };

  // Archiviazione manuale annuncio
  const handleArchiveListing = async (id: number) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archiviato: true })
      });
      if (!response.ok) throw new Error("Errore durante l'archiviazione");

      showToast("Annuncio archiviato nello storico con successo.");
      setListings(prev => prev.map(l => l.id === id ? { ...l, archiviato: true, data_archiviazione: new Date().toISOString() } : l));
    } catch (err: any) {
      console.error(err);
      showToast("Impossibile archiviare l'annuncio.");
    }
  };

  // Ripristina annuncio online
  const handleRestoreListing = async (id: number) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archiviato: false })
      });
      if (!response.ok) throw new Error("Errore durante il ripristino");

      showToast("Annuncio ripristinato online con successo.");
      setListings(prev => prev.map(l => l.id === id ? { ...l, archiviato: false, data_archiviazione: undefined } : l));
    } catch (err: any) {
      console.error(err);
      showToast("Impossibile ripristinare l'annuncio.");
    }
  };

  // Attiva/disattiva lo stato 'in evidenza' di un annuncio su MySQL
  const handleToggleFeatured = async (listingId: number, currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ in_evidenza: nextStatus })
      });
      if (!response.ok) throw new Error("Errore durante l'aggiornamento dello stato in evidenza");

      const updated = listings.map(l => {
        if (l.id === listingId) {
          return { ...l, in_evidenza: nextStatus };
        }
        return l;
      });
      setListings(updated);
      localStorage.setItem('sbp_listings_home', JSON.stringify(updated));
      showToast(nextStatus ? 'Annuncio impostato in evidenza con successo.' : 'Annuncio rimosso dagli annunci in evidenza.');
    } catch (err: any) {
      console.error(err);
      showToast(`Errore: ${err.message || 'Impossibile aggiornare lo stato in evidenza'}`);
    }
  };

  // Helper to sanitize any potential object or [object Object] values
  const cleanVal = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'object') {
      if (val['#text'] !== undefined && val['#text'] !== null) return String(val['#text']).trim();
      if (val.text !== undefined && val.text !== null) return String(val.text).trim();
      return '';
    }
    const s = String(val).replace(/\[object Object\]/gi, '').trim();
    return s === 'undefined' || s === 'null' ? '' : s;
  };
  // Edit click: pre-compila lo stato locale del form
  const handleEditClick = (listing: Listing) => {
    setEditingListing(listing);
    setFormCategory(listing.categoria);
    setFormContratto(listing.tipo_contratto);
    setFormTitolo(cleanVal(listing.titolo));
    setFormTipologia(cleanVal(listing.tipologia) || 'Appartamento');
    setFormRiferimento(cleanVal(listing.riferimento));
    setFormPrezzo(listing.prezzo);
    setFormIndirizzo(cleanVal(listing.indirizzo).replace(/^,\s*/, ''));
    setFormImmagini(listing.immagini && listing.immagini.length > 0 ? listing.immagini : ['https://picsum.photos/seed/duomo/1200/800']);
    setFormDescrizione(cleanVal(listing.descrizione));

    setCustomTipologia('');
    setCustomStato('');
    setCustomRiscaldamento('');
    setCustomDisponibilita('');
    setCustomSettore('');

    // Dettagli Immobile
    if (listing.propertyDetails) {
      setFormMq(listing.propertyDetails.mq);
      setFormStanze(listing.propertyDetails.stanze);
      setFormBagni(listing.propertyDetails.bagni);
      setFormPiano(cleanVal(listing.propertyDetails.piano) || 'Piano Terra');
      setFormPostoAuto(listing.propertyDetails.posto_auto);
      setFormGiardino(listing.propertyDetails.giardino);
      setFormClasseEnergetica(cleanVal(listing.propertyDetails.classe_energetica) || 'G');
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
      setFormSettore(cleanVal(listing.businessDetails.settore_merceologico) || 'Ristorazione / Bar');
      setFormFatturato(listing.businessDetails.fatturato_annuo ? Number(listing.businessDetails.fatturato_annuo) : 0);
      setFormCanoneMura(listing.businessDetails.canone_mura ? Number(listing.businessDetails.canone_mura) : 0);
      setFormUtile(listing.businessDetails.utile_netto ? Number(listing.businessDetails.utile_netto) : 0);
      setFormDipendenti(listing.businessDetails.numero_dipendenti || 0);
    } else {
      setFormSettore('Ristorazione / Bar');
      setFormFatturato(0);
      setFormCanoneMura(0);
      setFormUtile(0);
      setFormDipendenti(0);
    }

    // Amministrativi ed Extra
    setFormProvvigione(cleanVal(listing.provvigione) || '3% + IVA');
    setFormTassazione(cleanVal(listing.tassazione) || 'Cedolare Secca / Imposta Registro');
    setFormStatoImmobile(cleanVal(listing.stato_immobile) || 'Ottimo / Ristrutturato');
    setFormAnnoCostruzione(cleanVal(listing.anno_costruzione) || '2018');
    setFormRiscaldamento(cleanVal(listing.riscaldamento) || 'Autonomo, aria condizionata');
    setFormDisponibilita(cleanVal(listing.disponibilita) || 'Immediata al Rogito');
    setFormSpeseCondo(cleanVal(listing.spese_condominiali) || '120 €/mese');

    // Segreti Studio BP
    setFormStimaRiservata(listing.stima_riservata || Math.round(listing.prezzo * 0.9));
    setFormProprietarioNome(cleanVal(listing.proprietario_nome) || 'Mario Rossi');
    setFormProprietarioTelefono(cleanVal(listing.proprietario_telefono) || '+39 333 1122334');

    // Visibilità, aste e mappe
    setFormPubblicaIndirizzo(listing.pubblica_indirizzo !== undefined ? Boolean(listing.pubblica_indirizzo) : true);
    setFormTrattativaRiservata(listing.trattativa_riservata !== undefined ? Boolean(listing.trattativa_riservata) : false);
    setFormAsta(listing.asta !== undefined ? Boolean(listing.asta) : false);
    setFormLatitudine(cleanVal(listing.latitudine));
    setFormLongitudine(cleanVal(listing.longitudine));
    setFormZoom(listing.zoom !== undefined ? Number(listing.zoom) : 12);

    setIsFormOpen(true);
  };

  // Apertura form per NUOVO inserimento
  const handleCreateNewClick = () => {
    setEditingListing(null);
    setFormCategory('IMMOBILE');
    setFormContratto('VENDITA');
    setFormTitolo('');
    setFormRiferimento('');
    setFormPrezzo(0);
    setFormTipologia('Appartamento');
    setFormIndirizzo('');
    setFormImmagini(['https://picsum.photos/seed/duomo/1200/800']);
    setFormDescrizione('');

    setCustomTipologia('');
    setCustomStato('');
    setCustomRiscaldamento('');
    setCustomDisponibilita('');
    setCustomSettore('');

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

    // Visibilità, aste e mappe
    setFormPubblicaIndirizzo(true);
    setFormTrattativaRiservata(false);
    setFormAsta(false);
    setFormLatitudine('');
    setFormLongitudine('');
    setFormZoom(12);

    setIsFormOpen(true);
  };

  // Submit del Form (Salvataggio o aggiornamento reale in MySQL Prisma)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitolo.trim()) {
      alert('Il titolo è obbligatorio!');
      return;
    }
    if (formPrezzo <= 0) {
      alert('Il prezzo deve essere maggiore di zero!');
      return;
    }

    // Controllo che il codice modificato non sia già utilizzato in un'altra scheda
    const normalizedNewRef = formRiferimento.trim().toLowerCase();
    if (normalizedNewRef) {
      const isAlreadyUsed = listings.some(l => 
        l.riferimento && 
        l.riferimento.toLowerCase() === normalizedNewRef && 
        l.id !== editingListing?.id
      );
      if (isAlreadyUsed) {
        alert(`Il Codice di Riferimento "${formRiferimento}" è già utilizzato in un altro annuncio! Per favore, inserisci un codice univoco.`);
        return;
      }
    }

    const finalTipologia = formTipologia === '__NEW__' ? customTipologia.trim() : formTipologia;
    const finalStato = formStatoImmobile === '__NEW__' ? customStato.trim() : formStatoImmobile;
    const finalRiscaldamento = formRiscaldamento === '__NEW__' ? customRiscaldamento.trim() : formRiscaldamento;
    const finalDisponibilita = formDisponibilita === '__NEW__' ? customDisponibilita.trim() : formDisponibilita;
    const finalSettore = formSettore === '__NEW__' ? customSettore.trim() : formSettore;

    const payload: any = {
      titolo: formTitolo,
      descrizione: formDescrizione,
      prezzo: Number(formPrezzo),
      indirizzo: formIndirizzo || "Città d'Ufficio, Italia",
      tipo_contratto: formContratto,
      categoria: formCategory,
      immagini: formImmagini,
      riferimento: formRiferimento.trim() || undefined,
      tipologia: finalTipologia,
      
      // Amministrativi ed Extra
      provvigione: formProvvigione,
      tassazione: formTassazione,
      stato_immobile: finalStato,
      anno_costruzione: formAnnoCostruzione,
      riscaldamento: finalRiscaldamento,
      disponibilita: finalDisponibilita,
      spese_condominiali: formSpeseCondo,
      
      // Riservati Studio BP
      stima_riservata: formStimaRiservata > 0 ? Number(formStimaRiservata) : Math.round(Number(formPrezzo) * 0.92),
      proprietario_nome: formProprietarioNome || 'In attesa di scheda proprietario',
      proprietario_telefono: formProprietarioTelefono || '+39 000 000000',

      // Visibilità, aste e mappe
      pubblica_indirizzo: Boolean(formPubblicaIndirizzo),
      trattativa_riservata: Boolean(formTrattativaRiservata),
      asta: Boolean(formAsta),
      latitudine: formLatitudine.trim() || null,
      longitudine: formLongitudine.trim() || null,
      zoom: Number(formZoom),
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
        settore_merceologico: finalSettore,
        fatturato_annuo: formFatturato ? Number(formFatturato) : undefined,
        canone_mura: formCanoneMura ? Number(formCanoneMura) : undefined,
        utile_netto: formUtile ? Number(formUtile) : undefined,
        numero_dipendenti: formDipendenti ? Number(formDipendenti) : undefined
      };
    }

    try {
      let updatedListings: Listing[] = [];

      if (editingListing) {
        // Inserzione esistente in modifica su MySQL
        const response = await fetch(`/api/listings/${editingListing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Errore durante l'aggiornamento dell'annuncio su MySQL");

        const fullPayload: Listing = {
          ...editingListing,
          ...payload,
        } as Listing;

        updatedListings = listings.map(l => l.id === editingListing.id ? fullPayload : l);
        showToast('Annuncio aggiornato con successo nel database MySQL.');
      } else {
        // Nuova inserzione su MySQL
        const response = await fetch('/api/listings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Errore durante il salvataggio del nuovo annuncio su MySQL");

        const created: Listing = await response.json();
        // Converti eventuali Decimal o valori in numeri sul client
        const formattedCreated: Listing = {
          ...created,
          prezzo: Number(created.prezzo),
          stima_riservata: created.stima_riservata ? Number(created.stima_riservata) : undefined,
          businessDetails: created.businessDetails ? {
            ...created.businessDetails,
            fatturato_annuo: created.businessDetails.fatturato_annuo ? Number(created.businessDetails.fatturato_annuo) : undefined,
            canone_mura: created.businessDetails.canone_mura ? Number(created.businessDetails.canone_mura) : undefined,
            utile_netto: created.businessDetails.utile_netto ? Number(created.businessDetails.utile_netto) : undefined,
          } : undefined
        };

        updatedListings = [formattedCreated, ...listings];
        showToast('Nuovo annuncio salvato e registrato su MySQL.');
      }

      setListings(updatedListings);
      localStorage.setItem('sbp_listings_home', JSON.stringify(updatedListings));
      setIsFormOpen(false);
      setEditingListing(null);

      // Rimuove query param di edit dall'URL per pulizia
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err: any) {
      console.error(err);
      showToast(`Errore: ${err.message || "Impossibile salvare su database"}`);
    }
  };

  // Seleziona una foto pre-impostata
  const handleSelectStockPhoto = (url: string) => {
    if (formImmagini.includes(url)) {
      setFormImmagini(prev => prev.filter(img => img !== url));
      showToast('Immagine di stock rimossa.');
    } else {
      setFormImmagini(prev => [...prev, url]);
      showToast('Immagine di stock aggiunta alla galleria.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const updatedImmagini = [...formImmagini];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Converti in base64 per passarlo all'API di upload
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      try {
        const base64 = await base64Promise;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            base64: base64
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            updatedImmagini.push(data.url);
          }
        }
      } catch (err) {
        console.error("Errore durante il caricamento della foto:", err);
      }
    }

    setFormImmagini(updatedImmagini);
    setIsUploading(false);
    showToast("Immagini caricate e salvate sul server con successo!");
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormImmagini(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Carica i dati all'avvio dal localStorage / API Status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/api/auth/status');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
            return;
          }
        }
      } catch (err) {
        console.warn("Verifica sessione fallita, fallback localStorage:", err);
      }
      
      // Fallback per ambienti offline/ibridi
      if (typeof window !== 'undefined') {
        const session = localStorage.getItem('sbp_editor_session');
        if (session === 'true') {
          setIsAuthenticated(true);
        }
      }
    };
    checkAuthStatus();
  }, []);

  // Caricamento reale dei dati all'avvio dal database MySQL (Prisma)
  useEffect(() => {
    const loadRealData = async () => {
      let isConnected = false;
      try {
        const resListings = await fetch('/api/listings');
        if (resListings.ok) {
          const loadedListings = await resListings.json();
          setListings(loadedListings);
          localStorage.setItem('sbp_listings_home', JSON.stringify(loadedListings));
          isConnected = true;

          // Rileva se un parametro URL "?edit=[id]" indica di avviare subito la modifica
          const params = new URLSearchParams(window.location.search);
          const editParam = params.get('edit');
          if (editParam) {
            const idInt = parseInt(editParam, 10);
            const found = loadedListings.find((l: Listing) => l.id === idInt);
            if (found) {
              setTimeout(() => {
                handleEditClick(found);
              }, 200);
            }
          }
        }
      } catch (err) {
        console.warn("Utilizzo cache listings (fallback):", err);
      }

      try {
        const resLeads = await fetch('/api/leads');
        if (resLeads.ok) {
          const loadedLeads = await resLeads.json();
          setLeads(loadedLeads);
          localStorage.setItem('sbp_leads_home', JSON.stringify(loadedLeads));
          isConnected = true;
        }
      } catch (err) {
        console.warn("Utilizzo cache leads (fallback):", err);
      }

      setIsDbConnected(isConnected);
    };

    loadRealData();
  }, []);

  // Controllo automatico importazione settimanale
  useEffect(() => {
    if (!isAuthenticated) return;

    const lastImportTsStr = localStorage.getItem('sbp_last_getrix_import_ts');
    const now = getNowTimestamp();
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    let shouldAutoImport = false;
    if (!lastImportTsStr) {
      shouldAutoImport = true;
    } else {
      const lastImportTs = parseInt(lastImportTsStr, 10);
      if (isNaN(lastImportTs) || now - lastImportTs > SEVEN_DAYS_MS) {
        shouldAutoImport = true;
      }
    }

    if (shouldAutoImport) {
      const timer = setTimeout(() => {
        showToast('Avvio dell\'importazione automatica settimanale Getrix...');
        handleGetrixImport('http://feed.getrix.it/xml/62E6BB7C-0F18-4F3F-AE2A-4CBADDBFF53B.zip', false, false, true);
        localStorage.setItem('sbp_last_getrix_import_ts', String(getNowTimestamp()));
      }, 2500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Carica i post social al cambio tab
  useEffect(() => {
    if (activeTab === 'social' && isAuthenticated) {
      fetchSocialPosts();
    }
  }, [activeTab, isAuthenticated]);

  // Carica le tassonomie al cambio tab o all'apertura del modulo
  useEffect(() => {
    if ((activeTab === 'taxonomies' || isFormOpen) && isAuthenticated) {
      fetchTaxonomies();
    }
  }, [activeTab, isFormOpen, isAuthenticated]);

  // Filtra listings in tempo reale per la schermata
  const filteredListings = listings.filter(l => {
    const isNotArchived = !l.archiviato;
    const matchesSearch = l.titolo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.indirizzo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.id.toString() === searchTerm;
    const matchesCategory = filterCategory === 'Tutti' || l.categoria === filterCategory;
    return isNotArchived && matchesSearch && matchesCategory;
  });

  const filteredArchivedListings = listings.filter(l => {
    const isArchived = !!l.archiviato;
    const matchesSearch = l.titolo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.indirizzo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.id.toString() === searchTerm;
    const matchesCategory = filterCategory === 'Tutti' || l.categoria === filterCategory;
    // Ordiniamo gli archiviati per data di archiviazione decrescente se disponibile
    return isArchived && matchesSearch && matchesCategory;
  }).sort((a, b) => {
    const dateA = a.data_archiviazione ? new Date(a.data_archiviazione).getTime() : 0;
    const dateB = b.data_archiviazione ? new Date(b.data_archiviazione).getTime() : 0;
    return dateB - dateA;
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
                <div className="flex items-center gap-2.5 mt-2 py-1.5 px-3 bg-slate-900 border border-slate-850 rounded-xl max-w-fit">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    isDbConnected === true 
                      ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' 
                      : isDbConnected === false 
                      ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' 
                      : 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]'
                  }`} />
                  <span className="text-[11px] font-bold tracking-wide uppercase text-slate-300">
                    {isDbConnected === true ? (
                      <>Connessione Database MySQL: <span className="text-emerald-400 font-extrabold">Attiva & Sincronizzata</span></>
                    ) : isDbConnected === false ? (
                      <>Connessione Database MySQL: <span className="text-rose-500 font-extrabold">Sconnessa (Modo Cache Locale)</span></>
                    ) : (
                      "Rilevamento connessione database MySQL in corso..."
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-850 text-amber-400 hover:text-white border border-slate-800 font-extrabold uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Database size={15} />
                  Integrazione Getrix
                </button>
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
            <div className="flex flex-wrap border-b border-slate-800 p-1 bg-slate-950 rounded-2xl max-w-4xl gap-1">
              <button
                onClick={() => { setActiveTab('listings'); setIsFormOpen(false); }}
                className={`flex-1 py-3 px-2 text-center text-[10px] md:text-xs uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'listings' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database size={13} />
                <span>Gestione Annunci</span>
              </button>
              <button
                onClick={() => { setActiveTab('archive'); setIsFormOpen(false); }}
                className={`flex-1 py-3 px-2 text-center text-[10px] md:text-xs uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'archive' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Archive size={13} />
                <span>Storico Archivio</span>
              </button>
              <button
                onClick={() => { setActiveTab('leads'); setIsFormOpen(false); }}
                className={`flex-1 py-3 px-2 text-center text-[10px] md:text-xs uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'leads' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={13} />
                <span>Leads CRM ({leads.filter(l => l.status === 'NEW').length})</span>
              </button>
              <button
                onClick={() => { setActiveTab('social'); setIsFormOpen(false); fetchSocialPosts(); }}
                className={`flex-1 py-3 px-2 text-center text-[10px] md:text-xs uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'social' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Instagram size={13} />
                <span>Social Feed</span>
              </button>
              <button
                onClick={() => { setActiveTab('taxonomies'); setIsFormOpen(false); fetchTaxonomies(); }}
                className={`flex-1 py-3 px-2 text-center text-[10px] md:text-xs uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'taxonomies' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tag size={13} />
                <span>Gestione Tassonomie</span>
              </button>
              <button
                onClick={() => { setActiveTab('smtp'); setIsFormOpen(false); fetchSmtpConfig(); }}
                className={`flex-1 py-3 px-2 text-center text-[10px] md:text-xs uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'smtp' ? 'bg-slate-900 text-amber-400 border border-slate-800' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mail size={13} />
                <span>SMTP</span>
              </button>
            </div>

            {/*******************************************************
             * MODALE DI INTEGRAZIONE GETRIX
             *******************************************************/}
            <AnimatePresence>
              {isImportModalOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm"
                >
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative text-left">
                    
                    <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-400/10 rounded-xl flex items-center justify-center text-amber-400 border border-amber-400/20">
                          <Database size={20} />
                        </div>
                        <div>
                          <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest font-black">Getrix Feed Manager</span>
                          <h3 className="text-base font-black uppercase text-white mt-0.5">Sincronizzazione XML Immobiliare</h3>
                        </div>
                      </div>
                      <button
                        onClick={() => { setIsImportModalOpen(false); setImportStats(null); }}
                        className="text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer text-xs font-bold transition-all"
                      >
                        Chiudi
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">URL sorgente del Feed ZIP (XML)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={importUrl}
                            onChange={(e) => setImportUrl(e.target.value)}
                            placeholder="Inserisci URL del feed .zip o .xml..."
                            className="flex-1 bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setImportUrl('http://feed.getrix.it/xml/62E6BB7C-0F18-4F3F-AE2A-4CBADDBFF53B.zip')}
                            className="px-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold uppercase cursor-pointer"
                            title="Reimposta URL predefinito"
                          >
                            Reset
                          </button>
                        </div>
                        <p className="text-[10.5px] text-slate-500 italic leading-normal">
                          L&apos;archivio ZIP scaricato verrà scompattato in tempo reale. I codici di riferimento degli annunci verranno analizzati per prevenire duplicati.
                        </p>
                      </div>

                      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white block">Forza Riscrittura Inserzioni</span>
                          <p className="text-[10.5px] text-slate-500">
                            Se attivo, gli annunci già importati nel database verranno sovrascritti con le informazioni più aggiornate del feed.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={importForce}
                            onChange={(e) => setImportForce(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400 peer-checked:after:bg-slate-950 peer-checked:after:border-amber-400" />
                        </label>
                      </div>

                      <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white block">Importa solo Tassonomie</span>
                          <p className="text-[10.5px] text-slate-500">
                            Se attivo, verranno importati ed aggiornati solo i tipi di riscaldamento, stati immobili ed altre categorie. Nessun immobile verrà salvato nel database.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={importOnlyTaxonomies}
                            onChange={(e) => setImportOnlyTaxonomies(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400 peer-checked:after:bg-slate-950 peer-checked:after:border-amber-400" />
                        </label>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block">Ultimo Import di Successo:</span>
                          <span className="text-xs font-mono font-bold text-slate-300">
                            {lastImportDate ? `📅 ${lastImportDate}` : 'Mai sincronizzato in questa sessione'}
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={isImporting}
                          onClick={() => handleGetrixImport(importUrl, importForce, importOnlyTaxonomies)}
                          className={`px-6 py-3.5 bg-amber-400 hover:bg-amber-500 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-black uppercase tracking-widest text-xs rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                            isImporting ? 'animate-pulse' : ''
                          }`}
                        >
                          {isImporting ? (
                            <>
                              <Clock className="animate-spin animate-infinite" size={14} />
                              Elaborazione Feed in corso...
                            </>
                          ) : (
                            <>
                              <Database size={14} />
                              Avvia Importazione Manuale
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Report di Importazione */}
                    {importStats && (
                      <div className="bg-slate-950/60 border border-amber-400/20 p-5 rounded-2xl space-y-3">
                        <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">Riepilogo Elaborazione Getrix</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="bg-emerald-950/40 border border-emerald-900/60 p-3 rounded-xl text-center">
                            <span className="text-[9px] uppercase font-black text-emerald-400 block tracking-wider">Aggiunti</span>
                            <p className="text-xl font-mono font-black text-white mt-1">+{importStats.added}</p>
                          </div>
                          <div className="bg-blue-950/40 border border-blue-900/60 p-3 rounded-xl text-center">
                            <span className="text-[9px] uppercase font-black text-blue-400 block tracking-wider">Aggiornati</span>
                            <p className="text-xl font-mono font-black text-white mt-1">~{importStats.updated}</p>
                          </div>
                          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-center">
                            <span className="text-[9px] uppercase font-black text-slate-400 block tracking-wider">Saltati</span>
                            <p className="text-xl font-mono font-black text-white mt-1">{importStats.skipped}</p>
                          </div>
                          <div className="bg-amber-950/40 border border-amber-900/40 p-3 rounded-xl text-center">
                            <span className="text-[9px] uppercase font-black text-amber-400 block tracking-wider font-extrabold">Totali XML</span>
                            <p className="text-xl font-mono font-black text-white mt-1">{importStats.total}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stato Caratteristiche Sito Web */}
                    <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                      <div>
                        <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5 justify-start">
                          <ShieldCheck size={14} className="text-amber-400" />
                          <span>Monitoraggio Caratteristiche Sito Web</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                          Se alla fine dell&apos;importazione alcune caratteristiche non risultano utilizzate da alcun annuncio nel database, queste vengono disabilitate automaticamente per alleggerire le schede pubbliche.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1 font-sans">
                        {Object.entries(getFeaturesUsage()).map(([key, item]) => (
                          <div key={key} className="flex items-center justify-between p-2.5 bg-slate-900 rounded-xl border border-slate-850/80 text-[11px]">
                            <span className="font-semibold text-slate-300">{item.label}</span>
                            <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider rounded-md ${
                              item.used 
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/60' 
                                : 'bg-slate-950 text-slate-500 border border-slate-850'
                            }`}>
                              {item.used ? 'Attiva' : 'Disabilitata'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                        {editingListing ? `Modifica Scheda #${editingListing.id}${editingListing.riferimento ? ` (${cleanVal(editingListing.riferimento).toUpperCase()})` : ''}` : 'Inserimento Nuova Scheda Bene'}
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
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Tipo di Annuncio (Tipologia)</label>
                          <select
                            value={formTipologia}
                            onChange={(e) => setFormTipologia(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            {(taxonomies.TIPO_ANNUNCIO || []).map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                            <option value="__NEW__">+ Inserisci personalizzato...</option>
                          </select>
                          {formTipologia === '__NEW__' && (
                            <input
                              type="text"
                              value={customTipologia}
                              onChange={(e) => setCustomTipologia(e.target.value)}
                              placeholder="Specifica tipologia personalizzata..."
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-2 mt-2 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                              required
                            />
                          )}
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
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Codice di Riferimento</label>
                          <input
                            type="text"
                            value={formRiferimento}
                            onChange={(e) => setFormRiferimento(e.target.value)}
                            placeholder="E.g. att.cin.584, imm.123..."
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] uppercase font-black text-slate-400 block tracking-wider">Gestione Media Fisici (Foto Annuncio)</label>
                          
                          {/* File input drag and drop / click */}
                          <div className="border-2 border-dashed border-slate-800 hover:border-amber-400/50 rounded-2xl p-6 text-center transition-all bg-slate-950/40 relative group cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleFileUpload}
                              disabled={isUploading}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center justify-center gap-2">
                              <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 group-hover:text-amber-400 group-hover:border-amber-400/30 transition-colors">
                                <UploadCloud size={24} className={isUploading ? "animate-bounce text-amber-400" : ""} />
                              </div>
                              <span className="text-xs font-black uppercase text-slate-200 tracking-wider">
                                {isUploading ? "Caricamento in corso..." : "Carica Foto dal Computer"}
                              </span>
                              <span className="text-[10px] font-medium text-slate-500">
                                Trascina qui i file o clicca per sfogliare (Supporta selezione multipla)
                              </span>
                            </div>
                          </div>

                          {/* Preview Gallery */}
                          {formImmagini.length > 0 && (
                            <div className="space-y-2 pt-3">
                              <span className="text-[10.5px] text-slate-400 font-extrabold uppercase tracking-wider block">Galleria Immagini Associate ({formImmagini.length}):</span>
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                {formImmagini.map((url, index) => (
                                  <div key={index} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
                                    <img
                                      src={url}
                                      alt={`Foto ${index + 1}`}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      referrerPolicy="no-referrer"
                                    />
                                    {/* Badge Copertina */}
                                    {index === 0 && (
                                      <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black uppercase text-[8px] tracking-wider rounded-md shadow">
                                        Copertina
                                      </span>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(index)}
                                      className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                                      title="Rimuovi immagine"
                                    >
                                      <Trash2 size={10} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}


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
                            <select
                              value={formSettore}
                              onChange={(e) => setFormSettore(e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                            >
                              {(taxonomies.SETTORE_MERCEOLOGICO || []).map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                              <option value="__NEW__">+ Inserisci personalizzato...</option>
                            </select>
                            {formSettore === '__NEW__' && (
                              <input
                                type="text"
                                value={customSettore}
                                onChange={(e) => setCustomSettore(e.target.value)}
                                placeholder="Specifica settore personalizzato..."
                                className="w-full bg-slate-950 border border-slate-800 px-4 py-2 mt-2 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                                required
                              />
                            )}
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
                          <select
                            value={formStatoImmobile}
                            onChange={(e) => setFormStatoImmobile(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            {(taxonomies.STATO_DEL_BENE || []).map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                            <option value="__NEW__">+ Inserisci personalizzato...</option>
                          </select>
                          {formStatoImmobile === '__NEW__' && (
                            <input
                              type="text"
                              value={customStato}
                              onChange={(e) => setCustomStato(e.target.value)}
                              placeholder="Specifica stato personalizzato..."
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-2 mt-2 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                              required
                            />
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Anno Costruzione / Inaugurazione</label>
                          <input
                            type="text"
                            value={formAnnoCostruzione}
                            onChange={(e) => setFormAnnoCostruzione(e.target.value)}
                            placeholder="E.g. 2018"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Riscaldamento ed Impianti</label>
                          <select
                            value={formRiscaldamento}
                            onChange={(e) => setFormRiscaldamento(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            {(taxonomies.RISCALDAMENTO_IMPIANTI || []).map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                            <option value="__NEW__">+ Inserisci personalizzato...</option>
                          </select>
                          {formRiscaldamento === '__NEW__' && (
                            <input
                              type="text"
                              value={customRiscaldamento}
                              onChange={(e) => setCustomRiscaldamento(e.target.value)}
                              placeholder="Specifica riscaldamento personalizzato..."
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-2 mt-2 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                              required
                            />
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Disponibilità sul mercato</label>
                          <select
                            value={formDisponibilita}
                            onChange={(e) => setFormDisponibilita(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            {(taxonomies.DISPONIBILITA_SUL_MERCATO || []).map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                            <option value="__NEW__">+ Inserisci personalizzato...</option>
                          </select>
                          {formDisponibilita === '__NEW__' && (
                            <input
                              type="text"
                              value={customDisponibilita}
                              onChange={(e) => setCustomDisponibilita(e.target.value)}
                              placeholder="Specifica disponibilità personalizzata..."
                              className="w-full bg-slate-950 border border-slate-800 px-4 py-2 mt-2 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                              required
                            />
                          )}
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

                    {/* Mappa, Ubicazione e Opzioni Avanzate */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-5">
                      <h4 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-400 pl-2">7. Visibilità, Asta ed Ubicazione</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Imposta la privacy dell&apos;annuncio (nascondere l&apos;indirizzo o il prezzo al pubblico), indica se si tratta di un&apos;asta immobiliare ed inserisci le coordinate esatte per centrare la mappa.
                      </p>
                      
                      {/* Checkbox per Opzioni Visibilità e Asta */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formPubblicaIndirizzo}
                            onChange={(e) => setFormPubblicaIndirizzo(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-800 text-amber-500 focus:ring-amber-500 bg-slate-950"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">Pubblica Indirizzo</span>
                            <span className="text-[9px] text-slate-400">Mostra la via esatta al pubblico</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formTrattativaRiservata}
                            onChange={(e) => setFormTrattativaRiservata(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-800 text-amber-500 focus:ring-amber-500 bg-slate-950"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">Trattativa Riservata</span>
                            <span className="text-[9px] text-slate-400">Nasconde la cifra del prezzo</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={formAsta}
                            onChange={(e) => setFormAsta(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-800 text-amber-500 focus:ring-amber-500 bg-slate-950"
                          />
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">Immobile all&apos;Asta</span>
                            <span className="text-[9px] text-slate-400">Mostra badge Asta e inserisce in tassonomia</span>
                          </div>
                        </label>
                      </div>

                      {/* Inputs per Lat, Lng, Zoom */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Latitudine GPS (es. 45.0152)</label>
                          <input
                            type="text"
                            value={formLatitudine}
                            onChange={(e) => setFormLatitudine(e.target.value)}
                            placeholder="E.g. 45.01520157"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Longitudine GPS (es. 7.8287)</label>
                          <input
                            type="text"
                            value={formLongitudine}
                            onChange={(e) => setFormLongitudine(e.target.value)}
                            placeholder="E.g. 7.82870007"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black text-slate-400 block">Livello Zoom Mappa (1-20)</label>
                          <input
                            type="number"
                            value={formZoom}
                            onChange={(e) => setFormZoom(Number(e.target.value))}
                            placeholder="12"
                            min="1"
                            max="20"
                            className="w-full bg-slate-950 border border-slate-800 px-4 py-3 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
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

                {/* Visualizzazione Tabella su Desktop (> md) */}
                <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-900">
                  <table className="w-full text-xs text-left text-slate-300 border-collapse">
                    <thead className="bg-slate-900/80 text-[9.5px] uppercase text-slate-400 font-mono tracking-widest border-b border-slate-850">
                      <tr>
                        <th className="px-4 py-3.5">Codice Rif.</th>
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
                            <td className="px-4 py-4 font-mono text-[10.5px] text-slate-500 font-bold">{l.riferimento ? cleanVal(l.riferimento).toUpperCase() : `#${l.id}`}</td>
                            <td className="px-4 py-4 min-w-[200px]">
                              <p className="font-extrabold text-white text-xs hover:text-amber-400 transition-colors">{cleanVal(l.titolo)}</p>
                              <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 inline-block">{l.tipo_contratto}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest rounded-full ${
                                l.categoria === 'IMMOBILE' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' : 'bg-amber-950 text-amber-400 border border-amber-900'
                              }`}>
                                {l.categoria === 'IMMOBILE' ? 'Immobile' : 'Attività'}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono block mt-1">
                                {new Date(l.data_creazione).toLocaleDateString('it-IT')}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-slate-400">{cleanVal(l.indirizzo).replace(/^,\s*/, '')}</td>
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
                                  className="p-1.5 bg-slate-900 hover:bg-slate-850 text-amber-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer"
                                  title="Modifica scheda"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleToggleFeatured(l.id, l.in_evidenza || false)}
                                  className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                                    l.in_evidenza
                                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900 hover:bg-emerald-900 hover:text-white'
                                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                                  }`}
                                  title={l.in_evidenza ? "In evidenza (Attivo)" : "Imposta in evidenza"}
                                >
                                  <Star size={12} className={l.in_evidenza ? 'fill-current' : ''} />
                                </button>
                                <button
                                   onClick={() => handleArchiveListing(l.id)}
                                   className="p-1.5 bg-amber-950/35 hover:bg-amber-900/60 text-amber-400 hover:text-white rounded-lg border border-amber-950 cursor-pointer"
                                   title="Archivia inserzione nello storico"
                                 >
                                   <Archive size={12} />
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

                {/* Visualizzazione Card su Mobile (< md) */}
                <div className="block md:hidden space-y-4">
                  {filteredListings.length > 0 ? (
                    filteredListings.map(l => (
                      <div key={l.id} className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl space-y-3.5 text-xs text-left">
                        
                        {/* Riga 1: Rif e Ramo */}
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wide">
                            {l.riferimento ? cleanVal(l.riferimento).toUpperCase() : `#${l.id}`}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase tracking-widest rounded-full ${
                              l.categoria === 'IMMOBILE' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' : 'bg-amber-950 text-amber-400 border border-amber-900'
                            }`}>
                              {l.categoria === 'IMMOBILE' ? 'Immobile' : 'Attività'}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(l.data_creazione).toLocaleDateString('it-IT')}
                            </span>
                          </div>
                        </div>

                        {/* Riga 2: Titolo ed Indirizzo */}
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-white text-sm leading-snug">{cleanVal(l.titolo)}</h4>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{l.tipo_contratto}</span>
                          <p className="text-slate-400 text-[11px] leading-relaxed">{cleanVal(l.indirizzo).replace(/^,\s*/, '')}</p>
                        </div>

                        {/* Riga 3: Dati Economici */}
                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/60 rounded-xl border border-slate-900">
                          <div>
                            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block">Richiesta</span>
                            <span className="font-mono font-black text-white text-xs mt-0.5 block">
                              € {l.prezzo.toLocaleString('it-IT')}
                              {l.tipo_contratto === 'AFFITTO' ? <span className="text-[10px] font-normal text-slate-500">/m</span> : ''}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block">Stima Interna</span>
                            <span className="font-mono font-extrabold text-amber-400 text-xs mt-0.5 block">
                              € {l.stima_riservata ? l.stima_riservata.toLocaleString('it-IT') : Math.round(l.prezzo * 0.92).toLocaleString('it-IT')}
                            </span>
                          </div>
                        </div>

                        {/* Riga 4: Proprietario */}
                        <div className="flex justify-between items-center text-[10.5px] py-1 border-t border-slate-900">
                          <div className="text-slate-300">
                            <span className="text-[8.5px] text-slate-500 font-bold uppercase block leading-none mb-0.5">Proprietario</span>
                            <span className="font-bold">{l.proprietario_nome || 'Carlo Geri'}</span>
                            <span className="text-slate-500 ml-2 italic font-mono">{l.proprietario_telefono || '+39 328...'}</span>
                          </div>
                          {l.in_evidenza && (
                            <span className="text-[9px] text-emerald-400 bg-emerald-950/30 border border-emerald-900/60 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                              <Star size={10} className="fill-current" />
                              Evidenza
                            </span>
                          )}
                        </div>

                        {/* Riga 5: Azioni */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-850">
                          <Link
                            href={`/annunci/${l.id}`}
                            target="_blank"
                            className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-slate-350 hover:text-white rounded-xl border border-slate-850 font-bold text-center text-[10.5px] flex items-center justify-center gap-1.5"
                          >
                            <Eye size={12} />
                            <span>Vedi</span>
                          </Link>
                          <button
                            onClick={() => handleEditClick(l)}
                            className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-amber-400 hover:text-white rounded-xl border border-slate-800 font-bold text-[10.5px] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Edit2 size={12} />
                            <span>Modifica</span>
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(l.id, l.in_evidenza || false)}
                            className={`p-2 rounded-xl border cursor-pointer transition-all ${
                              l.in_evidenza
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900'
                                : 'bg-slate-900 text-slate-500 border-slate-800'
                            }`}
                          >
                            <Star size={12} className={l.in_evidenza ? 'fill-current' : ''} />
                          </button>
                          <button
                            onClick={() => handleArchiveListing(l.id)}
                            className="p-2 bg-amber-950/35 hover:bg-amber-900 text-amber-400 hover:text-white rounded-xl border border-amber-950 cursor-pointer"
                            title="Archivia"
                          >
                            <Archive size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-950 border border-slate-850 rounded-2xl text-slate-500 text-xs font-semibold">
                      Nessun annuncio trovato nel database locale.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'archive' && !isFormOpen && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-5 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                      <Archive size={16} className="text-amber-400" />
                      <span>Storico Inserzioni Archiviate ({filteredArchivedListings.length})</span>
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">Elenco degli annunci ritirati dal mercato, venduti o archiviati dall'importatore Getrix.</p>
                  </div>
                </div>

                {/* Vista Tabella Wide Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  {filteredArchivedListings.length > 0 ? (
                    <table className="w-full text-xs text-left text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-slate-900/30">
                          <th className="px-4 py-3.5 text-left">Codice Rif.</th>
                          <th className="px-4 py-3.5 text-left">Scheda Annuncio</th>
                          <th className="px-4 py-3.5 text-left">Ramo</th>
                          <th className="px-4 py-3.5 text-left">Ubicazione</th>
                          <th className="px-4 py-3.5 text-left">Richiesta (€)</th>
                          <th className="px-4 py-3.5 text-left">Data Archiviazione</th>
                          <th className="px-4 py-3.5 text-center">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {filteredArchivedListings.map(l => (
                          <tr key={l.id} className="hover:bg-slate-900/40 transition-colors">
                            <td className="px-4 py-4 font-mono text-[10.5px] text-slate-500 font-bold">
                              {l.riferimento ? cleanVal(l.riferimento).toUpperCase() : `#${l.id}`}
                            </td>
                            <td className="px-4 py-4 min-w-[200px]">
                              <p className="font-extrabold text-white text-xs">{cleanVal(l.titolo)}</p>
                              <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 inline-block">{l.tipo_contratto}</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider ${
                                l.categoria === 'IMMOBILE'
                                  ? 'bg-amber-900/20 text-amber-400 border border-amber-900/40'
                                  : 'bg-emerald-950 text-emerald-400 border border-emerald-950'
                              }`}>
                                {l.categoria === 'IMMOBILE' ? 'Immobile' : 'Attività'}
                              </span>
                            </td>
                            <td className="px-4 py-4 truncate max-w-[200px]" title={l.indirizzo}>
                              {cleanVal(l.indirizzo)}
                            </td>
                            <td className="px-4 py-4 font-extrabold text-slate-100 whitespace-nowrap">
                              € {Number(l.prezzo).toLocaleString('it-IT')}
                            </td>
                            <td className="px-4 py-4 text-slate-400 font-mono whitespace-nowrap">
                              {l.data_archiviazione ? new Date(l.data_archiviazione).toLocaleDateString('it-IT') : 'N/D'}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleRestoreListing(l.id)}
                                  className="p-1.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 hover:text-white rounded-lg border border-emerald-900 cursor-pointer"
                                  title="Ripristina e rimetti online"
                                >
                                  <CheckCircle size={12} />
                                </button>
                                <button
                                  onClick={() => handleEditClick(l)}
                                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer"
                                  title="Modifica"
                                >
                                  <Edit2 size={12} />
                                </button>
                                <button
                                  onClick={() => handleDeleteListing(l.id)}
                                  className="p-1.5 bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white rounded-lg border border-red-950 cursor-pointer"
                                  title="Elimina definitivamente"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center bg-slate-900/30 border border-slate-850 rounded-2xl text-slate-500 text-xs font-semibold">
                      Nessun annuncio presente nello storico archiviati.
                    </div>
                  )}
                </div>

                {/* Vista Griglia Mobile (md:hidden) */}
                <div className="md:hidden grid grid-cols-1 gap-4">
                  {filteredArchivedListings.length > 0 ? (
                    filteredArchivedListings.map(l => (
                      <div key={l.id} className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl space-y-3 text-xs text-left">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono font-bold tracking-wide">
                            {l.riferimento ? cleanVal(l.riferimento).toUpperCase() : `#${l.id}`}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-black uppercase tracking-wider ${
                            l.categoria === 'IMMOBILE' ? 'bg-amber-900/20 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                          }`}>
                            {l.categoria === 'IMMOBILE' ? 'Immobile' : 'Attività'}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-white text-xs">{cleanVal(l.titolo)}</h4>
                          <p className="text-slate-400 mt-1 font-semibold">{cleanVal(l.indirizzo)}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div>
                            <span className="text-[8.5px] text-slate-500 font-bold uppercase block">Richiesta</span>
                            <span className="font-extrabold text-white">€ {Number(l.prezzo).toLocaleString('it-IT')}</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] text-slate-500 font-bold uppercase block">Archiviato il</span>
                            <span className="font-semibold text-slate-350">{l.data_archiviazione ? new Date(l.data_archiviazione).toLocaleDateString('it-IT') : 'N/D'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-850">
                          <button
                            onClick={() => handleRestoreListing(l.id)}
                            className="flex-1 py-2 bg-emerald-950/40 hover:bg-emerald-900 text-emerald-400 hover:text-white rounded-xl border border-emerald-900 font-bold text-[10.5px] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle size={12} />
                            <span>Ripristina</span>
                          </button>
                          <button
                            onClick={() => handleEditClick(l)}
                            className="flex-1 py-2 bg-slate-900 hover:bg-slate-850 text-amber-400 hover:text-white rounded-xl border border-slate-800 font-bold text-[10.5px] flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Edit2 size={12} />
                            <span>Modifica</span>
                          </button>
                          <button
                            onClick={() => handleDeleteListing(l.id)}
                            className="p-2 bg-red-950/30 hover:bg-red-900 text-red-400 hover:text-white rounded-xl border border-red-950 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center bg-slate-950 border border-slate-850 rounded-2xl text-slate-500 text-xs font-semibold">
                      Nessun annuncio presente nello storico archiviati.
                    </div>
                  )}
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
                            <div className="flex items-center justify-between md:justify-start gap-2">
                              <span className="text-[10px] text-slate-500 font-mono">Data: {new Date(lead.data_creazione).toLocaleString('it-IT')}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                                lead.metodo_contatto === 'WHATSAPP' 
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/40' 
                                  : 'bg-indigo-950 text-indigo-400 border border-indigo-900/40'
                              }`}>
                                {lead.metodo_contatto === 'WHATSAPP' ? 'WhatsApp' : 'E-mail'}
                              </span>
                            </div>
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

            {/*******************************************************
             * SCHERMO 5: STUDIO BP SOCIAL GESTIONE FEED
             *******************************************************/}
            {activeTab === 'social' && !isFormOpen && (
              <div className="space-y-6">
                
                {/* Modulo di inserimento nuovo post */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 text-left space-y-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                      <Share2 size={16} className="text-amber-400" />
                      <span>Integra Nuovo Post / Video Social</span>
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">Inserisci un reel o post di Instagram o un video di TikTok per mostrarlo sul sito.</p>
                  </div>

                  <form onSubmit={handleAddSocialPost} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Piattaforma</label>
                        <select
                          value={newSocialPlatform}
                          onChange={(e) => setNewSocialPlatform(e.target.value as 'INSTAGRAM' | 'TIKTOK')}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none"
                        >
                          <option value="INSTAGRAM">Instagram / Reels</option>
                          <option value="TIKTOK">TikTok Video</option>
                        </select>
                      </div>

                      <div className="md:col-span-2 space-y-1">
                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">URL Originale del Post</label>
                        <input
                          type="url"
                          placeholder="https://www.instagram.com/p/... o https://www.tiktok.com/@..."
                          value={newSocialUrl}
                          onChange={(e) => setNewSocialUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                          required
                        />
                      </div>

                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Codice Embed Iframe (Opzionale)</label>
                      <textarea
                        placeholder="Incolla qui il codice <iframe> fornito dalla piattaforma se vuoi incorporare il widget interattivo."
                        value={newSocialEmbed}
                        onChange={(e) => setNewSocialEmbed(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Didascalia / Descrizione del Post</label>
                      <textarea
                        placeholder="Scrivi una breve didascalia descrittiva che spieghi il post o fornisca informazioni utili."
                        value={newSocialCaption}
                        onChange={(e) => setNewSocialCaption(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all hover:scale-102 flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
                      >
                        <Plus size={14} />
                        <span>Integra Post Social</span>
                      </button>
                    </div>

                  </form>
                </div>

                {/* Elenco dei post social attivi */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 text-left space-y-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-white tracking-wider">Feed Social Attivo ({socialPosts.length} post)</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Elenco di tutti i post social integrati che appaiono nella pagina Studio BP Social.</p>
                  </div>

                  {socialLoading ? (
                    <p className="text-xs text-slate-500 font-semibold text-center py-6">Caricamento post social...</p>
                  ) : socialPosts.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-slate-850">
                      <table className="w-full text-slate-300 text-xs">
                        <thead>
                          <tr className="bg-slate-900 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-850 text-[10px]">
                            <th className="px-4 py-3.5 text-left">Piattaforma</th>
                            <th className="px-4 py-3.5 text-left">Didascalia</th>
                            <th className="px-4 py-3.5 text-left">Link</th>
                            <th className="px-4 py-3.5 text-left">Data Creazione</th>
                            <th className="px-4 py-3.5 text-center">Azioni</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {socialPosts.map((post) => {
                            const isInsta = post.piattaforma === 'INSTAGRAM';
                            return (
                              <tr key={post.id} className="hover:bg-slate-900/40 transition-colors">
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                                    isInsta ? 'bg-pink-900/30 text-pink-400' : 'bg-slate-800 text-white'
                                  }`}>
                                    {post.piattaforma}
                                  </span>
                                </td>
                                <td className="px-4 py-3.5 max-w-xs truncate font-semibold">
                                  {post.didascalia || "Nessuna didascalia."}
                                </td>
                                <td className="px-4 py-3.5 truncate max-w-[150px] font-mono text-[10px] text-slate-500">
                                  <a 
                                    href={post.url_post} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-amber-500 hover:underline flex items-center gap-1"
                                  >
                                    <span>Vedi Post</span>
                                    <ExternalLink size={10} />
                                  </a>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap font-semibold">
                                  {new Date(post.data_creazione).toLocaleDateString('it-IT')}
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap text-center">
                                  <button
                                    onClick={() => handleDeleteSocialPost(post.id)}
                                    className="p-2 text-red-500 hover:bg-red-950/30 hover:text-red-400 rounded-xl transition-colors cursor-pointer"
                                    title="Elimina post"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-slate-900/30 border border-slate-850 p-6 text-center text-slate-500 text-xs font-semibold rounded-2xl">
                      Nessun post social integrato al momento.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/*******************************************************
             * SCHERMO 6: GESTIONE TASSONOMIE
             *******************************************************/}
            {activeTab === 'taxonomies' && !isFormOpen && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 space-y-6 text-left">
                <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Tag size={16} className="text-amber-400" />
                    <span>Gestione Tassonomie & Categorie</span>
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Gestisci le voci dei menu a discesa per i campi di descrizione degli immobili e delle attività.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Selettore Tassonomia */}
                  <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Scegli Tassonomia</label>
                      <select
                        value={selectedTaxonomyName}
                        onChange={(e) => {
                          setSelectedTaxonomyName(e.target.value);
                          setEditingTaxonomyIndex(null);
                          setEditingTaxonomyValue('');
                          setNewTaxonomyValue('');
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="TIPO_ANNUNCIO">Tipo di Annuncio (tipologia)</option>
                        <option value="REGIME_CONTRATTUALE">Regime Contrattuale (contratto)</option>
                        <option value="SETTORE_MERCEOLOGICO">Settore Merceologico</option>
                        <option value="STATO_DEL_BENE">Stato del Bene (stato)</option>
                        <option value="RISCALDAMENTO_IMPIANTI">Riscaldamento ed Impianti</option>
                        <option value="DISPONIBILITA_SUL_MERCATO">Disponibilità sul Mercato</option>
                        <option value="CATEGORIA">Categoria Principale</option>
                      </select>
                    </div>

                    <form onSubmit={handleAddTaxonomy} className="space-y-2 pt-2 border-t border-slate-850">
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Aggiungi nuova voce</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTaxonomyValue}
                          onChange={(e) => setNewTaxonomyValue(e.target.value)}
                          placeholder="Nuovo valore..."
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <button
                          type="submit"
                          className="px-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Elenco Termini */}
                  <div className="lg:col-span-2 bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                      Valori registrati per: <span className="text-amber-400">{selectedTaxonomyName.replace(/_/g, ' ')}</span>
                    </span>

                    {taxonomiesLoading ? (
                      <div className="py-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                        Caricamento tassonomie in corso...
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-slate-350">
                          <thead>
                            <tr className="border-b border-slate-850 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                              <th className="py-2.5 px-3">Valore</th>
                              <th className="py-2.5 px-3 text-right">Azioni</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {taxonomies[selectedTaxonomyName] && taxonomies[selectedTaxonomyName].length > 0 ? (
                              taxonomies[selectedTaxonomyName].map((val, idx) => (
                                <tr key={idx} className="hover:bg-slate-950/20">
                                  <td className="py-3 px-3 font-semibold text-white">
                                    {editingTaxonomyIndex === idx ? (
                                      <div className="flex gap-2 items-center">
                                        <input
                                          type="text"
                                          value={editingTaxonomyValue}
                                          onChange={(e) => setEditingTaxonomyValue(e.target.value)}
                                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-455"
                                        />
                                        <button
                                          onClick={() => handleUpdateTaxonomy(val, editingTaxonomyValue)}
                                          className="p-1 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 rounded-lg border border-emerald-900 cursor-pointer"
                                        >
                                          <Check size={12} />
                                        </button>
                                        <button
                                          onClick={() => { setEditingTaxonomyIndex(null); setEditingTaxonomyValue(''); }}
                                          className="p-1 bg-slate-850 text-slate-400 hover:bg-slate-800 rounded-lg border border-slate-800 cursor-pointer"
                                        >
                                          Chiudi
                                        </button>
                                      </div>
                                    ) : (
                                      <span>{val}</span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-right">
                                    {editingTaxonomyIndex !== idx && (
                                      <div className="inline-flex gap-2">
                                        <button
                                          onClick={() => { setEditingTaxonomyIndex(idx); setEditingTaxonomyValue(val); }}
                                          className="p-1.5 bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                                        >
                                          <Edit2 size={12} />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTaxonomy(val)}
                                          className="p-1.5 bg-red-950/30 border border-red-950 text-red-400 hover:text-white rounded-lg cursor-pointer"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={2} className="py-6 text-center text-slate-500 italic">
                                  Nessun valore memorizzato per questa tassonomia.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'smtp' && !isFormOpen && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-6 text-left space-y-5">
                <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                    <Mail size={16} className="text-amber-400" />
                    <span>Configurazione Server SMTP Notifiche</span>
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5 font-semibold">
                    Configura i parametri del server mail SMTP per inviare i messaggi dei lead di tipo e-mail direttamente alla casella postale di Studio BP.
                  </p>
                </div>

                {smtpLoading ? (
                  <div className="py-8 text-center text-slate-500 text-xs font-semibold animate-pulse">
                    Caricamento configurazione SMTP in corso...
                  </div>
                ) : (
                  <form onSubmit={handleSmtpSave} className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-bold">Host Server SMTP *</label>
                        <input
                          type="text"
                          required
                          placeholder="es. mail.studiobpitalia.it o smtp.gmail.com"
                          value={smtpConfig.host}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, host: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-bold">Porta *</label>
                          <input
                            type="number"
                            required
                            placeholder="es. 587 o 465"
                            value={smtpConfig.port}
                            onChange={(e) => setSmtpConfig({ ...smtpConfig, port: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>
                        <div className="space-y-1.5 flex flex-col justify-end pb-3">
                          <label className="flex items-center gap-2 text-xs text-slate-350 font-bold cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={smtpConfig.secure}
                              onChange={(e) => setSmtpConfig({ ...smtpConfig, secure: e.target.checked })}
                              className="rounded border-slate-800 text-amber-500 focus:ring-amber-500 bg-slate-900 cursor-pointer"
                            />
                            <span>Usa SSL/TLS</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-bold">Nome Utente SMTP *</label>
                        <input
                          type="text"
                          required
                          placeholder="es. info@studiobpitalia.it"
                          value={smtpConfig.user}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, user: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-bold">Password SMTP *</label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••••••"
                          value={smtpConfig.pass}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, pass: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-bold">Indirizzo Mittente (Da Email) *</label>
                        <input
                          type="email"
                          required
                          placeholder="es. info@studiobpitalia.it"
                          value={smtpConfig.fromEmail}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, fromEmail: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block font-bold">Email Ricevente (A Email) *</label>
                        <input
                          type="email"
                          required
                          placeholder="es. lead@studiobpitalia.it"
                          value={smtpConfig.toEmail}
                          onChange={(e) => setSmtpConfig({ ...smtpConfig, toEmail: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={smtpSaving}
                        className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {smtpSaving ? 'Salvataggio...' : 'Salva Parametri SMTP'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        )}

      </main>

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-red-950 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <div className="p-2 bg-red-950/40 rounded-xl border border-red-900/40">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-wider text-slate-100">Rimuovere definitivamente?</h3>
                <p className="text-[10px] text-red-400 font-mono tracking-wide uppercase">Operazione Irreversibile</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Stai per eliminare definitivamente l&apos;annuncio <span className="text-white font-bold">#{deleteConfirmId}</span> dal database MySQL. Tutti i dettagli associati verranno rimossi permanentemente. Sei sicuro di procedere?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/10 transition-all cursor-pointer"
              >
                Sì, elimina annuncio
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-center text-slate-500 text-[10.5px] font-mono mt-auto uppercase tracking-widest">
        <span>Amministrazione Integrata Studio BP Italia S.r.l. — Console Editore v2.6 -- All Rights Reserved © 2026</span>
      </footer>

    </div>
  );
}
