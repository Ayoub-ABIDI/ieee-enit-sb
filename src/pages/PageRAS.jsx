import { useState, useEffect, useRef } from "react";

/* ── COLOUR PALETTE ── */
const C = {
  bg:       "#06050a",
  bgDeep:   "#0a0810",
  bgCard:   "rgba(255,255,255,.026)",
  crimson:  "#981a32",
  violet:   "#7c3aed",
  teal:     "#0d9488",
  green:    "#16a34a",
  blue:     "#0ea5e9",
  rose:     "#c0294a",
  muted:    "rgba(255,255,255,.42)",
  border:   "rgba(152,26,50,.18)",
  grad:     "linear-gradient(135deg, #981a32, #7c3aed)",
  gradFull: "linear-gradient(135deg, #981a32 0%, #7c3aed 40%, #0d9488 75%, #16a34a 100%)",
  gradSoft: "linear-gradient(135deg, rgba(152,26,50,.16), rgba(124,58,237,.10), rgba(13,148,136,.08))",
};

/* ── GLOBAL CSS ── */
const RAS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Share+Tech+Mono&display=swap');

  @keyframes ras-float    { 0%,100%{transform:translateY(0) rotate(0deg)} 38%{transform:translateY(-15px) rotate(.8deg)} 68%{transform:translateY(-6px) rotate(-.6deg)} }
  @keyframes ras-spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes ras-spin-r   { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes ras-spin-s   { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
  @keyframes ras-pulse    { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.07)} }
  @keyframes ras-ring     { 0%{transform:scale(1);opacity:.55} 100%{transform:scale(2.6);opacity:0} }
  @keyframes ras-glow     { 0%,100%{box-shadow:0 0 28px rgba(152,26,50,.18),0 0 60px rgba(124,58,237,.08)} 50%{box-shadow:0 0 60px rgba(152,26,50,.38),0 0 110px rgba(13,148,136,.16)} }
  @keyframes ras-shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes ras-scroll   { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes ras-card-in  { from{opacity:0;transform:translateY(26px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes ras-particle { 0%{transform:translateY(0) translateX(0) scale(1);opacity:.8} 100%{transform:translateY(var(--dy)) translateX(var(--dx)) scale(0);opacity:0} }
  @keyframes ras-scan     { 0%{top:-2px} 100%{top:100%} }
  @keyframes ras-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes ras-trace    { 0%{stroke-dashoffset:600;opacity:.7} 100%{stroke-dashoffset:0;opacity:.12} }
  @keyframes ras-ping     { 0%{transform:scale(1);opacity:1} 75%,100%{transform:scale(2.2);opacity:0} }
  @keyframes ras-arm-move { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(18deg)} }
  @keyframes ras-arm2-move{ 0%,100%{transform:rotate(12deg)} 50%{transform:rotate(-22deg)} }
  @keyframes ras-wave     { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.6)} }
  @keyframes ras-led      { 0%,100%{opacity:.3} 50%{opacity:1} }

  .ras-card-anim{animation:ras-card-in .52s cubic-bezier(.16,1,.3,1) both}
  .ras-card-anim:nth-child(1){animation-delay:.05s}
  .ras-card-anim:nth-child(2){animation-delay:.11s}
  .ras-card-anim:nth-child(3){animation-delay:.17s}
  .ras-card-anim:nth-child(4){animation-delay:.23s}
  .ras-card-anim:nth-child(5){animation-delay:.29s}

  .ras-grad-text{
    background:linear-gradient(90deg,#981a32,#7c3aed,#0d9488,#16a34a,#981a32);
    background-size:200% auto;
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:ras-shimmer 5s linear infinite;
  }
  .ras-mono{font-family:'Share Tech Mono','Courier New',monospace}

  @media(max-width:900px){
    .ras-hero-grid{grid-template-columns:1fr!important}
    .ras-two-col  {grid-template-columns:1fr!important}
    .ras-team-row {grid-template-columns:repeat(2,1fr)!important}
  }
  @media(max-width:520px){
    .ras-team-row{grid-template-columns:1fr!important}
  }
`;

/* ════════════════════════════════════════════════════
   ROBOT SVG — animated industrial arm + sensor ring
════════════════════════════════════════════════════ */
function RobotSVG() {
  return (
    <svg viewBox="0 0 300 320" width="300" height="320"
      style={{ display: "block", filter: "drop-shadow(0 0 20px rgba(152,26,50,.4))" }}>
      <defs>
        <linearGradient id="ras-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#981a32" stopOpacity=".9"/>
          <stop offset="100%" stopColor="#3b0a14" stopOpacity=".95"/>
        </linearGradient>
        <linearGradient id="ras-arm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity=".8"/>
          <stop offset="100%" stopColor="#4c1d95" stopOpacity=".9"/>
        </linearGradient>
        <linearGradient id="ras-sensor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d9488"/>
          <stop offset="100%" stopColor="#16a34a"/>
        </linearGradient>
        <filter id="ras-gf">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── BASE PLATFORM ── */}
      <rect x="80" y="280" width="140" height="16" rx="6" fill="#2a1a2e" stroke="rgba(124,58,237,.4)" strokeWidth="1"/>
      <rect x="100" y="274" width="100" height="8" rx="4" fill="#1a0f20" stroke="rgba(152,26,50,.3)" strokeWidth=".8"/>
      {/* Wheels */}
      {[108, 148, 188].map((x, i) => (
        <g key={i} style={{ animation: `ras-spin ${2 + i * .4}s linear infinite` }}
          transform={`translate(${x},296)`}>
          <circle r="8" fill="#150b1c" stroke="rgba(124,58,237,.5)" strokeWidth="1.2"/>
          <circle r="3" fill="rgba(152,26,50,.6)"/>
          {[0, 90, 180, 270].map(a => {
            const rad = a * Math.PI / 180;
            return <line key={a} x1={0} y1={0} x2={5 * Math.cos(rad)} y2={5 * Math.sin(rad)}
              stroke="rgba(124,58,237,.4)" strokeWidth=".8"/>;
          })}
        </g>
      ))}

      {/* ── TORSO ── */}
      <rect x="100" y="170" width="100" height="108" rx="10"
        fill="url(#ras-body)" stroke="rgba(152,26,50,.5)" strokeWidth="1.2"/>
      {/* Panel lines */}
      <line x1="100" y1="210" x2="200" y2="210" stroke="rgba(124,58,237,.2)" strokeWidth=".6"/>
      <line x1="100" y1="240" x2="200" y2="240" stroke="rgba(124,58,237,.2)" strokeWidth=".6"/>
      {/* Status LEDs */}
      {[0, 1, 2].map(i => (
        <circle key={i} cx={120 + i * 14} cy={256} r={3}
          fill={i === 0 ? "#981a32" : i === 1 ? "#7c3aed" : "#0d9488"}
          filter="url(#ras-gf)">
          <animate attributeName="opacity" values=".3;1;.3"
            dur={`${1 + i * .4}s`} begin={`${i * .3}s`} repeatCount="indefinite"/>
        </circle>
      ))}
      {/* Center display */}
      <rect x="120" y="218" width="60" height="16" rx="3"
        fill="rgba(13,148,136,.15)" stroke="rgba(13,148,136,.4)" strokeWidth=".7"/>
      <text x="150" y="229" textAnchor="middle" fill="rgba(13,148,136,.9)"
        fontSize="6" fontFamily="'Share Tech Mono',monospace" letterSpacing="1">
        SYS: ONLINE
      </text>

      {/* ── LEFT ARM ── */}
      <g style={{ transformOrigin: "100px 185px", animation: "ras-arm-move 3.5s ease-in-out infinite" }}>
        <rect x="60" y="178" width="42" height="14" rx="7"
          fill="url(#ras-arm)" stroke="rgba(124,58,237,.45)" strokeWidth="1"/>
        {/* Elbow joint */}
        <circle cx="60" cy="185" r="8" fill="#1a0f2e" stroke="rgba(124,58,237,.5)" strokeWidth="1"/>
        <circle cx="60" cy="185" r="3.5" fill="rgba(124,58,237,.6)"/>
        {/* Forearm */}
        <g style={{ transformOrigin: "60px 185px", animation: "ras-arm2-move 3s ease-in-out .5s infinite" }}>
          <rect x="26" y="181" width="36" height="8" rx="4"
            fill="url(#ras-arm)" stroke="rgba(152,26,50,.35)" strokeWidth=".8"/>
          {/* Gripper */}
          <rect x="18" y="176" width="10" height="6" rx="2" fill="#981a32" stroke="rgba(152,26,50,.5)" strokeWidth=".7"/>
          <rect x="18" y="186" width="10" height="6" rx="2" fill="#981a32" stroke="rgba(152,26,50,.5)" strokeWidth=".7"/>
        </g>
      </g>

      {/* ── RIGHT ARM ── */}
      <g style={{ transformOrigin: "200px 185px", animation: "ras-arm-move 3.5s ease-in-out .8s infinite" }}>
        <rect x="198" y="178" width="42" height="14" rx="7"
          fill="url(#ras-arm)" stroke="rgba(124,58,237,.45)" strokeWidth="1"
          transform="scale(-1,1) translate(-440,0)"/>
        <circle cx="240" cy="185" r="8" fill="#1a0f2e" stroke="rgba(124,58,237,.5)" strokeWidth="1"/>
        <circle cx="240" cy="185" r="3.5" fill="rgba(124,58,237,.6)"/>
        <g style={{ transformOrigin: "240px 185px", animation: "ras-arm2-move 3s ease-in-out 1.1s infinite" }}>
          <rect x="238" y="181" width="36" height="8" rx="4"
            fill="url(#ras-arm)" stroke="rgba(152,26,50,.35)" strokeWidth=".8"/>
          <rect x="272" y="176" width="10" height="6" rx="2" fill="#981a32" stroke="rgba(152,26,50,.5)" strokeWidth=".7"/>
          <rect x="272" y="186" width="10" height="6" rx="2" fill="#981a32" stroke="rgba(152,26,50,.5)" strokeWidth=".7"/>
        </g>
      </g>

      {/* ── NECK ── */}
      <rect x="138" y="152" width="24" height="20" rx="5"
        fill="#1a0f20" stroke="rgba(124,58,237,.3)" strokeWidth=".8"/>

      {/* ── HEAD ── */}
      <rect x="108" y="90" width="84" height="64" rx="12"
        fill="url(#ras-body)" stroke="rgba(152,26,50,.5)" strokeWidth="1.2"/>
      {/* Visor */}
      <rect x="118" y="104" width="64" height="28" rx="6"
        fill="rgba(13,148,136,.12)" stroke="rgba(13,148,136,.5)" strokeWidth="1"/>
      {/* Eyes — sensor array */}
      {[131, 159, 187].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="118" r="6.5"
            fill="rgba(0,0,0,.6)" stroke="rgba(13,148,136,.6)" strokeWidth=".8"/>
          <circle cx={x} cy="118" r="3.5"
            fill={i === 1 ? "rgba(13,148,136,.9)" : "rgba(152,26,50,.7)"} filter="url(#ras-gf)">
            <animate attributeName="opacity" values=".4;1;.4"
              dur={`${1.5 + i * .3}s`} begin={`${i * .4}s`} repeatCount="indefinite"/>
          </circle>
        </g>
      ))}
      {/* Antenna */}
      <line x1="150" y1="90" x2="150" y2="68" stroke="rgba(124,58,237,.5)" strokeWidth="1.5"/>
      <circle cx="150" cy="62" r="5" fill="rgba(13,148,136,.3)" stroke="rgba(13,148,136,.7)" strokeWidth="1">
        <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values=".4;.9;.4" dur="2s" repeatCount="indefinite"/>
      </circle>
      {/* Mouth / speaker */}
      {[-10,-5,0,5,10].map((x, i) => (
        <rect key={i} x={145+x} y="137" width="3" height={4+i%3*2} rx="1"
          fill="rgba(124,58,237,.5)"
          style={{ animation: `ras-wave ${.6+i*.15}s ease-in-out ${i*.1}s infinite` }}/>
      ))}

      {/* ── SENSOR RING ── floating around robot */}
      {[
        {cx:60, cy:120, r:14, color:"#0d9488", dur:"3s", del:"0s"},
        {cx:240,cy:110, r:11, color:"#7c3aed", dur:"2.4s",del:".6s"},
        {cx:50, cy:230, r:9,  color:"#981a32", dur:"4s",  del:"1s"},
        {cx:250,cy:240, r:12, color:"#16a34a", dur:"3.5s",del:".3s"},
      ].map((s, i) => (
        <g key={i}>
          {/* Outer ring */}
          <circle cx={s.cx} cy={s.cy} r={s.r}
            fill="none" stroke={s.color} strokeWidth="1" opacity=".5"
            style={{ animation: `ras-ping ${s.dur} ease-out ${s.del} infinite` }}/>
          {/* Center dot */}
          <circle cx={s.cx} cy={s.cy} r="3" fill={s.color} opacity=".8" filter="url(#ras-gf)">
            <animate attributeName="opacity" values=".3;1;.3" dur={s.dur} begin={s.del} repeatCount="indefinite"/>
          </circle>
          {/* Dashed sensor beam */}
          <line x1={s.cx > 150 ? s.cx - s.r : s.cx + s.r} y1={s.cy}
            x2={s.cx > 150 ? 200 : 100} y2={s.cy > 180 ? 200 : 170}
            stroke={s.color} strokeWidth=".6" strokeDasharray="3 5" opacity=".25"/>
        </g>
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════
   ANIMATED BACKGROUND
════════════════════════════════════════════════════ */
function RASBackground() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>

      {/* Base gradient */}
      <div style={{
        position:"absolute", inset:0,
        background:`radial-gradient(ellipse at 18% 28%, rgba(152,26,50,.13) 0%, transparent 50%),
                    radial-gradient(ellipse at 82% 65%, rgba(124,58,237,.10) 0%, transparent 50%),
                    radial-gradient(ellipse at 50% 88%, rgba(13,148,136,.09) 0%, transparent 45%),
                    linear-gradient(180deg, #06050a 0%, #0a0810 100%)`,
      }}/>

      {/* Animated circuit grid */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.05}}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ras-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#7c3aed" strokeWidth=".5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ras-grid)"/>
        {/* Animated traces */}
        {[[0,"25%","100%","25%","#981a32",5],[0,"55%","100%","55%","#7c3aed",7],
          ["30%",0,"30%","100%","#0d9488",6],["70%",0,"70%","100%","#16a34a",8]].map(([x1,y1,x2,y2,col,dur],i)=>(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={col} strokeWidth=".7" strokeDasharray="600" strokeDashoffset="600"
            style={{animation:`ras-trace ${dur}s linear ${i*1.5}s infinite`}}/>
        ))}
      </svg>

      {/* Background spinning gear — left */}
      <svg style={{position:"absolute",left:"-5%",top:"30%",opacity:.045,
        animation:"ras-spin 70s linear infinite"}}
        width="340" height="340" viewBox="0 0 100 100">
        <GearPath r1={40} r2={47} teeth={18} cx={50} cy={50} stroke="#981a32"/>
      </svg>

      {/* Background gear — right smaller */}
      <svg style={{position:"absolute",right:"-3%",bottom:"20%",opacity:.045,
        animation:"ras-spin-r 50s linear infinite"}}
        width="250" height="250" viewBox="0 0 100 100">
        <GearPath r1={40} r2={46} teeth={14} cx={50} cy={50} stroke="#7c3aed"/>
      </svg>

      {/* Sensor ping rings — scattered */}
      {[
        {left:"8%", top:"15%",  color:"rgba(152,26,50,.3)",  size:40, dur:"3s", del:"0s"},
        {left:"88%",top:"35%",  color:"rgba(124,58,237,.25)",size:30, dur:"2.6s",del:"1s"},
        {left:"20%",top:"75%",  color:"rgba(13,148,136,.25)",size:50, dur:"4s", del:".5s"},
        {left:"75%",top:"80%",  color:"rgba(22,163,74,.2)",  size:35, dur:"3.5s",del:"1.5s"},
        {left:"52%",top:"10%",  color:"rgba(124,58,237,.2)", size:25, dur:"2.8s",del:"2s"},
      ].map((s,i)=>(
        <div key={i} style={{
          position:"absolute",left:s.left,top:s.top,
          width:s.size,height:s.size,borderRadius:"50%",
          border:`1px solid ${s.color}`,
          animation:`ras-ping ${s.dur} ease-out ${s.del} infinite`,
        }}/>
      ))}

      {/* Floating data particles */}
      {Array.from({length:18},(_,i)=>{
        const cols=[C.crimson,C.violet,C.teal,C.green,C.blue];
        return(
          <div key={i} style={{
            position:"absolute",
            left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,
            width:Math.random()*3+2,height:Math.random()*3+2,
            borderRadius:"50%",background:cols[i%5],
            "--dx":`${(Math.random()-.5)*90}px`,
            "--dy":`${-(Math.random()*130+40)}px`,
            animation:`ras-particle ${Math.random()*7+4}s ease-out ${Math.random()*10}s infinite`,
            opacity:.7,
          }}/>
        );
      })}

      {/* Vertical accent lines */}
      {[["20%",C.crimson],["50%",C.violet],["80%",C.teal]].map(([x,col],i)=>(
        <div key={i} style={{
          position:"absolute",left:x,top:0,width:1,height:"100%",
          background:`linear-gradient(to bottom,transparent,${col}18 30%,${col}10 70%,transparent)`,
        }}/>
      ))}
    </div>
  );
}

function GearPath({r1,r2,teeth,cx,cy,stroke}){
  const pts=[];
  const step=(2*Math.PI)/teeth;
  for(let i=0;i<teeth;i++){
    const a1=i*step-step*.2,a2=i*step+step*.2,a3=i*step+step*.5,a4=i*step+step*.7;
    pts.push(`${cx+r1*Math.cos(a1)},${cy+r1*Math.sin(a1)}`);
    pts.push(`${cx+r2*Math.cos(a2)},${cy+r2*Math.sin(a2)}`);
    pts.push(`${cx+r2*Math.cos(a3)},${cy+r2*Math.sin(a3)}`);
    pts.push(`${cx+r1*Math.cos(a4)},${cy+r1*Math.sin(a4)}`);
  }
  return(
    <>
      <polygon points={pts.join(" ")} fill="none" stroke={stroke} strokeWidth="1.2"/>
      <circle cx={cx} cy={cy} r={r1*.42} fill="none" stroke={stroke} strokeWidth=".8"/>
      <circle cx={cx} cy={cy} r={4} fill="none" stroke={stroke} strokeWidth="1"/>
    </>
  );
}

/* ════════════════════════════════════════════════════
   ANIMATED EMBLEM (alternative to robot in emblem slot)
════════════════════════════════════════════════════ */
function RASEmblem(){
  return(
    <div style={{position:"relative",width:340,height:340,
      animation:"ras-float 9s ease-in-out infinite"}}>
      {/* Pulse rings */}
      {[1,2,3].map(i=>(
        <div key={i} style={{
          position:"absolute",inset:0,borderRadius:"50%",
          border:"1px solid rgba(152,26,50,.25)",
          animation:`ras-ring 3.2s ease-out ${i*.9}s infinite`,
        }}/>
      ))}

      {/* Main sphere */}
      <div style={{
        position:"absolute",inset:18,borderRadius:"50%",
        background:"linear-gradient(145deg,rgba(152,26,50,.14),rgba(124,58,237,.10),rgba(13,148,136,.08))",
        border:"1.5px solid rgba(152,26,50,.3)",
        animation:"ras-glow 4.5s ease-in-out infinite",
        display:"flex",alignItems:"center",justifyContent:"center",
        backdropFilter:"blur(14px)",overflow:"hidden",
      }}>
        {/* Scan line */}
        <div style={{
          position:"absolute",left:0,right:0,height:2,
          background:"linear-gradient(90deg,transparent,rgba(152,26,50,.35),transparent)",
          animation:"ras-scan 3s linear infinite",pointerEvents:"none",
        }}/>
        <img src="/logos/ras sen white.png" alt="RAS SEN"
          style={{width:"64%",height:"64%",objectFit:"contain",
            filter:"drop-shadow(0 0 18px rgba(152,26,50,.55))"}}/>
      </div>

      {/* Society badge tags */}
      {[
        {label:"RAS", sub:"Robotics", angle:270, color:C.crimson},
        {label:"SEN", sub:"Sensors",  angle:30,  color:C.teal},
        {label:"AUTO",sub:"Automation",angle:150,color:C.violet},
      ].map(({label,sub,angle,color},i)=>{
        const rad=(angle*Math.PI)/180, r=142;
        const x=170+r*Math.cos(rad)-28, y=170+r*Math.sin(rad)-24;
        return(
          <div key={i} style={{
            position:"absolute",left:x,top:y,
            padding:"7px 13px",borderRadius:12,
            background:`linear-gradient(135deg,${color}28,${color}0a)`,
            border:`1.5px solid ${color}55`,
            display:"flex",flexDirection:"column",alignItems:"center",
            boxShadow:`0 4px 20px ${color}28`,
            animation:`ras-float ${7+i*1.5}s ease-in-out ${i*.6}s infinite`,
          }}>
            <div style={{fontFamily:"'Cinzel',Georgia,serif",
              fontSize:11,fontWeight:700,color,letterSpacing:1}}>{label}</div>
            <div style={{fontSize:7,color:`${color}90`,
              fontFamily:"'Cinzel',Georgia,serif",letterSpacing:.5,marginTop:2}}>{sub}</div>
          </div>
        );
      })}

      {/* Outer rotating rings */}
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",
        animation:"ras-spin 28s linear infinite",opacity:.2}} viewBox="0 0 340 340">
        <circle cx="170" cy="170" r="163" fill="none"
          stroke="url(#rasRingGrad)" strokeWidth=".8" strokeDasharray="4 10"/>
        <defs>
          <linearGradient id="rasRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#981a32"/>
            <stop offset="50%"  stopColor="#7c3aed"/>
            <stop offset="100%" stopColor="#0d9488"/>
          </linearGradient>
        </defs>
      </svg>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",
        animation:"ras-spin-r 45s linear infinite",opacity:.12}} viewBox="0 0 340 340">
        <circle cx="170" cy="170" r="148" fill="none"
          stroke="#16a34a" strokeWidth=".6" strokeDasharray="8 18"/>
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════ */
function RASHero({onBack}){
  const [vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),80);},[]);

  return(
    <section style={{minHeight:"100vh",display:"flex",alignItems:"center",
      padding:"120px 6% 80px",position:"relative",zIndex:1}}>
      <div style={{maxWidth:1300,margin:"0 auto",width:"100%"}}>

        {/* Back */}
        <button onClick={onBack} style={{
          display:"inline-flex",alignItems:"center",gap:10,
          background:"rgba(152,26,50,.07)",border:"1px solid rgba(152,26,50,.25)",
          borderRadius:30,padding:"10px 22px",cursor:"pointer",
          color:C.crimson,fontSize:11,fontWeight:600,letterSpacing:2,
          fontFamily:"'Cinzel',Georgia,serif",textTransform:"uppercase",
          marginBottom:50,transition:"all .3s",
        }}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(152,26,50,.15)";e.currentTarget.style.transform="translateX(-4px)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(152,26,50,.07)";e.currentTarget.style.transform="translateX(0)";}}>
          ← Back to Sub-Units
        </button>

        <div className="ras-hero-grid" style={{
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
              background:"rgba(152,26,50,.09)",border:"1px solid rgba(152,26,50,.3)",
              animation:"ras-pulse 3.2s ease-in-out infinite",
            }}>
              <div style={{width:8,height:8,borderRadius:"50%",
                background:C.grad,boxShadow:`0 0 10px ${C.crimson}`}}/>
              <span style={{color:"rgba(192,80,120,.9)",fontSize:10,letterSpacing:4,
                fontFamily:"'Cinzel',Georgia,serif",fontWeight:600}}>
                IEEE ENIT SB · JOINT CHAPTER
              </span>
            </div>

            <h1 style={{
              fontFamily:"'Cinzel Decorative',Georgia,serif",
              fontSize:"clamp(1.7rem,4.2vw,3.5rem)",fontWeight:900,
              lineHeight:1.1,marginBottom:10,color:"white",
            }}>
              RAS · SEN<br/>
              <span className="ras-grad-text">Joint Chapter</span>
            </h1>

            <p style={{
              fontFamily:"'Cinzel',Georgia,serif",fontSize:"clamp(10px,1.3vw,13px)",
              letterSpacing:5,color:C.muted,marginBottom:24,textTransform:"uppercase",
            }}>Robotics · Automation · Sensors</p>

            {/* Tri-color bar */}
            <div style={{display:"flex",gap:0,marginBottom:28,height:3,borderRadius:3,overflow:"hidden",width:90}}>
              <div style={{flex:1,background:C.crimson}}/>
              <div style={{flex:1,background:C.violet}}/>
              <div style={{flex:1,background:C.teal}}/>
              <div style={{flex:1,background:C.green}}/>
            </div>

            <p style={{
              fontFamily:"'Cormorant Garamond',Georgia,serif",
              fontSize:"clamp(15px,1.7vw,18px)",lineHeight:2.1,
              color:"rgba(255,255,255,.56)",maxWidth:540,marginBottom:38,
            }}>
              The IEEE RAS·SEN ENIT Joint Chapter unites the Robotics &amp; Automation Society
              and the Sensors Council to build, program and deploy intelligent systems.
              From robotic arms to sensor networks, we bridge the physical and digital
              worlds through hands-on engineering.
            </p>

            {/* Stats */}
            <div style={{display:"flex",gap:28,flexWrap:"wrap",marginBottom:44}}>
              {[["100+","Members"],["30+","Annual Activities"],["2","Societies"],["2016","Heritage"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{
                    fontFamily:"'Cinzel Decorative',Georgia,serif",
                    fontSize:"clamp(1.3rem,2.2vw,1.9rem)",fontWeight:900,
                    background:C.gradFull,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                  }}>{v}</div>
                  <div style={{color:"rgba(255,255,255,.27)",fontSize:9,letterSpacing:3,
                    textTransform:"uppercase",fontFamily:"'Cinzel',Georgia,serif",marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{color:"rgba(255,255,255,.22)",fontSize:10,letterSpacing:3,
                fontFamily:"'Cinzel',Georgia,serif",textTransform:"uppercase"}}>Follow us</span>
              {[
                {label:"Facebook", href:"#",icon:<FbIcon/>,color:"#1877f2"},
                {label:"Instagram",href:"#",icon:<IgIcon/>,color:"#e1306c"},
                {label:"LinkedIn", href:"#",icon:<LiIcon/>,color:"#0a66c2"},
              ].map(({label,href,icon,color})=>(
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  style={{
                    width:40,height:40,borderRadius:12,
                    background:"rgba(255,255,255,.04)",border:"1px solid rgba(152,26,50,.2)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    color:"rgba(255,255,255,.4)",textDecoration:"none",transition:"all .28s",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.background=`${color}20`;e.currentTarget.style.borderColor=color;e.currentTarget.style.color=color;e.currentTarget.style.transform="translateY(-3px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.borderColor="rgba(152,26,50,.2)";e.currentTarget.style.color="rgba(255,255,255,.4)";e.currentTarget.style.transform="translateY(0)";}}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right — robot + emblem */}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:28}}>
            <RASEmblem/>
            <div style={{
              background:"rgba(0,0,0,.45)",borderRadius:14,
              border:"1px solid rgba(152,26,50,.2)",
              padding:"18px 24px",width:"100%",maxWidth:340,
              backdropFilter:"blur(10px)",
            }}>
              <RobotSVG/>
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
function RASAbout(){
  return(
    <section style={{padding:"60px 6% 80px",position:"relative",zIndex:1}}>
      <div style={{maxWidth:1300,margin:"0 auto"}}>
        <RASReveal>
          <SectionLabel text="Our Mission"/>
          <div className="ras-two-col" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:64,alignItems:"start"}}>
            <div>
              <h2 style={{fontFamily:"'Cinzel',Georgia,serif",
                fontSize:"clamp(1.5rem,2.8vw,2.4rem)",fontWeight:700,
                color:"white",lineHeight:1.35,marginBottom:24}}>
                Building the Machines<br/>
                <span style={{background:C.gradFull,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  of Tomorrow
                </span>
              </h2>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:17,lineHeight:2.1,color:"rgba(255,255,255,.56)",marginBottom:18}}>
                The <strong style={{color:"white"}}>IEEE RAS·SEN ENIT Joint Chapter</strong> merges
                the expertise of the Robotics &amp; Automation Society with the precision of the
                Sensors Council — creating a platform where mechanical intelligence meets
                real-world sensing.
              </p>
              <p style={{fontFamily:"'Cormorant Garamond',Georgia,serif",
                fontSize:17,lineHeight:2.1,color:"rgba(255,255,255,.42)"}}>
                Through robotics competitions, sensor prototyping workshops, automation seminars
                and collaborative build projects, our members go from concept to deployment —
                engineering systems that perceive, decide and act in the physical world.
              </p>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
              {[
                {tag:"RAS",  title:"Robotic Systems",   desc:"Design, build and program autonomous robotic platforms", color:C.crimson},
                {tag:"SEN",  title:"Sensor Networks",    desc:"Smart sensing, IoT integration and signal acquisition",  color:C.teal},
                {tag:"AUTO", title:"Industrial Automation",desc:"PLC control, SCADA, and process automation systems",   color:C.violet},
                {tag:"AI",   title:"Machine Intelligence",desc:"Computer vision, SLAM and reinforcement learning for robotics",color:C.green},
              ].map(({tag,title,desc,color})=>(
                <FocusCard key={title} tag={tag} title={title} desc={desc} color={color}/>
              ))}
            </div>
          </div>
        </RASReveal>

        {/* Societies heritage */}
        <RASReveal delay={.1}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginTop:52,maxWidth:700}}>
            {[
              {soc:"IEEE RAS",full:"Robotics & Automation Society",year:"Est. 2016",color:C.crimson,
               desc:"Pioneering autonomous systems, robotic design and industrial automation at ENIT"},
              {soc:"IEEE SEN",full:"Sensors Council Joint Chapter", year:"Est. 2019",color:C.teal,
               desc:"Advancing sensor technology, signal processing and smart system integration"},
            ].map(s=><HeritageCard key={s.soc} s={s}/>)}
          </div>
        </RASReveal>
      </div>
    </section>
  );
}

function FocusCard({tag,title,desc,color}){
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
      <div style={{display:"inline-block",padding:"3px 10px",borderRadius:8,marginBottom:10,
        background:`${color}18`,border:`1px solid ${color}35`,
        color,fontSize:9,fontWeight:700,letterSpacing:3,
        fontFamily:"'Cinzel',Georgia,serif"}}>{tag}</div>
      <div style={{fontFamily:"'Cinzel',Georgia,serif",color:"white",
        fontSize:12,fontWeight:700,marginBottom:8}}>{title}</div>
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
        fontFamily:"'Cinzel',Georgia,serif"}}>{s.soc}</div>
      <div style={{color:"white",fontFamily:"'Cinzel',Georgia,serif",
        fontSize:14,fontWeight:700,marginBottom:5}}>{s.full}</div>
      <div style={{color:s.color,fontFamily:"'Cinzel',Georgia,serif",
        fontSize:10,letterSpacing:2,marginBottom:10}}>{s.year}</div>
      <div style={{color:"rgba(255,255,255,.38)",fontFamily:"'Cormorant Garamond',Georgia,serif",
        fontSize:14,lineHeight:1.75}}>{s.desc}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   AUTO-SCROLLING GALLERY
════════════════════════════════════════════════════ */
const ACTIVITY_PHOTOS=[
  {src:"/ras/activity1.jpg",caption:"Robotics Competition"},
  {src:"/ras/activity2.jpg",caption:"Sensor Workshop"},
  {src:"/ras/activity3.jpg",caption:"Automation Lab"},
  {src:"/ras/activity4.jpg",caption:"RAS Build Day"},
  {src:"/ras/activity5.jpg",caption:"IEEE Day RAS"},
  {src:"/ras/activity6.jpg",caption:"Robotic Arm Project"},
  {src:"/ras/activity7.jpg",caption:"Sensors Seminar"},
  {src:"/ras/activity8.jpg",caption:"Hackathon RAS"},
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
          Built Here, Deployed Everywhere
        </h2>
      </div>

      <div onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}
        style={{overflow:"hidden",cursor:"grab"}}>
        <div style={{
          display:"flex",gap:18,
          animation:"ras-scroll 30s linear infinite",
          animationPlayState:paused?"paused":"running",
          width:"max-content",
        }}>
          {items.map((photo,i)=><GalleryCard key={i} photo={photo}/>)}
        </div>
      </div>

      <div style={{textAlign:"center",marginTop:18,color:"rgba(255,255,255,.16)",
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
        border:`1px solid ${hov?"rgba(152,26,50,.55)":"rgba(152,26,50,.16)"}`,
        transition:"border-color .3s,transform .3s",
        transform:hov?"scale(1.04)":"scale(1)",
        boxShadow:hov?"0 12px 40px rgba(152,26,50,.22)":"none",
      }}>
      <div style={{
        width:"100%",height:"100%",
        background:"linear-gradient(135deg,rgba(152,26,50,.2),rgba(124,58,237,.14),rgba(13,148,136,.1))",
      }}>
        <img src={photo.src} alt={photo.caption}
          style={{width:"100%",height:"100%",objectFit:"cover"}}
          onError={e=>{e.target.style.display="none";}}/>
      </div>
      <div style={{position:"absolute",inset:0,
        background:"linear-gradient(to top,rgba(6,5,10,.85) 0%,transparent 50%)",
        opacity:hov?1:0,transition:"opacity .3s"}}/>
      <div style={{position:"absolute",bottom:12,left:14,
        fontFamily:"'Cinzel',Georgia,serif",fontSize:11,color:"white",fontWeight:600,letterSpacing:1,
        opacity:hov?1:0,transition:"opacity .3s"}}>{photo.caption}</div>
      <div style={{position:"absolute",top:10,right:10,width:8,height:8,borderRadius:"50%",
        background:C.grad,opacity:hov?1:.4,boxShadow:"0 0 10px rgba(152,26,50,.6)",
        transition:"opacity .3s"}}/>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   EXECUTIVE COMMITTEE 2026
════════════════════════════════════════════════════ */
const RAS_TEAM=[
  {name:"Souha Khalfaoui", role:"Chair",      photo:null},
  {name:"Mariem Selmi",    role:"Vice Chair", photo:null},
  {name:"Moetez Ben Massoud",role:"Secretary",photo:null},
  {name:"Yassine Riahi",   role:"Treasurer",  photo:null},
  {name:"Nour Dirgham",    role:"Webmaster",  photo:null},
];

const ROLE_COLORS={
  "Chair":      {main:"#FFD700",glow:"rgba(255,215,0,.4)"},
  "Vice Chair": {main:"#981a32",glow:"rgba(152,26,50,.38)"},
  "Secretary":  {main:"#7c3aed",glow:"rgba(124,58,237,.35)"},
  "Treasurer":  {main:"#0d9488",glow:"rgba(13,148,136,.35)"},
  "Webmaster":  {main:"#16a34a",glow:"rgba(22,163,74,.35)"},
};

function RASTeam(){
  return(
    <section style={{padding:"60px 6% 90px",position:"relative",zIndex:1}}>
      <div style={{maxWidth:1300,margin:"0 auto"}}>
        <RASReveal>
          <SectionLabel text="Our Team"/>
          <h2 style={{fontFamily:"'Cinzel',Georgia,serif",
            fontSize:"clamp(1.5rem,2.8vw,2.4rem)",fontWeight:700,
            color:"white",marginBottom:52}}>
            Executive Committee 2026
          </h2>
        </RASReveal>

        {/* Chair centred */}
        <div style={{display:"flex",justifyContent:"center",marginBottom:22}}>
          <div style={{width:"clamp(210px,22%,268px)"}}>
            <RASMemberCard m={RAS_TEAM[0]}/>
          </div>
        </div>

        {/* Remaining 4 */}
        <div className="ras-team-row" style={{display:"grid",
          gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
          {RAS_TEAM.slice(1).map((m,i)=><RASMemberCard key={i} m={m}/>)}
        </div>
      </div>
    </section>
  );
}

function RASMemberCard({m}){
  const [hov,setHov]=useState(false);
  const rc=ROLE_COLORS[m.role]||{main:C.crimson,glow:"rgba(152,26,50,.35)"};
  const init=m.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  return(
    <div className="ras-card-anim"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        borderRadius:18,overflow:"hidden",
        border:`1px solid ${hov?rc.main+"55":"rgba(255,255,255,.07)"}`,
        background:hov?`linear-gradient(170deg,${rc.main}14,rgba(6,5,10,.98))`:C.bgCard,
        transition:"all .4s cubic-bezier(.16,1,.3,1)",
        transform:hov?"translateY(-8px) scale(1.02)":"translateY(0) scale(1)",
        boxShadow:hov?`0 22px 52px rgba(0,0,0,.5),0 0 0 1px ${rc.main}22`:"none",
        display:"flex",flexDirection:"column",
      }}>

      {/* Photo area */}
      <div style={{height:190,position:"relative",overflow:"hidden",flexShrink:0,
        background:`linear-gradient(160deg,${rc.main}22,rgba(6,5,10,.95))`}}>
        {m.photo?(
          <img src={m.photo} alt={m.name}
            style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
        ):(
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {/* Robotic avatar */}
            <div style={{
              width:88,height:88,borderRadius:16,
              background:`linear-gradient(135deg,${rc.main}40,rgba(6,5,10,.8))`,
              border:`1.5px solid ${rc.main}55`,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              boxShadow:hov?`0 0 32px ${rc.glow}`:"none",transition:"all .4s",
              position:"relative",overflow:"hidden",
            }}>
              {/* Scanline */}
              {hov&&<div style={{position:"absolute",left:0,right:0,height:1,
                background:`linear-gradient(90deg,transparent,${rc.main}50,transparent)`,
                animation:"ras-scan 2s linear infinite"}}/>}
              <div className="ras-mono" style={{fontSize:7,color:`${rc.main}80`,marginBottom:3}}>sys/user</div>
              <div style={{fontSize:22,fontWeight:700,color:rc.main,
                fontFamily:"'Cinzel Decorative',Georgia,serif"}}>{init}</div>
              {/* LED row */}
              <div style={{display:"flex",gap:4,marginTop:6}}>
                {[C.crimson,C.violet,C.teal].map((c,i)=>(
                  <div key={i} style={{width:5,height:5,borderRadius:"50%",background:c,
                    animation:`ras-led ${1+i*.3}s ease-in-out ${i*.2}s infinite`}}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Role badge */}
        <div style={{
          position:"absolute",top:11,left:11,padding:"5px 12px",borderRadius:20,
          background:`${rc.main}1a`,border:`1px solid ${rc.main}40`,
          color:rc.main,fontSize:9,fontWeight:700,letterSpacing:2,
          textTransform:"uppercase",fontFamily:"'Cinzel',Georgia,serif",
          backdropFilter:"blur(8px)",
        }}>{m.role}</div>

        {hov&&<div style={{position:"absolute",inset:0,
          background:"linear-gradient(90deg,transparent,rgba(255,255,255,.04),transparent)",
          animation:"ras-shimmer .9s ease forwards"}}/>}
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
const RAS_MESSAGES=[
  {
    name:"Omar Bejaoui",
    role:"RAS Chapter Chair 2024",
    side:"left",
    color:C.crimson,
    msg:"Building a robot from scratch — from the first servo to the final firmware flash — is the closest thing to pure engineering joy I have ever experienced. The RAS ENIT chapter taught me that great robots are not built by individuals, they are built by teams who trust each other. I am proud of every project we shipped, every competition we entered, and every student we inspired to believe they could build something that moves.",
  },
  {
    name:"Rania Ghali",
    role:"SEN Chapter Lead 2023",
    side:"right",
    color:C.teal,
    msg:"Sensors are the nervous system of every intelligent machine — and at SEN ENIT, we learned to make those nerves sharp. From ultrasonic distance sensing to environmental monitoring nodes, we built real systems that gathered real data. Joining the joint chapter with RAS was the natural evolution — automation without sensing is blind. I am excited to see what this combined chapter will create next.",
  },
];

function RASMessages(){
  return(
    <section style={{padding:"20px 6% 90px",position:"relative",zIndex:1}}>
      <div style={{maxWidth:1200,margin:"0 auto"}}>
        <RASReveal>
          <SectionLabel text="Legacy & Words"/>
          <h2 style={{fontFamily:"'Cinzel',Georgia,serif",
            fontSize:"clamp(1.5rem,2.8vw,2.4rem)",fontWeight:700,
            color:"white",marginBottom:50}}>
            Words From Those Who Built This
          </h2>
        </RASReveal>
        <div style={{display:"flex",flexDirection:"column",gap:42}}>
          {RAS_MESSAGES.map((p,i)=>(
            <RASReveal key={i} delay={i*.1}>
              <RASBubble p={p}/>
            </RASReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function RASBubble({p}){
  const [hov,setHov]=useState(false);
  const isLeft=p.side==="left";
  const init=p.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  return(
    <div style={{display:"flex",flexDirection:isLeft?"row":"row-reverse",alignItems:"flex-start",gap:26}}>
      <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{
          width:76,height:76,borderRadius:16,
          background:`linear-gradient(135deg,${p.color}50,rgba(6,5,10,.7))`,
          border:`2px solid ${p.color}55`,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          boxShadow:`0 0 22px ${p.color}28`,
        }}>
          <div className="ras-mono" style={{fontSize:7,color:`${p.color}80`,marginBottom:2}}>sys</div>
          <div style={{fontSize:18,fontWeight:700,color:p.color,
            fontFamily:"'Cinzel Decorative',Georgia,serif"}}>{init}</div>
        </div>
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
          background:hov?`linear-gradient(135deg,${p.color}10,rgba(6,5,10,.97))`:C.bgCard,
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
      <div style={{width:36,height:3,borderRadius:2,background:C.gradFull}}/>
      <span style={{fontSize:11,letterSpacing:4,textTransform:"uppercase",
        fontFamily:"'Cinzel',Georgia,serif",fontWeight:600,
        background:C.gradFull,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
      }}>{text}</span>
    </div>
  );
}

function RASReveal({children,delay=0}){
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
function PageRAS({onBack}){
  useEffect(()=>{window.scrollTo(0,0);},[]);
  return(
    <div style={{minHeight:"100vh",background:C.bg,color:"white",
      overflowX:"hidden",fontFamily:"'Cinzel',Georgia,serif",position:"relative"}}>
      <style>{RAS_CSS}</style>
      <RASBackground/>
      <RASHero onBack={onBack}/>
      <RASAbout/>
      <ActivityGallery/>
      <RASTeam/>
      <RASMessages/>
      <div style={{padding:"26px 6%",borderTop:"1px solid rgba(152,26,50,.09)",
        display:"flex",justifyContent:"center",position:"relative",zIndex:1}}>
        <div style={{color:"rgba(255,255,255,.15)",fontSize:10,letterSpacing:5,
          fontFamily:"'Cinzel',Georgia,serif"}}>
          IEEE RAS · SEN ENIT JOINT CHAPTER · BUILD · SENSE · AUTOMATE
        </div>
      </div>
    </div>
  );
}

export default PageRAS;
