import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { saveTaxonomiesIfNew } from '@/lib/taxonomies';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID non valido' }, { status: 400 });
    }

    const data = await req.json();
    const { propertyDetails, businessDetails, id: _, data_creazione, ...baseData } = data;

    // Aggiorna l'annuncio principale
    const updated = await db.listing.update({
      where: { id: numericId },
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
      },
    });

    // Gestione transazionale dei dettagli fisici o business
    if (baseData.categoria === 'IMMOBILE' && propertyDetails) {
      await db.propertyDetails.upsert({
        where: { listingId: numericId },
        create: {
          listingId: numericId,
          mq: Number(propertyDetails.mq),
          stanze: Number(propertyDetails.stanze),
          bagni: Number(propertyDetails.bagni),
          classe_energetica: propertyDetails.classe_energetica,
          piano: propertyDetails.piano,
          posto_auto: Boolean(propertyDetails.posto_auto),
          giardino: Boolean(propertyDetails.giardino),
        },
        update: {
          mq: Number(propertyDetails.mq),
          stanze: Number(propertyDetails.stanze),
          bagni: Number(propertyDetails.bagni),
          classe_energetica: propertyDetails.classe_energetica,
          piano: propertyDetails.piano,
          posto_auto: Boolean(propertyDetails.posto_auto),
          giardino: Boolean(propertyDetails.giardino),
        }
      });
      // Rimuove i dettagli dell'attività se l'annuncio è stato convertito in immobile
      await db.businessDetails.deleteMany({ where: { listingId: numericId } });
    } else if (baseData.categoria === 'BUSINESS' && businessDetails) {
      await db.businessDetails.upsert({
        where: { listingId: numericId },
        create: {
          listingId: numericId,
          settore_merceologico: businessDetails.settore_merceologico,
          fatturato_annuo: businessDetails.fatturato_annuo ? Number(businessDetails.fatturato_annuo) : null,
          canone_mura: businessDetails.canone_mura ? Number(businessDetails.canone_mura) : null,
          utile_netto: businessDetails.utile_netto ? Number(businessDetails.utile_netto) : null,
          numero_dipendenti: businessDetails.numero_dipendenti ? Number(businessDetails.numero_dipendenti) : 0,
        },
        update: {
          settore_merceologico: businessDetails.settore_merceologico,
          fatturato_annuo: businessDetails.fatturato_annuo ? Number(businessDetails.fatturato_annuo) : null,
          canone_mura: businessDetails.canone_mura ? Number(businessDetails.canone_mura) : null,
          utile_netto: businessDetails.utile_netto ? Number(businessDetails.utile_netto) : null,
          numero_dipendenti: businessDetails.numero_dipendenti ? Number(businessDetails.numero_dipendenti) : 0,
        }
      });
      // Rimuove i dettagli dell'immobile se l'annuncio è stato convertito in attività
      await db.propertyDetails.deleteMany({ where: { listingId: numericId } });
    }

    // Eseguiamo l'auto-apprendimento delle tassonomie in tempo reale
    try {
      await saveTaxonomiesIfNew({
        ...baseData,
        businessDetails
      });
    } catch (taxErr) {
      console.error("Errore nell'auto-apprendimento delle tassonomie:", taxErr);
    }

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error('Errore durante l\'aggiornamento:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID non valido' }, { status: 400 });
    }

    const { in_evidenza } = await req.json();

    const updated = await db.listing.update({
      where: { id: numericId },
      data: {
        in_evidenza: Boolean(in_evidenza),
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error('Errore durante il patch di in_evidenza:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID non valido' }, { status: 400 });
    }

    // Cascade delete gestito a livello DB rimuoverà in automatico i dettagli collegati
    await db.listing.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Errore durante l\'eliminazione:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
