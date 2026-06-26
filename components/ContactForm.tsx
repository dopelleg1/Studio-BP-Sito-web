'use client';

import React, { useState } from 'react';
import { Mail, Phone, User, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactFormProps {
  listingId: number;
  listingTitle: string;
  categoria: 'IMMOBILE' | 'BUSINESS';
}

export default function ContactForm({ listingId, listingTitle, categoria }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    messaggio: '',
    accettoPrivacy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isB2C = categoria === 'IMMOBILE';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validazioni
    if (!formData.nome.trim()) {
      setErrorMsg('Il campo Nome è obbligatorio.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Inserisci un indirizzo e-mail valido.');
      return;
    }
    if (!formData.accettoPrivacy) {
      setErrorMsg('È necessario acconsentire al trattamento dei dati personali.');
      return;
    }

    setIsSubmitting(true);

    // Simulazione salvataggio in DB e tracciamento nel localStorage
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Sincronizza lo stato locale inserendo il lead nel localStorage per la demo continuativa
      if (typeof window !== 'undefined') {
        const storedLeads = localStorage.getItem('sbp_leads_home');
        let currentLeads = [];
        if (storedLeads) {
          try {
            currentLeads = JSON.parse(storedLeads);
          } catch {
            currentLeads = [];
          }
        }

        const nextId = currentLeads.length > 0 ? Math.max(...currentLeads.map((l: any) => l.id)) + 1 : 1;
        const newLead = {
          id: nextId,
          nome: formData.nome,
          email: formData.email,
          telefono: formData.telefono || undefined,
          messaggio: formData.messaggio || `Richiesta dettagliata per l'investimento #${listingId}`,
          id_listing_associato: listingId,
          status: 'NEW',
          data_creazione: new Date().toISOString()
        };

        localStorage.setItem('sbp_leads_home', JSON.stringify([newLead, ...currentLeads]));
      }
    }, 1500);
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-center space-y-4 shadow-sm"
      >
        <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={32} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Richiesta Ricevuta!</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Il sistema relazionale di Studio BP Italia ha registrato correttamente i tuoi dati e ha inoltrato la notifica al broker responsabile.
          </p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600 font-mono text-left">
          <p className="font-bold border-b border-slate-200/60 pb-1 mb-1 text-slate-900">DATI REGISTRATI (MySQL mock):</p>
          <p>• Lead ID: <span className="text-slate-900 font-bold">Generato dinamico</span></p>
          <p>• Referente: <span className="text-slate-900 font-bold">Studio BP Sedi Nazionali</span></p>
          <p>• Annuncio: <span className="text-slate-900 font-bold truncate max-w-[200px] inline-block align-bottom">{listingTitle}</span></p>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">Sarai ricontattato entro 2 ore lavorative.</p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-5 md:p-6 space-y-5">
      
      {/* Intestazione della CTA Sticky */}
      <div className="space-y-1 p-1">
        <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${
          isB2C 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' 
            : 'bg-amber-100 text-slate-900 border border-amber-200'
        }`}>
          {isB2C ? 'Visita Immobile' : 'Dossier Confidenziale'}
        </span>
        <h3 className="text-lg font-black text-slate-950 tracking-tight mt-2 leading-tight">
          {isB2C ? 'Prenota una visita senza impegno' : 'Richiedi il dossier confidenziale'}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          {isB2C 
            ? 'Organizza un sopralluogo gratuito ed esclusivo guidato dal nostro property finder incaricato.' 
            : 'Ottieni bilancio d\'esercizio e perizia tecnica redatta dal nostro team legale e creditizio.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Campo Nome */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="nome" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
            Nome Completo *
          </label>
          <div className="relative">
            <input
              id="nome"
              name="nome"
              type="text"
              required
              aria-label="Digita il tuo nome e cognome completo"
              placeholder="es. Mario Rossi"
              value={formData.nome}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
            />
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Campo Email */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="email" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
            Indirizzo Email *
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              aria-label="Indirizzo email di contatto"
              placeholder="es. m.rossi@email.it"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
            />
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Campo Telefono */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="telefono" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
            Recapito Telefonico
          </label>
          <div className="relative">
            <input
              id="telefono"
              name="telefono"
              type="tel"
              aria-label="Recapito telefonico per contatto diretto"
              placeholder="es. +39 347 1234567"
              value={formData.telefono}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all placeholder:text-slate-400"
            />
            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Campo Messaggio */}
        <div className="flex flex-col gap-1.5 text-left">
          <label htmlFor="messaggio" className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
            Messaggio aggiuntivo
          </label>
          <textarea
            id="messaggio"
            name="messaggio"
            rows={4}
            aria-label="Eventuale nota o messaggio"
            placeholder={
              isB2C
                ? "Richiedo informazioni sulla disponibilità oraria per visite serali o sabato mattina..."
                : "Se possibile desidero includere nei documenti le verifiche di redditività e le pendenze commerciali correlate..."
            }
            value={formData.messaggio}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-800 transition-all resize-none placeholder:text-slate-400 leading-relaxed"
          />
        </div>

        {/* Informativa per la Privacy */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="accettoPrivacy"
            name="accettoPrivacy"
            type="checkbox"
            required
            aria-label="Accetto i termini della Privacy Policy"
            checked={formData.accettoPrivacy}
            onChange={handleChange}
            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-slate-900 focus:ring-slate-800 cursor-pointer"
          />
          <label htmlFor="accettoPrivacy" className="text-[10px] text-slate-500 leading-relaxed select-none cursor-pointer">
            Acconsento al trattamento dei dati personali ai sensi del GDPR 2016/679 e dichiaro di aver compreso la Privacy Policy dello Studio BP Italia.
          </label>
        </div>

        {/* Blocco Messaggio Errore */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] rounded-xl flex items-center gap-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bottone d'Invio */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.015] md:shadow-md ${
            isB2C 
              ? 'bg-emerald-800 hover:bg-emerald-950 shadow-emerald-800/10' 
              : 'bg-slate-900 hover:bg-black shadow-slate-900/10'
          } disabled:opacity-50 disabled:pointer-events-none`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Registrazione nel DB...</span>
            </>
          ) : (
            <>
              <Send size={13} />
              <span>{isB2C ? 'Fissa Appuntamento' : 'Richiedi Bilancio & NDA'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
