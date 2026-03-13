function Airship({ w = 480, style: extraStyle = {}, anim = "drift-a 18s ease-in-out infinite" }) {
  return (
    <svg width={w} viewBox="0 0 520 180" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", filter: "drop-shadow(0 8px 32px rgba(0,140,255,.22))", ...extraStyle }}>
      <defs>
        <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e3a6e"/>
          <stop offset="30%"  stopColor="#102448"/>
          <stop offset="70%"  stopColor="#0a1830"/>
          <stop offset="100%" stopColor="#040e20"/>
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(120,180,255,.18)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,0)"/>
        </linearGradient>
        <linearGradient id="belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(0,0,0,0)"/>
          <stop offset="100%" stopColor="rgba(0,10,30,.7)"/>
        </linearGradient>
        <linearGradient id="fin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#1a4080"/>
          <stop offset="100%" stopColor="#060f24"/>
        </linearGradient>
        <linearGradient id="gond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a3060"/>
          <stop offset="100%" stopColor="#080e20"/>
        </linearGradient>
        <linearGradient id="eng" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#0d2050"/>
          <stop offset="100%" stopColor="#1a3a80"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softglow">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* TAIL ASSEMBLY */}
      <path d="M68 88 L20 76 L18 82 L52 98 Z" fill="url(#fin)" stroke="rgba(0,150,255,.25)" strokeWidth=".6"/>
      <path d="M68 88 L20 100 L18 94 L52 84 Z" fill="url(#fin)" stroke="rgba(0,150,255,.25)" strokeWidth=".6"/>
      <path d="M74 74 L46 36 L56 38 L80 74 Z" fill="url(#fin)" stroke="rgba(0,150,255,.2)" strokeWidth=".6"/>
      <path d="M74 102 L46 140 L56 138 L80 102 Z" fill="url(#fin)" stroke="rgba(0,150,255,.2)" strokeWidth=".6"/>
      <line x1="20" y1="76" x2="68" y2="88" stroke="rgba(0,191,255,.3)" strokeWidth=".8"/>
      <line x1="46" y1="36" x2="74" y2="74" stroke="rgba(0,191,255,.3)" strokeWidth=".8"/>

      {/* MAIN HULL */}
      <ellipse cx="270" cy="93" rx="215" ry="42" fill="rgba(0,5,20,.45)"/>
      <ellipse cx="268" cy="88" rx="218" ry="52" fill="url(#hull)"/>
      <ellipse cx="268" cy="76" rx="190" ry="28" fill="url(#shine)"/>
      <ellipse cx="268" cy="105" rx="190" ry="24" fill="url(#belly)"/>

      {/* HULL PANELING */}
      <ellipse cx="268" cy="88" rx="218" ry="52" fill="none" stroke="rgba(0,150,255,.12)" strokeWidth=".7"/>
      <ellipse cx="268" cy="88" rx="180" ry="38" fill="none" stroke="rgba(0,150,255,.08)" strokeWidth=".5"/>
      {[108,148,188,228,268,308,348,388,420].map((x,i) => {
        const rx = 218 * Math.sin(Math.acos((x-268)/218));
        const ry = 52  * Math.sin(Math.acos((x-268)/218));
        return (
          <ellipse key={i} cx={x} cy="88" rx={Math.abs(ry*.55)} ry={Math.abs(ry)}
            fill="none" stroke="rgba(0,150,255,.09)" strokeWidth=".6"/>
        );
      })}
      <line x1="50" y1="88" x2="486" y2="88" stroke="rgba(0,191,255,.08)" strokeWidth=".5" strokeDasharray="4 6"/>

      {/* DECORATIVE BAND */}
      <path d="M80 72 Q268 58 456 72 L456 104 Q268 118 80 104 Z" fill="rgba(0,80,180,.18)" stroke="rgba(0,140,255,.2)" strokeWidth=".6"/>
      <path d="M100 78 Q268 66 440 78 L440 98 Q268 110 100 98 Z" fill="rgba(0,100,220,.1)"/>
      <path d="M80 72 Q268 58 456 72" fill="none" stroke="rgba(0,191,255,.35)" strokeWidth=".9"/>
      <path d="M80 104 Q268 118 456 104" fill="none" stroke="rgba(0,191,255,.35)" strokeWidth=".9"/>

      {/* TEXT ON HULL */}
      <text x="268" y="85" textAnchor="middle" fill="rgba(255,255,255,.9)"
        fontSize="13" fontWeight="700" fontFamily="'Cinzel',Georgia,serif"
        letterSpacing="4" filter="url(#glow)">IEEE ENIT SB</text>
      <text x="268" y="98" textAnchor="middle" fill="rgba(0,191,255,.7)"
        fontSize="7" fontFamily="'Cinzel',Georgia,serif" letterSpacing="5">
        Since 2005
      </text>

      {/* NOSE */}
      <ellipse cx="486" cy="88" rx="14" ry="16" fill="url(#eng)" stroke="rgba(0,191,255,.3)" strokeWidth=".8"/>
      <ellipse cx="486" cy="88" rx="8" ry="9" fill="rgba(0,140,255,.25)"/>
      <circle cx="498" cy="88" r="3.5" fill="#00bfff" filter="url(#softglow)">
        <animate attributeName="opacity" values=".25;1;.25" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="498" cy="88" r="1.5" fill="white"/>

      {/* TAIL CONE */}
      <ellipse cx="52" cy="88" rx="12" ry="14" fill="url(#eng)" stroke="rgba(0,191,255,.2)" strokeWidth=".7"/>

      {/* GONDOLA */}
      {[200,240,280,320].map(x => (
        <line key={x} x1={x} y1={88+Math.sqrt(1-(((x-268)/218)**2))*52}
          x2={x} y2="138" stroke="rgba(0,140,255,.3)" strokeWidth=".7"/>
      ))}
      <path d="M188 132 Q268 126 348 132 L344 150 Q268 158 192 150 Z"
        fill="url(#gond)" stroke="rgba(0,140,255,.35)" strokeWidth=".8"/>
      {[218,248,278,308].map(x => (
        <ellipse key={x} cx={x} cy="140" rx="7" ry="5"
          fill="rgba(0,191,255,.12)" stroke="rgba(0,191,255,.4)" strokeWidth=".7">
          <animate attributeName="opacity" values=".5;.9;.5" dur={`${2+x*.004}s`} repeatCount="indefinite"/>
        </ellipse>
      ))}
      <path d="M200 150 Q268 156 336 150 L330 157 Q268 162 206 157 Z"
        fill="rgba(0,30,80,.8)" stroke="rgba(0,100,200,.2)" strokeWidth=".5"/>

      {/* ENGINE NACELLES */}
      <ellipse cx="380" cy="114" rx="18" ry="9" fill="url(#eng)" stroke="rgba(0,140,255,.4)" strokeWidth=".8"/>
      <line x1="380" y1="105" x2="380" y2="95" stroke="rgba(0,140,255,.3)" strokeWidth=".8"/>
      <g transform="translate(398,114)">
        <animateTransform attributeName="transform" type="rotate"
          values="0 0 0;360 0 0" dur="1.2s" repeatCount="indefinite" additive="sum"/>
        <ellipse cx="0" cy="-11" rx="2.5" ry="10" fill="rgba(0,191,255,.6)"/>
        <ellipse cx="0" cy="11"  rx="2.5" ry="10" fill="rgba(0,191,255,.6)"/>
        <circle cx="0" cy="0" r="3.5" fill="#0070c0"/>
        <circle cx="0" cy="0" r="1.5" fill="#00bfff"/>
      </g>
      <ellipse cx="160" cy="114" rx="18" ry="9" fill="url(#eng)" stroke="rgba(0,140,255,.4)" strokeWidth=".8"/>
      <line x1="160" y1="105" x2="160" y2="95" stroke="rgba(0,140,255,.3)" strokeWidth=".8"/>
      <g transform="translate(142,114)">
        <animateTransform attributeName="transform" type="rotate"
          values="360 0 0;0 0 0" dur="1.4s" repeatCount="indefinite" additive="sum"/>
        <ellipse cx="0" cy="-10" rx="2.5" ry="10" fill="rgba(0,191,255,.55)"/>
        <ellipse cx="0" cy="10"  rx="2.5" ry="10" fill="rgba(0,191,255,.55)"/>
        <circle cx="0" cy="0" r="3.5" fill="#0070c0"/>
        <circle cx="0" cy="0" r="1.5" fill="#00bfff"/>
      </g>

      {/* EXHAUST TRAIL */}
      {[0,1,2].map(i => (
        <ellipse key={i} cx={46-i*10} cy={88+i*2} rx={4+i*2} ry={3+i} fill="rgba(0,140,255,.06)">
          <animate attributeName="opacity" values=".4;0" dur={`${1.2+i*.4}s`} begin={`${i*.3}s`} repeatCount="indefinite"/>
          <animate attributeName="cx" values={`${46-i*10};${30-i*10}`} dur={`${1.2+i*.4}s`} begin={`${i*.3}s`} repeatCount="indefinite"/>
        </ellipse>
      ))}

      {/* RUNNING LIGHTS */}
      <circle cx="160" cy="109" r="2" fill="#ff4060" filter="url(#glow)">
        <animate attributeName="opacity" values=".3;1;.3" dur="2.4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="380" cy="109" r="2" fill="#00ff88" filter="url(#glow)">
        <animate attributeName="opacity" values=".3;1;.3" dur="2.1s" repeatCount="indefinite"/>
      </circle>
      <circle cx="268" cy="36" r="2.5" fill="#FFD700" filter="url(#softglow)">
        <animate attributeName="opacity" values=".1;.9;.1" dur="1.8s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}

export default Airship;
