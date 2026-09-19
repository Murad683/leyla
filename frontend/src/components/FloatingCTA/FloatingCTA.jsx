import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/settingsService";
import styles from "./FloatingCTA.module.css";

const DEFAULT_NUMBER = "994000000000";
const DEFAULT_TEXT = "Salam, sayt üzərindən yazıram, məlumat almaq istəyirəm.";

export default function FloatingCTA() {
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    staleTime: 60_000,
  });

  const number = (settings?.whatsappNumber || DEFAULT_NUMBER).replace(/[^0-9]/g, "");
  const href = `https://wa.me/${number}?text=${encodeURIComponent(DEFAULT_TEXT)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={styles.btn}
      aria-label="WhatsApp ilə əlaqə"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 3C9.4 3 4 8.4 4 15c0 2.3.6 4.4 1.7 6.3L4 29l7.9-1.6c1.8.9 3.9 1.5 6.1 1.5 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-2 0-3.9-.6-5.5-1.6l-.4-.2-4.6 1 1-4.5-.3-.4C5.2 17.5 4.6 16.3 4.6 15 4.6 9 9.5 4.1 15.5 4.1S26.4 9 26.4 15 21.5 24.8 16 24.8zm5.9-8.4c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-.9 1.1-.3.2-.6.1a7.7 7.7 0 0 1-2.3-1.4 8.6 8.6 0 0 1-1.6-2c-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5s0-.4 0-.5c0-.2-.7-1.7-1-2.3s-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.6 3.6 0 0 0-1.1 2.6c0 1.5 1.1 3 1.3 3.2.2.3 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.6-.3z"
        />
      </svg>
    </a>
  );
}
