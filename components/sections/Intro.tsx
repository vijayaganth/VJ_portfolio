import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import styles from "./Intro.module.css";

export function Intro() {
  return (
    <Section bg="intro">
      <div className={`container ${styles.inner}`}>
        <p className={styles.statement}>
          {site.intro.map((part) =>
            part.highlight ? (
              <span key={part.text} className={styles[part.highlight]}>
                {part.text}
              </span>
            ) : (
              part.text
            ),
          )}
        </p>
      </div>
    </Section>
  );
}
