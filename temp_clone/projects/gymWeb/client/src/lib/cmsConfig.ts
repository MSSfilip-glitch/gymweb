export interface CMSField {
  key: string;
  label: string;
  type: "text" | "textarea";
  defaultValue: string;
}

export interface CMSSection {
  id: string;
  title: string;
  description: string;
  fields: CMSField[];
}

export interface CMSCategory {
  id: string;
  label: string;
  sections: CMSSection[];
}

export const cmsConfig: CMSCategory[] = [
  {
    id: "global",
    label: "Globalno",
    sections: [
      {
        id: "contact",
        title: "Kontakt Podaci",
        description: "Globalni kontakt podaci prikazani na cijeloj stranici i u podnožju.",
        fields: [
          { key: "contactEmail", label: "Email adresa", type: "text", defaultValue: "info@gszz.hr" },
          { key: "contactPhone", label: "Broj telefona", type: "text", defaultValue: "+385 1 1234 5678" },
          { key: "contactAddress", label: "Adresa / Sjedište", type: "textarea", defaultValue: "Gimnastički savez Zagrebačke županije\nTrg Krešimira Ćosića 11\n10000 Zagreb, Hrvatska" },
          { key: "socialFacebook", label: "Facebook Link", type: "text", defaultValue: "https://facebook.com/gszz" },
          { key: "socialInstagram", label: "Instagram Link", type: "text", defaultValue: "https://instagram.com/gszz" },
          { key: "socialYoutube", label: "YouTube Link", type: "text", defaultValue: "https://youtube.com/@gszz" },
        ]
      },
      {
        id: "footer",
        title: "Podnožje (Footer)",
        description: "Sadržaj potpuno na dnu cjelokupne stranice.",
        fields: [
          { key: "footerDesc", label: "Opis ispod loga u podnožju", type: "textarea", defaultValue: "Gimnastički savez Zagrebačke županije - Ujedinjujemo gimnastičku zajednicu." },
          { key: "footerCopyright", label: "Copyright tekst", type: "text", defaultValue: "© 2026 Gimnastički savez Zagrebačke županije. Sva prava zadržana." },
        ]
      }
    ]
  },
  {
    id: "home",
    label: "Početna",
    sections: [
      {
        id: "homeHero",
        title: "Glavni (Hero) Dio",
        description: "Tekst na samom vrhu početne stranice.",
        fields: [
          { key: "heroTitle", label: "Glavni naslov", type: "text", defaultValue: "Gimnastički savez Zagrebačke županije" },
          { key: "heroSubtitle", label: "Glavni podnaslov", type: "textarea", defaultValue: "Ujedinjujemo klubove, trenere i sportaše u promociji gimnastike kao sporta koji razvija fizičku i mentalnu snagu." },
          { key: "homeHeroBtn1", label: "Tekst gumba 1", type: "text", defaultValue: "Pogledaj Događanja" },
          { key: "homeHeroBtn2", label: "Tekst gumba 2", type: "text", defaultValue: "Kontaktiraj Nas" },
        ]
      },
      {
        id: "homeVideo",
        title: "Video Sekcija",
        description: "Naslov i tekst iznad video prikaza.",
        fields: [
          { key: "homeVideoTitle", label: "Naslov video sekcije", type: "text", defaultValue: "Pogledaj Naše Sportaše u Akciji" },
          { key: "homeVideoPlaceholder", label: "Tekst u videu dok se ne učita", type: "text", defaultValue: "Video će biti dostupan uskoro" },
        ]
      },
      {
        id: "homePartners",
        title: "Partneri i Sponzori",
        description: "Naslov sekcije s partnerima na početnoj stranici.",
        fields: [
          { key: "homePartnersTitle", label: "Naslov sekcije", type: "text", defaultValue: "Naši Partneri i Sponzori" },
          { key: "homePartnersContactPrefix", label: "Tekst poziva na suradnju", type: "text", defaultValue: "Zainteresirani ste za suradnju?" },
          { key: "homePartnersContactLink", label: "Tekst linka na suradnju", type: "text", defaultValue: "Kontaktirajte nas" },
        ]
      },
      {
        id: "homeStats",
        title: "Statistika",
        description: "Brojevi i tekstovi prikazani u plavom bloku na dnu početne.",
        fields: [
          { key: "homeStats1Num", label: "Statistika 1 - Broj", type: "text", defaultValue: "23" },
          { key: "homeStats1Text", label: "Statistika 1 - Tekst", type: "text", defaultValue: "Klubova članova" },
          { key: "homeStats2Num", label: "Statistika 2 - Broj", type: "text", defaultValue: "1200+" },
          { key: "homeStats2Text", label: "Statistika 2 - Tekst", type: "text", defaultValue: "Aktivnih članova" },
          { key: "homeStats3Num", label: "Statistika 3 - Broj", type: "text", defaultValue: "45" },
          { key: "homeStats3Text", label: "Statistika 3 - Tekst", type: "text", defaultValue: "Trenera" },
          { key: "homeStats4Num", label: "Statistika 4 - Broj", type: "text", defaultValue: "50+" },
          { key: "homeStats4Text", label: "Statistika 4 - Tekst", type: "text", defaultValue: "Natjecanja godišnje" },
        ]
      },
      {
        id: "homeNewsAndEvents",
        title: "Vijesti i Događanja",
        description: "Naslovi sekcija za vijesti i događanja.",
        fields: [
          { key: "homeNewsTitle", label: "Naslov sekcije vijesti", type: "text", defaultValue: "Posljednje Vijesti" },
          { key: "homeNewsSubtitle", label: "Podnaslov sekcije vijesti", type: "text", defaultValue: "Pratite najnovije obavijesti iz svijeta gimnaztike" },
          { key: "homeNewsBtn", label: "Gumb za sve vijesti", type: "text", defaultValue: "Sve vijesti" },
          { key: "homeEventsTitle", label: "Naslov sekcije događanja", type: "text", defaultValue: "Nadolazeća Događanja" },
          { key: "homeEventsSubtitle", label: "Podnaslov sekcije događanja", type: "text", defaultValue: "Pripremite se za sljedeće natjecanje i edukativne programe" },
          { key: "homeEventsBtn", label: "Gumb za kalendar događanja", type: "text", defaultValue: "Puni kalendar" },
        ]
      },
      {
        id: "homeFeatures",
        title: "Kartice 'Što nudimo'",
        description: "Četiri kartice koje opisuju što savez nudi.",
        fields: [
          { key: "homeFeaturesTitle", label: "Glavni naslov - Što Nudimo", type: "text", defaultValue: "Što Nudimo" },
          { key: "feature1Title", label: "Kartica 1 - Naslov", type: "text", defaultValue: "Natjecanja" },
          { key: "feature1Text", label: "Kartica 1 - Tekst", type: "textarea", defaultValue: "Redovita natjecanja na svim razinama, od početnika do vrhunskih sportaša." },
          { key: "feature2Title", label: "Kartica 2 - Naslov", type: "text", defaultValue: "Edukacija" },
          { key: "feature2Text", label: "Kartica 2 - Tekst", type: "textarea", defaultValue: "Seminari i obuke za trenere, suce i ostale stručnjake u gimnastici." },
          { key: "feature3Title", label: "Kartica 3 - Naslov", type: "text", defaultValue: "Informacije" },
          { key: "feature3Text", label: "Kartica 3 - Tekst", type: "textarea", defaultValue: "Sve važne informacije, pravilnici i dokumenti dostupni na jednom mjestu." },
          { key: "feature4Title", label: "Kartica 4 - Naslov", type: "text", defaultValue: "Kalendar" },
          { key: "feature4Text", label: "Kartica 4 - Tekst", type: "textarea", defaultValue: "Kompletan pregled svih događanja, natjecanja i važnih datuma tijekom godine." },
        ]
      },
      {
        id: "homeCTA",
        title: "Poziv na Akciju (Bottom CTA)",
        description: "Plavi blok na dnu početne stranice prije podnožja.",
        fields: [
          { key: "homeCTATitle", label: "Naslov bloka", type: "text", defaultValue: "Pridružite se našoj sportskoj obitelji" },
          { key: "homeCTASubtitle", label: "Podnaslov bloka", type: "textarea", defaultValue: "Zanima vas treniranje gimnastike ili se želite uključiti u rad saveza? Kontaktirajte nas izravno na {email} ili {phone}." },
          { key: "homeCTABtn1", label: "Gumb 1", type: "text", defaultValue: "Pronađi Klub" },
          { key: "homeCTABtn2", label: "Gumb 2", type: "text", defaultValue: "Saznaj Više" },
        ]
      }
    ]
  },
  {
    id: "about",
    label: "O Nama",
    sections: [
      {
        id: "aboutIntro",
        title: "Uvod",
        description: "Zaglje stranice",
        fields: [
          { key: "aboutTitle", label: "Glavni naslov", type: "text", defaultValue: "O Nama" },
          { key: "aboutSubtitle", label: "Podnaslov", type: "textarea", defaultValue: "Saznajte više o Gimnastičkom savezu Zagrebačke županije" },
        ]
      },
      {
        id: "aboutMissionVision",
        title: "Misija i Vizija",
        description: "",
        fields: [
          { key: "aboutMissionTitle", label: "Naslov - Misija", type: "text", defaultValue: "Naša Misija" },
          { key: "aboutMissionBody", label: "Tekst - Misija", type: "textarea", defaultValue: "Misija Gimnastičkog saveza je razvoj i promicanje gimnastičkog sporta na području Zagrebačke županije. Kontinuiranim radom s klubovima, trenerima i sportašima stvaramo uvjete za postizanje vrhunskih sportskih rezultata." },
          { key: "aboutVisionTitle", label: "Naslov - Vizija", type: "text", defaultValue: "Naša Vizija" },
          { key: "aboutVisionBody", label: "Tekst - Vizija", type: "textarea", defaultValue: "Vizija saveza je postati vodeća sportska organizacija u županiji, prepoznata po kvaliteti rada, masovnosti i vrhunskim rezultatima, gdje gimnastika postaje temelj zdravog razvoja djece i mladih." },
        ]
      },
      {
        id: "aboutValues",
        title: "Vrijednosti",
        description: "Tri glavne vrijednosti organizacije",
        fields: [
          { key: "aboutValuesTitle", label: "Glavni naslov", type: "text", defaultValue: "Naše Vrijednosti" },
          { key: "aboutVal1Title", label: "Vrijednost 1 - Naslov", type: "text", defaultValue: "Izvrsnost" },
          { key: "aboutVal1Body", label: "Vrijednost 1 - Tekst", type: "textarea", defaultValue: "Težimo izvrsnosti u svemu što radimo, od organizacije natjecanja do edukacije trenera i podrške našim sportašima." },
          { key: "aboutVal2Title", label: "Vrijednost 2 - Naslov", type: "text", defaultValue: "Zajednica" },
          { key: "aboutVal2Body", label: "Vrijednost 2 - Tekst", type: "textarea", defaultValue: "Gradimo snažnu i povezanu zajednicu koja se međusobno podržava i potiče na napredak u sportskom i osobnom razvoju." },
          { key: "aboutVal3Title", label: "Vrijednost 3 - Naslov", type: "text", defaultValue: "Posvećenost" },
          { key: "aboutVal3Body", label: "Vrijednost 3 - Tekst", type: "textarea", defaultValue: "Posvećeni smo dugoročnom razvoju gimnastike i stvaranju uvjeta u kojima će svako dijete imati priliku ostvariti svoj potencijal." },
        ]
      },
      {
        id: "aboutHistory",
        title: "Povijest",
        description: "",
        fields: [
          { key: "aboutHistoryTitle", label: "Naslov", type: "text", defaultValue: "Naša Povijest" },
          { key: "aboutHistoryBody", label: "Tekst", type: "textarea", defaultValue: "Gimnastički savez Zagrebačke županije osnovan je s ciljem ujedinjavanja klubova i podizanja kvalitete gimnastičkog sporta u regiji. Tijekom godina, savez je izrastao u snažnu organizaciju koja okuplja veliki broj članova i redovito organizira natjecanja svih razina." },
        ]
      }
    ]
  },
  {
    id: "rules",
    label: "Pravila",
    sections: [
      {
        id: "rulesIntro",
        title: "Uvod",
        description: "",
        fields: [
          { key: "rulesTitle", label: "Glavni naslov", type: "text", defaultValue: "Pravila i Propisi" },
          { key: "rulesSubtitle", label: "Podnaslov", type: "textarea", defaultValue: "Službena dokumentacija i pravilnici za natjecanja." },
          { key: "rulesIntroTitle", label: "Naslov uvoda", type: "text", defaultValue: "Opća Pravila" },
          { key: "rulesIntroBody", label: "Tekst uvoda", type: "textarea", defaultValue: "Ovdje su navedena opća pravila vezana uz natjecanja i organizaciju. Molimo sve članove i natjecatelje da se upoznaju s ovim pravilnicima kako bi osigurali pošteno i sigurno sportsko okruženje." },
        ]
      },
      {
        id: "rulesCategories",
        title: "Pravila po Kategorijama",
        description: "",
        fields: [
          { key: "rulesCategoriesTitle", label: "Glavni Naslov", type: "text", defaultValue: "Pravila po Kategorijama" },
          { key: "rulesCat1Title", label: "Kategorija 1 - Naslov", type: "text", defaultValue: "Sportska Gimnastika" },
          { key: "rulesCat1Body", label: "Kategorija 1 - Tekst", type: "textarea", defaultValue: "Pravila i propisi vezani isključivo za sportsku gimnastiku, uključujući sustav bodovanja, rekvizite i starosne kategorije." },
          { key: "rulesCat2Title", label: "Kategorija 2 - Naslov", type: "text", defaultValue: "Ritmička Gimnastika" },
          { key: "rulesCat2Body", label: "Kategorija 2 - Tekst", type: "textarea", defaultValue: "Posebna pravila za ritmičku gimnastiku, rekvizite i glazbenu pratnju." },
          { key: "rulesCat3Title", label: "Kategorija 3 - Naslov", type: "text", defaultValue: "Parkour" },
          { key: "rulesCat3Body", label: "Kategorija 3 - Tekst", type: "textarea", defaultValue: "Mjere opreza, propozicije i posebni pravilnici za parkour." },
          { key: "rulesCat4Title", label: "Kategorija 4 - Naslov", type: "text", defaultValue: "Sigurnost i Zaštita" },
          { key: "rulesCat4Body", label: "Kategorija 4 - Tekst", type: "textarea", defaultValue: "Pravilnik o obaveznoj prisutnosti medicinskog osoblja i prijavljivanju ozljeda." },
        ]
      },
      {
        id: "rulesImportant",
        title: "Važne Napomene",
        description: "",
        fields: [
          { key: "rulesImportantTitle", label: "Naslov", type: "text", defaultValue: "Važne Napomene" },
          { key: "rulesImportantBody", label: "Tekst", type: "textarea", defaultValue: "Sva pravila podložna su promjenama u skladu s odlukama upravnog odbora. Preporučujemo redovito praćenje ove stranice prije početka natjecateljske sezone." },
        ]
      }
    ]
  },
  {
    id: "documents",
    label: "Dokumenti",
    sections: [
      {
        id: "docsIntro",
        title: "Uvod i Upute",
        description: "",
        fields: [
          { key: "docsPageTitle", label: "Glavni naslov", type: "text", defaultValue: "Dokumenti" },
          { key: "docsPageSubtitle", label: "Podnaslov", type: "textarea", defaultValue: "Preuzimite važne dokumente i obavijesti" },
          { key: "docsIntroTitle", label: "Naslov uvoda", type: "text", defaultValue: "Dostupni Dokumenti" },
          { key: "docsIntroBody", label: "Tekst uvoda", type: "textarea", defaultValue: "Na ovoj stranici možete preuzeti sve važne dokumente vezane uz rad Gimnastičkog saveza Zagrebačke županije. Ako trebate dodatne informacije, slobodno nas kontaktirajte." },
          { key: "docsGridTitle", label: "Naslov liste dokumenata", type: "text", defaultValue: "Svi Dokumenti" },
        ]
      },
      {
        id: "docsImportant",
        title: "Važna Obavijest",
        description: "Okvir na dnu",
        fields: [
          { key: "docsImportantTitle", label: "Naslov", type: "text", defaultValue: "Važna Obavijest" },
          { key: "docsImportantBody", label: "Tekst", type: "textarea", defaultValue: "Svi dokumenti su u PDF formatu. Za pregled dokumenata potreban vam je odgovarajući preglednik (npr. Adobe Acrobat Reader). Dokumenti se obnavljaju početkom svake kalendarske godine." },
        ]
      }
    ]
  },
  {
    id: "contact",
    label: "Kontakt",
    sections: [
      {
        id: "contactIntro",
        title: "Uvod",
        description: "",
        fields: [
          { key: "contactPageTitle", label: "Glavni naslov", type: "text", defaultValue: "Kontakt" },
          { key: "contactPageSubtitle", label: "Podnaslov", type: "textarea", defaultValue: "Obratite nam se s bilo kakvim pitanjima ili prijedlozima. Tu smo za vas!" },
          { key: "contactFormTitle", label: "Naslov forme", type: "text", defaultValue: "Pošaljite nam poruku" },
          { key: "contactInfoTitle", label: "Naslov informacija", type: "text", defaultValue: "Kontakt informacije" },
          { key: "contactMapPlaceholder", label: "Placeholder za Mapu", type: "text", defaultValue: "Google Maps - dolazi uskoro" },
          { key: "donationTitle", label: "Naslov za donacije", type: "text", defaultValue: "Donacije i Članarine" },
          { key: "donationIban", label: "Podaci za uplatu / IBAN", type: "textarea", defaultValue: "Uplatitelj: [Vaše ime]\nPrimatelj: Gimnastički savez Zagrebačke županije\nIBAN: HR1234567890123456789\nOpis plaćanja: Donacija / Članarina" },        ]
      }
    ]
  },
  {
    id: "catalog",
    label: "Ostale Stranice",
    sections: [
      {
        id: "newsPage",
        title: "Vijesti",
        description: "",
        fields: [
          { key: "newsPageTitle", label: "Glavni naslov", type: "text", defaultValue: "Vijesti i Obavijesti" },
          { key: "newsPageSubtitle", label: "Podnaslov", type: "textarea", defaultValue: "Pratite sve novosti iz svijeta gimnastike u Zagrebačkoj županiji" },
        ]
      },
      {
        id: "clubsPage",
        title: "Klubovi",
        description: "",
        fields: [
          { key: "clubsPageTitle", label: "Glavni naslov", type: "text", defaultValue: "Učlanjeni Klubovi" },
          { key: "clubsPageSubtitle", label: "Podnaslov", type: "textarea", defaultValue: "Pronađite klub u vašoj blizini i učlanite se." },
        ]
      },
      {
        id: "galleryPage",
        title: "Rezultati i Galerija",
        description: "",
        fields: [
          { key: "galleryPageTitle", label: "Glavni naslov", type: "text", defaultValue: "Rezultati i Galerija" },
          { key: "galleryPageSubtitle", label: "Podnaslov", type: "textarea", defaultValue: "Pogledaj rezultate natjecanja i fotografije s događanja." },
        ]
      },
      {
        id: "exercisesPage",
        title: "Vježbe",
        description: "",
        fields: [
          { key: "exercisesPageTitle", label: "Glavni naslov", type: "text", defaultValue: "Vježbe po Godinama" },
          { key: "exercisesPageSubtitle", label: "Podnaslov", type: "textarea", defaultValue: "Otkrijte vježbe prilagođene dobi i razini vještina" },
        ]
      }
    ]
  }
];

export const getDefaultSettings = (): Record<string, string> => {
  const settings: Record<string, string> = {};
  cmsConfig.forEach(category => {
    category.sections.forEach(section => {
      section.fields.forEach(field => {
        settings[field.key] = field.defaultValue;
      });
    });
  });
  return settings;
};
