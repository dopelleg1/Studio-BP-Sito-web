const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Avvio migrazione manuale sicura...");
  
  const columns = [
    { name: "pubblica_indirizzo", sql: "ALTER TABLE listings ADD COLUMN pubblica_indirizzo TINYINT(1) NOT NULL DEFAULT 1" },
    { name: "trattativa_riservata", sql: "ALTER TABLE listings ADD COLUMN trattativa_riservata TINYINT(1) NOT NULL DEFAULT 0" },
    { name: "asta", sql: "ALTER TABLE listings ADD COLUMN asta TINYINT(1) NOT NULL DEFAULT 0" },
    { name: "latitudine", sql: "ALTER TABLE listings ADD COLUMN latitudine VARCHAR(50) NULL" },
    { name: "longitudine", sql: "ALTER TABLE listings ADD COLUMN longitudine VARCHAR(50) NULL" },
    { name: "zoom", sql: "ALTER TABLE listings ADD COLUMN zoom INT NULL DEFAULT 12" }
  ];

  for (const col of columns) {
    try {
      console.log(`Aggiunta colonna ${col.name}...`);
      await prisma.$executeRawUnsafe(col.sql);
      console.log(`Colonna ${col.name} creata con successo.`);
    } catch (err) {
      if (err.message.includes("Duplicate column name") || err.message.includes("already exists")) {
        console.log(`Colonna ${col.name} gia presente nel database.`);
      } else {
        console.error(`Errore durante la creazione di ${col.name}:`, err.message);
      }
    }
  }

  console.log("Migrazione completata. Disconnessione...");
  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Errore irreversibile nella migrazione:", err);
});
