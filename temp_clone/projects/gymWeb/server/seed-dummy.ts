import { db } from "./db.js";
import { news, events, clubs } from "./schema.js";

const allNews = [
    {
      title: "Nacionalno prvenstvo 2026 - Rezultati",
      excerpt: "Naši sportaši su ostvarili odličan rezultat na nacionalnom prvenstvu. Posebno su se istaknuli u disciplinama na gredi i skoku.",
      category: "Rezultati",
      content: "Detaljni sadržaj vijesti...",
      createdAt: "5. veljače 2026."
    },
    {
      title: "Poziv za nove članove - Počni s gimnastikom!",
      excerpt: "Tražimo nove mlade talente! Prijavite se na besplatnu probnu lekciju u vašem lokalnom klubu.",
      category: "Obavijest",
      content: "Detaljni sadržaj vijesti...",
      createdAt: "1. veljače 2026."
    },
    {
      title: "Seminar za trenere - Nove tehnike i sigurnost",
      excerpt: "Pozivamo sve trenere na seminar o novim tehnikama i sigurnosti u gimnastici. Predavač: Međunarodni stručnjak.",
      category: "Edukacija",
      content: "Detaljni sadržaj vijesti...",
      createdAt: "28. siječnja 2026."
    },
    {
      title: "Međuregionalno natjecanje - Poziv za prijave",
      excerpt: "Otvorene su prijave za međuregionalno natjecanje koje će se održati u ožujku. Rok za prijave je 10. ožujka.",
      category: "Natjecanja",
      content: "Detaljni sadržaj vijesti...",
      createdAt: "20. siječnja 2026."
    },
];

const allEvents = [
    {
      title: "Kvalifikacije za županijsko prvenstvo",
      eventDate: "15. ožujka 2026.",
      eventTime: "09:00 - 17:00",
      location: "Zagreb - Gradski vrt",
      type: "Natjecanje",
      description: "Kvalifikacijske vježbe za sve discipline i sve dobne kategorije.",
    },
    {
      title: "Seminar za suce - Novi pravilnici",
      eventDate: "22. ožujka 2026.",
      eventTime: "10:00 - 16:00",
      location: "Poreč",
      type: "Edukacija",
      description: "Obavezna edukacija za sve suce o novim pravilnicima.",
    },
    {
      title: "Županijsko prvenstvo - Finala",
      eventDate: "5. travnja 2026.",
      eventTime: "08:00 - 18:00",
      location: "Zagreb - Gradski vrt",
      type: "Natjecanje",
      description: "Finale županijskog prvenstva sa svim disciplinama.",
    },
];

const allClubs = [
    {
      name: "GK Dinamo Zagreb",
      city: "Zagreb",
      address: "Maksimirska 128, Zagreb",
      phone: "+385 1 2345 6789",
      email: "info@gkdinamo.hr",
      website: "www.gkdinamo.hr",
    },
    {
      name: "GK Mladost",
      city: "Zagreb",
      address: "Savska 1, Zagreb",
      phone: "+385 1 3456 7890",
      email: "info@gkmladost.hr",
      website: "www.gkmladost.hr",
    },
    {
      name: "GK Zamet",
      city: "Rijeka",
      address: "Jadranska 50, Rijeka",
      phone: "+385 51 1234 567",
      email: "info@gkzamet.hr",
      website: "www.gkzamet.hr",
    },
];

async function seed() {
  console.log("Seeding Dummy Data into the Database...");
  
  for (const n of allNews) {
    db.insert(news).values({
      title: n.title,
      excerpt: n.excerpt,
      category: n.category,
      content: n.content,
      createdAt: n.createdAt
    }).run();
  }

  for (const e of allEvents) {
    db.insert(events).values({
      title: e.title,
      eventDate: e.eventDate,
      eventTime: e.eventTime,
      location: e.location,
      type: e.type,
      description: e.description,
    }).run();
  }

  for (const c of allClubs) {
    db.insert(clubs).values({
      name: c.name,
      city: c.city,
      address: c.address,
      phone: c.phone,
      email: c.email,
      website: c.website,
    }).run();
  }
  
  console.log("Seeding complete!");
}

seed().catch(console.error);
