const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
  html { font-size: 16px; }
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-size: 1rem; }
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:#010914}
  ::-webkit-scrollbar-thumb{background:#0070c0;border-radius:2px}

  @keyframes fly-rl {
    0%   { transform: translateX(calc(100vw + 560px)) translateY(0px)   rotate(0deg);   }
    15%  { transform: translateX(calc(100vw + 380px)) translateY(-18px)  rotate(-0.4deg); }
    35%  { transform: translateX(calc(100vw + 160px)) translateY(-38px)  rotate(-0.7deg); }
    50%  { transform: translateX(calc(100vw - 80px))  translateY(-22px)  rotate(-0.3deg); }
    65%  { transform: translateX(calc(100vw - 340px)) translateY(-44px)  rotate(-0.8deg); }
    80%  { transform: translateX(calc(100vw - 560px)) translateY(-28px)  rotate(-0.4deg); }
    100% { transform: translateX(-600px)              translateY(-10px)  rotate(0deg);   }
  }
  @keyframes fly-lr {
    0%   { transform: translateX(-260px) translateY(0px)              rotate(0deg);    }
    20%  { transform: translateX(calc(20vw))  translateY(-14px)       rotate(0.5deg);  }
    45%  { transform: translateX(calc(48vw))  translateY(-30px)       rotate(0.3deg);  }
    70%  { transform: translateX(calc(74vw))  translateY(-18px)       rotate(0.6deg);  }
    100% { transform: translateX(calc(100vw + 300px)) translateY(-8px) rotate(0deg);  }
  }
  @keyframes drift-a {
    0%  {transform:translate(0px,0px) rotate(-0.5deg)}
    25% {transform:translate(12px,-10px) rotate(0.3deg)}
    50% {transform:translate(4px,-5px)  rotate(-0.3deg)}
    75% {transform:translate(-8px,-14px) rotate(0.5deg)}
    100%{transform:translate(0px,0px) rotate(-0.5deg)}
  }
  @keyframes glow-cycle {
    0%,100%{box-shadow:0 0 22px rgba(0,191,255,.15)}
    50%    {box-shadow:0 0 48px rgba(0,191,255,.38),0 0 90px rgba(0,112,192,.16)}
  }
  @keyframes shimmer {
    0%{transform:translateX(-100%)} 100%{transform:translateX(400%)}
  }
  @keyframes card-rise {
    from{opacity:0;transform:translateY(20px) scale(.97)}
    to  {opacity:1;transform:translateY(0) scale(1)}
  }
  @keyframes badge-pulse {
    0%,100%{box-shadow:0 0 10px rgba(255,215,0,.25)} 50%{box-shadow:0 0 22px rgba(255,215,0,.6)}
  }
  @keyframes twinkle {
    0%,100%{opacity:.08} 50%{opacity:.75}
  }
  @keyframes fade-up {
    from{opacity:0;transform:translateY(34px)} to{opacity:1;transform:translateY(0)}
  }

  .crise{animation:card-rise .5s cubic-bezier(.16,1,.3,1) both}
  .crise:nth-child(1){animation-delay:.04s}.crise:nth-child(2){animation-delay:.10s}
  .crise:nth-child(3){animation-delay:.16s}.crise:nth-child(4){animation-delay:.22s}
  .crise:nth-child(5){animation-delay:.28s}.crise:nth-child(6){animation-delay:.34s}
  .crise:nth-child(7){animation-delay:.40s}

  @media(max-width:768px){
    .dnav{display:none!important}
    .hmb{display:flex!important}
    .twocol{grid-template-columns:1fr!important}
  }
`;

export default G;
