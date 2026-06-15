"use client";

import React from "react";

export default function SobreNosotros() {
  return (
    <section id="sobre-nosotros" style={{
      padding: "var(--section-py) 0",
      background: "var(--chalk)",
      position: "relative",
    }}>
      <div className="container">
        
        {/* Main Section Header */}
        <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
          <h2 className="section-title" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", fontWeight: 800, margin: "0 auto", maxWidth: "800px" }}>
            Nuestros objetivos, iniciativas y desarrollo institucional en Arequipa
          </h2>
        </div>

        {/* Content Layout (Overlapping Cards Style) */}
        <div className="sobre-nosotros-blocks">
          
          {/* Block 1: Left Image, Right Card */}
          <div className="sobre-nosotros-row">
            <div className="sobre-nosotros-img-col">
              <img 
                src="/img/sobre_nosotros_guia.png" 
                alt="Guías de Turismo en Arequipa" 
                className="sobre-nosotros-img" 
              />
            </div>
            <div className="sobre-nosotros-card-col">
              <div className="sobre-nosotros-card">
                <span className="section-label" style={{ marginBottom: "1rem" }}>Sobre Nosotros</span>
                <h3 className="card-title">Liderando el Turismo Profesional en Arequipa</h3>
                <p className="card-text">
                  <strong>APROTURA</strong> – Asociación de Profesionales y Técnicos de Turismo Arequipa, fue fundada con el propósito de elevar los estándares del sector turístico en nuestra región.
                </p>
                <p className="card-text">
                  Con más de 5 años de trayectoria, hemos capacitado a cientos de profesionales, organizado eventos culturales de alto impacto y tejido alianzas estratégicas con instituciones públicas y privadas para impulsar el turismo sostenible y responsable de Arequipa hacia el mundo.
                </p>
              </div>
            </div>
          </div>

          {/* Block 2: Left Card, Right Image */}
          <div className="sobre-nosotros-row reverse-row">
            <div className="sobre-nosotros-card-col">
              <div className="sobre-nosotros-card">
                <h3 className="card-title">Líneas de Acción</h3>
                
                <div className="timeline-list">
                  <div className="timeline-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--crimson)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Capacitación
                    </div>
                    <div className="timeline-desc" style={{ fontSize: "0.88rem", color: "var(--graphite-light)", fontWeight: 500 }}>
                      Cursos especializados y talleres para guías y agencias del sector.
                    </div>
                  </div>
                  <div className="timeline-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--crimson)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Sostenibilidad
                    </div>
                    <div className="timeline-desc" style={{ fontSize: "0.88rem", color: "var(--graphite-light)", fontWeight: 500 }}>
                      Impulso de proyectos de ecoturismo y cuidado del medio ambiente.
                    </div>
                  </div>
                  <div className="timeline-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--crimson)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Formalización
                    </div>
                    <div className="timeline-desc" style={{ fontSize: "0.88rem", color: "var(--graphite-light)", fontWeight: 500 }}>
                      Apoyo al registro oficial de los profesionales ante el MINCETUR.
                    </div>
                  </div>
                  <div className="timeline-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 800, color: "var(--crimson)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                      Promoción
                    </div>
                    <div className="timeline-desc" style={{ fontSize: "0.88rem", color: "var(--graphite-light)", fontWeight: 500 }}>
                      Posicionamiento y difusión de Arequipa como destino turístico mundial.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sobre-nosotros-img-col">
              <img 
                src="/img/sobre_nosotros_taller.png" 
                alt="Talleres de Turismo APROTURA" 
                className="sobre-nosotros-img" 
              />
            </div>
          </div>

        </div>

      </div>

      <style>{`
        .sobre-nosotros-blocks {
          display: flex;
          flex-direction: column;
          gap: 6rem;
        }

        .sobre-nosotros-row {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          align-items: center;
          position: relative;
        }

        .sobre-nosotros-row.reverse-row {
          grid-template-columns: 0.85fr 1.15fr;
        }

        .sobre-nosotros-img-col {
          width: 100%;
          height: 440px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          z-index: 1;
        }

        .sobre-nosotros-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .sobre-nosotros-card-col {
          z-index: 2;
          position: relative;
        }

        .sobre-nosotros-row:not(.reverse-row) .sobre-nosotros-card-col {
          margin-left: -90px;
        }

        .sobre-nosotros-row.reverse-row .sobre-nosotros-card-col {
          margin-right: -90px;
        }

        .sobre-nosotros-card {
          background: var(--white);
          padding: 3.25rem 3rem;
          border-radius: 20px;
          box-shadow: 0 15px 40px rgba(158, 27, 27, 0.03);
          border: 1px solid var(--chalk-dark);
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--graphite);
          margin-bottom: 1.25rem;
          line-height: 1.25;
        }

        .card-text {
          font-size: 0.94rem;
          color: var(--graphite-light);
          line-height: 1.75;
          margin-bottom: 1rem;
        }

        .card-text:last-of-type {
          margin-bottom: 0;
        }

        .timeline-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .timeline-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0.5rem 0;
          border-bottom: 1px dashed var(--chalk-dark);
        }

        .timeline-item:last-of-type {
          border-bottom: none;
          padding-bottom: 0;
        }

        .timeline-year {
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--crimson);
          min-width: 60px;
          letter-spacing: 0.02em;
        }

        .timeline-desc {
          font-size: 0.9rem;
          color: var(--graphite-light);
          font-weight: 500;
        }

        @media (max-width: 900px) {
          .sobre-nosotros-blocks {
            gap: 4rem;
          }

          .sobre-nosotros-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem;
          }

          .sobre-nosotros-row.reverse-row {
            flex-direction: column-reverse !important;
          }

          .sobre-nosotros-img-col {
            height: 280px;
          }

          .sobre-nosotros-card-col {
            margin-left: 0 !important;
            margin-right: 0 !important;
            width: 100%;
          }

          .sobre-nosotros-card {
            padding: 2.25rem 2rem;
          }
        }
      `}</style>
    </section>
  );
}
