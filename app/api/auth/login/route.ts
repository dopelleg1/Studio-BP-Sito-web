import { NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/session';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const expectedUsername = process.env.ADMIN_USERNAME || 'editore';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'sbp';

    if (
      username &&
      password &&
      username.trim().toLowerCase() === expectedUsername.toLowerCase() &&
      password === expectedPassword
    ) {
      // Imposta il cookie di sessione sicuro
      await setSessionCookie({ username: expectedUsername, role: 'admin' });
      return NextResponse.json({ success: true, message: 'Autenticazione avvenuta con successo.' });
    }

    return NextResponse.json({ error: 'Credenziali non valide.' }, { status: 401 });
  } catch (error: any) {
    console.error('Errore nel login:', error);
    return NextResponse.json({ error: 'Errore interno del server.' }, { status: 500 });
  }
}
