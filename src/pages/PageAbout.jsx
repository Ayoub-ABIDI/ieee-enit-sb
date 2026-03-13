import { useState, useEffect, useRef } from "react";
import { TEAM, FORMER_MESSAGES } from "../constants/data";
import { Reveal, STag, STitle, SocBtn } from "../components/shared/Helpers";

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes orb-1 {
    0%,100% { transform: translate(0px,   0px);   }
    50%      { transform: translate(40px, -30px);  }
  }
  @keyframes orb-2 {
    0%,100% { transform: translate(0px,  0px);   }
    50%      { transform: translate(-35px, 25px); }
  }
  @keyframes orb-3 {
    0%,100% { transform: translate(0px, 0px);   }
    50%      { transform: translate(20px, 35px); }
  }
  @keyframes shimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes pa-float {
    0%,100% { transform: translateY(0px);   }
    50%      { transform: translateY(-10px); }
  }
  @keyframes pa-spin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  @keyframes pa-spin-r {
    from { transform: rotate(0deg);    }
    to   { transform: rotate(-360deg); }
  }
  @keyframes bar-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }

  @media(max-width:900px){
    .pa-hero-grid { grid-template-columns: 1fr !important; }
    .pa-team-r1   { grid-template-columns: repeat(2,1fr) !important; max-width:100% !important; }
    .pa-team-r2   { grid-template-columns: repeat(2,1fr) !important; }
  }
  @media(max-width:500px){
    .pa-team-r1, .pa-team-r2 { grid-template-columns: 1fr !important; }
  }
`;

/* ─────────────────────────────────────────────
   BACKGROUND — 3 slow drifting blurred orbs
───────────────────────────────────────────── */
function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Base */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(160deg, #030c1e 0%, #040e23 50%, #030b1a 100%)",
      }}/>

      {/* Orb 1 — top-left, blue, 20s */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,100,200,.18) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "orb-1 20s ease-in-out infinite",
      }}/>

      {/* Orb 2 — bottom-right, cyan, 26s */}
      <div style={{
        position: "absolute", bottom: "-15%", right: "-8%",
        width: 650, height: 650, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,170,255,.13) 0%, transparent 70%)",
        filter: "blur(70px)",
        animation: "orb-2 26s ease-in-out infinite",
      }}/>

      {/* Orb 3 — center, deep blue, 32s */}
      <div style={{
        position: "absolute", top: "38%", left: "42%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(20,60,180,.09) 0%, transparent 70%)",
        filter: "blur(80px)",
        animation: "orb-3 32s ease-in-out infinite",
      }}/>

      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(3,11,26,.6) 100%)",
      }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ORBIT LOGO CARD
───────────────────────────────────────────── */
function LogoCard() {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: 380 }}>
      {/* Outer ring */}
      <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", border: "1px solid rgba(0,191,255,.10)", animation: "pa-spin 30s linear infinite" }}>
        {[0, 120, 240].map(deg => (
          <div key={deg} style={{ position: "absolute", top: "50%", left: "50%", transform: `rotate(${deg}deg) translateX(168px) translateY(-50%)`, width: 6, height: 6, borderRadius: "50%", background: "#00bfff", boxShadow: "0 0 10px #00bfff" }}/>
        ))}
      </div>
      {/* Inner ring */}
      <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", border: "1px solid rgba(0,191,255,.07)", animation: "pa-spin-r 20s linear infinite" }}>
        {[60, 180, 300].map(deg => (
          <div key={deg} style={{ position: "absolute", top: "50%", left: "50%", transform: `rotate(${deg}deg) translateX(123px) translateY(-50%)`, width: 4, height: 4, borderRadius: "50%", background: "rgba(0,191,255,.5)" }}/>
        ))}
      </div>
      {/* Logo only — no box */}
      <img src="/ENIT-WHITE.png" alt="IEEE ENIT SB"
        style={{ position: "relative", zIndex: 2, width: 300, height: "auto", objectFit: "contain", animation: "pa-float 9s ease-in-out infinite" }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ value, label, color, delay }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: .3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ textAlign: "center", padding: "16px 20px", background: `linear-gradient(160deg,${color}08,rgba(4,14,35,.55))`, border: `1px solid ${color}1e`, borderRadius: 14, minWidth: 76, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(14px)", transition: `opacity .6s ${delay}s ease, transform .6s ${delay}s ease` }}>
      <div style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", color, fontSize: "clamp(1.3rem,2vw,1.8rem)", fontWeight: 700 }}>{value}</div>
      <div style={{ color: "rgba(255,255,255,.3)", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", marginTop: 5 }}>{label}</div>
      <div style={{ height: 2, borderRadius: 1, marginTop: 10, transformOrigin: "left", background: `linear-gradient(90deg,${color}60,transparent)`, animation: vis ? `bar-grow .7s ${delay + .15}s ease both` : "none" }}/>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SOCIAL ICONS
───────────────────────────────────────────── */
const FB_ICON = <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;
const IN_ICON = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>;
const LN_ICON = <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;

/* ─────────────────────────────────────────────
   MEMBER CARD
───────────────────────────────────────────── */
function MemberCard({ m }) {
  const [hov, setHov] = useState(false);
  const init = m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const rc =
    m.role === "Chair"      ? "#FFD700" :
    m.role === "Vice Chair" ? "#00bfff" :
    m.role === "Secretary"  ? "#7eb8ff" :
    m.role === "Treasurer"  ? "#00c48c" :
    m.role === "Webmaster"  ? "#c850ff" : "#5599ff";

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} className="crise"
      style={{ borderRadius: 18, overflow: "hidden", border: `1px solid ${hov ? rc + "45" : "rgba(255,255,255,.07)"}`, transition: "all .4s cubic-bezier(.16,1,.3,1)", transform: hov ? "translateY(-8px) scale(1.02)" : "none", boxShadow: hov ? `0 24px 56px rgba(0,0,0,.5), 0 0 0 1px ${rc}20` : "none", background: hov ? `linear-gradient(170deg,${rc}12,rgba(3,11,26,.98))` : "rgba(255,255,255,.025)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 200, position: "relative", overflow: "hidden", flexShrink: 0, background: `linear-gradient(160deg,${rc}20,rgba(3,11,26,.95))` }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {m.photo ? (
            <img src={m.photo} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}/>
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: "50%", background: `linear-gradient(135deg,${rc}50,rgba(0,60,160,.7))`, border: `2px solid ${hov ? rc + "80" : "rgba(255,255,255,.13)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "white", fontFamily: "'Cinzel Decorative',Georgia,serif", boxShadow: hov ? `0 0 36px ${rc}50` : "none", transition: "all .4s" }}>{init}</div>
          )}
        </div>
        <div style={{ position: "absolute", top: 14, left: 14, padding: "5px 13px", borderRadius: 20, background: `${rc}1c`, border: `1px solid ${rc}45`, color: rc, fontSize: 9, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", backdropFilter: "blur(8px)" }}>{m.role}</div>
        {hov && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,.05) 50%,transparent 60%)", animation: "shimmer .8s ease forwards" }}/>}
      </div>
      <div style={{ position: "relative", margin: "0 16px" }}>
        <div style={{ borderTop: `1px dashed ${rc}28` }}/>
        {[-1,1].map(s => <div key={s} style={{ position: "absolute", top: -8, [s<0?"left":"right"]: -20, width: 16, height: 16, borderRadius: "50%", background: "#030c1e", border: "1px solid rgba(255,255,255,.06)" }}/>)}
      </div>
      <div style={{ padding: "18px 22px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ color: "white", fontSize: 15, fontWeight: 700, lineHeight: 1.3, marginBottom: 5, fontFamily: "'Cinzel',Georgia,serif" }}>{m.name}</div>
        <div style={{ color: rc, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600, marginBottom: 14, opacity: .85 }}>{m.role} · IEEE ENIT SB</div>
        <div style={{ height: 1.5, borderRadius: 1, marginBottom: 14, background: `linear-gradient(90deg,${rc}55,transparent)`, width: hov ? "65%" : "25%", transition: "width .5s ease" }}/>
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <SocBtn icon={FB_ICON} href={m.fb}/>
          <SocBtn icon={IN_ICON} href={m.insta}/>
          <SocBtn icon={LN_ICON} href={m.ln}/>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MESSAGE BUBBLE
───────────────────────────────────────────── */
function MessageBubble({ p }) {
  const [hov, setHov] = useState(false);
  const isLeft = p.side === "left";
  const init = p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse", alignItems: "flex-start", gap: 28 }}>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${p.color}55,rgba(0,60,160,.6))`, border: `2px solid ${p.color}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "white", fontFamily: "'Cinzel Decorative',Georgia,serif", boxShadow: `0 0 24px ${p.color}28` }}>{init}</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "white", fontSize: 12, fontWeight: 700, fontFamily: "'Cinzel',Georgia,serif", whiteSpace: "nowrap" }}>{p.name}</div>
          <div style={{ color: p.color, fontSize: 9, letterSpacing: 2, fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase", whiteSpace: "nowrap", marginTop: 3, opacity: .8 }}>{p.role}</div>
        </div>
      </div>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ flex: 1, position: "relative", background: hov ? `linear-gradient(135deg,${p.color}11,rgba(3,11,26,.97))` : "rgba(255,255,255,.03)", border: `1px solid ${hov ? p.color+"45" : "rgba(255,255,255,.08)"}`, borderRadius: isLeft ? "4px 22px 22px 22px" : "22px 4px 22px 22px", padding: "28px 34px", transition: "all .38s cubic-bezier(.16,1,.3,1)", boxShadow: hov ? `0 18px 48px rgba(0,0,0,.38), 0 0 0 1px ${p.color}20` : "none" }}>
        <div style={{ position: "absolute", top: 14, [isLeft?"left":"right"]: 24, fontFamily: "Georgia,serif", fontSize: 72, lineHeight: 1, color: p.color, opacity: .1, fontWeight: 900, pointerEvents: "none", userSelect: "none" }}>"</div>
        <div style={{ position: "absolute", top: 28, [isLeft?"left":"right"]: -10, width: 0, height: 0, borderTop: "10px solid transparent", borderBottom: "10px solid transparent", [isLeft?"borderRight":"borderLeft"]: `10px solid ${hov ? p.color+"30" : "rgba(255,255,255,.05)"}`, transition: "all .38s" }}/>
        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 17, lineHeight: 2.1, color: "rgba(255,255,255,.7)", fontStyle: "italic", position: "relative", zIndex: 1, margin: 0 }}>{p.msg}</p>
        <div style={{ height: 2, borderRadius: 1, marginTop: 22, background: `linear-gradient(${isLeft?"90deg":"270deg"},${p.color}65,transparent)`, width: hov ? "55%" : "26%", transition: "width .5s ease" }}/>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function PAReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: .06 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(26px)", transition: `opacity .7s ${delay}s ease, transform .7s ${delay}s ease` }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
function PageAbout() {
  return (
    <div style={{ paddingTop: 100, minHeight: "100vh", background: "#030c1e", color: "white", overflowX: "hidden", position: "relative" }}>
      <style>{GLOBAL_CSS}</style>
      <Background/>

      {/* ABOUT */}
      <section style={{ padding: "70px 6% 90px", maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <PAReveal>
          <STag c="Who We Are"/>
          <div className="pa-hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 72, alignItems: "center" }}>
            <div>
              <h2 style={{ fontFamily: "'Cinzel Decorative',Georgia,serif", fontSize: "clamp(1.6rem,3vw,2.5rem)", fontWeight: 700, color: "white", marginBottom: 8, lineHeight: 1.25 }}>About IEEE ENIT</h2>
              <h3 style={{ fontFamily: "'Cinzel',Georgia,serif", fontSize: "clamp(1.1rem,2vw,1.6rem)", fontWeight: 600, color: "#00bfff", marginBottom: 28 }}>Student Branch</h3>
              <div style={{ display: "flex", height: 3, borderRadius: 3, width: 64, marginBottom: 28, overflow: "hidden" }}>
                <div style={{ flex: 1, background: "#00bfff" }}/><div style={{ flex: 1, background: "#1a6fff" }}/><div style={{ flex: 1, background: "#7eb8ff" }}/>
              </div>
              <p style={{ color: "rgba(255,255,255,.62)", lineHeight: 2.1, fontSize: 17, fontFamily: "'Cormorant Garamond',Georgia,serif", marginBottom: 20 }}>
                The <strong style={{ color: "white", fontFamily: "'Cinzel',Georgia,serif" }}>IEEE ENIT Student Branch</strong> is the first IEEE entity in Tunisia, founded on the <strong style={{ color: "#00bfff" }}>24th of May, 2005</strong>, with the mission of promoting IEEE activities across the country.
              </p>
              <p style={{ color: "rgba(255,255,255,.44)", lineHeight: 2.1, fontSize: 16, fontFamily: "'Cormorant Garamond',Georgia,serif", marginBottom: 40 }}>
                Since its establishment, the branch has grown steadily to include five technical chapters CS, IAS, PES, IES, and RAS alongside two groups, SIGHT and WIE, and a dedicated Sensors Council.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[["5","Chapters","#00bfff",0],["2","Groups","#7eb8ff",.07],["1","Council","#00c48c",.14],["300+","Members","#f0c040",.21],["31+","Awards","#c850ff",.28]].map(([v,l,c,d]) => (
                  <StatCard key={l} value={v} label={l} color={c} delay={d}/>
                ))}
              </div>
            </div>
            <LogoCard/>
          </div>
        </PAReveal>
      </section>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 6%" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(0,191,255,.18),transparent)" }}/>
      </div>

      {/* TEAM */}
      <section style={{ padding: "80px 6% 120px", maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <PAReveal>
          <STag c="Our Team"/>
          <STitle c="Executive Committee 2026"/>
        </PAReveal>
        <PAReveal delay={.08}>
          <div className="pa-team-r1" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, maxWidth: 820, margin: "0 auto 22px" }}>
            {TEAM.slice(0,3).map((m,i) => <MemberCard key={i} m={m}/>)}
          </div>
        </PAReveal>
        <PAReveal delay={.14}>
          <div className="pa-team-r2" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }}>
            {TEAM.slice(3,7).map((m,i) => <MemberCard key={i+3} m={m}/>)}
          </div>
        </PAReveal>
      </section>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 6%" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(0,191,255,.18),transparent)" }}/>
      </div>

      {/* FORMER MESSAGES */}
      <section style={{ padding: "80px 6% 130px", maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <PAReveal>
          <STag c="Words From Our Formers"/>
          <STitle c="A Message From Those Who Led"/>
        </PAReveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {FORMER_MESSAGES.map((p,i) => (
            <PAReveal key={i} delay={i*.09}>
              <MessageBubble p={p}/>
            </PAReveal>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "0 6%" }}>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(0,191,255,.18),transparent)" }}/>
      </div>

      <section style={{ padding: "80px 6% 100px", maxWidth: 1300, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <PAReveal>
          <STag c="Find Us"/>
          <STitle c="Our Location"/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginTop: 40 }} className="pa-hero-grid">

            {/* Left — address details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(0,191,255,.08)", border: "1px solid rgba(0,191,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontFamily: "'Cinzel',Georgia,serif", color: "white", fontSize: 15, fontWeight: 700, marginBottom: 6 }}>École Nationale d'Ingénieurs de Tunis</div>
                  <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: "rgba(255,255,255,.45)", fontSize: 15, lineHeight: 1.9 }}>ENIT, Belvédère<br/>1002 Tunis, Tunisia</div>
                </div>
              </div>

              <div style={{ height: 1, background: "linear-gradient(90deg,rgba(0,191,255,.15),transparent)" }}/>

              {[
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>, label: "Founded here", value: "May 24th, 2005" },
                { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#00bfff" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Campus", value: "ENIT Main Building" },
              ].map(({ icon, label, value }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(0,191,255,.06)", border: "1px solid rgba(0,191,255,.14)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontFamily: "'Cinzel',Georgia,serif", color: "rgba(255,255,255,.3)", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: "rgba(255,255,255,.7)", fontSize: 15 }}>{value}</div>
                  </div>
                </div>
              ))}

              <a href="https://maps.google.com/?q=ENIT+Tunis+Tunisia" target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 24px", borderRadius: 30, background: "rgba(0,191,255,.07)", border: "1px solid rgba(0,191,255,.22)", color: "#00bfff", fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 2.5, textTransform: "uppercase", textDecoration: "none", width: "fit-content", transition: "all .28s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,191,255,.14)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,191,255,.07)"; e.currentTarget.style.transform = "none"; }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Open in Maps
              </a>
            </div>

            {/* Right — map embed */}
            <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(0,191,255,.15)", boxShadow: "0 20px 60px rgba(0,0,0,.45)", position: "relative" }}>
              <iframe
                title="ENIT Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3194.149!2d10.17098!3d36.81953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd33d47ef0573b%3A0x5df2a5a5a5a5a5a5!2sENIT!5e0!3m2!1sen!2stn!4v1700000000000"
                width="100%" height="320"
                style={{ display: "block", border: 0, filter: "grayscale(20%) invert(90%) hue-rotate(180deg) brightness(.82) contrast(.92)" }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
              <div style={{ position: "absolute", top: 14, left: 14, padding: "6px 14px", borderRadius: 20, background: "rgba(3,12,30,.85)", border: "1px solid rgba(0,191,255,.25)", backdropFilter: "blur(8px)", fontFamily: "'Cinzel',Georgia,serif", color: "#00bfff", fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase" }}>
                IEEE ENIT SB
              </div>
            </div>
          </div>
        </PAReveal>
      </section>

      <div style={{ padding: "22px 6%", borderTop: "1px solid rgba(0,191,255,.07)", display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div style={{ color: "rgba(255,255,255,.13)", fontSize: 9, letterSpacing: 5, fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase" }}>
          IEEE ENIT Student Branch · Est. 2005 · Tunisia
        </div>
      </div>
    </div>
  );
}

export default PageAbout;