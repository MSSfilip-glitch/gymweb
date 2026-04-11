import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Card, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import DOMPurify from "dompurify";
import { SEO } from "@/components/SEO";
import "react-quill/dist/quill.snow.css";

/**
 * GSZZ News Page
 * Design: Dynamic Athletic Energy
 * - News list with filtering by category
 * - Search functionality
 * - Archive view
 */

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState<any>(null);

  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};

  const newsQuery = trpc.news.list.useQuery();
  const allNews = newsQuery.data ?? [];

  // Dynamically extract unique categories from backend data
  const categories = Array.from(new Set(allNews.map(n => n.category)));

  const filteredNews = allNews.filter((news) => {
    const matchesCategory = !selectedCategory || news.category === selectedCategory;
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Vijesti"
        description="Najnovije vijesti iz Gimnastičkog saveza Zagrebačke županije — rezultati natjecanja, edukacije, obavijesti i pozivi."
        keywords="gimnastika vijesti, GSZZ novosti, natjecanja rezultati, gimnastički savez"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-blue-900 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">{settings.newsPageTitle || "Vijesti i Obavijesti"}</h1>
          <p className="text-white/80 text-lg">
            {settings.newsPageSubtitle || "Pratite sve novosti iz svijeta gimnastike u Zagrebačkoj županiji"}
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="bg-slate-50 py-8 border-b border-border">
        <div className="container">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Pretraži vijesti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-primary hover:bg-primary/90" : ""}
              >
                Sve
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
              Prikazano {filteredNews.length} od {allNews.length} vijesti
            </p>
          </div>
        </div>
      </section>

      {/* News List */}
      <section className="py-12">
        <div className="container">
          {newsQuery.isLoading && <p className="text-center py-12 text-muted-foreground">Učitavanje vijesti...</p>}
          {!newsQuery.isLoading && filteredNews.length > 0 ? (
            <div className="space-y-6">
              {filteredNews.map((news) => (
                <Card
                  key={news.id}
                  className="border-border hover:shadow-lg hover:border-primary transition-all cursor-pointer group"
                  onClick={() => setSelectedNews(news)}
                >
                  <div className="flex flex-col sm:flex-row h-full">
                    {news.imageUrl && (
                        <div className="sm:w-1/3 h-48 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
                            <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                          {news.category}
                        </span>
                        <span className="text-xs text-muted-foreground">{news.createdAt}</span>
                      </div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors mb-4">
                        {news.title}
                      </CardTitle>
                      <p className="text-muted-foreground leading-relaxed flex-1 line-clamp-3">{news.excerpt}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">Nema vijesti koje odgovaraju vašoj pretrazi.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
              >
                Očisti filtere
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Article Modal Overlay */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNews(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-8 overflow-y-auto w-full custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-2 leading-tight">{selectedNews.title}</h2>
                  <p className="text-muted-foreground font-medium">{selectedNews.createdAt} • <span className="text-primary">{selectedNews.category}</span></p>
                </div>
                <button onClick={() => setSelectedNews(null)} className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full p-2 transition">✕</button>
              </div>
              {selectedNews.imageUrl && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-sm aspect-video bg-gray-100">
                  <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="ql-editor p-0 max-w-none text-slate-800 text-lg leading-relaxed font-serif" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedNews.content || `<p>${selectedNews.excerpt}</p>`) }} />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <Button onClick={() => setSelectedNews(null)}>Zatvori</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
