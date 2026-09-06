import styles from "./GridOverlay.module.css";

/** Fixed 12-col hairline grid + corner crosshairs - the "blueprint" layer. */
export default function GridOverlay() {
  return (
    <>
      <div className="gridOverlay" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className={styles.marks} aria-hidden="true">
        <i className={styles.tl} />
        <i className={styles.tr} />
        <i className={styles.bl} />
        <i className={styles.br} />
      </div>
    </>
  );
}
