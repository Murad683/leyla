import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "../../lib/gsap";
import { usePortfolio } from "../../lib/useContent";
import styles from "./WorkGallery.module.css";

const DEFAULT_WORK = [
  { n: "01", name: "Nərgiz Kosmetika", cats: ["Şəxsi brend", "Reels"], img: "/work-1.webp", tint: "var(--field-1)", result: "3 ayda +48K izləyici" },
  { n: "02", name: "Baku Coffee Lab", cats: ["Strategiya", "Kontent"], img: "/work-2.webp", tint: "var(--field-2)", result: "Sifarişlərdə 2.1× artım" },
  { n: "03", name: "Studio Mās", cats: ["Vizual dil", "Satış qıfı"], img: "/work-3.webp", tint: "var(--field-3)", result: "Ayda 120+ sorğu" },
  { n: "04", name: "Terra Wellness", cats: ["Kontent", "Analitika"], img: "/work-4.webp", tint: "var(--field-4)", result: "Kursda 340 qeydiyyat" },
  { n: "05", name: "Lumen Estetika", cats: ["Şəxsi brend", "Reels"], img: "/work-5.webp", tint: "var(--field-5)", result: "Reels-də 1.4M baxış" },
];

const MOBILE = "(max-width: 860px)";

export default function WorkGallery() {
  const root = useRef(null);
  const WORK = usePortfolio(DEFAULT_WORK);
  const pinWrap = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);

  const slideCount = WORK.length + 1; // + the closing CTA card
  const [active, setActive] = useState(0);

  // gsap.matchMedia re-runs these when the breakpoint is crossed (resize / devtools)
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    // ---- desktop: scroll-scrubbed horizontal pan ----
    mm.add("(min-width: 861px)", () => {
      setActive(0);
      if (reduce) return;
      const distance = () => {
        const track = trackRef.current;
        const vp = viewportRef.current;
        if (!track || !vp) return 0;
        return Math.max(0, track.scrollWidth - vp.clientWidth);
      };
      const tween = gsap.to(trackRef.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => "+=" + distance(),
          pin: pinWrap.current,
          anticipatePin: 1,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      const id = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => {
        clearTimeout(id);
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(trackRef.current, { clearProps: "transform" });
      };
    });

    // ---- mobile: snap carousel with focus animation + gentle autoplay ----
    mm.add(MOBILE, () => {
      const vp = viewportRef.current;
      const track = trackRef.current;
      if (!vp || !track) return;
      gsap.set(track, { clearProps: "transform" });
      const cards = Array.from(track.children);

      let cur = 0;
      let timer = null;
      let idleUntil = 0;

      // nearest card to the viewport centre -> active (drives focus + dots + autoplay)
      const sync = () => {
        const mid = vp.scrollLeft + vp.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        cards.forEach((c, i) => {
          const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
          if (d < bestD) { bestD = d; best = i; }
        });
        if (best !== cur) { cur = best; setActive(best); }
      };
      vp.addEventListener("scroll", sync, { passive: true });
      sync();

      const goTo = (i) => {
        const card = cards[i];
        if (card) vp.scrollTo({ left: card.offsetLeft - (vp.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
      };
      const sectionInView = () => {
        const r = root.current.getBoundingClientRect();
        return r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.3;
      };
      const tick = () => {
        if (reduce || Date.now() < idleUntil || !sectionInView()) return;
        goTo((cur + 1) % cards.length);
      };
      if (!reduce) timer = setInterval(tick, 4500);

      const nudgeIdle = () => { idleUntil = Date.now() + 7000; };
      vp.addEventListener("pointerdown", nudgeIdle, { passive: true });
      vp.addEventListener("touchstart", nudgeIdle, { passive: true });
      vp.addEventListener("wheel", nudgeIdle, { passive: true });

      return () => {
        vp.removeEventListener("scroll", sync);
        vp.removeEventListener("pointerdown", nudgeIdle);
        vp.removeEventListener("touchstart", nudgeIdle);
        vp.removeEventListener("wheel", nudgeIdle);
        if (timer) clearInterval(timer);
      };
    });

    return () => mm.revert();
  }, [slideCount]);

  const goToDot = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i];
    const vp = viewportRef.current;
    if (card && vp) vp.scrollTo({ left: card.offsetLeft - (vp.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  };

  return (
    <section className={styles.section} ref={root}>
      <div className={styles.pinWrap} ref={pinWrap}>
        <div className={styles.head}>
          <span className="mono">02 - Seçilmiş işlər</span>
          <p className={styles.headline}>
            Nəticə ilə <span className={styles.ital}>ölçülən</span> layihələr.
          </p>
          <span className={`mono ${styles.hint}`}>Sürüşdür →</span>
        </div>

        <div className={styles.viewport} ref={viewportRef}>
          <div className={styles.track} ref={trackRef}>
            {WORK.map((w, i) => (
              <article
                className={`${styles.card} ${active === i ? styles.isActive : ""}`}
                key={w.n}
              >
                <div
                  className={styles.cardMedia}
                  style={{ backgroundImage: `url(${w.img})` }}
                />
                <div
                  className={styles.cardTint}
                  style={{ background: w.tint }}
                />
                <div className={styles.cardTop}>
                  <span className={styles.cardN}>{w.n}</span>
                  <span className={styles.cardResult}>{w.result}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardName}>{w.name}</h3>
                  <ul className={styles.cardCats}>
                    {(w.cats || []).map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}

            <article
              className={`${styles.card} ${styles.cardEnd} ${
                active === WORK.length ? styles.isActive : ""
              }`}
            >
              <p className={styles.endText}>
                Sənin brendin <span className={styles.ital}>növbəti</span> ola bilər.
              </p>
              <Link to="/elaqe" className={styles.endLink}>
                İş birliyi →
              </Link>
            </article>
          </div>
        </div>

        <div className={styles.dots} aria-hidden="true">
          {Array.from({ length: slideCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${active === i ? styles.dotOn : ""}`}
              onClick={() => goToDot(i)}
              tabIndex={-1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
