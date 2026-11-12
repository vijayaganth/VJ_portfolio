import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { accentStyle } from "@/components/ui/accent";
import styles from "./Skills.module.css";

export function Skills() {
  const { skills } = site;
  return (
    <Section id="skills" bg="base">
      <div className={`container ${styles.inner}`}>
        <h2 className={`sectionTitle ${styles.title}`}>{skills.title}</h2>
        <div>
          {skills.groups.map((group) => (
            <div key={group.name} className={styles.row}>
              <h3 className={`label ${styles.group}`}>{group.name}</h3>
              <ul className={styles.pills} style={accentStyle(group.accent)}>
                {group.items.map((item) => (
                  <li key={item} className={styles.pill} data-pill>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <p className={styles.education}>{skills.education}</p>
        </div>
      </div>
    </Section>
  );
}
