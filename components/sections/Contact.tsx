import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import styles from "./Contact.module.css";

export function Contact() {
  const { contact } = site;
  return (
    <Section id="contact" bg="teal" surface="light">
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>{contact.title}</h2>
        <div className={styles.links}>
          <a href={`mailto:${site.email}`} className={styles.mail}>
            {site.email}
          </a>
          <a
            href={site.linkedin}
            className={styles.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            {contact.linkedinLabel}
          </a>
        </div>
      </div>
    </Section>
  );
}
