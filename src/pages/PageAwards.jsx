import { useState, useEffect, useRef } from "react";
import { AWARDS_DATA } from "../constants/data";
import { Reveal, STag, STitle } from "../components/shared/Helpers";

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
  @keyframes orb-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(50px,-40px)} }
  @keyframes orb-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
  @keyframes orb-c { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,42px)} }
  @keyframes aw-shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes aw-blink   { 0%,100%{opacity:.35} 50%{opacity:1} }
  @keyframes aw-scroll  { 0%,100%{transform:translateY(0);opacity:.35} 60%{transform:translateY(7px);opacity:1} }
  @keyframes aw-pulse   { 0%,100%{box-shadow:0 0 12px rgba(0,191,255,.3)} 50%{box-shadow:0 0 28px rgba(0,191,255,.7)} }
  @keyframes aw-line-in { from{height:0;opacity:0} to{height:100%;opacity:1} }
  @keyframes aw-trophy  { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(2deg)} }

  .aw-accent {
    background: linear-gradient(90deg,#ffd700,#ffe566,#ffd700);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: aw-shimmer 4s linear infinite;
  }
`;

/* ─────────────────────────────────────────────
   BACKGROUND
───────────────────────────────────────────── */
function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#030c1e 0%,#040e23 55%,#030b1a 100%)" }}/>
      <div style={{ position: "absolute", top: "-12%", left: "-6%", width: 680, height: 680, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,90,200,.2) 0%,transparent 70%)", filter: "blur(65px)", animation: "orb-a 22s ease-in-out infinite" }}/>
      <div style={{ position: "absolute", bottom: "-18%", right: "-10%", width: 620, height: 620, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,180,255,.12) 0%,transparent 70%)", filter: "blur(75px)", animation: "orb-b 28s ease-in-out infinite" }}/>
      <div style={{ position: "absolute", top: "40%", left: "45%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle,rgba(20,50,180,.09) 0%,transparent 70%)", filter: "blur(85px)", animation: "orb-c 34s ease-in-out infinite" }}/>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%,transparent 42%,rgba(3,11,26,.65) 100%)" }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FADE UP REVEAL
───────────────────────────────────────────── */
function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: .06 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(28px)", transition: `opacity .7s ${delay}s ease, transform .7s ${delay}s ease` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  return (
    <div style={{ textAlign: "center", padding: "80px 6% 60px", position: "relative", zIndex: 1, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(22px)", transition: "all .9s cubic-bezier(.16,1,.3,1)" }}>

      {/* Badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 20px", borderRadius: 30, background: "rgba(255,215,0,.07)", border: "1px solid rgba(255,215,0,.22)", marginBottom: 32 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#ffd700", boxShadow: "0 0 8px #ffd700", animation: "aw-blink 2s ease-in-out infinite" }}/>
        <span style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 3.5, color: "rgba(255,215,0,.8)", textTransform: "uppercase" }}>IEEE ENIT SB · Hall of Excellence</span>
      </div>

      {/* Headline */}
      <h1 style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: "clamp(2rem,5.5vw,4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: "white" }}>
        Two Decades of<br/>
        <span className="aw-accent">Earned Glory.</span>
      </h1>

      {/* Sub */}
      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.9, color: "rgba(255,255,255,.44)", maxWidth: 560, margin: "0 auto 38px", fontStyle: "italic" }}>
        Every trophy tells a story. Every recognition carries the weight of late nights, bold ideas, and a team that refused to settle.
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
        {[["31+","Awards"],["20","Years"],["2005","Founded"],["#1","In Tunisia"]].map(([v,l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 900, color: "#ffd700" }}>{v}</div>
            <div style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,.28)", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,.18)", textTransform: "uppercase" }}>The Timeline</div>
        <div style={{ animation: "aw-scroll 2s ease-in-out infinite" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,215,0,.32)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AWARD NODE
───────────────────────────────────────────── */
function AwardNode({ item, side }) {
  const [hov, setHov] = useState(false);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `linear-gradient(135deg,${item.col}18,${item.col}07)` : "rgba(255,255,255,.025)",
        border: `1px solid ${hov ? item.col + "50" : "rgba(255,255,255,.07)"}`,
        borderRadius: 16, padding: "22px 26px",
        transition: "all .35s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-4px) scale(1.02)" : "none",
        boxShadow: hov ? `0 16px 40px rgba(0,0,0,.4), 0 0 0 1px ${item.col}22` : "none",
        maxWidth: 400, width: "100%",
        [side === "left" ? "marginLeft" : "marginRight"]: "auto",
      }}>

      <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, marginBottom: 12, background: `${item.col}15`, border: `1px solid ${item.col}35`, color: item.col, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif" }}>{item.cat}</div>

      <div style={{ color: "white", fontSize: 17, fontWeight: 700, lineHeight: 1.4, marginBottom: 8, fontFamily: "'Cinzel',Georgia,serif" }}>{item.title}</div>

      <div style={{ color: "rgba(255,255,255,.38)", fontSize: 14, fontFamily: "'Cormorant Garamond',Georgia,serif", fontStyle: "italic" }}>{item.org}</div>

      {/* Bottom bar */}
      <div style={{ height: 1.5, borderRadius: 1, marginTop: 16, background: `linear-gradient(${side === "left" ? "90deg" : "270deg"},${item.col}55,transparent)`, width: hov ? "60%" : "22%", transition: "width .45s ease" }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
function PageAwards() {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "#030c1e", color: "white", overflowX: "hidden", position: "relative" }}>
      <style>{CSS}</style>
      <Background/>

      <Hero/>

      {/* Divider */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 6%", position: "relative", zIndex: 1 }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,215,0,.2),transparent)" }}/>
      </div>

      {/* Timeline */}
      <section style={{ padding: "70px 6% 120px", maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <FadeUp>
          <STag c="Our Legacy"/>
          <STitle c="Awards & Achievements"/>
          <p style={{ color: "rgba(255,255,255,.4)", fontSize: 17, lineHeight: 2, fontFamily: "'Cormorant Garamond',Georgia,serif", marginBottom: 64, maxWidth: 540 }}>
            Two decades of pioneering excellence, a timeline of recognition earned by IEEE ENIT Student Branch since its founding in 2005.
          </p>
        </FadeUp>

        <div style={{ position: "relative" }}>
          {/* Spine */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,transparent,rgba(255,215,0,.25) 8%,rgba(255,215,0,.25) 92%,transparent)", transform: "translateX(-50%)" }}/>

          {AWARDS_DATA.map((yr, yi) => (
            <div key={yr.year} style={{ marginBottom: 52 }}>

              {/* Year marker */}
              <FadeUp delay={yi * .06}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 28, zIndex: 2 }}>
                  <div style={{ padding: "6px 24px", borderRadius: 30, background: "linear-gradient(135deg,#b8860b,#ffd700)", color: "#030c1e", fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: 16, fontWeight: 700, letterSpacing: 3, boxShadow: "0 0 28px rgba(255,215,0,.35)", position: "relative", zIndex: 2 }}>{yr.year}</div>
                </div>
              </FadeUp>

              {/* Award rows */}
              {yr.items.map((item, ii) => {
                const side = (yi + ii) % 2 === 0 ? "left" : "right";
                return (
                  <FadeUp key={ii} delay={yi * .06 + ii * .04}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ paddingRight: 24, display: "flex", justifyContent: "flex-end" }}>
                        {side === "left" && <AwardNode item={item} side="left"/>}
                      </div>
                      {/* Centre dot */}
                      <div style={{ display: "flex", justifyContent: "center", position: "relative", zIndex: 2 }}>
                        <div style={{ width: 14, height: 14, borderRadius: "50%", background: `linear-gradient(135deg,${item.col},${item.col}88)`, border: "2px solid #030c1e", boxShadow: `0 0 14px ${item.col}70` }}/>
                      </div>
                      <div style={{ paddingLeft: 24 }}>
                        {side === "right" && <AwardNode item={item} side="right"/>}
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          ))}

          {/* Bottom cap */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,215,0,.4)", boxShadow: "0 0 18px rgba(255,215,0,.4)", animation: "aw-blink 3s ease-in-out infinite" }}/>
          </div>
        </div>

        {/* Bottom tagline */}
        <FadeUp delay={.3}>
          <div style={{ textAlign: "center", marginTop: 72 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 32px", borderRadius: 40, background: "rgba(255,215,0,.04)", border: "1px solid rgba(255,215,0,.14)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", animation: "aw-blink 2.5s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,.25)", textTransform: "uppercase" }}>31+ Awards · 2005 – 2025 · And Counting</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffd700", animation: "aw-blink 2.5s ease-in-out .8s infinite" }}/>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

export default PageAwards;