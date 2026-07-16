const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Avvio migrazione manuale sicura...");
  
  const columns = [
    { table: "listings", name: "pubblica_indirizzo", sql: "ALTER TABLE listings ADD COLUMN pubblica_indirizzo TINYINT(1) NOT NULL DEFAULT 1" },
    { table: "listings", name: "trattativa_riservata", sql: "ALTER TABLE listings ADD COLUMN trattativa_riservata TINYINT(1) NOT NULL DEFAULT 0" },
    { table: "listings", name: "asta", sql: "ALTER TABLE listings ADD COLUMN asta TINYINT(1) NOT NULL DEFAULT 0" },
    { table: "listings", name: "latitudine", sql: "ALTER TABLE listings ADD COLUMN latitudine VARCHAR(50) NULL" },
    { table: "listings", name: "longitudine", sql: "ALTER TABLE listings ADD COLUMN longitudine VARCHAR(50) NULL" },
    { table: "listings", name: "zoom", sql: "ALTER TABLE listings ADD COLUMN zoom INT NULL DEFAULT 12" },
    { table: "leads", name: "metodo_contatto", sql: "ALTER TABLE leads ADD COLUMN metodo_contatto VARCHAR(20) NULL DEFAULT 'EMAIL'" }
  ];

  for (const col of columns) {
    try {
      console.log(`Aggiunta colonna ${col.name} a tabella ${col.table}...`);
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

  // Creazione tabella smtp_config
  try {
    console.log("Creazione tabella smtp_config...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`smtp_config\` (
        \`id\` INT NOT NULL DEFAULT 1,
        \`host\` VARCHAR(255) NOT NULL,
        \`port\` INT NOT NULL DEFAULT 587,
        \`secure\` TINYINT(1) NOT NULL DEFAULT 0,
        \`user\` VARCHAR(255) NOT NULL,
        \`pass\` VARCHAR(255) NOT NULL,
        \`fromEmail\` VARCHAR(255) NOT NULL,
        \`toEmail\` VARCHAR(255) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log("Tabella smtp_config creata con successo.");

    // Record iniziale
    await prisma.$executeRawUnsafe(`
      INSERT IGNORE INTO \`smtp_config\` (\`id\`, \`host\`, \`port\`, \`secure\`, \`user\`, \`pass\`, \`fromEmail\`, \`toEmail\`)
      VALUES (1, 'smtp.example.com', 587, 0, 'user@example.com', 'password', 'user@example.com', 'admin@example.com');
    `);
    console.log("Record smtp_config inserito.");
  } catch (err) {
    console.error("Errore durante la creazione di smtp_config:", err.message);
  }

  console.log("Migrazione completata. Disconnessione...");
  await prisma.$disconnect();
}

main().catch(err => {
  console.error("Errore irreversibile nella migrazione:", err);
});
