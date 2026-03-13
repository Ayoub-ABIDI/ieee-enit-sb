import { PAGES } from "../constants/data";

function Footer({ go }) {
  return (
    <footer style={{
      background: "#010509", borderTop: "1px solid rgba(0,191,255,.08)",
      padding: "32px 6%", display: "flex", alignItems: "center",
      justifyContent: "space-between", flexWrap: "wrap", gap: 14,
    }}>
      <div style={{
        color: "rgba(255,255,255,.17)", fontSize: 13,
        fontFamily: "'Cinzel',Georgia,serif", letterSpacing: 1,
      }}>
        © 2026 IEEE ENIT Student Branch
      </div>

      <div style={{ display: "flex", gap: 22 }}>
        {PAGES.map(p => (
          <button key={p} onClick={() => { go(p); window.scrollTo(0, 0); }} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,.2)", fontSize: 11, letterSpacing: 2,
            textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", transition: "color .2s",
          }}
            onMouseEnter={e => e.target.style.color = "#00bfff"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.2)"}>
            {p}
          </button>
        ))}
      </div>

      <div style={{
        color: "rgba(0,191,255,.25)", fontSize: 11, letterSpacing: 4,
        fontFamily: "'Cinzel',Georgia,serif",
      }}>
        TOGETHER WE SHINE · 2005 – 2025
      </div>
    </footer>
  );
}

export default Footer;
