import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const listings = await db.listing.findMany({
      include: {
        propertyDetails: true,
        businessDetails: true,
      },
      orderBy: {
        data_creazione: 'desc',
      },
    });

    // Trasformiamo i Decimal in Number per la compatibilità con il frontend
    const formattedListings = listings.map((l: any) => ({
      ...l,
      prezzo: Number(l.prezzo),
      stima_riservata: l.stima_riservata ? Number(l.stima_riservata) : undefined,
      businessDetails: l.businessDetails ? {
        ...l.businessDetails,
        fatturato_annuo: l.businessDetails.fatturato_annuo ? Number(l.businessDetails.fatturato_annuo) : undefined,
        canone_mura: l.businessDetails.canone_mura ? Number(l.businessDetails.canone_mura) : undefined,
        utile_netto: l.businessDetails.utile_netto ? Number(l.businessDetails.utile_netto) : undefined,
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

    return NextResponse.json(created);
  } catch (error: any) {
    console.error('Errore nella creazione del listing:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
