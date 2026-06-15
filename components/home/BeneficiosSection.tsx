"use client";

import { useState, useEffect } from "react";

export default function BeneficiosSection() {
  const [activeImage, setActiveImage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev === 1 ? 2 : 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const benefitsLeft = [
    {
      title: "Respaldo Institucional",
      description: "Accede al padrón oficial de profesionales en turismo de Arequipa y mantente respaldado por un gremio formal.",
    },
    {
      title: "Capacitación Continua",
      description: "Participa de cursos oficiales, talleres prácticos y conferencias de especialización y guiado regional.",
    },
    {
      title: "Aula Virtual Activa",
      description: "Accede a tus clases, temarios y material educativo digital desde cualquier dispositivo y en cualquier momento.",
    },
  ];

  const benefitsRight = [
    {
      title: "Trámites en Mesa de Partes",
      description: "Envía solicitudes, habilitaciones y renovaciones de forma 100% virtual, rápida y sin salir de casa.",
    },
    {
      title: "Bolsa de Trabajo",
      description: "Vinculación directa con agencias de viaje y operadoras de turismo autorizadas de la región Arequipa.",
    },
    {
      title: "Eventos y Colaboración",
      description: "Participa de asambleas, congresos de turismo y redes de colaboración con otros profesionales del sector.",
    },
  ];

  return (
    <section 
      id="beneficios"
      style={{
        background: "var(--white)",
        padding: "var(--section-py) 0",
        borderBottom: "1px solid var(--chalk-dark)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span 
            style={{ 
              display: "block",
              color: "var(--crimson)",
              fontSize: "0.78rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "0.75rem"
            }}
          >
            Asociados y Estudiantes
          </span>
          <h2 className="section-title" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 800 }}>
            Conoce los beneficios de ser miembro de APROTURA
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto", fontSize: "0.95rem" }}>
            Promovemos el desarrollo profesional, la capacitación técnica y la digitalización de los profesionales de turismo en Arequipa.
          </p>
        </div>

        {/* Content Layout */}
        <div className="benefits-grid">
          {/* Left Column (Aligned Right on Desktop) */}
          <div className="benefits-col benefits-left">
            {benefitsLeft.map((b, idx) => (
              <div key={idx} className="benefit-item">
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.description}</p>
              </div>
            ))}
          </div>

          {/* Center Column (Image Slider) */}
          <div className="benefits-center">
            <div className="image-wrapper">
              <img 
                src="/img/beneficios.png" 
                alt="Beneficios APROTURA" 
                className="benefit-img"
                style={{
                  opacity: activeImage === 1 ? 1 : 0,
                  zIndex: activeImage === 1 ? 2 : 1,
                }}
              />
              <img 
                src="/img/beneficios2.png" 
                alt="Beneficios APROTURA 2" 
                className="benefit-img"
                style={{
                  opacity: activeImage === 2 ? 1 : 0,
                  zIndex: activeImage === 2 ? 2 : 1,
                }}
              />
            </div>
          </div>

          {/* Right Column (Aligned Left on Desktop) */}
          <div className="benefits-col benefits-right">
            {benefitsRight.map((b, idx) => (
              <div key={idx} className="benefit-item">
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .benefits-grid {
          display: grid;
          grid-template-columns: 1fr 460px 1fr;
          gap: 2.5rem;
          align-items: center;
        }

        .benefits-col {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .benefits-left {
          text-align: right;
        }

        .benefits-right {
          text-align: left;
        }

        .benefit-item {
          transition: transform 0.2s ease;
        }

        .benefit-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--graphite);
          margin-bottom: 0.5rem;
        }

        .benefit-desc {
          font-size: 0.88rem;
          line-height: 1.5;
          color: var(--graphite-light);
        }

        .benefits-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-wrapper {
          width: 100%;
          height: 500px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          animation: pulse-slow 4s infinite ease-in-out;
        }

        .benefit-img {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: auto;
          height: 100%;
          max-height: 500px;
          object-fit: contain;
          display: block;
          transition: opacity 0.8s ease-in-out;
        }

        @media (max-width: 991px) {
          .benefits-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .benefits-left {
            text-align: center;
            order: 2;
          }

          .benefits-center {
            order: 1;
          }

          .benefits-right {
            text-align: center;
            order: 3;
          }

          .image-wrapper {
            height: 400px;
            max-width: 360px;
            margin: 0 auto;
          }

          .benefit-img {
            max-height: 400px;
          }
        }
      `}</style>
    </section>
  );
}
