import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap } from "../../lib/gsap";
import { useReveal } from "../../lib/useReveal";
import FlowGradient from "../../components/FlowField/FlowGradient";
import { submitContact } from "../../services/contactService";
import styles from "./Contact.module.css";

const IG = "https://www.instagram.com/leiylamammadly/";

const SERVICES = [
  "Strategiya",
  "Kontent",
  "Şəxsi brend",
  "Satış",
  "Kurs",
  "Digər",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Hero() {
  const root = useRef(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = root.current.querySelectorAll(`.${styles.hWord}`);
    if (reduce) {
      gsap.set(words, { opacity: 1, y: 0, filter: "blur(0)" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.from(words, {
        opacity: 0,
        y: 24,
        filter: "blur(12px)",
        duration: 1,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.15,
      });
      gsap.from(`.${styles.heroSub}`, {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.5,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const words = "Bir mesaj - sistemli başlanğıc.".split(" ");
  return (
    <header className={styles.hero} ref={root}>
      <FlowGradient />
      <div className={`${styles.heroInner} shell`}>
        <span className="mono">Əlaqə</span>
        <h1 className={styles.heroTitle}>
          {words.map((w, i) => (
            <span className={styles.hMask} key={i}>
              <span
                className={`${styles.hWord} ${
                  w === "sistemli" ? styles.accent : ""
                }`}
              >
                {w}&nbsp;
              </span>
            </span>
          ))}
        </h1>
        <p className={`${styles.heroSub} lead`}>
          Layihə, iş birliyi və ya kurs - qısa formu doldur, 1-2 iş günü ərzində
          cavab verək.
        </p>
      </div>
    </header>
  );
}

const EMPTY = { name: "", email: "", phone: "", service: "", message: "" };

function Form() {
  const ref = useReveal({ stagger: 0.06 });
  const [params] = useSearchParams();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | ok | error
  const [serverMsg, setServerMsg] = useState("");
  const honeypot = useRef(null);

  // Prefill from ?kurs=... or ?xidmet=...
  useEffect(() => {
    const kurs = params.get("kurs");
    const xidmet = params.get("xidmet");
    if (kurs) {
      setForm((f) => ({
        ...f,
        service: "Kurs",
        message: `«${kurs}» kursu ilə maraqlanıram. `,
      }));
    } else if (xidmet) {
      const match = SERVICES.find(
        (s) => s.toLowerCase() === xidmet.toLowerCase()
      );
      setForm((f) => ({
        ...f,
        service: match || "Digər",
        message: `${xidmet} xidməti ilə bağlı danışmaq istəyirəm. `,
      }));
    }
  }, [params]);

  const validate = useMemo(
    () => (f) => {
      const e = {};
      if (f.name.trim().length < 2) e.name = "Ad ən azı 2 hərf olmalıdır.";
      if (!EMAIL_RE.test(f.email.trim())) e.email = "Düzgün e-poçt daxil edin.";
      if (f.message.trim().length < 10)
        e.message = "Mesaj ən azı 10 simvol olmalıdır.";
      return e;
    },
    []
  );

  const setField = (k) => (ev) => {
    const v = ev.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === "sending") return;
    if (honeypot.current && honeypot.current.value) return; // bot

    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus("sending");
    setServerMsg("");
    try {
      await submitContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        service: form.service || undefined,
        subject: form.service ? `${form.service} - sayt formu` : "Sayt formu",
        message: form.message.trim(),
      });
      setStatus("ok");
      setForm(EMPTY);
    } catch (err) {
      // Field-level errors from the API (422)
      if (err && Array.isArray(err.errors)) {
        const mapped = {};
        err.errors.forEach((x) => {
          mapped[x.field] = x.message;
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
        setStatus("idle");
        return;
      }
      setStatus("error");
      setServerMsg(
        "Göndərmək alınmadı. Bir az sonra yenidən yoxlayın və ya birbaşa yazın:"
      );
    }
  };

  if (status === "ok") {
    return (
      <section className={styles.form} ref={ref}>
        <div className="shell">
          <div className={`${styles.done} reveal`}>
            <span className="mono">Göndərildi</span>
            <h2 className={styles.doneTitle}>Mesaj bizə çatdı.</h2>
            <p className={styles.doneText}>
              1-2 iş günü ərzində e-poçt və ya telefonla əlaqə saxlayacağıq.
              Təcili haldırsa, birbaşa Instagram-dan yaza bilərsən.
            </p>
            <div className={styles.doneRow}>
              <a href={IG} target="_blank" rel="noreferrer" className={styles.ghost}>
                Instagram-dan yaz →
              </a>
              <button
                type="button"
                className={styles.ghost}
                onClick={() => setStatus("idle")}
              >
                Yeni mesaj
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.form} ref={ref}>
      <div className="shell">
        <div className={styles.grid}>
          <form className={styles.fields} onSubmit={onSubmit} noValidate>
            <div className={`${styles.field} reveal`}>
              <label htmlFor="c-name">Ad</label>
              <input
                id="c-name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={setField("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && <span className={styles.err}>{errors.name}</span>}
            </div>

            <div className={`${styles.row} reveal`}>
              <div className={styles.field}>
                <label htmlFor="c-email">E-poçt</label>
                <input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={setField("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <span className={styles.err}>{errors.email}</span>
                )}
              </div>
              <div className={styles.field}>
                <label htmlFor="c-phone">
                  Telefon <span className={styles.opt}>- istəyə bağlı</span>
                </label>
                <input
                  id="c-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={setField("phone")}
                />
              </div>
            </div>

            <div className={`${styles.field} reveal`}>
              <label htmlFor="c-service">Mövzu</label>
              <select
                id="c-service"
                value={form.service}
                onChange={setField("service")}
              >
                <option value="">Seçin...</option>
                {SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles.field} reveal`}>
              <label htmlFor="c-message">Mesaj</label>
              <textarea
                id="c-message"
                rows={5}
                value={form.message}
                onChange={setField("message")}
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <span className={styles.err}>{errors.message}</span>
              )}
            </div>

            {/* honeypot - hidden from users, catches bots */}
            <input
              ref={honeypot}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className={styles.hp}
            />

            <div className={`${styles.submitRow} reveal`}>
              <button
                type="submit"
                className={styles.submit}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Göndərilir..." : "Göndər"}
              </button>
              {status === "error" && (
                <p className={styles.formErr} role="alert">
                  {serverMsg}{" "}
                  <a href={IG} target="_blank" rel="noreferrer">
                    Instagram-dan yaz →
                  </a>
                </p>
              )}
            </div>
          </form>

          <aside className={styles.side}>
            <div className={`${styles.sideBlock} reveal`}>
              <span className="mono">Birbaşa</span>
              <a href={IG} target="_blank" rel="noreferrer">
                instagram.com/leiylamammadly →
              </a>
            </div>
            <div className={`${styles.sideBlock} reveal`}>
              <span className="mono">Yer</span>
              <p>Bakı, Azərbaycan</p>
              <p className={styles.muted}>GMT+4</p>
            </div>
            <div className={`${styles.sideBlock} reveal`}>
              <span className="mono">Cavab vaxtı</span>
              <p>1-2 iş günü</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  useEffect(() => {
    document.title = "Əlaqə - Leyla Məmmədli";
  }, []);
  return (
    <div className={styles.page}>
      <Hero />
      <Form />
    </div>
  );
}
