import { useState, useEffect } from "react";
import Airship from "../components/Airship";

/* ─────────────────────────────────────────────
   KEYFRAMES — must be defined HERE so the
   airship animations actually work on this page
───────────────────────────────────────────── */
const CSS = `
  /* Right → Left : starts fully off-screen right, exits off-screen left */
  @keyframes fly-rl {
    0%   { transform: translateX(110vw); }
    100% { transform: translateX(-520px); }
  }

  /* Left → Right : starts fully off-screen left, exits off-screen right */
  @keyframes fly-lr {
    0%   { transform: translateX(-280px); }
    100% { transform: translateX(110vw); }
  }

  @keyframes home-shimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }

  @keyframes orb-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
  @keyframes orb-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-35px,25px)} }
`;

function PageHome({ go }) {
  const [inn, setInn] = useState(false);
  useEffect(() => { setTimeout(() => setInn(true), 90); }, []);

  return (
    <div style={{
      minHeight: "100vh", position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "radial-gradient(ellipse at 28% 42%,#0c2550 0%,#040e23 52%,#010509 100%)",
    }}>
      <style>{CSS}</style>

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: `linear-gradient(rgba(0,191,255,.025) 1px,transparent 1px),
          linear-gradient(90deg,rgba(0,191,255,.025) 1px,transparent 1px)`,
        backgroundSize: "68px 68px",
      }}/>

      {/* Ambient orbs */}
      <div style={{ position: "absolute", width: 560, height: 560, top: "-8%", left: "12%", borderRadius: "50%", background: "radial-gradient(circle,rgba(0,112,192,.14) 0%,transparent 68%)", pointerEvents: "none", zIndex: 1, animation: "orb-a 20s ease-in-out infinite" }}/>
      <div style={{ position: "absolute", width: 400, height: 400, bottom: "5%", right: "8%", borderRadius: "50%", background: "radial-gradient(circle,rgba(0,191,255,.09) 0%,transparent 68%)", pointerEvents: "none", zIndex: 1, animation: "orb-b 26s ease-in-out infinite" }}/>

      {/* ── LARGE AIRSHIP — right to left, slow ── */}
      <div style={{
        position: "absolute",
        top: "18%",
        left: 0,               /* anchor point; translateX handles motion */
        zIndex: 2,
        opacity: .55,
        pointerEvents: "none",
        animation: "fly-rl 55s linear infinite",
      }}>
        <Airship w={480}/>
      </div>

      {/* ── SMALL AIRSHIP — left to right, slower, delayed, mirrored ── */}
      <div style={{
        position: "absolute",
        top: "58%",
        left: 0,
        zIndex: 2,
        opacity: .22,
        pointerEvents: "none",
        animation: "fly-lr 72s linear 18s infinite",
      }}>
        <div style={{ transform: "scaleX(-1)" }}>
          <Airship w={240}/>
        </div>
      </div>

      {/* Hero content */}
      <div style={{
        position: "relative", zIndex: 10, textAlign: "center",
        padding: "0 24px", maxWidth: 840,
        opacity: inn ? 1 : 0, transform: inn ? "translateY(0)" : "translateY(38px)",
        transition: "all 1.1s cubic-bezier(.16,1,.3,1)",
      }}>
        {/* Title */}
        <h1 style={{
          fontFamily: "'Cinzel Decorative',Georgia,serif",
          fontSize: "clamp(2.8rem,7.5vw,6rem)", fontWeight: 900, lineHeight: 1.08,
          color: "white", textShadow: "0 0 70px rgba(0,191,255,.22)", marginBottom: 10,
        }}>IEEE ENIT</h1>

        <h2 style={{
          fontFamily: "'Cinzel',Georgia,serif",
          fontSize: "clamp(1rem,2.8vw,2rem)", fontWeight: 400,
          letterSpacing: "clamp(6px,2vw,14px)",
          background: "linear-gradient(135deg,#00bfff,#ffffff,#0070c0)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 22,
        }}>STUDENT BRANCH</h2>

        {/* Tagline */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 42 }}>
          <p style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            color: "rgba(255,255,255,.45)", fontSize: "clamp(15px,2vw,20px)",
            fontStyle: "italic", letterSpacing: 3,
          }}>" Together We Shine "</p>
          <div style={{
            position: "absolute", bottom: -8, left: "5%", right: "5%", height: 1,
            background: "linear-gradient(90deg,transparent,rgba(0,191,255,.4),transparent)",
          }}/>
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          color: "rgba(255,255,255,.45)", fontSize: "clamp(14px,1.8vw,17px)",
          lineHeight: 2, maxWidth: 560, margin: "0 auto 52px", letterSpacing: .5,
        }}>
          Tunisia's first IEEE entity, pioneering technical excellence,
          innovation, and professional growth since 2005.
        </p>

        {/* Stats */}
        <div style={{ display: "flex", gap: "clamp(18px,4vw,54px)", justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          {[["5","Technical Chapters"],["2","Groups"],["1","Council"],["300+","Members"],["31+","Awards"]].map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: "clamp(1.5rem,3.5vw,2.3rem)", fontWeight: 900, color: "#00bfff", textShadow: "0 0 22px rgba(0,191,255,.55)" }}>{n}</div>
              <div style={{ color: "rgba(255,255,255,.3)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Discover More", target: "About",      solid: true  },
            { label: "Our Events",    target: "Events",     solid: false },
            { label: "Sub-Units",     target: "Sub-Units",  solid: false, dim: true },
          ].map(({ label, target, solid, dim }) => (
            <button key={label} onClick={() => go(target)} style={{
              padding: "14px 36px", borderRadius: 40, fontSize: 11, fontWeight: 700,
              letterSpacing: 2, cursor: "pointer", textTransform: "uppercase",
              fontFamily: "'Cinzel',Georgia,serif", transition: "all .3s",
              background: solid ? "linear-gradient(135deg,#0070c0,#00bfff)" : "transparent",
              border: solid ? "none" : `1px solid rgba(0,191,255,${dim ? ".3" : ".45"})`,
              color: dim ? "rgba(255,255,255,.7)" : "white",
              boxShadow: solid ? "0 8px 28px rgba(0,191,255,.3)" : "none",
            }}
              onMouseEnter={e => {
                if (solid) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,191,255,.48)"; }
                else { e.currentTarget.style.background = "rgba(0,191,255,.08)"; e.currentTarget.style.transform = "translateY(-3px)"; }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                if (solid) e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,191,255,.3)";
                else e.currentTarget.style.background = "transparent";
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: 22, left: "50%", transform: "translateX(-50%)",
        zIndex: 10, color: "rgba(255,255,255,.14)", fontSize: 9, letterSpacing: 5,
        fontFamily: "'Cinzel',Georgia,serif", whiteSpace: "nowrap",
      }}>
        IEEE ENIT SB · 2005 – 2026
      </div>
    </div>
  );
}

export default PageHome;