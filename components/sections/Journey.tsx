import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import styles from "./Journey.module.css";

export function Journey() {
  const { journey } = site;
  // Newest role first.
  const jobs = [...journey.jobs].reverse();
  return (
    <Section id="journey" bg="yellow" surface="light" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <h2 className={`sectionTitle ${styles.title}`}>{journey.title}</h2>
        <div className={styles.timeline} data-journey>
          {/* The rail fills from the top as you scroll; each stop lights up when the fill reaches it. */}
          <span className={styles.rail} aria-hidden="true">
            <span className={styles.fill} data-journey-fill />
          </span>
          <ol className={styles.list}>
            {jobs.map((job, i) => (
              <li
                key={job.period}
                className={styles.row}
                data-current={i === 0 || undefined}
                data-journey-row
              >
                <div className={styles.when}>
                  <span className={styles.year} aria-hidden="true">
                    {job.period.slice(0, 4)}
                  </span>
                  <span className="label">{job.period}</span>
                </div>
                <span className={styles.stop} data-journey-stop aria-hidden="true" />
                {/* Two layers so the effects never fight: scroll tilts the outer, the pointer tilts the card. */}
                <div className={styles.depth} data-journey-detail>
                  <div className={styles.detail} data-tilt="soft">
                    <h3 className={styles.role}>{job.role}</h3>
                    <span className={styles.company}>{job.company}</span>
                    <p className={styles.summary}>{job.summary}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
