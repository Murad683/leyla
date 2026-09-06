import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import styles from "./Navbar.module.css";

const LINKS = [
  { to: "/xidmetler", label: "Xidmətlər" },
  { to: "/kurslar", label: "Kurslar" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/elaqe", label: "Əlaqə" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // hide when scrolling down past the hero-ish zone, show on scroll up
      if (y > 160 && y > last + 4) setHidden(true);
      else if (y < last - 4 || y < 160) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`${styles.bar} ${scrolled ? styles.scrolled : ""} ${
        hidden && !open ? styles.hidden : ""
      }`}
    >
      <div className={`${styles.inner} shell`}>
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          Leyla Məmmədli
        </Link>

        <nav className={styles.nav}>
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.linkActive : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <a
          href="https://www.instagram.com/leiylamammadly/"
          target="_blank"
          rel="noreferrer"
          className={styles.cta}
        >
          İş birliyi
        </a>

        <button
          className={styles.burger}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Bağla" : "Menyu"}
          aria-expanded={open}
        >
          <span className={open ? styles.burgerOpen : ""} />
          <span className={open ? styles.burgerOpen : ""} />
        </button>
      </div>

      <div className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}>
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={styles.sheetLink}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
        <a
          href="https://www.instagram.com/leiylamammadly/"
          target="_blank"
          rel="noreferrer"
          className={styles.sheetLink}
          onClick={() => setOpen(false)}
        >
          Instagram
        </a>
      </div>
    </header>
  );
}
