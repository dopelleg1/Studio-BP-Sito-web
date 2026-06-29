import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INITIAL_LISTINGS = [
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
    descrizione: "Cessione ramo d'azienda di uno storico locale nel centro nevralgico di Roma. Elevato passaggio pedonale, arredi storici d'epoca ed eccellente avviamento commerciale.",
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
    descrizione: "Splendida villa circondata dall'ampio verde privato con piscina, porticato esterno e ampie vetrate ad elevato risparmio energetico. Ideale per famiglie esigenti.",
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
    descrizione: "Hub di logistica industriale situato a ridosso dell'imbocco autostradale. Altezza utile interna 10 metri, 4 baie di carico e scarico e ampi uffici di rappresentanza integrati.",
    prezzo: 12000,
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
      canone_mura: 0,
      utile_netto: 195000,
      numero_dipendenti: 8
    }
  }
];

const INITIAL_LEADS = [
  {
    id: 1,
    nome: 'Alessandro Moretti',
    email: 'a.moretti@valoremail.it',
    telefono: '+39 333 456789',
    messaggio: "Sarei interessato ad effettuare un sopralluogo per l'Attico Vista Duomo di Milano. Gradito contatto telefonico nel pomeriggio.",
    id_listing_associato: 101,
    status: 'NEW',
    data_creazione: '2026-06-16T16:45:00Z'
  },
  {
    id: 2,
    nome: 'Investimenti Capital S.r.l.',
    email: 'acquisizioni@capital.it',
    telefono: '+39 06 9876543',
    messaggio: "Richiediamo bilancio degli ultimi 3 anni e book descrittivo completo dell'avviamento commerciale del Caffè Centrale di Roma.",
    id_listing_associato: 102,
    status: 'CONTACTED',
    data_creazione: '2026-06-17T11:15:00Z'
  }
];

async function main() {
  console.log("Avvio popolamento dati su MySQL...");

  // Importazione annunci
  for (const listing of INITIAL_LISTINGS) {
    const existing = await prisma.listing.findUnique({
      where: { id: listing.id }
    });

    if (existing) {
      console.log(`Annuncio #${listing.id} "${listing.titolo}" già esistente. Salto...`);
      continue;
    }

    const { propertyDetails, businessDetails, ...baseListing } = listing;

    // Creiamo la base dell'annuncio
    const createdListing = await prisma.listing.create({
      data: {
        id: baseListing.id,
        titolo: baseListing.titolo,
        descrizione: baseListing.descrizione,
        prezzo: baseListing.prezzo,
        indirizzo: baseListing.indirizzo,
        tipo_contratto: baseListing.tipo_contratto as any,
        categoria: baseListing.categoria as any,
        immagini: baseListing.immagini,
        data_creazione: new Date(baseListing.data_creazione),
      }
    });

    console.log(`Creato annuncio base #${createdListing.id}: "${createdListing.titolo}"`);

    // Dettagli se categoria = IMMOBILE
    if (baseListing.categoria === 'IMMOBILE' && propertyDetails) {
      await prisma.propertyDetails.create({
        data: {
          listingId: createdListing.id,
          mq: propertyDetails.mq,
          stanze: propertyDetails.stanze,
          bagni: propertyDetails.bagni,
          classe_energetica: propertyDetails.classe_energetica,
          piano: propertyDetails.piano,
          posto_auto: propertyDetails.posto_auto,
          giardino: propertyDetails.giardino,
        }
      });
      console.log(`Aggiunti dettagli immobile per #${createdListing.id}`);
    }

    // Dettagli se categoria = BUSINESS
    if (baseListing.categoria === 'BUSINESS' && businessDetails) {
      await prisma.businessDetails.create({
        data: {
          listingId: createdListing.id,
          settore_merceologico: businessDetails.settore_merceologico,
          fatturato_annuo: businessDetails.fatturato_annuo,
          canone_mura: businessDetails.canone_mura,
          utile_netto: businessDetails.utile_netto,
          numero_dipendenti: businessDetails.numero_dipendenti,
        }
      });
      console.log(`Aggiunti dettagli business per #${createdListing.id}`);
    }
  }

  // Importazione Lead
  for (const lead of INITIAL_LEADS) {
    const existingLead = await prisma.lead.findUnique({
      where: { id: lead.id }
    });

    if (existingLead) {
      console.log(`Lead #${lead.id} già esistente. Salto...`);
      continue;
    }

    const createdLead = await prisma.lead.create({
      data: {
        id: lead.id,
        nome: lead.nome,
        email: lead.email,
        telefono: lead.telefono,
        messaggio: lead.messaggio,
        id_listing_associato: lead.id_listing_associato,
        status: lead.status as any,
        data_creazione: new Date(lead.data_creazione),
      }
    });

    console.log(`Creato lead #${createdLead.id} per l'annuncio #${createdLead.id_listing_associato}`);
  }

  console.log("Seeding completato con successo su MySQL!");
}

main()
  .catch(e => {
    console.error("Errore durante il seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
