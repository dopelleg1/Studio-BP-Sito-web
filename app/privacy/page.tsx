'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { LogoRound, LogoRectangular } from '@/components/Logo';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* Header */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-45 shadow-xs px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <LogoRound className="w-12 h-12 shadow-md shrink-0 animate-pulse" />
            <div className="flex flex-col">
              <LogoRectangular className="h-8 w-auto block text-slate-950" />
            </div>
          </Link>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Torna alla Home</span>
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-12 space-y-8 text-left shadow-sm">
          
          <div className="border-b border-slate-100 pb-6 space-y-3">
            <div className="w-12 h-12 bg-amber-550/10 text-amber-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy &amp; Cookie Law</h1>
            <p className="text-slate-500 text-xs font-semibold">Ultimo aggiornamento: 6 Luglio 2026</p>
          </div>

          <div className="prose prose-slate text-xs md:text-sm text-slate-650 leading-relaxed space-y-6 font-semibold">
            
            <section className="space-y-2.5">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">1. Titolare del Trattamento</h2>
              <p>
                Il titolare del trattamento dei dati raccolti tramite questo sito web è:
              </p>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 font-mono text-xs text-slate-800">
                <p className="flex items-center gap-2"><MapPin size={12} className="text-slate-500" /> <strong>Studio BP Italia S.r.l.</strong> - Via Finalmarina, 23, 10126 Torino TO</p>
                <p className="flex items-center gap-2"><Phone size={12} className="text-slate-500" /> Telefono: +39 0116673087 | +39 379 231 9582</p>
                <p className="flex items-center gap-2"><Mail size={12} className="text-slate-500" /> Email: info@studiobpitalia.it</p>
              </div>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">2. Tipologia di Dati Raccolti</h2>
              <p>
                Raccogliamo dati personali forniti volontariamente dall&apos;utente tramite i moduli di contatto (Lead Form) e dati tecnici raccolti automaticamente durante la navigazione:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dati identificativi: Nome, Cognome, indirizzo Email, numero di Telefono.</li>
                <li>Dati di navigazione: indirizzo IP, tipo di browser, data e ora della richiesta, pagine visitate.</li>
                <li>Dati relativi agli annunci: preferenze dell&apos;annuncio immobiliare o dell&apos;attività B2B selezionata.</li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">3. Finalità del Trattamento</h2>
              <p>
                I dati raccolti vengono utilizzati esclusivamente per le seguenti finalità:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gestire e rispondere alle manifestazioni di interesse inviate dagli utenti relative ad annunci immobiliari o commerciali.</li>
                <li>Fornire informazioni sui servizi fiduciari di compravendita e cessione aziendale offerti dai broker di Studio BP.</li>
                <li>Garantire la sicurezza informatica del sito web e prevenire attività fraudolente.</li>
                <li>Adempiere ad obblighi legali e fiscali previsti dalle normative nazionali ed europee.</li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">4. Base Giuridica del Trattamento</h2>
              <p>
                Trattiamo i dati personali basandoci sulle seguenti condizioni di liceità:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Consenso dell&apos;interessato:</strong> Espresso per l&apos;invio di richieste di informazioni tramite i form e per l&apos;attivazione di cookie non tecnici.</li>
                <li><strong>Esecuzione di misure precontrattuali:</strong> Richieste dall&apos;utente per ricevere informazioni specifiche su annunci immobiliari o aziendali.</li>
                <li><strong>Legittimo interesse:</strong> Per monitorare la stabilità e la sicurezza del server database MySQL.</li>
              </ul>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">5. Periodo di Conservazione dei Dati</h2>
              <p>
                I dati dei lead di richiesta vengono conservati per un periodo non superiore a 24 mesi dalla loro raccolta, salvo sussistano ragioni contrattuali o obblighi legali che ne richiedano una conservazione prolungata (es. cessioni aziendali fiduciarie). I dati tecnici di navigazione vengono cancellati entro 7 giorni dall&apos;elaborazione.
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">6. Diritti dell&apos;Interessato (Regolamento GDPR)</h2>
              <p>
                Ai sensi del Regolamento UE 2016/679 (GDPR), l&apos;utente ha il diritto in qualsiasi momento di:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Richiedere l&apos;accesso ai propri dati personali conservati nel nostro database MySQL.</li>
                <li>Richiedere la rettifica di dati errati o l&apos;integrazione di quelli incompleti.</li>
                <li>Richiedere la cancellazione dei dati personali (diritto all&apos;oblio).</li>
                <li>Opporti al trattamento o richiedere la limitazione del trattamento dei dati.</li>
                <li>Inviare un reclamo al Garante per la Protezione dei Dati Personali (www.garanteprivacy.it).</li>
              </ul>
            </section>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 px-4 text-center text-[10px] uppercase font-bold tracking-widest">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>© 2026 Studio BP Italia S.r.l. Tutti i diritti riservati.</p>
          <div className="flex justify-center gap-4 text-slate-500">
            <Link href="/" className="hover:text-slate-350 transition-colors">Torna alla Home</Link>
            <span>•</span>
            <span>GDPR Compliance Secured</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
