import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { formatDate } from "@/lib/utils";

/**
 * GSZZ Calendar/Events Page
 * Design: Dynamic Athletic Energy
 * - Event list with filtering by type
 * - Sidebar Calendar view with month navigation
 * - Event details
 */

export default function CalendarPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEventInfo, setSelectedEventInfo] = useState<any>(null);
  
  const today = new Date();
  const [displayMonth, setDisplayMonth] = useState(today.getMonth());
  const [displayYear, setDisplayYear] = useState(today.getFullYear());
  
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const monthNames = ['Siječanj', 'Veljača', 'Ožujak', 'Travanj', 'Svibanj', 'Lipanj', 'Srpanj', 'Kolovoz', 'Rujan', 'Listopad', 'Studeni', 'Prosinac'];
  const monthNamesGenitive = ['siječnja', 'veljače', 'ožujka', 'travnja', 'svibnja', 'lipnja', 'srpnja', 'kolovoza', 'rujna', 'listopada', 'studenog', 'prosinca'];
  const dayNames = ['Po', 'Ut', 'Sr', 'Ce', 'Pe', 'Su', 'Ne'];

  const eventsQuery = trpc.events.list.useQuery();

  const parseHrDate = (dateStr: string) => {
    const parts = dateStr.replace('.', '').split(' ');
    if (parts.length < 3) return new Date();
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);
    const monthIndex = monthNamesGenitive.indexOf(monthStr);
    return new Date(year, monthIndex !== -1 ? monthIndex : 0, day);
  };

  const allEvents = (eventsQuery.data ?? []).map(event => ({
    id: event.id,
    title: event.title,
    date: formatDate(event.eventDate),
    dateObj: new Date(event.eventDate),
    time: event.eventTime || "",
    location: event.location,
    type: event.type,
    imageUrl: event.imageUrl,
    description: event.description || "",
  }));
  
  const daysWithEventsInMonth = new Set<number>();
  allEvents.forEach(event => {
    if (event.dateObj.getMonth() === displayMonth && event.dateObj.getFullYear() === displayYear) {
      daysWithEventsInMonth.add(event.dateObj.getDate());
    }
  });

  const types = ["Natjecanje", "Edukacija"];

  const selectedDateObj = selectedDate ? parseHrDate(selectedDate) : null;

  const filteredEvents = allEvents.filter((event) => {
    const typeMatch = !selectedType || event.type === selectedType;
    if (!selectedDateObj) return typeMatch;
    
    const matches = event.dateObj.getFullYear() === selectedDateObj.getFullYear() &&
                    event.dateObj.getMonth() === selectedDateObj.getMonth() &&
                    event.dateObj.getDate() === selectedDateObj.getDate();
    return typeMatch && matches;
  }).sort((a, b) => (a.dateObj > b.dateObj ? 1 : -1));

  const firstDay = new Date(displayYear, displayMonth, 1).getDay();
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const calendarDays = [];
  
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    calendarDays.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const selectedDateStr = `${day}. ${monthNamesGenitive[displayMonth]} ${displayYear}.`;
    setSelectedDate(selectedDateStr);
  };

  const handleResetFilters = () => {
    setSelectedDate(null);
    setSelectedType(null);
  };

  const handleDownloadIcs = (event: any) => {
    const date = event.dateObj;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//GSZZ//HR\nBEGIN:VEVENT\nDTSTART:${year}${month}${day}T100000\nDTEND:${year}${month}${day}T120000\nSUMMARY:${event.title}\nLOCATION:${event.location}\nDESCRIPTION:${event.description.replace(/\n/g, '\\n')}\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Kalendar Događanja"
        description="Raspored natjecanja, seminara i događanja Gimnastičkog saveza Zagrebačke županije. Dodajte događaje u svoj kalendar."
        keywords="gimnastika kalendar, natjecanja raspored, GSZZ događanja, seminari gimnastika"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-blue-900 text-white py-12">
        <div className="container">
          <h1 className="text-4xl font-bold mb-4">{settings.calendarPageTitle || "Kalendar Događanja"}</h1>
          <p className="text-white/80 text-lg">
            {settings.calendarPageSubtitle || "Pregled nadolazećih natjecanja i događaja"}
          </p>
        </div>
      </section>

      {/* Main Content: Split Layout */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Events Timeline (2/3) */}
            <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-2xl font-bold text-secondary">Nadolazeća Događanja</h2>
              </div>
              
              <div className="space-y-6">
                {eventsQuery.isLoading && <p className="text-muted-foreground w-full py-8 text-center">Učitavanje događanja...</p>}
                {!eventsQuery.isLoading && filteredEvents.map((event) => (
                  <div key={event.id} className="relative">
                    <div className="absolute left-6 top-20 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/20" />
                    <Card className="border-border hover:shadow-lg hover:border-primary transition-all">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="flex-shrink-0">
                            {event.imageUrl ? (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-slate-200">
                                   <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                                  <Calendar className="w-6 h-6 text-primary" />
                                </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                              <div>
                                <h3 className="text-2xl font-bold text-secondary mb-2">{event.title}</h3>
                                <div className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full">{event.type}</div>
                              </div>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">{event.date}</span>
                                <span className="text-sm">({event.time})</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-4">{event.description}</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button className="bg-primary hover:bg-primary/90 text-white" onClick={() => setSelectedEventInfo(event)}>Detalji</Button>
                              <Button variant="outline" onClick={() => handleDownloadIcs(event)}>Dodaj u Kalendar</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {!eventsQuery.isLoading && filteredEvents.length === 0 && (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-border">
                  <p className="text-lg text-muted-foreground mb-4">Nema događanja koja odgovaraju vašem izboru.</p>
                  <Button variant="outline" onClick={handleResetFilters}>Prikaži sva događanja</Button>
                </div>
              )}
            </div>

            {/* Right Column: Mini Calendar & Filters (1/3) */}
            <div className="lg:col-span-1 space-y-8 sticky top-24 order-1 lg:order-2">
              
              {/* Mini Calendar */}
              <div className="bg-slate-50 rounded-lg border border-border p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handlePrevMonth} className="p-1 hover:bg-primary/10 rounded-lg transition"><ChevronLeft className="w-5 h-5 text-primary" /></button>
                  <h3 className="text-lg font-bold text-secondary">{monthNames[displayMonth]} {displayYear}.</h3>
                  <button onClick={handleNextMonth} className="p-1 hover:bg-primary/10 rounded-lg transition"><ChevronRight className="w-5 h-5 text-primary" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-muted-foreground py-1">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="aspect-square" />;
                    const hasEvents = daysWithEventsInMonth.has(day);
                    const isToday = day === currentDay && displayMonth === currentMonth && displayYear === currentYear;
                    const dateStr = `${day}. ${monthNamesGenitive[displayMonth]} ${displayYear}.`;
                    const isSelected = selectedDate ? selectedDate === dateStr : false;
                    
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={`aspect-square rounded text-xs font-semibold flex flex-col items-center justify-center transition-all relative ${
                          isSelected ? 'bg-primary text-white shadow-md scale-105'
                          : isToday ? 'border-2 border-primary text-primary bg-white'
                          : hasEvents ? 'bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20'
                          : 'hover:bg-primary/10 bg-white border border-transparent'
                        }`}
                      >
                        {day}
                        {hasEvents && <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`}></div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filters */}
              <div className="bg-slate-50 rounded-lg border border-border p-4 shadow-sm">
                <h3 className="text-sm font-bold text-secondary mb-3 uppercase tracking-wider">Filtriraj Događanja</h3>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={selectedType === null ? "default" : "outline"}
                    onClick={() => setSelectedType(null)}
                    className={`w-full justify-start ${selectedType === null ? "bg-primary text-white hover:bg-primary/90" : "bg-white"}`}
                  >
                    Sva Događanja
                  </Button>
                  {types.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      onClick={() => setSelectedType(type)}
                      className={`w-full justify-start ${selectedType === type ? "bg-primary text-white hover:bg-primary/90" : "bg-white"}`}
                    >
                      {type}
                    </Button>
                  ))}
                  {(selectedDate || selectedType) && (
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                      className="w-full mt-2 bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                    >
                      Poništi filtere
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Prikazano {filteredEvents.length} od {allEvents.length}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Event Modal Overlay */}
      {selectedEventInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedEventInfo(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-8 overflow-y-auto w-full custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-secondary mb-2">{selectedEventInfo.title}</h2>
                  <div className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    {selectedEventInfo.type}
                  </div>
                </div>
                <button onClick={() => setSelectedEventInfo(null)} className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full p-2 transition">✕</button>
              </div>
              
              {selectedEventInfo.imageUrl && (
                  <div className="w-full aspect-video rounded-xl bg-slate-100 overflow-hidden mb-6">
                      <img src={selectedEventInfo.imageUrl} className="w-full h-full object-cover" alt={selectedEventInfo.title} />
                  </div>
              )}
              
              <div className="space-y-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3 text-secondary">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">{selectedEventInfo.date}</p>
                    {selectedEventInfo.time && <p className="text-sm text-muted-foreground">{selectedEventInfo.time}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-secondary">
                  <div className="w-5 h-5 flex items-center justify-center text-primary">📍</div>
                  <p className="font-semibold">{selectedEventInfo.location}</p>
                </div>
              </div>
              
              <div className="text-slate-700 leading-relaxed">
                <p>{selectedEventInfo.description}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedEventInfo(null)}>Zatvori</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
