import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    // Carica il record unico (id: 1)
    let config = await db.smtpConfig.findUnique({
      where: { id: 1 }
    });

    if (!config) {
      // Inizializza record di default se non presente
      config = await db.smtpConfig.create({
        data: {
          id: 1,
          host: 'smtp.example.com',
          port: 587,
          secure: false,
          user: 'user@example.com',
          pass: 'password',
          fromEmail: 'user@example.com',
          toEmail: 'admin@example.com'
        }
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error('Errore nel recupero della config SMTP:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await req.json();
    const { host, port, secure, user, pass, fromEmail, toEmail } = body;

    if (!host || !user || !pass || !fromEmail || !toEmail) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti.' }, { status: 400 });
    }

    const updated = await db.smtpConfig.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        host,
        port: Number(port),
        secure: Boolean(secure),
        user,
        pass,
        fromEmail,
        toEmail
      },
      update: {
        host,
        port: Number(port),
        secure: Boolean(secure),
        user,
        pass,
        fromEmail,
        toEmail
      }
    });

    return NextResponse.json({ success: true, config: updated });
  } catch (error: any) {
    console.error('Errore nel salvataggio della config SMTP:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
