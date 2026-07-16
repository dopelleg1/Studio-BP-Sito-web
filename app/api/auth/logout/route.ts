import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/session';

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: 'Disconnessione completata.' });
  } catch (error: any) {
    console.error('Errore nel logout:', error);
    return NextResponse.json({ error: 'Errore interno del server.' }, { status: 500 });
  }
}
