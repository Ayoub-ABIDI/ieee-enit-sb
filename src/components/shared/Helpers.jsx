import { useRef, useState, useEffect } from "react";

/* ── Scroll reveal wrapper ── */
export function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold: 0.07 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(26px)",
      transition: `opacity .7s ${delay}s cubic-bezier(.16,1,.3,1), transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>
      {children}
    </div>
  );
}

/* ── Section label tag ── */
export function STag({ c }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
      <div style={{ width: 36, height: 1, background: "#00bfff" }}/>
      <span style={{
        color: "#00bfff", fontSize: 12, letterSpacing: 4, textTransform: "uppercase",
        fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600,
      }}>{c}</span>
    </div>
  );
}

/* ── Section title ── */
export function STitle({ c }) {
  return (
    <h2 style={{
      fontFamily: "'Cinzel',Georgia,serif",
      fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 700,
      color: "white", marginBottom: 56, lineHeight: 1.2,
    }}>{c}</h2>
  );
}

/* ── Social icon button ── */
export function SocBtn({ icon, href }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{
        width: 30, height: 30, borderRadius: 8,
        background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "rgba(255,255,255,.4)", textDecoration: "none", transition: "all .25s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(0,191,255,.14)";
        e.currentTarget.style.color = "#00bfff";
        e.currentTarget.style.borderColor = "rgba(0,191,255,.36)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,.05)";
        e.currentTarget.style.color = "rgba(255,255,255,.4)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,.09)";
      }}>
      {icon}
    </a>
  );
}
