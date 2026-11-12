import { site } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    // No data-bg: the footer is too short for the page to scroll its top to mid-viewport, so the scroll
    // colour would never switch back from Contact's teal. It keeps its own base background instead.
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>{site.footer.copyright}</span>
        <a href="#top" className={styles.top}>
          {site.footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
