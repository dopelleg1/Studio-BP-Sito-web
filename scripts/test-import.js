const fs = require('fs');
const path = require('path');

async function test() {
  console.log("Lettura del file XML locale in corso...");
  const xmlPath = "G:\\Il mio Drive\\Download\\62E6BB7C-0F18-4F3F-AE2A-4CBADDBFF53B.xml";
  
  if (!fs.existsSync(xmlPath)) {
    console.error(`Errore: Il file XML non esiste nel percorso specificato: ${xmlPath}`);
    process.exit(1);
  }

  const xmlContent = fs.readFileSync(xmlPath, 'utf8');
  console.log(`File letto con successo. Dimensione: ${xmlContent.length} byte.`);

  console.log("Invio della richiesta POST a /api/import-getrix...");
  
  try {
    const response = await fetch("http://localhost:3005/api/import-getrix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        xmlContent,
        force: true,
        onlyTaxonomies: false
      })
    });

    const result = await response.json();
    console.log("Risposta ricevuta dall'API:");
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error("Errore durante la richiesta di test:", err.message);
  }
}

test();
