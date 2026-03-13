import { useState, useEffect, useRef } from "react";

/* ── GLOBAL STYLES ── */
const WIE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  @keyframes wie-float {
    0%,100% { transform: translateY(0px) rotate(0deg); }
    33%      { transform: translateY(-18px) rotate(1.5deg); }
    66%      { transform: translateY(-8px) rotate(-1deg); }
  }
  @keyframes wie-orbit {
    from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); }
    to   { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); }
  }
  @keyframes wie-pulse-ring {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(2.4); opacity: 0; }
  }
  @keyframes wie-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes wie-spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes wie-card-in {
    from { opacity: 0; transform: translateY(28px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes wie-glow-breath {
    0%,100% { box-shadow: 0 0 30px rgba(200,80,255,.2), 0 0 60px rgba(255,100,200,.08); }
    50%     { box-shadow: 0 0 60px rgba(200,80,255,.45), 0 0 120px rgba(255,100,200,.18); }
  }
  @keyframes wie-particle {
    0%   { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
    100% { transform: translateY(-120px) translateX(var(--dx)) scale(0); opacity: 0; }
  }
  @keyframes wie-scroll-x {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes wie-badge-pop {
    0%,100% { transform: scale(1); }
    50%     { transform: scale(1.06); }
  }
  @keyframes wie-line-grow {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes wie-fade-up {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .wie-card-anim { animation: wie-card-in 0.55s cubic-bezier(.16,1,.3,1) both; }
  .wie-card-anim:nth-child(1) { animation-delay: 0.05s; }
  .wie-card-anim:nth-child(2) { animation-delay: 0.12s; }
  .wie-card-anim:nth-child(3) { animation-delay: 0.19s; }
  .wie-card-anim:nth-child(4) { animation-delay: 0.26s; }
  .wie-card-anim:nth-child(5) { animation-delay: 0.33s; }

  .wie-shimmer-text {
    background: linear-gradient(90deg, #ff6ec7, #c850ff, #ffffff, #ff6ec7, #c850ff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: wie-shimmer 4s linear infinite;
  }

  @media (max-width: 768px) {
    .wie-hero-grid { grid-template-columns: 1fr !important; }
    .wie-team-grid { grid-template-columns: repeat(2,1fr) !important; }
    .wie-two-col   { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 480px) {
    .wie-team-grid { grid-template-columns: 1fr !important; }
  }
`;

/* ── COLOUR PALETTE ── */
const C = {
  bg:       "#0c0614",
  bgMid:    "#120820",
  bgCard:   "rgba(255,255,255,.028)",
  pink:     "#ff6ec7",
  purple:   "#c850ff",
  lavender: "#b388ff",
  rose:     "#ff4fa3",
  white:    "#ffffff",
  muted:    "rgba(255,255,255,.45)",
  border:   "rgba(255,100,200,.15)",
  grad:     "linear-gradient(135deg, #ff6ec7, #c850ff)",
  gradSoft: "linear-gradient(135deg, rgba(255,110,199,.18), rgba(200,80,255,.10))",
};

/* ════════════════════════════════════════════════════════
   ANIMATED BACKGROUND — Women in Engineering vibe
════════════════════════════════════════════════════════ */
function WIEBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Deep gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 20% 30%, rgba(200,80,255,.14) 0%, transparent 55%),
                     radial-gradient(ellipse at 80% 70%, rgba(255,110,199,.12) 0%, transparent 50%),
                     radial-gradient(ellipse at 50% 50%, rgba(18,8,32,.9) 0%, #0c0614 100%)`,
      }}/>

      {/* Floating geometric shapes — circuit/engineering motif */}
      {[
        { size: 180, x: "8%",  y: "12%", dur: "22s", delay: "0s",  opacity: 0.07 },
        { size: 120, x: "85%", y: "20%", dur: "28s", delay: "4s",  opacity: 0.05 },
        { size: 240, x: "70%", y: "60%", dur: "35s", delay: "8s",  opacity: 0.06 },
        { size: 90,  x: "15%", y: "75%", dur: "18s", delay: "2s",  opacity: 0.08 },
        { size: 160, x: "50%", y: "85%", dur: "30s", delay: "6s",  opacity: 0.04 },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: s.x, top: s.y,
          width: s.size, height: s.size,
          border: `1px solid rgba(200,80,255,${s.opacity * 2})`,
          borderRadius: i % 2 === 0 ? "50%" : "30%",
          animation: `wie-spin-slow ${s.dur} linear ${s.delay} infinite`,
          opacity: s.opacity * 6,
        }}/>
      ))}

      {/* Orbiting dots */}
      {[60, 110, 160].map((r, i) => (
        <div key={i} style={{
          position: "absolute",
          left: "50%", top: "30%",
          width: 0, height: 0,
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: i === 0 ? C.pink : i === 1 ? C.purple : C.lavender,
            boxShadow: `0 0 12px ${i === 0 ? C.pink : i === 1 ? C.purple : C.lavender}`,
            ["--r"]: `${r}px`,
            animation: `wie-orbit ${18 + i * 8}s linear ${i * 3}s infinite`,
            opacity: 0.35,
          }}/>
        </div>
      ))}

      {/* Rising particles */}
      {Array.from({ length: 18 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * 30}%`,
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          borderRadius: "50%",
          background: i % 3 === 0 ? C.pink : i % 3 === 1 ? C.purple : C.lavender,
          ["--dx"]: `${(Math.random() - 0.5) * 80}px`,
          animation: `wie-particle ${Math.random() * 6 + 4}s ease-out ${Math.random() * 8}s infinite`,
          opacity: 0.6,
        }}/>
      ))}

      {/* Grid mesh */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(rgba(200,80,255,.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(200,80,255,.03) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}/>

      {/* Diagonal accent line */}
      <div style={{
        position: "absolute", top: 0, right: "25%",
        width: 1, height: "100%",
        background: "linear-gradient(to bottom, transparent, rgba(200,80,255,.12) 30%, rgba(255,110,199,.08) 70%, transparent)",
      }}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   HERO SECTION
════════════════════════════════════════════════════════ */
function WIEHero({ onBack }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  return (
    <section style={{ minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "120px 6% 80px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", width: "100%" }}>

        {/* Back button */}
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: "rgba(255,110,199,.08)", border: "1px solid rgba(255,110,199,.25)",
          borderRadius: 30, padding: "10px 22px", cursor: "pointer",
          color: C.pink, fontSize: 11, fontWeight: 600, letterSpacing: 2,
          fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase",
          marginBottom: 52, transition: "all .3s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,110,199,.16)"; e.currentTarget.style.transform = "translateX(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,110,199,.08)"; e.currentTarget.style.transform = "translateX(0)"; }}>
          ← Back to Sub-Units
        </button>

        <div className="wie-hero-grid" style={{
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr",
          gap: 80, alignItems: "center",
          opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}>
          {/* Left — text */}
          <div>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "7px 20px", borderRadius: 30, marginBottom: 28,
              background: "rgba(200,80,255,.1)", border: "1px solid rgba(200,80,255,.3)",
              animation: "wie-badge-pop 3s ease-in-out infinite",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%",
                background: C.grad, boxShadow: `0 0 10px ${C.pink}` }}/>
              <span style={{ color: C.lavender, fontSize: 10, letterSpacing: 4,
                fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600 }}>
                IEEE ENIT SB · AFFINITY GROUP
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cinzel Decorative',Georgia,serif",
              fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 900,
              lineHeight: 1.1, marginBottom: 12, color: "white",
            }}>
              Women in<br/>
              <span className="wie-shimmer-text">Engineering</span>
            </h1>

            <p style={{
              fontFamily: "'Cinzel',Georgia,serif", fontSize: "clamp(11px,1.5vw,14px)",
              letterSpacing: 5, color: C.muted, marginBottom: 30,
              textTransform: "uppercase",
            }}>IEEE WIE ENIT Student Affinity Group</p>

            <div style={{ width: 60, height: 2, background: C.grad, borderRadius: 1, marginBottom: 30,
              animation: "wie-line-grow 1.2s .4s cubic-bezier(.16,1,.3,1) both" }}/>

            <p style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: "clamp(16px,1.8vw,19px)", lineHeight: 2,
              color: "rgba(255,255,255,.6)", maxWidth: 520, marginBottom: 40,
            }}>
              Empowering women in STEM through mentorship, leadership and
              community. We build bridges between ambition and achievement —
              fostering diversity, inclusion and excellence at ENIT and beyond.
            </p>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 44 }}>
              {[["Founded","2005"],["Members","60+"],["Events","20+/yr"],["Awards","8+"]].map(([l, v]) => (
                <div key={l} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Cinzel Decorative',Georgia,serif",
                    fontSize: "clamp(1.4rem,2.5vw,2rem)", fontWeight: 900,
                    background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
                  <div style={{ color: "rgba(255,255,255,.28)", fontSize: 9, letterSpacing: 3,
                    textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,.25)", fontSize: 10, letterSpacing: 3,
                fontFamily: "'Cinzel',Georgia,serif", textTransform: "uppercase" }}>Follow us</span>
              {[
                { label: "Facebook",  href: "#", icon: <FbIcon/>, color: "#1877f2" },
                { label: "Instagram", href: "#", icon: <IgIcon/>, color: "#e1306c" },
                { label: "LinkedIn",  href: "#", icon: <LiIcon/>, color: "#0a66c2" },
              ].map(({ label, href, icon, color }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  aria-label={label}
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "rgba(255,255,255,.05)",
                    border: "1px solid rgba(255,110,199,.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,.45)", textDecoration: "none",
                    transition: "all .28s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${color}22`;
                    e.currentTarget.style.borderColor = color;
                    e.currentTarget.style.color = color;
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,.05)";
                    e.currentTarget.style.borderColor = "rgba(255,110,199,.2)";
                    e.currentTarget.style.color = "rgba(255,255,255,.45)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — animated WIE emblem */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <WIEEmblem />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════
   ANIMATED WIE EMBLEM
════════════════════════════════════════════════════════ */
function WIEEmblem() {
  return (
    <div style={{ position: "relative", width: 340, height: 340, animation: "wie-float 8s ease-in-out infinite" }}>
      {/* Pulse rings */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: `1px solid rgba(200,80,255,.3)`,
          animation: `wie-pulse-ring 3s ease-out ${i * 0.8}s infinite`,
        }}/>
      ))}

      {/* Main circle */}
      <div style={{
        position: "absolute", inset: 20,
        borderRadius: "50%",
        background: "linear-gradient(145deg, rgba(200,80,255,.15), rgba(255,110,199,.08))",
        border: "1.5px solid rgba(200,80,255,.35)",
        animation: "wie-glow-breath 4s ease-in-out infinite",
        display: "flex", alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(12px)",
      }}>
        {/* WIE Logo image */}
        <img src="/logos/Wie-White.png" alt="WIE"
          style={{ width: "65%", height: "65%", objectFit: "contain",
            filter: "drop-shadow(0 0 18px rgba(255,110,199,.6))" }}/>
      </div>

      {/* Orbiting icons — representing women in engineering fields */}
      {[
        { icon: "⚡", angle: 0,   color: C.pink,     label: "Energy" },
        { icon: "💻", angle: 72,  color: C.purple,   label: "Software" },
        { icon: "🔬", angle: 144, color: C.lavender, label: "Research" },
        { icon: "🤖", angle: 216, color: C.pink,     label: "Robotics" },
        { icon: "📡", angle: 288, color: C.purple,   label: "Telecom" },
      ].map(({ icon, angle, color, label }, i) => {
        const rad = (angle * Math.PI) / 180;
        const r = 145;
        const x = 170 + r * Math.cos(rad) - 22;
        const y = 170 + r * Math.sin(rad) - 22;
        return (
          <div key={i} title={label} style={{
            position: "absolute", left: x, top: y,
            width: 44, height: 44, borderRadius: 12,
            background: `linear-gradient(135deg, ${color}22, ${color}0a)`,
            border: `1px solid ${color}45`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: `0 4px 16px ${color}25`,
            animation: `wie-float ${6 + i}s ease-in-out ${i * 0.4}s infinite`,
          }}>{icon}</div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ABOUT / DESCRIPTION SECTION
════════════════════════════════════════════════════════ */
function WIEAbout() {
  return (
    <section style={{ padding: "80px 6%", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <SectionLabel text="Our Mission"/>
        <div className="wie-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <WieReveal>
            <h2 style={{
              fontFamily: "'Cinzel',Georgia,serif",
              fontSize: "clamp(1.6rem,3vw,2.6rem)", fontWeight: 700,
              color: "white", lineHeight: 1.3, marginBottom: 28,
            }}>
              Advancing Women<br/>
              <span style={{ background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                in STEM & Beyond
              </span>
            </h2>
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 17, lineHeight: 2.1, color: "rgba(255,255,255,.58)", marginBottom: 20 }}>
              The <strong style={{ color: "white" }}>IEEE WIE ENIT Student Affinity Group</strong> is dedicated to
              inspiring, engaging, and encouraging women to enter, stay, and advance in engineering careers.
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 17, lineHeight: 2.1, color: "rgba(255,255,255,.45)" }}>
              Through workshops, competitions, mentorship programmes and awareness campaigns, we build a
              vibrant community where women engineers connect, collaborate and lead. From local initiatives
              to international IEEE recognition, WIE ENIT has consistently stood as a beacon of empowerment
              and technical excellence.
            </p>
          </WieReveal>

          <WieReveal delay={0.1}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { icon: "", title: "Mentorship",    desc: "Connecting students with experienced professionals" },
                { icon: "", title: "Competitions",  desc: "Hackathons, case studies & technical challenges" },
                { icon: "", title: "Community",     desc: "A sisterhood of engineers at ENIT & beyond" },
                { icon: "", title: "Outreach",       desc: "SDG-aligned awareness & humanitarian tech projects" },
              ].map(({ icon, title, desc }) => (
                <PillarCard key={title} icon={icon} title={title} desc={desc}/>
              ))}
            </div>
          </WieReveal>
        </div>
      </div>
    </section>
  );
}

function PillarCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: "24px 20px", borderRadius: 16,
        background: hov ? C.gradSoft : C.bgCard,
        border: `1px solid ${hov ? "rgba(200,80,255,.35)" : C.border}`,
        transition: "all .35s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        cursor: "default",
      }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontFamily: "'Cinzel',Georgia,serif", color: "white",
        fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif",
        color: "rgba(255,255,255,.42)", fontSize: 14, lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   AUTO-SCROLLING ACTIVITY GALLERY
════════════════════════════════════════════════════════ */
const ACTIVITY_PHOTOS = [
  { src: "/wie/activity1.jpg", caption: "Pink October 2024" },
  { src: "/wie/activity2.jpg", caption: "WIE Workshop" },
  { src: "/wie/activity3.jpg", caption: "IEEE Day 2024" },
  { src: "/wie/activity4.jpg", caption: "Leadership Summit" },
  { src: "/wie/activity5.jpg", caption: "Hackathon WIE" },
  { src: "/wie/activity6.jpg", caption: "Awareness Campaign" },
  { src: "/wie/activity7.jpg", caption: "Community Event" },
  { src: "/wie/activity8.jpg", caption: "STEM Day" },
];

function ActivityGallery() {
  const [paused, setPaused] = useState(false);
  // Duplicate for seamless infinite scroll
  const items = [...ACTIVITY_PHOTOS, ...ACTIVITY_PHOTOS];

  return (
    <section style={{ padding: "80px 0", position: "relative", zIndex: 1, overflow: "hidden" }}>
      {/* Edge fades */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
        background: `linear-gradient(to right, ${C.bg}, transparent)`, pointerEvents: "none" }}/>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
        background: `linear-gradient(to left, ${C.bg}, transparent)`, pointerEvents: "none" }}/>

      <div style={{ padding: "0 6%", maxWidth: 1300, margin: "0 auto 32px" }}>
        <SectionLabel text="Our Activities"/>
        <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
          fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, color: "white" }}>
          Moments That Matter
        </h2>
      </div>

      {/* Scrolling strip */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ overflow: "hidden", cursor: "grab" }}>
        <div style={{
          display: "flex", gap: 20,
          animation: `wie-scroll-x 28s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          width: "max-content",
        }}>
          {items.map((photo, i) => (
            <GalleryCard key={i} photo={photo}/>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 20,
        color: "rgba(255,255,255,.2)", fontSize: 10, letterSpacing: 4,
        fontFamily: "'Cinzel',Georgia,serif" }}>
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
        width: 280, height: 200, borderRadius: 16, flexShrink: 0,
        overflow: "hidden", position: "relative",
        border: `1px solid ${hov ? "rgba(200,80,255,.5)" : "rgba(200,80,255,.15)"}`,
        transition: "border-color .3s, transform .3s",
        transform: hov ? "scale(1.04)" : "scale(1)",
        boxShadow: hov ? "0 12px 40px rgba(200,80,255,.25)" : "none",
      }}>
      {/* Photo — shows placeholder gradient if image missing */}
      <div style={{
        width: "100%", height: "100%",
        background: `linear-gradient(135deg,
          rgba(200,80,255,.25) 0%,
          rgba(255,110,199,.15) 50%,
          rgba(18,8,32,.9) 100%)`,
      }}>
        <img src={photo.src} alt={photo.caption}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={e => { e.target.style.display = "none"; }}/>
      </div>

      {/* Overlay on hover */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(12,6,20,.85) 0%, transparent 50%)",
        opacity: hov ? 1 : 0, transition: "opacity .3s",
      }}/>
      <div style={{
        position: "absolute", bottom: 14, left: 16,
        fontFamily: "'Cinzel',Georgia,serif", fontSize: 12,
        color: "white", fontWeight: 600, letterSpacing: 1,
        opacity: hov ? 1 : 0, transition: "opacity .3s",
      }}>{photo.caption}</div>

      {/* Corner gem */}
      <div style={{
        position: "absolute", top: 12, right: 12,
        width: 8, height: 8, borderRadius: "50%",
        background: C.grad, opacity: hov ? 1 : 0.4,
        boxShadow: "0 0 10px rgba(255,110,199,.6)",
        transition: "opacity .3s",
      }}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   EXECUTIVE COMMITTEE 2026
════════════════════════════════════════════════════════ */
const WIE_TEAM = [
  { name: "Ranim Gannouni",  role: "Chair",        photo: "/photos/ranime.png" },
  { name: "Youssef Ben Hadj",role: "Vice Chair",   photo: "/photos/youssef.png" },
  { name: "Islem Ltaief",    role: "Secretary",    photo: "/photos/islem.png" },
  { name: "Ons Troudi",      role: "Treasurer",    photo: "/photos/ons.png" },
  { name: "Fatima",          role: "Webmaster",    photo: "/photos/fatima.png" },
];

const ROLE_COLORS = {
  "Chair":     { main: "#ff6ec7", glow: "rgba(255,215,0,.4)"  },
  "Vice Chair":{ main: "#FFD700", glow: "rgba(255,110,199,.4)" },
  "Secretary": { main: "#c850ff", glow: "rgba(200,80,255,.35)" },
  "Treasurer": { main: "#b388ff", glow: "rgba(179,136,255,.35)"},
  "Webmaster": { main: "#ff4fa3", glow: "rgba(255,79,163,.35)" },
};

function WIETeam() {
  return (
    <section style={{ padding: "80px 6% 100px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <WieReveal>
          <SectionLabel text="Our Team"/>
          <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
            fontSize: "clamp(1.6rem,3vw,2.6rem)", fontWeight: 700,
            color: "white", marginBottom: 56 }}>
            Executive Committee 2026
          </h2>
        </WieReveal>

        {/* Row 1: Chair centered */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: "clamp(220px,24%,280px)" }}>
            <WIEMemberCard m={WIE_TEAM[0]}/>
          </div>
        </div>

        {/* Row 2: 4 members */}
        <div className="wie-team-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {WIE_TEAM.slice(1).map((m, i) => (
            <WIEMemberCard key={i} m={m}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function WIEMemberCard({ m }) {
  const [hov, setHov] = useState(false);
  const rc = ROLE_COLORS[m.role] || { main: C.pink, glow: "rgba(255,110,199,.35)" };
  const init = m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="wie-card-anim"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: 20, overflow: "hidden",
        border: `1px solid ${hov ? rc.main + "55" : "rgba(255,255,255,.07)"}`,
        background: hov
          ? `linear-gradient(170deg, ${rc.main}14, rgba(12,6,20,.98))`
          : C.bgCard,
        transition: "all .4s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: hov ? `0 24px 56px rgba(0,0,0,.5), 0 0 0 1px ${rc.main}22` : "none",
        display: "flex", flexDirection: "column",
      }}>

      {/* Photo area */}
      <div style={{
        height: 190, position: "relative", overflow: "hidden", flexShrink: 0,
        background: `linear-gradient(160deg, ${rc.main}22, rgba(12,6,20,.95))`,
      }}>
        {m.photo ? (
          <img src={m.photo} alt={m.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}/>
        ) : (
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* Avatar placeholder with initials */}
            <div style={{
              width: 90, height: 90, borderRadius: "50%",
              background: `linear-gradient(135deg, ${rc.main}55, rgba(12,6,20,.7))`,
              border: `2px solid ${rc.main}60`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, fontWeight: 700, color: "white",
              fontFamily: "'Cinzel Decorative',Georgia,serif",
              boxShadow: hov ? `0 0 32px ${rc.glow}` : "none",
              transition: "all .4s",
            }}>{init}</div>
          </div>
        )}

        {/* Role badge */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          padding: "5px 13px", borderRadius: 20,
          background: `${rc.main}1a`, border: `1px solid ${rc.main}40`,
          color: rc.main, fontSize: 9, fontWeight: 700, letterSpacing: 2,
          textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif",
          backdropFilter: "blur(8px)",
        }}>{m.role}</div>

        {/* Shimmer on hover */}
        {hov && <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)",
          animation: "wie-shimmer .9s ease forwards",
        }}/>}
      </div>

      {/* Dashed tear line */}
      <div style={{ position: "relative", margin: "0 14px" }}>
        <div style={{ borderTop: `1px dashed ${rc.main}22` }}/>
        {[-1, 1].map(s => (
          <div key={s} style={{
            position: "absolute", top: -8, [s < 0 ? "left" : "right"]: -18,
            width: 16, height: 16, borderRadius: "50%",
            background: C.bg, border: "1px solid rgba(255,255,255,.07)",
          }}/>
        ))}
      </div>

      {/* Info */}
      <div style={{ padding: "16px 18px 20px", flex: 1 }}>
        <div style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 5,
          fontFamily: "'Cinzel',Georgia,serif", lineHeight: 1.3 }}>{m.name}</div>
        <div style={{ color: rc.main, fontSize: 10, letterSpacing: 2,
          textTransform: "uppercase", fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600 }}>
          {m.role} · IEEE WIE ENIT
        </div>

        {/* Glow bar */}
        <div style={{
          height: 2, borderRadius: 1, marginTop: 14,
          background: `linear-gradient(90deg, ${rc.main}70, transparent)`,
          width: hov ? "70%" : "30%", transition: "width .5s ease",
        }}/>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MESSAGES FROM FORMERS
════════════════════════════════════════════════════════ */
const WIE_MESSAGES = [
  {
    name: "Farah Attia",
    role: "WIE Chair 2025",
    side: "left",
    color: "#FFD700",
    msg: "Leading WIE ENIT was one of the most transformative experiences of my life. Seeing women engineers rise with confidence, claim their space, and inspire each other — that is what this group is truly about. The bonds we built, the projects we ran, and the impact we made will echo for years to come. Keep the flame alive.",
  },
  {
    name: "Eya Boukeri",
    role: "WIE Secretary & Treasurer 2025",
    side: "right",
    color: "#c850ff",
    msg: "WIE ENIT gave me more than skills, it gave me a sense of belonging. In a world where women in engineering can sometimes feel alone, this group was our safe space, our launchpad, and our family. I am proud of every event we organised, every girl we encouraged, and every barrier we collectively broke.",
  },
];

function WIEMessages() {
  return (
    <section style={{ padding: "40px 6% 100px", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <WieReveal>
          <SectionLabel text="Legacy & Inspiration"/>
          <h2 style={{ fontFamily: "'Cinzel',Georgia,serif",
            fontSize: "clamp(1.6rem,3vw,2.6rem)", fontWeight: 700,
            color: "white", marginBottom: 52 }}>
            Words From Our Formers
          </h2>
        </WieReveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
          {WIE_MESSAGES.map((p, i) => (
            <WieReveal key={i} delay={i * 0.1}>
              <WIEBubble p={p}/>
            </WieReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WIEBubble({ p }) {
  const [hov, setHov] = useState(false);
  const isLeft = p.side === "left";
  const init = p.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ display: "flex", flexDirection: isLeft ? "row" : "row-reverse",
      alignItems: "flex-start", gap: 28 }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 78, height: 78, borderRadius: "50%",
          background: `linear-gradient(135deg, ${p.color}55, rgba(12,6,20,.7))`,
          border: `2px solid ${p.color}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: "white",
          fontFamily: "'Cinzel Decorative',Georgia,serif",
          boxShadow: `0 0 24px ${p.color}30`,
        }}>{init}</div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "white", fontSize: 13, fontWeight: 700,
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
          background: hov ? `linear-gradient(135deg,${p.color}12, rgba(12,6,20,.97))` : C.bgCard,
          border: `1px solid ${hov ? p.color + "45" : "rgba(255,255,255,.08)"}`,
          borderRadius: isLeft ? "6px 22px 22px 22px" : "22px 6px 22px 22px",
          padding: "26px 32px",
          transition: "all .35s cubic-bezier(.16,1,.3,1)",
          boxShadow: hov ? `0 18px 48px rgba(0,0,0,.35), 0 0 0 1px ${p.color}22` : "none",
        }}>
        {/* Quote mark */}
        <div style={{
          position: "absolute", top: 12, [isLeft ? "left" : "right"]: 22,
          fontFamily: "Georgia,serif", fontSize: 64, lineHeight: 1,
          color: p.color, opacity: .12, fontWeight: 900, userSelect: "none",
        }}>"</div>

        {/* Tail */}
        <div style={{
          position: "absolute", top: 26, [isLeft ? "left" : "right"]: -9,
          width: 0, height: 0,
          borderTop: "9px solid transparent",
          borderBottom: "9px solid transparent",
          [isLeft ? "borderRight" : "borderLeft"]: `9px solid ${hov ? p.color + "28" : "rgba(255,255,255,.05)"}`,
          transition: "all .35s",
        }}/>

        <p style={{
          fontFamily: "'Cormorant Garamond',Georgia,serif",
          fontSize: 17, lineHeight: 2, color: "rgba(255,255,255,.68)",
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

/* ════════════════════════════════════════════════════════
   SHARED HELPERS
════════════════════════════════════════════════════════ */
function SectionLabel({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
      <div style={{ width: 36, height: 1, background: C.grad }}/>
      <span style={{
        fontSize: 11, letterSpacing: 4, textTransform: "uppercase",
        fontFamily: "'Cinzel',Georgia,serif", fontWeight: 600,
        background: C.grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{text}</span>
    </div>
  );
}

function WieReveal({ children, delay = 0 }) {
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
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity .7s ${delay}s cubic-bezier(.16,1,.3,1), transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>{children}</div>
  );
}

/* ── Social icons ── */
function FbIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>;
}
function IgIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
  </svg>;
}
function LiIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>;
}

/* ════════════════════════════════════════════════════════
   MAIN EXPORT — WIE PAGE
════════════════════════════════════════════════════════ */
function PageWIE({ onBack }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      color: "white",
      overflowX: "hidden",
      fontFamily: "'Cinzel',Georgia,serif",
      position: "relative",
    }}>
      <style>{WIE_CSS}</style>
      <WIEBackground/>

      <WIEHero onBack={onBack}/>
      <WIEAbout/>
      <ActivityGallery/>
      <WIETeam/>
      <WIEMessages/>

      {/* Footer bar */}
      <div style={{
        padding: "28px 6%", borderTop: "1px solid rgba(200,80,255,.1)",
        display: "flex", justifyContent: "center", alignItems: "center",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          color: "rgba(255,255,255,.18)", fontSize: 10, letterSpacing: 5,
          fontFamily: "'Cinzel',Georgia,serif",
        }}>
          IEEE WIE ENIT SAG · TOGETHER WE RISE
        </div>
      </div>
    </div>
  );
}

export default PageWIE;
