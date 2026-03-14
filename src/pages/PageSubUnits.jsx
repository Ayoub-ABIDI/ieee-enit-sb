import { useState, useEffect, useRef } from "react";
import { SUBS } from "../constants/data";
import { STag, STitle } from "../components/shared/Helpers";

const SUBUNIT_PAGES = {
  "WIE SAG":          "WIE",
  "IAS IES PES SBJC": "IAS",
  "CS SBC":           "CS",
  "RAS SEN SBJC":     "RAS",
  "SIGHT Group":      "SIGHT",
};

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
  @keyframes orb-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(50px,-40px)} }
  @keyframes orb-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
  @keyframes orb-c { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,42px)} }
  @keyframes su-shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes su-blink   { 0%,100%{opacity:.35} 50%{opacity:1} }
  @keyframes su-scroll  { 0%,100%{transform:translateY(0);opacity:.35} 60%{transform:translateY(7px);opacity:1} }
  @keyframes su-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes su-spin-r  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }

  .su-accent {
    background: linear-gradient(90deg,#00bfff,#7eb8ff,#00eaff,#00bfff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: su-shimmer 4s linear infinite;
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
      <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 20px", borderRadius: 30, background: "rgba(0,191,255,.07)", border: "1px solid rgba(0,191,255,.2)", marginBottom: 32 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00bfff", boxShadow: "0 0 8px #00bfff", animation: "su-blink 2s ease-in-out infinite" }}/>
        <span style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 3.5, color: "rgba(0,191,255,.8)", textTransform: "uppercase" }}>IEEE ENIT SB · Our Structure</span>
      </div>

      {/* Headline */}
      <h1 style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: "clamp(2rem,5.5vw,4rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: "white" }}>
        One Branch.<br/>
        <span className="su-accent">Many Voices.</span>
      </h1>

      {/* Sub */}
      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.9, color: "rgba(255,255,255,.44)", maxWidth: 540, margin: "0 auto 36px", fontStyle: "italic" }}>
        Five chapters, two groups, one council each driven by a shared commitment to engineering excellence and human progress.
      </p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
        {[["5","Chapters"],["2","Groups"],["1","Council"],["300+","Members"]].map(([v,l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 900, color: "#00bfff" }}>{v}</div>
            <div style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,.28)", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,.18)", textTransform: "uppercase" }}>Discover</div>
        <div style={{ animation: "su-scroll 2s ease-in-out infinite" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,191,255,.32)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SUB CARD
───────────────────────────────────────────── */
function SubCard({ u, go, delay }) {
  const [hov, setHov] = useState(false);
  const targetPage = SUBUNIT_PAGES[u.abbr];

  return (
    <FadeUp delay={delay}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        className="crise"
        style={{
          background: hov ? `linear-gradient(135deg,${u.col}17,${u.col}07)` : "rgba(255,255,255,.025)",
          border: `1px solid ${hov ? u.col + "45" : "rgba(255,255,255,.06)"}`,
          borderRadius: 18, padding: "30px 26px",
          transition: "all .36s cubic-bezier(.16,1,.3,1)",
          transform: hov ? "translateY(-6px)" : "none",
          boxShadow: hov ? `0 22px 50px rgba(0,0,0,.4), 0 0 0 1px ${u.col}20` : "none",
        }}>

        {/* Top accent bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg,${u.col},${u.col}28)`, borderRadius: 2, marginBottom: 28, width: hov ? "100%" : "40%", transition: "width .4s ease" }}/>

        {/* Logo */}
        <div style={{ width: 120, height: 120, borderRadius: 20, marginBottom: 20, background: `linear-gradient(135deg,${u.col}18,rgba(3,11,26,.8))`, border: `1.5px solid ${u.col}40`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: "all .36s", boxShadow: hov ? `0 0 32px ${u.col}28` : "none", padding: 12 }}>
          <img src={u.logo} alt={u.abbr} style={{ width: "100%", height: "100%", objectFit: "contain" }}/>
        </div>

        {/* Badge */}
        <div style={{ display: "inline-block", padding: "3px 12px", borderRadius: 20, background: `${u.col}12`, border: `1px solid ${u.col}30`, color: u.col, fontSize: 9, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", marginBottom: 14 }}>{u.abbr}</div>

        <h3 style={{ color: "white", fontSize: 16, fontWeight: 700, fontFamily: "'Cinzel',Georgia,serif", marginBottom: 16, lineHeight: 1.5 }}>{u.name}</h3>

        <p style={{ color: "rgba(255,255,255,.42)", fontSize: 15, lineHeight: 1.9, fontFamily: "'Cormorant Garamond',Georgia,serif", marginBottom: 28 }}>{u.desc}</p>

        {/* Accent line */}
        <div style={{ height: 1, background: `linear-gradient(90deg,${u.col}40,transparent)`, marginBottom: 22, width: hov ? "55%" : "20%", transition: "width .45s ease" }}/>

        <button onClick={() => targetPage && go(targetPage)}
          style={{ padding: "11px 24px", borderRadius: 25, cursor: targetPage ? "pointer" : "default", background: hov && targetPage ? `${u.col}14` : "transparent", border: `1px solid ${u.col}42`, color: u.col, fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", transition: "all .25s", opacity: targetPage ? 1 : 0.45 }}
          onMouseEnter={e => { if (targetPage) e.currentTarget.style.background = `${u.col}22`; }}
          onMouseLeave={e => { e.currentTarget.style.background = hov && targetPage ? `${u.col}14` : "transparent"; }}>
          {targetPage ? "Explore More →" : "Coming Soon"}
        </button>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
function PageSubUnits({ go }) {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "#030c1e", color: "white", overflowX: "hidden", position: "relative" }}>
      <style>{CSS}</style>
      <Background/>

      <Hero/>

      {/* Divider */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 6%", position: "relative", zIndex: 1 }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(0,191,255,.18),transparent)" }}/>
      </div>

      {/* Cards */}
      <section style={{ padding: "70px 6% 120px", maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <FadeUp>
          <STag c="Our Structure"/>
          <STitle c="Chapters, Groups & Councils"/>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 26, marginTop: 40 }}>
          {SUBS.map((u, i) => <SubCard key={i} u={u} go={go} delay={i * .05}/>)}
        </div>

        {/* Bottom note */}
        <FadeUp delay={.3}>
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 32px", borderRadius: 40, background: "rgba(0,191,255,.04)", border: "1px solid rgba(0,191,255,.12)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00bfff", animation: "su-blink 2.5s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,.25)", textTransform: "uppercase" }}>More pages unlocking soon</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00bfff", animation: "su-blink 2.5s ease-in-out .8s infinite" }}/>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

export default PageSubUnits;