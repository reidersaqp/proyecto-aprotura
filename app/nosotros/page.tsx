"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

const valores = [
  {
    titulo: "Responsabilidad",
    desc: "Actuamos de manera consciente y comprometida en cada actividad que realizamos, asumiendo con seriedad nuestro rol en el desarrollo del turismo y el cuidado de la imagen de Arequipa.",
    imagenUrl: "/img/valor_responsabilidad.png"
  },
  {
    titulo: "Respeto",
    desc: "Promovemos el respeto hacia las personas, las comunidades, las culturas y el entorno natural, valorando la diversidad y fomentando relaciones basadas en la convivencia y la armonía.",
    imagenUrl: "/img/valor_respeto.png"
  },
  {
    titulo: "Compromiso",
    desc: "Trabajamos con dedicación y vocación para cumplir nuestros objetivos institucionales, aportando activamente al crecimiento del turismo local y al bienestar de la sociedad.",
    imagenUrl: "/img/valor_compromiso.png"
  },
  {
    titulo: "Identidad",
    desc: "Valoramos y promovemos nuestras tradiciones, costumbres y la riqueza cultural de Arequipa en todas nuestras actividades y acciones.",
    imagenUrl: "/img/valor_identidad.png"
  }
];

const programas = [
  {
    titulo: "Programas de formación en turismo",
    desc: "Cursos, talleres y certificaciones diseñados para profesionales, emprendedores y estudiantes que desean fortalecer sus capacidades.",
    imagenUrl: "/img/programa_formacion.png"
  },
  {
    titulo: "Actividades de música y danza",
    desc: "Talleres, presentaciones y experiencias que integran expresiones artísticas con propuestas turísticas memorables.",
    imagenUrl: "/img/programa_musica.png"
  },
  {
    titulo: "Eventos turísticos y culturales",
    desc: "Festivales, ferias y encuentros comunitarios que impulsan la visibilidad de Arequipa y fomentan el orgullo regional.",
    imagenUrl: "/img/programa_eventos.png"
  }
];

const timelineItems = [
  {
    year: "2020",
    title: "Fundación de la Asociación",
    desc: "Nace APROTURA Arequipa de la mano de un grupo de guías de turismo, profesionales e historiadores dedicados, con el objetivo de profesionalizar y dignificar la labor turística en el sur del Perú.",
    color: "#9E1B1B"
  },
  {
    year: "2022",
    title: "Consolidación e Integración",
    desc: "Establecimiento de convenios clave con la Cámara de Comercio de Arequipa y el Ministerio de Comercio Exterior y Turismo (MINCETUR), permitiendo avalar y certificar los primeros programas oficiales.",
    color: "#C9952A"
  },
  {
    year: "2024",
    title: "Liderazgo Cultural",
    desc: "Superación de las 100 actividades culturales públicas organizadas, incluyendo festivales de danzas folklóricas y congresos académicos en el centro histórico de la ciudad.",
    color: "#C42B2B"
  },
  {
    year: "2026",
    title: "Transformación Digital",
    desc: "Lanzamiento del portal institucional digitalizado con Mesa de Partes Virtual y plataforma para alumnos, facilitando el acceso a capacitaciones gratuitas y de pago.",
    color: "#B5801B"
  }
];

export default function NosotrosPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const programsSliderRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [activeProgramsPage, setActiveProgramsPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"historia" | "proposito" | "principios" | "programas">("historia");

  const scrollTimelineLeft = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollTimelineRight = () => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? 280 : 330;
      const gap = 24; // 1.5rem
      sliderRef.current.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? 280 : 330;
      const gap = 24;
      sliderRef.current.scrollBy({ left: (cardWidth + gap), behavior: "smooth" });
    }
  };

  const scrollTo = (index: number) => {
    if (sliderRef.current) {
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? 280 : 330;
      const gap = 24;
      sliderRef.current.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
      setActivePage(index);
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const isMobile = window.innerWidth <= 768;
      const cardWidth = isMobile ? 280 : 330;
      const gap = 24;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setActivePage(index);
    }
  };

  const scrollProgramsLeft = () => {
    if (programsSliderRef.current) {
      programsSliderRef.current.scrollBy({ left: -354, behavior: "smooth" });
    }
  };

  const scrollProgramsRight = () => {
    if (programsSliderRef.current) {
      programsSliderRef.current.scrollBy({ left: 354, behavior: "smooth" });
    }
  };

  const scrollProgramsTo = (index: number) => {
    if (programsSliderRef.current) {
      programsSliderRef.current.scrollTo({ left: index * 354, behavior: "smooth" });
      setActiveProgramsPage(index);
    }
  };

  const handleProgramsScroll = () => {
    if (programsSliderRef.current) {
      const { scrollLeft } = programsSliderRef.current;
      const index = Math.round(scrollLeft / 354);
      setActiveProgramsPage(index);
    }
  };

  return (
    <div style={{ background: "var(--white)", minHeight: "100vh" }}>
      {/* Page Header (Interbank-Style Dark Curved Banner) */}
      <section className="nosotros-hero">
        {/* Background Image on the Right */}
        <div className="nosotros-hero-bg" />
        {/* Dark Overlay with Gradient fading to left to blend the image */}
        <div className="nosotros-hero-overlay" />

        <div className="container" style={{ position: "relative", zIndex: 3, width: "100%", paddingBottom: "3.5rem", paddingTop: "2.5rem" }}>
          <div style={{ maxWidth: "600px", textAlign: "left" }}>
            <h1 style={{ 
              color: "white", 
              fontSize: "clamp(2.5rem, 5vw, 3.25rem)", 
              fontWeight: 800, 
              marginBottom: "0.25rem",
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.02em"
            }}>
              Nosotros
            </h1>
          </div>
        </div>
      </section>

      {/* Tabs Navigation (BCP Style) */}
      <div className="nosotros-tabs-container">
        <button 
          onClick={() => setActiveTab("historia")} 
          className={`nosotros-tab ${activeTab === "historia" ? "active" : ""}`}
        >
          Historia
        </button>
        <div className="nosotros-tab-divider" />
        <button 
          onClick={() => setActiveTab("proposito")} 
          className={`nosotros-tab ${activeTab === "proposito" ? "active" : ""}`}
        >
          Propósito
        </button>
        <div className="nosotros-tab-divider" />
        <button 
          onClick={() => setActiveTab("principios")} 
          className={`nosotros-tab ${activeTab === "principios" ? "active" : ""}`}
        >
          Principios
        </button>
        <div className="nosotros-tab-divider" />
        <button 
          onClick={() => setActiveTab("programas")} 
          className={`nosotros-tab ${activeTab === "programas" ? "active" : ""}`}
        >
          Programas
        </button>
      </div>

      {/* Misión y Visión (Template Rediseñado) */}
      {activeTab === "proposito" && (
        <section className="mision-vision-section">
          <div className="container">
            <div className="mision-vision-grid">
              {/* Columna Izquierda (Textos) */}
              <div className="mision-vision-left">
                <h2 className="mision-vision-title">
                  Somos la asociación líder de profesionales en turismo de la región Arequipa
                </h2>
                
                <div className="mision-vision-item">
                  <h3 className="mision-vision-subtitle">Nuestra Misión</h3>
                  <p className="mision-vision-desc">
                    Promover el desarrollo, la capacitación constante y la defensa de los derechos profesionales y técnicos del sector turismo en Arequipa, garantizando servicios de la más alta calidad y fomentando el turismo sostenible.
                  </p>
                </div>

                <div className="mision-vision-item">
                  <h3 className="mision-vision-subtitle-gold">Nuestra Visión</h3>
                  <p className="mision-vision-desc">
                    Ser reconocidos al 2030 como la organización gremial y técnica de turismo referente en el sur del Perú, líder por la excelencia de sus asociados, su contribución cultural y su impacto en el desarrollo regional sostenible.
                  </p>
                </div>
              </div>

              {/* Columna Derecha (Imagen) */}
              <div className="mision-vision-right">
                {/* Image Container */}
                <div className="sede-image-container-static">
                  <img 
                    src="/img/aprotura_sede.png" 
                    alt="Sede Institucional APROTURA" 
                    className="sede-image-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Valores (Template Rediseñado) */}
      {activeTab === "principios" && (
        <section className="valores-section">
          <div className="container">
            <div style={{ textAlign: "left", marginBottom: "2.5rem" }}>
              <span className="valores-top-label">Profesionales comprometidos con el turismo y nuestra cultura</span>
              <h2 className="valores-section-title">Nuestros Valores</h2>
              <p className="valores-section-subtitle">
                Principios que orientan cada decisión y sostienen nuestras iniciativas.
              </p>
            </div>

            {/* Carousel Container */}
            <div 
              ref={sliderRef}
              onScroll={handleScroll}
              className="valores-slider-container"
            >
              {valores.map((v) => (
                <div key={v.titulo} className="valor-card">
                  <div className="valor-card-image-container">
                    <img src={v.imagenUrl} alt={v.titulo} className="valor-card-image" />
                  </div>
                  <div className="valor-card-content">
                    <h4 className="valor-card-title">{v.titulo}</h4>
                    <p className="valor-card-desc">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Scrollbar Controls */}
            <div className="valores-controls-container">
              <div className="valores-scrollbar-track-wrapper">
                {/* Left Arrow */}
                <button 
                  onClick={scrollLeft}
                  className="valores-arrow-button"
                  aria-label="Anterior valor"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Progress Line */}
                <div className="valores-scrollbar-track">
                  <div 
                    className="valores-scrollbar-indicator"
                    style={{
                      left: `${(activePage / (valores.length - 1)) * 75}%`,
                    }}
                  />
                </div>

                {/* Right Arrow */}
                <button 
                  onClick={scrollRight}
                  className="valores-arrow-button"
                  aria-label="Siguiente valor"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              {/* Pagination Dots */}
              <div className="valores-dots-container">
                {valores.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={`valores-dot ${activePage === i ? "active" : ""}`}
                    aria-label={`Ir a valor ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trayectoria Histórica (BCP Horizontal Timeline) */}
      {activeTab === "historia" && (
        <section className="timeline-section">
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <div className="section-label" style={{ margin: "0 auto 1rem" }}>Trayectoria</div>
              <h2 className="section-title">Historia de APROTURA</h2>
              <p className="section-subtitle" style={{ margin: "0 auto" }}>
                Desde nuestra fundación, impulsando la excelencia profesional en el sector turístico de Arequipa.
              </p>
            </div>

            {/* Slider Wrapper */}
            <div className="timeline-slider-wrapper">
              {/* Left Navigation Arrow */}
              <button 
                onClick={scrollTimelineLeft} 
                className="timeline-nav-button left"
                aria-label="Desplazar a la izquierda"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Timeline Slider */}
              <div 
                ref={timelineRef}
                className="timeline-slider-container"
              >
                <div className="timeline-track">
                  {/* Horizontal Central Line */}
                  <div className="timeline-center-line" />

                  {timelineItems.map((item, index) => {
                    const isAbove = index % 2 === 0;
                    // Teardrop shape pointing down (above) or up (below)
                    const borderRadiusStyle = isAbove ? "50% 50% 0 50%" : "0 50% 50% 50%";
                    return (
                      <div key={item.year} className="timeline-col">
                        {/* Solid Node on line */}
                        <div className="timeline-node" />

                        {/* Dashed connector line */}
                        <div className={`timeline-connector ${isAbove ? "above" : "below"}`} />

                        {/* Content Block (Badge + Text) */}
                        <div className={`timeline-content-block ${isAbove ? "above" : "below"}`}>
                          {/* Year Badge */}
                          <div 
                            className="timeline-badge"
                            style={{ 
                              backgroundColor: item.color,
                              borderRadius: borderRadiusStyle,
                            }}
                          >
                            <span className="timeline-badge-text">
                              {item.year}
                            </span>
                          </div>

                          {/* Text Block */}
                          <div className="timeline-text-block">
                            <h4 className="timeline-item-title">{item.title}</h4>
                            <p className="timeline-item-desc">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Navigation Arrow */}
              <button 
                onClick={scrollTimelineRight} 
                className="timeline-nav-button right"
                aria-label="Desplazar a la derecha"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Programas Section */}
      {activeTab === "programas" && (
        <section className="programas-section">
          <div className="container">
            <div style={{ textAlign: "left", marginBottom: "2.5rem" }}>
              <span className="valores-top-label">Desarrollamos el turismo a través del arte y la educación</span>
              <h2 className="valores-section-title">Nuestros Programas</h2>
              <p className="valores-section-subtitle">
                Iniciativas clave diseñadas para el desarrollo integral del sector turístico y cultural en Arequipa.
              </p>
            </div>

            {/* Carousel Container */}
            <div 
              ref={programsSliderRef}
              onScroll={handleProgramsScroll}
              className="programas-slider-container"
            >
              {programas.map((p) => (
                <div key={p.titulo} className="programa-card">
                  <div className="programa-card-image-container">
                    <img src={p.imagenUrl} alt={p.titulo} className="programa-card-image" />
                  </div>
                  <div className="programa-card-content">
                    <h4 className="programa-card-title">{p.titulo}</h4>
                    <p className="programa-card-desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Redes Sociales Section */}
      <section className="social-connect-section">
        <div className="gerencia-link-container">
          <Link href="/contacto" className="gerencia-link">
            Conoce más de nuestra <span>Asociación aquí</span>
          </Link>
        </div>
        <div className="container">
          <div className="social-connect-grid">
            <div className="social-connect-left">
              <h2 className="social-connect-title">Mantente en contacto con nosotros</h2>
            </div>
            <div className="social-connect-right">
              <div className="social-connect-card-grid">
                <a 
                  href="https://www.facebook.com/aproturaqp/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-connect-card"
                >
                  <div className="social-icon-wrapper">
                    <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <h4 className="social-card-title">Facebook</h4>
                  <p className="social-card-desc">Mantente al tanto de las novedades</p>
                </a>

                <a 
                  href="https://wa.me/51951936792" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-connect-card"
                >
                  <div className="social-icon-wrapper">
                    <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <h4 className="social-card-title">WhatsApp</h4>
                  <p className="social-card-desc">Escríbenos directamente</p>
                </a>

                <a 
                  href="https://www.tiktok.com/@aproturaoficial" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-connect-card"
                >
                  <div className="social-icon-wrapper">
                    <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.62 4.19.98 1.15 2.37 1.9 3.88 2.07v3.9c-1.72-.08-3.41-.75-4.73-1.88-.19-.16-.36-.33-.53-.51v7.66c.03 2.21-.86 4.41-2.48 5.92-1.78 1.69-4.32 2.45-6.72 2.01-2.58-.45-4.88-2.31-5.74-4.82-.99-2.84-.45-6.19 1.45-8.49C4.65 8.44 6.74 7.28 9.24 7.26c.4-.01.81.02 1.21.08v3.92c-.89-.28-1.89-.17-2.69.34-.78.5-1.28 1.39-1.35 2.32-.08 1.07.41 2.14 1.26 2.79.88.68 2.09.81 3.1.33.72-.34 1.22-1.02 1.34-1.8.03-.22.04-.44.04-.66V0h.08z"/>
                    </svg>
                  </div>
                  <h4 className="social-card-title">TikTok</h4>
                  <p className="social-card-desc">Mira nuestros videos y eventos</p>
                </a>

                <a 
                  href="https://www.instagram.com/aproturaoficial/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-connect-card"
                >
                  <div className="social-icon-wrapper">
                    <svg width="36" height="36" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </div>
                  <h4 className="social-card-title">Instagram</h4>
                  <p className="social-card-desc">Sigue nuestro día a día visual</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>


      <style>{`
        .nosotros-hero {
          position: relative;
          overflow: hidden;
          border-bottom-right-radius: 80px;
          min-height: 360px;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #120205 0%, #1c0307 40%, #2a050a 100%);
          padding: 7.5rem 0 0 0;
        }
        .nosotros-hero-bg {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 55%;
          background-image: url('/img/nosotros_banner.png');
          background-size: cover;
          background-position: center right;
          z-index: 1;
        }
        .nosotros-hero-overlay {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(90deg, #120205 45%, rgba(18, 2, 5, 0.8) 60%, rgba(18, 2, 5, 0) 100%);
          z-index: 2;
        }
        .mision-vision-section {
          padding: 6.5rem 0;
          background: var(--white);
        }
        .mision-vision-grid {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 3rem;
          align-items: center;
        }
        .mision-vision-left {
          text-align: left;
        }
        .mision-vision-title {
          font-size: clamp(1.8rem, 3.2vw, 2.25rem);
          font-weight: 700;
          color: var(--crimson);
          line-height: 1.3;
          margin-bottom: 2rem;
          font-family: var(--font-display);
        }
        .mision-vision-item {
          margin-bottom: 1.75rem;
        }
        .mision-vision-subtitle {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--crimson);
          margin-bottom: 0.5rem;
          font-family: var(--font-display);
        }
        .mision-vision-subtitle-gold {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--gold-dark);
          margin-bottom: 0.5rem;
          font-family: var(--font-display);
        }
        .mision-vision-desc {
          font-size: 0.98rem;
          color: var(--graphite-light);
          line-height: 1.65;
          margin: 0;
        }
        .mision-vision-right {
          position: relative;
          display: flex;
          align-items: center;
        }
        .sede-image-container-static {
          width: 100%;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        }
        .sede-image-img {
          width: 100%;
          height: auto;
          display: block;
        }
        @media (max-width: 991px) {
          .mision-vision-section {
            padding: 4.5rem 0;
          }
          .mision-vision-grid {
            grid-template-columns: 1fr;
            gap: 3.5rem;
          }
          .mision-vision-right {
            padding-left: 0;
          }
        }
        .valores-section {
          padding: 5.5rem 0;
          background: var(--white);
        }
        .valores-top-label {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--crimson);
          margin-bottom: 0.5rem;
          display: block;
          font-family: var(--font-display);
        }
        .valores-section-title {
          font-size: clamp(2rem, 3.5vw, 2.5rem);
          font-weight: 700;
          color: var(--graphite);
          margin-bottom: 0.75rem;
          font-family: var(--font-display);
        }
        .valores-section-subtitle {
          font-size: 1.05rem;
          color: var(--graphite-light);
          margin: 0;
        }
        .valores-slider-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 0.75rem;
          margin: 0 -0.75rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
          scroll-snap-type: x mandatory;
        }
        .valores-slider-container::-webkit-scrollbar {
          display: none;
        }
        .valor-card {
          flex: 0 0 330px;
          background: var(--white);
          padding: 0 0 2.5rem 0;
          border-radius: 20px;
          border: 1px solid var(--chalk-dark);
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          scroll-snap-align: start;
        }
        .valor-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(158, 27, 27, 0.15);
        }
        @media (min-width: 1024px) {
          .valores-slider-container {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 1.5rem !important;
            overflow-x: visible !important;
            margin: 0 !important;
            padding: 0.75rem 0 !important;
          }
          .valor-card {
            flex: none !important;
            scroll-snap-align: none !important;
          }
          .valores-controls-container {
            display: none !important;
          }
        }
        .valor-card-image-container {
          width: 100%;
          height: 180px;
          overflow: hidden;
          position: relative;
        }
        .valor-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .valor-card:hover .valor-card-image {
          transform: scale(1.06);
        }
        .valor-card-content {
          padding: 1.5rem 1.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .valor-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--graphite);
          margin-bottom: 0.75rem;
          font-family: var(--font-display);
        }
        .valor-card-desc {
          font-size: 0.9rem;
          color: var(--graphite-light);
          line-height: 1.6;
          margin: 0;
        }
        .valores-controls-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 3.5rem;
        }
        .valores-scrollbar-track-wrapper {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          width: 100%;
          max-width: 400px;
        }
        .valores-arrow-button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--graphite-light);
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, transform 0.2s;
        }
        .valores-arrow-button:hover {
          color: var(--crimson);
          transform: scale(1.1);
        }
        .valores-scrollbar-track {
          flex: 1;
          height: 4px;
          background-color: var(--chalk-dark);
          border-radius: 2px;
          position: relative;
        }
        .valores-scrollbar-indicator {
          position: absolute;
          left: 0;
          width: 25%;
          height: 100%;
          background-color: var(--crimson);
          border-radius: 2px;
          transition: left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .valores-dots-container {
          display: flex;
          gap: 0.5rem;
          margin-top: 1.25rem;
        }
        .valores-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--chalk-dark);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
        }
        .valores-dot.active {
          background-color: var(--crimson);
          transform: scale(1.25);
        }
        @media (max-width: 768px) {
          .valores-slider-container {
            margin: 0;
            padding: 0.5rem;
          }
          .valor-card {
            flex: 0 0 280px;
            padding: 0 0 2rem 0;
          }
          .valor-card-image-container {
            height: 150px;
          }
          .valor-card-content {
            padding: 1.25rem 1.25rem 0;
          }
          .valores-scrollbar-track-wrapper {
            max-width: 300px;
          }
        }

        /* Tabs BCP Style */
        .nosotros-tabs-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 3rem auto 1.5rem;
          max-width: 600px;
          border-bottom: 2px solid var(--chalk-dark);
          padding: 0 1rem;
        }
        .nosotros-tab {
          position: relative;
          background: none;
          border: none;
          padding: 1rem 2rem;
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          font-weight: 600;
          color: var(--graphite-light);
          cursor: pointer;
          font-family: var(--font-display);
          transition: all 0.3s ease;
        }
        .nosotros-tab:hover {
          color: var(--crimson);
        }
        .nosotros-tab.active {
          color: var(--crimson);
          font-weight: 700;
        }
        .nosotros-tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 15%;
          right: 15%;
          height: 4px;
          background-color: var(--crimson);
          border-radius: 4px 4px 0 0;
        }
        .nosotros-tab-divider {
          width: 1px;
          height: 20px;
          background-color: var(--chalk-dark);
          margin: 0;
        }

        .timeline-section {
          padding: 5.5rem 0;
          background: var(--chalk);
          border-top: 1px solid var(--chalk-dark);
          border-bottom: 1px solid var(--chalk-dark);
          position: relative;
        }
        .timeline-slider-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0 1rem;
        }
        .timeline-slider-container {
          width: 100%;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 1.5rem 0;
        }
        .timeline-slider-container::-webkit-scrollbar {
          display: none;
        }
        .timeline-track {
          display: flex;
          position: relative;
          min-width: 100%;
          padding-left: 5%;
          padding-right: 5%;
          height: 380px;
        }
        .timeline-center-line {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--chalk-dark);
          z-index: 1;
        }
        .timeline-col {
          flex: 0 0 350px;
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .timeline-node {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--white);
          border: 3px solid var(--chalk-dark);
          z-index: 3;
        }
        .timeline-connector {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          border-left: 2px dashed var(--chalk-dark);
          z-index: 1;
        }
        .timeline-connector.above {
          bottom: 50%;
          height: 60px;
        }
        .timeline-connector.below {
          top: 50%;
          height: 60px;
        }
        .timeline-content-block {
          position: absolute;
          left: calc(50% - 38px);
          display: flex;
          align-items: center;
          gap: 1.25rem;
          width: 320px;
          z-index: 4;
        }
        .timeline-content-block.above {
          bottom: calc(50% + 55px);
        }
        .timeline-content-block.below {
          top: calc(50% + 55px);
        }
        .timeline-badge {
          width: 76px;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(45deg);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .timeline-col:hover .timeline-badge {
          transform: rotate(45deg) scale(1.08);
        }
        .timeline-badge-text {
          transform: rotate(-45deg);
          display: inline-block;
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--white);
          font-family: var(--font-display);
        }
        .timeline-text-block {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .timeline-item-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--graphite);
          margin-bottom: 0.25rem;
          font-family: var(--font-display);
          line-height: 1.25;
        }
        .timeline-item-desc {
          font-size: 0.84rem;
          color: var(--graphite-light);
          line-height: 1.5;
          margin: 0;
        }
        .timeline-nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid var(--chalk-dark);
          background: var(--white);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          color: var(--graphite-light);
          transition: all 0.2s ease;
        }
        .timeline-nav-button:hover {
          background: var(--crimson);
          color: var(--white);
          border-color: var(--crimson);
          box-shadow: 0 6px 15px rgba(158, 27, 27, 0.3);
        }
        .timeline-nav-button.left {
          left: -10px;
        }
        .timeline-nav-button.right {
          right: -10px;
        }
        @media (max-width: 768px) {
          .timeline-track {
            height: 380px;
            padding-left: 0;
            padding-right: 0;
          }
          .timeline-col {
            flex: 0 0 290px;
          }
          .timeline-content-block {
            width: 270px;
            gap: 1rem;
            left: calc(50% - 30px);
          }
          .timeline-badge {
            width: 60px;
            height: 60px;
          }
          .timeline-badge-text {
            font-size: 0.95rem;
          }
          .timeline-nav-button {
            width: 36px;
            height: 36px;
          }
          .timeline-nav-button.left { left: -5px; }
          .timeline-nav-button.right { right: -5px; }
          
          .nosotros-hero {
            padding: 6rem 0 0 0;
            border-bottom-right-radius: 50px;
            min-height: 280px;
          }
          .nosotros-hero-bg {
            width: 100%;
          }
          .nosotros-hero-overlay {
            background: linear-gradient(180deg, rgba(18, 2, 5, 0.95) 0%, rgba(18, 2, 5, 0.85) 60%, rgba(18, 2, 5, 0.7) 100%);
          }
        }

        /* Redes Sociales Section */
        .social-connect-section {
          padding: 5.5rem 0;
          background: var(--white);
          border-top: 1px solid var(--chalk-dark);
        }
        .gerencia-link-container {
          text-align: center;
          margin-bottom: 3rem;
        }
        .gerencia-link {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--graphite);
          text-decoration: none;
          transition: color 0.2s ease;
          font-family: var(--font-display);
        }
        .gerencia-link:hover {
          color: var(--crimson);
        }
        .gerencia-link span {
          color: var(--crimson);
          text-decoration: underline;
        }
        .gerencia-link:hover span {
          color: var(--gold-dark);
        }
        .social-connect-grid {
          display: grid;
          grid-template-columns: 1fr 2.5fr;
          gap: 4rem;
          align-items: center;
        }
        .social-connect-left {
          text-align: left;
        }
        .social-connect-title {
          font-size: clamp(2rem, 3.5vw, 2.5rem);
          font-weight: 700;
          color: var(--graphite);
          line-height: 1.25;
          font-family: var(--font-display);
          max-width: 320px;
        }
        .social-connect-right {
          width: 100%;
        }
        .social-connect-card-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid var(--chalk-dark);
          border-radius: 16px;
          background: var(--white);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          overflow: hidden;
        }
        .social-connect-card {
          padding: 3rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid var(--chalk-dark);
          transition: background-color 0.2s ease, transform 0.2s ease;
          text-decoration: none;
          color: inherit;
        }
        .social-connect-card:last-child {
          border-right: none;
        }
        .social-connect-card:hover {
          background-color: rgba(158, 27, 27, 0.02);
        }
        .social-icon-wrapper {
          color: var(--crimson);
          transition: transform 0.3s ease, color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .social-connect-card:hover .social-icon-wrapper {
          transform: scale(1.1);
          color: var(--gold-dark);
        }
        .social-card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--graphite);
          margin-bottom: 0.5rem;
          font-family: var(--font-display);
        }
        .social-card-desc {
          font-size: 0.82rem;
          color: var(--graphite-light);
          line-height: 1.4;
          margin: 0;
        }

        @media (max-width: 991px) {
          .social-connect-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .social-connect-title {
            max-width: 100%;
            text-align: center;
          }
        }
        @media (max-width: 768px) {
          .social-connect-card-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .social-connect-card {
            border-bottom: 1px solid var(--chalk-dark);
          }
          .social-connect-card:nth-child(2n) {
            border-right: none;
          }
          .social-connect-card:nth-child(3),
          .social-connect-card:nth-child(4) {
            border-bottom: none;
          }
        }
        @media (max-width: 480px) {
          .social-connect-card-grid {
            grid-template-columns: 1fr;
          }
          .social-connect-card {
            border-right: none;
            border-bottom: 1px solid var(--chalk-dark);
          }
          .social-connect-card:last-child {
            border-bottom: none;
          }
        }

        /* Programas Tab Section Styles */
        .programas-section {
          padding: 5.5rem 0;
          background: var(--white);
        }
        .programas-slider-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 0.75rem;
          margin: 0 -0.75rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        @media (min-width: 1024px) {
          .programas-slider-container {
            justify-content: center;
            margin: 0;
            padding: 0.75rem 0;
          }
        }
        .programas-slider-container::-webkit-scrollbar {
          display: none;
        }
        .programa-card {
          flex: 0 0 330px;
          background: var(--white);
          padding: 0 0 2.5rem 0;
          border-radius: 20px;
          border: 1px solid var(--chalk-dark);
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
        }
        .programa-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(158, 27, 27, 0.15);
        }
        .programa-card-image-container {
          width: 100%;
          height: 180px;
          overflow: hidden;
          position: relative;
        }
        .programa-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .programa-card:hover .programa-card-image {
          transform: scale(1.06);
        }
        .programa-card-content {
          padding: 1.5rem 1.5rem 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .programa-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--graphite);
          margin-bottom: 0.75rem;
          font-family: var(--font-display);
          line-height: 1.35;
        }
        .programa-card-desc {
          font-size: 0.92rem;
          color: var(--graphite-light);
          line-height: 1.6;
          margin: 0;
        }
        @media (max-width: 768px) {
          .programas-slider-container {
            margin: 0;
            padding: 0.5rem;
          }
          .programa-card {
            flex: 0 0 280px;
            padding: 0 0 2rem 0;
          }
          .programa-card-image-container {
            height: 150px;
          }
          .programa-card-content {
            padding: 1.25rem 1.25rem 0;
          }
        }
      `}</style>
    </div>
  );
}
