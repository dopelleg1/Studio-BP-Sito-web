import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Operazione non autorizzata.' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID non valido' }, { status: 400 });
    }

    const data = await req.json();

    const updated = await db.lead.update({
      where: { id: numericId },
      data: {
        status: data.status,
      }
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error('Errore durante l\'aggiornamento del lead:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Operazione non autorizzata.' }, { status: 401 });
    }

    const { id } = await params;
    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'ID non valido' }, { status: 400 });
    }

    await db.lead.delete({
      where: { id: numericId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Errore durante l\'eliminazione del lead:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
