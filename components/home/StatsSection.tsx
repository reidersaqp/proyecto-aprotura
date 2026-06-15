"use client";

import { useState, useEffect, useRef } from "react";

function AnimatedCounter({ target, suffix = "+" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000; // 2 seconds animation duration
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Quadratic ease-out for a smooth deceleration at the end
            const easeProgress = progress * (2 - progress);
            
            const currentValue = Math.floor(easeProgress * target);
            setCount(currentValue);

            if (progress < 1) {
              animationFrameId = requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Reset count to 0 when it leaves the viewport
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target]);

  return (
    <div ref={elementRef} className="stat-number" style={{ color: "var(--gold-light)", marginBottom: "0.25rem", fontSize: "2.5rem", fontWeight: 800 }}>
      {count}{suffix}
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    {
      num: 5,
      label: "Años de Trayectoria",
      desc: "Desde nuestra fundación en 2020",
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v4H4v-4z" />
        </svg>
      ),
    },
    {
      num: 80,
      label: "Capacitaciones",
      desc: "Programas de formación profesional",
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
    },
    {
      num: 100,
      label: "Eventos Realizados",
      desc: "Actividades culturales y turísticas",
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      num: 500,
      label: "Profesionales Formados",
      desc: "Líderes del turismo arequipeño",
      icon: (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="stats" style={{
      background: "var(--graphite)",
      padding: "4rem 0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative top border */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: "var(--crimson)",
      }} />

      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "2rem",
        }}>
          {stats.map((s, i) => (
            <div key={i} className="stat-col" style={{
              textAlign: "center",
              padding: "1.5rem 1rem",
            }}>
              <div style={{ display: "flex", justifyContent: "center", color: "var(--gold-light)", marginBottom: "0.5rem" }}>{s.icon}</div>
              <AnimatedCounter target={s.num} suffix="+" />
              <div style={{
                fontFamily: "var(--font-body)",
                fontWeight: 700,
                fontSize: "0.9rem",
                color: "white",
                marginBottom: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>{s.label}</div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stat-col {
          border-right: 1px solid rgba(255,255,255,0.15);
        }
        .stat-col:last-child {
          border-right: none;
        }
        @media (max-width: 768px) {
          #stats .container > div { grid-template-columns: repeat(2, 1fr) !important; }
          .stat-col {
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.15);
          }
          .stat-col:nth-child(2n) {
            border-right: none;
          }
          .stat-col:nth-last-child(-n+2) {
            border-bottom: none;
          }
        }
        @media (max-width: 480px) {
          #stats .container > div { grid-template-columns: 1fr !important; }
          .stat-col {
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.15);
          }
          .stat-col:last-child {
            border-bottom: none;
          }
        }
      `}</style>
    </section>
  );
}
