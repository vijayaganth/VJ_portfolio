import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { accentStyle } from "@/components/ui/accent";
import styles from "./Skills.module.css";

export function Skills() {
  const { skills } = site;
  // "Bachelor of Computer Science, University of Madras, Chennai." → degree / place, same words.
  const [degree, ...place] = skills.education.split(", ");
  return (
    <Section id="skills" bg="base" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <h2 className={`sectionTitle ${styles.title}`}>{skills.title}</h2>

        {/* Screen readers get the grouped lists; the cloud and legend below are visual. */}
        <div className={styles.srOnly}>
          {skills.groups.map((group) => (
            <div key={group.name}>
              <h3>{group.name}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          <div className={styles.side}>
            {/* Hover or tap a group to light up its skills in the cloud. */}
            <ul className={styles.legend} aria-hidden="true">
              {skills.groups.map((group) => (
                <li key={group.name}>
                  <button
                    type="button"
                    tabIndex={-1}
                    className={`label ${styles.group}`}
                    style={accentStyle(group.accent)}
                    data-skills-group={group.name}
                  >
                    <span className={styles.dot} />
                    {group.name}
                  </button>
                </li>
              ))}
            </ul>

            <p className={styles.education}>
              <svg className={styles.cap} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4 2 9l10 5 10-5-10-5Z" />
                <path d="M6 11.2V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.8" />
                <path d="M22 9v6" />
              </svg>
              <span>
                <strong className={styles.degree}>{degree}</strong>
                {/* The comma is read aloud but hidden: the place sits on its own line. */}
                <span className={styles.srOnly}>, </span>
                <span className={styles.place}>{place.join(", ")}</span>
              </span>
            </p>
          </div>

          <div className={styles.stage} aria-hidden="true">
            <div className={styles.glow} />
            <ul className={styles.cloud} data-skills-cloud>
              {skills.groups.flatMap((group) =>
                group.items.map((item) => (
                  <li
                    key={item}
                    className={styles.pill}
                    style={accentStyle(group.accent)}
                    data-pill
                    data-group={group.name}
                  >
                    <span>{item}</span>
                  </li>
                )),
              )}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
