import { useState, useEffect, useRef } from "react";

/* ── COLOUR PALETTE ── */
const C = {
  bg:       "#080807",
  bgDeep:   "#0d0c08",
  bgCard:   "rgba(255,255,255,.026)",
  yellow:   "#f5c400",
  gold:     "#ffd700",
  amber:    "#ffaa00",
  lime:     "#c8e600",
  white:    "#ffffff",
  muted:    "rgba(255,255,255,.42)",
  border:   "rgba(245,196,0,.13)",
  grad:     "linear-gradient(135deg, #f5c400, #ffaa00)",
  gradFull: "linear-gradient(135deg, #f5c400 0%, #c8e600 50%, #ffaa00 100%)",
  gradSoft: "linear-gradient(135deg, rgba(245,196,0,.16), rgba(200,230,0,.08))",
};

/* ── GLOBAL CSS ── */
const CS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Share+Tech+Mono&display=swap');

  @keyframes cs-float  { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-14px) rotate(.7deg)} 70%{transform:translateY(-6px) rotate(-.5deg)} }
  @keyframes cs-pulse  { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.07)} }
  @keyframes cs-ring   { 0%{transform:scale(1);opacity:.55} 100%{transform:scale(2.5);opacity:0} }
  @keyframes cs-glow   { 0%,100%{box-shadow:0 0 28px rgba(245,196,0,.15),0 0 60px rgba(255,170,0,.07)} 50%{box-shadow:0 0 60px rgba(245,196,0,.38),0 0 110px rgba(200,230,0,.15)} }
  @keyframes cs-spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes cs-spin-r { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes cs-scroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes cs-card-in{ from{opacity:0;transform:translateY(26px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes cs-shimmer{ 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes cs-particle{
    0%  {transform:translateY(0) translateX(0) scale(1);opacity:.8}
    100%{transform:translateY(var(--dy)) translateX(var(--dx)) scale(0);opacity:0}
  }

  /* CODE RAIN — matrix-style columns */
  @keyframes cs-rain-col {
    0%   { transform: translateY(-100%); opacity: 0; }
    5%   { opacity: 1; }
    90%  { opacity: .7; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  /* CURSOR BLINK */
  @keyframes cs-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  /* CIRCUIT TRACE */
  @keyframes cs-trace {
    0%   { stroke-dashoffset: 800; opacity: .8; }
    100% { stroke-dashoffset: 0;   opacity: .15; }
  }
  /* TYPING */
  @keyframes cs-type {
    from { width: 0; }
    to   { width: 100%; }
  }
  /* NODE PULSE */
  @keyframes cs-node-pulse {
    0%,100% { r: 3; opacity: .5; }
    50%     { r: 6; opacity: 1; }
  }
  /* SCAN LINE */
  @keyframes cs-scan {
    0%   { top: -4px; }
    100% { top: 100%; }
  }

  .cs-card-anim { animation: cs-card-in .52s cubic-bezier(.16,1,.3,1) both; }
  .cs-card-anim:nth-child(1){animation-delay:.05s}
  .cs-card-anim:nth-child(2){animation-delay:.11s}
  .cs-card-anim:nth-child(3){animation-delay:.17s}
  .cs-card-anim:nth-child(4){animation-delay:.23s}
  .cs-card-anim:nth-child(5){animation-delay:.29s}
  .cs-card-anim:nth-child(6){animation-delay:.35s}

  .cs-grad-text {
    background: linear-gradient(90deg, #f5c400, #c8e600, #ffaa00, #f5c400);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: cs-shimmer 4s linear infinite;
  }
  .cs-mono { font-family: 'Share Tech Mono', 'Courier New', monospace; }

  @media(max-width:900px){
    .cs-hero-grid { grid-template-columns:1fr!important; }
    .cs-two-col   { grid-template-columns:1fr!important; }
    .cs-team-row  { grid-template-columns:repeat(2,1fr)!important; }
  }
  @media(max-width:520px){
    .cs-team-row  { grid-template-columns:1fr!important; }
  }
`;

/* ════════════════════════════════════════════════════
   CODE RAIN  (matrix-style falling characters)
════════════════════════════════════════════════════ */
const CODE_CHARS = "01アイウエオ{}()<>[]//;:=>+*#&%$@!?~".split("");
const RAIN_COLS = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i / 28) * 100}%`,
  dur:  `${Math.random() * 8 + 5}s`,
  del:  `${Math.random() * 12}s`,
  chars: Array.from({ length: 18 }, () =>
    CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  ),
}));

function CodeRain() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {RAIN_COLS.map(col => (
        <div key={col.id} style={{
          position: "absolute",
          left: col.left,
          top: 0,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          animation: `cs-rain-col ${col.dur} linear ${col.del} infinite`,
          opacity: 0,
        }}>
          {col.chars.map((ch, i) => (
            <span key={i} className="cs-mono" style={{
              fontSize: 11,
              color: i === col.chars.length - 1
                ? `rgba(245,196,0,.9)`
                : `rgba(245,196,0,${0.06 + (i / col.chars.length) * 0.3})`,
              lineHeight: 1.4,
              display: "block",
            }}>{ch}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   ANIMATED BACKGROUND
════════════════════════════════════════════════════ */
function CSBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Base */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 20% 30%, rgba(245,196,0,.09) 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 70%, rgba(200,230,0,.06) 0%, transparent 48%),
                     linear-gradient(180deg, #080807 0%, #0d0c08 100%)`,
      }}/>

      {/* Code rain — subtle, full screen */}
      <div style={{ position: "absolute", inset: 0, opacity: .18 }}>
        <CodeRain />
      </div>

      {/* Circuit board SVG traces */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .06 }}
        xmlns="http://www.w3.org/2000/svg">
        {/* Horizontal traces */}
        {[15, 35, 55, 72, 88].map((y, i) => (
          <line key={i} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`}
            stroke="#f5c400" strokeWidth=".6"
            strokeDasharray="20 40 6 40"
            style={{ animation: `cs-trace ${6 + i}s linear ${i * 1.2}s infinite` }}
          />
        ))}
        {/* Vertical traces */}
        {[10, 28, 50, 68, 85].map((x, i) => (
          <line key={i} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%"
            stroke="#f5c400" strokeWidth=".6"
            strokeDasharray="15 50 4 50"
            style={{ animation: `cs-trace ${7 + i}s linear ${i * 1.5 + 2}s infinite` }}
          />
        ))}
        {/* Circuit nodes at intersections */}
        {[15,35,55,72,88].flatMap((y, yi) =>
          [10,28,50,68,85].map((x, xi) => (
            <circle key={`${yi}-${xi}`} cx={`${x}%`} cy={`${y}%`} r="3"
              fill="none" stroke="#f5c400" strokeWidth=".8" opacity=".4">
              <animate attributeName="opacity" values=".1;.6;.1"
                dur={`${3 + (yi + xi) * 0.7}s`}
                begin={`${(yi * xi) * 0.3}s`}
                repeatCount="indefinite"/>
            </circle>
          ))
        )}
      </svg>

      {/* Neural network dots — top right */}
      <svg style={{ position: "absolute", right: "-2%", top: "5%", width: 320, height: 320, opacity: .07 }}
        viewBox="0 0 320 320">
        <NeuralNet/>
      </svg>

      {/* Floating data particles */}
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: Math.random() * 3 + 2,
          height: Math.random() * 3 + 2,
          borderRadius: "50%",
          background: i % 3 === 0 ? C.yellow : i % 3 === 1 ? C.lime : C.amber,
          "--dx": `${(Math.random() - .5) * 90}px`,
          "--dy": `${-(Math.random() * 130 + 40)}px`,
          animation: `cs-particle ${Math.random() * 7 + 4}s ease-out ${Math.random() * 10}s infinite`,
          opacity: .7,
        }}/>
      ))}

      {/* Binary stream — bottom left */}
      <div style={{
        position: "absolute", bottom: "8%", left: "3%",
        fontFamily: "'Share Tech Mono','Courier New',monospace",
        fontSize: 10, color: "rgba(245,196,0,.08)",
        lineHeight: 1.8, width: 180,
        animation: "cs-spin 60s linear infinite",
        letterSpacing: 2,
      }}>
        {Array.from({ length: 8 }, (_, i) =>
          <div key={i}>{Array.from({ length: 20 }, () => Math.round(Math.random())).join(" ")}</div>
        )}
      </div>

      {/* Accent vertical line */}
      <div style={{
        position: "absolute", left: "18%", top: 0, width: 1, height: "100%",
        background: "linear-gradient(to bottom, transparent, rgba(245,196,0,.1) 30%, rgba(200,230,0,.07) 70%, transparent)",
      }}/>
      <div style={{
        position: "absolute", right: "22%", top: 0, width: 1, height: "100%",
        background: "linear-gradient(to bottom, transparent, rgba(245,196,0,.08) 40%, transparent)",
      }}/>
    </div>
  );
}

/* Mini neural net SVG */
function NeuralNet() {
  const layers = [[40, 120, 200, 280], [80, 160, 240], [120, 200], [160]];
  const xPositions = [40, 120, 220, 290];
  const links = [];
  layers.forEach((layer, li) => {
    if (li < layers.length - 1) {
      layer.forEach(y1 => {
        layers[li + 1].forEach(y2 => {
          links.push({ x1: xPositions[li], y1, x2: xPositions[li + 1], y2 });
        });
      });
    }
  });
  return (
    <>
      {links.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="#f5c400" strokeWidth=".6" opacity=".35"/>
      ))}
      {layers.flatMap((layer, li) =>
        layer.map((y, ni) => (
          <circle key={`${li}-${ni}`} cx={xPositions[li]} cy={y} r="5"
            fill="rgba(245,196,0,.2)" stroke="#f5c400" strokeWidth=".8">
            <animate attributeName="opacity" values=".3;.9;.3"
              dur={`${2 + (li + ni) * 0.5}s`} begin={`${li * 0.4 + ni * 0.2}s`}
              repeatCount="indefinite"/>
          </circle>
        ))
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════
   ANIMATED EMBLEM — CS tech sphere
════════════════════════════════════════════════════ */
function CSEmblem() {
  return (
    <div style={{ position: "relative", width: 340, height: 340,
      animation: "cs-float 9s ease-in-out infinite" }}>
      {/* Pulse rings */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "1px solid rgba(245,196,0,.22)",
          animation: `cs-ring 3s ease-out ${i * .85}s infinite`,
        }}/>
      ))}

      {/* Main sphere */}
      <div style={{
        position: "absolute", inset: 18, borderRadius: "50%",
        background: "linear-gradient(145deg, rgba(245,196,0,.12), rgba(200,230,0,.06), rgba(255,170,0,.08))",
        border: "1.5px solid rgba(245,196,0,.28)",
        animation: "cs-glow 4.5s ease-in-out infinite",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(14px)", overflow: "hidden",
      }}>
        {/* Scanline effect inside */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(245,196,0,.35), transparent)",
          animation: "cs-scan 3s linear infinite", pointerEvents: "none",
        }}/>
        <img src="/logos/CS White.png" alt="CS Chapter"
          style={{ width: "62%", height: "62%", objectFit: "contain",
            filter: "drop-shadow(0 0 18px rgba(245,196,0,.55))" }}/>
      </div>

      {/* Orbiting tech labels */}
      {[
        { label: "AI",     angle: 270, color: C.yellow },
        { label: "CYBER",  angle: 18,  color: C.lime   },
        { label: "CODE",   angle: 90,  color: C.amber  },
        { label: "WEB",    angle: 162, color: C.yellow },
        { label: "DATA",   angle: 234, color: C.lime   },
      ].map(({ label, angle, color }, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 140;
        const x = 170 + r * Math.cos(rad) - 26;
        const y = 170 + r * Math.sin(rad) - 16;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            padding: "6px 12px", borderRadius: 8,
            background: `linear-gradient(135deg, ${color}22, ${color}08)`,
            border: `1px solid ${color}50`,
            fontFamily: "'Share Tech Mono','Courier New',monospace",
            fontSize: 10, fontWeight: 700, color, letterSpacing: 2,
            boxShadow: `0 2px 16px ${color}22`,
            animation: `cs-float ${6 + i * 1.4}s ease-in-out ${i * 0.5}s infinite`,
          }}>{label}</div>
        );
      })}

      {/* Rotating ring with dashes */}
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        animation: "cs-spin 25s linear infinite", opacity: .18,
      }} viewBox="0 0 340 340">
        <circle cx="170" cy="170" r="162" fill="none"
          stroke="#f5c400" strokeWidth=".8" strokeDasharray="3 9"/>
      </svg>
      <svg style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        animation: "cs-spin-r 40s linear infinite", opacity: .1,
      }} viewBox="0 0 340 340">
        <circle cx="170" cy="170" r="148" fill="none"
          stroke="#c8e600" strokeWidth=".6" strokeDasharray="8 16"/>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   TYPING CODE BLOCK — hero accent
════════════════════════════════════════════════════ */
const CODE_SNIPPET = [
  { line: "class  IEEECSStudent  {",           color: "#f5c400" },
  { line: "  skills = ['AI','Cyber','Dev'];",  color: "rgba(255,255,255,.55)" },
  { line: "  chapter = 'ENIT · since 2007';", color: "rgba(255,255,255,.55)" },
  { line: "  solve(problem)  {",               color: "#c8e600" },
  { line: "    return  innovate(problem);",    color: "rgba(255,255,255,.4)"  },
  { line: "  }",                               color: "#c8e600" },
  { line: "}",                                 color: "#f5c400" },
];

function CodeBlock() {
  return (
    <div style={{
      background: "rgba(0,0,0,.55)", borderRadius: 14,
      border: "1px solid rgba(245,196,0,.18)",
      padding: "22px 26px", fontFamily: "'Share Tech Mono','Courier New',monospace",
      fontSize: 13, lineHeight: 2, backdropFilter: "blur(10px)",
      boxShadow: "0 8px 40px rgba(0,0,0,.4), 0 0 0 1px rgba(245,196,0,.08)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Terminal dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["#ff5f56","#ffbd2e","#27c93f"].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: .7 }}/>
        ))}
      </div>
      {CODE_SNIPPET.map((row, i) => (
        <div key={i} style={{ color: row.color, whiteSpace: "pre" }}>
          {row.line}
          {i === CODE_SNIPPET.length - 1 && (
            <span style={{ borderRight: "2px solid #f5c400",
              animation: "cs-blink 1s step-end infinite", marginLeft: 2 }}/>
          )}
        </div>
      ))}
      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(245,196,0,.2), transparent)",
        animation: "cs-scan 4s linear infinite", pointerEvents: "none",
      }}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════ */
function CSHero({ onBack }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 6% 80px", position: "relative", zIndex: 1,
    }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", width: "100%" }}>

        {/* Back */}
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(245,196,0,.07)", border: "1px solid rgba(245,196,0,.22)",
          borderRadius: 30, padding: "10px 22px", cursor: "pointer",
          color: C.yellow, fontSize: 11, fontWeight: 600, letterSpacing: 2,
          fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase",
          marginBottom: 50, transition: "all .3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(245,196,0,.14)"; e.currentTarget.style.transform = "translateX(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,196,0,.07)"; e.currentTarget.style.transform = "translateX(0)"; }}>
          ← Back to Sub-Units
        </button>

        <div className="cs-hero-grid" style={{
          display: "grid", gridTemplateColumns: "1.1fr .9fr",
          gap: 70, alignItems: "center",
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}>
          {/* Left */}
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "7px 20px", borderRadius: 30, marginBottom: 26,
              background: "rgba(245,196,0,.08)", border: "1px solid rgba(245,196,0,.28)",
              animation: "cs-pulse 3s ease-in-out infinite",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%",
                background: C.grad, boxShadow: `0 0 10px ${C.yellow}` }}/>
              <span style={{ color: C.amber, fontSize: 10, letterSpacing: 4,
                fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600 }}>
                IEEE ENIT SB · STUDENT BRANCH CHAPTER
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cinzel Decorative',Georgia,serif",
              fontSize: "clamp(1.8rem,4.5vw,3.8rem)", fontWeight: 900,
              lineHeight: 1.1, marginBottom: 10, color: "white",
            }}>
              Computer<br/>
              <span className="cs-grad-text">Society</span>
            </h1>

            <p style={{
              fontFamily: "'Cinzel',Georgia,serif", fontSize: "clamp(10px,1.3vw,13px)",
              letterSpacing: 5, color: C.muted, marginBottom: 24, textTransform: "uppercase",
            }}>IEEE CS ENIT Student Branch Chapter</p>

            {/* Yellow accent bar */}
            <div style={{
              width: 72, height: 3, borderRadius: 3,
              background: C.gradFull, marginBottom: 28,
            }}/>

            <p style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 2.1,
              color: "rgba(255,255,255,.56)", maxWidth: 520, marginBottom: 38,
            }}>
              A thriving community at ENIT focused on fostering innovation and excellence
              in computer science and technology — from AI and cybersecurity to competitive
              programming, software engineering and beyond.
            </p>

            {/* Stats */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 44 }}>
              {[["170+","Members"],["20+","Annual Activities"],["2007","Foundation Year"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Cinzel Decorative',Georgia,serif",
                    fontSize: "clamp(1.4rem,2.4vw,2rem)", fontWeight: 900,
                    background: C.gradFull,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>{v}</div>
                  <div style={{ color: "rgba(255,255,255,.28)", fontSize: 9, letterSpacing: 3,
                    textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,.22)", fontSize: 10, letterSpacing: 3,
                fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase" }}>Follow us</span>
              {[
                { label: "Facebook",  href: "#", icon: <FbIcon/>, color: "#1877f2" },
                { label: "Instagram", href: "#", icon: <IgIcon/>, color: "#e1306c" },
                { label: "LinkedIn",  href: "#", icon: <LiIcon/>, color: "#0a66c2" },
              ].map(({ label, href, icon, color }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "rgba(255,255,255,.04)", border: "1px solid rgba(245,196,0,.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,.4)", textDecoration: "none", transition: "all .28s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.borderColor = "rgba(245,196,0,.18)"; e.currentTarget.style.color = "rgba(255,255,255,.4)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — emblem + code block */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
            <CSEmblem/>
            <div style={{ width: "100%", maxWidth: 380 }}>
              <CodeBlock/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   ABOUT + FOCUS AREAS
════════════════════════════════════════════════════ */
function CSAbout() {
  return (
    <section style={{ padding: "60px 6% 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <CSReveal>
          <SectionLabel text="What We Do"/>
          <div className="cs-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
            <div>
              <h2 style={{
                fontFamily: "'Cinzel',Georgia,serif",
                fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700,
                color: "white", lineHeight: 1.35, marginBottom: 24,
              }}>
                Where Code Meets<br/>
                <span style={{ background: C.gradFull, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Innovation
                </span>
              </h2>
              <p style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 17, lineHeight: 2.1, color: "rgba(255,255,255,.56)", marginBottom: 18,
              }}>
                The <strong style={{ color: "white" }}>IEEE ENIT Computer Society Chapter</strong>, established in 2007,
                is one of the most active student chapters at ENIT — built around a passion for technology,
                problem solving and technical excellence.
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond',Georgia,serif",
                fontSize: 17, lineHeight: 2.1, color: "rgba(255,255,255,.42)",
              }}>
                We organise workshops, hackathons, competitive programming contests, and technical
                seminars to bridge academic knowledge with practical expertise. Our mission is to
                build engineers who don't just understand technology — they create it.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
              {[
                { icon: null, label: "AI", title: "Artificial Intelligence", desc: "Machine learning, neural networks and intelligent systems", color: C.yellow },
                { icon: null, label: "</> ", title: "Software Engineering",    desc: "Full-stack development, architecture and agile practices",  color: C.lime  },
                { icon: null, label: "CTF", title: "Cybersecurity",           desc: "Capture the flag, ethical hacking and secure systems",       color: C.amber },
                { icon: null, label: "CP",  title: "Competitive Programming", desc: "Algorithms, data structures and IEEEXtreme marathons",       color: C.yellow },
              ].map(({ label, title, desc, color }) => (
                <FocusCard key={title} label={label} title={title} desc={desc} color={color}/>
              ))}
            </div>
          </div>
        </CSReveal>
      </div>
    </section>
  );
}

function FocusCard({ label, title, desc, color }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "22px 18px", borderRadius: 16, cursor: "default",
        background: hov ? `linear-gradient(135deg,${color}18,${color}06)` : C.bgCard,
        border: `1px solid ${hov ? color + "45" : C.border}`,
        transition: "all .32s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
      }}>
      <div className="cs-mono" style={{
        fontSize: 13, fontWeight: 700, color, marginBottom: 10,
        letterSpacing: 2, filter: hov ? `drop-shadow(0 0 6px ${color}80)` : "none",
        transition: "filter .3s",
      }}>{label}</div>
      <div style={{ fontFamily: "'Cinzel',Georgia,serif", color: "white",
        fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
        color: "rgba(255,255,255,.4)", fontSize: 14, lineHeight: 1.75 }}>{desc}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   AUTO-SCROLLING GALLERY
════════════════════════════════════════════════════ */
const ACTIVITY_PHOTOS = [
  { src: "/cs/activity1.jpg", caption: "IEEEXtreme 19.0" },
  { src: "/cs/activity2.jpg", caption: "AI Workshop" },
  { src: "/cs/activity3.jpg", caption: "Cybersecurity CTF" },
  { src: "/cs/activity4.jpg", caption: "Hackathon CS" },
  { src: "/cs/activity5.jpg", caption: "Dev Bootcamp" },
  { src: "/cs/activity6.jpg", caption: "CS Seminar" },
  { src: "/cs/activity7.jpg", caption: "Competitive Programming" },
  { src: "/cs/activity8.jpg", caption: "IEEE Day CS" },
];

function ActivityGallery() {
  const [paused, setPaused] = useState(false);
  const items = [...ACTIVITY_PHOTOS, ...ACTIVITY_PHOTOS];

  return (
    <section style={{ padding: "60px 0", position: "relative", zIndex: 1, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
        background: `linear-gradient(to right, ${C.bg}, transparent)`, pointerEvents: "none" }}/>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
        background: `linear-gradient(to left, ${C.bg}, transparent)`, pointerEvents: "none" }}/>

      <div style={{ padding: "0 6%", maxWidth: 1300, margin: "0 auto 30px" }}>
        <SectionLabel text="Our Activities"/>
        <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
          fontSize: "clamp(1.5rem,2.8vw,2.3rem)", fontWeight: 700, color: "white" }}>
          Built in the Lab, Proven in the Field
        </h2>
      </div>

      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        style={{ overflow: "hidden", cursor: "grab" }}>
        <div style={{
          display: "flex", gap: 18,
          animation: "cs-scroll 30s linear infinite",
          animationPlayState: paused ? "paused" : "running",
          width: "max-content",
        }}>
          {items.map((photo, i) => <GalleryCard key={i} photo={photo}/>)}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 18, color: "rgba(255,255,255,.16)",
        fontSize: 10, letterSpacing: 4, fontFamily: "'Cinzel',Georgia,serif" }}>
        HOVER TO PAUSE · SCROLL THROUGH OUR MEMORIES
      </div>
    </section>
  );
}

function GalleryCard({ photo }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 280, height: 200, borderRadius: 14, flexShrink: 0,
        overflow: "hidden", position: "relative",
        border: `1px solid ${hov ? "rgba(245,196,0,.5)" : "rgba(245,196,0,.13)"}`,
        transition: "border-color .3s, transform .3s",
        transform: hov ? "scale(1.04)" : "scale(1)",
        boxShadow: hov ? "0 12px 40px rgba(245,196,0,.18)" : "none",
      }}>
      <div style={{
        width: "100%", height: "100%",
        background: "linear-gradient(135deg, rgba(245,196,0,.18), rgba(200,230,0,.10), rgba(8,8,7,.9))",
      }}>
        <img src={photo.src} alt={photo.caption}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.style.display = "none"; }}/>
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(8,8,7,.85) 0%, transparent 50%)",
        opacity: hov ? 1 : 0, transition: "opacity .3s",
      }}/>
      <div style={{
        position: "absolute", bottom: 12, left: 14,
        fontFamily: "'Share Tech Mono','Courier New',monospace",
        fontSize: 11, color: C.yellow, fontWeight: 600, letterSpacing: 1,
        opacity: hov ? 1 : 0, transition: "opacity .3s",
      }}>{photo.caption}</div>
      <div style={{
        position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%",
        background: C.grad, opacity: hov ? 1 : .4,
        boxShadow: "0 0 10px rgba(245,196,0,.6)", transition: "opacity .3s",
      }}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   EXECUTIVE COMMITTEE 2026
════════════════════════════════════════════════════ */
const CS_TEAM = [
  { name: "Dhia Gabsi",     role: "Chair",           photo: "/photos/cs/dhia.png" },
  { name: "Maram Hammami",  role: "Vice Chair",      photo: "/photos/cs/maram.png" },
  { name: "Nour Zouari",    role: "Secretary",       photo: "/photos/cs/nour.png" },
  { name: "Mouadh Zitouni", role: "Treasurer",       photo: "/photos/cs/mouadh.png" },
  { name: "Aziz Mokni",     role: "Project Manager", photo: "/photos/cs/aziz.png" },
  { name: "Ridha Charrad",  role: "Webmaster",       photo: "/photos/cs/ridha.png" },
];

const ROLE_COLORS = {
  "Chair":           { main: "#ffd700", glow: "rgba(255,215,0,.4)"    },
  "Vice Chair":      { main: "#f5c400", glow: "rgba(245,196,0,.38)"   },
  "Secretary":       { main: "#c8e600", glow: "rgba(200,230,0,.35)"   },
  "Treasurer":       { main: "#ffaa00", glow: "rgba(255,170,0,.35)"   },
  "Project Manager": { main: "#ffe066", glow: "rgba(255,224,102,.35)" },
  "Webmaster":       { main: "#ffcc33", glow: "rgba(255,204,51,.35)"  },
};

function CSTeam() {
  return (
    <section style={{ padding: "60px 6% 90px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <CSReveal>
          <SectionLabel text="Our Team"/>
          <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
            fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700,
            color: "white", marginBottom: 52 }}>
            Executive Committee 2026
          </h2>
        </CSReveal>

        {/* Chair — centred */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <div style={{ width: "clamp(210px,22%,268px)" }}>
            <CSMemberCard m={CS_TEAM[0]}/>
          </div>
        </div>

        {/* Remaining 5 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 18,
        }}
          className="cs-team-row">
          {CS_TEAM.slice(1).map((m, i) => <CSMemberCard key={i} m={m}/>)}
        </div>

        <style>{`
          @media(max-width:1000px){ .cs-team-row{grid-template-columns:repeat(3,1fr)!important;} }
          @media(max-width:640px) { .cs-team-row{grid-template-columns:repeat(2,1fr)!important;} }
          @media(max-width:380px) { .cs-team-row{grid-template-columns:1fr!important;} }
        `}</style>
      </div>
    </section>
  );
}

function CSMemberCard({ m }) {
  const [hov, setHov] = useState(false);
  const rc = ROLE_COLORS[m.role] || { main: C.yellow, glow: "rgba(245,196,0,.35)" };
  const init = m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="cs-card-anim"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, overflow: "hidden",
        border: `1px solid ${hov ? rc.main + "55" : "rgba(255,255,255,.07)"}`,
        background: hov
          ? `linear-gradient(170deg, ${rc.main}12, rgba(8,8,7,.98))`
          : C.bgCard,
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hov ? `0 22px 52px rgba(0,0,0,.5), 0 0 0 1px ${rc.main}22` : "none",
        display: "flex", flexDirection: "column",
      }}>

      {/* Photo area */}
      <div style={{
        height: 180, position: "relative", overflow: "hidden", flexShrink: 0,
        background: `linear-gradient(160deg, ${rc.main}22, rgba(8,8,7,.95))`,
      }}>
        {m.photo ? (
          <img src={m.photo} alt={m.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}/>
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Terminal-style avatar */}
            <div style={{
              width: 82, height: 82, borderRadius: 16,
              background: `linear-gradient(135deg, ${rc.main}40, rgba(8,8,7,.8))`,
              border: `1.5px solid ${rc.main}55`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: hov ? `0 0 30px ${rc.glow}` : "none",
              transition: "all .4s",
            }}>
              <div className="cs-mono" style={{ fontSize: 9, color: `${rc.main}80`, marginBottom: 4 }}>user@cs</div>
              <div style={{
                fontSize: 22, fontWeight: 700, color: rc.main,
                fontFamily: "'Cinzel Decorative',Georgia,serif",
              }}>{init}</div>
              <div style={{
                width: 20, height: 2,
                background: rc.main,
                borderRadius: 1,
                animation: "cs-blink 1s step-end infinite",
                marginTop: 6,
              }}/>
            </div>
          </div>
        )}

        {/* Role badge */}
        <div style={{
          position: "absolute", top: 11, left: 11,
          padding: "5px 12px", borderRadius: 20,
          background: `${rc.main}18`, border: `1px solid ${rc.main}40`,
          color: rc.main, fontSize: 9, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif",
          backdropFilter: "blur(8px)",
        }}>{m.role}</div>

        {hov && <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",
          animation: "cs-shimmer .9s ease forwards",
        }}/>}

        {/* Scan line on hover */}
        {hov && <div style={{
          position: "absolute", left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${rc.main}40, transparent)`,
          animation: "cs-scan 2s linear infinite",
        }}/>}
      </div>

      {/* Tear */}
      <div style={{ position: "relative", margin: "0 13px" }}>
        <div style={{ borderTop: `1px dashed ${rc.main}22` }}/>
        {[-1, 1].map(s => (
          <div key={s} style={{
            position: "absolute", top: -7, [s < 0 ? "left" : "right"]: -17,
            width: 14, height: 14, borderRadius: "50%",
            background: C.bg, border: "1px solid rgba(255,255,255,.06)",
          }}/>
        ))}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 18px", flex: 1 }}>
        <div style={{ color: "white", fontSize: 14, fontWeight: 700, marginBottom: 5,
          fontFamily: "'Cinzel',Georgia,serif", lineHeight: 1.3 }}>{m.name}</div>
        <div style={{ color: rc.main, fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
          fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600 }}>{m.role}</div>
        <div style={{
          height: 2, borderRadius: 1, marginTop: 12,
          background: `linear-gradient(90deg, ${rc.main}70, transparent)`,
          width: hov ? "65%" : "25%", transition: "width .5s ease",
        }}/>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MESSAGES FROM FORMERS
════════════════════════════════════════════════════ */
const CS_MESSAGES = [
  {
    name: "Aya Annabi",
    role: "CS Chapter Chair 2025",
    side: "left",
    color: C.yellow,
    msg: "IEEE CS ENIT shaped me into the engineer I am today. It wasn't just the workshops or the competitions — it was the culture of relentless curiosity and collaboration we built together. Every line of code we wrote, every algorithm we cracked, every late night before IEEEXtreme was worth it. To the new committee: raise the bar even higher. The community is counting on you.",
  },
  {
    name: "Salsabil Guerbej",
    role: "CS Chapter Training Manager 2024",
    side: "right",
    color: C.lime,
    msg: "Computer science is not just a discipline — it's a mindset. At IEEE CS ENIT, we taught each other that the best engineers are those who never stop learning. From our first CTF night to our last hackathon sprint, every memory is a reminder of what a passionate team can build. Keep pushing, keep shipping, keep breaking limits.",
  },
];

function CSMessages() {
  return (
    <section style={{ padding: "20px 6% 90px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <CSReveal>
          <SectionLabel text="Legacy & Words"/>
          <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
            fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700,
            color: "white", marginBottom: 50 }}>
            Words From Those Who Coded This Legacy
          </h2>
        </CSReveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 42 }}>
          {CS_MESSAGES.map((p, i) => (
            <CSReveal key={i} delay={i * .1}>
              <CSBubble p={p}/>
            </CSReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CSBubble({ p }) {
  const [hov, setHov] = useState(false);
  const isLeft = p.side === "left";
  const init = p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse",
      alignItems: "flex-start", gap: 26 }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 76, height: 76, borderRadius: 16,
          background: `linear-gradient(135deg, ${p.color}50, rgba(8,8,7,.7))`,
          border: `2px solid ${p.color}55`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 22px ${p.color}28`,
        }}>
          <div className="cs-mono" style={{ fontSize: 8, color: `${p.color}80`, marginBottom: 2 }}>user</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: p.color,
            fontFamily: "'Cinzel Decorative',Georgia,serif" }}>{init}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "white", fontSize: 12, fontWeight: 700,
            fontFamily: "'Cinzel',Georgia,serif", whiteSpace: "nowrap" }}>{p.name}</div>
          <div style={{ color: p.color, fontSize: 9, letterSpacing: 2,
            fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase",
            whiteSpace: "nowrap", marginTop: 3 }}>{p.role}</div>
        </div>
      </div>

      {/* Bubble */}
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          flex: 1, position: "relative",
          background: hov ? `linear-gradient(135deg, ${p.color}10, rgba(8,8,7,.97))` : C.bgCard,
          border: `1px solid ${hov ? p.color + "42" : "rgba(255,255,255,.07)"}`,
          borderRadius: isLeft ? "6px 22px 22px 22px" : "22px 6px 22px 22px",
          padding: "26px 32px",
          transition: "all .35s cubic-bezier(.16,1,.3,1)",
          boxShadow: hov ? `0 18px 48px rgba(0,0,0,.35), 0 0 0 1px ${p.color}20` : "none",
        }}>
        {/* Quote mark */}
        <div style={{
          position: "absolute", top: 12, [isLeft ? "left" : "right"]: 22,
          fontFamily: "Georgia,serif", fontSize: 62, lineHeight: 1,
          color: p.color, opacity: .1, fontWeight: 900, userSelect: "none",
        }}>"</div>

        {/* Tail */}
        <div style={{
          position: "absolute", top: 24, [isLeft ? "left" : "right"]: -9,
          width: 0, height: 0,
          borderTop: "9px solid transparent", borderBottom: "9px solid transparent",
          [isLeft ? "borderRight" : "borderLeft"]: `9px solid ${hov ? p.color + "25" : "rgba(255,255,255,.05)"}`,
          transition: "all .35s",
        }}/>

        <p style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: 17, lineHeight: 2, color: "rgba(255,255,255,.65)",
          fontStyle: "italic", position: "relative", zIndex: 1,
        }}>{p.msg}</p>

        <div style={{
          height: 2, borderRadius: 1, marginTop: 20,
          background: `linear-gradient(${isLeft ? "90deg" : "270deg"}, ${p.color}70, transparent)`,
          width: hov ? "55%" : "25%", transition: "width .5s ease",
        }}/>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SHARED HELPERS
════════════════════════════════════════════════════ */
function SectionLabel({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
      <div style={{ width: 36, height: 3, borderRadius: 2, background: C.gradFull }}/>
      <span style={{
        fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
        fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600,
        background: C.gradFull, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{text}</span>
    </div>
  );
}

function CSReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold: .07 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity .7s ${delay}s cubic-bezier(.16,1,.3,1), transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>{children}</div>
  );
}

function FbIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>; }
function IgIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>; }
function LiIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>; }

/* ════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════ */
function PageCS({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: "white",
      overflowX: "hidden", fontFamily: "'Cinzel',Georgia,serif", position: "relative",
    }}>
      <style>{CS_CSS}</style>
      <CSBackground/>
      <CSHero onBack={onBack}/>
      <CSAbout/>
      <ActivityGallery/>
      <CSTeam/>
      <CSMessages/>
      <div style={{
        padding: "26px 6%", borderTop: "1px solid rgba(245,196,0,.09)",
        display: "flex", justifyContent: "center", position: "relative", zIndex: 1,
      }}>
        <div style={{ color: "rgba(255,255,255,.15)", fontSize: 10, letterSpacing: 5,
          fontFamily: "'Cinzel',Georgia,serif" }}>
          IEEE CS ENIT SBC · WHERE CODE MEETS EXCELLENCE · EST. 2007
        </div>
      </div>
    </div>
  );
}

export default PageCS;
