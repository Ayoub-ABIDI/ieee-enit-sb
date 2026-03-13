import { useState, useEffect, useRef } from "react";

/* ── COLOUR PALETTE ── */
const C = {
  bg:       "#07080f",
  bgDeep:   "#0b0d18",
  bgCard:   "rgba(255,255,255,.026)",
  orange:   "#f97316",
  amber:    "#fb923c",
  blue:     "#2563eb",
  sky:      "#38bdf8",
  cyan:     "#06b6d4",
  gold:     "#f59e0b",
  muted:    "rgba(255,255,255,.42)",
  border:   "rgba(249,115,22,.14)",
  grad:     "linear-gradient(135deg, #f97316, #2563eb)",
  gradFull: "linear-gradient(135deg, #f97316 0%, #fb923c 30%, #2563eb 65%, #38bdf8 100%)",
  gradSoft: "linear-gradient(135deg, rgba(249,115,22,.16), rgba(37,99,235,.10))",
};

/* ── GLOBAL CSS ── */
const SIGHT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Share+Tech+Mono&display=swap');

  @keyframes sight-float   { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-14px) rotate(.7deg)} 70%{transform:translateY(-6px) rotate(-.5deg)} }
  @keyframes sight-pulse   { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.07)} }
  @keyframes sight-ring    { 0%{transform:scale(1);opacity:.55} 100%{transform:scale(2.6);opacity:0} }
  @keyframes sight-glow    { 0%,100%{box-shadow:0 0 28px rgba(249,115,22,.18),0 0 60px rgba(37,99,235,.08)} 50%{box-shadow:0 0 60px rgba(249,115,22,.4),0 0 110px rgba(56,189,248,.16)} }
  @keyframes sight-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes sight-spin-r  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes sight-scroll  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes sight-card-in { from{opacity:0;transform:translateY(26px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes sight-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes sight-particle{ 0%{transform:translateY(0) translateX(0) scale(1);opacity:.8} 100%{transform:translateY(var(--dy)) translateX(var(--dx)) scale(0);opacity:0} }
  @keyframes sight-ping    { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(2.4);opacity:0} }
  @keyframes sight-scan    { 0%{top:-2px} 100%{top:100%} }
  @keyframes sight-wave-up { 0%{transform:scaleY(0);opacity:0} 100%{transform:scaleY(1);opacity:1} }
  @keyframes sight-draw    { from{stroke-dashoffset:600} to{stroke-dashoffset:0} }
  @keyframes sight-globe-spin { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} }

  /* Connection lines drawing between project nodes */
  @keyframes sight-connect {
    0%   { stroke-dashoffset: 200; opacity: 0; }
    20%  { opacity: .6; }
    80%  { opacity: .6; }
    100% { stroke-dashoffset: 0; opacity: .12; }
  }

  .sight-card-anim{animation:sight-card-in .52s cubic-bezier(.16,1,.3,1) both}
  .sight-card-anim:nth-child(1){animation-delay:.05s}
  .sight-card-anim:nth-child(2){animation-delay:.11s}
  .sight-card-anim:nth-child(3){animation-delay:.17s}
  .sight-card-anim:nth-child(4){animation-delay:.23s}
  .sight-card-anim:nth-child(5){animation-delay:.29s}
  .sight-card-anim:nth-child(6){animation-delay:.35s}

  .sight-grad-text{
    background:linear-gradient(90deg,#f97316,#fb923c,#2563eb,#38bdf8,#f97316);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:sight-shimmer 5s linear infinite;
  }
  .sight-mono{font-family:'Share Tech Mono','Courier New',monospace}

  @media(max-width:900px){
    .sight-hero-grid{grid-template-columns:1fr!important}
    .sight-two-col  {grid-template-columns:1fr!important}
    .sight-team-row {grid-template-columns:repeat(2,1fr)!important}
    .sight-proj-grid{grid-template-columns:1fr!important}
  }
  @media(max-width:520px){
    .sight-team-row {grid-template-columns:1fr!important}
  }
`;

/* ════════════════════════════════════════════════════
   GLOBE / EARTH SVG — humanitarian world motif
════════════════════════════════════════════════════ */
function GlobeSVG() {
  return (
    <svg viewBox="0 0 260 260" width="260" height="260"
      style={{ display: "block", filter: "drop-shadow(0 0 24px rgba(249,115,22,.35))" }}>
      <defs>
        <linearGradient id="sg-globe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a8a" stopOpacity=".9"/>
          <stop offset="100%" stopColor="#0c1445" stopOpacity=".95"/>
        </linearGradient>
        <radialGradient id="sg-glow" cx="35%" cy="32%">
          <stop offset="0%" stopColor="rgba(249,115,22,.25)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </radialGradient>
        <filter id="sg-gf">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="sg-clip">
          <circle cx="130" cy="130" r="100"/>
        </clipPath>
      </defs>

      {/* Outer atmosphere rings */}
      {[108,114,120].map((r,i)=>(
        <circle key={i} cx="130" cy="130" r={r}
          fill="none" stroke={i===0?"rgba(249,115,22,.15)":"rgba(56,189,248,.08)"}
          strokeWidth={i===0?1:.6}>
          {i===0&&<animate attributeName="opacity" values=".3;.8;.3" dur="3s" repeatCount="indefinite"/>}
        </circle>
      ))}

      {/* Globe body */}
      <circle cx="130" cy="130" r="100" fill="url(#sg-globe)" stroke="rgba(37,99,235,.4)" strokeWidth="1.2"/>
      <circle cx="130" cy="130" r="100" fill="url(#sg-glow)"/>

      {/* Latitude lines */}
      {[-60,-30,0,30,60].map((lat,i)=>{
        const y=130-lat*100/90;
        const rx=Math.sqrt(Math.max(0,10000-(y-130)**2));
        return rx>2?(
          <ellipse key={i} cx="130" cy={y} rx={rx} ry={rx*.2}
            fill="none" stroke="rgba(56,189,248,.12)" strokeWidth=".6"/>
        ):null;
      })}

      {/* Longitude lines (meridians) */}
      {[0,36,72,108,144].map((lng,i)=>(
        <ellipse key={i} cx="130" cy="130" rx={100*Math.abs(Math.cos(lng*Math.PI/180))} ry="100"
          fill="none" stroke="rgba(56,189,248,.1)" strokeWidth=".6"
          transform={`rotate(${lng},130,130)`}/>
      ))}

      {/* Land masses — simplified continents */}
      <g clipPath="url(#sg-clip)" fill="rgba(22,163,74,.35)" stroke="rgba(22,163,74,.5)" strokeWidth=".5">
        {/* Africa */}
        <path d="M128 96 Q138 92 145 100 Q152 115 148 135 Q145 148 138 152 Q128 155 122 148 Q115 138 118 120 Q120 105 128 96Z"/>
        {/* Europe */}
        <path d="M120 74 Q130 70 136 76 Q140 82 136 88 Q128 90 122 86 Q116 80 120 74Z"/>
        {/* Americas hint */}
        <path d="M80 88 Q90 82 96 90 Q100 102 96 118 Q90 128 82 124 Q74 116 76 102 Q76 94 80 88Z"/>
        {/* Asia */}
        <path d="M148 78 Q162 72 170 82 Q176 94 168 106 Q158 112 148 108 Q140 100 142 88 Q144 82 148 78Z"/>
      </g>

      {/* Ping nodes — humanitarian hotspots */}
      {[
        {cx:128,cy:120,color:"#f97316",dur:"2.8s",del:"0s"},
        {cx:90, cy:106,color:"#38bdf8",dur:"3.4s",del:".8s"},
        {cx:158,cy:90, color:"#f97316",dur:"3s",  del:"1.4s"},
        {cx:82, cy:140,color:"#38bdf8",dur:"2.6s",del:".4s"},
      ].map((p,i)=>(
        <g key={i}>
          <circle cx={p.cx} cy={p.cy} r="3" fill={p.color} filter="url(#sg-gf)">
            <animate attributeName="opacity" values=".4;1;.4" dur={p.dur} begin={p.del} repeatCount="indefinite"/>
          </circle>
          <circle cx={p.cx} cy={p.cy} r="3" fill="none" stroke={p.color} strokeWidth="1"
            style={{animation:`sight-ping ${p.dur} ease-out ${p.del} infinite`}}/>
        </g>
      ))}

      {/* Connection arcs between hotspots */}
      <g fill="none">
        <path d="M128 120 Q108 80 90 106" stroke="rgba(249,115,22,.35)" strokeWidth=".8"
          strokeDasharray="200" strokeDashoffset="200"
          style={{animation:"sight-connect 4s ease-in-out 0.5s infinite"}}/>
        <path d="M90 106 Q120 95 158 90" stroke="rgba(56,189,248,.3)" strokeWidth=".8"
          strokeDasharray="200" strokeDashoffset="200"
          style={{animation:"sight-connect 5s ease-in-out 1.2s infinite"}}/>
        <path d="M82 140 Q105 130 128 120" stroke="rgba(249,115,22,.25)" strokeWidth=".8"
          strokeDasharray="200" strokeDashoffset="200"
          style={{animation:"sight-connect 3.5s ease-in-out 2s infinite"}}/>
      </g>

      {/* Highlight sheen */}
      <ellipse cx="102" cy="106" rx="28" ry="22" fill="rgba(255,255,255,.04)"
        transform="rotate(-25,102,106)"/>
    </svg>
  );
}

/* ════════════════════════════════════════════════════
   BACKGROUND — clean, professional
════════════════════════════════════════════════════ */
function SIGHTBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 15% 25%, rgba(249,115,22,.10) 0%, transparent 48%),
                     radial-gradient(ellipse at 88% 72%, rgba(37,99,235,.09) 0%, transparent 48%),
                     linear-gradient(180deg, #07080f 0%, #0b0d18 100%)`,
      }}/>
      {/* Subtle dot grid */}
      <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.025 }}>
        <defs>
          <pattern id="sg-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="#f97316"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sg-dots)"/>
      </svg>
      {/* Accent lines */}
      {[["16%","#f97316"],["84%","#2563eb"]].map(([x,col],i)=>(
        <div key={i} style={{
          position:"absolute", left:x, top:0, width:1, height:"100%",
          background:`linear-gradient(to bottom,transparent,${col}12 35%,${col}08 65%,transparent)`,
        }}/>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════
   TECH ILLUSTRATION — static, professional
════════════════════════════════════════════════════ */
function TechIllustration() {
  return (
    <div style={{ position: "relative", width: 360, height: 360,
      animation: "sight-float 10s ease-in-out infinite" }}>
      <svg viewBox="0 0 360 360" width="360" height="360" xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 8px 40px rgba(249,115,22,.20))" }}>
        <defs>
          <linearGradient id="si-og" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity=".9"/>
            <stop offset="100%" stopColor="#fb923c" stopOpacity=".7"/>
          </linearGradient>
          <linearGradient id="si-bl" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity=".9"/>
            <stop offset="100%" stopColor="#38bdf8" stopOpacity=".7"/>
          </linearGradient>
          <linearGradient id="si-mix" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316"/>
            <stop offset="100%" stopColor="#2563eb"/>
          </linearGradient>
          <radialGradient id="si-glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(249,115,22,.12)"/>
            <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle cx="180" cy="180" r="170" fill="rgba(249,115,22,.04)" stroke="rgba(249,115,22,.10)" strokeWidth="1"/>
        <circle cx="180" cy="180" r="170" fill="url(#si-glow)"/>

        {/* ── CIRCUIT BOARD PATTERN (background layer) ── */}
        {/* Horizontal traces */}
        <g stroke="rgba(249,115,22,.18)" strokeWidth="1.2" fill="none">
          <path d="M40 120 H90 V100 H140"/>
          <path d="M40 200 H80 V220 H130"/>
          <path d="M220 100 H270 V120 H320"/>
          <path d="M220 220 H260 V200 H320"/>
          <path d="M100 280 H140 V300 H200 V280 H240"/>
          <path d="M110 60 H160 V80 H200 V60 H250"/>
        </g>
        {/* Via pads */}
        {[[90,120],[140,100],[80,200],[130,220],[270,120],[220,100],[260,200],[220,220],[140,300],[200,280],[160,60],[200,80]].map(([x,y],i)=>(
          <g key={i}>
            <circle cx={x} cy={y} r="4.5" fill="rgba(249,115,22,.08)" stroke="rgba(249,115,22,.35)" strokeWidth="1"/>
            <circle cx={x} cy={y} r="2" fill="rgba(249,115,22,.5)"/>
          </g>
        ))}

        {/* ── CENTRAL HEXAGON — core tech motif ── */}
        <polygon points="180,100 230,127.5 230,182.5 180,210 130,182.5 130,127.5"
          fill="rgba(249,115,22,.07)" stroke="url(#si-mix)" strokeWidth="1.5"/>
        <polygon points="180,114 218,134.5 218,175.5 180,196 142,175.5 142,134.5"
          fill="rgba(37,99,235,.06)" stroke="rgba(37,99,235,.25)" strokeWidth=".8"/>

        {/* ── LOGO inside hex ── */}
        <image
          href="/logos/sight white.png"
          x="145" y="120"
          width="70" height="70"
          style={{ filter: "drop-shadow(0 0 10px rgba(249,115,22,.45))" }}
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ── CONNECTIVITY LINES from hex ── */}
        <g stroke="rgba(249,115,22,.22)" strokeWidth="1" strokeDasharray="4 4">
          <line x1="130" y1="127" x2="90" y2="100"/>
          <line x1="130" y1="183" x2="80" y2="220"/>
          <line x1="230" y1="127" x2="270" y2="100"/>
          <line x1="230" y1="183" x2="260" y2="220"/>
          <line x1="180" y1="210" x2="180" y2="290"/>
          <line x1="180" y1="100" x2="180" y2="55"/>
        </g>

        {/* ── ICON NODES at connection endpoints ── */}
        {/* Health — cross */}
        <g transform="translate(75,82)">
          <circle r="16" fill="rgba(249,115,22,.12)" stroke="rgba(249,115,22,.4)" strokeWidth="1"/>
          <rect x="-5" y="-1.5" width="10" height="3" rx="1" fill="#f97316"/>
          <rect x="-1.5" y="-5" width="3" height="10" rx="1" fill="#f97316"/>
        </g>
        {/* Water — drop */}
        <g transform="translate(65,218)">
          <circle r="16" fill="rgba(37,99,235,.12)" stroke="rgba(37,99,235,.4)" strokeWidth="1"/>
          <path d="M0 -8 Q6 -2 6 3 A6 6 0 0 1 -6 3 Q-6 -2 0 -8Z" fill="#38bdf8"/>
        </g>
        {/* Energy — bolt */}
        <g transform="translate(274,82)">
          <circle r="16" fill="rgba(251,146,60,.12)" stroke="rgba(251,146,60,.4)" strokeWidth="1"/>
          <path d="M2 -7 L-3 1 H1 L-2 8 L5 -1 H1 Z" fill="#fb923c"/>
        </g>
        {/* Education — book */}
        <g transform="translate(268,218)">
          <circle r="16" fill="rgba(56,189,248,.12)" stroke="rgba(56,189,248,.4)" strokeWidth="1"/>
          <rect x="-5" y="-5" width="4" height="10" rx="1" fill="#38bdf8" opacity=".7"/>
          <rect x="1" y="-5" width="4" height="10" rx="1" fill="#38bdf8"/>
          <path d="M-5 -5 Q0 -7 5 -5" stroke="#38bdf8" strokeWidth=".8" fill="none"/>
        </g>
        {/* Innovation — bulb bottom */}
        <g transform="translate(180,296)">
          <circle r="16" fill="rgba(249,115,22,.10)" stroke="rgba(249,115,22,.35)" strokeWidth="1"/>
          <path d="M0 -6 A5 5 0 0 1 5 -1 Q5 3 3 5 H-3 Q-5 3 -5 -1 A5 5 0 0 1 0 -6Z" fill="#f97316" opacity=".8"/>
          <rect x="-2.5" y="5" width="5" height="2" rx=".5" fill="#f97316" opacity=".6"/>
        </g>
        {/* Top node — people */}
        <g transform="translate(180,40)">
          <circle r="16" fill="rgba(37,99,235,.10)" stroke="rgba(37,99,235,.35)" strokeWidth="1"/>
          <circle cx="-4" cy="-3" r="3" fill="#2563eb" opacity=".8"/>
          <circle cx="4" cy="-3" r="3" fill="#2563eb" opacity=".8"/>
          <path d="M-9 5 Q-4 1 0 3 Q4 1 9 5" stroke="#2563eb" strokeWidth="1.2" fill="none" opacity=".8"/>
        </g>

        {/* ── OUTER TECH RING — static, professional ── */}
        <circle cx="180" cy="180" r="158" fill="none"
          stroke="rgba(249,115,22,.08)" strokeWidth="1" strokeDasharray="2 8"/>
        {/* Tick marks */}
        {Array.from({length:24},(_,i)=>{
          const a=(i/24)*2*Math.PI, r1=154, r2=160;
          return(
            <line key={i}
              x1={180+r1*Math.cos(a)} y1={180+r1*Math.sin(a)}
              x2={180+r2*Math.cos(a)} y2={180+r2*Math.sin(a)}
              stroke="rgba(249,115,22,.25)" strokeWidth={i%6===0?1.5:.6}/>
          );
        })}


      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════ */
function SIGHTHero({ onBack }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 6% 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", width: "100%" }}>

        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(249,115,22,.07)", border: "1px solid rgba(249,115,22,.24)",
          borderRadius: 30, padding: "10px 22px", cursor: "pointer",
          color: C.orange, fontSize: 11, fontWeight: 600, letterSpacing: 2,
          fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase",
          marginBottom: 50, transition: "all .3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,.15)"; e.currentTarget.style.transform = "translateX(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,.07)"; e.currentTarget.style.transform = "translateX(0)"; }}>
          ← Back to Sub-Units
        </button>

        <div className="sight-hero-grid" style={{
          display: "grid", gridTemplateColumns: "1.1fr .9fr",
          gap: 72, alignItems: "center",
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}>
          {/* Left */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "7px 20px", borderRadius: 30, marginBottom: 26,
              background: "rgba(249,115,22,.09)", border: "1px solid rgba(249,115,22,.28)",
              animation: "sight-pulse 3.2s ease-in-out infinite",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%",
                background: C.grad, boxShadow: `0 0 10px ${C.orange}` }}/>
              <span style={{ color: C.amber, fontSize: 10, letterSpacing: 4,
                fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600 }}>
                IEEE ENIT SB · SPECIAL INTEREST GROUP
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cinzel Decorative',Georgia,serif",
              fontSize: "clamp(1.9rem,4.5vw,4rem)", fontWeight: 900,
              lineHeight: 1.08, marginBottom: 10, color: "white",
            }}>
              SIGHT<br/>
              <span className="sight-grad-text">Group</span>
            </h1>

            <p style={{
              fontFamily: "'Cinzel',Georgia,serif", fontSize: "clamp(10px,1.3vw,13px)",
              letterSpacing: 5, color: C.muted, marginBottom: 24, textTransform: "uppercase",
            }}>Special Interest Group on Humanitarian Technology</p>

            <div style={{ display: "flex", gap: 0, marginBottom: 28, height: 3, borderRadius: 3, overflow: "hidden", width: 80 }}>
              <div style={{ flex: 1, background: C.orange }}/>
              <div style={{ flex: 1, background: C.amber }}/>
              <div style={{ flex: 1, background: C.blue }}/>
              <div style={{ flex: 1, background: C.sky }}/>
            </div>

            <p style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: "clamp(15px,1.7vw,18px)", lineHeight: 2.1,
              color: "rgba(255,255,255,.56)", maxWidth: 540, marginBottom: 38,
            }}>
              Using technology to tackle pressing social and humanitarian challenges.
              We bridge the gap between technical expertise and social responsibility,
              empowering engineers to create meaningful change for underserved communities.
            </p>

            <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginBottom: 44 }}>
              {[["75+","Members"],["15+","Annual Activities"],["2023","Foundation Year"],["5+","SDGs Addressed"]].map(([v, l]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{
                    fontFamily: "'Cinzel Decorative',Georgia,serif",
                    fontSize: "clamp(1.3rem,2.2vw,1.9rem)", fontWeight: 900,
                    background: C.gradFull, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>{v}</div>
                  <div style={{ color: "rgba(255,255,255,.27)", fontSize: 9, letterSpacing: 3,
                    textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

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
                    background: "rgba(255,255,255,.04)", border: "1px solid rgba(249,115,22,.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,.4)", textDecoration: "none", transition: "all .28s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.04)"; e.currentTarget.style.borderColor = "rgba(249,115,22,.2)"; e.currentTarget.style.color = "rgba(255,255,255,.4)"; e.currentTarget.style.transform = "translateY(0)"; }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — tech illustration + logos */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
            <TechIllustration/>

            {/* Single logo block — SIGHT × IEEE ENIT SB */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 16,
              padding: "14px 30px", borderRadius: 14,
              background: "rgba(255,255,255,.025)",
              border: "1px solid rgba(249,115,22,.14)",
            }}>
              <img src="/logos/sight white.png" alt="SIGHT"
                style={{ height: 44, width: "auto", objectFit: "contain",
                  filter: "drop-shadow(0 0 8px rgba(249,115,22,.4))" }}/>
              <div style={{ width: 1, height: 36, background: "rgba(255,255,255,.10)" }}/>
              <img src="/ENIT-WHITE.png" alt="IEEE ENIT SB"
                style={{ height: 44, width: "auto", objectFit: "contain",
                  filter: "drop-shadow(0 0 8px rgba(255,255,255,.18))" }}/>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   ABOUT
════════════════════════════════════════════════════ */
function SIGHTAbout() {
  return (
    <section style={{ padding: "0 6% 70px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SIGHTReveal>
          <SectionLabel text="About Us"/>
          <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
            fontSize: "clamp(1.4rem,2.6vw,2.2rem)", fontWeight: 700,
            color: "white", lineHeight: 1.35, marginBottom: 28 }}>
            Technology in Service of Humanity
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}
            className="sight-two-col">
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 17, lineHeight: 2.1, color: "rgba(255,255,255,.55)", margin: 0 }}>
              The <strong style={{ color: "white" }}>IEEE ENIT SIGHT Group</strong> is dedicated
              to using technology to tackle pressing social and humanitarian challenges.
              Founded in 2023 at ENIT, we foster innovation and collaboration among students
              to develop sustainable and impactful solutions for underserved communities.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 17, lineHeight: 2.1, color: "rgba(255,255,255,.42)", margin: 0 }}>
              Through workshops, projects and outreach initiatives, we bridge the gap between
              technical expertise and social responsibility — empowering engineers to create
              meaningful change. Our mission is simple: build a better society through the
              power of engineering.
            </p>
          </div>
        </SIGHTReveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   SDG SECTION — professional goal cards
════════════════════════════════════════════════════ */
const SDG_GOALS = [
  { num:"01", title:"No Poverty",          color:"#e5243b", desc:"End poverty in all its forms everywhere"                       },
  { num:"02", title:"Zero Hunger",         color:"#dda63a", desc:"Achieve food security and improved nutrition"                  },
  { num:"03", title:"Good Health",         color:"#4c9f38", desc:"Ensure healthy lives and well-being for all ages"              },
  { num:"04", title:"Quality Education",   color:"#c5192d", desc:"Inclusive and equitable quality education for all"             },
  { num:"05", title:"Gender Equality",     color:"#ff3a21", desc:"Achieve gender equality and empower all women and girls"       },
  { num:"06", title:"Clean Water",         color:"#26bde2", desc:"Ensure availability and sustainable water management"         },
  { num:"07", title:"Clean Energy",        color:"#fcc30b", desc:"Affordable, reliable, sustainable and modern energy for all"  },
  { num:"08", title:"Decent Work",         color:"#a21942", desc:"Promote sustained, inclusive economic growth"                 },
  { num:"09", title:"Innovation",          color:"#fd6925", desc:"Build resilient infrastructure and foster innovation"          },
  { num:"10", title:"Reduced Inequalities",color:"#dd1367", desc:"Reduce inequality within and among countries"                 },
  { num:"11", title:"Sustainable Cities",  color:"#fd9d24", desc:"Make cities inclusive, safe and sustainable"                  },
  { num:"13", title:"Climate Action",      color:"#3f7e44", desc:"Take urgent action to combat climate change"                  },
];

function SDGCard({ g, i }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 14, overflow: "hidden", cursor: "default",
        border: `1px solid ${hov ? g.color + "60" : "rgba(255,255,255,.07)"}`,
        background: hov ? `linear-gradient(160deg,${g.color}18,rgba(7,8,15,.98))` : "rgba(255,255,255,.02)",
        transition: "all .35s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-5px)" : "translateY(0)",
        boxShadow: hov ? `0 16px 40px rgba(0,0,0,.45), 0 0 0 1px ${g.color}20` : "none",
        animation: `sight-card-in .5s cubic-bezier(.16,1,.3,1) ${i * .04}s both`,
      }}>
      {/* Color bar */}
      <div style={{ height: 4, background: g.color }}/>
      <div style={{ padding: "16px 18px 18px" }}>
        {/* Number badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 38, height: 38, borderRadius: 10, marginBottom: 12,
          background: `${g.color}20`, border: `1.5px solid ${g.color}50`,
        }}>
          <span style={{
            fontFamily: "'Cinzel Decorative',Georgia,serif",
            fontSize: 12, fontWeight: 900, color: g.color,
          }}>{g.num}</span>
        </div>
        <div style={{
          fontFamily: "'Cinzel',Georgia,serif", color: "white",
          fontSize: 12, fontWeight: 700, lineHeight: 1.3, marginBottom: 8,
        }}>{g.title}</div>
        <div style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          color: "rgba(255,255,255,.38)", fontSize: 13, lineHeight: 1.7,
          opacity: hov ? 1 : .7, transition: "opacity .3s",
        }}>{g.desc}</div>
        <div style={{
          height: 2, borderRadius: 1, marginTop: 14,
          background: `linear-gradient(90deg,${g.color}70,transparent)`,
          width: hov ? "60%" : "20%", transition: "width .45s ease",
        }}/>
      </div>
    </div>
  );
}

function SDGSection() {
  return (
    <section style={{ padding: "60px 6% 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <SIGHTReveal>
          <SectionLabel text="Our Alignment"/>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
              fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700,
              color: "white", lineHeight: 1.3, margin: 0 }}>
              Sustainable Development Goals<br/>
              <span style={{ background: C.gradFull, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                We Work Towards
              </span>
            </h2>
            <div style={{
              padding: "10px 20px", borderRadius: 30,
              background: "rgba(249,115,22,.07)", border: "1px solid rgba(249,115,22,.22)",
              fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 3,
              color: C.amber, textTransform: "uppercase",
            }}>United Nations · 2030 Agenda</div>
          </div>
        </SIGHTReveal>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 14,
        }}>
          {SDG_GOALS.map((g, i) => (
            <SIGHTReveal key={g.num} delay={i * .04}>
              <SDGCard g={g} i={i}/>
            </SIGHTReveal>
          ))}
        </div>

        <SIGHTReveal delay={.25}>
          <div style={{
            marginTop: 36, padding: "18px 24px", borderRadius: 14,
            background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ width: 4, height: 40, borderRadius: 2, background: C.gradFull, flexShrink: 0 }}/>
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 16, lineHeight: 1.9, color: "rgba(255,255,255,.45)", margin: 0 }}>
              Every project initiated by the SIGHT Group is mapped to one or more UN Sustainable
              Development Goals — ensuring our engineering work creates measurable, lasting impact
              aligned with the global 2030 agenda.
            </p>
          </div>
        </SIGHTReveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   ANONYMOUS IDEA SUBMISSION FORM
════════════════════════════════════════════════════ */
function IdeaForm() {
  const [form, setForm] = useState({ sdg: "", idea: "" });
  const [status, setStatus] = useState("idle");
  const [focused, setFocused] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.idea.trim()) { setStatus("error"); return; }
    setStatus("loading");
    setTimeout(() => setStatus("success"), 1000);
  };

  const inp = (key, multiline = false) => {
    const base = {
      width: "100%", boxSizing: "border-box",
      background: focused === key ? "rgba(249,115,22,.06)" : "rgba(255,255,255,.03)",
      border: `1px solid ${focused === key ? "rgba(249,115,22,.40)" : "rgba(255,255,255,.10)"}`,
      borderRadius: 10, padding: "13px 16px",
      color: "white", fontSize: 15,
      fontFamily: "'Cormorant Garamond',Georgia,serif",
      outline: "none", transition: "border-color .2s, background .2s",
      boxShadow: focused === key ? "0 0 0 3px rgba(249,115,22,.09)" : "none",
    };
    return multiline ? { ...base, resize: "vertical", minHeight: 110 } : base;
  };

  if (status === "success") return (
    <div style={{
      padding: "48px 36px", borderRadius: 18, textAlign: "center",
      background: "rgba(255,255,255,.025)", border: "1px solid rgba(249,115,22,.22)",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
        background: "rgba(249,115,22,.12)", border: "1.5px solid rgba(249,115,22,.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <div style={{ fontFamily: "'Cinzel',Georgia,serif", color: "white",
        fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Idea Received</div>
      <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
        color: "rgba(255,255,255,.45)", fontSize: 16, lineHeight: 1.8, maxWidth: 320, margin: "0 auto 24px" }}>
        Thank you for contributing. The SIGHT team will review your idea.
      </p>
      <button onClick={() => { setForm({ sdg: "", idea: "" }); setStatus("idle"); }}
        style={{
          padding: "10px 26px", borderRadius: 30, cursor: "pointer",
          background: "rgba(249,115,22,.10)", border: "1px solid rgba(249,115,22,.30)",
          color: C.amber, fontSize: 11, fontWeight: 600, letterSpacing: 2,
          fontFamily: "'Cinzel',Georgia,serif",
        }}>Submit Another</button>
    </div>
  );

  return (
    <div style={{
      borderRadius: 18, border: "1px solid rgba(249,115,22,.16)",
      background: "rgba(255,255,255,.02)", overflow: "hidden",
    }}>
      {/* Header bar */}
      <div style={{
        padding: "18px 26px", borderBottom: "1px solid rgba(255,255,255,.06)",
        background: "linear-gradient(90deg,rgba(249,115,22,.07),rgba(37,99,235,.04))",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        <span style={{ fontFamily: "'Cinzel',Georgia,serif", color: "white",
          fontSize: 13, fontWeight: 700 }}>Submit a Project Idea</span>
        <span style={{ marginLeft: "auto", fontFamily: "'Cormorant Garamond',Georgia,serif",
          color: "rgba(255,255,255,.28)", fontSize: 13, fontStyle: "italic" }}>anonymous · no sign-in needed</span>
      </div>

      <div style={{ padding: "26px 26px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* SDG picker */}
        <div>
          <label style={{ display: "block", marginBottom: 7,
            fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 2,
            textTransform: "uppercase", color: "rgba(255,255,255,.38)" }}>
            Related SDG (optional)
          </label>
          <select value={form.sdg} onChange={e => set("sdg", e.target.value)}
            onFocus={() => setFocused("sdg")} onBlur={() => setFocused(null)}
            style={{ ...inp("sdg"), appearance: "none", cursor: "pointer" }}>
            <option value="" style={{ background: "#0b0d18" }}>Choose a Sustainable Development Goal</option>
            {SDG_GOALS.map(g => (
              <option key={g.num} value={`SDG ${g.num}`}
                style={{ background: "#0b0d18" }}>SDG {g.num} — {g.title}</option>
            ))}
          </select>
        </div>

        {/* Idea textarea */}
        <div>
          <label style={{ display: "block", marginBottom: 7,
            fontFamily: "'Cinzel',Georgia,serif", fontSize: 10, letterSpacing: 2,
            textTransform: "uppercase", color: "rgba(255,255,255,.38)" }}>
            Your Idea *
          </label>
          <textarea value={form.idea} onChange={e => set("idea", e.target.value)}
            onFocus={() => setFocused("idea")} onBlur={() => setFocused(null)}
            placeholder="Describe the problem and how technology could help solve it..."
            style={inp("idea", true)}/>
        </div>

        {status === "error" && (
          <div style={{
            padding: "11px 16px", borderRadius: 8,
            background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)",
            color: "#fca5a5", fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 14,
          }}>Please describe your idea before submitting.</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 4 }}>
          <button onClick={submit} disabled={status === "loading"}
            style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "12px 28px", borderRadius: 30, cursor: "pointer",
              background: C.grad, border: "none",
              color: "white", fontSize: 12, fontWeight: 700, letterSpacing: 2,
              fontFamily: "'Cinzel',Georgia,serif",
              boxShadow: "0 6px 24px rgba(249,115,22,.25)",
              opacity: status === "loading" ? .7 : 1, transition: "opacity .2s, transform .2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}>
            {status === "loading"
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
                  style={{ animation: "sight-spin 1s linear infinite" }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              : null}
            {status === "loading" ? "Submitting..." : "Submit Idea"}
          </button>
        </div>
      </div>
    </div>
  );
}

function IdeaSubmission() {
  return (
    <section style={{ padding: "20px 6% 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <SIGHTReveal>
          <SectionLabel text="Get Involved"/>
          <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
            fontSize: "clamp(1.4rem,2.6vw,2.2rem)", fontWeight: 700,
            color: "white", marginBottom: 10 }}>Propose a Project</h2>
          <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: 17, lineHeight: 2, color: "rgba(255,255,255,.42)",
            marginBottom: 30, maxWidth: 560 }}>
            Anyone can submit an idea — no account, no name required. If you have a concept
            that could help people, share it and the SIGHT team will take it from there.
          </p>
          <IdeaForm/>
        </SIGHTReveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   AUTO-SCROLLING GALLERY
════════════════════════════════════════════════════ */
const ACTIVITY_PHOTOS = [
  { src: "/sight/activity1.jpg", caption: "Community Outreach" },
  { src: "/sight/activity2.jpg", caption: "SDG Workshop" },
  { src: "/sight/activity3.jpg", caption: "Humanitarian Hackathon" },
  { src: "/sight/activity4.jpg", caption: "Field Deployment" },
  { src: "/sight/activity5.jpg", caption: "Awareness Campaign" },
  { src: "/sight/activity6.jpg", caption: "IEEE Day SIGHT" },
  { src: "/sight/activity7.jpg", caption: "Tech for Good Summit" },
  { src: "/sight/activity8.jpg", caption: "NGO Partnership" },
];

function ActivityGallery() {
  const [paused, setPaused] = useState(false);
  const items = [...ACTIVITY_PHOTOS, ...ACTIVITY_PHOTOS];
  return (
    <section style={{ padding: "60px 0", position: "relative", zIndex: 1, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
        background: `linear-gradient(to right,${C.bg},transparent)`, pointerEvents: "none" }}/>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
        background: `linear-gradient(to left,${C.bg},transparent)`, pointerEvents: "none" }}/>

      <div style={{ padding: "0 6%", maxWidth: 1300, margin: "0 auto 30px" }}>
        <SectionLabel text="Our Activities"/>
        <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
          fontSize: "clamp(1.5rem,2.8vw,2.3rem)", fontWeight: 700, color: "white" }}>
          Where Technology Meets Purpose
        </h2>
      </div>

      <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
        style={{ overflow: "hidden", cursor: "grab" }}>
        <div style={{
          display: "flex", gap: 18,
          animation: "sight-scroll 30s linear infinite",
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
        border: `1px solid ${hov ? "rgba(249,115,22,.5)" : "rgba(249,115,22,.14)"}`,
        transition: "border-color .3s, transform .3s",
        transform: hov ? "scale(1.04)" : "scale(1)",
        boxShadow: hov ? "0 12px 40px rgba(249,115,22,.2)" : "none",
      }}>
      <div style={{ width: "100%", height: "100%",
        background: "linear-gradient(135deg,rgba(249,115,22,.18),rgba(37,99,235,.14),rgba(7,8,15,.9))" }}>
        <img src={photo.src} alt={photo.caption}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.style.display = "none"; }}/>
      </div>
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(to top,rgba(7,8,15,.85) 0%,transparent 50%)",
        opacity: hov ? 1 : 0, transition: "opacity .3s" }}/>
      <div style={{ position: "absolute", bottom: 12, left: 14,
        fontFamily: "'Cinzel',Georgia,serif", fontSize: 11, color: "white",
        fontWeight: 600, letterSpacing: 1, opacity: hov ? 1 : 0, transition: "opacity .3s" }}>
        {photo.caption}
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%",
        background: C.grad, opacity: hov ? 1 : .4, boxShadow: "0 0 10px rgba(249,115,22,.6)",
        transition: "opacity .3s" }}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   EXECUTIVE COMMITTEE 2026
════════════════════════════════════════════════════ */
const SIGHT_TEAM = [
  { name: "Med Rabeh Mezrigui",  role: "Chair",               photo: "photos/sight/rabeh.png" },
  { name: "Yasmine Akermi",      role: "Vice Chair",          photo: "photos/sight/yasmine.png" },
  { name: "Lilia Soltani",       role: "Treasurer",           photo: "photos/sight/tresosight.png" },
  { name: "Arije Ferjani",       role: "Secretary",           photo: "photos/sight/arije.png" },
  { name: "Med Aziz Bedoui",     role: "Project Coordinator", photo: "photos/sight/aziz.png" },
  { name: "Seif Eloui",          role: "Webmaster",           photo: "photos/sight/seuf.png" },
];

const ROLE_COLORS = {
  "Chair":               { main: "#ffd700", glow: "rgba(255,215,0,.4)"   },
  "Vice Chair":          { main: "#f97316", glow: "rgba(249,115,22,.38)" },
  "Treasurer":           { main: "#06b6d4", glow: "rgba(6,182,212,.35)"  },
  "Secretary":           { main: "#2563eb", glow: "rgba(37,99,235,.35)"  },
  "Project Coordinator": { main: "#38bdf8", glow: "rgba(56,189,248,.35)" },
  "Webmaster":           { main: "#fb923c", glow: "rgba(251,146,60,.35)" },
};

function SIGHTTeam() {
  return (
    <section style={{ padding: "60px 6% 90px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <SIGHTReveal>
          <SectionLabel text="Our Team"/>
          <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
            fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700,
            color: "white", marginBottom: 52 }}>
            Executive Committee 2026
          </h2>
        </SIGHTReveal>

        {/* Chair centred */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
          <div style={{ width: "clamp(210px,22%,268px)" }}>
            <SIGHTMemberCard m={SIGHT_TEAM[0]}/>
          </div>
        </div>

        {/* Remaining 5 */}
        <div className="sight-team-row" style={{ display: "grid",
          gridTemplateColumns: "repeat(5,1fr)", gap: 18 }}>
          {SIGHT_TEAM.slice(1).map((m, i) => <SIGHTMemberCard key={i} m={m}/>)}
        </div>

        <style>{`
          @media(max-width:1000px){ .sight-team-row{grid-template-columns:repeat(3,1fr)!important;} }
          @media(max-width:640px) { .sight-team-row{grid-template-columns:repeat(2,1fr)!important;} }
          @media(max-width:380px) { .sight-team-row{grid-template-columns:1fr!important;} }
        `}</style>
      </div>
    </section>
  );
}

function SIGHTMemberCard({ m }) {
  const [hov, setHov] = useState(false);
  const rc = ROLE_COLORS[m.role] || { main: C.orange, glow: "rgba(249,115,22,.35)" };
  const init = m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="sight-card-anim"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 18, overflow: "hidden",
        border: `1px solid ${hov ? rc.main + "55" : "rgba(255,255,255,.07)"}`,
        background: hov ? `linear-gradient(170deg,${rc.main}14,rgba(7,8,15,.98))` : C.bgCard,
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hov ? `0 22px 52px rgba(0,0,0,.5),0 0 0 1px ${rc.main}22` : "none",
        display: "flex", flexDirection: "column",
      }}>

      {/* Photo area */}
      <div style={{ height: 180, position: "relative", overflow: "hidden", flexShrink: 0,
        background: `linear-gradient(160deg,${rc.main}22,rgba(7,8,15,.95))` }}>
        {m.photo ? (
          <img src={m.photo} alt={m.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}/>
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: 82, height: 82, borderRadius: "50%",
              background: `linear-gradient(135deg,${rc.main}45,rgba(7,8,15,.8))`,
              border: `2px solid ${rc.main}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: rc.main,
              fontFamily: "'Cinzel Decorative',Georgia,serif",
              boxShadow: hov ? `0 0 30px ${rc.glow}` : "none",
              transition: "all .4s",
            }}>{init}</div>
          </div>
        )}
        <div style={{
          position: "absolute", top: 11, left: 11, padding: "5px 12px", borderRadius: 20,
          background: `${rc.main}1a`, border: `1px solid ${rc.main}40`,
          color: rc.main, fontSize: 9, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", backdropFilter: "blur(8px)",
        }}>{m.role}</div>
        {hov && <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",
          animation: "sight-shimmer .9s ease forwards",
        }}/>}
        {hov && <div style={{
          position: "absolute", left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg,transparent,${rc.main}40,transparent)`,
          animation: "sight-scan 2.5s linear infinite",
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
        <div style={{ color: "white", fontSize: 13, fontWeight: 700, marginBottom: 5,
          fontFamily: "'Cinzel',Georgia,serif", lineHeight: 1.3 }}>{m.name}</div>
        <div style={{ color: rc.main, fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
          fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600 }}>{m.role}</div>
        <div style={{ height: 2, borderRadius: 1, marginTop: 12,
          background: `linear-gradient(90deg,${rc.main}70,transparent)`,
          width: hov ? "65%" : "25%", transition: "width .5s ease" }}/>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MESSAGES FROM FORMERS
════════════════════════════════════════════════════ */
const SIGHT_MESSAGES = [
  {
    name: "Adem Trabelsi",
    role: "SIGHT Group Lead 2024",
    side: "left",
    color: C.orange,
    msg: "SIGHT ENIT taught me that the most powerful engineering challenge is not the most complex one — it is the most necessary one. When we deployed our first water sensor in a village without running water analysis, I understood why we study engineering. Technology is only meaningful when it serves people. I am grateful to every member who chose impact over comfort.",
  },
  {
    name: "Salma Khammassi",
    role: "SIGHT Project Lead 2023",
    side: "right",
    color: C.blue,
    msg: "Building humanitarian technology is not charity — it is engineering at its fullest. It demands creativity, rigour and empathy all at once. At SIGHT ENIT, we learned to design for the user who has the least, and in doing so we became better engineers for every user. That mindset will stay with me for life.",
  },
];

function SIGHTMessages() {
  return (
    <section style={{ padding: "20px 6% 90px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <SIGHTReveal>
          <SectionLabel text="Legacy & Words"/>
          <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
            fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700,
            color: "white", marginBottom: 50 }}>
            Words From Those Who Shaped This Mission
          </h2>
        </SIGHTReveal>
        <div style={{ display: "flex", flexDirection: "column", gap: 42 }}>
          {SIGHT_MESSAGES.map((p, i) => (
            <SIGHTReveal key={i} delay={i * .1}>
              <SIGHTBubble p={p}/>
            </SIGHTReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SIGHTBubble({ p }) {
  const [hov, setHov] = useState(false);
  const isLeft = p.side === "left";
  const init = p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse",
      alignItems: "flex-start", gap: 26 }}>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 76, height: 76, borderRadius: "50%",
          background: `linear-gradient(135deg,${p.color}50,rgba(7,8,15,.7))`,
          border: `2px solid ${p.color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: p.color,
          fontFamily: "'Cinzel Decorative',Georgia,serif",
          boxShadow: `0 0 22px ${p.color}28`,
        }}>{init}</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "white", fontSize: 12, fontWeight: 700,
            fontFamily: "'Cinzel',Georgia,serif", whiteSpace: "nowrap" }}>{p.name}</div>
          <div style={{ color: p.color, fontSize: 9, letterSpacing: 2,
            fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase",
            whiteSpace: "nowrap", marginTop: 3 }}>{p.role}</div>
        </div>
      </div>

      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{
          flex: 1, position: "relative",
          background: hov ? `linear-gradient(135deg,${p.color}10,rgba(7,8,15,.97))` : C.bgCard,
          border: `1px solid ${hov ? p.color + "42" : "rgba(255,255,255,.07)"}`,
          borderRadius: isLeft ? "6px 22px 22px 22px" : "22px 6px 22px 22px",
          padding: "26px 32px",
          transition: "all .35s cubic-bezier(.16,1,.3,1)",
          boxShadow: hov ? `0 18px 48px rgba(0,0,0,.35),0 0 0 1px ${p.color}20` : "none",
        }}>
        <div style={{ position: "absolute", top: 12, [isLeft ? "left" : "right"]: 22,
          fontFamily: "Georgia,serif", fontSize: 62, lineHeight: 1,
          color: p.color, opacity: .1, fontWeight: 900, userSelect: "none" }}>"</div>
        <div style={{
          position: "absolute", top: 24, [isLeft ? "left" : "right"]: -9,
          width: 0, height: 0,
          borderTop: "9px solid transparent", borderBottom: "9px solid transparent",
          [isLeft ? "borderRight" : "borderLeft"]: `9px solid ${hov ? p.color + "25" : "rgba(255,255,255,.05)"}`,
          transition: "all .35s",
        }}/>
        <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: 17, lineHeight: 2, color: "rgba(255,255,255,.65)",
          fontStyle: "italic", position: "relative", zIndex: 1 }}>{p.msg}</p>
        <div style={{ height: 2, borderRadius: 1, marginTop: 20,
          background: `linear-gradient(${isLeft ? "90deg" : "270deg"},${p.color}70,transparent)`,
          width: hov ? "55%" : "25%", transition: "width .5s ease" }}/>
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
      <span style={{ fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
        fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600,
        background: C.gradFull, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{text}</span>
    </div>
  );
}

function SIGHTReveal({ children, delay = 0 }) {
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
      transition: `opacity .7s ${delay}s cubic-bezier(.16,1,.3,1),transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>{children}</div>
  );
}

function FbIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>; }
function IgIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>; }
function LiIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>; }

/* ════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════ */
function PageSIGHT({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: "white",
      overflowX: "hidden", fontFamily: "'Cinzel',Georgia,serif", position: "relative" }}>
      <style>{SIGHT_CSS}</style>
      <SIGHTBackground/>
      <SIGHTHero onBack={onBack}/>
      <SIGHTAbout/>
      <SDGSection/>
      <IdeaSubmission/>
      <ActivityGallery/>
      <SIGHTTeam/>
      <SIGHTMessages/>
      <div style={{ padding: "26px 6%", borderTop: "1px solid rgba(249,115,22,.09)",
        display: "flex", justifyContent: "center", position: "relative", zIndex: 1 }}>
        <div style={{ color: "rgba(255,255,255,.15)", fontSize: 10, letterSpacing: 5,
          fontFamily: "'Cinzel',Georgia,serif" }}>
          IEEE ENIT SIGHT GROUP · TECHNOLOGY FOR A BETTER WORLD
        </div>
      </div>
    </div>
  );
}

export default PageSIGHT;
