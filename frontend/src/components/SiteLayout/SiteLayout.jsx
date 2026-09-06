import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cursor from "../Cursor/Cursor";
import GridOverlay from "../GridOverlay/GridOverlay";
import Preloader from "../Preloader/Preloader";
import { useSmoothScroll } from "../../lib/useSmoothScroll";
import { ScrollTrigger } from "../../lib/gsap";

export default function SiteLayout() {
  const { pathname } = useLocation();
  const [booted, setBooted] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
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
