"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";


const footerLinks = {
  "Páginas": [
    { label: "Inicio", href: "/" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Noticias", href: "/noticias" },
    { label: "Galería", href: "/galeria" },
    { label: "Contacto", href: "/contacto" },
  ],
  "Servicios": [
    { label: "Mesa de Partes", href: "/mesa-de-partes" },
    { label: "Actividades y Eventos", href: "/noticias" },
    { label: "Directorio de Agencias", href: "/nosotros#directorio" },
  ],
};

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/aproturaqp/",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/aproturaoficial/",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@aproturaoficial",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.19.98 1.15 2.37 1.9 3.88 2.07v3.9c-1.72-.08-3.41-.75-4.73-1.88-.19-.16-.36-.33-.53-.51v7.66c.03 2.21-.86 4.41-2.48 5.92-1.78 1.69-4.32 2.45-6.72 2.01-2.58-.45-4.88-2.31-5.74-4.82-.99-2.84-.45-6.19 1.45-8.49C4.65 8.44 6.74 7.28 9.24 7.26c.4-.01.81.02 1.21.08v3.92c-.89-.28-1.89-.17-2.69.34-.78.5-1.28 1.39-1.35 2.32-.08 1.07.41 2.14 1.26 2.79.88.68 2.09.81 3.1.33.72-.34 1.22-1.02 1.34-1.8.03-.22.04-.44.04-.66V0h.08z"/>
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/51951936792",
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/control-secreto")) {
    return null;
  }
  const currentYear = new Date().getFullYear();
  return (
    <footer id="main-footer" style={{
      background: "var(--graphite)",
      color: "white",
      paddingTop: "4rem",
    }}>
      {/* Main Footer */}
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "3rem",
          paddingBottom: "3rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          {/* Brand Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{
                width: 48,
                height: 48,
                position: "relative",
                flexShrink: 0,
              }}>
                <img src="/logo.png" alt="Logo APROTURA" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.4rem", letterSpacing: "0.08em" }}>APROTURA</div>
                <div style={{ fontSize: "0.65rem", letterSpacing: "0.06em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>Arequipa, Perú</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: 1.8, marginBottom: "1.5rem", maxWidth: 340 }}>
              Asociación de Profesionales y Técnicos de Turismo Arequipa. Formando líderes del turismo peruano con excelencia, cultura y compromiso social.
            </p>
            {/* Social Icons */}
            <div id="social-links" style={{ display: "flex", gap: "0.75rem" }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius)",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.7)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--crimson)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "white";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--crimson)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.7)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.12)";
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1rem",
                color: "white",
                marginBottom: "1.25rem",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--crimson)",
                display: "inline-block",
              }}>{title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} style={{
                      color: "rgba(255,255,255,0.6)",
                      fontSize: "0.88rem",
                      transition: "color 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    >
                      <span style={{ color: "var(--crimson)", fontSize: "0.7rem" }}>›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          padding: "1.5rem 0",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          {[
            {
              icon: (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              text: "Cercado de Arequipa, Arequipa, Perú",
            },
            {
              icon: (
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              text: "aproturaaqp.peru@gmail.com",
            },
          ].map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ display: "flex", alignItems: "center", color: "var(--gold-light)" }}>{item.icon}</span>
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem" }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Copyright Bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 0",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>
            © {currentYear} APROTURA – Asociación de Profesionales y Técnicos de Turismo Arequipa. Todos los derechos reservados.
          </span>
          <Link href="/mesa-de-partes" style={{ color: "var(--gold-light)", fontSize: "0.8rem", fontWeight: 500 }}>
            Mesa de Partes Virtual →
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
