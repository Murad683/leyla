import { useState } from "react";
import { useReveal } from "../../lib/useReveal";
import { useHomeContent } from "../../lib/useContent";
import styles from "./FAQ.module.css";

const DEFAULTS = {
  faqEyebrow: "07 - Suallar",
  faqHeadline: "Tez-tez verilən suallar.",
  faqItems: [
    { q: "Dərslər onlayn keçirilir?", a: "Bəli, bütün dərslər onlayn formatda, canlı və ya qeyd olunmuş video kimi keçirilir." },
    { q: "Kursun müddəti nə qədərdir?", a: "Proqramdan asılı olaraq 4-8 həftə arasında dəyişir, ətraflı məlumat kurs bölməsindədir." },
    { q: "Sertifikat verilir?", a: "Bəli, kursu uğurla bitirən iştirakçılara sertifikat təqdim olunur." },
    { q: "Necə qeydiyyatdan keçim?", a: "Aşağıdakı formu doldurmaqla və ya WhatsApp vasitəsilə birbaşa müraciət edə bilərsiniz." },
  ],
};

export default function FAQ() {
  const ref = useReveal({ stagger: 0.08 });
  const { faqEyebrow, faqHeadline, faqItems } = useHomeContent(DEFAULTS);
  const items = faqItems?.length ? faqItems : DEFAULTS.faqItems;
  const [open, setOpen] = useState(0);

  if (!items.length) return null;

  return (
    <section className={`${styles.section} section`} id="suallar" ref={ref}>
      <div className="shell">
        <span className={`mono ${styles.cue} reveal`}>{faqEyebrow}</span>
        <h2 className={`${styles.headline} reveal`}>{faqHeadline}</h2>

        <div className={styles.list}>
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div className={`${styles.item} reveal`} key={i}>
                <button
                  type="button"
                  className={styles.q}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span>{it.q}</span>
                  <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`} aria-hidden="true">+</span>
                </button>
                <div className={`${styles.aWrap} ${isOpen ? styles.aOpen : ""}`}>
                  <p className={styles.a}>{it.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
