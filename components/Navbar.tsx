"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navLinks = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Noticias", href: "/noticias" },
  { label: "Mesa de Partes", href: "/mesa-de-partes" },
  { label: "Galería", href: "/galeria" },
  { label: "Contacto", href: "/contacto" },
];

const searchIndex = [
  { label: "Inicio", path: "/", description: "Página principal y bienvenida", keywords: ["inicio", "home", "aprotura", "bienvenida"] },
  { label: "Quiénes Somos", path: "/nosotros", description: "Misión, visión, junta directiva y valores", keywords: ["nosotros", "quienes somos", "mision", "vision", "valores", "directorio", "historia"] },
  { label: "Noticias y Eventos", path: "/noticias", description: "Últimas novedades, comunicados y eventos", keywords: ["noticias", "comunicados", "eventos", "novedades", "actualidad"] },
  { label: "Mesa de Partes Virtual", path: "/mesa-de-partes", description: "Envío de solicitudes, expedientes y trámites", keywords: ["mesa de partes", "tramite", "solicitud", "expediente", "registro", "afiliarse", "login"] },
  { label: "Galería de Fotos", path: "/galeria", description: "Fotos de eventos, danzas y actividades", keywords: ["galeria", "fotos", "imagenes", "fotografias", "danzas"] },
  { label: "Contacto Oficial", path: "/contacto", description: "Formulario de mensajes y WhatsApp", keywords: ["contacto", "telefono", "correo", "whatsapp", "ubicacion", "oficina", "mensaje", "escribir"] },
  { label: "Cursos y Capacitación", path: "/cursos", description: "Programas académicos y talleres", keywords: ["cursos", "capacitacion", "taller", "estudiar", "formacion"] },
];

export default function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/control-secreto")) {
    return null;
  }
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<{
    text: string;
    link?: string;
    linkText?: string;
  } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    // Check if dismissed in this session
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("announcement_dismissed");
      if (isDismissed) {
        setDismissed(true);
      }
    }

    // Fetch active announcement from backend
    // Since nothing is published yet, it remains null by default.
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch("/api/active-announcement");
        if (response.ok) {
          const data = await response.json();
          if (data && data.text) {
            setAnnouncement(data);
          }
        }
      } catch (err) {
        // Fallback for developers/inspectors to test UI using localStorage:
        // localStorage.setItem("mock_announcement", JSON.stringify({text: "Inscripciones abiertas: Curso de Guías de Turismo 2026.", link: "/cursos", linkText: "Inscríbete aquí →"}))
        if (typeof window !== "undefined") {
          const localMock = localStorage.getItem("mock_announcement");
          if (localMock) {
            try {
              setAnnouncement(JSON.parse(localMock));
            } catch (_) {}
          }
        }
      }
    };

    fetchAnnouncement();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("announcement_dismissed", "true");
    }
  };

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: "white",
      boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
      borderBottom: scrolled ? "1px solid rgba(0,0,0,0.05)" : "1px solid var(--chalk-dark)",
      transition: "all 0.2s ease",
    }}>
      {/* 1. TOP ANNOUNCEMENT BAR (Hides on scroll) */}
      {announcement && !dismissed && (
        <div style={{
          background: "linear-gradient(90deg, var(--burgundy) 0%, var(--crimson) 100%)",
          color: "white",
          fontSize: "0.82rem",
          fontWeight: 600,
          textAlign: "center",
          padding: scrolled ? "0px" : "0.55rem 2.5rem",
          height: scrolled ? "0px" : "auto",
          overflow: "hidden",
          transition: "all 0.25s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          position: "relative",
        }}>
          <span>{announcement.text}</span>
          {announcement.link && announcement.linkText && (
            <Link href={announcement.link} style={{ color: "var(--gold-light)", textDecoration: "underline", fontWeight: 700 }}>
              {announcement.linkText}
            </Link>
          )}
          
          {/* Close button */}
          <button 
            onClick={handleDismiss}
            style={{
              position: "absolute",
              right: "1.5rem",
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.25rem",
              opacity: 0.8,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.8"}
            aria-label="Cerrar aviso"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* 2. SUB-HEADER BAR (Hides on scroll) */}
      <div style={{
        borderBottom: "1px solid var(--chalk-dark)",
        padding: scrolled ? "0px" : "0.4rem 0",
        height: scrolled ? "0px" : "auto",
        overflow: "hidden",
        transition: "all 0.25s ease",
        background: "#FFF",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem" }}>
          {/* Left links */}
          <div style={{ display: "flex", gap: "1.25rem", color: "var(--graphite-light)", fontWeight: 500 }}>
            <Link href="/nosotros" style={{ color: "var(--crimson)", fontWeight: 700 }}>Quiénes Somos</Link>
            <Link href="/mesa-de-partes" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--crimson)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--graphite-light)"}>Mesa de Partes</Link>
          </div>
          {/* Right links */}
          <div style={{ display: "flex", gap: "1.25rem", color: "var(--graphite-light)", fontWeight: 500 }}>
            <Link href="/contacto" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "var(--crimson)"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--graphite-light)"}>Contacto</Link>
            <span>Arequipa, PE</span>
          </div>
        </div>
      </div>

      {/* 3. MAIN NAVBAR */}
      <div style={{
        padding: scrolled ? "0.6rem 0" : "0.9rem 0",
        transition: "padding 0.2s ease",
        background: "white",
      }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <div style={{
              width: scrolled ? 36 : 42,
              height: scrolled ? 36 : 42,
              position: "relative",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}>
              <img src="/logo.png" alt="Logo APROTURA" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: scrolled ? "1.15rem" : "1.25rem",
                color: "var(--graphite)",
                letterSpacing: "0.04em",
                transition: "all 0.2s ease",
              }}>APROTURA</span>
              <span style={{
                fontSize: "0.58rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}>Arequipa</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden-mobile" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link"
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "var(--graphite-light)",
                }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            
            {/* Search */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--graphite-light)",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "100px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--chalk)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
                <span className="hidden-mobile">Buscar</span>
              </button>
              {searchOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "var(--shadow-lg)",
                  padding: "0.75rem",
                  width: 320,
                  border: "1px solid var(--chalk-dark)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  zIndex: 1100,
                }}>
                  <input
                    type="text"
                    placeholder="Buscar páginas o temas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && search.trim().length > 0) {
                        const filtered = searchIndex.filter(item => 
                          item.label.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
                        );
                        if (filtered.length > 0) {
                          router.push(filtered[0].path);
                          setSearch("");
                          setSearchOpen(false);
                        }
                      }
                    }}
                    autoFocus
                    style={{
                      width: "100%",
                      border: "1.5px solid var(--chalk-dark)",
                      borderRadius: "8px",
                      padding: "0.5rem 0.75rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.88rem",
                      outline: "none",
                      color: "var(--graphite)",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--crimson)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--chalk-dark)"}
                  />

                  {/* Results List */}
                  {search.trim().length > 0 && (
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                      maxHeight: "240px",
                      overflowY: "auto",
                      marginTop: "0.25rem",
                      borderTop: "1px solid var(--chalk-dark)",
                      paddingTop: "0.5rem",
                    }}>
                      {(() => {
                        const filtered = searchIndex.filter(item => 
                          item.label.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
                        );

                        if (filtered.length === 0) {
                          return (
                            <div style={{ padding: "0.5rem", fontSize: "0.8rem", color: "var(--graphite-light)", textAlign: "center" }}>
                              No se encontraron resultados.
                            </div>
                          );
                        }

                        return filtered.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              router.push(item.path);
                              setSearch("");
                              setSearchOpen(false);
                            }}
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              padding: "0.5rem 0.75rem",
                              borderRadius: "8px",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              textAlign: "left",
                              transition: "background 0.2s",
                              width: "100%",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--chalk)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                          >
                            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--graphite)" }}>
                              {item.label}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--graphite-light)" }}>
                              {item.description}
                            </span>
                          </button>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hamburger – mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="show-mobile"
              style={{
                background: "var(--chalk)",
                border: "none",
                cursor: "pointer",
                width: 36,
                height: 36,
                borderRadius: "50%",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <span style={{ width: 16, height: 2, background: "var(--graphite)", display: "block", borderRadius: 1 }} />
              <span style={{ width: 16, height: 2, background: "var(--graphite)", display: "block", borderRadius: 1 }} />
              <span style={{ width: 12, height: 2, background: "var(--graphite)", display: "block", borderRadius: 1 }} />
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: "white",
          borderTop: "1px solid var(--chalk-dark)",
          padding: "1rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "0.7rem 0",
                borderBottom: "1px solid var(--chalk-dark)",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--graphite)",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
