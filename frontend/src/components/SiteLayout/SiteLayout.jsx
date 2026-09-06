import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cursor from "../Cursor/Cursor";
import GridOverlay from "../GridOverlay/GridOverlay";
import Preloader from "../Preloader/Preloader";
import { useSmoothScroll, scrollToTop } from "../../lib/useSmoothScroll";
import { ScrollTrigger } from "../../lib/gsap";

export default function SiteLayout() {
  const { pathname } = useLocation();
  const [booted, setBooted] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    scrollToTop();
    ScrollTrigger.refresh();
    // beat any pin/scroll restoration that runs on the next frame
    const raf = requestAnimationFrame(scrollToTop);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  useEffect(() => {
    if (booted) ScrollTrigger.refresh();
  }, [booted]);

  return (
    <>
      {!booted && <Preloader onDone={() => setBooted(true)} />}
      <div className="grain" aria-hidden="true" />
      <GridOverlay />
      <Cursor />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
