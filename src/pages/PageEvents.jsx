import { useState, useEffect, useRef } from "react";
import { EVS } from "../constants/data";
import { Reveal, STag, STitle } from "../components/shared/Helpers";

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const CSS = `
  @keyframes orb-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(50px,-40px)} }
  @keyframes orb-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
  @keyframes orb-c { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,40px)} }
  @keyframes ev-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes ev-shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes ev-bar { from{transform:scaleX(0)} to{transform:scaleX(1)} }
  @keyframes ev-blink { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes ev-scroll-hint { 0%,100%{transform:translateY(0);opacity:.4} 60%{transform:translateY(7px);opacity:1} }

  .ev-grad-text {
    background: linear-gradient(90deg,#ffffff,#a8d4ff,#ffffff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ev-shimmer 6s linear infinite;
  }
  .ev-accent-text {
    background: linear-gradient(90deg,#00bfff,#7eb8ff,#00eaff,#00bfff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ev-shimmer 4s linear infinite;
  }
`;

/* ─────────────────────────────────────────────
   BACKGROUND — slow drifting orbs
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
   SCROLL REVEAL
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
   HERO SECTION
───────────────────────────────────────────── */
function Hero() {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  return (
    <div style={{ textAlign: "center", padding: "80px 6% 60px", position: "relative", zIndex: 1, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(24px)", transition: "all .9s cubic-bezier(.16,1,.3,1)" }}>

      {/* Live badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: 9, padding: "7px 20px", borderRadius: 30, background: "rgba(0,191,255,.07)", border: "1px solid rgba(0,191,255,.22)", marginBottom: 32 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00bfff", boxShadow: "0 0 8px #00bfff", animation: "ev-blink 2s ease-in-out infinite" }}/>
        <span style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 3.5, color: "rgba(0,191,255,.8)", textTransform: "uppercase" }}>IEEE ENIT SB · Events & Activities</span>
      </div>

      {/* Main headline */}
      <h1 style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: "clamp(2rem,5.5vw,4.2rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: 22, color: "white" }}>
        Where Ideas<br/>
        <span className="ev-accent-text">Come Alive</span>
      </h1>

      {/* Sub-headline */}
      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(16px,2vw,20px)", lineHeight: 1.9, color: "rgba(255,255,255,.45)", maxWidth: 560, margin: "0 auto 36px", fontStyle: "italic" }}>
        Workshops, competitions, talks and hands-on experiences — built by engineers, for engineers.
      </p>

      {/* Stat row */}
      <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap" }}>
        {[["30+","Events Hosted"],["500+","Participants"],["Every Year","New Experiences"]].map(([v,l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: "clamp(1.3rem,2.5vw,1.9rem)", fontWeight: 900, color: "#00bfff" }}>{v}</div>
            <div style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 9, letterSpacing: 3, color: "rgba(255,255,255,.28)", textTransform: "uppercase", marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div style={{ marginTop: 52, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 9, letterSpacing: 4, color: "rgba(255,255,255,.2)", textTransform: "uppercase" }}>Explore</div>
        <div style={{ animation: "ev-scroll-hint 2s ease-in-out infinite" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,191,255,.35)" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EVENT CARD
───────────────────────────────────────────── */
function EventCard({ ev, delay }) {
  const [hov, setHov] = useState(false);

  return (
    <FadeUp delay={delay}>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        className="crise"
        style={{
          borderRadius: 18, overflow: "hidden",
          border: `1px solid ${hov ? ev.col + "45" : "rgba(255,255,255,.06)"}`,
          transition: "all .4s cubic-bezier(.16,1,.3,1)",
          transform: hov ? "translateY(-8px) scale(1.015)" : "none",
          boxShadow: hov ? `0 26px 60px rgba(0,0,0,.5), 0 0 0 1px ${ev.col}22` : "none",
          background: hov ? `linear-gradient(160deg,${ev.col}1c,rgba(3,11,26,.98))` : "rgba(255,255,255,.025)",
          display: "flex", flexDirection: "column",
        }}>

        {/* Photo */}
        <div style={{ height: 220, position: "relative", overflow: "hidden", flexShrink: 0, background: `linear-gradient(135deg,${ev.col}28,rgba(3,11,26,.9))` }}>
          <img src={ev.photo} alt={ev.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}/>
          {/* Overlay on hover */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${ev.col}30, transparent)`, opacity: hov ? 1 : 0, transition: "opacity .4s" }}/>
          <div style={{ position: "absolute", top: 16, left: 16, padding: "5px 14px", borderRadius: 20, background: `${ev.col}22`, border: `1px solid ${ev.col}44`, color: ev.col, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", backdropFilter: "blur(8px)" }}>{ev.cat}</div>
          {hov && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,.05) 50%,transparent 60%)", animation: "ev-shimmer .8s ease forwards" }}/>}
        </div>

        {/* Tear */}
        <div style={{ position: "relative", margin: "0 20px" }}>
          <div style={{ borderTop: `1px dashed ${ev.col}28` }}/>
          {[-1,1].map(s => <div key={s} style={{ position: "absolute", top: -9, [s<0?"left":"right"]: -24, width: 18, height: 18, borderRadius: "50%", background: "#030c1e", border: "1px solid rgba(255,255,255,.06)" }}/>)}
        </div>

        {/* Body */}
        <div style={{ padding: "22px 26px 26px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ color: "white", fontSize: 17, fontWeight: 700, marginBottom: 12, lineHeight: 1.4, fontFamily: "'Cinzel',Georgia,serif" }}>{ev.name}</h3>

          <div style={{ display: "flex", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
            <span style={{ color: "rgba(255,255,255,.36)", fontSize: 13, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>📅 {ev.date}</span>
            <span style={{ color: "rgba(255,255,255,.36)", fontSize: 13, fontFamily: "'Cormorant Garamond',Georgia,serif" }}>📍 {ev.loc}</span>
          </div>

          {/* Accent bar */}
          <div style={{ height: 1.5, borderRadius: 1, marginBottom: 14, background: `linear-gradient(90deg,${ev.col}55,transparent)`, width: hov ? "60%" : "22%", transition: "width .5s ease" }}/>

          {/* Description on hover */}
          <div style={{ overflow: "hidden", maxHeight: hov ? 140 : 0, transition: "max-height .42s cubic-bezier(.16,1,.3,1), opacity .3s", opacity: hov ? 1 : 0 }}>
            <p style={{ color: "rgba(255,255,255,.5)", fontSize: 15, lineHeight: 1.85, fontFamily: "'Cormorant Garamond',Georgia,serif", marginBottom: 18 }}>{ev.desc}</p>
          </div>

          <div style={{ marginTop: "auto", paddingTop: 10 }}>
            <a href={ev.url} target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 25, background: hov ? `linear-gradient(135deg,${ev.col},${ev.col}bb)` : "rgba(255,255,255,.04)", border: `1px solid ${hov ? ev.col+"70" : "rgba(255,255,255,.09)"}`, color: hov ? "white" : "rgba(255,255,255,.33)", fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", textDecoration: "none", fontFamily: "'Cinzel',Georgia,serif", transition: "all .35s" }}>
              View on vTools
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
function PageEvents() {
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: "#030c1e", color: "white", overflowX: "hidden", position: "relative" }}>
      <style>{CSS}</style>
      <Background/>

      <Hero/>

      {/* Divider */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 6%", position: "relative", zIndex: 1 }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(0,191,255,.18),transparent)" }}/>
      </div>

      {/* Cards grid */}
      <section style={{ padding: "70px 6% 120px", maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <FadeUp>
          <STag c="What We Do"/>
          <STitle c="Our Events"/>
        </FadeUp>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 28, marginTop: 40 }}>
          {EVS.map((ev, i) => <EventCard key={i} ev={ev} delay={i * .05}/>)}
        </div>

        {/* Bottom tagline */}
        <FadeUp delay={.3}>
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 16, padding: "14px 32px", borderRadius: 40, background: "rgba(0,191,255,.05)", border: "1px solid rgba(0,191,255,.14)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00bfff", animation: "ev-blink 2.5s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 4, color: "rgba(255,255,255,.28)", textTransform: "uppercase" }}>More events coming soon — stay tuned</span>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00bfff", animation: "ev-blink 2.5s ease-in-out .8s infinite" }}/>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

export default PageEvents;