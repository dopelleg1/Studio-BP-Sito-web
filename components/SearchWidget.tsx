'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Building2, Briefcase } from 'lucide-react';

interface SearchWidgetProps {
  activeTab: 'IMMOBILE' | 'BUSINESS';
  onChangeTab: (tab: 'IMMOBILE' | 'BUSINESS') => void;
  onSearch: (filters: {
    category: 'IMMOBILE' | 'BUSINESS';
    tipologiaOrSettore: string;
    localiOrFatturato: string;
    budget: string;
  }) => void;
}

export default function SearchWidget({ activeTab, onChangeTab, onSearch }: SearchWidgetProps) {

  const [taxonomies, setTaxonomies] = useState<any>({});

  useEffect(() => {
    fetch('/api/taxonomies')
      .then(res => res.json())
      .then(data => {
        setTaxonomies(data);
      })
      .catch(err => console.error("Errore caricamento tassonomie in widget:", err));
  }, []);

  // Stati dropdown per Immobili
  const [tipoImmobile, setTipoImmobile] = useState('Tutti');
  const [locali, setLocali] = useState('Tutti');
  const [budgetImmobile, setBudgetImmobile] = useState('Qualsiasi');

  // Stati dropdown per Attività
  const [settore, setSettore] = useState('Tutti');
  const [fatturato, setFatturato] = useState('Qualsiasi');
  const [budgetBusiness, setBudgetBusiness] = useState('Qualsiasi');

  const handleSearchClick = () => {
    onSearch({
      category: activeTab,
      tipologiaOrSettore: activeTab === 'IMMOBILE' ? tipoImmobile : settore,
      localiOrFatturato: activeTab === 'IMMOBILE' ? locali : fatturato,
      budget: activeTab === 'IMMOBILE' ? budgetImmobile : budgetBusiness,
    });
  };

  return (
    <div 
      id="search-widget"
      className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-200/80 p-5 md:p-6 relative z-10 -mt-10 md:-mt-14"
    >
      {/* Tab toggle - Styled with bg-accent and text-white when active */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full max-w-sm mb-6">
        <button
          type="button"
          onClick={() => onChangeTab('IMMOBILE')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'IMMOBILE'
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'text-slate-600 hover:text-primary hover:bg-white/50'
          }`}
        >
          <Building2 size={15} />
          Immobili (B2C)
        </button>
        <button
          type="button"
          onClick={() => onChangeTab('BUSINESS')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'BUSINESS'
              ? 'bg-accent text-white shadow-md shadow-accent/20'
              : 'text-slate-600 hover:text-primary hover:bg-white/50'
          }`}
        >
          <Briefcase size={15} />
          Attività B2B
        </button>
      </div>

      {/* Grid dei Dropdown condizionali */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {activeTab === 'IMMOBILE' ? (
          <>
            {/* Dropdown 1: Tipologia */}
            <div className="flex flex-col gap-1.5 align-left text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tipologia Immobile</label>
              <div className="relative">
                <select
                  value={tipoImmobile}
                  onChange={(e) => setTipoImmobile(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-all cursor-pointer pr-10"
                >
                  <option value="Tutti">Tutti gli Immobili</option>
                  {taxonomies.TIPO_ANNUNCIO?.map((tipo: string) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Dropdown 2: Locali */}
            <div className="flex flex-col gap-1.5 align-left text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Numero Locali</label>
              <div className="relative">
                <select
                  value={locali}
                  onChange={(e) => setLocali(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-all cursor-pointer pr-10"
                >
                  <option value="Tutti">Qualsiasi</option>
                  <option value="3">3 Locali (Trilocale)</option>
                  <option value="5">5 Locali</option>
                  <option value="7">7+ Locali (Villa)</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Dropdown 3: Budget */}
            <div className="flex flex-col gap-1.5 align-left text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Budget Massimo</label>
              <div className="relative">
                <select
                  value={budgetImmobile}
                  onChange={(e) => setBudgetImmobile(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-all cursor-pointer pr-10"
                >
                  <option value="Qualsiasi">Qualsiasi prezzo</option>
                  <option value="Fino a €250.000">Fino a €250.000</option>
                  <option value="Fino a €500.000">Fino a €500.000</option>
                  <option value="Fino a €1.000.000">Fino a €1.000.000</option>
                  <option value="Oltre €1.000.000">Oltre €1.000.000</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Dropdown 1: Settore */}
            <div className="flex flex-col gap-1.5 align-left text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Settore Merceologico</label>
              <div className="relative">
                <select
                  value={settore}
                  onChange={(e) => setSettore(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-all cursor-pointer pr-10"
                >
                  <option value="Tutti">Tutti i settori</option>
                  {taxonomies.SETTORE_MERCEOLOGICO?.map((set: string) => (
                    <option key={set} value={set}>{set}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Dropdown 2: Fatturato */}
            <div className="flex flex-col gap-1.5 align-left text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Fatturato target</label>
              <div className="relative">
                <select
                  value={fatturato}
                  onChange={(e) => setFatturato(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-all cursor-pointer pr-10"
                >
                  <option value="Qualsiasi">Qualsiasi fatturato</option>
                  <option value="Fino a €150k">Fino a €150.000</option>
                  <option value="€150k - €500k">€150.000 - €500.000</option>
                  <option value="Oltre €500k">Oltre €500.000</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Dropdown 3: Budget d'investimento */}
            <div className="flex flex-col gap-1.5 align-left text-left">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Canone/Investimento Max</label>
              <div className="relative">
                <select
                  value={budgetBusiness}
                  onChange={(e) => setBudgetBusiness(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent transition-all cursor-pointer pr-10"
                >
                  <option value="Qualsiasi">Qualsiasi budget</option>
                  <option value="Fino a €5.000/mese">Fino a €5.000/mese (Affitto)</option>
                  <option value="Fino a €25.000/mese">Fino a €25.000/mese (Affitto)</option>
                  <option value="A Cessione">Cessione d&apos;Azienda diretta</option>
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </>
        )}

        {/* Bottone di Ricerca Attivo */}
        <div>
          <button
            type="button"
            onClick={handleSearchClick}
            className="w-full py-4 px-6 rounded-xl text-primary bg-accent hover:bg-accent-hover font-black text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02] shadow-md shadow-accent/10"
          >
            <Search size={16} />
            Cerca Annunci
          </button>
        </div>
      </div>
    </div>
  );
}
