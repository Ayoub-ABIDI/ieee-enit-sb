import { useState, useEffect, useCallback } from "react";

import G from "./styles/global";
import Stars from "./components/Stars";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import PageHome from "./pages/PageHome";
import PageAbout from "./pages/PageAbout";
import PageEvents from "./pages/PageEvents";
import PageSubUnits from "./pages/PageSubUnits";
import PageAwards from "./pages/PageAwards";
import PageWIE   from "./pages/PageWIE";
import PageIAS   from "./pages/PageIAS";
import PageCS    from "./pages/PageCS";
import PageRAS   from "./pages/PageRAS";
import PageSIGHT from "./pages/PageSIGHT";

export default function App() {
  const [page, setPage] = useState("Home");
  const [display, setDisplay] = useState("Home");
  const [fading, setFading] = useState(false);

  // Set browser tab title and favicon
  useEffect(() => {
    document.title = "IEEE ENIT SB";
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.href = "/ENIT.png";
    link.type = "image/png";
  }, []);

  const go = useCallback(target => {
    if (target === display) return;
    setFading(true);
    setTimeout(() => {
      setDisplay(target);
      setFading(false);
      window.scrollTo(0, 0);
    }, 220);
    setPage(target);
  }, [display]);

  return (
    <div style={{
      fontFamily: "'Cinzel',Georgia,serif",
      background: "#040e23",
      minHeight: "100vh",
      color: "white",
      overflowX: "hidden",
    }}>
      <style>{G}</style>
      <Stars/>
      <Nav page={page} go={go}/>

      <main style={{
        opacity: fading ? 0 : 1,
        transform: fading ? "translateY(10px)" : "translateY(0)",
        transition: "opacity .22s ease, transform .22s ease",
      }}>
        {display === "Home"      && <PageHome go={go}/>}
        {display === "About"     && <PageAbout/>}
        {display === "Events"    && <PageEvents/>}
        {display === "Sub-Units" && <PageSubUnits go={go}/>}
        {display === "Awards"    && <PageAwards/>}
        {display === "WIE"   && <PageWIE   onBack={() => go("Sub-Units")}/>}
        {display === "IAS"   && <PageIAS   onBack={() => go("Sub-Units")}/>}
        {display === "CS"    && <PageCS    onBack={() => go("Sub-Units")}/>}
        {display === "RAS"   && <PageRAS   onBack={() => go("Sub-Units")}/>}
        {display === "SIGHT" && <PageSIGHT onBack={() => go("Sub-Units")}/>}
      </main>

      <Footer go={go}/>
    </div>
  );
}