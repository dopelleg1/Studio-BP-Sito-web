import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Operazione non autorizzata.' }, { status: 401 });
    }

    const leads = await db.lead.findMany({
      orderBy: {
        data_creazione: 'desc',
      },
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Errore nel caricamento dei lead:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const createdLead = await db.lead.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefono: data.telefono,
        messaggio: data.messaggio,
        id_listing_associato: data.id_listing_associato ? Number(data.id_listing_associato) : null,
        status: data.status || 'NEW',
      }
    });

    return NextResponse.json(createdLead);
  } catch (error: any) {
    console.error('Errore nella creazione del lead:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
