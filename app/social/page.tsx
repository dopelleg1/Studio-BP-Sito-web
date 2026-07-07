'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Instagram, 
  Video, 
  ChevronRight, 
  MapPin, 
  Globe, 
  Phone, 
  Smartphone,
  ExternalLink,
  MessageCircle,
  Share2
} from 'lucide-react';
import { LogoRound, LogoRectangular } from '@/components/Logo';
import GdprBanner from '@/components/GdprBanner';
import ResetCookieButton from '@/components/ResetCookieButton';

interface SocialPost {
  id: number;
  piattaforma: 'INSTAGRAM' | 'TIKTOK';
  url_post: string;
  codice_embed?: string;
  didascalia?: string;
  data_creazione: string;
}

export default function SocialPage() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Caricamento dei post social dal file JSON tramite API route
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('/api/social-posts');
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Errore nel caricamento dei social posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Effetto per caricare lo script di TikTok in modo dinamico e forzare il rendering dei widget blockquote
  useEffect(() => {
    if (posts.length > 0) {
      // 1. Rimuove eventuali script vecchi di TikTok per forzare la scansione
      const oldScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (oldScript) {
        oldScript.remove();
      }

      // 2. Rimuove l'oggetto globale di cache per forzare il ricaricamento del widget
      if (typeof window !== 'undefined') {
        delete (window as any).__tt_embed__;
      }

      // 3. Crea e inserisce lo script ufficiale di TikTok
      const script = document.createElement('script');
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [posts]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Info Bar */}
      <div className="bg-slate-950 text-slate-400 text-[10px] sm:text-xs font-semibold py-2.5 px-4 md:px-8 border-b border-slate-900 flex flex-col md:flex-row justify-between items-center gap-2 select-none">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            <MapPin size={11} className="text-amber-500 shrink-0" />
            <span>Via Finalmarina, 23, 10126 Torino TO</span>
          </span>
          <span className="hidden md:inline text-slate-800">|</span>
          <span className="flex items-center gap-1.5">
            <Globe size={11} className="text-amber-500 shrink-0" />
            <a href="https://www.studiobpitalia.it" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              www.studiobpitalia.it
            </a>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Phone size={11} className="text-amber-500 shrink-0" />
            <a href="tel:+390116673087" className="hover:text-white transition-colors">+39 011 6673087</a>
          </span>
          <span className="text-slate-800">|</span>
          <span className="flex items-center gap-1.5">
            <Smartphone size={11} className="text-amber-500 shrink-0" />
            <a href="tel:+393792319582" className="hover:text-white transition-colors">+39 379 231 9582</a>
          </span>
        </div>
      </div>

      {/* Navigazione */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs px-4 md:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <LogoRound className="w-12 h-12 shadow-md shrink-0" />
          <div className="flex flex-col">
            <LogoRectangular className="h-8 w-auto block text-slate-950" />
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Link href="/?filter=immobili" className="hover:text-slate-900 transition-colors">Immobili</Link>
          <Link href="/?filter=attivita" className="hover:text-slate-900 transition-colors">Attività in vendita</Link>
          <Link href="/social" className="text-slate-950 font-black border-b-2 border-amber-500 pb-0.5">Studio BP Social</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Torna alla Home</span>
          </Link>
        </div>
      </nav>

      {/* Header Pagina Social */}
      <header className="bg-white border-b border-slate-200 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="px-3 py-1 bg-amber-400/10 text-amber-800 text-[10px] font-black tracking-widest uppercase rounded-full border border-amber-500/20">
            Social Media Hub
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
            Studio BP Social
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-2xl mx-auto leading-relaxed">
            Resta sempre aggiornato sulle nostre acquisizioni immobiliari di pregio, retroscena aziendali, consigli legali ed opportunità commerciali. Seguici e scopri dove siamo presenti.
          </p>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto w-full px-4 py-12 flex-1 space-y-16">
        
        {/* 1. SEZIONE CANALI PRINCIPALI (Instagram, Reels, TikTok) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card Instagram */}
          <a 
            href="https://www.instagram.com/studiobpitalia" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 hover:border-pink-500/30 hover:shadow-xl transition-all duration-300 group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                <Instagram size={24} />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                @studiobpitalia
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 group-hover:text-pink-600 transition-colors">Instagram Feed</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Esplora le foto dei nostri immobili più esclusivi, infografiche del mercato residenziale piemontese e scatti dei nostri uffici e del nostro staff.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-black uppercase text-pink-600 tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Seguici su Instagram</span>
              <ChevronRight size={10} />
            </div>
          </a>

          {/* Card Reels */}
          <a 
            href="https://www.instagram.com/studiobpitalia/reels" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 hover:border-rose-500/30 hover:shadow-xl transition-all duration-300 group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                <Video size={24} />
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full group-hover:bg-rose-50 group-hover:text-rose-600 transition-colors">
                Instagram Reels
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">Reels &amp; Video Brevi</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Tour video completi delle nostre ville storiche ed appartamenti di lusso. Approfondimenti rapidi dei nostri broker con grafiche accattivanti.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-black uppercase text-rose-600 tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Guarda i Reels</span>
              <ChevronRight size={10} />
            </div>
          </a>

          {/* Card TikTok */}
          <a 
            href="https://www.tiktok.com/@studiobpitalia" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-6 bg-white border border-slate-200 rounded-3xl space-y-5 hover:border-slate-950/30 hover:shadow-xl transition-all duration-300 group text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-slate-950 opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center shadow-md border border-slate-800">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.12 1.25 2.7 2.05 4.34 2.25v3.6a10.027 10.027 0 01-5.74-2.18v8.31a7.199 7.199 0 01-14.39.05c-.09-2.91 1.76-5.7 4.54-6.66.86-.3 1.77-.42 2.68-.35v3.66c-.6-.18-1.25-.13-1.8.19-.94.52-1.48 1.56-1.39 2.63.1 1.25 1.17 2.26 2.43 2.25 1.3-.01 2.34-1.07 2.34-2.37V.02h1.47z"/>
                </svg>
              </div>
              <span className="text-[10px] font-extrabold uppercase bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors">
                @studiobpitalia
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 group-hover:text-slate-950 transition-colors">TikTok Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Video dinamici, trend immobiliari commerciali, consigli pratici su come cedere un&apos;azienda o disbrigare le licenze senza perdere tempo.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-black uppercase text-slate-950 tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
              <span>Seguici su TikTok</span>
              <ChevronRight size={10} />
            </div>
          </a>

        </section>

        {/* 2. SEZIONE INTEGRATA DEI POST SOCIAL */}
        <section className="space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Post e Video Integrati</h2>
            <div className="w-10 h-1 bg-amber-500 mx-auto rounded-full mt-2" />
            <p className="text-slate-500 text-xs font-semibold max-w-lg mx-auto">
              Sfoglia gli ultimi post pubblicati sui nostri profili ufficiali. Clicca sui post per guardarli direttamente sulla piattaforma originale.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-3xl h-[280px] animate-pulse flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-full" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                  </div>
                  <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
              <p className="text-sm font-semibold text-slate-500">Nessun post social integrato al momento.</p>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">I post possono essere configurati e integrati dinamicamente tramite il pannello di Backoffice di Studio BP.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => {
                const isInsta = post.piattaforma === 'INSTAGRAM';
                
                return (
                  <div 
                    key={post.id}
                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between group"
                  >
                    
                    {/* Visualizzazione Embed o Card Grafica */}
                    {post.codice_embed ? (
                      <div 
                        className="w-full overflow-hidden flex justify-center items-center bg-slate-50 border-b border-slate-100"
                        dangerouslySetInnerHTML={{ __html: post.codice_embed }}
                      />
                    ) : (
                      <div className="relative">
                        
                        {/* Header con gradiente colorato a seconda del social */}
                        <div className={`h-24 p-5 flex flex-col justify-between relative overflow-hidden ${
                          isInsta 
                            ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white' 
                            : 'bg-slate-950 text-white'
                        }`}>
                          <div className="flex items-center justify-between z-10">
                            {isInsta ? <Instagram size={18} /> : (
                              <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.12 1.25 2.7 2.05 4.34 2.25v3.6a10.027 10.027 0 01-5.74-2.18v8.31a7.199 7.199 0 01-14.39.05c-.09-2.91 1.76-5.7 4.54-6.66.86-.3 1.77-.42 2.68-.35v3.66c-.6-.18-1.25-.13-1.8.19-.94.52-1.48 1.56-1.39 2.63.1 1.25 1.17 2.26 2.43 2.25 1.3-.01 2.34-1.07 2.34-2.37V.02h1.47z"/>
                              </svg>
                            )}
                            <span className="text-[9px] font-black tracking-widest uppercase bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded">
                              {post.piattaforma}
                            </span>
                          </div>
                          <span className="text-[10px] font-black z-10 opacity-90 select-all">
                            {isInsta ? '@studiobpitalia' : '@studiobpitalia'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Didascalia del post */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <p className="text-slate-650 text-xs leading-relaxed font-semibold line-clamp-4">
                          {post.didascalia || "Nessuna didascalia."}
                        </p>
                      </div>
                      
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>Pubblicato il:</span>
                          <span>{new Date(post.data_creazione).toLocaleDateString('it-IT')}</span>
                        </div>

                        <a 
                          href={post.url_post}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
                            isInsta 
                              ? 'bg-white hover:bg-pink-50 border-pink-500/20 hover:border-pink-500/50 text-pink-600'
                              : 'bg-white hover:bg-slate-50 border-slate-900/20 hover:border-slate-900/50 text-slate-900'
                          }`}
                        >
                          <span>Guarda Post</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </section>

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
            <p className="font-semibold text-slate-400">Via Finalmarina, 23, 10126 Torino TO</p>
            <p className="font-semibold text-slate-400">P.IVA 092834571295</p>
            <p className="font-semibold text-slate-400">Iscrizione REA 248102</p>
          </div>

          <div className="space-y-2 text-xs font-semibold">
            <p className="font-bold text-white uppercase tracking-wider text-[11px]">Database Tech Stack</p>
            <p className="text-slate-400">JSON Storage Engine: file-backed JSON</p>
            <p className="text-slate-400">Shared MySQL Secure Connection</p>
            <p className="text-slate-400">Next.js 15 App Router</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase font-bold tracking-widest text-slate-500 gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-2">
            <span>© 2026 Studio BP Italia S.r.l. Tutti i diritti riservati.</span>
            <span>|</span>
            <Link href="/privacy" className="hover:text-amber-500 transition-colors cursor-pointer normal-case">
              Privacy Policy &amp; GDPR
            </Link>
            <span>|</span>
            <ResetCookieButton />
          </div>
          <div className="flex gap-4">
            <span>Social API Integrations</span>
            <span>Secure Web Sandbox</span>
          </div>
        </div>
      </footer>

      {/* GDPR Banner */}
      <GdprBanner />

    </div>
  );
}
