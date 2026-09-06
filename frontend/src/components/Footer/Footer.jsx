import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/settingsService";
import styles from "./Footer.module.css";

const IG_DEFAULT = "https://www.instagram.com/leiylamammadly/";

export default function Footer() {
  const year = new Date().getFullYear();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 60_000,
  });

  const instagram = settings?.instagramUrl || IG_DEFAULT;
  const igLabel = instagram.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
  const address = settings?.address || "Bakı, Azərbaycan";
  const socials = [
    ["Instagram", settings?.instagramUrl || IG_DEFAULT],
    ["LinkedIn", settings?.linkedinUrl],
    ["Facebook", settings?.facebookUrl],
    ["X", settings?.twitterUrl],
  ].filter(([, url]) => url);

  return (
    <footer className={styles.foot}>
      <div className={`${styles.inner} shell`}>
        <div className={styles.top}>
          <p className={styles.cue}>[ Layihə üçün ]</p>
          <h2 className={styles.big}>
            Sosial hesabını <span className={styles.italic}>sistemə</span> çevirək.
          </h2>
          <a
            href={instagram}
            target="_blank"
            rel="noreferrer"
            className={styles.mail}
          >
            {igLabel} →
          </a>
        </div>

        <div className={styles.grid}>
          <div className={styles.col}>
            <span className="mono">Naviqasiya</span>
            <Link to="/xidmetler">Xidmətlər</Link>
            <Link to="/kurslar">Kurslar</Link>
            <Link to="/portfolio">Portfolio</Link>
            <Link to="/elaqe">Əlaqə</Link>
          </div>
          <div className={styles.col}>
            <span className="mono">Sosial</span>
            {socials.map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </div>
          <div className={styles.col}>
            <span className="mono">Ünvan</span>
            <span>{address}</span>
            <span>GMT+4</span>
          </div>
        </div>

        <div className={styles.base}>
          <span>© {year} Leyla Məmmədli</span>
          <span className="mono">SMM · Strategiya · Kontent · Satış</span>
        </div>
      </div>
    </footer>
  );
}
