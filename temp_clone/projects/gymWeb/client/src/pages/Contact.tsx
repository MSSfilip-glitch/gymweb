import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";

/**
 * GSZZ Contact Page
 * Design: Dynamic Athletic Energy
 * - Contact form
 * - Contact information
 * - Location map placeholder
 */

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const settingsQuery = trpc.settings.getAll.useQuery();
  const settings = settingsQuery.data || {};

  const contactEmail = settings.contactEmail || "info@gszz.hr";
  const contactPhone = settings.contactPhone || "+385 1 1234 5678";
  const contactAddress = settings.contactAddress || "Gimnastički savez Zagrebačke županije\nTrg Krešimira Ćosića 11\n10000 Zagreb, Hrvatska";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white xl:pl-64 flex flex-col overflow-x-hidden">
      <SEO
        title="Kontakt"
        description="Kontaktirajte Gimnastički savez Zagrebačke županije. Adresa, email, telefon i obrazac za upite."
        keywords="kontakt GSZZ, adresa gimnastički savez, email GSZZ, broj telefona"
      />
      <Navigation />

      {/* Header */}
      <section className="bg-secondary text-white py-16">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{settings.contactPageTitle || "Kontakt"}</h1>
          <p className="text-white/80 text-lg max-w-2xl whitespace-pre-line">
            {settings.contactPageSubtitle || "Obratite nam se s bilo kakvim pitanjima ili prijedlozima. Tu smo za vas!"}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">{settings.contactFormTitle || "Pošaljite nam poruku"}</h2>

              {submitSuccess && (
                <Card className="mb-6 bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <p className="text-green-800 font-medium">✓ Hvala na poruci! Odgovorit ćemo vam uskoro.</p>
                  </CardContent>
                </Card>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ime i prezime *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Predmet *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  >
                    <option value="">Odaberite predmet</option>
                    <option value="info">Opće informacije</option>
                    <option value="membership">Članstvo</option>
                    <option value="events">Događanja</option>
                    <option value="other">Ostalo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Poruka *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? "Slanje..." : "Pošalji poruku"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">{settings.contactInfoTitle || "Kontakt informacije"}</h2>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Adresa</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{contactAddress}</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Telefon</h3>
                  <p className="text-muted-foreground">{contactPhone}</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Email</h3>
                  <p className="text-muted-foreground">{contactEmail}</p>
                </CardContent>
              </Card>

              {/* Donation Info Card */}
              <Card className="border-2 border-primary/20 shadow-md hover:shadow-lg transition-shadow bg-slate-50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <span className="text-xl font-bold">€</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{settings.donationTitle || "Donacije i Članarine"}</h3>
                  <p className="text-muted-foreground whitespace-pre-line text-sm border-t border-slate-200 mt-2 pt-4 w-full">
                    {settings.donationIban || "Uplatitelj: [Vaše ime]\\nPrimatelj: Gimnastički savez Zagrebačke županije\\nIBAN: HR1234567890123456789\\nOpis: Donacija / Članarina"}
                  </p>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <Card>
                <CardContent className="p-0">
                  <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
                    <div className="text-center text-gray-500 p-6">
                      <MapPin className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm whitespace-pre-line">{settings.contactMapPlaceholder || "Google Maps - dolazi uskoro"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}