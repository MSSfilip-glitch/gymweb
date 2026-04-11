import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calendar, Newspaper, Users, Trophy } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { getDefaultSettings } from "@/lib/cmsConfig";
import { useState, useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { SEO } from "@/components/SEO";
import { formatDate } from "@/lib/utils";
import "react-quill/dist/quill.snow.css";

function AnimatedStat({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const match = typeof value === 'string' ? value.match(/^(\D*)(\d+)(\D*)$/) : null;
  const prefix = match ? match[1] : "";
  const endNum = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : value;
  const isNumeric = match !== null;

  useEffect(() => {
    if (hasAnimated || !isNumeric) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasAnimated(true);
        let startTimestamp: number | null = null;
        const duration = 2000;
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setCount(Math.floor(progress * endNum));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [endNum, hasAnimated, isNumeric]);

  if (!isNumeric) return <div>{value}</div>;
  return <div ref={ref}>{prefix}{hasAnimated ? count : 0}{suffix}</div>;
}

/**
 * GSZZ Home Page
 * Fully integrated with CMS text settings
 */

export default function Home() {
  // Fetch real data from the database
  const newsQuery = trpc.news.list.useQuery();
  const eventsQuery = trpc.events.list.useQuery();

  // Sort by createdAt descending, show latest 3
  const latestNews = (newsQuery.data ?? [])
    .slice()
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .slice(0, 3);

  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Sort by eventDate ascending (upcoming first), show next 3
  const upcomingEvents = (eventsQuery.data ?? [])
    .slice()
    .sort((a, b) => (new Date(a.eventDate) > new Date(b.eventDate) ? 1 : -1))
    .slice(0, 3);

  const settingsQuery = trpc.settings.getAll.useQuery();
  // Merge loaded settings over the default keys to ensure nothing is ever empty
  const s = { ...getDefaultSettings(), ...(settingsQuery.data || {}) };

  // Parse CTA subtitle to include clickable links
  const parsedCTASubtitle = s.homeCTASubtitle.split(/({\w+})/).map((part, i) => {
    if (part === "{email}") return <a key={i} href={`mailto:${s.contactEmail}`} className="underline hover:text-white/80 transition">{s.contactEmail}</a>;
    if (part === "{phone}") return <a key={i} href={`tel:${s.contactPhone.replace(/[\s-]/g, "")}`} className="underline hover:text-white/80 transition">{s.contactPhone}</a>;
    return part;
  });

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Početna"
        description="Gimnastički savez Zagrebačke županije — vijesti, natjecanja, kalendar događanja, klubovi i rezultati iz sportske i ritmičke gimnastike."
        keywords="gimnastika, Zagrebačka županija, GSZZ, sportska gimnastika, natjecanja, klubovi"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-blue-600 to-secondary py-20 md:py-32">
        {/* Grb Zagrebačke županije */}
        <div className="absolute top-8 right-8 opacity-90 pointer-events-none hidden md:block">
          <img src="/grb.png" alt="Grb Zagrebačke županije" className="w-32 h-32 object-contain drop-shadow-lg" />
        </div>
        <div className="absolute top-4 right-4 opacity-90 pointer-events-none md:hidden z-20">
          <img src="/grb.png" alt="Grb Zagrebačke županije" className="w-16 h-16 object-contain drop-shadow-lg" />
        </div>
        
        {/* Diagonal accent */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute -right-10 -top-10 w-96 h-96 text-primary opacity-10" viewBox="0 0 200 200" fill="currentColor">
            <polygon points="0,0 200,0 200,200 0,200" />
          </svg>
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Text Content */}
              <div className="flex-1 text-center md:text-left animate-in slide-in-from-bottom-6 duration-700 delay-300">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                  {s.heroTitle}
                </h1>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto md:mx-0 drop-shadow-md whitespace-pre-line">
                  {s.heroSubtitle}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/kalendar" className="inline-block">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                    {s.homeHeroBtn1}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/kontakt" className="inline-block">
                  <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10 w-full sm:w-auto">
                    {s.homeHeroBtn2}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Video / Image */}
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl group lg:mt-24">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover absolute inset-0"
              >
                <source src="/hero.mp4" type="video/mp4" />
                {/* Fallback to poster if video is missing */}
              </video>
              <div className="absolute inset-0 bg-secondary/10 group-hover:bg-transparent transition-colors pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Sponsors Section */}
      <section className="py-16 bg-white border-t border-b border-border">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary mb-12 text-center">{s.homePartnersTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
            {/* Minimal aesthetic SVGs as partner placeholders */}
            {[
              "M2 12A10 10 0 1 0 22 12A10 10 0 1 0 2 12Z", 
              "M12 2L2 22L22 22L12 2Z", 
              "M2 2H22V22H2V2Z",
              "M12 2L22 12L12 22L2 12L12 2Z"
            ].map((path, index) => (
              <div key={index} className="flex items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-lg hover:shadow-md transition">
                <svg className="w-12 h-12 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d={path} />
                </svg>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-8 text-sm">
            {s.homePartnersContactPrefix} <Link href="/kontakt" className="text-primary hover:underline font-semibold">{s.homePartnersContactLink}</Link>
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2"><AnimatedStat value={s.homeStats1Num} /></div>
              <p className="text-white/80">{s.homeStats1Text}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2"><AnimatedStat value={s.homeStats2Num} /></div>
              <p className="text-white/80">{s.homeStats2Text}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2"><AnimatedStat value={s.homeStats3Num} /></div>
              <p className="text-white/80">{s.homeStats3Text}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2"><AnimatedStat value={s.homeStats4Num} /></div>
              <p className="text-white/80">{s.homeStats4Text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-secondary mb-2">{s.homeNewsTitle}</h2>
              <p className="text-muted-foreground">{s.homeNewsSubtitle}</p>
            </div>
            <Link href="/vijesti">
              <Button variant="outline" className="hidden sm:flex">
                {s.homeNewsBtn}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {newsQuery.isLoading && <p className="text-muted-foreground col-span-3">Učitavanje vijesti...</p>}
            {!newsQuery.isLoading && latestNews.length === 0 && <p className="text-muted-foreground col-span-3">Nema vijesti za prikazati.</p>}
            {latestNews.map((news) => (
              <Card key={news.id} className="hover:shadow-lg transition-shadow border-border cursor-pointer group" onClick={() => setSelectedNews(news)}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {news.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{news.createdAt}</span>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{news.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/vijesti">
              <Button className="w-full" variant="outline">
                {s.homeNewsBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-secondary mb-2">{s.homeEventsTitle}</h2>
              <p className="text-muted-foreground">{s.homeEventsSubtitle}</p>
            </div>
            <Link href="/kalendar">
              <Button variant="outline" className="hidden sm:flex">
                {s.homeEventsBtn}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {eventsQuery.isLoading && <p className="text-muted-foreground">Učitavanje događanja...</p>}
            {!eventsQuery.isLoading && upcomingEvents.length === 0 && <p className="text-muted-foreground">Nema nadolazećih događanja.</p>}
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="border-border hover:border-primary transition-colors cursor-pointer group" onClick={() => setSelectedEvent(event)}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                          <Calendar className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-secondary mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">{formatDate(event.eventDate)}</span> • {event.location}
                        </p>
                        <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-2 py-1 rounded">
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/kalendar">
              <Button className="w-full" variant="outline">
                {s.homeEventsBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-secondary mb-12 text-center">{s.homeFeaturesTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{s.feature1Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{s.feature1Text}</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{s.feature2Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{s.feature2Text}</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Newspaper className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{s.feature3Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{s.feature3Text}</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{s.feature4Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{s.feature4Text}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white border-b border-white/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">{s.homeCTATitle}</h2>
            <p className="text-lg text-white/90 mb-8 whitespace-pre-line">
              {parsedCTASubtitle}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/klubovi">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                {s.homeCTABtn1}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/o-nama">
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10 w-full sm:w-auto">
                {s.homeCTABtn2}
              </Button>
            </Link>
          </div>
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

      {/* Event Modal Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-8 overflow-y-auto w-full custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-secondary mb-2">{selectedEvent.title}</h2>
                  <div className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {selectedEvent.type}
                  </div>
                </div>
                <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full p-2 transition">✕</button>
              </div>
              
              <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3 text-secondary">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">{formatDate(selectedEvent.eventDate)}</p>
                    {selectedEvent.eventTime && <p className="text-sm text-muted-foreground">{selectedEvent.eventTime}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <div className="w-5 h-5 flex items-center justify-center text-primary">📍</div>
                  <p className="font-semibold">{selectedEvent.location}</p>
                </div>
              </div>
              
              <div className="text-slate-700 leading-relaxed">
                <p>{selectedEvent.description}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                const dateObj = new Date(selectedEvent.eventDate);
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                
                const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GSZZ//HR\nBEGIN:VEVENT\nDTSTART:${year}${month}${day}T100000\nDTEND:${year}${month}${day}T120000\nSUMMARY:${selectedEvent.title}\nLOCATION:${selectedEvent.location}\nDESCRIPTION:${(selectedEvent.description || '').replace(/\\n/g, '\\n')}\nEND:VEVENT\nEND:VCALENDAR`;

                const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${selectedEvent.title.replace(/\\s+/g, '_')}.ics`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}>Dodaj u Kalendar</Button>
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>Zatvori</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
