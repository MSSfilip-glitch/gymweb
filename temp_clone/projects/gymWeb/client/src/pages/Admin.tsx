import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Edit, Newspaper, CalendarDays, Users, Trophy, LogIn, LogOut, Shield, Settings2, Image as ImageIcon } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cmsConfig, getDefaultSettings } from "@/lib/cmsConfig";
import { formatDate } from "@/lib/utils";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "sonner";

/**
 * GSZZ Admin Panel - connected to tRPC backend
 * Manages News, Events, Clubs, Results with persistent SQLite storage
 */

type Tab = "news" | "events" | "clubs" | "results" | "gallery" | "settings";

interface AdminUser {
  id: number;
  username: string;
  name: string | null;
  role: string;
}

export default function Admin() {
const ImageUploadPicker = ({ value, onChange, label = "Slika" }: { value: string, onChange: (url: string) => void, label?: string }) => {
  return (
    <div className="flex flex-col gap-1 w-full mt-2 mb-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input className="w-full border rounded-lg px-3 py-2 bg-gray-50 flex-1" placeholder="URL slike" value={value} onChange={e => onChange(e.target.value)} />
        <Button
          type="button"
          variant="outline"
          className="relative overflow-hidden cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 mr-2" /> 
          Učitaj s računala
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={async (e) => {
               const file = e.target.files?.[0];
               if (!file) return;
               const formData = new FormData();
               formData.append("files", file);
               toast.loading("Učitavanje slike...", { id: "upload" });
               try {
                 const res = await fetch("/api/upload", { method: "POST", body: formData });
                 const data = await res.json();
                 if (data.urls && data.urls.length > 0) {
                     onChange(data.urls[0]);
                     toast.success("Slika uspješno učitana", { id: "upload" });
                 }
               } catch (err) {
                 toast.error("Greška pri učitavanju slike", { id: "upload" });
               }
            }}
          />
        </Button>
      </div>
      {value && (
         <div className="mt-2 w-32 h-20 rounded-md border bg-slate-100 overflow-hidden flex items-center justify-center">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
         </div>
      )}
    </div>
  );
};

  const [activeTab, setActiveTab] = useState<Tab>("news");
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>("global");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // News form state
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: "", excerpt: "", content: "", category: "Obavijest", imageUrl: "" });

  // Events form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({ title: "", eventDate: "", location: "", type: "Natjecanje", imageUrl: "" });

  // Clubs form state
  const [showClubForm, setShowClubForm] = useState(false);
  const [clubForm, setClubForm] = useState({ name: "", city: "", email: "", imageUrl: "" });

  // Results form state
  const [showResultForm, setShowResultForm] = useState(false);
  const [resultForm, setResultForm] = useState({ title: "", eventDate: "", location: "", content: "", pdfUrl: "", imageUrl: "" });

  // Gallery Album form state
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ title: "", description: "", eventDate: "" });
  
  // Gallery upload temp state
  const [albumImagesToUpload, setAlbumImagesToUpload] = useState<File[]>([]);

  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [editingClubId, setEditingClubId] = useState<number | null>(null);
  const [editingResultId, setEditingResultId] = useState<number | null>(null);
  const [editingGalleryId, setEditingGalleryId] = useState<number | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>(getDefaultSettings());

  // tRPC queries
  const newsQuery = trpc.news.list.useQuery(undefined, { enabled: !!user });
  const eventsQuery = trpc.events.list.useQuery(undefined, { enabled: !!user });
  const clubsQuery = trpc.clubs.list.useQuery(undefined, { enabled: !!user });
  const resultsQuery = trpc.results.list.useQuery(undefined, { enabled: !!user });
  const galleryQuery = trpc.gallery.list.useQuery(undefined, { enabled: !!user });
  const settingsQuery = trpc.settings.getAll.useQuery(undefined, {
    enabled: !!user,
    onSuccess: (data: Record<string, string>) => {
      // Merge existing DB settings with defaults
      if (Object.keys(data).length > 0) {
        setSettingsForm(prev => ({ ...prev, ...data }));
      }
    }
  });

  // tRPC mutations
  const loginMutation = trpc.auth.login.useMutation();
  const createNewsMutation = trpc.news.create.useMutation();
  const deleteNewsMutation = trpc.news.delete.useMutation();
  const createEventMutation = trpc.events.create.useMutation();
  const deleteEventMutation = trpc.events.delete.useMutation();
  const createClubMutation = trpc.clubs.create.useMutation();
  const deleteClubMutation = trpc.clubs.delete.useMutation();
  const createResultMutation = trpc.results.create.useMutation();
  const deleteResultMutation = trpc.results.delete.useMutation();
  const createGalleryMutation = trpc.gallery.create.useMutation();
  const deleteGalleryMutation = trpc.gallery.delete.useMutation();
  const updateSettingsMutation = trpc.settings.updateMany.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();

  const updateNewsMutation = trpc.news.update.useMutation();
  const updateEventMutation = trpc.events.update.useMutation();
  const updateClubMutation = trpc.clubs.update.useMutation();
  const updateResultMutation = trpc.results.update.useMutation();
  const updateGalleryMutation = trpc.gallery.update.useMutation();
  const addGalleryImagesMutation = trpc.gallery.addImages.useMutation();
  const removeGalleryImageMutation = trpc.gallery.removeImage.useMutation();

  // Check for saved session
  useEffect(() => {
    const saved = localStorage.getItem("gszz-admin");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, []);



  const handleLogin = () => {
    setLoginError("");
    loginMutation.mutate(loginForm, {
      onSuccess: (data: any) => {
        setUser(data as AdminUser);
        localStorage.setItem("gszz-admin", JSON.stringify(data));
        setLoginForm({ username: "", password: "" });
      },
      onError: (err: any) => {
        setLoginError(err.message || "Pogreška pri prijavi");
      },
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        setUser(null);
        localStorage.removeItem("gszz-admin");
      }
    });
  };

  // CRUD handlers
  const handleAddNews = () => {
    if (!newsForm.title || !newsForm.excerpt) return;
    const action = editingNewsId ? updateNewsMutation : createNewsMutation;
    action.mutate({ ...(editingNewsId ? { id: editingNewsId } : {}), ...newsForm } as any, {
      onSuccess: () => {
        newsQuery.refetch();
        setNewsForm({ title: "", excerpt: "", content: "", category: "Obavijest", imageUrl: "" });
        setShowNewsForm(false);
        setEditingNewsId(null);
        toast.success(editingNewsId ? "Vijest je uspješno ažurirana!" : "Vijest je uspješno kreirana!");
      },
      onError: () => toast.error("Došlo je do greške pri radu s vijesti.")
    });
  };

  const handleDeleteNews = (id: number) => {
    deleteNewsMutation.mutate(id, { onSuccess: () => newsQuery.refetch() });
  };

  const handleAddEvent = () => {
    if (!eventForm.title || !eventForm.eventDate) return;
    const action = editingEventId ? updateEventMutation : createEventMutation;
    action.mutate({ ...(editingEventId ? { id: editingEventId } : {}), ...eventForm } as any, {
      onSuccess: () => {
        eventsQuery.refetch();
        setEventForm({ title: "", eventDate: "", location: "", type: "Natjecanje", imageUrl: "" });
        setShowEventForm(false);
        setEditingEventId(null);
      },
    });
  };

  const handleDeleteEvent = (id: number) => {
    deleteEventMutation.mutate(id, { onSuccess: () => eventsQuery.refetch() });
  };

  const handleAddClub = () => {
    if (!clubForm.name || !clubForm.city) return;
    const action = editingClubId ? updateClubMutation : createClubMutation;
    action.mutate({ ...(editingClubId ? { id: editingClubId } : {}), ...clubForm } as any, {
      onSuccess: () => {
        clubsQuery.refetch();
        setClubForm({ name: "", city: "", email: "", imageUrl: "" });
        setShowClubForm(false);
        setEditingClubId(null);
      },
    });
  };

  const handleDeleteClub = (id: number) => {
    deleteClubMutation.mutate(id, { onSuccess: () => clubsQuery.refetch() });
  };

  const handleAddResult = () => {
    if (!resultForm.title || !resultForm.eventDate) return;
    const action = editingResultId ? updateResultMutation : createResultMutation;
    action.mutate({ ...(editingResultId ? { id: editingResultId } : {}), ...resultForm } as any, {
      onSuccess: () => {
        resultsQuery.refetch();
        setResultForm({ title: "", eventDate: "", location: "", content: "", pdfUrl: "", imageUrl: "" });
        setShowResultForm(false);
        setEditingResultId(null);
      },
    });
  };

  const handleDeleteResult = (id: number) => {
    deleteResultMutation.mutate(id, { onSuccess: () => resultsQuery.refetch() });
  };

  const handleAddGallery = () => {
    if (!galleryForm.title || !galleryForm.eventDate) return;
    const action = editingGalleryId ? updateGalleryMutation : createGalleryMutation;
    action.mutate({ ...(editingGalleryId ? { id: editingGalleryId } : {}), ...galleryForm } as any, {
      onSuccess: (data: any) => {
        // If we have images to upload and it's a new album (or we just allow adding images to existing)
        const albumId = editingGalleryId || data.id;
        
        if (albumImagesToUpload.length > 0 && albumId) {
            const formData = new FormData();
            albumImagesToUpload.forEach(f => formData.append("files", f));
            
            fetch("/api/upload", { method: "POST", body: formData })
              .then(res => res.json())
              .then(uploadData => {
                 if (uploadData.urls && uploadData.urls.length > 0) {
                     addGalleryImagesMutation.mutate({ albumId, images: uploadData.urls }, {
                         onSuccess: () => galleryQuery.refetch()
                     });
                 }
              })
              .catch(() => toast.error("Greška pri učitavanju slika"));
        } else {
            galleryQuery.refetch();
        }
        
        setGalleryForm({ title: "", description: "", eventDate: "" });
        setAlbumImagesToUpload([]);
        setShowGalleryForm(false);
        setEditingGalleryId(null);
      },
    });
  };

  const handleDeleteGallery = (id: number) => {
    deleteGalleryMutation.mutate(id, { onSuccess: () => galleryQuery.refetch() });
  };
  
  const handleRemoveImageFromAlbum = (imageId: number) => {
     removeGalleryImageMutation.mutate(imageId, { onSuccess: () => galleryQuery.refetch() });
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "news", label: "Vijesti", icon: <Newspaper className="w-4 h-4" /> },
    { key: "events", label: "Događanja", icon: <CalendarDays className="w-4 h-4" /> },
    { key: "clubs", label: "Klubovi", icon: <Users className="w-4 h-4" /> },
    { key: "results", label: "Rezultati", icon: <Trophy className="w-4 h-4" /> },
    { key: "gallery", label: "Galerija", icon: <ImageIcon className="w-4 h-4" /> },
    { key: "settings", label: "Postavke", icon: <Settings2 className="w-4 h-4" /> },
  ];

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settingsForm, {
      onSuccess: () => {
        settingsQuery.refetch();
        toast.success("Postavke uspješno spremljene!");
      }
    });
  };

  const handleSettingChange = (key: string, value: string) => {
    setSettingsForm(prev => ({ ...prev, [key]: value }));
  };

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-white flex flex-col overflow-x-hidden pt-12 xl:pt-0">
        <section className="bg-secondary text-white py-12">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10" /> Admin Panel
            </h1>
            <p className="text-white/80">Prijavite se za upravljanje sadržajem</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" /> Prijava
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{loginError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">Korisničko ime</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={loginForm.username}
                    onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                    placeholder="admin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lozinka</label>
                  <input
                    type="password"
                    className="w-full border rounded-lg px-3 py-2"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••"
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <Button onClick={handleLogin} className="w-full" disabled={loginMutation.isLoading}>
                  {loginMutation.isLoading ? "Prijava..." : "Prijavi se"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden pt-0 xl:pt-0">
      {/* Header */}
      <section className="bg-secondary text-white py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
            <p className="text-white/80">Upravljanje sadržajem web stranice GSZZ</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">
              Prijavljeni kao: <strong>{user.name || user.username}</strong>
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="border border-white/30 text-white hover:text-white hover:bg-white/10">
              <LogOut className="w-4 h-4 mr-1" /> Odjava
            </Button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-6 border-b border-border shadow-sm sticky top-16 xl:top-0 z-30 bg-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 custom-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* NEWS TAB */}
          {activeTab === "news" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Vijesti ({newsQuery.data?.length ?? 0})</h2>
                <Button onClick={() => setShowNewsForm(!showNewsForm)}>
                  <Plus className="w-4 h-4 mr-1" /> Dodaj vijest
                </Button>
              </div>

              {showNewsForm && (
                <Card className="mb-4">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Naslov (Obavezno)</label>
                      <input className="w-full border rounded-lg px-3 py-2" value={newsForm.title} onChange={e => setNewsForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Kratki sažetak (Obavezno)</label>
                      <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={newsForm.excerpt} onChange={e => setNewsForm(p => ({ ...p, excerpt: e.target.value }))} />
                    </div>
                    
                    <ImageUploadPicker value={newsForm.imageUrl} onChange={val => setNewsForm(p => ({ ...p, imageUrl: val }))} label="Glavna slika vijesti" />
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Cijeli tekst članka</label>
                      <div className="bg-white rounded-lg">
                        <ReactQuill theme="snow" value={newsForm.content} onChange={val => setNewsForm(p => ({ ...p, content: val }))} placeholder="Cijeli tekst članka..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Kategorija</label>
                      <select className="w-full border rounded-lg px-3 py-2" value={newsForm.category} onChange={e => setNewsForm(p => ({ ...p, category: e.target.value }))}>
                        <option value="Obavijest">Obavijest</option>
                        <option value="Rezultati">Rezultati</option>
                        <option value="Edukacija">Edukacija</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddNews} disabled={createNewsMutation.isLoading}>Spremi</Button>
                      <Button variant="outline" onClick={() => setShowNewsForm(false)}>Odustani</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {newsQuery.isLoading && <p className="text-muted-foreground">Učitavanje...</p>}
              {newsQuery.data?.map((item: any) => (
                <Card key={item.id} className="mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mt-1 inline-block">{item.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-blue-600" onClick={() => {
                          setEditingNewsId(item.id);
                          setNewsForm({ title: item.title, excerpt: item.excerpt, content: item.content || "", category: item.category, imageUrl: item.imageUrl || "" });
                          setShowNewsForm(true);
                      }}><Edit className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-red-600" onClick={() => handleDeleteNews(item.id)}><Trash className="w-4 h-4" /></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {newsQuery.data?.length === 0 && <p className="text-muted-foreground">Nema vijesti. Dodajte prvu!</p>}
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === "events" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Događanja ({eventsQuery.data?.length ?? 0})</h2>
                <Button onClick={() => setShowEventForm(!showEventForm)}>
                  <Plus className="w-4 h-4 mr-1" /> Dodaj događaj
                </Button>
              </div>

              {showEventForm && (
                <Card className="mb-4">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Naslov događaja</label>
                      <input className="w-full border rounded-lg px-3 py-2" value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Datum</label>
                        <input type="date" className="w-full border rounded-lg px-3 py-2" value={eventForm.eventDate} onChange={e => setEventForm(p => ({ ...p, eventDate: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Lokacija</label>
                        <input className="w-full border rounded-lg px-3 py-2" value={eventForm.location} onChange={e => setEventForm(p => ({ ...p, location: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Vrsta događaja</label>
                      <select className="w-full border rounded-lg px-3 py-2" value={eventForm.type} onChange={e => setEventForm(p => ({ ...p, type: e.target.value }))}>
                        <option value="Natjecanje">Natjecanje</option>
                        <option value="Edukacija">Edukacija</option>
                        <option value="Seminar">Seminar</option>
                      </select>
                    </div>
                    {/* Make sure event image property exists in state. If not, we'll cast or ignore for simple fallback since event supports it in DB. */}
                    <ImageUploadPicker 
                      value={(eventForm as any).imageUrl || ""} 
                      onChange={val => setEventForm(p => ({ ...p, imageUrl: val }))} 
                      label="Naslovna slika događaja" 
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddEvent} disabled={createEventMutation.isLoading}>Spremi</Button>
                      <Button variant="outline" onClick={() => setShowEventForm(false)}>Odustani</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {eventsQuery.isLoading && <p className="text-muted-foreground">Učitavanje...</p>}
              {eventsQuery.data?.map((item: any) => (
                <Card key={item.id} className="mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(item.eventDate)} • {item.location}</p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded mt-1 inline-block">{item.type}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-blue-600" onClick={() => {
                          setEditingEventId(item.id);
                          setEventForm({ title: item.title, eventDate: item.eventDate, location: item.location, type: item.type, imageUrl: item.imageUrl || "" });
                          setShowEventForm(true);
                      }}><Edit className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-red-600" onClick={() => handleDeleteEvent(item.id)}><Trash className="w-4 h-4" /></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {eventsQuery.data?.length === 0 && <p className="text-muted-foreground">Nema događanja. Dodajte prvo!</p>}
            </div>
          )}

          {/* CLUBS TAB */}
          {activeTab === "clubs" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Klubovi ({clubsQuery.data?.length ?? 0})</h2>
                <Button onClick={() => setShowClubForm(!showClubForm)}>
                  <Plus className="w-4 h-4 mr-1" /> Dodaj klub
                </Button>
              </div>

              {showClubForm && (
                <Card className="mb-4">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Naziv kluba</label>
                      <input className="w-full border rounded-lg px-3 py-2" value={clubForm.name} onChange={e => setClubForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Grad</label>
                        <input className="w-full border rounded-lg px-3 py-2" value={clubForm.city} onChange={e => setClubForm(p => ({ ...p, city: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input className="w-full border rounded-lg px-3 py-2" value={clubForm.email} onChange={e => setClubForm(p => ({ ...p, email: e.target.value }))} />
                      </div>
                    </div>
                    <ImageUploadPicker 
                      value={clubForm.imageUrl} 
                      onChange={val => setClubForm(p => ({ ...p, imageUrl: val }))} 
                      label="Logo kluba" 
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleAddClub} disabled={createClubMutation.isLoading}>Spremi</Button>
                      <Button variant="outline" onClick={() => setShowClubForm(false)}>Odustani</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {clubsQuery.isLoading && <p className="text-muted-foreground">Učitavanje...</p>}
              {clubsQuery.data?.map((item: any) => (
                <Card key={item.id} className="mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">{item.city} {item.email ? `• ${item.email}` : ""}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-blue-600" onClick={() => {
                          setEditingClubId(item.id);
                          setClubForm({ name: item.name, city: item.city, email: item.email || "", imageUrl: item.imageUrl || "" });
                          setShowClubForm(true);
                      }}><Edit className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-red-600" onClick={() => handleDeleteClub(item.id)}><Trash className="w-4 h-4" /></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {clubsQuery.data?.length === 0 && <p className="text-muted-foreground">Nema klubova. Dodajte prvi!</p>}
            </div>
          )}

          {/* RESULTS TAB */}
          {activeTab === "results" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Rezultati ({resultsQuery.data?.length ?? 0})</h2>
                <Button onClick={() => setShowResultForm(!showResultForm)}>
                  <Plus className="w-4 h-4 mr-1" /> Dodaj rezultat
                </Button>
              </div>

              {showResultForm && (
                <Card className="mb-4">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Naziv natjecanja</label>
                      <input className="w-full border rounded-lg px-3 py-2" value={resultForm.title} onChange={e => setResultForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Datum</label>
                        <input type="date" className="w-full border rounded-lg px-3 py-2" value={resultForm.eventDate} onChange={e => setResultForm(p => ({ ...p, eventDate: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Lokacija</label>
                        <input className="w-full border rounded-lg px-3 py-2" value={resultForm.location} onChange={e => setResultForm(p => ({ ...p, location: e.target.value }))} />
                      </div>
                    </div>
                    <ImageUploadPicker 
                      value={resultForm.imageUrl} 
                      onChange={val => setResultForm(p => ({ ...p, imageUrl: val }))} 
                      label="Istaknuta slika rezultata" 
                    />
                    <div>
                      <label className="block text-sm font-medium mb-1">Rezultati (poredak ili opis)</label>
                      <div className="bg-white rounded-lg">
                        <ReactQuill theme="snow" value={resultForm.content} onChange={val => setResultForm(p => ({ ...p, content: val }))} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddResult} disabled={createResultMutation.isLoading}>Spremi</Button>
                      <Button variant="outline" onClick={() => setShowResultForm(false)}>Odustani</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {resultsQuery.isLoading && <p className="text-muted-foreground">Učitavanje...</p>}
              {resultsQuery.data?.map((item: any) => (
                <Card key={item.id} className="mb-3">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(item.eventDate)} • {item.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-blue-600" onClick={() => {
                          setEditingResultId(item.id);
                          setResultForm({ title: item.title, eventDate: item.eventDate, location: item.location, content: item.content || "", pdfUrl: item.pdfUrl || "", imageUrl: item.imageUrl || "" });
                          setShowResultForm(true);
                      }}><Edit className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-red-600" onClick={() => handleDeleteResult(item.id)}><Trash className="w-4 h-4" /></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {resultsQuery.data?.length === 0 && <p className="text-muted-foreground">Nema rezultata. Dodajte prvi!</p>}
            </div>
          )}

          {/* GALLERY ALBUMS TAB */}
          {activeTab === "gallery" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Galerija Albuma ({galleryQuery.data?.length ?? 0})</h2>
                <Button onClick={() => {
                   setShowGalleryForm(!showGalleryForm);
                   setAlbumImagesToUpload([]);
                   setGalleryForm({ title: "", description: "", eventDate: "" });
                }}>
                  <Plus className="w-4 h-4 mr-1" /> Dodaj album
                </Button>
              </div>

              {showGalleryForm && (
                <Card className="mb-4">
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Naziv albuma (Obavezno)</label>
                      <input className="w-full border rounded-lg px-3 py-2" value={galleryForm.title} onChange={e => setGalleryForm(p => ({ ...p, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Opis (opcionalno)</label>
                      <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={galleryForm.description} onChange={e => setGalleryForm(p => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Datum događaja (Obavezno)</label>
                      <input type="date" className="w-full border rounded-lg px-3 py-2" value={galleryForm.eventDate} onChange={e => setGalleryForm(p => ({ ...p, eventDate: e.target.value }))} />
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border">
                       <label className="block text-sm font-medium mb-2">Učitaj Slike u Album</label>
                       
                       {/* If editing existing album, we can use the backend upload. If creating new, we use the local state `albumImagesToUpload`. */}
                       {(() => {
                           const MAX_PHOTOS = 30;
                           const existingPhotosCount = editingGalleryId ? (galleryQuery.data?.find((a: any) => a.id === editingGalleryId)?.images?.length || 0) : albumImagesToUpload.length;
                           const availableSlots = Math.max(0, MAX_PHOTOS - existingPhotosCount);
                           const isLimitReached = availableSlots === 0;

                           return (
                             <div className="flex flex-col gap-3">
                               <Button
                                 type="button"
                                 variant="outline"
                                 disabled={isLimitReached}
                                 className={`relative overflow-hidden w-fit ${isLimitReached ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                               >
                                 <Plus className="w-4 h-4 mr-2" /> 
                                 {isLimitReached ? "Dosegnut limit fotografija (30)" : "Dodaj fotografije sa računala"}
                                 <input 
                                   type="file" 
                                   accept="image/*"
                                   multiple
                                   disabled={isLimitReached}
                                   className={`absolute inset-0 opacity-0 w-full h-full ${isLimitReached ? 'hidden' : 'cursor-pointer'}`}
                                   onChange={(e) => {
                                      const files = Array.from(e.target.files || []);
                                      if (files.length === 0) return;
                                      
                                      let filesToUpload = files;
                                      if (files.length > availableSlots) {
                                          toast.warning(`Maksimalan broj je ${MAX_PHOTOS}. Dodajemo prvih ${availableSlots} slika.`);
                                          filesToUpload = files.slice(0, availableSlots);
                                      }
                                      
                                      if (editingGalleryId) {
                                          toast.loading("Učitavanje slika...", { id: "upload-bulk" });
                                          const formData = new FormData();
                                          filesToUpload.forEach(f => formData.append("files", f));
                                          
                                          fetch("/api/upload", { method: "POST", body: formData })
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.urls && data.urls.length > 0) {
                                                    addGalleryImagesMutation.mutateAsync({ albumId: editingGalleryId, images: data.urls })
                                                      .then(() => {
                                                          toast.success(`Učitano ${data.urls.length} slika`, { id: "upload-bulk" });
                                                          galleryQuery.refetch();
                                                      });
                                                }
                                            })
                                            .catch(() => toast.error("Greška pri učitavanju", { id: "upload-bulk" }));
                                      } else {
                                          setAlbumImagesToUpload(prev => [...prev, ...filesToUpload]);
                                      }
                                      e.target.value = ''; // allow same selection again
                                   }}
                                 />
                               </Button>
                               
                               {/* Preview local stashed images for NEW albums */}
                           {!editingGalleryId && albumImagesToUpload.length > 0 && (
                               <div className="text-sm text-green-600 font-medium">
                                  ✓ Odabrano {albumImagesToUpload.length} novih slika. Slike će se učitati nakon pritiska na Preuzmi / Spremi.
                               </div>
                           )}

                           {/* Show existing images from database if EDITING */}
                           {editingGalleryId && (
                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                                  {galleryQuery.data?.find((a: any) => a.id === editingGalleryId)?.images.map((img: any) => (
                                     <div key={img.id} className="relative group aspect-square rounded-md border bg-slate-200 overflow-hidden">
                                        <img src={img.imageUrl} className="w-full h-full object-cover" />
                                        <button 
                                          type="button"
                                          onClick={() => handleRemoveImageFromAlbum(img.id)}
                                          className="absolute top-1 right-1 bg-white/80 p-1 text-red-600 rounded hover:bg-white"
                                        >
                                          <Trash className="w-3 h-3" />
                                        </button>
                                     </div>
                                  ))}
                               </div>
                           )}
                        </div>
                       );
                       })()}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={handleAddGallery} disabled={createGalleryMutation.isLoading || updateGalleryMutation.isLoading}>
                          {editingGalleryId ? "Spremi promjene" : "Spremi album i slike"}
                      </Button>
                      <Button variant="outline" onClick={() => {
                          setShowGalleryForm(false);
                          setAlbumImagesToUpload([]);
                      }}>Zatvori</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {galleryQuery.isLoading && <p className="text-muted-foreground">Učitavanje...</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryQuery.data?.map((item: any) => (
                <Card key={item.id} className="mb-3">
                  <div className="aspect-video w-full bg-slate-100 flex items-center justify-center overflow-hidden rounded-t-lg border-b">
                    {item.images && item.images.length > 0 ? (
                        <img src={item.images[0].imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-slate-400 text-sm">Nema slika</span>
                    )}
                  </div>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{formatDate(item.eventDate)}</p>
                      <p className="text-xs text-blue-600 mt-1 font-medium">{item.images?.length || 0} fotografija</p>
                    </div>
                    <div className="flex gap-2 flex-col">
                      <button className="text-gray-400 hover:text-blue-600 shadow-sm p-1.5 bg-gray-50 border rounded" onClick={() => {
                          setEditingGalleryId(item.id);
                          setGalleryForm({ title: item.title, description: item.description || "", eventDate: item.eventDate });
                          setAlbumImagesToUpload([]);
                          setShowGalleryForm(true);
                      }}><Edit className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-red-600 shadow-sm p-1.5 bg-gray-50 border rounded" onClick={() => handleDeleteGallery(item.id)}><Trash className="w-4 h-4" /></button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
              {galleryQuery.data?.length === 0 && <p className="text-muted-foreground">Nema albuma. Dodajte prvi!</p>}
            </div>
          )}

          {/* SETTINGS (CMS) TAB */}
          {activeTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Postavke Stranice (CMS)</h2>
                <p className="text-muted-foreground text-sm mt-1 mb-4">
                  Izmijenite glavni tekst na stranici, naslove i kontakt podatke. Izmjene se trenutačno primjenjuju.
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar border-b border-gray-200">
                {cmsConfig.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveSettingsTab(category.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeSettingsTab === category.id
                      ? "bg-secondary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {cmsConfig.find(c => c.id === activeSettingsTab)?.sections.map((section) => (
                <Card key={section.id} className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    {section.description && <p className="text-sm text-muted-foreground">{section.description}</p>}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium mb-1">{field.label}</label>
                        {field.type === "textarea" ? (
                          <textarea
                            className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white transition-colors resize-y"
                            rows={4}
                            value={settingsForm[field.key] ?? field.defaultValue}
                            onChange={(e) => handleSettingChange(field.key, e.target.value)}
                          />
                        ) : (
                          <input
                            type="text"
                            className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white transition-colors"
                            value={settingsForm[field.key] ?? field.defaultValue}
                            onChange={(e) => handleSettingChange(field.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

              <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border">
                <Button size="lg" onClick={handleSaveSettings} disabled={updateSettingsMutation.isLoading}>
                  {updateSettingsMutation.isLoading ? "Spremanje..." : "Spremi Sve Postavke"}
                </Button>
                {updateSettingsMutation.isSuccess && (
                  <span className="text-sm text-green-600 font-medium">✓ Postavke ažurirane!</span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* DB Status */}
      <section className="py-4">
        <div className="container">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <p className="text-green-800 text-sm">
                ✓ Spojen na SQLite bazu podataka. Svi podaci se trajno spremaju.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
