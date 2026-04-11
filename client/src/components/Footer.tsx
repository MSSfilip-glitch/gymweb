import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getDefaultSettings } from "@/lib/cmsConfig";

export default function Footer() {
  const settingsQuery = trpc.settings.getAll.useQuery();
  const s = { ...getDefaultSettings(), ...(settingsQuery.data || {}) };

  return (
    <footer className="bg-secondary text-white py-12 mt-auto">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="hover:opacity-80 transition">
              <h3 className="font-bold text-lg mb-4">GSZZ</h3>
              <p className="text-white/70 whitespace-pre-line">
                {s.footerDesc}
              </p>
            </Link>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Brzi Linkovi</h4>
            <ul className="space-y-2 text-white/70">
              <li><Link href="/vijesti" className="hover:text-white transition inline-block">Vijesti</Link></li>
              <li><Link href="/kalendar" className="hover:text-white transition inline-block">Kalendar</Link></li>
              <li><Link href="/klubovi" className="hover:text-white transition inline-block">Klubovi</Link></li>
              <li><Link href="/rezultati" className="hover:text-white transition inline-block">Rezultati</Link></li>
              <li><Link href="/admin" className="hover:text-white transition inline-block">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${s.contactEmail}`} className="hover:text-white transition">{s.contactEmail}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href={`tel:${s.contactPhone.replace(/[\s-]/g, "")}`} className="hover:text-white transition">{s.contactPhone}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="whitespace-pre-line">{s.contactAddress}</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Pratite Nas</h4>
            <div className="flex gap-4">
              <a href={s.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={s.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={s.socialYoutube} target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-white/70">
          <p>{s.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
}
