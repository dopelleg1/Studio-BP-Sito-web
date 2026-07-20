import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { saveTaxonomiesIfNew } from '@/lib/taxonomies';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    const isAdmin = !!session;

    const listings = await db.listing.findMany({
      where: isAdmin ? undefined : { archiviato: false },
      include: {
        propertyDetails: true,
        businessDetails: true,
      },
      orderBy: {
        data_creazione: 'desc',
      },
    });

    // Trasformiamo i Decimal in Number per la compatibilità con il frontend ed oscuriamo dati sensibili se non admin
    const formattedListings = listings.map((l: any) => ({
      ...l,
      prezzo: Number(l.prezzo),
      stima_riservata: isAdmin && l.stima_riservata ? Number(l.stima_riservata) : undefined,
      proprietario_nome: isAdmin ? l.proprietario_nome : undefined,
      proprietario_telefono: isAdmin ? l.proprietario_telefono : undefined,
      businessDetails: l.businessDetails ? {
        ...l.businessDetails,
        settore_merceologico: l.businessDetails.settore_merceologico,
        fatturato_annuo: l.businessDetails.fatturato_annuo ? Number(l.businessDetails.fatturato_annuo) : undefined,
        canone_mura: l.businessDetails.canone_mura ? Number(l.businessDetails.canone_mura) : undefined,
        utile_netto: isAdmin && l.businessDetails.utile_netto ? Number(l.businessDetails.utile_netto) : undefined,
        numero_dipendenti: l.businessDetails.numero_dipendenti
      } : undefined
    }));

    return NextResponse.json(formattedListings);
  } catch (error: any) {
    console.error('Errore nel caricamento dei listings:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Operazione non autorizzata.' }, { status: 401 });
    }

    const data = await req.json();
    const { propertyDetails, businessDetails, id, ...baseData } = data;

    // Creiamo il listing su MySQL
    const created = await db.listing.create({
      data: {
        titolo: baseData.titolo,
        descrizione: baseData.descrizione,
        prezzo: Number(baseData.prezzo),
        indirizzo: baseData.indirizzo,
        tipo_contratto: baseData.tipo_contratto,
        categoria: baseData.categoria,
        immagini: baseData.immagini || [],
        riferimento: baseData.riferimento,
        getrix_id: baseData.getrix_id,
        comune: baseData.comune,
        zona: baseData.zona,
        tipologia: baseData.tipologia,
        stato_immobile: baseData.stato_immobile,
        riscaldamento: baseData.riscaldamento,
        anno_costruzione: baseData.anno_costruzione,
        disponibilita: baseData.disponibilita,
        spese_condominiali: baseData.spese_condominiali,
        provvigione: baseData.provvigione,
        tassazione: baseData.tassazione,
        proprietario_nome: baseData.proprietario_nome,
        proprietario_telefono: baseData.proprietario_telefono,
        stima_riservata: baseData.stima_riservata ? Number(baseData.stima_riservata) : null,
        pubblica_indirizzo: baseData.pubblica_indirizzo !== undefined ? Boolean(baseData.pubblica_indirizzo) : true,
        trattativa_riservata: baseData.trattativa_riservata !== undefined ? Boolean(baseData.trattativa_riservata) : false,
        asta: baseData.asta !== undefined ? Boolean(baseData.asta) : false,
        latitudine: baseData.latitudine || null,
        longitudine: baseData.longitudine || null,
        zoom: baseData.zoom !== undefined ? Number(baseData.zoom) : 12,
        propertyDetails: baseData.categoria === 'IMMOBILE' && propertyDetails ? {
          create: {
            mq: Number(propertyDetails.mq),
            stanze: Number(propertyDetails.stanze),
            bagni: Number(propertyDetails.bagni),
            classe_energetica: propertyDetails.classe_energetica,
            piano: propertyDetails.piano,
            posto_auto: Boolean(propertyDetails.posto_auto),
            giardino: Boolean(propertyDetails.giardino),
          }
        } : undefined,
        businessDetails: baseData.categoria === 'BUSINESS' && businessDetails ? {
          create: {
            settore_merceologico: businessDetails.settore_merceologico,
            fatturato_annuo: businessDetails.fatturato_annuo ? Number(businessDetails.fatturato_annuo) : null,
            canone_mura: businessDetails.canone_mura ? Number(businessDetails.canone_mura) : null,
            utile_netto: businessDetails.utile_netto ? Number(businessDetails.utile_netto) : null,
            numero_dipendenti: businessDetails.numero_dipendenti ? Number(businessDetails.numero_dipendenti) : 0,
          }
        } : undefined,
      },
      include: {
        propertyDetails: true,
        businessDetails: true,
      }
    });

    // Eseguiamo l'auto-apprendimento delle tassonomie in background
    try {
      await saveTaxonomiesIfNew({
        ...baseData,
        businessDetails
      });
    } catch (taxErr) {
      console.error("Errore nell'auto-apprendimento delle tassonomie:", taxErr);
    }

    return NextResponse.json(created);
  } catch (error: any) {
    console.error('Errore nella creazione del listing:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
