import fs from 'fs/promises';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'lib', 'taxonomies.json');

export async function readTaxonomies() {
  try {
    const filePath = getFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Errore nella lettura del file taxonomies.json:", error);
    return {};
  }
}

export async function writeTaxonomies(taxonomies: any) {
  try {
    const filePath = getFilePath();
    await fs.writeFile(filePath, JSON.stringify(taxonomies, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Errore nella scrittura del file taxonomies.json:", error);
    return false;
  }
}

interface ListingDataForTaxonomy {
  categoria: string;
  tipo_contratto: string;
  tipologia?: string;
  stato_immobile?: string;
  riscaldamento?: string;
  disponibilita?: string;
  businessDetails?: {
    settore_merceologico?: string;
  } | null;
}

export async function saveTaxonomiesIfNew(listing: ListingDataForTaxonomy) {
  try {
    const taxonomies = await readTaxonomies();
    let changed = false;

    const checkAndAdd = (taxonomyName: string, value: string | undefined | null) => {
      if (!value || value.trim() === '') return;
      const trimmed = value.trim();

      if (!taxonomies[taxonomyName]) {
        taxonomies[taxonomyName] = [];
      }

      const list = taxonomies[taxonomyName] as string[];
      const lowerList = list.map(item => item.toLowerCase());

      if (!lowerList.includes(trimmed.toLowerCase())) {
        list.push(trimmed);
        changed = true;
      }
    };

    // 1. Categoria (IMMOBILE, BUSINESS)
    checkAndAdd('CATEGORIA', listing.categoria);

    // 2. Regime Contrattuale (VENDITA, AFFITTO)
    checkAndAdd('REGIME_CONTRATTUALE', listing.tipo_contratto);

    // 3. Tipo Annuncio (tipologia, e.g. Appartamento, Villa, Bar, etc.)
    checkAndAdd('TIPO_ANNUNCIO', listing.tipologia);

    // 4. Stato del Bene
    checkAndAdd('STATO_DEL_BENE', listing.stato_immobile);

    // 5. Riscaldamento ed Impianti
    checkAndAdd('RISCALDAMENTO_IMPIANTI', listing.riscaldamento);

    // 6. Disponibilità sul Mercato
    checkAndAdd('DISPONIBILITA_SUL_MERCATO', listing.disponibilita);

    // 7. Settore Merceologico (solo per Business/Attività)
    if (listing.categoria === 'BUSINESS' && listing.businessDetails?.settore_merceologico) {
      checkAndAdd('SETTORE_MERCEOLOGICO', listing.businessDetails.settore_merceologico);
    }

    if (changed) {
      await writeTaxonomies(taxonomies);
      console.log("Tassonomie aggiornate automaticamente in lib/taxonomies.json!");
    }
  } catch (err) {
    console.error("Errore nell'aggiornamento automatico delle tassonomie:", err);
  }
}
