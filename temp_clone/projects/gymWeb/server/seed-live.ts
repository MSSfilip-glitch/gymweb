import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, "..", "gszz.db");
const sqlite = new Database(dbPath);

// ─── NEWS ────────────────────────────────────────────────────────────────────
const allNews = [
  {
    title: "Županijsko Prvenstvo 2026 – Fantastični Rezultati",
    excerpt: "Naši gimnastičari ostvarili su odlične rezultate na Županijskom Natjecanju 2026. Posebno su se istaknuli u disciplinama na gredi, skoku i tlu.",
    category: "Rezultati",
    content: "<p>Gimnastički savez Zagrebačke županije s ponosom objavljuje fantastične rezultate postignute na Županijskom Natjecanju 2026. Natjecatelji su pokazali iznimnu razinu vještine i predanosti, osvajajući brojna odličja u svim disciplinama.</p><p>Posebno se istaknuo nastup u kategoriji juniora gdje su naši sportaši dominirali na gredi i tlu. Organizacijski tim zahvaljuje svim trenerima, roditeljima i navijačima na podršci.</p>",
    createdAt: "2026-03-28"
  },
  {
    title: "Poziv za Nove Članove – Počni s Gimnastikom!",
    excerpt: "Tražimo nove mlade talente! Prijavite se na besplatnu probnu lekciju u vašem lokalnom klubu. Minigrupe, stručni treneri i sigurno okruženje.",
    category: "Obavijest",
    content: "<p>Gimnastički savez Zagrebačke županije poziva sve zainteresirane da isprobaju gimnastiku! Nude se besplatne probne lekcije u svim učlanjenim klubovima diljem županije.</p><p>Tečajevi su otvoreni za djecu od 3 do 16 godina. Svi novi polaznici dobivaju kompletan uvid u opremu i uvjete vježbanja te razgovor s iskusnim trenerima.</p><p>Za više informacija kontaktirajte vaš najbliži klub ili nas nazovite na +385 1 1234 5678.</p>",
    createdAt: "2026-03-20"
  },
  {
    title: "Seminar za Trenere – Nove Tehnike i Sigurnost",
    excerpt: "Pozivamo sve trenere na seminar o novim tehnikama i sigurnosti u gimnastici. Predavač: međunarodni stručnjak iz FIG-a.",
    category: "Edukacija",
    content: "<p>Organiziramo stručni seminar namijenjen svim aktivnim trenerima u Zagrebačkoj županiji. Seminar će pokrivati najnovije promjene u tehničkim pravilnicima, sigurnosne standarde te napredne metode podučavanja.</p><p>Predavač je gospodin Ivan Horvatić, međunarodni trener s više od 20 godina iskustva i certifikatom FIG-a. Seminar se održava 10. travnja 2026. u sportskoj dvorani GK Dinamo.</p><p>Kotizacija iznosi 150 kn. Prijave do 5. travnja.</p>",
    createdAt: "2026-03-15"
  },
  {
    title: "Međuregionalno Natjecanje – Poziv za Prijave",
    excerpt: "Otvorene su prijave za međuregionalno natjecanje koje će se održati u travnju 2026. Rok za prijave je 10. travnja.",
    category: "Natjecanja",
    content: "<p>GSZZ organizira međuregionalno natjecanje u sportskoj i ritmičkoj gimnastici. Natjecanje je otvoreno za sve uzrasne kategorije, od predškolaca do seniora.</p><p>Natjecanje će se održati 20. travnja 2026. u Športskom parku Mladost, Zagreb. Sve klubove molimo da prijave natjecatelje putem online obrasca najkasnije do 10. travnja.</p>",
    createdAt: "2026-03-10"
  },
  {
    title: "Nova Sezona Gimnastike – Raspored Treninga za 2026.",
    excerpt: "Objavljujemo novi raspored treninga za proljetnu sezonu 2026. Svi klubovi su ažurirali termine, pogledajte što se promijenilo.",
    category: "Obavijest",
    content: "<p>S ponosom predstavljamo novi raspored treninga za proljetnu sezonu 2026. Svi učlanjeni klubovi su dostavili ažurirane termine koji su dostupni na stranicama pojedinih klubova.</p><p>Upozoravamo sve roditelje i sportaše da provjere nove termine koji se mogu razlikovati od jesenskog rasporeda.</p>",
    createdAt: "2026-02-28"
  },
  {
    title: "Postignut Dogovor o Subvencijama za Mlađe Kategorije",
    excerpt: "Županijska uprava prihvatila zahtjev saveza za subvencioniranje natjecanja za kategoriju do 10 godina. Detalji uskoro.",
    category: "Obavijest",
    content: "<p>Gimnastički savez Zagrebačke županije postigao je važan dogovor s Uredom za sport Zagrebačke županije o subvencioniranju kotizacija za natjecanja djece do 10 godina.</p><p>Ova inicijativa ima za cilj povećati dostupnost sportske gimnastike svim obiteljima bez obzira na materijalni status. Više detalja bit će dostupno u narednim tjednima.</p>",
    createdAt: "2026-02-15"
  },
];

// ─── EVENTS ──────────────────────────────────────────────────────────────────
const allEvents = [
  {
    title: "Kvalifikacije za Županijsko Natjecanje",
    eventDate: "2026-04-15",
    eventTime: "09:00 - 17:00",
    location: "Zagreb – SD Dinamo, Maksimirska 128",
    type: "Natjecanje",
    description: "Kvalifikacijske vježbe za sve discipline i sve dobne kategorije.",
  },
  {
    title: "Seminar za Suce – Novi Pravilnici FIG-a",
    eventDate: "2026-04-22",
    eventTime: "10:00 - 16:00",
    location: "Velika Gorica – Sportska dvorana",
    type: "Edukacija",
    description: "Obavezna edukacija za sve suce o novim pravilnicima FIG-a za sezonu 2026.",
  },
  {
    title: "Županijsko Natjecanje – Zatvorena Dvorana",
    eventDate: "2026-05-03",
    eventTime: "08:00 - 18:00",
    location: "Zagreb – Sportski park Mladost",
    type: "Natjecanje",
    description: "Finale Županijskog Natjecanja u svim disciplinama, sve dobne kategorije.",
  },
  {
    title: "Ljetni Kamp Gimnastike 2026.",
    eventDate: "2026-07-10",
    eventTime: "08:00 - 16:00",
    location: "Zaprešić – Sportski centar",
    type: "Kamp",
    description: "Tjedni ljetni kamp za sportaše od 6 do 14 godina. Intenzivni treninzi i zabavni sadržaji.",
  },
  {
    title: "Stručni Seminar za Trenere – Ritmička Gimnastika",
    eventDate: "2026-05-17",
    eventTime: "10:00 - 15:00",
    location: "Zagreb – Dom sportova",
    type: "Edukacija",
    description: "Napredne tehnike u podučavanju ritmičke gimnastike. Gost predavač iz rumunjskog saveza.",
  },
  {
    title: "Međuregionalno Natjecanje 2026.",
    eventDate: "2026-04-26",
    eventTime: "09:00 - 17:00",
    location: "Samobor – Gradska sportska dvorana",
    type: "Natjecanje",
    description: "Natjecanje koje okuplja klubove iz Zagrebačke, Karlovačke i Sisačko–moslavačke županije.",
  },
  {
    title: "Dan Otvorenih Vrata – Probni Treninzi",
    eventDate: "2026-05-24",
    eventTime: "10:00 - 13:00",
    location: "Svi učlanjeni klubovi",
    type: "Događaj",
    description: "Besplatni probni treninzi za sve zainteresirane u svim učlanjenim klubovima.",
  },
];

// ─── CLUBS ───────────────────────────────────────────────────────────────────
const allClubs = [
  {
    name: "GK Dinamo Zagreb",
    city: "Zagreb",
    address: "Maksimirska 128, 10000 Zagreb",
    phone: "+385 1 2345 6789",
    email: "info@gkdinamo.hr",
    website: "www.gkdinamo.hr",
  },
  {
    name: "GK Mladost",
    city: "Zagreb",
    address: "Savska 30, 10000 Zagreb",
    phone: "+385 1 3456 7890",
    email: "info@gkmladost.hr",
    website: "www.gkmladost.hr",
  },
  {
    name: "GK Zaprešić",
    city: "Zaprešić",
    address: "Trg Ante Starčevića 4, 10290 Zaprešić",
    phone: "+385 1 4567 8901",
    email: "gkzapresic@gmail.com",
    website: "www.gkzapresic.hr",
  },
  {
    name: "GK Samobor",
    city: "Samobor",
    address: "Šmidhenova 5, 10430 Samobor",
    phone: "+385 1 5678 9012",
    email: "info@gksamobor.hr",
    website: "www.gksamobor.hr",
  },
  {
    name: "GK Velika Gorica",
    city: "Velika Gorica",
    address: "Ulica kralja Zvonimira 24, 10410 Velika Gorica",
    phone: "+385 1 6789 0123",
    email: "info@gkvg.hr",
    website: "www.gkvg.hr",
  },
  {
    name: "GK Dugo Selo",
    city: "Dugo Selo",
    address: "Josipa Bana Jelačića 12, 10370 Dugo Selo",
    phone: "+385 1 7890 1234",
    email: "gkdugoselo@gmail.com",
    website: "www.gkdugoselo.hr",
  },
  {
    name: "GK Sveta Nedelja",
    city: "Sveta Nedelja",
    address: "Trg Ante Starčevića 1, 10431 Sveta Nedelja",
    phone: "+385 1 8901 2345",
    email: "info@gksvnedelja.hr",
    website: "www.gksvnedelja.hr",
  },
];

// ─── RESULTS ─────────────────────────────────────────────────────────────────
const allResults = [
  {
    title: "Rezultati – Županijsko Natjecanje 2025.",
    eventDate: "2025-11-15",
    location: "Zagreb – SD Dinamo",
    content: "<p>Natjecanje je privuklo više od 200 gimnastičara iz 12 klubova. U kategoriji mlađih juniora, GK Dinamo Zagreb osvajao je zlato na tlu i gredi. U seniorskoj konkurenciji, GK Mladost nastupio je izvanredno s dva srebra.</p><p>Kompletna lista rezultata dostupna je u prilogu.</p>",
    pdfUrl: "/documents/rezultati-zupanijsko-2025.pdf",
  },
  {
    title: "Rezultati – Međuregionalno Natjecanje Travanj 2025.",
    eventDate: "2025-04-20",
    location: "Samobor – Gradska sportska dvorana",
    content: "<p>Međuregionalno natjecanje privuklo je više od 150 natjecatelja iz Zagrebačke, Karlovačke i Sisačko-moslavačke županije. Naši predstavnici posebno su se istaknuli u disciplinama ritmičke gimnastike.</p>",
    pdfUrl: "",
  },
  {
    title: "Sažetak Sezone 2024. – Godišnji Izvještaj",
    eventDate: "2024-12-20",
    location: "Zagreb",
    content: "<p>U 2024. godini naši klubovi sudjelovali su na ukupno 18 natjecanja, od čega 6 međuregionalnih i 2 državne razine. Osvajali smo ukupno 47 medalja.</p><p>Detaljan godišnji izvještaj dostupan je na zahtjev putem e-maila.</p>",
    pdfUrl: "",
  },
];

// ─── GALLERY ─────────────────────────────────────────────────────────────────
const allGallery = [
  {
    title: "Županijsko Natjecanje 2025. – Nastup na Gredi",
    description: "Natjecatelji iz GK Dinamo Zagreb u kategoriji mlađih juniorkinja.",
    imageUrl: "https://images.unsplash.com/photo-1574279606130-09ead4f97bc3?w=800&q=80",
    event: "Županijsko Natjecanje 2025.",
    eventDate: "2025-11-15",
  },
  {
    title: "Seminar za Trenere 2025. – Grupna Fotografija",
    description: "Sudionici godišnjeg seminara za trenere, Zaprešić.",
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    event: "Seminar za Trenere 2025.",
    eventDate: "2025-09-10",
  },
  {
    title: "Ljetni Kamp 2025. – Vježbe na Tlu",
    description: "Polaznici ljetnog kampa vježbaju pod vodstvom iskusnih trenera.",
    imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80",
    event: "Ljetni Kamp 2025.",
    eventDate: "2025-07-15",
  },
  {
    title: "Dan Otvorenih Vrata – GK Samobor 2025.",
    description: "Djeca isprobavaju gimnastiku na besplatnom probnom treningu.",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    event: "Dan Otvorenih Vrata 2025.",
    eventDate: "2025-05-20",
  },
  {
    title: "Međuregionalno Natjecanje – Ritmička Gimnastika",
    description: "Nastup s trakom u disciplini ritmičke gimnastike, Samobor.",
    imageUrl: "https://images.unsplash.com/photo-1566241832647-7ede7c9bbd7b?w=800&q=80",
    event: "Međuregionalno Natjecanje Travanj 2025.",
    eventDate: "2025-04-20",
  },
  {
    title: "Finala Županijskog Natjecanja – Skok",
    description: "Dramatičan skok u finalnoj rundi Županijskog Natjecanja.",
    imageUrl: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&q=80",
    event: "Županijsko Natjecanje 2025.",
    eventDate: "2025-11-15",
  },
];

// ─── RUN SEED ────────────────────────────────────────────────────────────────
console.log("Checking existing data counts...");
const newsCount = (sqlite.prepare("SELECT COUNT(*) as c FROM news").get() as { c: number }).c;
const eventsCount = (sqlite.prepare("SELECT COUNT(*) as c FROM events").get() as { c: number }).c;
const clubsCount = (sqlite.prepare("SELECT COUNT(*) as c FROM clubs").get() as { c: number }).c;
const resultsCount = (sqlite.prepare("SELECT COUNT(*) as c FROM results").get() as { c: number }).c;
const galleryCount = (sqlite.prepare("SELECT COUNT(*) as c FROM gallery_albums").get() as { c: number }).c;

console.log(`Existing: ${newsCount} news, ${eventsCount} events, ${clubsCount} clubs, ${resultsCount} results, ${galleryCount} gallery albums`);

const insertNews = sqlite.prepare(`
  INSERT INTO news (title, excerpt, category, content, image_url, published, created_at, updated_at)
  VALUES (?, ?, ?, ?, '', 1, ?, ?)
`);
const insertEvent = sqlite.prepare(`
  INSERT INTO events (title, description, event_date, event_time, location, type, published, created_at)
  VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
`);
const insertClub = sqlite.prepare(`
  INSERT INTO clubs (name, city, address, phone, email, website, created_at)
  VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
`);
const insertResult = sqlite.prepare(`
  INSERT INTO results (title, event_date, location, content, pdf_url, published, created_at)
  VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
`);
const insertGalleryAlbum = sqlite.prepare(`
  INSERT INTO gallery_albums (title, description, event_date, published, created_at)
  VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
`);
const insertGalleryImage = sqlite.prepare(`
  INSERT INTO gallery_album_images (album_id, image_url, created_at)
  VALUES (?, ?, CURRENT_TIMESTAMP)
`);

if (newsCount === 0) {
  for (const n of allNews) {
    insertNews.run(n.title, n.excerpt, n.category, n.content, n.createdAt, n.createdAt);
  }
  console.log(`✓ Inserted ${allNews.length} news items`);
} else {
  console.log(`  Skipping news (already has ${newsCount} rows)`);
}

if (eventsCount === 0) {
  for (const e of allEvents) {
    insertEvent.run(e.title, e.description, e.eventDate, e.eventTime, e.location, e.type);
  }
  console.log(`✓ Inserted ${allEvents.length} events`);
} else {
  console.log(`  Skipping events (already has ${eventsCount} rows)`);
}

if (clubsCount === 0) {
  for (const c of allClubs) {
    insertClub.run(c.name, c.city, c.address, c.phone, c.email, c.website);
  }
  console.log(`✓ Inserted ${allClubs.length} clubs`);
} else {
  console.log(`  Skipping clubs (already has ${clubsCount} rows)`);
}

if (resultsCount === 0) {
  for (const r of allResults) {
    insertResult.run(r.title, r.eventDate, r.location, r.content, r.pdfUrl);
  }
  console.log(`✓ Inserted ${allResults.length} results`);
} else {
  console.log(`  Skipping results (already has ${resultsCount} rows)`);
}

if (galleryCount === 0) {
  // Group gallery items by event to create albums
  const albumMap = new Map<string, typeof allGallery>();
  for (const g of allGallery) {
    const key = g.event;
    if (!albumMap.has(key)) albumMap.set(key, []);
    albumMap.get(key)!.push(g);
  }
  for (const [event, images] of albumMap) {
    const first = images[0];
    const albumResult = insertGalleryAlbum.run(first.event, first.description, first.eventDate) as { lastInsertRowid: number | bigint };
    const albumId = Number(albumResult.lastInsertRowid);
    for (const img of images) {
      insertGalleryImage.run(albumId, img.imageUrl);
    }
  }
  console.log(`✓ Inserted ${albumMap.size} gallery albums with ${allGallery.length} images`);
} else {
  console.log(`  Skipping gallery (already has ${galleryCount} rows)`);
}

console.log("\n✅ Seeding complete!");
sqlite.close();
