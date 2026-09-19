import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useReveal } from "../../lib/useReveal";
import { useVideoLessons, useLeadMagnet, useHomeContent } from "../../lib/useContent";
import { getSettings } from "../../services/settingsService";
import VideoModal from "../../components/VideoModal/VideoModal";
import styles from "./FreeLessons.module.css";

const DEFAULT_LESSONS = [
  {
    title: "Sıfırdan Sistemli Başlanğıc",
    badge: "HD İzah",
    audience: "Bütün səviyyələr üçün",
    desc: "Auditoriya, mesaj və ilk 30 gün üçün addım-addım plan.",
    youtubeId: "dQw4w9WgXcQ",
    thumb: "",
  },
  {
    title: "Kontent Təqvimi Necə Qurulur",
    badge: "Praktiki",
    audience: "Başlayanlar üçün",
    desc: "Həftəlik kontent planlaması və ritmi saxlamağın yolları.",
    youtubeId: "dQw4w9WgXcQ",
    thumb: "",
  },
  {
    title: "Auditoriyanı Necə Oxumaq Olar",
    badge: "Strategiya",
    audience: "Orta səviyyə üçün",
    desc: "Hədəf auditoriyanı tanımaq və mesajını ona uyğunlaşdırmaq.",
    youtubeId: "dQw4w9WgXcQ",
    thumb: "",
  },
];

export default function FreeLessons() {
  const ref = useReveal({ stagger: 0.08 });
  const lessons = useVideoLessons(DEFAULT_LESSONS);
  const leadMagnet = useLeadMagnet({ title: "", description: "", fileUrl: "" });
  const { freeEyebrow, freeHeadline } = useHomeContent({
    freeEyebrow: "04 - Pulsuz Öyrənmə",
    freeHeadline: "İzləməyə başla, sistemi indi qur.",
  });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: getSettings, staleTime: 60_000 });
  const [openVideo, setOpenVideo] = useState(null);

  if (!lessons.length) return null;

  return (
    <section className={`${styles.section} section`} id="pulsuz-dersler" ref={ref}>
      <div className="shell">
        <span className={`mono ${styles.cue} reveal`}>{freeEyebrow}</span>
        <h2 className={`${styles.headline} reveal`}>{freeHeadline}</h2>

        <div className={styles.grid}>
          {lessons.map((l, i) => (
            <article
              className={`${styles.card} reveal`}
              key={i}
              role="button"
              tabIndex={0}
              onClick={() => setOpenVideo(l.youtubeId)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpenVideo(l.youtubeId)}
            >
              <div className={styles.media} style={l.thumb ? { backgroundImage: `url(${l.thumb})` } : undefined}>
                <span className={styles.playIcon} aria-hidden="true">▶</span>
                <div className={styles.badges}>
                  {l.badge && <span className={styles.badge}>{l.badge}</span>}
                  {l.audience && <span className={styles.badgeGhost}>{l.audience}</span>}
                </div>
              </div>
              <h3 className={styles.cardTitle}>{l.title}</h3>
              <p className={styles.cardDesc}>{l.desc}</p>
              <div className={styles.actions}>
                <span className={styles.watchBtn}>Saytda İzlə</span>
                <a
                  href={`https://www.youtube.com/watch?v=${l.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.ytLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  YouTube-da aç →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.bottomRow}>
          {settings?.youtubeUrl && (
            <a href={settings.youtubeUrl} target="_blank" rel="noreferrer" className={styles.playlistBtn}>
              Tam Pleylisti Aç →
            </a>
          )}
          {leadMagnet.fileUrl && (
            <a href={leadMagnet.fileUrl} target="_blank" rel="noreferrer" className={styles.leadBtn}>
              {leadMagnet.title || "Pulsuz Materialı Yüklə"} ↓
            </a>
          )}
        </div>
      </div>

      {openVideo && <VideoModal youtubeId={openVideo} onClose={() => setOpenVideo(null)} />}
    </section>
  );
}
