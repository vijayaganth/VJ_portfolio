import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero } = site;
  return (
    <Section bg="base" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <header>
          <nav className={styles.nav} aria-label="Primary">
            <a href="#top" className={styles.wordmark}>
              {site.name}
            </a>
            <div className={styles.links}>
              {site.nav.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
            <a href={`mailto:${site.email}`} className={styles.cta}>
              {site.cta}
            </a>
          </nav>
        </header>

        <div className={styles.orb} data-orb-slot aria-hidden="true" />

        <div className={styles.content}>
          <div className={`label ${styles.eyebrow}`} data-hero-reveal>{hero.eyebrow}</div>
          <h1 className={styles.title} data-split="lines">
            {hero.title}
          </h1>
          <p className={styles.body} data-hero-reveal>{hero.body}</p>
          <div className={`label ${styles.cue}`} data-hero-reveal>
            <span className={styles.cueLine} />
            <span>{hero.cue}</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
