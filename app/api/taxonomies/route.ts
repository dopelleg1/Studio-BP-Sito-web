import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'lib', 'taxonomies.json');

async function readTaxonomies() {
  try {
    const filePath = getFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Errore nella lettura del file taxonomies.json:", error);
    return {};
  }
}

async function writeTaxonomies(taxonomies: any) {
  try {
    const filePath = getFilePath();
    await fs.writeFile(filePath, JSON.stringify(taxonomies, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Errore nella scrittura del file taxonomies.json:", error);
    return false;
  }
}

export async function GET() {
  const taxonomies = await readTaxonomies();
  return NextResponse.json(taxonomies);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, taxonomy, value, oldValue, newValue } = body;

    if (!action || !taxonomy) {
      return NextResponse.json({ error: "Azione e tassonomia sono obbligatori." }, { status: 400 });
    }

    const taxonomies = await readTaxonomies();

    if (!taxonomies[taxonomy]) {
      taxonomies[taxonomy] = [];
    }

    const list = taxonomies[taxonomy] as string[];

    if (action === 'add') {
      if (!value || value.trim() === '') {
        return NextResponse.json({ error: "Il valore da inserire non può essere vuoto." }, { status: 400 });
      }
      const trimmedVal = value.trim();
      // Case-insensitive double check to avoid duplication but keep capitalization
      const lowerList = list.map(item => item.toLowerCase());
      if (!lowerList.includes(trimmedVal.toLowerCase())) {
        list.push(trimmedVal);
      }
    } else if (action === 'update') {
      if (!oldValue || !newValue || newValue.trim() === '') {
        return NextResponse.json({ error: "Valore precedente e nuovo valore sono obbligatori." }, { status: 400 });
      }
      const idx = list.indexOf(oldValue);
      if (idx !== -1) {
        list[idx] = newValue.trim();
      } else {
        return NextResponse.json({ error: "Valore precedente non trovato." }, { status: 404 });
      }
    } else if (action === 'delete') {
      if (!value) {
        return NextResponse.json({ error: "Il valore da eliminare è obbligatorio." }, { status: 400 });
      }
      taxonomies[taxonomy] = list.filter(item => item !== value);
    } else {
      return NextResponse.json({ error: "Azione non riconosciuta." }, { status: 400 });
    }

    const success = await writeTaxonomies(taxonomies);
    if (!success) {
      return NextResponse.json({ error: "Impossibile salvare le tassonomie." }, { status: 500 });
    }

    return NextResponse.json(taxonomies);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Errore interno." }, { status: 500 });
  }
}
