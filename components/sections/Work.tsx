import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { accentStyle } from "@/components/ui/accent";
import styles from "./Work.module.css";

export function Work() {
  const { work } = site;
  return (
    <Section id="work" bg="work">
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <h2 className="sectionTitle">{work.title}</h2>
          <span className={`label ${styles.count}`}>{work.count}</span>
        </div>

        <div className={styles.track} data-work-track>
          {work.projects.map((project) => (
            <article
              key={project.name}
              className={styles.card}
              style={accentStyle(project.accent)}
              data-tilt
            >
              <span className="label">
                {project.index} · {project.status}
              </span>
              <div className={styles.body}>
                <h3 className={styles.name}>{project.name}</h3>
                <p className={styles.description}>{project.description}</p>
                <ul className={styles.tags}>
                  {project.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
