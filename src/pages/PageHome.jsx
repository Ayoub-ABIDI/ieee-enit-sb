import { useState, useEffect, useRef } from "react";
import Airship from "../components/Airship";

const CSS = `
  @keyframes fly-rl {
    0%   { transform: translateX(110vw); }
    100% { transform: translateX(-520px); }
  }
  @keyframes fly-lr {
    0%   { transform: translateX(-280px); }
    100% { transform: translateX(110vw); }
  }
  @keyframes orb-a { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
  @keyframes orb-b { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-35px,25px)} }
  @keyframes founder-glow {
    0%,100% { opacity:.4; }
    50%      { opacity:1;  }
  }
  @keyframes ticker-word {
    from { opacity:0; filter:blur(4px); transform:translateY(6px); }
    to   { opacity:1; filter:blur(0);   transform:translateY(0);   }
  }
  @keyframes founder-fade-up {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
`;

/* word-by-word animated quote */
function AnimatedQuote({ text, vis, baseDelay = 0 }) {
  const words = text.split(" ");
  return (
    <span>
      {words.map((w, i) => (
        <span key={i} style={{
          display: "inline-block", marginRight: "0.28em",
          opacity: vis ? 1 : 0,
          animation: vis ? "ticker-word .38s ease both" : "none",
          animationDelay: vis ? `${baseDelay + i * 0.042}s` : "0s",
        }}>{w}</span>
      ))}
    </span>
  );
}

function FounderQuote() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} style={{
      position: "relative", zIndex: 10,
      padding: "110px 6% 130px",
      background: "linear-gradient(180deg,#040e23 0%,#020810 40%,#020810 60%,#040e23 100%)",
      overflow: "hidden",
    }}>
      {/* scan lines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,191,255,.009) 3px,rgba(0,191,255,.009) 4px)",
      }}/>

      {/* left vertical rule */}
      <div style={{
        position: "absolute", left: "6%", top: "8%", bottom: "8%", width: 1,
        background: "linear-gradient(to bottom,transparent,rgba(0,191,255,.22) 25%,rgba(0,191,255,.22) 75%,transparent)",
        opacity: vis ? 1 : 0, transition: "opacity 1s .3s ease",
      }}>
        {[0, 100].map(pct => (
          <div key={pct} style={{
            position: "absolute", top: pct === 0 ? 0 : "auto", bottom: pct === 100 ? 0 : "auto",
            left: "50%", transform: "translateX(-50%)",
            width: 6, height: 6, borderRadius: "50%",
            background: "#00bfff", boxShadow: "0 0 14px #00bfff",
            animation: `founder-glow 3s ease-in-out ${pct === 100 ? "1.5s" : "0s"} infinite`,
          }}/>
        ))}
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", paddingLeft: "4%" }}>

        {/* label */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 56,
          opacity: vis ? 1 : 0, transition: "opacity .8s .2s ease",
        }}>
          <div style={{ width: 28, height: 1, background: "rgba(0,191,255,.5)" }}/>
          <span style={{
            fontFamily: "'Cinzel',Georgia,serif", fontSize: 9,
            letterSpacing: 5, textTransform: "uppercase", color: "#00bfff", fontWeight: 600,
          }}>The Origin · May 24, 2005</span>
          <div style={{ width: 28, height: 1, background: "rgba(0,191,255,.5)" }}/>
        </div>

        {/* quote block */}
        <div style={{ position: "relative" }}>

          {/* giant opening mark */}
          <div style={{
            position: "absolute", top: -50, left: -16,
            fontFamily: "Georgia,serif", fontSize: 200, lineHeight: 1,
            color: "#00bfff", opacity: vis ? .055 : 0,
            fontWeight: 900, pointerEvents: "none", userSelect: "none",
            transition: "opacity 1.5s ease",
          }}>"</div>

          <blockquote style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: "clamp(18px,2vw,24px)",
            lineHeight: 2.1, color: "rgba(255,255,255,.72)",
            fontStyle: "italic", margin: 0,
            position: "relative", zIndex: 1, maxWidth: 800,
          }}>
            {/* line 1 */}
            <AnimatedQuote vis={vis} baseDelay={0.1}
              text="In 2005, I decided to launch an IEEE Student Branch at ENIT."/>
            <br/>
            <AnimatedQuote vis={vis} baseDelay={0.7}
              text="and to tell you the truth, it was not easy to make the New York guys accept this truth,"/>
            <br/>
            <AnimatedQuote vis={vis} baseDelay={1.3}
              text="on the absence of an IEEE section in Tunisia. But somehow, we convinced them"/>

            <br/><br/>

            {/* KEY sentence — bigger, bold, different */}
            <span style={{
              display: "block",
              fontFamily: "'Cinzel',Georgia,serif",
              fontSize: "clamp(14px,1.7vw,19px)",
              fontStyle: "normal", lineHeight: 2,
              marginBottom: "0.5em",
              opacity: vis ? 1 : 0,
              animation: vis ? "founder-fade-up .6s 2.2s ease both" : "none",
            }}>
              <span style={{ color: "rgba(255,255,255,.88)" }}>They trusted us.{"  "}</span>
              <span style={{ color: "rgba(255,255,255,.88)" }}>They trusted ENIT.{"  "}</span>
              <span style={{
                background: "linear-gradient(90deg,#00bfff,#7eb8ff,#fff)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                fontWeight: 800,
              }}>They trusted you.</span>
            </span>

            <AnimatedQuote vis={vis} baseDelay={2.5}
              text="And today’s events are nothing but a proof of that trust."/>
            <br/>

          </blockquote>

          {/* animated underline */}
          <div style={{
            height: 1, marginTop: 42,
            background: "linear-gradient(90deg,rgba(0,191,255,.75),rgba(126,184,255,.35),transparent)",
            width: vis ? "58%" : "0%",
            transition: "width 1.6s 3.2s cubic-bezier(.16,1,.3,1)",
          }}/>

          {/* date badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            marginTop: 22, padding: "7px 18px", borderRadius: 30,
            background: "rgba(0,191,255,.05)", border: "1px solid rgba(0,191,255,.14)",
            opacity: vis ? 1 : 0, transition: "opacity .8s 3.6s ease",
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="#00bfff" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <span style={{
              fontFamily: "'Cinzel',Georgia,serif", fontSize: 9,
              letterSpacing: 3, color: "rgba(0,191,255,.6)",
            }}>MAY 24, 2005 · TUNIS, TUNISIA</span>
          </div>
        </div>

        {/* author row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20, marginTop: 56,
          opacity: vis ? 1 : 0, transition: "opacity .8s 3.4s ease",
        }}>
          <div style={{
            width: 54, height: 54, borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg,rgba(0,100,200,.6),rgba(0,191,255,.28))",
            border: "1.5px solid rgba(0,191,255,.38)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 28px rgba(0,191,255,.18)",
          }}>
            <span style={{
              fontFamily: "'Cinzel Decorative',Georgia,serif",
              fontSize: 15, fontWeight: 900, color: "white",
            }}>JZ</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Cinzel',Georgia,serif", color: "white", fontSize: 14, fontWeight: 700, marginBottom: 3 }}>
              Mr. Jalel Zin
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", color: "rgba(0,191,255,.65)", fontSize: 13, fontStyle: "italic" }}>
              Founder, IEEE ENIT Student Branch · 2005
            </div>
          </div>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(0,191,255,.15),transparent)" }}/>
          <div style={{
            fontFamily: "'Cinzel Decorative',Georgia,serif",
            fontSize: "clamp(32px,5vw,64px)", fontWeight: 900,
            color: "rgba(0,191,255,.05)", letterSpacing: -2, userSelect: "none",
          }}>2005</div>
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════ */

function PageHome({ go }) {
  const [inn, setInn] = useState(false);
  useEffect(() => { setTimeout(() => setInn(true), 90); }, []);

  return (
    <div style={{ minHeight: "100vh", position: "relative", overflowX: "hidden", background: "#040e23" }}>
      <style>{CSS}</style>

      {/* HERO */}
      <div style={{
        minHeight: "100vh", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse at 28% 42%,#0c2550 0%,#040e23 52%,#010509 100%)",
      }}>
        <div style={{ position:"absolute",inset:0,zIndex:1,pointerEvents:"none", backgroundImage:`linear-gradient(rgba(0,191,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,191,255,.025) 1px,transparent 1px)`, backgroundSize:"68px 68px" }}/>
        <div style={{ position:"absolute",width:560,height:560,top:"-8%",left:"12%",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,112,192,.14) 0%,transparent 68%)",pointerEvents:"none",zIndex:1,animation:"orb-a 20s ease-in-out infinite" }}/>
        <div style={{ position:"absolute",width:400,height:400,bottom:"5%",right:"8%",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,191,255,.09) 0%,transparent 68%)",pointerEvents:"none",zIndex:1,animation:"orb-b 26s ease-in-out infinite" }}/>

        <div style={{ position:"absolute",top:"18%",left:0,zIndex:2,opacity:.55,pointerEvents:"none",animation:"fly-rl 55s linear infinite" }}>
          <Airship w={480}/>
        </div>
        <div style={{ position:"absolute",top:"58%",left:0,zIndex:2,opacity:.22,pointerEvents:"none",animation:"fly-lr 72s linear 18s infinite" }}>
          <div style={{ transform:"scaleX(-1)" }}><Airship w={240}/></div>
        </div>

        <div style={{
          position:"relative",zIndex:10,textAlign:"center",
          padding:"0 24px",maxWidth:840,
          opacity:inn?1:0,transform:inn?"translateY(0)":"translateY(38px)",
          transition:"all 1.1s cubic-bezier(.16,1,.3,1)",
        }}>
          <h1 style={{ fontFamily:"'Cinzel Decorative',Georgia,serif", fontSize:"clamp(2.8rem,7.5vw,6rem)",fontWeight:900,lineHeight:1.08, color:"white",textShadow:"0 0 70px rgba(0,191,255,.22)",marginBottom:10 }}>IEEE ENIT</h1>

          <h2 style={{ fontFamily:"'Cinzel',Georgia,serif", fontSize:"clamp(1rem,2.8vw,2rem)",fontWeight:400, letterSpacing:"clamp(6px,2vw,14px)", background:"linear-gradient(135deg,#00bfff,#ffffff,#0070c0)", WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:22 }}>STUDENT BRANCH</h2>

          <div style={{ position:"relative",display:"inline-block",marginBottom:42 }}>
            <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", color:"rgba(255,255,255,.45)",fontSize:"clamp(15px,2vw,20px)", fontStyle:"italic",letterSpacing:3 }}>" Together We Shine "</p>
            <div style={{ position:"absolute",bottom:-8,left:"5%",right:"5%",height:1, background:"linear-gradient(90deg,transparent,rgba(0,191,255,.4),transparent)" }}/>
          </div>

          <p style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", color:"rgba(255,255,255,.45)",fontSize:"clamp(14px,1.8vw,17px)", lineHeight:2,maxWidth:560,margin:"0 auto 52px",letterSpacing:.5 }}>
            Tunisia's first IEEE entity, pioneering technical excellence,
            innovation, and professional growth since 2005.
          </p>

          <div style={{ display:"flex",gap:"clamp(18px,4vw,54px)",justifyContent:"center",flexWrap:"wrap",marginBottom:56 }}>
            {[["5","Technical Chapters"],["2","Groups"],["1","Council"],["300+","Members"],["31+","Awards"]].map(([n,l])=>(
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Cinzel Decorative',Georgia,serif",fontSize:"clamp(1.5rem,3.5vw,2.3rem)",fontWeight:900,color:"#00bfff",textShadow:"0 0 22px rgba(0,191,255,.55)" }}>{n}</div>
                <div style={{ color:"rgba(255,255,255,.3)",fontSize:9,letterSpacing:2,textTransform:"uppercase",fontFamily:"'Cinzel',Georgia,serif",marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
            {[
              { label:"Discover More",target:"About",    solid:true  },
              { label:"Our Events",   target:"Events",   solid:false },
              { label:"Sub-Units",    target:"Sub-Units",solid:false,dim:true },
            ].map(({ label,target,solid,dim })=>(
              <button key={label} onClick={()=>go(target)} style={{
                padding:"14px 36px",borderRadius:40,fontSize:11,fontWeight:700,
                letterSpacing:2,cursor:"pointer",textTransform:"uppercase",
                fontFamily:"'Cinzel',Georgia,serif",transition:"all .3s",
                background:solid?"linear-gradient(135deg,#0070c0,#00bfff)":"transparent",
                border:solid?"none":`1px solid rgba(0,191,255,${dim?".3":".45"})`,
                color:dim?"rgba(255,255,255,.7)":"white",
                boxShadow:solid?"0 8px 28px rgba(0,191,255,.3)":"none",
              }}
                onMouseEnter={e=>{ if(solid){e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(0,191,255,.48)";}else{e.currentTarget.style.background="rgba(0,191,255,.08)";e.currentTarget.style.transform="translateY(-3px)";} }}
                onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; if(solid)e.currentTarget.style.boxShadow="0 8px 28px rgba(0,191,255,.3)"; else e.currentTarget.style.background="transparent"; }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ position:"absolute",bottom:22,left:"50%",transform:"translateX(-50%)", zIndex:10,display:"flex",flexDirection:"column",alignItems:"center",gap:8 }}>
          <div style={{ color:"rgba(255,255,255,.14)",fontSize:9,letterSpacing:5, fontFamily:"'Cinzel',Georgia,serif",whiteSpace:"nowrap" }}>IEEE ENIT SB · 2005 – 2026</div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,191,255,.25)" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>

      {/* FOUNDER QUOTE */}
      <FounderQuote/>

    </div>
  );
}

export default PageHome;