"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const defaultWelcomeSlide = {
  id: "default-welcome",
  badge: "APROTURA Arequipa",
  title: "Profesionales del Turismo Arequipeño",
  highlightText: "Turismo Arequipeño",
  description: "Asociación de Profesionales y Técnicos de Turismo de Arequipa. Promovemos el desarrollo turístico y la capacitación profesional en nuestra región desde el año 2020.",
  ctaText: "Ver Cursos",
  ctaLink: "/cursos",
  btnStyle: "primary",
  image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80",
  onlyImage: false,
};

export default function HeroSection() {
  const [slides, setSlides] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("/api/active-slides");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setSlides(data);
          } else {
            // Check fallback for testing in local storage
            if (typeof window !== "undefined") {
              const localMock = localStorage.getItem("mock_slides");
              if (localMock) {
                setSlides(JSON.parse(localMock));
              } else {
                // Load default welcome slide as permanent cover
                setSlides([defaultWelcomeSlide]);
              }
            }
          }
        }
      } catch (err) {
        // Fallback for developers/inspectors to test UI using localStorage
        if (typeof window !== "undefined") {
          const localMock = localStorage.getItem("mock_slides");
          if (localMock) {
            try {
              setSlides(JSON.parse(localMock));
            } catch (_) {
              setSlides([defaultWelcomeSlide]);
            }
          } else {
            setSlides([defaultWelcomeSlide]);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (isPlaying && slides.length > 1) {
      clearTimer();
      timeoutRef.current = setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
      }, 6000);
    }
    return () => clearTimer();
  }, [current, isPlaying, slides.length]);

  const handleDotClick = (index: number) => {
    setCurrent(index);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading || slides.length === 0) {
    return null; // Don't render anything while loading
  }

  return (
    <section 
      id="hero-slider"
      style={{
        position: "relative",
        background: "var(--white)",
        borderBottom: "1px solid var(--chalk-dark)",
        overflow: "hidden",
        width: "100%",
        paddingTop: "6.5rem", // offset for navbar
      }}
    >
      <div 
        style={{
          position: "relative",
          height: "440px",
          width: "100%",
        }}
      >
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id || index}
              style={{
                position: "absolute",
                inset: 0,
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 10 : 0,
                transition: "opacity 0.6s ease-in-out",
                display: "flex",
                alignItems: "center",
                pointerEvents: isActive ? "auto" : "none",
              }}
            >
              {/* Slide background image with aspect ratio fitting (no zoom/cropping) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                  background: "var(--white)",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Blurred backdrop to fill empty space with matching colors */}
                <img
                  src={slide.image}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    filter: "blur(20px) brightness(0.95)",
                    opacity: 0.3,
                    transform: "scale(1.15)",
                    pointerEvents: "none",
                  }}
                />
                {/* Crisp original image completely visible */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    zIndex: 2,
                  }}
                />
              </div>

              {/* Main Slide Layout Content */}
              <div 
                className="container" 
                style={{ 
                  width: "100%", 
                  display: "flex", 
                  alignItems: "flex-end", 
                  height: "100%", 
                  zIndex: 10, 
                  position: "relative",
                  paddingBottom: "3rem" 
                }}
              >
                {/* CTA Button */}
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link
                    href={slide.ctaLink}
                    className={slide.btnStyle === "gold" ? "btn-gold" : "btn-primary"}
                    style={{
                      fontSize: "0.85rem",
                      padding: "0.75rem 2.25rem",
                      borderRadius: "100px",
                      fontWeight: 700,
                      boxShadow: "var(--shadow-md)",
                    }}
                  >
                    {slide.ctaText}
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8} style={{ marginLeft: 4 }}>
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slider Controls: Only show if there is more than 1 slide */}
      {slides.length > 1 && (
        <div
          style={{
            position: "absolute",
            bottom: "1.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(8px)",
            padding: "0.4rem 1rem",
            borderRadius: "100px",
            border: "1px solid var(--chalk-dark)",
          }}
        >
          {/* Dot Indicators */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {slides.map((_, idx) => {
              const isActive = idx === current;
              return (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  style={{
                    width: isActive ? 20 : 8,
                    height: 8,
                    borderRadius: "100px",
                    background: isActive ? "var(--crimson)" : "var(--chalk-dark)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "all 0.3s ease",
                  }}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            style={{
              background: "none",
              border: "none",
              color: "var(--graphite-light)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              opacity: 0.8,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "0.8"}
            aria-label={isPlaying ? "Pausar slider" : "Reproducir slider"}
          >
            {isPlaying ? (
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          #hero-slider {
            padding-top: 5.5rem;
          }
          #hero-slider > div {
            height: auto !important;
            min-height: 360px;
            padding: 2.5rem 0;
          }
          #hero-slider > div > div {
            position: relative !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            display: block !important;
          }
          #hero-slider > div > div:not(:first-child) {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
