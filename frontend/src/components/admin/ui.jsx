import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import styles from "./ui.module.css";

/* ------------------------------------------------------------------ *
 *  Shared admin UI: toast notifications + a themed confirm dialog.
 *  Wrap the admin subtree once in <AdminUIProvider>.
 * ------------------------------------------------------------------ */

const ToastCtx = createContext(() => {});
const ConfirmCtx = createContext(async () => false);

export function AdminUIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null); // { title, body, confirmLabel, tone, resolve }
  const idRef = useRef(0);

  const push = useCallback((message, tone = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  const toast = useRef({
    success: (m) => push(m, "success"),
    error: (m) => push(m, "error"),
    info: (m) => push(m, "info"),
  }).current;

  const confirm = useCallback(
    (opts = {}) =>
      new Promise((resolve) => {
        setDialog({
          title: opts.title || "Əminsiniz?",
          body: opts.body || "",
          confirmLabel: opts.confirmLabel || "Sil",
          tone: opts.tone || "danger",
          resolve,
        });
      }),
    []
  );

  const close = (val) => {
    dialog?.resolve(val);
    setDialog(null);
  };

  return (
    <ToastCtx.Provider value={toast}>
      <ConfirmCtx.Provider value={confirm}>
        {children}

        <div className={styles.toastWrap}>
          {toasts.map((t) => (
            <div key={t.id} className={`${styles.toast} ${styles[t.tone]}`}>
              {t.message}
            </div>
          ))}
        </div>

        {dialog && (
          <div className={styles.overlay} onClick={() => close(false)}>
            <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
              <h3 className={styles.dialogTitle}>{dialog.title}</h3>
              {dialog.body && <p className={styles.dialogBody}>{dialog.body}</p>}
              <div className={styles.dialogActions}>
                <button className={styles.btnGhost} onClick={() => close(false)}>
                  Ləğv et
                </button>
                <button
                  className={`${styles.btnSolid} ${styles[dialog.tone]}`}
                  onClick={() => close(true)}
                  autoFocus
                >
                  {dialog.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        )}
      </ConfirmCtx.Provider>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
export const useConfirm = () => useContext(ConfirmCtx);

/* ------------------------------------------------------------------ *
 *  useDragReorder — native HTML5 drag-and-drop list reordering.
 *
 *  const dnd = useDragReorder(items, (reordered) => persist(reordered));
 *  <li {...dnd.row(i)} className={dnd.dragging === i ? "isDragging" : ""}>
 * ------------------------------------------------------------------ */
export function useDragReorder(items, onReorder) {
  const from = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  const row = (index) => ({
    draggable: true,
    onDragStart: (e) => {
      from.current = index;
      setDragging(index);
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", String(index));
      } catch {
        /* some browsers require a payload */
      }
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (over !== index) setOver(index);
    },
    onDrop: (e) => {
      e.preventDefault();
      const src = from.current;
      const dst = index;
      from.current = null;
      setDragging(null);
      setOver(null);
      if (src == null || src === dst) return;
      const next = items.slice();
      const [moved] = next.splice(src, 1);
      next.splice(dst, 0, moved);
      onReorder(next);
    },
    onDragEnd: () => {
      from.current = null;
      setDragging(null);
      setOver(null);
    },
  });

  return { row, dragging, over };
}
