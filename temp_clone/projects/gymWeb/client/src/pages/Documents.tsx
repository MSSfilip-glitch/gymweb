import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";

export default function Documents() {
  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};
  const documents = [
    {
      id: 1,
      title: "Statut Saveza",
      description: "Osnovni dokument koji regulira rad Gimnaztičkog saveza Zagrebačke županije",
      date: "2025-01-15",
      category: "Pravni dokumenti",
      icon: FileText,
    },
    {
      id: 2,
      title: "Pravilnik o Natjecanjima",
      description: "Detaljni pravilnik koji uređuje sve aspekte natjecanja i turnira",
      date: "2025-02-01",
      category: "Pravila",
      icon: FileText,
    },
    {
      id: 3,
      title: "Godišnji Plan Aktivnosti 2026",
      description: "Pregled svih planiranih aktivnosti i događanja za 2026. godinu",
      date: "2025-12-20",
      category: "Planiranje",
      icon: Calendar,
    },
    {
      id: 4,
      title: "Upitnik za Klubove",
      description: "Obrazac koji klubovi trebaju ispuniti pri registraciji",
      date: "2025-11-10",
      category: "Administracija",
      icon: Users,
    },
    {
      id: 5,
      title: "Financijski Izvještaj 2025",
      description: "Godišnji financijski izvještaj Saveza",
      date: "2026-01-30",
      category: "Financije",
      icon: FileText,
    },
    {
      id: 6,
      title: "Kodeks Ponašanja",
      description: "Pravila ponašanja za sve članove, trenere i sudije",
      date: "2025-09-15",
      category: "Etika",
      icon: FileText,
    },
  ];

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Dokumenti"
        description="Službeni dokumenti Gimnastičkog saveza Zagrebačke županije — obrazac za klubove, statut, financijski izvještaji i pravilnici."
        keywords="GSZZ dokumenti, statut gimnastičkog saveza, pravilnici, preuzimanje dokumenata"
      />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary via-blue-600 to-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{settings.docsPageTitle || "Dokumenti"}</h1>
            <p className="text-xl text-blue-100 whitespace-pre-line">
              {settings.docsPageSubtitle || "Preuzimite važne dokumente i obavijesti"}
            </p>
          </div>
        </section>

        {/* Documents Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Introduction */}
            <div className="mb-16 bg-blue-50 rounded-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-secondary mb-6">{settings.docsIntroTitle || "Dostupni Dokumenti"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">
                {settings.docsIntroBody || "Na ovoj stranici možete preuzeti sve važne dokumente vezane uz rad Gimnastičkog saveza Zagrebačke županije. Ako trebate dodatne informacije, slobodno nas kontaktirajte."}
              </p>
            </div>

            {/* Documents Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-secondary mb-12 text-center">{settings.docsGridTitle || "Svi Dokumenti"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <Card key={doc.id} className="hover:shadow-lg transition">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <Icon className="w-8 h-8 text-primary flex-shrink-0" />
                          <span className="text-xs font-semibold text-primary bg-blue-100 px-3 py-1 rounded-full">
                            {doc.category}
                          </span>
                        </div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-gray-700 text-sm">{doc.description}</p>
                        <div className="flex flex-col gap-3 pt-4 border-t">
                          <span className="text-xs text-muted-foreground text-center">
                            {new Date(doc.date).toLocaleDateString('hr-HR')}
                          </span>
                          <Button 
                            size="sm" 
                            className="bg-primary hover:bg-primary/90 gap-2 w-full justify-center"
                            onClick={() => {
                              alert(`Preuzimanje dokumenta: ${doc.title}`);
                              // U budućnosti: implementirajte stvarni download
                            }}
                          >
                            <Download className="w-4 h-4" />
                            Preuzmi
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-8 md:p-12">
              <h3 className="text-2xl font-bold text-secondary mb-4">{settings.docsImportantTitle || "Važna Obavijest"}</h3>
              <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">
                {settings.docsImportantBody || "Svi dokumenti su u PDF formatu. Za pregled dokumenata potreban vam je odgovarajući preglednik (npr. Adobe Acrobat Reader). Dokumenti se obnavljaju početkom svake kalendarske godine."}
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
