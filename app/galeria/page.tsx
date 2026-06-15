"use client";

import React, { useState, useEffect } from "react";

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


const categories = ["Todos", "Eventos", "Capacitaciones", "Cultura", "Guiados"];

export default function GaleriaPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxSubIndex, setLightboxSubIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [activeImageIndices, setActiveImageIndices] = useState<{ [itemId: string]: number }>({});

  // Fetch gallery items from database
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/galeria");
        if (res.ok) {
          const data = await res.json();
          const grouped: { [key: string]: any } = {};
          (data || []).forEach((item: any) => {
            const key = `${item.titulo}-${item.descripcion}-${item.categoria}-${item.ubicacion}-${item.fecha}`;
            if (!grouped[key]) {
              grouped[key] = {
                id: item.id,
                title: item.titulo,
                category: item.categoria,
                images: [item.imagen], // array of URLs
                description: item.descripcion,
                location: item.ubicacion,
                date: item.fecha,
              };
            } else {
              grouped[key].images.push(item.imagen);
            }
          });
          const dbItems = Object.values(grouped);
          setGalleryItems(dbItems);
        }
      } catch (err) {
        console.error("Error fetching gallery:", err);
      }
    };
    fetchGallery();
  }, []);

  // Filter gallery items based on category
  const filteredItems = activeCategory === "Todos"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (item: any, index: number) => {
    setLightboxImage(item);
    setLightboxIndex(index);
    setLightboxSubIndex(activeImageIndices[item.id] || 0);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const navigateLightbox = (direction: number) => {
    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) {
      newIndex = filteredItems.length - 1;
    } else if (newIndex >= filteredItems.length) {
      newIndex = 0;
    }
    setLightboxIndex(newIndex);
    setLightboxImage(filteredItems[newIndex]);
    setLightboxSubIndex(0); // reset slide position on post change
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage === null) return;
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        navigateLightbox(-1);
      } else if (e.key === "ArrowRight") {
        navigateLightbox(1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImage, lightboxIndex, activeCategory]);

  return (
    <div style={{ background: "var(--white)", minHeight: "100vh" }}>
      {/* 1. HERO BANNER (Image Only) */}
      <section className="galeria-hero">
        <img 
          src="/img/galeria_banner.png" 
          alt="Galería APROTURA" 
          className="galeria-hero-img"
        />
      </section>

      {/* 2. GRID AND CONTROLS SECTION */}
      <section style={{ padding: "4rem 0 6rem 0" }}>
        <div className="container">
          
          {/* Category Filter Tabs */}
          <div className="filter-tabs-container">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  closeLightbox();
                }}
                className={`filter-tab-btn ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {filteredItems.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "5rem 2rem",
              background: "var(--chalk)",
              borderRadius: "16px",
              border: "1.5px dashed var(--chalk-dark)",
            }}>
              <p style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--graphite-light)",
                marginBottom: "0.5rem",
              }}>
                No hay fotografías publicadas en esta sección.
              </p>
              <p style={{
                fontSize: "0.88rem",
                color: "var(--graphite-light)",
                opacity: 0.7,
              }}>
                Las fotos serán publicadas por el administrador.
              </p>
            </div>
          ) : (
            <div className="gallery-grid animate-fadeIn">
              {filteredItems.map((item, index) => {
                const activeIdx = activeImageIndices[item.id] || 0;
                const currentImage = item.images[activeIdx] || item.images[0];
                const videoThumb = getVideoThumbnailUrl(currentImage);
                const isVideo = videoThumb !== null;
                const isVideoPlaceholder = videoThumb === "VIDEO_PLACEHOLDER";
                
                let imgSrc = "";
                let hasCustomCover = false;
                if (isVideoPlaceholder) {
                  const firstNonVideo = item.images.find((img: string) => getVideoThumbnailUrl(img) === null);
                  if (firstNonVideo) {
                    imgSrc = firstNonVideo;
                    hasCustomCover = true;
                  }
                } else {
                  imgSrc = videoThumb || currentImage;
                }
                
                return (
                  <div 
                    key={item.id} 
                    onClick={() => openLightbox(item, index)} 
                    className="gallery-card-item"
                  >
                    <div className="card-img-wrapper" style={{ position: "relative" }}>
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
                        <img src={imgSrc} alt={item.title} className="card-img" />
                      )}
                      
                      {isVideo && (
                        <div style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "rgba(158, 27, 27, 0.95)",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
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
                      
                      {item.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newIdx = activeIdx === 0 ? item.images.length - 1 : activeIdx - 1;
                              setActiveImageIndices(prev => ({ ...prev, [item.id]: newIdx }));
                            }}
                            style={{
                              position: "absolute",
                              left: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "rgba(18,2,5,0.7)",
                              border: "none",
                              color: "white",
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              cursor: "pointer",
                              zIndex: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              fontSize: "12px",
                              transition: "background 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--crimson)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(18,2,5,0.7)"}
                          >
                            ❮
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newIdx = activeIdx === item.images.length - 1 ? 0 : activeIdx + 1;
                              setActiveImageIndices(prev => ({ ...prev, [item.id]: newIdx }));
                            }}
                            style={{
                              position: "absolute",
                              right: "10px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "rgba(18,2,5,0.7)",
                              border: "none",
                              color: "white",
                              borderRadius: "50%",
                              width: "30px",
                              height: "30px",
                              cursor: "pointer",
                              zIndex: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              fontSize: "12px",
                              transition: "background 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--crimson)"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(18,2,5,0.7)"}
                          >
                            ❯
                          </button>
                          {/* Indicators dot bar */}
                          <div style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            display: "flex",
                            gap: "4px",
                            zIndex: 10
                          }}>
                            {item.images.map((_: string, dotIdx: number) => (
                              <div
                                key={dotIdx}
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: dotIdx === activeIdx ? "var(--crimson)" : "rgba(255,255,255,0.5)",
                                  transition: "all 0.2s"
                                }}
                              />
                            ))}
                          </div>
                        </>
                      )}
                      
                      {/* Photo Hover Overlay */}
                      <div className="card-hover-overlay" />
                    </div>

                    <div className="card-body">
                      <span className="card-category-text">{item.category}</span>
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-desc truncate">{item.description}</p>
                      
                      <div className="card-footer-meta">
                        <div className="meta-item">
                          <span>{item.location}</span>
                        </div>
                        <div className="meta-item">
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 3. INTERACTIVE LIGHTBOX MODAL */}
      {lightboxImage && (
        <div className="lightbox-modal animate-fadeIn" onClick={closeLightbox}>
          {/* Modal Close Button */}
          <button className="lightbox-close-btn" onClick={closeLightbox} aria-label="Cerrar galería">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
 
          {/* Left Arrow Button */}
          <button 
            className="lightbox-nav-btn left" 
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(-1);
            }} 
            aria-label="Imagen anterior"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
 
          {/* Center Content Area */}
          <div className="lightbox-content-box" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-container" style={{ position: "relative" }}>
              {(() => {
                const currentImg = lightboxImage.images[lightboxSubIndex] || lightboxImage.images[0];
                const embedUrl = getVideoEmbedUrl(currentImg);
                if (embedUrl?.startsWith("DIRECT_VIDEO:")) {
                  const videoUrl = embedUrl.replace("DIRECT_VIDEO:", "");
                  return (
                    <video
                      src={videoUrl}
                      controls
                      style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#000" }}
                    />
                  );
                }
                return embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={lightboxImage.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ width: "100%", height: "100%", border: "none" }}
                  />
                ) : (
                  <img 
                    src={currentImg} 
                    alt={lightboxImage.title} 
                    className="lightbox-main-img" 
                  />
                );
              })()}

              {lightboxImage.images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setLightboxSubIndex(prev => prev === 0 ? lightboxImage.images.length - 1 : prev - 1);
                    }}
                    style={{
                      position: "absolute",
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(18,2,5,0.85)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "white",
                      borderRadius: "50%",
                      width: "38px",
                      height: "38px",
                      cursor: "pointer",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px"
                    }}
                  >
                    ❮
                  </button>
                  <button
                    onClick={() => {
                      setLightboxSubIndex(prev => prev === lightboxImage.images.length - 1 ? 0 : prev + 1);
                    }}
                    style={{
                      position: "absolute",
                      right: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "rgba(18,2,5,0.85)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "white",
                      borderRadius: "50%",
                      width: "38px",
                      height: "38px",
                      cursor: "pointer",
                      zIndex: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px"
                    }}
                  >
                    ❯
                  </button>

                  <div style={{
                    position: "absolute",
                    bottom: "15px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "6px",
                    zIndex: 10
                  }}>
                    {lightboxImage.images.map((_: string, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: idx === lightboxSubIndex ? "var(--crimson)" : "rgba(255,255,255,0.5)",
                          transition: "all 0.2s"
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Image Detail Card */}
            <div className="lightbox-details-card">
              <div className="details-header-row">
                <span className="details-badge">{lightboxImage.category}</span>
                <span className="details-date">{lightboxImage.date}</span>
              </div>
              <h3 className="details-title">{lightboxImage.title}</h3>
              <p className="details-desc">{lightboxImage.description}</p>
              
              <div className="details-location-row">
                <span>{lightboxImage.location}</span>
              </div>
            </div>
          </div>
 
          {/* Right Arrow Button */}
          <button 
            className="lightbox-nav-btn right" 
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox(1);
            }} 
            aria-label="Siguiente imagen"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <style>{`
        .galeria-hero {
          position: relative;
          overflow: hidden;
          width: 100%;
          margin-top: 70px;
        }

        .galeria-hero-img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Filter Tabs */
        .filter-tabs-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3.5rem;
          flex-wrap: wrap;
        }

        .filter-tab-btn {
          background-color: var(--white);
          color: var(--graphite-light);
          font-family: var(--font-body);
          font-size: 0.88rem;
          font-weight: 700;
          padding: 0.6rem 1.6rem;
          border: 1.5px solid var(--chalk-dark);
          border-radius: 100px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
        }

        .filter-tab-btn:hover {
          background-color: rgba(158, 27, 27, 0.04);
          color: var(--crimson);
          border-color: rgba(158, 27, 27, 0.2);
        }

        .filter-tab-btn.active {
          background-color: var(--crimson);
          color: var(--white);
          border-color: var(--crimson);
          box-shadow: var(--shadow-md);
        }

        /* Gallery Grid */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .gallery-card-item {
          background-color: var(--white);
          border-radius: 20px;
          border: 1px solid var(--chalk-dark);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .gallery-card-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: rgba(158, 27, 27, 0.2);
        }

        .card-img-wrapper {
          position: relative;
          height: 240px;
          overflow: hidden;
          background-color: var(--chalk-dark);
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .gallery-card-item:hover .card-img {
          transform: scale(1.05);
        }

        .card-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(18, 2, 5, 0.4);
          opacity: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s ease;
        }

        .gallery-card-item:hover .card-hover-overlay {
          opacity: 1;
        }

        .card-category-text {
          color: var(--crimson);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: block;
        }

        .card-body {
          padding: 1.5rem;
          text-align: left;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 800;
          color: black;
          margin-bottom: 0.5rem;
          line-height: 1.35;
        }

        .card-desc {
          font-size: 0.82rem;
          line-height: 1.6;
          color: var(--graphite-light);
          margin-bottom: 1.25rem;
          flex-grow: 1;
        }

        .truncate {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer-meta {
          border-top: 1px solid var(--chalk-dark);
          padding-top: 0.85rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          font-size: 0.74rem;
          color: var(--graphite-light);
          font-weight: 600;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          min-width: 0;
        }

        .meta-item span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ─── LIGHTBOX MODAL ────────────────────────────────────── */
        .lightbox-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(12, 1, 3, 0.93);
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
          user-select: none;
        }

        .lightbox-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          color: var(--white);
          opacity: 0.7;
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1070;
        }

        .lightbox-close-btn:hover {
          opacity: 1;
          transform: scale(1.1);
          color: var(--crimson);
        }

        .lightbox-nav-btn {
          background: rgba(18, 2, 5, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--white);
          opacity: 0.7;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 1060;
          position: absolute;
        }

        .lightbox-nav-btn:hover {
          opacity: 1;
          background-color: var(--crimson);
          border-color: var(--crimson);
          color: var(--white);
        }

        .lightbox-nav-btn.left { left: 2.5rem; }
        .lightbox-nav-btn.right { right: 2.5rem; }

        .lightbox-content-box {
          max-width: 1080px;
          width: 100%;
          display: flex;
          flex-direction: row;
          height: 560px;
          background-color: var(--white);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .lightbox-image-container {
          background-color: #0b0103;
          width: 70%;
          height: 100%;
          display: flex;
          align-items: center;
          justifyContent: "center",
          overflow: hidden;
        }

        .lightbox-main-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          display: block;
        }

        .lightbox-details-card {
          width: 30%;
          height: 100%;
          padding: 2.5rem 2rem;
          background-color: var(--white);
          text-align: left;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          border-left: 1px solid var(--chalk-dark);
        }

        .details-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .details-badge {
          color: var(--crimson);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .details-date {
          font-size: 0.8rem;
          color: var(--graphite-light);
          font-weight: 600;
        }

        .details-title {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 850;
          color: black;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .details-desc {
          font-size: 0.88rem;
          line-height: 1.65;
          color: var(--graphite-light);
          margin-bottom: 1.5rem;
          flex-grow: 1;
          padding-right: 0.25rem;
        }

        .details-location-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.8rem;
          color: var(--crimson);
          font-weight: 750;
          margin-top: auto;
        }

        /* ─── RESPONSIVE UTILITIES ────────────────────────────────── */
        @media (max-width: 1199px) {
          .lightbox-nav-btn.left { left: 1.5rem; }
          .lightbox-nav-btn.right { right: 1.5rem; }
        }

        @media (max-width: 991px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          .lightbox-content-box {
            flex-direction: column;
            height: auto;
            max-width: 680px;
          }
          .lightbox-image-container {
            width: 100%;
            height: 380px;
          }
          .lightbox-details-card {
            width: 100%;
            height: auto;
            border-left: none;
            border-top: 1px solid var(--chalk-dark);
            padding: 1.75rem 2rem;
          }
          .details-desc {
            max-height: 140px;
            overflow-y: auto;
          }
        }

        @media (max-width: 767px) {
          .lightbox-modal {
            padding: 1rem;
          }
          .lightbox-nav-btn {
            position: fixed;
            bottom: 2rem;
            width: 44px;
            height: 44px;
            transform: none;
            top: auto;
          }
          .lightbox-nav-btn.left { left: calc(50% - 60px); }
          .lightbox-nav-btn.right { right: calc(50% - 60px); }
          .lightbox-content-box {
            border-radius: 16px;
            flex-direction: column;
            height: auto;
          }
          .lightbox-image-container {
            width: 100%;
            height: 260px;
          }
          .lightbox-details-card {
            width: 100%;
            padding: 1.25rem;
          }
          .lightbox-close-btn {
            top: 1rem;
            right: 1rem;
          }
        }

        @media (max-width: 576px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .filter-tabs-container {
            gap: 0.5rem;
            margin-bottom: 2.5rem;
          }
          .filter-tab-btn {
            font-size: 0.82rem;
            padding: 0.5rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
