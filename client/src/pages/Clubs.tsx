import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";

/**
 * GSZZ Clubs Page
 * Design: Dynamic Athletic Energy
 * - List of member clubs
 * - Club details and contact information
 * - Search and filter functionality
 */

export default function Clubs() {
  const [searchTerm, setSearchTerm] = useState("");
  // no selected club

  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};

  const clubsQuery = trpc.clubs.list.useQuery();
  const clubs = (clubsQuery.data ?? []).map(club => ({
    ...club,
    location: club.city,
    members: "100+", // Demo value since DB does not track exact size
    coach: "Voditelj Kluba", // Demo value
    founded: "Nepoznato" // Fallback since DB schema missing founded year
  }));

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const locations = Array.from(new Set(clubs.map((club) => club.location)));

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Klubovi"
        description="Popis svih gimnastičkih klubova članica Gimnastičkog saveza Zagrebačke županije. Pronađite klub u svojoj blizini."
        keywords="gimnastički klubovi, klubovi GSZZ, ritmička gimnastika klubovi, sportska gimnastika"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-blue-900 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">{settings.clubsPageTitle || "Klubovi Članovi"}</h1>
          <p className="text-white/80 text-lg">
            {settings.clubsPageSubtitle || "Pronađi klub blizu sebe i počni s treningom"}
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-slate-50 py-8 border-b border-border">
        <div className="container">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Pretraži klubove po imenu ili mjestu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground">
              Pronađeno {filteredClubs.length} od {clubs.length} klubova
            </p>
          </div>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-12">
        <div className="container">
          {clubsQuery.isLoading && <p className="text-center py-12 text-muted-foreground">Učitavanje klubova...</p>}
          {!clubsQuery.isLoading && filteredClubs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredClubs.map((club) => (
                <Card
                  key={club.id}
                  className="border-border hover:shadow-lg hover:border-primary transition-all"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2 gap-4">
                      <div className="flex gap-4 items-center flex-1">
                        {club.imageUrl ? (
                           <div className="w-16 h-16 shrink-0 bg-white rounded-lg border shadow-sm p-1">
                               <img src={club.imageUrl} alt={club.name} className="w-full h-full object-contain" />
                           </div>
                        ) : (
                           <div className="w-16 h-16 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                               <MapPin className="w-8 h-8" />
                           </div>
                        )}
                        <div>
                          <CardTitle className="text-xl mb-1">{club.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {club.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold text-primary">{club.members}</div>
                        <p className="text-xs text-muted-foreground">članova</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-secondary">Adresa:</span> {club.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-secondary">Osnovan:</span> {club.founded}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-secondary">Voditelj:</span> {club.coach}
                      </p>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <a
                          href={`tel:${club.phone}`}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          {club.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <a
                          href={`mailto:${club.email}`}
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          {club.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <a
                          href={`https://${club.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          {club.website}
                        </a>
                      </div>
                    </div>
                    {club.mapUrl && (
                      <div className="pt-4 border-t border-border">
                        {club.mapUrl.includes("embed") ? (
                          <div className="rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center h-48 w-full">
                            <iframe 
                              src={club.mapUrl} 
                              width="100%" 
                              height="100%" 
                              style={{ border: 0 }} 
                              allowFullScreen 
                              loading="lazy" 
                              referrerPolicy="no-referrer-when-downgrade" 
                            />
                          </div>
                        ) : (
                          <a href={club.mapUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                            <Button variant="outline" className="w-full gap-2">
                              <MapPin className="w-4 h-4" /> Prikaži na Karti
                            </Button>
                          </a>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                Nema klubova koji odgovaraju vašoj pretrazi.
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Očisti pretragu
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-slate-50 py-12 border-t border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-secondary mb-8">Klubovi po Lokacijama</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {locations.sort().map((location) => {
              const clubsInLocation = clubs.filter((c) => c.location === location);
              return (
                <Card key={location} className="border-border hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-secondary mb-2">{location}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {clubsInLocation.length} klub{clubsInLocation.length !== 1 ? "a" : ""}
                    </p>
                    <ul className="space-y-1 text-sm">
                      {clubsInLocation.map((club) => (
                        <li key={club.id} className="text-muted-foreground hover:text-primary transition">
                          • {club.name}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-secondary mb-8">Postani Član</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <h3 className="font-bold text-lg text-secondary mb-2">Pronađi Klub</h3>
                <p className="text-muted-foreground">
                  Pretraži klubove po mjestu i pronađi onaj koji ti je najbliži.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <h3 className="font-bold text-lg text-secondary mb-2">Kontaktiraj Klub</h3>
                <p className="text-muted-foreground">
                  Pozovi ili pošalji e-mail klubu i dogovori probni trening.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <h3 className="font-bold text-lg text-secondary mb-2">Počni s Treningom</h3>
                <p className="text-muted-foreground">
                  Prijavite se kao član i počnite s redovitim treningom.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
