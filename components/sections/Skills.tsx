import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { accentStyle } from "@/components/ui/accent";
import styles from "./Skills.module.css";

export function Skills() {
  const { skills } = site;
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

        <div className={styles.layout} aria-hidden="true">
          <div className={styles.side}>
            {/* Hover or tap a group to light up its skills in the cloud. */}
            <ul className={styles.legend}>
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
          </div>

          <div className={styles.stage}>
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

        <p className={styles.education}>{skills.education}</p>
      </div>
    </Section>
  );
}
