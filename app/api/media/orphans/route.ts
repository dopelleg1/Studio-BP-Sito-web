import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

// Funzione ricorsiva per elencare tutti i file in una cartella
function getAllFilesInDir(dirPath: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return fileList;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      getAllFilesInDir(fullPath, fileList);
    } else if (entry.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// GET: Scansiona i file su disco e confronta con il database per trovare gli orfani
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Operazione non autorizzata.' }, { status: 401 });
    }

    const mediaDir = path.join(process.cwd(), 'public', 'media');
    if (!fs.existsSync(mediaDir)) {
      return NextResponse.json({
        totalFiles: 0,
        totalSizeBytes: 0,
        orphanFiles: [],
        orphanSizeBytes: 0,
      });
    }

    // 1. Legge tutti i file presenti in public/media
    const diskFiles = getAllFilesInDir(mediaDir);

    // 2. Legge tutte le immagini registrate nel database
    const listings = await db.listing.findMany({
      select: { immagini: true },
    });

    const activeImagePaths = new Set<string>();
    for (const l of listings) {
      const imgs = Array.isArray(l.immagini) ? l.immagini : [];
      for (const img of imgs) {
        if (typeof img === 'string' && img.startsWith('/media/')) {
          const normalized = path.normalize(img.replace(/^\//, '')).toLowerCase();
          activeImagePaths.add(normalized);
        }
      }
    }

    const publicDir = path.join(process.cwd(), 'public');
    let totalSizeBytes = 0;
    let orphanSizeBytes = 0;
    const orphanList: { relativePath: string; fileName: string; sizeBytes: number }[] = [];

    for (const filePath of diskFiles) {
      const stats = fs.statSync(filePath);
      totalSizeBytes += stats.size;

      const relPath = path.relative(publicDir, filePath);
      const relNormalized = path.normalize(relPath).toLowerCase();

      if (!activeImagePaths.has(relNormalized)) {
        orphanSizeBytes += stats.size;
        orphanList.push({
          relativePath: `/${relPath.replace(/\\/g, '/')}`,
          fileName: path.basename(filePath),
          sizeBytes: stats.size,
        });
      }
    }

    return NextResponse.json({
      success: true,
      totalFiles: diskFiles.length,
      totalSizeBytes,
      orphanCount: orphanList.length,
      orphanSizeBytes,
      orphans: orphanList.slice(0, 100), // primi 100 per visualizzazione anteprima
    });
  } catch (error: any) {
    console.error('Errore durante la scansione dei file orfani:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}

// POST: Elimina fisicamente i file orfani
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Operazione non autorizzata.' }, { status: 401 });
    }

    const mediaDir = path.join(process.cwd(), 'public', 'media');
    if (!fs.existsSync(mediaDir)) {
      return NextResponse.json({ success: true, deletedCount: 0, freedBytes: 0 });
    }

    const diskFiles = getAllFilesInDir(mediaDir);
    const listings = await db.listing.findMany({
      select: { immagini: true },
    });

    const activeImagePaths = new Set<string>();
    for (const l of listings) {
      const imgs = Array.isArray(l.immagini) ? l.immagini : [];
      for (const img of imgs) {
        if (typeof img === 'string' && img.startsWith('/media/')) {
          activeImagePaths.add(path.normalize(img.replace(/^\//, '')).toLowerCase());
        }
      }
    }

    const publicDir = path.join(process.cwd(), 'public');
    let deletedCount = 0;
    let freedBytes = 0;

    for (const filePath of diskFiles) {
      const relPath = path.relative(publicDir, filePath);
      const relNormalized = path.normalize(relPath).toLowerCase();

      if (!activeImagePaths.has(relNormalized)) {
        try {
          const stats = fs.statSync(filePath);
          freedBytes += stats.size;
          fs.unlinkSync(filePath);
          deletedCount++;
        } catch (delErr) {
          console.warn(`Impossibile eliminare il file orfano ${filePath}:`, delErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      deletedCount,
      freedBytes,
      message: `Pulizia completata: rimossi ${deletedCount} file orfani, liberati ${(freedBytes / (1024 * 1024)).toFixed(2)} MB.`,
    });
  } catch (error: any) {
    console.error('Errore durante la pulizia dei file orfani:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
