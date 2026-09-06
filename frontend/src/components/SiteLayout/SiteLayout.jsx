import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Cursor from "../Cursor/Cursor";
import { useSmoothScroll } from "../../lib/useSmoothScroll";
import { ScrollTrigger } from "../../lib/gsap";

export default function SiteLayout() {
  const { pathname } = useLocation();
  useSmoothScroll();

  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
