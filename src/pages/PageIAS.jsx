import { useState, useEffect, useRef } from "react";

/* ── COLOUR PALETTE ── */
const C = {
  bg:       "#060a0f",
  bgMid:    "#0a1018",
  bgCard:   "rgba(255,255,255,.028)",
  orange:   "#ff7c20",
  green:    "#00c48c",
  blue:     "#0098d4",
  amber:    "#ffb347",
  teal:     "#00d4aa",
  sky:      "#38c4f0",
  muted:    "rgba(255,255,255,.42)",
  border:   "rgba(255,124,32,.13)",
  grad:     "linear-gradient(135deg, #ff7c20, #00c48c)",
  gradFull: "linear-gradient(135deg, #ff7c20 0%, #0098d4 50%, #00c48c 100%)",
  gradSoft: "linear-gradient(135deg, rgba(255,124,32,.14), rgba(0,152,212,.10), rgba(0,196,140,.08))",
};

/* ── GLOBAL CSS ── */
const IAS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  @keyframes ias-float   { 0%,100%{transform:translateY(0) rotate(0deg)} 40%{transform:translateY(-14px) rotate(.8deg)} 70%{transform:translateY(-6px) rotate(-.6deg)} }
  @keyframes ias-spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ias-spin-r  { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes ias-pulse   { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
  @keyframes ias-ring    { 0%{transform:scale(1);opacity:.55} 100%{transform:scale(2.6);opacity:0} }
  @keyframes ias-glow    { 0%,100%{box-shadow:0 0 28px rgba(255,124,32,.18),0 0 60px rgba(0,152,212,.08)} 50%{box-shadow:0 0 60px rgba(255,124,32,.38),0 0 120px rgba(0,196,140,.18)} }
  @keyframes ias-dash    { to{stroke-dashoffset:0} }
  @keyframes ias-scroll  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes ias-card-in { from{opacity:0;transform:translateY(26px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes ias-fade-up { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ias-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes ias-flicker {
    0%,92%,100%{opacity:1}
    94%{opacity:.7}
    96%{opacity:1}
    98%{opacity:.85}
  }
  @keyframes ias-arc {
    0%   { stroke-dashoffset: 400; opacity: .7; }
    50%  { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: .2; }
  }
  @keyframes ias-particle {
    0%  { transform: translateY(0) translateX(0) scale(1); opacity:.8; }
    100%{ transform: translateY(var(--dy)) translateX(var(--dx)) scale(0); opacity:0; }
  }

  .ias-card-anim { animation: ias-card-in .52s cubic-bezier(.16,1,.3,1) both; }
  .ias-card-anim:nth-child(1){animation-delay:.05s}
  .ias-card-anim:nth-child(2){animation-delay:.11s}
  .ias-card-anim:nth-child(3){animation-delay:.17s}
  .ias-card-anim:nth-child(4){animation-delay:.23s}
  .ias-card-anim:nth-child(5){animation-delay:.29s}
  .ias-card-anim:nth-child(6){animation-delay:.35s}

  .ias-grad-text {
    background: linear-gradient(90deg, #ff7c20, #0098d4, #00c48c, #ff7c20);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ias-shimmer 5s linear infinite;
  }

  @media(max-width:900px){
    .ias-hero-grid  { grid-template-columns:1fr!important; }
    .ias-team-row2  { grid-template-columns:repeat(2,1fr)!important; }
    .ias-two-col    { grid-template-columns:1fr!important; }
    .ias-three-col  { grid-template-columns:repeat(2,1fr)!important; }
  }
  @media(max-width:520px){
    .ias-team-row2  { grid-template-columns:1fr!important; }
    .ias-three-col  { grid-template-columns:1fr!important; }
  }
`;

/* ════════════════════════════════════════════════════
   ANIMATED BACKGROUND — industrial / energy / circuit
════════════════════════════════════════════════════ */
function IASBackground() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>

      {/* Base gradient */}
      <div style={{
        position:"absolute", inset:0,
        background:`radial-gradient(ellipse at 15% 25%, rgba(255,124,32,.11) 0%, transparent 50%),
                    radial-gradient(ellipse at 85% 65%, rgba(0,152,212,.10) 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 90%, rgba(0,196,140,.08) 0%, transparent 45%),
                    linear-gradient(180deg, #060a0f 0%, #08121c 100%)`,
      }}/>

      {/* Hexagonal grid — industrial motif */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.04}}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
            <polygon points="30,2 58,17 58,47 30,62 2,47 2,17"
              fill="none" stroke="#ff7c20" strokeWidth=".8"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)"/>
      </svg>

      {/* Large rotating gear — background left */}
      <svg style={{position:"absolute", left:"-6%", top:"20%", opacity:.05,
        animation:"ias-spin 60s linear infinite"}}
        width="380" height="380" viewBox="0 0 100 100">
        <GearPath r1={42} r2={48} teeth={16} cx={50} cy={50} stroke="#ff7c20"/>
      </svg>

      {/* Medium gear — background right */}
      <svg style={{position:"absolute", right:"-4%", bottom:"15%", opacity:.05,
        animation:"ias-spin-r 45s linear infinite"}}
        width="280" height="280" viewBox="0 0 100 100">
        <GearPath r1={40} r2={46} teeth={12} cx={50} cy={50} stroke="#0098d4"/>
      </svg>

      {/* Small gear — top right */}
      <svg style={{position:"absolute", right:"22%", top:"8%", opacity:.06,
        animation:"ias-spin 28s linear infinite"}}
        width="120" height="120" viewBox="0 0 100 100">
        <GearPath r1={38} r2={45} teeth={10} cx={50} cy={50} stroke="#00c48c"/>
      </svg>

      {/* Electric arc lines (SVG animated) */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.12}}
        xmlns="http://www.w3.org/2000/svg">
        {[
          {d:"M 0 30% Q 20% 20%, 40% 35% T 80% 28%", color:"#ff7c20", dur:"4s", delay:"0s"},
          {d:"M 100% 60% Q 70% 50%, 50% 62% T 10% 55%", color:"#0098d4", dur:"5s", delay:"1.5s"},
          {d:"M 30% 100% Q 40% 75%, 60% 80% T 85% 70%", color:"#00c48c", dur:"6s", delay:"3s"},
        ].map((arc,i) => (
          <path key={i} d={arc.d.replace(/%/g,"%")} fill="none"
            stroke={arc.color} strokeWidth="1"
            strokeDasharray="400" strokeDashoffset="400"
            style={{animation:`ias-arc ${arc.dur} ease-in-out ${arc.delay} infinite`}}/>
        ))}
      </svg>

      {/* Floating energy particles */}
      {Array.from({length:20},(_,i) => {
        const colors = [C.orange, C.green, C.blue, C.amber, C.teal];
        return (
          <div key={i} style={{
            position:"absolute",
            left:`${Math.random()*100}%`,
            top:`${Math.random()*100}%`,
            width: Math.random()*4+2,
            height: Math.random()*4+2,
            borderRadius:"50%",
            background: colors[i % 5],
            "--dx": `${(Math.random()-.5)*100}px`,
            "--dy": `${-(Math.random()*140+40)}px`,
            animation:`ias-particle ${Math.random()*7+4}s ease-out ${Math.random()*10}s infinite`,
            opacity:.7,
          }}/>
        );
      })}

      {/* Diagonal accent lines */}
      {[["15%","0","15%","100%","#ff7c20"],["50%","0","50%","100%","#0098d4"],["82%","0","82%","100%","#00c48c"]].map(([x1,y1,x2,y2,col],i)=>(
        <div key={i} style={{
          position:"absolute", left:x1, top:0, width:1, height:"100%",
          background:`linear-gradient(to bottom, transparent, ${col}18 30%, ${col}10 70%, transparent)`,
        }}/>
      ))}
    </div>
  );
}

/* SVG gear path helper */
function GearPath({ r1, r2, teeth, cx, cy, stroke }) {
  const pts = [];
  const step = (2 * Math.PI) / teeth;
  for (let i = 0; i < teeth; i++) {
    const a1 = i * step - step * 0.2;
    const a2 = i * step + step * 0.2;
    const a3 = i * step + step * 0.5;
    const a4 = i * step + step * 0.7;
    pts.push(`${cx + r1*Math.cos(a1)},${cy + r1*Math.sin(a1)}`);
    pts.push(`${cx + r2*Math.cos(a2)},${cy + r2*Math.sin(a2)}`);
    pts.push(`${cx + r2*Math.cos(a3)},${cy + r2*Math.sin(a3)}`);
    pts.push(`${cx + r1*Math.cos(a4)},${cy + r1*Math.sin(a4)}`);
  }
  return (
    <>
      <polygon points={pts.join(" ")} fill="none" stroke={stroke} strokeWidth="1.2"/>
      <circle cx={cx} cy={cy} r={r1*.45} fill="none" stroke={stroke} strokeWidth=".8"/>
      <circle cx={cx} cy={cy} r={4} fill="none" stroke={stroke} strokeWidth="1"/>
    </>
  );
}

/* ════════════════════════════════════════════════════
   ANIMATED EMBLEM — tri-society merger
════════════════════════════════════════════════════ */
function IASEmblem() {
  return (
    <div style={{position:"relative", width:340, height:340,
      animation:"ias-float 9s ease-in-out infinite"}}>

      {/* Pulse rings */}
      {[1,2,3].map(i=>(
        <div key={i} style={{
          position:"absolute", inset:0, borderRadius:"50%",
          border:"1px solid rgba(255,124,32,.25)",
          animation:`ias-ring 3.2s ease-out ${i*.9}s infinite`,
        }}/>
      ))}

      {/* Main circle */}
      <div style={{
        position:"absolute", inset:18, borderRadius:"50%",
        background:"linear-gradient(145deg,rgba(255,124,32,.12),rgba(0,152,212,.10),rgba(0,196,140,.08))",
        border:"1.5px solid rgba(255,124,32,.3)",
        animation:"ias-glow 4.5s ease-in-out infinite",
        display:"flex", alignItems:"center", justifyContent:"center",
        backdropFilter:"blur(14px)",
      }}>
        <img src="/logos/ias ies pes white.png" alt="IAS IES PES"
          style={{width:"68%",height:"68%",objectFit:"contain",
            filter:"drop-shadow(0 0 18px rgba(255,124,32,.55))"}}/>
      </div>

      {/* Three society badges orbiting */}
      {[
        {label:"IAS", angle:270, color:C.orange, sub:"Industry"},
        {label:"PES", angle:30,  color:C.green,  sub:"Energy"},
        {label:"IES", angle:150, color:C.blue,   sub:"Electronics"},
      ].map(({label,angle,color,sub},i)=>{
        const rad = (angle*Math.PI)/180;
        const r = 142;
        const x = 170 + r*Math.cos(rad) - 28;
        const y = 170 + r*Math.sin(rad) - 28;
        return(
          <div key={i} style={{
            position:"absolute", left:x, top:y,
            width:56, height:56, borderRadius:14,
            background:`linear-gradient(135deg,${color}28,${color}0a)`,
            border:`1.5px solid ${color}55`,
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center",
            boxShadow:`0 4px 20px ${color}30`,
            animation:`ias-float ${7+i*1.5}s ease-in-out ${i*0.6}s infinite`,
          }}>
            <div style={{fontFamily:"'Cinzel',Georgia,serif",
              fontSize:11,fontWeight:700,color,letterSpacing:1}}>{label}</div>
            <div style={{fontSize:7,color:`${color}90`,
              fontFamily:"'Cinzel',Georgia,serif",letterSpacing:.5,marginTop:2}}>{sub}</div>
          </div>
        );
      })}

      {/* Rotating outer ring with tick marks */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",
        animation:"ias-spin 30s linear infinite", opacity:.2}}
        viewBox="0 0 340 340">
        <circle cx="170" cy="170" r="165" fill="none"
          stroke="url(#iasRingGrad)" strokeWidth=".8" strokeDasharray="4 8"/>
        <defs>
          <linearGradient id="iasRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#ff7c20"/>
            <stop offset="50%"  stopColor="#0098d4"/>
            <stop offset="100%" stopColor="#00c48c"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════ */
function IASHero({ onBack }) {
  const [vis, setVis] = useState(false);
  useEffect(()=>{ setTimeout(()=>setVis(true),80); },[]);

  return(
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",
      padding:"120px 6% 80px",position:"relative",zIndex:1}}>
      <div style={{maxWidth:1300,margin:"0 auto",width:"100%"}}>

        {/* Back */}
        <button onClick={onBack} style={{
          display:"inline-flex",alignItems:"center",gap:10,
          background:"rgba(255,124,32,.07)",border:"1px solid rgba(255,124,32,.22)",
          borderRadius:30,padding:"10px 22px",cursor:"pointer",
          color:C.orange,fontSize:11,fontWeight:600,letterSpacing:2,
          fontFamily:"'Cinzel',Georgia,serif",textTransform:"uppercase",
          marginBottom:52,transition:"all .3s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,124,32,.14)";e.currentTarget.style.transform="translateX(-4px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,124,32,.07)";e.currentTarget.style.transform="translateX(0)";}}>
          ← Back to Sub-Units
        </button>

        <div className="ias-hero-grid" style={{
          display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:72,alignItems:"center",
          opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(30px)",
          transition:"all 1s cubic-bezier(.16,1,.3,1)",
        }}>
          {/* Left */}
          <div>
            {/* Badge */}
            <div style={{
              display:"inline-flex",alignItems:"center",gap:10,
              padding:"7px 20px",borderRadius:30,marginBottom:26,
              background:"rgba(255,124,32,.09)",border:"1px solid rgba(255,124,32,.28)",
              animation:"ias-pulse 3.2s ease-in-out infinite",
            }}>
              <div style={{width:8,height:8,borderRadius:"50%",
                background:C.gradFull,boxShadow:`0 0 10px ${C.orange}`}}/>
              <span style={{color:C.amber,fontSize:10,letterSpacing:4,
                fontFamily:"'Cinzel',Georgia,serif",fontWeight:600}}>
                IEEE ENIT SB · JOINT CHAPTER
              </span>
            </div>

            <h1 style={{
              fontFamily:"'Cinzel Decorative',Georgia,serif",
              fontSize:"clamp(1.6rem,4.2vw,3.4rem)",fontWeight:900,
              lineHeight:1.12,marginBottom:10,color:"white",
            }}>
              IAS · IES · PES<br/>
              <span className="ias-grad-text">Joint Chapter</span>
            </h1>

            <p style={{
              fontFamily:"'Cinzel',Georgia,serif",
              fontSize:"clamp(10px,1.3vw,13px)",letterSpacing:5,
              color:C.muted,marginBottom:28,textTransform:"uppercase",
            }}>
              Industry · Electronics · Power & Energy
            </p>

            {/* Three-society divider */}
            <div style={{display:"flex",gap:0,marginBottom:28,height:3,borderRadius:3,overflow:"hidden",width:80}}>
              <div style={{flex:1,background:C.orange}}/>
              <div style={{flex:1,background:C.blue}}/>
              <div style={{flex:1,background:C.green}}/>
            </div>

            <p style={{
              fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(15px,1.7vw,18px)",lineHeight:2.1,
              color:"rgba(255,255,255,.58)",maxWidth:540,marginBottom:38,
            }}>
              Uniting students at ENIT to explore cutting-edge advancements in industrial applications,
              power systems, energy solutions, and electronic systems — bridging the gap between
              academic knowledge and real-world engineering challenges.
            </p>

            {/* Stats */}
            <div style={{display:"flex",gap:28,flexWrap:"wrap",marginBottom:44}}>
              {[["100+","Members"],["40+","Annual Activities"],["2023","Foundation Year"],["3","Societies"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{
                    fontFamily:"'Cinzel Decorative',Georgia,serif",
                    fontSize:"clamp(1.3rem,2.2vw,1.9rem)",fontWeight:900,
                    background:C.gradFull,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                  }}>{v}</div>
                  <div style={{color:"rgba(255,255,255,.28)",fontSize:9,letterSpacing:3,
                    textTransform:"uppercase",fontFamily:"'Cinzel',Georgia,serif",marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{color:"rgba(255,255,255,.22)",fontSize:10,letterSpacing:3,
                fontFamily:"'Cinzel',Georgia,serif",textTransform:"uppercase"}}>Follow us</span>
              {[
                {label:"Facebook", href:"#", icon:<FbIcon/>, color:"#1877f2"},
                {label:"Instagram",href:"#", icon:<IgIcon/>, color:"#e1306c"},
                {label:"LinkedIn", href:"#", icon:<LiIcon/>, color:"#0a66c2"},
              ].map(({label,href,icon,color})=>(
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{
                    width:40,height:40,borderRadius:12,
                    background:"rgba(255,255,255,.04)",
                    border:"1px solid rgba(255,124,32,.18)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:"rgba(255,255,255,.4)",textDecoration:"none",transition:"all .28s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${color}20`;e.currentTarget.style.borderColor=color;e.currentTarget.style.color=color;e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.borderColor="rgba(255,124,32,.18)";e.currentTarget.style.color="rgba(255,255,255,.4)";e.currentTarget.style.transform="translateY(0)";}}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — emblem */}
          <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <IASEmblem/>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   ABOUT / FOCUS AREAS
════════════════════════════════════════════════════ */
function IASAbout() {
  return(
    <section style={{padding:"60px 6% 80px",position:"relative",zIndex:1}}>
      <div style={{maxWidth:1300,margin:"0 auto"}}>
        <IASReveal>
          <SectionLabel text="Our Focus"/>
          <div className="ias-two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}>
            <div>
              <h2 style={{fontFamily:"'Cinzel',Georgia,serif",
                fontSize:"clamp(1.5rem,2.8vw,2.4rem)",fontWeight:700,
                color:"white",lineHeight:1.35,marginBottom:26}}>
                Engineering the<br/>
                <span style={{background:C.gradFull,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  Energy of Tomorrow
                </span>
              </h2>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:17,lineHeight:2.1,color:"rgba(255,255,255,.56)",marginBottom:18}}>
                The <strong style={{color:"white"}}>IEEE IAS·PES·IES ENIT Joint Chapter</strong> was
                formed from the merger of three pioneering chapters — IAS (2016), PES (2018), and IES (2025) —
                creating a powerful unified platform for knowledge exchange and technical engagement.
              </p>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:17,lineHeight:2.1,color:"rgba(255,255,255,.42)"}}>
                Through technical workshops, seminars, industry visits and collaborative projects,
                the chapter promotes innovation and bridges academic knowledge with the real-world
                demands of global energy and industrial systems.
              </p>
            </div>

            <div className="ias-three-col" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
              {[
                {icon:"⚡", title:"Power Systems",      desc:"Smart grids, energy storage and transmission engineering", color:C.green},
                {icon:"🔧", title:"Industrial Automation",desc:"PLCs, SCADA, robotics and manufacturing intelligence",    color:C.orange},
                {icon:"🔋", title:"Renewable Energy",    desc:"Solar, wind, and hybrid energy systems design",           color:C.teal},
                {icon:"📟", title:"Electronic Systems",  desc:"Embedded systems, drives and power electronics",          color:C.blue},
              ].map(({icon,title,desc,color})=>(
                <FocusCard key={title} icon={icon} title={title} desc={desc} color={color}/>
              ))}
            </div>
          </div>
        </IASReveal>

        {/* Heritage row */}
        <IASReveal delay={.12}>
          <div style={{marginTop:60,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,
            maxWidth:900}}>
            {[
              {society:"IAS",name:"Industry Applications",year:"Est. 2016",color:C.orange,
                desc:"Bridging students with the world of industrial applications"},
              {society:"PES",name:"Power & Energy",       year:"Est. 2018",color:C.green,
                desc:"Championing sustainable energy systems and smart grids"},
              {society:"IES",name:"Industrial Electronics",year:"Est. 2025",color:C.blue,
                desc:"Advancing electronic systems for modern industrial use"},
            ].map(s=><HeritageCard key={s.society} s={s}/>)}
          </div>
        </IASReveal>
      </div>
    </section>
  );
}

function FocusCard({icon,title,desc,color}){
  const [hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        padding:"22px 18px",borderRadius:16,cursor:"default",
        background:hov?`linear-gradient(135deg,${color}18,${color}06)`:C.bgCard,
        border:`1px solid ${hov?color+"45":C.border}`,
        transition:"all .32s cubic-bezier(.16,1,.3,1)",
        transform:hov?"translateY(-4px)":"translateY(0)",
      }}>
      <div style={{fontSize:26,marginBottom:12,filter:`drop-shadow(0 0 8px ${color}60)`}}>{icon}</div>
      <div style={{fontFamily:"'Cinzel',Georgia,serif",color:"white",
        fontSize:13,fontWeight:700,marginBottom:8}}>{title}</div>
      <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
        color:"rgba(255,255,255,.4)",fontSize:14,lineHeight:1.75}}>{desc}</div>
    </div>
  );
}

function HeritageCard({s}){
  const [hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        padding:"22px 20px",borderRadius:16,
        background:hov?`linear-gradient(135deg,${s.color}14,${s.color}06)`:C.bgCard,
        border:`1px solid ${hov?s.color+"45":"rgba(255,255,255,.07)"}`,
        transition:"all .32s cubic-bezier(.16,1,.3,1)",
        transform:hov?"translateY(-4px)":"translateY(0)",
      }}>
      <div style={{display:"inline-block",padding:"4px 14px",borderRadius:20,marginBottom:12,
        background:`${s.color}18`,border:`1px solid ${s.color}40`,
        color:s.color,fontSize:11,fontWeight:700,letterSpacing:3,
        fontFamily:"'Cinzel',Georgia,serif"}}>{s.society}</div>
      <div style={{color:"white",fontFamily:"'Cinzel',Georgia,serif",
        fontSize:14,fontWeight:700,marginBottom:5}}>{s.name}</div>
      <div style={{color:s.color,fontFamily:"'Cinzel',Georgia,serif",
        fontSize:10,letterSpacing:2,marginBottom:10}}>{s.year}</div>
      <div style={{color:"rgba(255,255,255,.38)",fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:14,lineHeight:1.75}}>{s.desc}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   AUTO-SCROLLING ACTIVITY GALLERY
════════════════════════════════════════════════════ */
const ACTIVITY_PHOTOS = [
  {src:"/ias/activity1.jpg", caption:"Industrial Workshop"},
  {src:"/ias/activity2.jpg", caption:"Smart Grid Seminar"},
  {src:"/ias/activity3.jpg", caption:"Renewable Energy Day"},
  {src:"/ias/activity4.jpg", caption:"IAS Competition"},
  {src:"/ias/activity5.jpg", caption:"PES Technical Day"},
  {src:"/ias/activity6.jpg", caption:"IES Hackathon"},
  {src:"/ias/activity7.jpg", caption:"Industry Field Visit"},
  {src:"/ias/activity8.jpg", caption:"Energy Summit"},
];

function ActivityGallery(){
  const [paused,setPaused]=useState(false);
  const items=[...ACTIVITY_PHOTOS,...ACTIVITY_PHOTOS];
  return(
    <section style={{padding:"60px 0",position:"relative",zIndex:1,overflow:"hidden"}}>
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:120,zIndex:2,
        background:`linear-gradient(to right,${C.bg},transparent)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:120,zIndex:2,
        background:`linear-gradient(to left,${C.bg},transparent)`,pointerEvents:"none"}}/>

      <div style={{padding:"0 6%",maxWidth:1300,margin:"0 auto 30px"}}>
        <SectionLabel text="Our Activities"/>
        <h2 style={{fontFamily:"'Cinzel',Georgia,serif",
          fontSize:"clamp(1.5rem,2.8vw,2.3rem)",fontWeight:700,color:"white"}}>
          Moments That Define Us
        </h2>
      </div>

      <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}
        style={{overflow:"hidden",cursor:"grab"}}>
        <div style={{
          display:"flex",gap:18,
          animation:"ias-scroll 30s linear infinite",
          animationPlayState:paused?"paused":"running",
          width:"max-content",
        }}>
          {items.map((photo,i)=><GalleryCard key={i} photo={photo}/>)}
        </div>
      </div>

      <div style={{textAlign:"center",marginTop:18,color:"rgba(255,255,255,.18)",
        fontSize:10,letterSpacing:4,fontFamily:"'Cinzel',Georgia,serif"}}>
        HOVER TO PAUSE · SCROLL THROUGH OUR MEMORIES
      </div>
    </section>
  );
}

function GalleryCard({photo}){
  const [hov,setHov]=useState(false);
  return(
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        width:280,height:200,borderRadius:14,flexShrink:0,overflow:"hidden",position:"relative",
        border:`1px solid ${hov?"rgba(255,124,32,.5)":"rgba(255,124,32,.14)"}`,
        transition:"border-color .3s,transform .3s",
        transform:hov?"scale(1.04)":"scale(1)",
        boxShadow:hov?"0 12px 40px rgba(255,124,32,.2)":"none",
      }}>
      <div style={{
        width:"100%",height:"100%",
        background:"linear-gradient(135deg,rgba(255,124,32,.2),rgba(0,152,212,.15),rgba(0,196,140,.1))",
      }}>
        <img src={photo.src} alt={photo.caption}
          style={{width:"100%",height:"100%",objectFit:"cover"}}
          onError={e=>{e.target.style.display="none";}}/>
      </div>
      <div style={{position:"absolute",inset:0,
        background:"linear-gradient(to top,rgba(6,10,15,.85) 0%,transparent 50%)",
        opacity:hov?1:0,transition:"opacity .3s"}}/>
      <div style={{position:"absolute",bottom:12,left:14,
        fontFamily:"'Cinzel',Georgia,serif",fontSize:11,color:"white",fontWeight:600,letterSpacing:1,
        opacity:hov?1:0,transition:"opacity .3s"}}>{photo.caption}</div>
      <div style={{position:"absolute",top:10,right:10,width:8,height:8,borderRadius:"50%",
        background:C.gradFull,opacity:hov?1:.4,boxShadow:"0 0 10px rgba(255,124,32,.6)",
        transition:"opacity .3s"}}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   EXECUTIVE COMMITTEE 2026
════════════════════════════════════════════════════ */
const IAS_TEAM = [
  {name:"Roudeina Jemli",         role:"Chair",                          photo:"photos/jc/roudaina.png"},
  {name:"Ibtissem Sghayri",       role:"Vice Chair — Membership",        photo:"photos/jc/ibtissem.png"},
  {name:"Yassine Gargouri",       role:"Vice Chair — Technical",         photo:"photos/jc/gargouri.png"},
  {name:"Nour Jerbi",             role:"Secretary",                      photo:"photos/jc/nour.png"},
  {name:"Oussema Meddeb",         role:"Treasurer",                      photo:"photos/jc/oussema.png"},
  {name:"Dayssem Boumiza",        role:"Webmaster",                      photo:"photos/jc/dayssem.png"},
];

const ROLE_COLORS = {
  "Chair":                    {main:"#FFD700", glow:"rgba(255,215,0,.4)"},
  "Vice Chair — Membership":  {main:"#ff7c20", glow:"rgba(255,124,32,.38)"},
  "Vice Chair — Technical":   {main:"#0098d4", glow:"rgba(0,152,212,.38)"},
  "Secretary":                {main:"#00c48c", glow:"rgba(0,196,140,.35)"},
  "Treasurer":                {main:"#ffb347", glow:"rgba(255,179,71,.35)"},
  "Webmaster":                {main:"#38c4f0", glow:"rgba(56,196,240,.35)"},
};

function IASTeam(){
  return(
    <section style={{padding:"60px 6% 90px",position:"relative",zIndex:1}}>
      <div style={{maxWidth:1300,margin:"0 auto"}}>
        <IASReveal>
          <SectionLabel text="Our Team"/>
          <h2 style={{fontFamily:"'Cinzel',Georgia,serif",
            fontSize:"clamp(1.5rem,2.8vw,2.4rem)",fontWeight:700,
            color:"white",marginBottom:52}}>
            Executive Committee 2026
          </h2>
        </IASReveal>

        {/* Chair — centred */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:22}}>
          <div style={{width:"clamp(210px,22%,268px)"}}>
            <IASMemberCard m={IAS_TEAM[0]}/>
          </div>
        </div>

        {/* Remaining 5 */}
        <div className="ias-card-anim" style={{display:"grid",
          gridTemplateColumns:"repeat(5,1fr)",gap:18}}>
          {IAS_TEAM.slice(1).map((m,i)=><IASMemberCard key={i} m={m}/>)}
        </div>

        <style>{`@media(max-width:1000px){
          .ias-card-anim.ias-row2{grid-template-columns:repeat(3,1fr)!important;}
        }@media(max-width:640px){
          .ias-card-anim.ias-row2{grid-template-columns:repeat(2,1fr)!important;}
        }@media(max-width:380px){
          .ias-card-anim.ias-row2{grid-template-columns:1fr!important;}
        }`}</style>
      </div>
    </section>
  );
}

function IASMemberCard({m}){
  const [hov,setHov]=useState(false);
  const rc = ROLE_COLORS[m.role] || {main:C.orange, glow:"rgba(255,124,32,.35)"};
  const init = m.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  return(
    <div className="ias-card-anim"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        borderRadius:18,overflow:"hidden",
        border:`1px solid ${hov?rc.main+"55":"rgba(255,255,255,.07)"}`,
        background:hov
          ?`linear-gradient(170deg,${rc.main}14,rgba(6,10,15,.98))`
          :C.bgCard,
        transition:"all .4s cubic-bezier(.16,1,.3,1)",
        transform:hov?"translateY(-8px) scale(1.02)":"translateY(0) scale(1)",
        boxShadow:hov?`0 22px 52px rgba(0,0,0,.5),0 0 0 1px ${rc.main}22`:"none",
        display:"flex",flexDirection:"column",
      }}>

      {/* Photo area */}
      <div style={{height:180,position:"relative",overflow:"hidden",flexShrink:0,
        background:`linear-gradient(160deg,${rc.main}22,rgba(6,10,15,.95))`}}>
        {m.photo?(
          <img src={m.photo} alt={m.name}
            style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
        ):(
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{
              width:82,height:82,borderRadius:"50%",
              background:`linear-gradient(135deg,${rc.main}55,rgba(6,10,15,.7))`,
              border:`2px solid ${rc.main}60`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:24,fontWeight:700,color:"white",
              fontFamily:"'Cinzel Decorative',Georgia,serif",
              boxShadow:hov?`0 0 30px ${rc.glow}`:"none",
              transition:"all .4s",
            }}>{init}</div>
          </div>
        )}
        <div style={{
          position:"absolute",top:11,left:11,padding:"5px 12px",borderRadius:20,
          background:`${rc.main}1a`,border:`1px solid ${rc.main}40`,
          color:rc.main,fontSize:9,fontWeight:700,letterSpacing:2,
          textTransform:"uppercase",fontFamily:"'Cinzel',Georgia,serif",
          backdropFilter:"blur(8px)",
        }}>{m.role}</div>
        {hov&&<div style={{position:"absolute",inset:0,
          background:"linear-gradient(90deg,transparent,rgba(255,255,255,.05),transparent)",
          animation:"ias-shimmer .9s ease forwards"}}/>}
      </div>

      {/* Tear */}
      <div style={{position:"relative",margin:"0 13px"}}>
        <div style={{borderTop:`1px dashed ${rc.main}22`}}/>
        {[-1,1].map(s=>(
          <div key={s} style={{position:"absolute",top:-7,[s<0?"left":"right"]:-17,
            width:14,height:14,borderRadius:"50%",
            background:C.bg,border:"1px solid rgba(255,255,255,.06)"}}/>
        ))}
      </div>

      {/* Info */}
      <div style={{padding:"14px 16px 18px",flex:1}}>
        <div style={{color:"white",fontSize:14,fontWeight:700,marginBottom:5,
          fontFamily:"'Cinzel',Georgia,serif",lineHeight:1.3}}>{m.name}</div>
        <div style={{color:rc.main,fontSize:9,letterSpacing:2,textTransform:"uppercase",
          fontFamily:"'Cinzel',Georgia,serif",fontWeight:600}}>{m.role}</div>
        <div style={{height:2,borderRadius:1,marginTop:12,
          background:`linear-gradient(90deg,${rc.main}70,transparent)`,
          width:hov?"65%":"25%",transition:"width .5s ease"}}/>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   MESSAGES FROM FORMERS
════════════════════════════════════════════════════ */
const IAS_MESSAGES = [
  {
    name:"Taycir feguri",
    role:"IIP Joint Chapter Chair 2025",
    side:"left",
    color:C.orange,
    msg:`When we merged three societies into one joint chapter, we weren't just reorganising — we were amplifying. The combined expertise of IAS, PES and IES created something greater than the sum of its parts. I am proud of every student who attended our workshops, competed in our challenges, and left with a clearer vision of what engineering can achieve. To the 2026 team: the foundation is solid — build boldly.`,
  },
  {
    name:"Med Iyadh Chehine",
    role:"IAS PES Joint Chapter Chair 2024",
    side:"right",
    color:C.green,
    msg:`Power and energy are not just technical disciplines — they are responsibilities. At PES ENIT, we shaped engineers who understand that the grids they design will power hospitals, schools and entire communities. That sense of purpose is what made every late night preparing a seminar absolutely worth it. Keep that mission alive in everything you do.`,
  },
];

function IASMessages(){
  return(
    <section style={{padding:"20px 6% 90px",position:"relative",zIndex:1}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <IASReveal>
          <SectionLabel text="Legacy & Words"/>
          <h2 style={{fontFamily:"'Cinzel',Georgia,serif",
            fontSize:"clamp(1.5rem,2.8vw,2.4rem)",fontWeight:700,
            color:"white",marginBottom:50}}>
            Words From Those Who Built This
          </h2>
        </IASReveal>
        <div style={{display:"flex",flexDirection:"column",gap:42}}>
          {IAS_MESSAGES.map((p,i)=>(
            <IASReveal key={i} delay={i*.1}>
              <IASSBubble p={p}/>
            </IASReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function IASSBubble({p}){
  const [hov,setHov]=useState(false);
  const isLeft = p.side==="left";
  const init = p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return(
    <div style={{display:"flex",flexDirection:isLeft?"row":"row-reverse",alignItems:"flex-start",gap:26}}>
      <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{
          width:76,height:76,borderRadius:"50%",
          background:`linear-gradient(135deg,${p.color}55,rgba(6,10,15,.7))`,
          border:`2px solid ${p.color}55`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:20,fontWeight:700,color:"white",
          fontFamily:"'Cinzel Decorative',Georgia,serif",
          boxShadow:`0 0 22px ${p.color}28`,
        }}>{init}</div>
        <div style={{textAlign:"center"}}>
          <div style={{color:"white",fontSize:12,fontWeight:700,
            fontFamily:"'Cinzel',Georgia,serif",whiteSpace:"nowrap"}}>{p.name}</div>
          <div style={{color:p.color,fontSize:9,letterSpacing:2,
            fontFamily:"'Cinzel',Georgia,serif",textTransform:"uppercase",
            whiteSpace:"nowrap",marginTop:3}}>{p.role}</div>
        </div>
      </div>

      <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{
          flex:1,position:"relative",
          background:hov?`linear-gradient(135deg,${p.color}10,rgba(6,10,15,.97))`:C.bgCard,
          border:`1px solid ${hov?p.color+"42":"rgba(255,255,255,.07)"}`,
          borderRadius:isLeft?"6px 22px 22px 22px":"22px 6px 22px 22px",
          padding:"26px 32px",
          transition:"all .35s cubic-bezier(.16,1,.3,1)",
          boxShadow:hov?`0 18px 48px rgba(0,0,0,.35),0 0 0 1px ${p.color}20`:"none",
        }}>
        <div style={{position:"absolute",top:12,[isLeft?"left":"right"]:22,
          fontFamily:"Georgia,serif",fontSize:62,lineHeight:1,
          color:p.color,opacity:.1,fontWeight:900,userSelect:"none"}}>"</div>
        <div style={{position:"absolute",top:24,[isLeft?"left":"right"]:-9,
          width:0,height:0,
          borderTop:"9px solid transparent",borderBottom:"9px solid transparent",
          [isLeft?"borderRight":"borderLeft"]:`9px solid ${hov?p.color+"25":"rgba(255,255,255,.05)"}`,
          transition:"all .35s"}}/>
        <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
          fontSize:17,lineHeight:2,color:"rgba(255,255,255,.65)",
          fontStyle:"italic",position:"relative",zIndex:1}}>{p.msg}</p>
        <div style={{height:2,borderRadius:1,marginTop:20,
          background:`linear-gradient(${isLeft?"90deg":"270deg"},${p.color}70,transparent)`,
          width:hov?"55%":"25%",transition:"width .5s ease"}}/>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   SHARED HELPERS
════════════════════════════════════════════════════ */
function SectionLabel({text}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
      <div style={{width:36,height:3,borderRadius:2,
        background:"linear-gradient(90deg,#ff7c20,#0098d4,#00c48c)"}}/>
      <span style={{fontSize:11,letterSpacing:4,textTransform:"uppercase",
        fontFamily:"'Cinzel',Georgia,serif",fontWeight:600,
        background:C.gradFull,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
      }}>{text}</span>
    </div>
  );
}

function IASReveal({children,delay=0}){
  const ref=useRef(null);
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting){setVis(true);io.disconnect();}},{threshold:.07});
    if(ref.current)io.observe(ref.current);
    return()=>io.disconnect();
  },[]);
  return(
    <div ref={ref} style={{
      opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(28px)",
      transition:`opacity .7s ${delay}s cubic-bezier(.16,1,.3,1),transform .7s ${delay}s cubic-bezier(.16,1,.3,1)`,
    }}>{children}</div>
  );
}

function FbIcon(){return<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>;}
function IgIcon(){return<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>;}
function LiIcon(){return<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>;}

/* ════════════════════════════════════════════════════
   MAIN EXPORT
════════════════════════════════════════════════════ */
function PageIAS({ onBack }) {
  useEffect(()=>{ window.scrollTo(0,0); },[]);
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:"white",
      overflowX:"hidden",fontFamily:"'Cinzel',Georgia,serif",position:"relative"}}>
      <style>{IAS_CSS}</style>
      <IASBackground/>
      <IASHero onBack={onBack}/>
      <IASAbout/>
      <ActivityGallery/>
      <IASTeam/>
      <IASMessages/>
      <div style={{padding:"26px 6%",borderTop:"1px solid rgba(255,124,32,.09)",
        display:"flex",justifyContent:"center",position:"relative",zIndex:1}}>
        <div style={{color:"rgba(255,255,255,.16)",fontSize:10,letterSpacing:5,
          fontFamily:"'Cinzel',Georgia,serif"}}>
          IEEE IAS · IES · PES ENIT JOINT CHAPTER · POWERING TOMORROW
        </div>
      </div>
    </div>
  );
}

export default PageIAS;
