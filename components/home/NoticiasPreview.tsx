"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NoticiasPreview() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return null;
  }

  if (noticias.length === 0) {
    return null;
  }

  return (
    <section id="noticias-preview" style={{ padding: "var(--section-py) 0", background: "var(--white)" }}>
      <div className="container">
        {/* Main Encapsulated Box (Caja Arequipa Layout Style) */}
        <div className="noticias-box">
          
          {/* Left Column: Info & Action */}
          <div className="noticias-info-col">
            <span className="noticias-label">Últimas Noticias</span>
            <h2 className="noticias-box-title">
              Lo que está pasando en <span className="highlight-text">APROTURA</span>
            </h2>
            <p className="noticias-box-subtitle">
              Mantente informado sobre nuestras actividades, eventos y logros de la asociación.
            </p>
            <Link 
              href="/noticias" 
              className="btn-outline ver-todas-btn"
            >
              Ver todas las noticias →
            </Link>
          </div>

          {/* Right Column: Horizontal Cards Grid */}
          <div className="noticias-cards-grid">
            {noticias.map((n) => {
              const targetUrl = n.link || "https://www.facebook.com/aproturaqp/";
              return (
                <a
                  href={targetUrl}
                  key={n.id}
                  id={`noticia-card-${n.id}`}
                  className="news-box-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* Image Wrap */}
                  <div className="card-img-wrapper">
                    <img
                      src={n.imagen || "/img/beneficios.png"}
                      alt={n.titulo}
                      className="card-img"
                      onError={(e) => {
                        e.currentTarget.src = "/img/beneficios.png";
                      }}
                    />
                    {/* Category tag */}
                    <span className="category-tag">{n.categoria || "Novedad"}</span>
                  </div>

                  {/* Card Content */}
                  <div className="card-body">
                    <div className="card-meta">
                      <span className="meta-item">
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {n.fecha}
                      </span>
                      {n.lugar && (
                        <span className="meta-item">
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {n.lugar.split(",")[0]}
                        </span>
                      )}
                    </div>
                    <h3 className="card-title">{n.titulo}</h3>
                    <p className="card-desc">{n.resumen}</p>
                    <span className="card-link">
                      Leer más
                      <svg className="arrow-icon" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

        </div>
      </div>

      <style>{`
        /* Encapsulated container styled like the Caja Arequipa banner */
        .noticias-box {
          background: #FAF7F7; /* light chalk with extremely subtle warm crimson undertone */
          border-radius: 24px;
          padding: 3.5rem 3rem;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 3rem;
          align-items: center;
          border: 1px solid var(--chalk-dark);
          box-shadow: var(--shadow-sm);
        }

        /* Left Column */
        .noticias-info-col {
          display: flex;
          flex-direction: column;
        }

        .noticias-label {
          display: block;
          color: var(--crimson);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .noticias-box-title {
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 850;
          color: var(--graphite);
          line-height: 1.25;
          margin-bottom: 1.25rem;
        }

        .noticias-box-title .highlight-text {
          color: var(--crimson);
        }

        .noticias-box-subtitle {
          font-size: 0.88rem;
          line-height: 1.6;
          color: var(--graphite-light);
          margin-bottom: 2rem;
        }

        .ver-todas-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: fit-content;
          font-size: 0.82rem !important;
          padding: 0.65rem 1.75rem !important;
        }

        /* Right Column Grid */
        .noticias-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        /* Individual News Card */
        .news-box-card {
          background: var(--white);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 4px 15px rgba(158, 27, 27, 0.02);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          height: 100%;
        }

        .news-box-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(158, 27, 27, 0.08);
          border-color: var(--chalk-dark);
        }

        .card-img-wrapper {
          height: 145px;
          position: relative;
          overflow: hidden;
          background: var(--chalk-dark);
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .news-box-card:hover .card-img {
          transform: scale(1.06);
        }

        .category-tag {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: var(--white);
          color: var(--crimson);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.25rem 0.65rem;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          box-shadow: var(--shadow-sm);
          z-index: 2;
        }

        /* Card Body */
        .card-body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.72rem;
          color: var(--graphite-light);
          margin-bottom: 0.5rem;
        }

        .meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--graphite);
          margin-bottom: 0.5rem;
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          height: 2.6em; /* fixed height for alignment */
        }

        .card-desc {
          font-size: 0.8rem;
          color: var(--graphite-light);
          line-height: 1.5;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-grow: 1;
        }

        .card-link {
          color: var(--crimson);
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          transition: color 0.2s;
        }

        .news-box-card:hover .card-link {
          color: var(--crimson-light);
        }

        .arrow-icon {
          transition: transform 0.2s;
        }

        .news-box-card:hover .arrow-icon {
          transform: translateX(4px);
        }

        /* Responsive Layout */
        @media (max-width: 1100px) {
          .noticias-box {
            grid-template-columns: 1fr;
            padding: 3rem 2rem;
            gap: 2.5rem;
          }

          .noticias-info-col {
            text-align: center;
            align-items: center;
          }

          .noticias-box-subtitle {
            max-width: 500px;
          }
        }

        @media (max-width: 800px) {
          .noticias-cards-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 550px) {
          .noticias-cards-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
