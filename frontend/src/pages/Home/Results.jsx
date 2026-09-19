import { useEffect, useRef, useState } from "react";
import { useReveal } from "../../lib/useReveal";
import { useTestimonials, useHomeContent } from "../../lib/useContent";
import styles from "./Results.module.css";

const DEFAULT_RESULTS = [
  {
    q: "3 ayda auditoriyamı sıfırdan sistemli şəkildə böyütdüm, indi sorğular özü gəlir.",
    a: "Aygün R.",
    r: "Kurs iştirakçısı",
    screenshot: "",
    video: "",
    beforeAfter: { before: "120 izləyici", after: "6.400 izləyici", metric: "3 ayda" },
  },
  {
    q: "Dərslərdəki addım-addım izahlar sayəsində ilk sifarişlərimi aldım.",
    a: "Kamran T.",
    r: "Kurs iştirakçısı",
    screenshot: "",
    video: "",
    beforeAfter: { before: "0 sifariş", after: "40+ sifariş", metric: "6 həftədə" },
  },
];

function isAudioUrl(url = "") {
  return /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(url);
}

function ScreenshotCarousel({ items }) {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const cards = Array.from(track.children);

    const sync = () => {
      const mid = vp.scrollLeft + vp.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      setActive(best);
    };
    vp.addEventListener("scroll", sync, { passive: true });
    sync();
    return () => vp.removeEventListener("scroll", sync);
  }, [items.length]);

  const goTo = (i) => {
    const track = trackRef.current;
    const vp = viewportRef.current;
    const card = track?.children[i];
    if (card && vp) vp.scrollTo({ left: card.offsetLeft - (vp.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div className={styles.carouselWrap}>
      <div className={styles.viewport} ref={viewportRef}>
        <div className={styles.track} ref={trackRef}>
          {items.map((t, i) => (
            <figure className={styles.shot} key={i}>
              <img src={t.screenshot} alt={`${t.a} rəyi`} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
      {items.length > 1 && (
        <div className={styles.dots} aria-hidden="true">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${active === i ? styles.dotOn : ""}`}
              onClick={() => goTo(i)}
              tabIndex={-1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Results() {
  const ref = useReveal({ stagger: 0.1 });
  const results = useTestimonials(DEFAULT_RESULTS);
  const { resultsEyebrow, resultsHeadline } = useHomeContent({
    resultsEyebrow: "05 - Nəticələr",
    resultsHeadline: "Tələbələrin nəticələri özü danışır.",
  });

  if (!results.length) return null;

  const cases = results.filter((r) => r.beforeAfter && (r.beforeAfter.before || r.beforeAfter.after));
  const screenshots = results.filter((r) => r.screenshot);
  const videos = results.filter((r) => r.video);

  return (
    <section className={`${styles.section} section`} ref={ref}>
      <div className="shell">
        <span className={`mono ${styles.cue} reveal`}>{resultsEyebrow}</span>
        <h2 className={`${styles.headline} reveal`}>{resultsHeadline}</h2>

        {cases.length > 0 && (
          <div className={styles.casesGrid}>
            {cases.map((c, i) => (
              <div className={`${styles.caseCard} reveal`} key={i}>
                <div className={styles.caseBa}>
                  <span className={styles.caseBefore}>{c.beforeAfter.before}</span>
                  <span className={styles.caseArrow}>→</span>
                  <span className={styles.caseAfter}>{c.beforeAfter.after}</span>
                </div>
                <p className={styles.caseMeta}>
                  {c.beforeAfter.metric && <span className="mono">{c.beforeAfter.metric}</span>}
                  <span>{c.a}{c.r ? ` · ${c.r}` : ""}</span>
                </p>
              </div>
            ))}
          </div>
        )}

        {screenshots.length > 0 && (
          <div className={`${styles.block} reveal`}>
            <span className="mono">Skrinşotlar</span>
            <ScreenshotCarousel items={screenshots} />
          </div>
        )}

        {videos.length > 0 && (
          <div className={`${styles.block} reveal`}>
            <span className="mono">Video / Audio Rəylər</span>
            <div className={styles.playersGrid}>
              {videos.map((v, i) => (
                <div className={styles.playerCard} key={i}>
                  {isAudioUrl(v.video) ? (
                    <audio src={v.video} controls />
                  ) : (
                    <video src={v.video} controls playsInline />
                  )}
                  <p className={styles.playerCap}>{v.a}{v.r ? ` · ${v.r}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
