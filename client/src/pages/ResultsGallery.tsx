import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Download, Image as ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/SEO";
import { formatDate } from "@/lib/utils";
import DOMPurify from "dompurify";
import "react-quill/dist/quill.snow.css";

export default function ResultsGallery() {
  const [activeTab, setActiveTab] = useState<"results" | "gallery">("results");
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Keybindings for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;
      if (e.key === "Escape") setSelectedAlbum(null);
      if (e.key === "ArrowRight") setCurrentImageIndex(prev => (prev + 1) % selectedAlbum.images.length);
      if (e.key === "ArrowLeft") setCurrentImageIndex(prev => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAlbum]);

  const resultsQuery = trpc.results.list.useQuery();
  const galleryQuery = trpc.gallery.list.useQuery();
  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Rezultati i Galerija"
        description="Pregledajte rezultate natjecanja i fotografije iz arhive Gimnastičkog saveza Zagrebačke županije."
        keywords="gimnastika rezultati, natjecanja rezultati, galerija gimnastika, GSZZ arhiv"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-blue-900 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">{settings.galleryPageTitle || "Rezultati i Galerija"}</h1>
          <p className="text-white/80 text-lg">
            {settings.galleryPageSubtitle || "Pogledaj rezultate natjecanja i fotografije s događanja"}
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-slate-50 border-b border-border">
        <div className="container">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("results")}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === "results"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-secondary"
              }`}
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              Rezultati
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-6 py-4 font-semibold border-b-2 transition ${
                activeTab === "gallery"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-secondary"
              }`}
            >
              <ImageIcon className="w-5 h-5 inline mr-2" />
              Galerija
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          {activeTab === "results" && (
            <div className="space-y-6">
              {resultsQuery.isLoading && <div className="space-y-4"><Skeleton className="h-48 w-full" /><Skeleton className="h-48 w-full" /></div>}
              {resultsQuery.data?.length === 0 && <p className="text-muted-foreground text-center py-8">Trenutno nema objavljenih rezultata.</p>}
              
              {resultsQuery.data?.map((result: any) => (
                <Card key={result.id} className="border-border hover:shadow-lg transition-shadow overflow-hidden group">
                  {result.imageUrl && (
                      <div className="w-full aspect-[21/9] bg-slate-100 overflow-hidden">
                          <img src={result.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={result.title} />
                      </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{result.title}</CardTitle>
                        <p className="text-muted-foreground">
                          {formatDate(result.eventDate)} • {result.location}
                        </p>
                      </div>
                      {result.pdfUrl && (
                        <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                            <Download className="w-4 h-4" />
                            PDF
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-secondary">Detalji i Poredak</h3>
                      <div className="ql-editor p-0 max-w-none text-slate-700 font-sans" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(result.content || "<p class='text-sm text-muted-foreground'>Poredak nije priložen uz ovaj rezultat.</p>") }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "gallery" && (
            <div>
              {galleryQuery.isLoading && (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" /><Skeleton className="h-64 w-full" />
                 </div>
              )}
              {galleryQuery.data?.length === 0 && <p className="text-muted-foreground text-center py-8">Trenutno nema fotografija u galeriji.</p>}
              
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryQuery.data?.map((album: any) => (
                  <Card
                    key={album.id}
                    className="border-border overflow-hidden hover:shadow-lg hover:border-primary transition-all cursor-pointer group flex flex-col"
                    onClick={() => {
                        if (album.images && album.images.length > 0) {
                            setSelectedAlbum(album);
                            setCurrentImageIndex(0);
                        }
                    }}
                  >
                    <div className="relative overflow-hidden bg-slate-100 flex-1 min-h-[240px]">
                      {album.images && album.images.length > 0 ? (
                          <img
                            src={album.images[0].imageUrl}
                            alt={album.title}
                            className="w-full h-full absolute inset-0 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                      ) : (
                          <div className="w-full h-full absolute inset-0 flex items-center justify-center text-slate-400">Nema slika</div>
                      )}
                      {album.images && album.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-1 text-xs rounded-md shadow flex items-center gap-1 backdrop-blur-sm">
                             <ImageIcon className="w-3 h-3" /> {album.images.length}
                          </div>
                      )}
                    </div>
                    <CardContent className="p-4 bg-white z-10 shrink-0">
                      <h3 className="font-semibold text-lg text-secondary mb-1 line-clamp-1">{album.title}</h3>
                      <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{formatDate(album.eventDate)}</p>
                          <p className="text-xs text-blue-600 font-medium">{album.images?.length || 0} slika</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Album Slideshow Modal */}
      {selectedAlbum && selectedAlbum.images && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md">
             <button onClick={() => setSelectedAlbum(null)} className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10 bg-black/40 hover:bg-black/60 rounded-full transition-colors">
                <X className="w-6 h-6" />
             </button>
             
             {/* Slider Navigation */}
             {selectedAlbum.images.length > 1 && (
                 <>
                    <button 
                       onClick={() => setCurrentImageIndex(prev => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length)}
                       className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 bg-black/40 hover:bg-black/80 rounded-full transition-colors z-10"
                    >
                       <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                       onClick={() => setCurrentImageIndex(prev => (prev + 1) % selectedAlbum.images.length)}
                       className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 bg-black/40 hover:bg-black/80 rounded-full transition-colors z-10"
                    >
                       <ChevronRight className="w-8 h-8" />
                    </button>
                 </>
             )}

             {/* Main Image */}
             <div className="w-full h-full flex flex-col pt-12 pb-24 px-16 group relative select-none">
                <img 
                   src={selectedAlbum.images[currentImageIndex].imageUrl} 
                   alt={selectedAlbum.title} 
                   className="w-full h-full object-contain pointer-events-none drop-shadow-2xl" 
                />
             </div>

             {/* Thumbnail Strip & Info */}
             <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
                    <div className="text-white">
                        <h3 className="font-bold text-lg md:text-xl">{selectedAlbum.title}</h3>
                        <p className="text-sm text-gray-300">{formatDate(selectedAlbum.eventDate)} <span className="mx-2">•</span> Fotografija {currentImageIndex + 1} / {selectedAlbum.images.length}</p>
                    </div>
                </div>
             </div>
          </div>
      )}

      <Footer />
    </div>
  );
}
