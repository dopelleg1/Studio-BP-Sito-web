import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (session && session.username) {
      return NextResponse.json({ authenticated: true, username: session.username });
    }
    return NextResponse.json({ authenticated: false });
  } catch (error: any) {
    console.error('Errore nel controllo stato sessione:', error);
    return NextResponse.json({ authenticated: false, error: 'Errore interno' });
  }
}
