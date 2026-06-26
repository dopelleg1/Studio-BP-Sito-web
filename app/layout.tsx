import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Studio BP Italia - Portale Immobiliare (B2C) & Commerciale (B2B)',
  description: 'Gestione e monitoraggio di annunci immobiliari residenziali B2C e attività commerciali B2B tramite Prisma e MySQL.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="it">
      <body className="bg-slate-50 min-h-screen text-slate-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
