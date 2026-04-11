import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";

export default function About() {
  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="O Nama"
        description="Saznajte više o misiji, viziji i povijesti Gimnastičkog saveza Zagrebačke županije. Naš cilj je razvoj i promicanje gimnastike."
        keywords="o nama GSZZ, vizija GSZZ, povijest gimnastike Zagrebačka županija"
      />
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary via-blue-600 to-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{settings.aboutTitle || "O Nama"}</h1>
            <p className="text-xl text-blue-100">
              {settings.aboutSubtitle || "Saznajte više o Gimnastičkom savezu Zagrebačke županije"}
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-6">{settings.aboutMissionTitle || "Naša Misija"}</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">
                  {settings.aboutMissionBody || "Misija Gimnastičkog saveza je razvoj i promicanje gimnastičkog sporta na području Zagrebačke županije."}
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-6">{settings.aboutVisionTitle || "Naša Vizija"}</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4 whitespace-pre-line">
                  {settings.aboutVisionBody || "Vizija saveza je postati vodeća sportska organizacija u županiji, prepoznata po kvaliteti rada."}
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-secondary mb-12 text-center">{settings.aboutValuesTitle || "Naše Vrijednosti"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-8 h-8 text-primary" />
                      <CardTitle>{settings.aboutVal1Title || "Izvrsnost"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">
                      {settings.aboutVal1Body || "Težimo izvrsnosti u svemu što radimo."}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-8 h-8 text-primary" />
                      <CardTitle>{settings.aboutVal2Title || "Zajednica"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">
                      {settings.aboutVal2Body || "Gradimo snažnu i povezanu zajednicu."}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-8 h-8 text-primary" />
                      <CardTitle>{settings.aboutVal3Title || "Posvećenost"}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 whitespace-pre-line">
                      {settings.aboutVal3Body || "Posvećeni smo dugoročnom razvoju gimnastike."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* History */}
            <div className="bg-blue-50 rounded-lg p-8 md:p-12">
              <h2 className="text-3xl font-bold text-secondary mb-6">{settings.aboutHistoryTitle || "Naša Povijest"}</h2>
              <div className="space-y-4 text-gray-700 text-lg whitespace-pre-line">
                <p>{settings.aboutHistoryBody || "Gimnastički savez Zagrebačke županije osnovan je s ciljem..."}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
