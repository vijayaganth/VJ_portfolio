import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import styles from "./Journey.module.css";

export function Journey() {
  const { journey } = site;
  return (
    <Section id="journey" bg="yellow" surface="light">
      <div className={`container ${styles.inner}`}>
        <h2 className={`sectionTitle ${styles.title}`}>{journey.title}</h2>
        <ol className={styles.list}>
          {journey.jobs.map((job) => (
            <li key={job.period} className={styles.row}>
              <span className={styles.line} data-journey-line aria-hidden="true" />
              <span className="label">{job.period}</span>
              <div className={styles.detail}>
                <h3 className={styles.role}>{job.role}</h3>
                <span className={styles.company}>{job.company}</span>
                <p className={styles.summary}>{job.summary}</p>
              </div>
            </li>
          ))}
        </ol>
        <span className={styles.line} data-journey-line aria-hidden="true" />
      </div>
    </Section>
  );
}
