"use client";

import React, { useState } from "react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          mensaje: "",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setStatus("error");
    }
  };

  const faqs = [
    {
      q: "¿Cuáles son los requisitos para afiliarse a APROTURA?",
      a: "Para afiliarse, debes contar con un título técnico o profesional en Turismo, Guía de Turismo o afines, presentar tu documento de identidad y completar la ficha de inscripción digital a través de nuestra Mesa de Partes."
    },
    {
      q: "¿Cómo puedo realizar un trámite en la Mesa de Partes Virtual?",
      a: "Debes iniciar sesión en nuestra Mesa de Partes Virtual, seleccionar el tipo de trámite, completar los campos requeridos y adjuntar los documentos correspondientes en formato PDF."
    },
    {
      q: "¿Ofrecen programas de capacitación continua?",
      a: "Sí, APROTURA organiza constantemente seminarios, talleres de formación e idiomas, y convenios académicos con instituciones de prestigio para todos nuestros miembros activos."
    },
    {
      q: "¿Cómo puedo contactarme con soporte técnico por problemas con mi cuenta?",
      a: "Puedes escribirnos al correo oficial aproturaaqp.peru@gmail.com o enviarnos un mensaje rápido por WhatsApp al +51 951 936 792. Respondemos de forma inmediata."
    }
  ];

  return (
    <div style={{ background: "var(--chalk)", minHeight: "100vh" }}>
      {/* Page Header - Image Only Banner */}
      <section style={{
        overflow: "hidden",
        width: "100%",
        marginTop: "70px",
      }}>
        <img
          src="/img/contacto_banner.png"
          alt="Contacto APROTURA"
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </section>

      {/* Main Content Section */}
      <section style={{ padding: "var(--section-py) 0" }}>
        <div className="container">
          
          {/* Header Title Section */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span className="section-label" style={{ fontSize: "0.85rem", letterSpacing: "0.15em" }}>Contacto Oficial</span>
            <h2 className="section-title" style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--graphite)" }}>
              Ponte en Contacto con Nosotros
            </h2>
            <p className="section-subtitle" style={{ margin: "0 auto", maxWidth: "600px", color: "var(--graphite-light)" }}>
              Estamos aquí para resolver tus dudas, atender tus solicitudes y brindarte el soporte que necesitas como profesional del turismo en Arequipa.
            </p>
          </div>

          <div style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
          }}>
            


            {/* Premium Form Card */}
            <div style={{
              background: "var(--white)",
              borderRadius: "20px",
              padding: "3.5rem 3rem",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid rgba(0,0,0,0.02)",
            }}>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.85rem",
                color: "var(--graphite)",
                marginBottom: "0.5rem",
              }}>
                Envíanos un Mensaje
              </h3>
              <p style={{ fontSize: "0.95rem", color: "var(--graphite-light)", marginBottom: "2.5rem" }}>
                Completa el formulario y nos contactaremos contigo a la brevedad.
              </p>

              {status === "success" && (
                <div style={{
                  background: "rgba(30, 126, 52, 0.08)",
                  border: "1.5px solid #1E7E34",
                  borderRadius: "12px",
                  padding: "1.25rem 1.5rem",
                  marginBottom: "2rem",
                  color: "#1E7E34",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mensaje enviado exitosamente. Nos comunicaremos contigo muy pronto.
                </div>
              )}

              {status === "error" && (
                <div style={{
                  background: "rgba(220, 53, 69, 0.08)",
                  border: "1.5px solid var(--crimson)",
                  borderRadius: "12px",
                  padding: "1.25rem 1.5rem",
                  marginBottom: "2rem",
                  color: "var(--crimson)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Hubo un error al enviar el mensaje. Inténtalo nuevamente por favor.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                {/* Nombre y Email Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="responsive-form-grid">
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--graphite-mid)", marginBottom: "0.5rem" }}>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Nombre"
                      style={{
                        width: "100%",
                        border: "2px solid var(--chalk-dark)",
                        borderRadius: "12px",
                        padding: "0.8rem 1rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        outline: "none",
                        color: "var(--graphite)",
                        transition: "all 0.25s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--crimson)";
                        e.target.style.boxShadow = "0 0 0 4px rgba(158, 27, 27, 0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--chalk-dark)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--graphite-mid)", marginBottom: "0.5rem" }}>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@gmail.com"
                      style={{
                        width: "100%",
                        border: "2px solid var(--chalk-dark)",
                        borderRadius: "12px",
                        padding: "0.8rem 1rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        outline: "none",
                        color: "var(--graphite)",
                        transition: "all 0.25s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--crimson)";
                        e.target.style.boxShadow = "0 0 0 4px rgba(158, 27, 27, 0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--chalk-dark)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Telefono y Asunto Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="responsive-form-grid">
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--graphite-mid)", marginBottom: "0.5rem" }}>
                      Teléfono / Celular
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      placeholder="Teléfono"
                      style={{
                        width: "100%",
                        border: "2px solid var(--chalk-dark)",
                        borderRadius: "12px",
                        padding: "0.8rem 1rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        outline: "none",
                        color: "var(--graphite)",
                        transition: "all 0.25s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--crimson)";
                        e.target.style.boxShadow = "0 0 0 4px rgba(158, 27, 27, 0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--chalk-dark)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--graphite-mid)", marginBottom: "0.5rem" }}>
                      Asunto de Consulta
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.asunto}
                      onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                      placeholder="Asunto"
                      style={{
                        width: "100%",
                        border: "2px solid var(--chalk-dark)",
                        borderRadius: "12px",
                        padding: "0.8rem 1rem",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        outline: "none",
                        color: "var(--graphite)",
                        transition: "all 0.25s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "var(--crimson)";
                        e.target.style.boxShadow = "0 0 0 4px rgba(158, 27, 27, 0.08)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "var(--chalk-dark)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Mensaje */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--graphite-mid)", marginBottom: "0.5rem" }}>
                    Mensaje / Consulta Detallada
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    placeholder="Escribe tu consulta aquí detalladamente..."
                    style={{
                      width: "100%",
                      border: "2px solid var(--chalk-dark)",
                      borderRadius: "12px",
                      padding: "0.8rem 1rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.95rem",
                      outline: "none",
                      color: "var(--graphite)",
                      resize: "vertical",
                      transition: "all 0.25s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--crimson)";
                      e.target.style.boxShadow = "0 0 0 4px rgba(158, 27, 27, 0.08)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "var(--chalk-dark)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Actions Row */}
                <div style={{
                  display: "flex",
                  gap: "1.5rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                  marginTop: "1rem",
                }}>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-primary"
                    style={{
                      padding: "1rem 3rem",
                      fontSize: "1rem",
                      borderRadius: "30px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: status === "sending" ? "not-allowed" : "pointer",
                      opacity: status === "sending" ? 0.7 : 1,
                      boxShadow: "0 6px 20px rgba(158, 27, 27, 0.2)",
                    }}
                  >
                    {status === "sending" ? (
                      <>
                        <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar Mensaje
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  <span style={{ color: "var(--graphite-light)", fontSize: "0.95rem" }}>o también</span>

                  {/* Elegant WhatsApp Link Button */}
                  <a
                    href="https://wa.me/51951936792"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      background: "linear-gradient(135deg, #1E7E34 0%, #155d25 100%)",
                      color: "var(--white)",
                      padding: "1rem 2.5rem",
                      borderRadius: "30px",
                      fontSize: "1rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 6px 20px rgba(30, 126, 52, 0.15)",
                      transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 25px rgba(30, 126, 52, 0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(30, 126, 52, 0.15)";
                    }}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 448 512" style={{ display: "block" }}>
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    Escríbenos por WhatsApp
                  </a>
                </div>

              </form>
            </div>
          </div>

          {/* Interactive FAQs Accordion Section */}
          <div style={{ marginTop: "7rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span className="section-label">Preguntas Frecuentes</span>
              <h3 style={{ fontSize: "2rem", fontWeight: 800 }}>Dudas Comunes</h3>
            </div>

            <div style={{
              maxWidth: "800px",
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "1rem"
            }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      background: "var(--white)",
                      borderRadius: "12px",
                      border: "1px solid var(--chalk-dark)",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      boxShadow: isOpen ? "var(--shadow-md)" : "none",
                    }}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "1.25rem 1.75rem",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--graphite)", paddingRight: "1rem" }}>
                        {faq.q}
                      </span>
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                          color: isOpen ? "var(--crimson)" : "var(--graphite-light)",
                        }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div style={{
                      maxHeight: isOpen ? "300px" : "0px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}>
                      <div style={{
                        padding: "0 1.75rem 1.5rem 1.75rem",
                        fontSize: "0.92rem",
                        color: "var(--graphite-light)",
                        lineHeight: 1.6,
                        borderTop: "1px solid var(--chalk)",
                      }}>
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Google Map Section */}
          <div style={{ marginTop: "7rem" }}>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <span className="section-label">Geolocalización</span>
              <h3 style={{ fontSize: "2rem", fontWeight: 800 }}>Nuestra Oficina</h3>
            </div>

            <div style={{
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)",
              border: "4px solid var(--white)",
            }}>
              <iframe
                title="Ubicación APROTURA"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.380721200234!2d-71.5369651!3d-16.39889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424a59f52f3d67%3A0x1c3ad2be4eb36cfc!2sPlaza%20de%20Armas%20de%20Arequipa!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </section>

      {/* Embedded CSS for responsive styles */}
      <style jsx global>{`
        @media (max-width: 992px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 576px) {
          .responsive-form-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
