import { cookies } from 'next/headers';
import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET = process.env.SESSION_SECRET || 'sbp-secret-fallback-key-32-chars-x!'; // Chiave di fallback sicura

// Derivazione chiave deterministica a 32 byte
const KEY = crypto.scryptSync(SECRET, 'salt-sbp-session', 32);

/**
 * Cifra i dati della sessione in una stringa esadecimale con IV.
 */
export function encryptSession(data: any): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decifra la stringa esadecimale e ne ricostituisce l'oggetto originario.
 */
export function decryptSession(encryptedText: string): any | null {
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (err) {
    return null;
  }
}

/**
 * Imposta un cookie di sessione HttpOnly crittografato.
 */
export async function setSessionCookie(data: any) {
  const token = encryptSession(data);
  const cookieStore = await cookies();
  cookieStore.set('sbp_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 settimana
    path: '/'
  });
}

/**
 * Legge e decifra la sessione corrente dal cookie.
 */
export async function getSession(): Promise<any | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get('sbp_session');
  if (!cookie) return null;
  return decryptSession(cookie.value);
}

/**
 * Elimina il cookie di sessione.
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set('sbp_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0, // Cancella immediatamente
    path: '/'
  });
}
