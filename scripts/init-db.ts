import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Avvio creazione tabelle Studio BP Italia su MySQL...");

  const queries = [
    // listings
    `CREATE TABLE IF NOT EXISTS \`listings\` (
        \`id\` INTEGER NOT NULL AUTO_INCREMENT,
        \`titolo\` VARCHAR(255) NOT NULL,
        \`descrizione\` TEXT NOT NULL,
        \`prezzo\` DECIMAL(12, 2) NOT NULL,
        \`indirizzo\` VARCHAR(255) NOT NULL,
        \`tipo_contratto\` ENUM('VENDITA', 'AFFITTO') NOT NULL,
        \`categoria\` ENUM('IMMOBILE', 'BUSINESS') NOT NULL,
        \`immagini\` JSON NOT NULL,
        \`data_creazione\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`riferimento\` VARCHAR(50) NULL,
        \`getrix_id\` VARCHAR(50) NULL,
        \`comune\` VARCHAR(100) NULL,
        \`zona\` VARCHAR(100) NULL,
        \`tipologia\` VARCHAR(100) NULL,
        \`stato_immobile\` VARCHAR(100) NULL,
        \`riscaldamento\` VARCHAR(100) NULL,
        \`anno_costruzione\` VARCHAR(10) NULL,
        \`disponibilita\` VARCHAR(100) NULL,
        \`spese_condominiali\` VARCHAR(100) NULL,
        \`provvigione\` VARCHAR(100) NULL,
        \`tassazione\` VARCHAR(100) NULL,
        \`proprietario_nome\` VARCHAR(150) NULL,
        \`proprietario_telefono\` VARCHAR(50) NULL,
        \`stima_riservata\` DECIMAL(12, 2) NULL,
        PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,

    // property_details
    `CREATE TABLE IF NOT EXISTS \`property_details\` (
        \`id\` INTEGER NOT NULL AUTO_INCREMENT,
        \`listing_id\` INTEGER NOT NULL,
        \`mq\` INTEGER NOT NULL,
        \`stanze\` INTEGER NOT NULL,
        \`bagni\` INTEGER NOT NULL,
        \`classe_energetica\` VARCHAR(10) NOT NULL,
        \`piano\` VARCHAR(50) NULL,
        \`posto_auto\` BOOLEAN NOT NULL DEFAULT false,
        \`giardino\` BOOLEAN NOT NULL DEFAULT false,
        UNIQUE INDEX \`property_details_listing_id_key\`(\`listing_id\`),
        PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,

    // business_details
    `CREATE TABLE IF NOT EXISTS \`business_details\` (
        \`id\` INTEGER NOT NULL AUTO_INCREMENT,
        \`listing_id\` INTEGER NOT NULL,
        \`settore_merceologico\` VARCHAR(100) NOT NULL,
        \`fatturato_annuo\` DECIMAL(15, 2) NULL,
        \`canone_mura\` DECIMAL(12, 2) NULL,
        \`utile_netto\` DECIMAL(15, 2) NULL,
        \`numero_dipendenti\` INTEGER NULL DEFAULT 0,
        UNIQUE INDEX \`business_details_listing_id_key\`(\`listing_id\`),
        PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,

    // leads
    `CREATE TABLE IF NOT EXISTS \`leads\` (
        \`id\` INTEGER NOT NULL AUTO_INCREMENT,
        \`nome\` VARCHAR(150) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`telefono\` VARCHAR(30) NULL,
        \`messaggio\` TEXT NOT NULL,
        \`id_listing_associato\` INTEGER NULL,
        \`status\` ENUM('NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED', 'CANCELLED') NOT NULL DEFAULT 'NEW',
        \`data_creazione\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,

    // Aggiunta Foreign Keys
    `ALTER TABLE \`property_details\` ADD CONSTRAINT \`property_details_listing_id_fkey\` FOREIGN KEY (\`listing_id\`) REFERENCES \`listings\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`,
    `ALTER TABLE \`business_details\` ADD CONSTRAINT \`business_details_listing_id_fkey\` FOREIGN KEY (\`listing_id\`) REFERENCES \`listings\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`,
    `ALTER TABLE \`leads\` ADD CONSTRAINT \`leads_id_listing_associato_fkey\` FOREIGN KEY (\`id_listing_associato\`) REFERENCES \`listings\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;`
  ];

  for (let i = 0; i < queries.length; i++) {
    try {
      console.log(`Esecuzione step ${i + 1}/${queries.length}...`);
      await prisma.$executeRawUnsafe(queries[i]);
      console.log(`Step ${i + 1} completato!`);
    } catch (err: any) {
      console.log(`Step ${i + 1} già presente o non applicabile: ${err.message || err}`);
    }
  }

  console.log("Database Studio BP Italia inizializzato con successo su MySQL!");
}

main()
  .catch(e => {
    console.error("Errore critico durante l'esecuzione del seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
