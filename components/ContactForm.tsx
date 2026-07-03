'use client';

import React, { useState } from 'react';
import { Mail, Phone, User, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface ContactFormProps {
  listing: {
    id: number;
    titolo: string;
    categoria: 'IMMOBILE' | 'BUSINESS';
    indirizzo: string;
    prezzo: number | any;
    riferimento?: string;
    zona?: string;
    comune?: string;
    businessDetails?: {
      settore_merceologico: string;
    };
  };
}

export default function ContactForm({ listing }: ContactFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    messaggio: '',
    accettoPrivacy: false,
  });

  const [contactMethod, setContactMethod] = useState<'EMAIL' | 'WHATSAPP'>('EMAIL');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isB2C = listing.categoria === 'IMMOBILE';

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

    try {
      // 1. Salvataggio reale del Lead nel database MySQL tramite la nostra API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          email: formData.email.trim(),
          telefono: formData.telefono.trim() || null,
          messaggio: formData.messaggio.trim() || `Richiesta dettagliata tramite form per l'annuncio #${listing.id}`,
          id_listing_associato: listing.id,
          // Aggiungiamo un flag o una nota per specificare che la richiesta è stata inoltrata via WhatsApp
          status: 'NEW'
        })
      });

      if (!response.ok) {
        throw new Error('Errore durante la registrazione del contatto sul server.');
      }

      const dbLead = await response.json();

      // Sincronizziamo anche il localStorage locale per coerenza d'uso dell'Area Editore
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
        localStorage.setItem('sbp_leads_home', JSON.stringify([dbLead, ...currentLeads]));
      }

      // 2. Se il metodo scelto è WHATSAPP, apriamo WhatsApp con il messaggio precompilato strutturato
      if (contactMethod === 'WHATSAPP') {
        const isImmobile = listing.categoria === 'IMMOBILE';
        const formattedPrezzo = typeof listing.prezzo === 'number'
          ? listing.prezzo.toLocaleString('it-IT')
          : parseFloat(listing.prezzo.toString()).toLocaleString('it-IT');

        const textMsg = `Salve Studio BP, sono *${formData.nome.trim()}* (Email: ${formData.email.trim()}${formData.telefono ? `, Tel: ${formData.telefono.trim()}` : ''}).
Desidero ricevere informazioni per l'annuncio:
👉 *${listing.titolo}* (Rif: ${listing.riferimento || 'N/D'} - ID: #${listing.id})
${isImmobile 
  ? `Valore: € ${formattedPrezzo} - Zona: ${listing.zona || 'N/D'}, ${listing.comune || 'N/D'}` 
  : `Valore: € ${formattedPrezzo} - Settore: ${listing.businessDetails?.settore_merceologico || 'N/D'}`}

Messaggio: ${formData.messaggio.trim() || 'Desidero essere ricontattato per questo annuncio.'}`;

        const waUrl = `https://wa.me/393792319582?text=${encodeURIComponent(textMsg)}`;
        window.open(waUrl, '_blank');
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Si è verificato un errore durante l\'invio della richiesta.');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 text-center space-y-4 shadow-sm"
      >
        <div className="w-16 h-16 bg-emerald-50 text-emerald-850 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Richiesta Inviata!</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            {contactMethod === 'WHATSAPP' 
              ? 'Abbiamo aperto la chat di WhatsApp ed inserito la richiesta anche nel database Studio BP per tracciabilità.' 
              : 'Il sistema ha registrato correttamente i tuoi dati su MySQL e ha inoltrato la notifica e-mail al broker incaricato.'}
          </p>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600 font-mono text-left">
          <p className="font-bold border-b border-slate-200/60 pb-1 mb-1 text-slate-900">RIEPILOGO RICHIESTA:</p>
          <p>• Modalità: <span className="text-slate-900 font-bold">{contactMethod === 'WHATSAPP' ? 'WhatsApp (+39 379 231 9582)' : 'E-mail Broker'}</span></p>
          <p>• Nome: <span className="text-slate-900 font-bold">{formData.nome}</span></p>
          <p>• Annuncio: <span className="text-slate-900 font-bold truncate max-w-[200px] inline-block align-bottom">{listing.titolo}</span></p>
        </div>
        <p className="text-[10px] text-slate-400 font-medium">Verrai ricontattato nel più breve tempo possibile.</p>
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

      {/* Selettore Metodo di Contatto */}
      <div className="flex flex-col gap-1.5 text-left">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
          Come preferisci contattarci?
        </label>
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setContactMethod('EMAIL')}
            className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              contactMethod === 'EMAIL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail size={13} />
            <span>E-mail</span>
          </button>
          <button
            type="button"
            onClick={() => setContactMethod('WHATSAPP')}
            className={`py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              contactMethod === 'WHATSAPP'
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
          className={`w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.015] md:shadow-md cursor-pointer ${
            contactMethod === 'WHATSAPP'
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
              : isB2C
              ? 'bg-emerald-800 hover:bg-emerald-950 shadow-emerald-800/10'
              : 'bg-slate-900 hover:bg-black shadow-slate-900/10'
          } disabled:opacity-50 disabled:pointer-events-none`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Invio in corso...</span>
            </>
          ) : contactMethod === 'WHATSAPP' ? (
            <>
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.63 2.028 14.16 1.001 11.53 1.002c-5.437 0-9.862 4.371-9.865 9.801a9.74 9.74 0 0.0 1.502 4.845L1.921 20.62l5.064-1.32c1.547.84 3.097 1.272 4.662 1.272l.001-.018zM17.47 14.39c-.326-.162-1.926-.948-2.221-1.055-.297-.108-.513-.162-.73.162-.216.324-.838 1.055-1.027 1.27-.189.217-.378.243-.704.082-.325-.162-1.372-.505-2.613-1.613-.966-.862-1.618-1.927-1.808-2.251-.19-.324-.02-.499.143-.66.147-.145.325-.378.487-.568.162-.189.216-.324.325-.54.109-.217.054-.405-.027-.568-.08-.162-.73-1.758-1.002-2.407-.265-.636-.53-.55-.73-.56-.19-.01-.405-.01-.62-.01-.215 0-.567.08-.864.405-.297.324-1.135 1.108-1.135 2.703 0 1.594 1.162 3.134 1.324 3.35.162.216 2.284 3.488 5.533 4.894.773.334 1.377.534 1.847.683.777.247 1.484.212 2.04.13.62-.092 1.925-.786 2.196-1.517.27-.73.27-1.353.19-1.485-.08-.135-.297-.216-.622-.38z"/>
              </svg>
              <span>Invia via WhatsApp</span>
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
