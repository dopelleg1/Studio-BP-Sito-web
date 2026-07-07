import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'lib', 'social-posts.json');

async function readPosts() {
  try {
    const filePath = getFilePath();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Errore nella lettura del file social-posts.json:", error);
    return [];
  }
}

async function writePosts(posts: any[]) {
  try {
    const filePath = getFilePath();
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error("Errore nella scrittura del file social-posts.json:", error);
    return false;
  }
}

export async function GET() {
  const posts = await readPosts();
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { piattaforma, url_post, didascalia } = body;

    if (!url_post) {
      return NextResponse.json({ error: "L'URL del post o video è obbligatorio." }, { status: 400 });
    }

    // Auto-rilevamento piattaforma dall'URL
    let detectedPlatform = piattaforma || "";
    if (url_post.includes("instagram.com")) {
      detectedPlatform = "INSTAGRAM";
    } else if (url_post.includes("tiktok.com")) {
      detectedPlatform = "TIKTOK";
    }

    if (detectedPlatform !== "INSTAGRAM" && detectedPlatform !== "TIKTOK") {
      return NextResponse.json({ error: "Piattaforma non supportata. Inserisci un link Instagram o TikTok valido." }, { status: 400 });
    }

    let codice_embed = "";
    let finalCaption = didascalia || "";

    if (detectedPlatform === "INSTAGRAM") {
      // Estrae il codice post o reel (es: DQB2JhhiK2W)
      const instaRegex = /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_\-]+)/i;
      const match = url_post.match(instaRegex);
      if (match && match[1]) {
        const postCode = match[1];
        // Genera il codice iframe nativo di Instagram con didascalia inclusa (captioned)
        codice_embed = `<iframe src="https://www.instagram.com/p/${postCode}/embed/captioned/" style="width: 100%; height: 520px; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background: white;" scrolling="no" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`;
        
        // Se l'utente non ha specificato la didascalia, usiamo un fallback poiché l'iframe captioned mostra già il testo originale
        if (!finalCaption) {
          finalCaption = "Post/Reel di Studio BP su Instagram. Caricato con successo.";
        }
      } else {
        return NextResponse.json({ error: "URL Instagram non riconosciuto. Assicurati che contenga /p/ o /reel/" }, { status: 400 });
      }
    } else if (detectedPlatform === "TIKTOK") {
      // Estrae l'ID del video (es: 7659416633496145184)
      const tiktokRegex = /video\/(\d+)/i;
      const match = url_post.match(tiktokRegex);
      
      if (match && match[1]) {
        const videoId = match[1];
        // Costruiamo l'iframe del player nativo di TikTok (veloce, responsivo e indipendente da script esterni)
        codice_embed = `<iframe src="https://www.tiktok.com/embed/${videoId}" style="width: 100%; height: 580px; border: none; border-radius: 16px; background: black;" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`;

        // Proviamo a recuperare la didascalia reale e il titolo del video tramite l'oEmbed pubblico di TikTok
        try {
          const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url_post)}`;
          const response = await fetch(oEmbedUrl);
          if (response.ok) {
            const data = await response.json();
            if (data.title && !didascalia) {
              finalCaption = data.title; // Salva la vera didascalia del video!
            }
          }
        } catch (e) {
          console.warn("Impossibile recuperare dettagli oEmbed di TikTok, uso fallback:", e);
        }

        if (!finalCaption) {
          finalCaption = "Video informativo di Studio BP su TikTok. Clicca per guardarlo.";
        }
      } else {
        return NextResponse.json({ error: "URL TikTok non riconosciuto. Assicurati che contenga l'ID del video (/video/NUMERO)" }, { status: 400 });
      }
    }

    const posts = await readPosts();
    const nextId = posts.length > 0 ? Math.max(...posts.map((p: any) => p.id)) + 1 : 1;

    const newPost = {
      id: nextId,
      piattaforma: detectedPlatform,
      url_post,
      codice_embed,
      didascalia: finalCaption,
      data_creazione: new Date().toISOString()
    };

    posts.unshift(newPost);
    const success = await writePosts(posts);
    if (!success) {
      return NextResponse.json({ error: "Impossibile salvare il post." }, { status: 500 });
    }

    return NextResponse.json(newPost);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Errore interno." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.searchParams.get("id") || "", 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID post non valido o mancante." }, { status: 400 });
    }

    let posts = await readPosts();
    const originalLength = posts.length;
    posts = posts.filter((p: any) => p.id !== id);

    if (posts.length === originalLength) {
      return NextResponse.json({ error: "Post non trovato." }, { status: 404 });
    }

    const success = await writePosts(posts);
    if (!success) {
      return NextResponse.json({ error: "Impossibile salvare le modifiche." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Post #${id} eliminato con successo.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Errore interno." }, { status: 500 });
  }
}
