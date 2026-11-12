import Image from "next/image";
import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { accentStyle } from "@/components/ui/accent";
import styles from "./Work.module.css";

export function Work() {
  const { work } = site;
  return (
    <Section id="work" bg="work" className={styles.section}>
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
              <div className={styles.layout}>
              <div className={styles.info}>
                <div className={styles.meta}>
                  <span className={styles.index} aria-hidden="true">
                    {project.index}
                  </span>
                  <span className={`label ${styles.status}`}>
                    <span
                      className={styles.dot}
                      data-live={project.status === "In development" || undefined}
                      aria-hidden="true"
                    />
                    <span className={styles.srOnly}>{project.index} · </span>
                    {project.status}
                  </span>
                </div>

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
              </div>

              <div className={styles.visual}>
                <div className={styles.glow} aria-hidden="true" />
                <figure className={styles.frame} data-frame={project.shot.frame} data-work-shot>
                  {project.shot.frame === "browser" && (
                    <span className={styles.bar} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                  <Image
                    src={project.shot.src}
                    alt={project.shot.alt}
                    placeholder="blur"
                    sizes={project.shot.frame === "phone" ? "(max-width: 760px) 60vw, 340px" : "(max-width: 760px) 110vw, 680px"}
                    className={styles.shot}
                  />
                </figure>
              </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
