"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // YouTube Check
  const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = url.match(ytReg);
  if (ytMatch && ytMatch[2].length === 11) {
    return `https://www.youtube.com/embed/${ytMatch[2]}`;
  }
  
  // TikTok Check
  const ttMatch = url.match(/\/video\/(\d+)/);
  if (ttMatch) {
    return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;
  }
  
  // Facebook Check
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    if (url.includes("/share/") || url.includes("fb.watch")) {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=0&width=500`;
    }
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  }
  
  // Instagram Check
  const igMatch = url.match(/(?:instagram\.com)\/(?:p|reel|tv)\/([A-Za-z0-9-_]+)/);
  if (igMatch) {
    return `https://www.instagram.com/p/${igMatch[1]}/embed/`;
  }

  // Direct video file or stream check
  if (url.match(/\.(mp4|webm|ogg|m3u8)(?:\?.*)?$/i)) {
    return `DIRECT_VIDEO:${url}`;
  }
  
  return null;
}

function getVideoThumbnailUrl(url: string): string | null {
  if (!url) return null;
  
  // YouTube
  const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = url.match(ytReg);
  if (ytMatch && ytMatch[2].length === 11) {
    return `https://img.youtube.com/vi/${ytMatch[2]}/hqdefault.jpg`;
  }
  
  // TikTok / Facebook / Instagram / Direct stream fallback
  if (
    url.includes("tiktok.com") || 
    url.includes("facebook.com") || 
    url.includes("fb.watch") || 
    url.includes("instagram.com") ||
    url.match(/\.(mp4|webm|ogg|m3u8)(?:\?.*)?$/i)
  ) {
    return "VIDEO_PLACEHOLDER";
  }
  
  return null;
}


export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  
  // Pagination state for main listing
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Slider state for detailed view's "Últimas noticias"
  const latestSliderRef = useRef<HTMLDivElement>(null);
  const [activeLatestPage, setActiveLatestPage] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/active-news");
        if (res.ok) {
          const data = await res.json();
          setNoticias(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Filter news based on search term
  const filteredNoticias = noticias.filter((n) => {
    const matchesSearch = 
      n.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.resumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.lugar && n.lugar.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Calculate featured news (index 0 when search is empty)
  const showFeatured = searchTerm.trim() === "" && currentPage === 1 && filteredNoticias.length > 0;
  const featuredNews = showFeatured ? filteredNoticias[0] : null;

  // Grid news: if showing featured, skip the first one
  const gridNoticias = showFeatured ? filteredNoticias.slice(1) : filteredNoticias;

  // Paginated news
  const totalPages = Math.ceil(gridNoticias.length / itemsPerPage);
  const paginatedGridNoticias = gridNoticias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNewsClick = (news: any) => {
    setSelectedNews(news);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setSelectedNews(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Slider handlers for "Últimas noticias" in detailed view
  const scrollLatestLeft = () => {
    if (latestSliderRef.current) {
      latestSliderRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollLatestRight = () => {
    if (latestSliderRef.current) {
      latestSliderRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const scrollLatestTo = (index: number) => {
    if (latestSliderRef.current) {
      latestSliderRef.current.scrollTo({ left: index * 320, behavior: "smooth" });
      setActiveLatestPage(index);
    }
  };

  const handleLatestScroll = () => {
    if (latestSliderRef.current) {
      const { scrollLeft } = latestSliderRef.current;
      const index = Math.round(scrollLeft / 320);
      setActiveLatestPage(index);
    }
  };

  // Get other news for the detailed view slider
  const otrasNoticias = noticias.filter((n) => !selectedNews || n.id !== selectedNews.id);

  return (
    <div style={{ background: "var(--white)", minHeight: "100vh" }}>
      {/* 1. MAIN BANNER (Nosotros-Style Curved Banner) */}
      <section className="noticias-hero">
        {/* Background Image on the Right */}
        <div className="noticias-hero-bg" />
        {/* Dark Overlay with Gradient fading to left to blend the image */}
        <div className="noticias-hero-overlay" />

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
              Noticias
            </h1>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="loading-placeholder">
          <div className="spinner" />
          <p>Cargando noticias de APROTURA...</p>
        </div>
      )}

      {/* Main Content Area */}
      {!loading && (
        <section style={{ padding: "4rem 0 6rem 0" }}>
          <div className="container">

            {/* A. TEMPLATE 1: MAIN NEWS LISTING PAGE */}
            {!selectedNews && (
              <div>
                {noticias.length === 0 ? (
                  <div className="empty-state-container" style={{
                    textAlign: "center",
                    padding: "5rem 2rem",
                    maxWidth: "600px",
                    margin: "0 auto",
                    background: "var(--white)",
                    borderRadius: "20px",
                    border: "1px dashed var(--chalk-dark)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1.5rem"
                  }}>
                    <div>
                      <h2 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: 800,
                        color: "black",
                        marginBottom: "0.75rem"
                      }}>
                        Próximamente novedades
                      </h2>
                      <p style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        lineHeight: 1.6,
                        color: "var(--graphite-light)",
                        margin: 0
                      }}>
                        No hay noticias publicadas en este momento. Próximamente compartiremos novedades, actividades e información oficial de la asociación. ¡Vuelve a visitarnos pronto!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Search Bar header */}
                    <div className="listing-header">
                  <h2 className="listing-main-title">Tenemos mucho que contarte</h2>
                  <div className="search-section">
                    <span className="search-label">Encuentra aquí las noticias de APROTURA</span>
                    <div className="search-wrapper">
                      <input
                        type="text"
                        placeholder="Buscar en noticias"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="search-input"
                      />
                      <svg className="search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <circle cx="11" cy="11" r="7" />
                        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Featured News Block (Noticia Destacada) */}
                {featuredNews && (
                  <div 
                    className="featured-news-block"
                    onClick={() => handleNewsClick(featuredNews)}
                  >
                    <div className="featured-news-img-wrapper" style={{ position: "relative" }}>
                      {(() => {
                        const videoThumb = getVideoThumbnailUrl(featuredNews.imagen);
                        const isVideo = videoThumb !== null;
                        const isVideoPlaceholder = videoThumb === "VIDEO_PLACEHOLDER";
                        
                        let imgSrc = "";
                        let hasCustomCover = false;
                        if (isVideoPlaceholder) {
                          const firstNonVideo = featuredNews.imagenes?.find((img: string) => getVideoThumbnailUrl(img) === null);
                          if (firstNonVideo) {
                            imgSrc = firstNonVideo;
                            hasCustomCover = true;
                          }
                        } else {
                          imgSrc = videoThumb || featuredNews.imagen || "/img/beneficios.png";
                        }
                        
                        return (
                          <>
                            {(isVideoPlaceholder && !hasCustomCover) ? (
                              <div style={{
                                width: "100%",
                                height: "100%",
                                background: "linear-gradient(135deg, #1e050b 0%, #7e1b1b 100%)",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                position: "relative"
                              }}>
                                <div style={{
                                  position: "absolute",
                                  top: 0, left: 0, right: 0, bottom: 0,
                                  opacity: 0.08,
                                  backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                                  backgroundSize: "16px 16px"
                                }} />
                                <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em", opacity: 0.8, textTransform: "uppercase", marginBottom: "0.4rem" }}>APROTURA MULTIMEDIA</span>
                                <span style={{ fontSize: "0.82rem", fontWeight: 800, opacity: 0.9 }}>Ver Video</span>
                              </div>
                            ) : (
                              <img 
                                src={imgSrc} 
                                alt={featuredNews.titulo} 
                                className="featured-news-img"
                                onError={(e) => { e.currentTarget.src = "/img/beneficios.png"; }}
                              />
                            )}
                            {isVideo && (
                              <div style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "rgba(158, 27, 27, 0.95)",
                                borderRadius: "50%",
                                width: "56px",
                                height: "56px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                                zIndex: 2,
                              }}>
                                <svg width="24" height="24" fill="white" viewBox="0 0 24 24" style={{ marginLeft: "2px" }}>
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    <div className="featured-news-content">
                      <h3 className="featured-news-title">{featuredNews.titulo}</h3>
                      <div className="featured-news-meta">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>{featuredNews.fecha}</span>
                      </div>
                      <span className="brand-badge">Leer más</span>
                    </div>
                  </div>
                )}

                {/* News Cards Grid */}
                {paginatedGridNoticias.length > 0 ? (
                  <div className="news-cards-grid">
                    {paginatedGridNoticias.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleNewsClick(n)}
                        className="news-card-item"
                      >
                        <div className="card-img-wrapper" style={{ position: "relative" }}>
                          {(() => {
                            const videoThumb = getVideoThumbnailUrl(n.imagen);
                            const isVideo = videoThumb !== null;
                            const isVideoPlaceholder = videoThumb === "VIDEO_PLACEHOLDER";
                            
                            let imgSrc = "";
                            let hasCustomCover = false;
                            if (isVideoPlaceholder) {
                              const firstNonVideo = n.imagenes?.find((img: string) => getVideoThumbnailUrl(img) === null);
                              if (firstNonVideo) {
                                imgSrc = firstNonVideo;
                                hasCustomCover = true;
                              }
                            } else {
                              imgSrc = videoThumb || n.imagen || "/img/beneficios.png";
                            }
                            
                            return (
                              <>
                                {(isVideoPlaceholder && !hasCustomCover) ? (
                                  <div style={{
                                    width: "100%",
                                    height: "100%",
                                    background: "linear-gradient(135deg, #1e050b 0%, #7e1b1b 100%)",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    position: "relative"
                                  }}>
                                    <div style={{
                                      position: "absolute",
                                      top: 0, left: 0, right: 0, bottom: 0,
                                      opacity: 0.08,
                                      backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                                      backgroundSize: "16px 16px"
                                    }} />
                                    <span style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.08em", opacity: 0.8, textTransform: "uppercase", marginBottom: "0.4rem" }}>APROTURA MULTIMEDIA</span>
                                    <span style={{ fontSize: "0.82rem", fontWeight: 800, opacity: 0.9 }}>Ver Video</span>
                                  </div>
                                ) : (
                                  <img
                                    src={imgSrc}
                                    alt={n.titulo}
                                    className="card-img"
                                    onError={(e) => { e.currentTarget.src = "/img/beneficios.png"; }}
                                  />
                                )}
                                {isVideo && (
                                  <div style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    background: "rgba(158, 27, 27, 0.95)",
                                    borderRadius: "50%",
                                    width: "46px",
                                    height: "46px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                                    zIndex: 2,
                                  }}>
                                    <svg width="20" height="20" fill="white" viewBox="0 0 24 24" style={{ marginLeft: "2px" }}>
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <div className="card-body">
                          <h4 className="card-title">{n.titulo}</h4>
                          <div className="card-meta">
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span>{n.fecha}</span>
                          </div>
                          <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                            <span className="brand-badge">Leer más</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !featuredNews && (
                    <div className="empty-placeholder">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: "var(--graphite-light)", marginBottom: "1rem" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 012 2v7a2 2 0 01-2 2H9a2 2 0 01-2-2v-1" />
                      </svg>
                      <h3>No se encontraron noticias</h3>
                      <p>Intenta con otra palabra clave en el buscador.</p>
                    </div>
                  )
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-wrapper">
                    <button 
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-arrow"
                      aria-label="Página anterior"
                    >
                      ❮
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-num ${currentPage === page ? "active" : ""}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button 
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="pagination-arrow"
                      aria-label="Página siguiente"
                    >
                      ❯
                    </button>
                  </div>
                )}
                  </>
                )}
              </div>
            )}

            {/* B. TEMPLATE 2: DETAILED NEWS VIEW */}
            {selectedNews && (
              <div className="detailed-view-container">
                {/* Back button */}
                <button onClick={handleBack} className="back-button">
                  ← Atrás
                </button>

                {/* News Title & Location/Date Badge */}
                <div className="detailed-header">
                  <h1 className="detailed-title">{selectedNews.titulo}</h1>
                  <span className="detailed-badge-location">
                    {selectedNews.lugar || "Arequipa"}, {selectedNews.fecha}
                  </span>
                </div>

                {/* 2-Column Content Layout */}
                <div className="detailed-layout-grid">
                  {/* Left Column: Long paragraphs */}
                  <div className="detailed-left-col">
                    <p className="detailed-p-highlight">
                      {selectedNews.resumen}
                    </p>
                    {selectedNews.contenido ? (
                      selectedNews.contenido.split("\n").filter((p: string) => p.trim() !== "").map((paragraph: string, idx: number) => (
                        <p key={idx} className="detailed-p">
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <>
                        <p className="detailed-p">
                          El desarrollo del sector turístico en la región requiere de profesionales sumamente comprometidos, actualizados y capacitados con herramientas modernas de atención, marketing e interpretación. Desde APROTURA impulsamos y coordinamos convenios estratégicos que busquen la excelencia y el reconocimiento de nuestros técnicos y profesionales asociados.
                        </p>
                        <p className="detailed-p">
                          Agradecemos la participación de todos nuestros asociados en estas iniciativas, los invitamos a mantenerse al tanto de nuevos comunicados e incorporarse a nuestros grupos de trabajo oficiales para seguir aportando a la puesta en valor del patrimonio de Arequipa.
                        </p>
                      </>
                    )}

                    {/* Social sharing */}
                    <div className="share-section">
                      <span className="share-text">Comparte en tus redes sociales:</span>
                      <div className="share-social-icons">
                        {/* Facebook icon */}
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="share-icon-btn fb">
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        </a>
                        {/* Twitter/X icon */}
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="share-icon-btn tw">
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                        {/* LinkedIn icon */}
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="share-icon-btn ln">
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Stacked Images (Dynamic Multi-photo Gallery) */}
                  <div className="detailed-right-col">
                    {selectedNews.imagenes && selectedNews.imagenes.length > 0 ? (
                      selectedNews.imagenes.map((imgUrl: string, idx: number) => {
                        const embedUrl = getVideoEmbedUrl(imgUrl);
                        return (
                          <div key={idx} className="detailed-img-container" style={{ width: "100%" }}>
                            {embedUrl ? (
                              <iframe
                                src={embedUrl}
                                title={`${selectedNews.titulo} - ${idx + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ width: "100%", height: "280px", border: "none", borderRadius: "8px" }}
                              />
                            ) : (
                              <img 
                                src={imgUrl} 
                                alt={`${selectedNews.titulo} - ${idx + 1}`} 
                                className="detailed-side-img"
                                onError={(e) => { e.currentTarget.src = "/img/beneficios.png"; }}
                              />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <>
                        <div className="detailed-img-container" style={{ width: "100%" }}>
                          {getVideoEmbedUrl(selectedNews.imagen) ? (
                            <iframe
                              src={getVideoEmbedUrl(selectedNews.imagen) || ""}
                              title={selectedNews.titulo}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              style={{ width: "100%", height: "280px", border: "none", borderRadius: "8px" }}
                            />
                          ) : (
                            <img 
                              src={selectedNews.imagen || "/img/beneficios.png"} 
                              alt={selectedNews.titulo} 
                              className="detailed-side-img"
                              onError={(e) => { e.currentTarget.src = "/img/beneficios.png"; }}
                            />
                          )}
                        </div>
                        <div className="detailed-img-container">
                          {/* Secondary related image fallback to other static public assets */}
                          <img 
                            src="/img/aprotura_sede.png" 
                            alt="Sede APROTURA" 
                            className="detailed-side-img"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* B2. SLIDER: Últimas noticias */}
                {otrasNoticias.length > 0 && (
                  <div className="otras-noticias-section">
                    <h3 className="otras-noticias-title">Últimas noticias</h3>
                    
                    <div className="otras-slider-wrapper">
                      {/* Left navigation arrow */}
                      <button 
                        onClick={scrollLatestLeft}
                        className="slider-arrow left"
                        aria-label="Desplazar izquierda"
                      >
                        ❮
                      </button>

                      {/* Slider Container */}
                      <div 
                        ref={latestSliderRef}
                        onScroll={handleLatestScroll}
                        className="otras-slider-container"
                      >
                        {otrasNoticias.map((n) => (
                          <div 
                            key={n.id}
                            onClick={() => handleNewsClick(n)}
                            className="otras-card-item"
                          >
                            <div className="card-img-wrapper" style={{ position: "relative" }}>
                              {(() => {
                                const videoThumb = getVideoThumbnailUrl(n.imagen);
                                const isVideo = videoThumb !== null;
                                const isVideoPlaceholder = videoThumb === "VIDEO_PLACEHOLDER";
                                const imgSrc = isVideoPlaceholder ? "" : (videoThumb || n.imagen || "/img/beneficios.png");
                                
                                return (
                                  <>
                                    {isVideoPlaceholder ? (
                                      <div style={{
                                        width: "100%",
                                        height: "100%",
                                        background: "linear-gradient(135deg, #120205 0%, #1c0307 40%, #2a050a 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                      }} />
                                    ) : (
                                      <img
                                        src={imgSrc}
                                        alt={n.titulo}
                                        className="card-img"
                                        onError={(e) => { e.currentTarget.src = "/img/beneficios.png"; }}
                                      />
                                    )}
                                    {isVideo && (
                                      <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        background: "rgba(158, 27, 27, 0.95)",
                                        borderRadius: "50%",
                                        width: "46px",
                                        height: "46px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                                        zIndex: 2,
                                      }}>
                                        <svg width="20" height="20" fill="white" viewBox="0 0 24 24" style={{ marginLeft: "2px" }}>
                                          <path d="M8 5v14l11-7z" />
                                        </svg>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                            <div className="card-body">
                              <h4 className="card-title">{n.titulo}</h4>
                              <div className="card-meta">
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>{n.fecha}</span>
                              </div>
                              <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                                 <span className="brand-badge">Leer más</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right navigation arrow */}
                      <button 
                        onClick={scrollLatestRight}
                        className="slider-arrow right"
                        aria-label="Desplazar derecha"
                      >
                        ❯
                      </button>
                    </div>

                    {/* Slider dots pagination */}
                    <div className="slider-dots">
                      {otrasNoticias.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => scrollLatestTo(i)}
                          className={`slider-dot ${activeLatestPage === i ? "active" : ""}`}
                          aria-label={`Ir a noticia ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      )}

      <style>{`
        /* Hero Banner Styles (Nosotros-Style Curved Banner) */
        .noticias-hero {
          position: relative;
          overflow: hidden;
          border-bottom-right-radius: 80px;
          min-height: 360px;
          display: flex;
          align-items: center;
          background: linear-gradient(135deg, #120205 0%, #1c0307 40%, #2a050a 100%);
          padding: 7.5rem 0 0 0;
        }
        .noticias-hero-bg {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 55%;
          background-image: url('/img/noticias_banner.png');
          background-size: cover;
          background-position: center right;
          z-index: 1;
        }
        .noticias-hero-overlay {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(90deg, #120205 45%, rgba(18, 2, 5, 0.8) 60%, rgba(18, 2, 5, 0) 100%);
          z-index: 2;
        }

        /* Listing Header styles */
        .listing-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .listing-main-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 850;
          color: black;
          margin-bottom: 2rem;
          letter-spacing: -0.01em;
        }

        .search-section {
          max-width: 550px;
          margin: 0 auto;
          text-align: left;
        }

        .search-label {
          display: block;
          font-size: 0.88rem;
          color: var(--graphite-light);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .search-wrapper {
          position: relative;
          width: 100%;
        }

        .search-input {
          width: 100%;
          border: 1.5px solid var(--chalk-dark);
          border-radius: 8px;
          padding: 0.65rem 1rem 0.65rem 2.5rem;
          font-family: var(--font-body);
          font-size: 0.88rem;
          outline: none;
          color: var(--graphite);
          transition: border-color 0.2s;
          background-color: var(--white);
        }

        .search-input:focus {
          border-color: var(--crimson);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--graphite-light);
          pointer-events: none;
        }

        /* Template 1: Featured News Block */
        .featured-news-block {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2.5rem;
          background: var(--white);
          border-radius: 20px;
          border: 1px solid var(--chalk-dark);
          overflow: hidden;
          margin-bottom: 4rem;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: var(--shadow-sm);
          align-items: center;
        }

        .featured-news-block:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(158, 27, 27, 0.2);
        }

        .featured-news-img-wrapper {
          height: 380px;
          overflow: hidden;
          background: var(--chalk-dark);
        }

        .featured-news-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .featured-news-block:hover .featured-news-img {
          transform: scale(1.03);
        }

        .featured-news-content {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .featured-news-title {
          font-family: var(--font-display);
          font-size: 1.6rem;
          font-weight: 750;
          color: black;
          line-height: 1.3;
          margin: 0;
        }

        .featured-news-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: var(--graphite-light);
        }

        .brand-badge {
          display: inline-block;
          background-color: var(--crimson);
          color: var(--white);
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.45rem 1.15rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Template 1: News Grid Styles */
        .news-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .news-card-item {
          background: var(--white);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--chalk-dark);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          height: 100%;
        }

        .news-card-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: rgba(158, 27, 27, 0.2);
        }

        .card-img-wrapper {
          height: 200px;
          overflow: hidden;
          background: var(--chalk-dark);
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .news-card-item:hover .card-img {
          transform: scale(1.05);
        }

        .card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          font-weight: 700;
          color: black;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 4.2em;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.76rem;
          color: var(--graphite-light);
          margin-bottom: 1rem;
        }

        /* Pagination styles */
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .pagination-num, .pagination-arrow {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          border: 1px solid var(--chalk-dark);
          background: var(--white);
          color: var(--graphite);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .pagination-num:hover, .pagination-arrow:hover:not(:disabled) {
          background: var(--chalk);
          border-color: var(--graphite-light);
        }

        .pagination-num.active {
          background: var(--crimson);
          color: var(--white);
          border-color: var(--crimson);
        }

        .pagination-arrow:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* B. TEMPLATE 2: DETAILED NEWS VIEW */
        .detailed-view-container {
          text-align: left;
        }

        .back-button {
          background-color: var(--crimson);
          color: var(--white);
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.6rem 1.6rem;
          border-radius: 100px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
          display: inline-flex;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .back-button:hover {
          background-color: var(--gold-dark);
          transform: translateY(-1px);
        }

        .detailed-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .detailed-title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 800;
          color: black;
          line-height: 1.25;
          margin: 0;
          max-width: 800px;
        }

        .detailed-badge-location {
          background-color: #d6bda5; /* Beige / light brown badge like template */
          color: var(--white);
          font-size: 0.8rem;
          font-weight: 700;
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
          white-space: nowrap;
          box-shadow: var(--shadow-sm);
        }

        .detailed-layout-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 4rem;
          align-items: start;
          margin-bottom: 5rem;
        }

        .detailed-left-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .detailed-p-highlight {
          font-size: 1.15rem;
          line-height: 1.7;
          color: var(--graphite);
          font-weight: 600;
          margin: 0 0 0.5rem 0;
          border-left: 4px solid var(--crimson);
          padding-left: 1.25rem;
        }

        .detailed-p {
          font-size: 0.96rem;
          line-height: 1.75;
          color: var(--graphite-light);
          margin: 0;
        }

        .share-section {
          border-top: 1px solid var(--chalk-dark);
          padding-top: 2rem;
          margin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .share-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--graphite);
        }

        .share-social-icons {
          display: flex;
          gap: 0.75rem;
        }

        .share-icon-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          transition: transform 0.2s, filter 0.2s;
        }

        .share-icon-btn:hover {
          transform: scale(1.1);
          filter: brightness(0.95);
        }

        .share-icon-btn.fb { background-color: #3b5998; }
        .share-icon-btn.tw { background-color: #1da1f2; }
        .share-icon-btn.ln { background-color: #0077b5; }

        .detailed-right-col {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .detailed-img-container {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .detailed-side-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* B2. Otras Noticias Section (Slider) */
        .otras-noticias-section {
          border-top: 1px solid var(--chalk-dark);
          padding-top: 4rem;
        }

        .otras-noticias-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 800;
          color: black;
          margin-bottom: 2.5rem;
        }

        .otras-slider-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
        }

        .otras-slider-container {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 0.5rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
          width: 100%;
        }

        .otras-slider-container::-webkit-scrollbar {
          display: none;
        }

        .otras-card-item {
          flex: 0 0 320px;
          background: var(--white);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--chalk-dark);
          box-shadow: var(--shadow-sm);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .otras-card-item:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: rgba(158, 27, 27, 0.2);
        }

        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--chalk-dark);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          z-index: 10;
          font-size: 0.85rem;
          color: var(--graphite-light);
          transition: all 0.2s;
        }

        .slider-arrow:hover {
          background: var(--crimson);
          color: var(--white);
          border-color: var(--crimson);
        }

        .slider-arrow.left { left: -10px; }
        .slider-arrow.right { right: -10px; }

        .slider-dots {
          display: flex;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 2rem;
        }

        .slider-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--chalk-dark);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .slider-dot.active {
          background-color: var(--crimson);
          transform: scale(1.25);
        }

        /* Placeholders & General utilities */
        .loading-placeholder, .empty-placeholder {
          text-align: center;
          padding: 6rem 0;
          color: var(--graphite-light);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--chalk-dark);
          border-top-color: var(--crimson);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-placeholder h3 {
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--graphite);
          margin-bottom: 0.5rem;
        }

        /* Responsive Layout styles */
        @media (max-width: 991px) {
          .featured-news-block {
            grid-template-columns: 1fr;
          }
          .featured-news-img-wrapper {
            height: 280px;
          }
          .news-cards-grid {
            grid-template-columns: 1fr 1fr;
          }
          .detailed-layout-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .noticias-hero {
            padding: 6rem 0 0 0;
            border-bottom-right-radius: 50px;
            min-height: 280px;
          }
          .noticias-hero-bg {
            width: 100%;
          }
          .noticias-hero-overlay {
            background: linear-gradient(180deg, rgba(18, 2, 5, 0.95) 0%, rgba(18, 2, 5, 0.85) 60%, rgba(18, 2, 5, 0.7) 100%);
          }
        }

        @media (max-width: 768px) {
          .news-cards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .detailed-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .detailed-badge-location {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
