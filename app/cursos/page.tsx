"use client";

import React, { useState } from "react";
import Link from "next/link";

const cursos = [
  {
    id: 1,
    titulo: "Guía Oficial de Turismo",
    docente: "Lic. María Quispe",
    fechaInicio: "15 Jul 2026",
    duracion: "120 horas",
    esDePago: false,
    precio: null,
    descripcion: "Formación integral para guías turísticos con énfasis en el patrimonio cultural y natural de Arequipa.",
    categoria: "Guia",
    abreviatura: "GT",
  },
  {
    id: 2,
    titulo: "Gestión Hotelera y Hospedaje",
    docente: "Mg. Carlos Benavente",
    fechaInicio: "20 Jul 2026",
    duracion: "80 horas",
    esDePago: true,
    precio: 350,
    descripcion: "Aprende administración de establecimientos de hospedaje, atención al cliente y normativa turística.",
    categoria: "Gestion",
    abreviatura: "GH",
  },
  {
    id: 3,
    titulo: "Danzas Folklóricas del Sur del Perú",
    docente: "Prof. Rosa Mamani",
    fechaInicio: "10 Jul 2026",
    duracion: "60 horas",
    esDePago: false,
    precio: null,
    descripcion: "Aprende las danzas tradicionales de Arequipa, Puno y el sur peruano, preservando nuestra cultura.",
    categoria: "Cultura",
    abreviatura: "DF",
  },
  {
    id: 4,
    titulo: "Marketing Digital para el Turismo",
    docente: "Ing. José Molina",
    fechaInicio: "25 Jul 2026",
    duracion: "50 horas",
    esDePago: true,
    precio: 280,
    descripcion: "Estrategias digitales para promocionar servicios turísticos en redes sociales y plataformas digitales.",
    categoria: "Gestion",
    abreviatura: "MD",
  },
  {
    id: 5,
    titulo: "Primeros Auxilios y Seguridad Turística",
    docente: "Lic. Roberto Farfán",
    fechaInicio: "5 Ago 2026",
    duracion: "40 horas",
    esDePago: false,
    precio: null,
    descripcion: "Capacitación de emergencias, RCP y seguridad para actividades al aire libre y de aventura.",
    categoria: "Seguridad",
    abreviatura: "PA",
  },
  {
    id: 6,
    titulo: "Historia y Patrimonio de Arequipa",
    docente: "Dr. Eduardo Valdivia",
    fechaInicio: "12 Ago 2026",
    duracion: "30 horas",
    esDePago: true,
    precio: 150,
    descripcion: "Análisis profundo de la historia, arquitectura virreinal y patrimonio inmaterial de la ciudad de Arequipa.",
    categoria: "Cultura",
    abreviatura: "HP",
  },
];

export default function CursosPage() {
  const [filterType, setFilterType] = useState("todos"); // "todos", "gratis", "pago"
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCursos = cursos.filter((c) => {
    const matchesSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.docente.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "gratis") {
      return matchesSearch && !c.esDePago;
    }
    if (filterType === "pago") {
      return matchesSearch && c.esDePago;
    }
    return matchesSearch;
  });

  return (
    <div style={{ background: "var(--white)", minHeight: "100vh" }}>
      {/* Page Header */}
      <section style={{
        background: "var(--burgundy-deep)",
        padding: "8rem 0 4rem",
        textAlign: "center",
      }}>
        <div className="container">
          <h1 style={{ color: "white", fontSize: "3rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Nuestros Cursos
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.75)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Capacítate con nuestros programas académicos para profesionales, técnicos y entusiastas del sector turístico.
          </p>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section style={{ padding: "var(--section-py) 0" }}>
        <div className="container">
          {/* Filters Bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1.5rem",
            borderBottom: "1px solid var(--chalk-dark)",
            paddingBottom: "1.5rem",
          }}>
            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { id: "todos", label: "Todos los Cursos" },
                { id: "gratis", label: "Cursos Gratuitos" },
                { id: "pago", label: "Programas de Pago" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  style={{
                    background: filterType === tab.id ? "var(--crimson)" : "var(--chalk)",
                    color: filterType === tab.id ? "var(--white)" : "var(--graphite-light)",
                    border: "none",
                    borderRadius: "var(--radius)",
                    padding: "0.55rem 1.25rem",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (filterType !== tab.id) {
                      e.currentTarget.style.background = "var(--chalk-dark)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (filterType !== tab.id) {
                      e.currentTarget.style.background = "var(--chalk)";
                    }
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ width: "100%", maxWidth: "320px" }}>
              <input
                type="text"
                placeholder="Buscar por título o docente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  border: "1.5px solid var(--chalk-dark)",
                  borderRadius: "var(--radius)",
                  padding: "0.6rem 1rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  outline: "none",
                  color: "var(--graphite)",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--crimson)"}
                onBlur={(e) => e.target.style.borderColor = "var(--chalk-dark)"}
              />
            </div>
          </div>

          {/* Grid de Cursos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {filteredCursos.length > 0 ? (
              filteredCursos.map((c) => (
                <div key={c.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                  {/* Card Header (Solid color, no gradient) */}
                  <div style={{
                    padding: "2.5rem 1.5rem 1.5rem",
                    background: c.esDePago ? "var(--graphite)" : "var(--crimson)",
                    textAlign: "center",
                    position: "relative",
                  }}>
                    {/* Circle Icon Badge */}
                    <div style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1.2rem",
                      margin: "0 auto 0.75rem",
                    }}>
                      {c.abreviatura}
                    </div>
                    <span className={c.esDePago ? "badge-paid" : "badge-free"} style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem",
                    }}>
                      {c.esDePago ? `S/ ${c.precio}` : "Gratuito"}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h4 style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "var(--graphite)",
                      marginBottom: "0.6rem",
                      lineHeight: 1.3,
                    }}>{c.titulo}</h4>
                    
                    <p style={{
                      fontSize: "0.85rem",
                      color: "var(--graphite-light)",
                      marginBottom: "1.25rem",
                      lineHeight: 1.6,
                      flex: 1,
                    }}>{c.descripcion}</p>

                    {/* Meta Info */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      marginBottom: "1.5rem",
                      borderTop: "1px solid var(--chalk-dark)",
                      paddingTop: "1rem",
                    }}>
                      {[
                        {
                          icon: (
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          ),
                          label: `Docente: ${c.docente}`,
                        },
                        {
                          icon: (
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          ),
                          label: `Inicio: ${c.fechaInicio}`,
                        },
                        {
                          icon: (
                            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ),
                          label: `Duración: ${c.duracion}`,
                        },
                      ].map((meta, i) => (
                        <div key={i} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.78rem",
                          color: "var(--graphite-light)",
                        }}>
                          <span style={{ display: "flex", alignItems: "center", color: "var(--crimson)" }}>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Action */}
                    <Link
                      href={`/cursos/${c.id}`}
                      className={c.esDePago ? "btn-gold" : "btn-primary"}
                      style={{
                        textAlign: "center",
                        justifyContent: "center",
                        fontSize: "0.85rem",
                        padding: "0.65rem 1rem",
                        width: "100%",
                      }}
                    >
                      {c.esDePago ? "Matricularse" : "Ver Temario Completo"}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "var(--graphite-light)" }}>
                No se encontraron cursos que coincidan con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
