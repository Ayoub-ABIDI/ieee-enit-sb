import { useState, useEffect } from "react";
import { PAGES } from "../constants/data";

function Nav({ page, go }) {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 80,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 6%",
        background: scrolled ? "rgba(4,14,35,.92)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,191,255,.13)" : "none",
        transition: "all .4s ease",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}
          onClick={() => go("Home")}>
          <img src="/ENIT-WHITE.png" alt="IEEE ENIT SB"
            style={{ height: 54, width: "auto", objectFit: "contain",
              filter: "drop-shadow(0 0 10px rgba(0,191,255,.35))" }}/>
        </div>

        {/* Center links */}
        <div className="dnav" style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {PAGES.map(p => (
            <button key={p} onClick={() => go(p)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 18px", borderRadius: 6,
              color: page === p ? "#00bfff" : "rgba(255,255,255,.75)",
              fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
              fontFamily: "'Cinzel',Georgia,serif",
              borderBottom: page === p ? "1px solid #00bfff" : "1px solid transparent",
              transition: "all .25s",
            }}
              onMouseEnter={e => { if (page !== p) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { if (page !== p) e.currentTarget.style.color = "rgba(255,255,255,.75)"; }}
            >{p}</button>
          ))}
        </div>

        {/* Join Us button */}
        <button className="dnav" onClick={() => go("About")} style={{
          background: "linear-gradient(135deg,#0070c0,#00bfff)",
          border: "none", borderRadius: 26, padding: "12px 28px",
          color: "white", fontSize: 13, fontWeight: 700, letterSpacing: 1.5,
          cursor: "pointer", textTransform: "uppercase",
          fontFamily: "'Cinzel',Georgia,serif",
          boxShadow: "0 0 22px rgba(0,191,255,.32)",
          transition: "all .3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,191,255,.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 22px rgba(0,191,255,.32)"; }}>
          Join Us
        </button>

        {/* Hamburger */}
        <button className="hmb" onClick={() => setMob(!mob)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 26, height: 2, background: "#00bfff", borderRadius: 2, transition: "all .3s",
              transform: mob
                ? (i === 0 ? "rotate(45deg) translate(5px,5px)" : i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "scaleX(0)")
                : "none",
            }}/>
          ))}
        </button>

        {mob && (
          <div style={{
            position: "fixed", top: 80, left: 0, right: 0,
            background: "rgba(4,14,35,.97)", backdropFilter: "blur(20px)",
            padding: "16px 6% 26px", borderBottom: "1px solid rgba(0,191,255,.1)",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {PAGES.map(p => (
              <button key={p} onClick={() => { go(p); setMob(false); }} style={{
                background: page === p ? "rgba(0,191,255,.09)" : "transparent",
                border: "none", cursor: "pointer", color: "white",
                fontSize: 16, fontWeight: 600, textAlign: "left",
                padding: "14px 18px", borderRadius: 8,
                fontFamily: "'Cinzel',Georgia,serif",
                borderLeft: page === p ? "2px solid #00bfff" : "2px solid transparent",
              }}>{p}</button>
            ))}
            <button onClick={() => { go("About"); setMob(false); }} style={{
              marginTop: 8, padding: "11px", borderRadius: 22,
              background: "linear-gradient(135deg,#0070c0,#00bfff)",
              border: "none", color: "white", fontSize: 12, fontWeight: 700,
              fontFamily: "'Cinzel',Georgia,serif", letterSpacing: 2, cursor: "pointer",
            }}>Join Us</button>
          </div>
        )}
      </nav>
    </>
  );
}

export default Nav;
