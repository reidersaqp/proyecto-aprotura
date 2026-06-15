"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ControlSecretoPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("admin_logged", "true");
          localStorage.setItem("admin_user", JSON.stringify(data.user));
        }
        router.push("/admin");
      } else {
        setError(data.error || "Usuario o contraseña incorrectos.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    alert("Para restablecer su contraseña, comuníquese con el supervisor del sistema.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #5B0D15 0%, #3D050A 100%)", // Rich wine red gradient
        fontFamily: "var(--font-body)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      
      {/* 1. TOP WHITE BACKGROUND SECTION WITH ELEGANT PATTERN */}
      <div
        style={{
          height: "45vh",
          background: "#FFFFFF",
          backgroundImage: "radial-gradient(#e0e0e0 1.2px, transparent 1.2px), radial-gradient(#e0e0e0 1.2px, #FFFFFF 1.2px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 10px 10px",
          position: "relative",
          zIndex: 0,
        }}
      >
        <div className="container" style={{ position: "relative", height: "100%" }}>
          {/* Logo Branding - Centered & Premium */}
          <div
            style={{
              position: "absolute",
              top: "4vh",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 10,
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.1))",
            }}
            className="brand-logo-container"
          >
            <div style={{
              background: "#FFFFFF",
              borderRadius: "50%",
              width: "140px",
              height: "140px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.06), 0 0 0 4px rgba(201, 149, 42, 0.4)", // Gold outer ring
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <img
                src="/logo.png"
                alt="Logo Arequipa APROTURA"
                style={{
                  width: "110px",
                  height: "110px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: 900,
                color: "#1A1A1A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginTop: "0.95rem",
                fontFamily: "var(--font-display)",
                textAlign: "center",
                whiteSpace: "nowrap",
              }}
            >
              APROTURA AREQUIPA
            </h2>
          </div>
        </div>
      </div>

      {/* 2. LAYERED SVG WAVE DIVISION (GOLD & WINE RED) */}
      <div style={{ position: "absolute", top: "22vh", left: 0, width: "100%", zIndex: 1, pointerEvents: "none" }}>
        <svg viewBox="0 0 1440 800" style={{ width: "100%", height: "auto", display: "block" }}>
          {/* Gold Border Line with drop shadow casting onto the red fill */}
          <path
            fill="none"
            stroke="#C9952A"
            strokeWidth="8"
            d="M0,80 C360,180 720,40 1080,130 C1260,175 1380,135 1440,100"
            style={{ filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.18))" }}
          />
          {/* Deep Wine Red Filled Wave */}
          <path
            fill="#5B0D15"
            d="M0,80 C360,180 720,40 1080,130 C1260,175 1380,135 1440,100 L1440,800 L0,800 Z"
          />
        </svg>
      </div>

      {/* 3. FOREGROUND CONTENT & LOGIN CARD */}
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingLeft: "8vw",
          marginTop: "-2vh", // Shift upward to overlap the wave divider
        }}
        className="login-foreground"
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "16px",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
            width: "100%",
            maxWidth: "360px",
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid rgba(255,255,255,0.2)",
            transform: "translateY(0)",
            transition: "transform 0.3s ease",
          }}
          className="login-card-hover"
        >
          {/* Header Title inside Card */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--graphite)",
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Gestión Administrativa
            </h1>
          </div>

          {error && (
            <div
              className="animate-fadeIn"
              style={{
                background: "rgba(158, 27, 27, 0.06)",
                border: "1px solid rgba(158, 27, 27, 0.15)",
                color: "var(--crimson)",
                fontSize: "0.8rem",
                fontWeight: 600,
                padding: "0.6rem 0.8rem",
                borderRadius: "8px",
                marginBottom: "1.25rem",
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span style={{ display: "flex", alignItems: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* User Input */}
            <div style={{ position: "relative" }}>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Correo electrónico"
                className="login-input"
                style={{
                  width: "100%",
                  padding: "0.8rem 2.75rem 0.8rem 1.1rem",
                  borderRadius: "8px",
                  border: "1.5px solid #D1D5DB",
                  background: "#F3F7FE",
                  outline: "none",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-body)",
                  color: "#1A1A1A",
                  transition: "all 0.25s ease",
                }}
              />
              <span
                className="input-icon"
                style={{
                  position: "absolute",
                  right: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.25s ease",
                }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
            </div>

            {/* Password Input */}
            <div style={{ position: "relative" }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="login-input"
                style={{
                  width: "100%",
                  padding: "0.8rem 2.75rem 0.8rem 1.1rem",
                  borderRadius: "8px",
                  border: "1.5px solid #D1D5DB",
                  background: "#F3F7FE",
                  outline: "none",
                  fontSize: "0.9rem",
                  fontFamily: "var(--font-body)",
                  color: "#1A1A1A",
                  transition: "all 0.25s ease",
                }}
              />
              <span
                className="input-icon"
                style={{
                  position: "absolute",
                  right: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.25s ease",
                }}
              >
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #7E1B1B 0%, #5B0D15 100%)",
                color: "#FFFFFF",
                padding: "0.8rem",
                borderRadius: "8px",
                border: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 10px rgba(126, 27, 27, 0.25)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(126, 27, 27, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(126, 27, 27, 0.25)";
              }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            {/* Reset Password Button */}
            <button
              type="button"
              onClick={handleResetPassword}
              style={{
                width: "100%",
                background: "#F8F9FA",
                color: "var(--graphite-light)",
                padding: "0.7rem",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#EEF0F2"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#F8F9FA"}
            >
              Restablecer contraseña
            </button>
          </form>

          {/* Footer Supervisor Message */}
          <div
            style={{
              marginTop: "1.5rem",
              fontSize: "0.75rem",
              color: "#9CA3AF",
              textAlign: "center",
              lineHeight: 1.4,
              borderTop: "1px solid #F3F4F6",
              paddingTop: "1rem",
              width: "100%",
              fontWeight: 500,
            }}
          >
            Para soporte comuníquese con su supervisor
          </div>

        </div>
      </div>

      {/* CSS For Global Input Focus Glows and Card Hover */}
      <style jsx global>{`
        .login-input:focus {
          border-color: var(--crimson) !important;
          background: #FFFFFF !important;
          box-shadow: 0 0 0 4px rgba(158, 27, 27, 0.08) !important;
        }
        .login-input:focus + .input-icon {
          color: var(--crimson) !important;
        }
        .login-card-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.35) !important;
        }
        @media (max-width: 768px) {
          .login-foreground {
            justify-content: center !important;
            padding-left: 0 !important;
            margin-top: 2vh !important;
          }
          .brand-logo-container {
            top: 2.5vh !important;
          }
        }
      `}</style>

    </div>
  );
}
