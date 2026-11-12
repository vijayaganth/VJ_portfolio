import { Fragment } from "react";
import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import styles from "./Intro.module.css";

/** Each word in its own span so the motion layer can light the statement up word by word. */
function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <Fragment key={i}>
      {word && (
        <span className={styles.word} data-intro-word>
          {word}
        </span>
      )}
      {i < words.length - 1 && " "}
    </Fragment>
  ));
}

export function Intro() {
  return (
    <Section bg="intro" className={styles.section}>
      <div className={styles.glow} aria-hidden="true">
        <span className={styles.blobMagenta} data-intro-blob />
        <span className={styles.blobBlue} data-intro-blob />
      </div>

      <div className={`container ${styles.inner}`}>
        {/* A gradient rule beside the statement that fills as it is read. */}
        <span className={styles.rule} aria-hidden="true">
          <span className={styles.ruleFill} data-intro-rule />
        </span>

        <p className={styles.statement} data-intro>
          {site.intro.map((part) =>
            part.highlight ? (
              <span key={part.text} className={`${styles.hl} ${styles[part.highlight]}`}>
                <span className={styles.marker} data-intro-marker aria-hidden="true" />
                <Words text={part.text} />
              </span>
            ) : (
              <Words key={part.text} text={part.text} />
            ),
          )}
        </p>
      </div>
    </Section>
  );
}
