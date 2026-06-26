import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Tipo definition for dynamic Prisma filtering
interface ListingFilter {
  categoria?: 'IMMOBILE' | 'BUSINESS';
  tipo_contratto?: 'VENDITA' | 'AFFITTO';
  prezzo?: {
    lte?: number;
    gte?: number;
  };
  propertyDetails?: {
    stanze?: { gte?: number } | number;
    mq?: { gte?: number } | number;
    classe_energetica?: string;
  };
  businessDetails?: {
    settore_merceologico?: {
      contains?: string;
    } | string;
    fatturato_annuo?: {
      gte?: number;
    };
  };
}

// Dataset fall-back locale per la demo istantanea
const FallbackListings = [
  {
    id: 101,
    titolo: 'Attico Vista Duomo',
    descrizione: 'Prestigioso attico situato nel cuore di Milano con vista panoramica sul Duomo, interamente ristrutturato con materiali di pregio e domotica di ultima generazione.',
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
    descrizione: 'Cessione ramo d\'azienda di uno storico locale nel centro nevralgico di Roma. Elevato passaggio pedonale ed eccellente avviamento commerciale.',
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
    descrizione: 'Splendida villa circondata dall\'ampio verde privato con piscina privata interrata, porticato in cotto e ampie vetrate ad elevato risparmio energetico.',
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
    descrizione: 'Hub di logistica industriale d\'avanguardia situato a ridosso immediato dei principali snodi autostradali, con 4 baie di carico e scarico automatizzate.',
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
    descrizione: 'Elegante bilocale interamente ristrutturato e arredato da primario studio milanese di architettura in una delle vie più storiche del quartiere Brera.',
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
    descrizione: 'Splendido hotel boutique di 18 camere fronte mare con ristorante climatizzato, dehor fiorito e ampio solarium attrezzato. Elevato avviamento ricettivo storico.',
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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Estrazione parametri di query
    const categoriaRaw = searchParams.get('categoria');
    const tipoContratto = searchParams.get('tipo_contratto'); 
    const settore = searchParams.get('settore');
    const budgetMaxRaw = searchParams.get('budgetMax');
    const budgetRaw = searchParams.get('budget'); // Supporto per widget generale
    const localiRaw = searchParams.get('locali'); 
    const mqMinRaw = searchParams.get('mqMin');

    // Costruzione query Prisma dinamica
    const whereClause: ListingFilter = {};

    // 1. Filtro Categoria (Normalizzazione enum)
    if (categoriaRaw) {
      const up = categoriaRaw.toUpperCase();
      if (up === 'IMMOBILE' || up === 'BUSINESS') {
        whereClause.categoria = up as 'IMMOBILE' | 'BUSINESS';
      }
    }

    // 2. Filtro Tipo Contratto (Normalizzazione enum)
    if (tipoContratto) {
      const up = tipoContratto.toUpperCase();
      if (up === 'VENDITA' || up === 'AFFITTO') {
        whereClause.tipo_contratto = up as 'VENDITA' | 'AFFITTO';
      }
    }

    // 3. Filtro Budget Massimo
    let budgetMax: number | null = null;
    if (budgetMaxRaw) {
      const parsed = parseFloat(budgetMaxRaw);
      if (!isNaN(parsed)) {
        budgetMax = parsed;
      }
    } else if (budgetRaw && budgetRaw !== 'Qualsiasi') {
      // Parsing intuitivo delle opzioni del widget es. "Fino a €250.000"
      const cleaned = budgetRaw.replace(/[^\d]/g, '');
      const parsed = parseFloat(cleaned);
      if (!isNaN(parsed)) {
        budgetMax = parsed;
      }
    }

    if (budgetMax !== null) {
      whereClause.prezzo = {
        lte: budgetMax
      };
    }

    // 4. Filtro specifico per Immobili rispetto alla Categoria
    if (whereClause.categoria === 'IMMOBILE') {
      const propFilters: any = {};
      
      // Locali / Stanze
      if (localiRaw && localiRaw !== 'Tutti') {
        const parsed = parseInt(localiRaw, 10);
        if (!isNaN(parsed)) {
          propFilters.stanze = { gte: parsed };
        }
      }

      // Metri quadri minimi
      if (mqMinRaw) {
        const parsed = parseInt(mqMinRaw, 10);
        if (!isNaN(parsed)) {
          propFilters.mq = { gte: parsed };
        }
      }

      if (Object.keys(propFilters).length > 0) {
        whereClause.propertyDetails = propFilters;
      }
    }

    // 5. Filtro specifico per Attività d'Azienda B2B rispetto al Settore
    if (whereClause.categoria === 'BUSINESS') {
      const bizFilters: any = {};

      if (settore && settore !== 'Tutti') {
        bizFilters.settore_merceologico = {
          contains: settore
        };
      }

      if (Object.keys(bizFilters).length > 0) {
        whereClause.businessDetails = bizFilters;
      }
    }

    let results = [];
    let source = 'PRISMA_DATABASE';

    try {
      /*
      ========================================================================
      CONCEZIONE DELLA QUERY DIRETTA SU PRISMA (Eseguita se il database risponde)
      ========================================================================
      */
      results = await db.listing.findMany({
        where: whereClause as any,
        include: {
          propertyDetails: true,
          businessDetails: true,
        },
        orderBy: {
          data_creazione: 'desc',
        },
        take: 10, // Logica di paginazione: primi 10 risultati
      });
    } catch (e: any) {
      // In caso di errore di connessione (Database non provvisto nel server sandboxed),
      // applichiamo filtri in-memory equivalenti su FallbackListings per salvaguardare l'interattività.
      source = 'DEMO_SEED_FALLBACK_MEMORY';
      
      results = FallbackListings.filter((listing) => {
        // Categoria
        if (whereClause.categoria && listing.categoria !== whereClause.categoria) {
          return false;
        }

        // Tipo Contratto
        if (whereClause.tipo_contratto && listing.tipo_contratto !== whereClause.tipo_contratto) {
          return false;
        }

        // Budget Massimo
        if (budgetMax !== null && listing.prezzo > budgetMax) {
          return false;
        }

        // Property specifica
        if (whereClause.categoria === 'IMMOBILE' && listing.propertyDetails) {
          const detail = listing.propertyDetails;
          if (whereClause.propertyDetails?.stanze) {
            const minStanze = (whereClause.propertyDetails.stanze as any).gte || 0;
            if (detail.stanze < minStanze) return false;
          }
          if (whereClause.propertyDetails?.mq) {
            const minMq = (whereClause.propertyDetails.mq as any).gte || 0;
            if (detail.mq < minMq) return false;
          }
        }

        // Business specifica
        if (whereClause.categoria === 'BUSINESS' && listing.businessDetails) {
          const detail = listing.businessDetails;
          if (settore && settore !== 'Tutti') {
            const match = detail.settore_merceologico.toLowerCase().includes(settore.toLowerCase());
            if (!match) return false;
          }
        }

        return true;
      });

      // Paginazione e ordinamento in memoria
      results = results
        .sort((a, b) => new Date(b.data_creazione).getTime() - new Date(a.data_creazione).getTime())
        .slice(0, 10);
    }

    return NextResponse.json({
      success: true,
      source,
      resultsCount: results.length,
      filtersApplied: whereClause,
      data: results
    }, { status: 200 });

  } catch (error: any) {
    console.error('Search API Internal Error: ', error);
    return NextResponse.json({
      success: false,
      error: 'Errore durante la ricerca relazionale degli annunci.',
      details: error.message || error
    }, { status: 500 });
  }
}
