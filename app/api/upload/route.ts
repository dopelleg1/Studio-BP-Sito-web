import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Operazione non autorizzata.' }, { status: 401 });
    }

    const formData = await req.json();
    const { name, type, base64 } = formData;

    if (!name || !base64) {
      return NextResponse.json({ success: false, error: 'Parametri mancanti' }, { status: 400 });
    }

    // Rimuovi eventuale intestazione data:image/png;base64,
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Assicurati che esista la cartella public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Genera nome file univoco
    const fileExt = path.extname(name) || '.jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    const relativeUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: relativeUrl
    });
  } catch (error: any) {
    console.error('Errore durante l\'upload del file:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
