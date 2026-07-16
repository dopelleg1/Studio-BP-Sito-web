import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Operazione non autorizzata.' }, { status: 401 });
    }

    const leads = await db.lead.findMany({
      orderBy: {
        data_creazione: 'desc',
      },
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error('Errore nel caricamento dei lead:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    const createdLead = await db.lead.create({
      data: {
        nome: data.nome,
        email: data.email,
        telefono: data.telefono,
        messaggio: data.messaggio,
        id_listing_associato: data.id_listing_associato ? Number(data.id_listing_associato) : null,
        status: data.status || 'NEW',
        metodo_contatto: data.metodo_contatto || 'EMAIL',
      }
    });

    // Se il contatto è richiesto via e-mail, inviamo la mail SMTP se configurata
    if (createdLead.metodo_contatto === 'EMAIL') {
      try {
        const smtp = await db.smtpConfig.findUnique({ where: { id: 1 } });
        if (smtp && smtp.host && smtp.user) {
          const nodemailer = require('nodemailer');
          const transporter = nodemailer.createTransport({
            host: smtp.host,
            port: smtp.port,
            secure: smtp.secure,
            auth: {
              user: smtp.user,
              pass: smtp.pass
            }
          });

          let listingTitle = 'Generico / Contatto portale';
          if (createdLead.id_listing_associato) {
            const listing = await db.listing.findUnique({ where: { id: createdLead.id_listing_associato } });
            if (listing) {
              listingTitle = listing.titolo;
            }
          }

          const mailSubject = `[Studio BP Lead] Richiesta informazioni - ${listingTitle}`;
          const mailText = `Hai ricevuto un nuovo contatto dal sito web Studio BP:

Nome Completo: ${createdLead.nome}
Indirizzo Email: ${createdLead.email}
Numero Telefono: ${createdLead.telefono || 'N/D'}
Metodo Contatto Scelto: E-mail

Annuncio Associato: ${listingTitle} (ID: #${createdLead.id_listing_associato || 'N/D'})

Messaggio dell'utente:
------------------------------------------------------------
${createdLead.messaggio}
------------------------------------------------------------

Puoi gestire questo lead ed aggiornare lo stato accedendo all'Area Editore del backoffice.`;

          await transporter.sendMail({
            from: `"${smtp.user}" <${smtp.fromEmail}>`,
            to: smtp.toEmail,
            subject: mailSubject,
            text: mailText
          });
          console.log("Email notificata correttamente al broker tramite SMTP.");
        }
      } catch (mailErr) {
        console.error("Errore nell'invio della notifica mail SMTP:", mailErr);
      }
    }

    return NextResponse.json(createdLead);
  } catch (error: any) {
    console.error('Errore nella creazione del lead:', error);
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
