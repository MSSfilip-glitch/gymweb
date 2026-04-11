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
  const documentsQuery = trpc.documents.list.useQuery();

  const getIconForCategory = (category: string) => {
    switch(category) {
      case "Pravni dokumenti": return FileText;
      case "Pravila": return FileText;
      case "Planiranje": return Calendar;
      case "Administracija": return Users;
      case "Financije": return FileText;
      case "Etika": return FileText;
      default: return FileText;
    }
  };

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
                {documentsQuery.isLoading && <p className="col-span-full text-center text-muted-foreground py-8">Učitavanje dokumenata...</p>}
                {documentsQuery.data?.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">Trenutno nema dostupnih dokumenata.</p>}
                {documentsQuery.data?.map((doc: any) => {
                  const Icon = getIconForCategory(doc.category);
                  return (
                    <Card key={doc.id} className="flex flex-col h-full hover:shadow-xl transition-all duration-300 border-border/50 group">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                          </div>
                          <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                            {doc.category}
                          </span>
                        </div>
                        <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">{doc.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col flex-1 pt-0">
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                          {doc.description}
                        </p>
                        <div className="mt-auto pt-4 border-t border-border/50 space-y-3">
                          <div className="flex items-center justify-center text-[11px] text-muted-foreground font-medium">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(doc.createdAt).toLocaleDateString('hr-HR')}
                          </div>
                          <a href={doc.pdfUrl || "#"} target="_blank" rel="noopener noreferrer" className="block w-full no-underline">
                            <Button 
                              size="sm" 
                              className="w-full bg-primary hover:bg-secondary text-white font-semibold transition-all duration-300 py-5 rounded-lg shadow-md hover:shadow-lg active:scale-[0.98] gap-2"
                              disabled={!doc.pdfUrl}
                            >
                              <Download className="w-4 h-4" />
                              {doc.pdfUrl ? "Preuzmi Dokument" : "Dokument nedostupan"}
                            </Button>
                          </a>
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
