import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X } from "lucide-react";

const navItems = [
  {
    label: "Informacije",
    submenu: [
      { href: "/o-nama", label: "O nama" },
      { href: "/pravila", label: "Pravila" },
      { href: "/dokumenti", label: "Dokumenti" },
      { href: "/vjezbe", label: "Vježbe" },
    ],
  },
  {
    label: "Aktivnosti",
    submenu: [
      { href: "/vijesti", label: "Vijesti" },
      { href: "/kalendar", label: "Kalendar" },
      { href: "/rezultati", label: "Rezultati" },
    ],
  },
  { href: "/klubovi", label: "Klubovi" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  useEffect(() => {
    for (const item of navItems) {
      if (item.submenu?.some(sub => location === sub.href || location.startsWith(sub.href + "/"))) {
        setExpandedMenu(item.label);
        break;
      }
    }
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <>
      {/* Desktop Navigation - Sidebar */}
      <nav className="hidden xl:fixed xl:left-0 xl:top-0 xl:h-screen xl:w-64 xl:bg-secondary xl:text-white xl:shadow-lg xl:flex xl:flex-col xl:pt-8 xl:z-40">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-6 mb-12 hover:opacity-80 transition">
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030497408/PAgYqoYrXrTZEmaXZX7irp/gszz-logo-v2-daz6Jf8qz93asss4E2yJtz.webp" alt="GSZZ Logo" className="w-14 h-14" />
          <div>
            <h1 className="text-lg font-bold">GSZZ</h1>
            <p className="text-xs text-blue-100">Zagrebačka županija</p>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 space-y-2">
          {navItems.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <Link href={item.href} className={`block px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm ${location === item.href ? "bg-blue-800 border-l-4 border-blue-400" : ""}`}>
                  {item.label}
                </Link>
              ) : (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium text-sm ${expandedMenu === item.label ? "bg-blue-900/50" : ""}`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition ${expandedMenu === item.label ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {expandedMenu === item.label && item.submenu && (
                    <div className="pl-4 space-y-1 mt-1">
                      {item.submenu.map((subitem) => (
                        <Link key={subitem.href} href={subitem.href} className={`block px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm ${location === subitem.href ? "text-white font-semibold bg-blue-800" : "text-blue-100"}`}>
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Button */}
        <div className="px-4 pb-8">
          <Link href="/kontakt" className="inline-block w-full">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Kontakt
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile/Tablet Navigation - Top Bar */}
      <nav className="xl:hidden sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030497408/PAgYqoYrXrTZEmaXZX7irp/gszz-logo-v2-daz6Jf8qz93asss4E2yJtz.webp" alt="GSZZ Logo" className="w-12 h-12" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-secondary">GSZZ</h1>
              <p className="text-xs text-muted-foreground">Zagrebačka županija</p>
            </div>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="xl:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-secondary" />
            ) : (
              <Menu className="w-6 h-6 text-secondary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="bg-white border-t border-border">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2">
              {navItems.map((item, index) => (
                <div key={index}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="block px-4 py-3 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition font-medium text-sm"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition ${expandedMenu === item.label ? "rotate-180" : ""
                            }`}
                        />
                      </button>
                      {expandedMenu === item.label && item.submenu && (
                        <div className="pl-4 space-y-1 mt-1">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm text-muted-foreground"
                              onClick={() => setIsOpen(false)}
                            >
                              {subitem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Contact Button in Mobile Menu */}
              <div className="pt-4 border-t">
                <Link href="/kontakt" className="inline-block w-full" onClick={() => setIsOpen(false)}>
                  <Button
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Kontakt
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

    </>
  );
}
