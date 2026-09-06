import styles from "./Marquee.module.css";

/**
 * Seamless CSS marquee. `items` repeated twice for the loop.
 * `reverse` flips direction; `speed` is seconds per cycle.
 */
export default function Marquee({ items = [], speed = 26, reverse = false }) {
  const row = (key) => (
    <div className={styles.row} key={key} aria-hidden={key === "b"}>
      {items.map((it, i) => (
        <span className={styles.item} key={i}>
          {it}
          <span className={styles.sep}>✳</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div
        className={`${styles.track} ${reverse ? styles.reverse : ""}`}
        style={{ "--speed": `${speed}s` }}
      >
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
