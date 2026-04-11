import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, FileText } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";

export default function Rules() {
  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Pravila Natjecanja"
        description="Opća i specifična pravila natjecanja sportske, ritmičke gimnastike i parkoura pod okriljem Gimnastičkog saveza Zagrebačke županije."
        keywords="gimnastika pravila, GSZZ pravila natjecanja, parkour pravila, ritmička gimnastika propozicije"
      />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary via-blue-600 to-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{settings.rulesTitle || "Pravila Natjecanja"}</h1>
            <p className="text-xl text-blue-100">
              {settings.rulesSubtitle || "Saznajte sve važne informacije o pravilima i regulativama"}
            </p>
          </div>
        </section>

        {/* Rules Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            {/* Introduction */}
            <div className="mb-16 bg-blue-50 rounded-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-secondary mb-6">{settings.rulesIntroTitle || "Opća Pravila"}</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">
                {settings.rulesIntroBody || "Ovdje su navedena opća pravila vezana uz natjecanja i organizaciju. Molimo sve članove i natjecatelje da se upoznaju s ovim pravilnicima kako bi osigurali pošteno i sigurno sportsko okruženje."}
              </p>
            </div>

            {/* Rules by Category */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-secondary mb-12 text-center">{settings.rulesCategoriesTitle || "Pravila po Kategorijama"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sportska Gimnastika */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <CardTitle>{settings.rulesCat1Title || "Sportska Gimnastika"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {settings.rulesCat1Body || "Pravila i propisi vezani isključivo za sportsku gimnastiku, uključujući sustav bodovanja, rekvizite i starosne kategorije."}
                    </p>
                  </CardContent>
                </Card>

                {/* Ritmička Gimnastika */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <CardTitle>{settings.rulesCat2Title || "Ritmička Gimnastika"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {settings.rulesCat2Body || "Posebna pravila za ritmičku gimnastiku, rekvizite i glazbenu pratnju."}
                    </p>
                  </CardContent>
                </Card>

                {/* Parkour */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <CardTitle>{settings.rulesCat3Title || "Parkour"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {settings.rulesCat3Body || "Mjere opreza, propozicije i posebni pravilnici za parkour."}
                    </p>
                  </CardContent>
                </Card>

                {/* Sigurnost */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="w-8 h-8 text-primary" />
                      <CardTitle>{settings.rulesCat4Title || "Sigurnost i Zaštita"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 whitespace-pre-line">
                      {settings.rulesCat4Body || "Pravilnik o obaveznoj prisutnosti medicinskog osoblja i prijavljivanju ozljeda."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-red-50 border-l-4 border-primary rounded-lg p-8 md:p-12">
              <h3 className="text-2xl font-bold text-secondary mb-4">{settings.rulesImportantTitle || "Važne Napomene"}</h3>
              <div className="space-y-3 text-gray-700 whitespace-pre-line">
                <span className="flex items-start gap-3 mt-0.5 text-black">
                  <AlertCircle className="w-6 h-6 leading-none text-primary mt-0.5 flex-shrink-0 inline-block mr-2" />
                  {settings.rulesImportantBody || "Sva pravila podložna su promjenama u skladu s odlukama upravnog odbora."}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
