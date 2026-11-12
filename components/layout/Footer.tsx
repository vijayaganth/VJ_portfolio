import { site } from "@/content/site";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer data-bg="base" className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>{site.footer.copyright}</span>
        <a href="#top" className={styles.top}>
          {site.footer.backToTop}
        </a>
      </div>
    </footer>
  );
}
