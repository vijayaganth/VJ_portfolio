import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import styles from "./Contact.module.css";

function Arrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Contact() {
  const { contact } = site;
  // "Got a big idea? Let's build it." → the question, then the answer on an ink highlight.
  const [question, answer] = contact.title.split("? ");
  // Break the address before "@" when it has to wrap, never mid-name.
  const [user, domain] = site.email.split("@");

  return (
    <Section id="contact" bg="teal" surface="light" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title} data-contact-title>
          <span className={styles.line}>{`${question}?`}</span>{" "}
          <span className={styles.line}>
            <span className={styles.answer}>
              <span className={styles.mark} data-contact-mark aria-hidden="true" />
              <span className={styles.answerText}>{answer}</span>
            </span>
          </span>
        </h2>

        <div className={styles.actions} data-contact-actions>
          <a href={`mailto:${site.email}`} className={styles.mail} data-magnetic>
            <span className={styles.address}>
              {user}
              <wbr />@{domain}
            </span>
            <span className={styles.icon}>
              <Arrow />
            </span>
          </a>
          <a
            href={site.linkedin}
            className={styles.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
          >
            {contact.linkedinLabel}
            <span className={styles.icon}>
              <Arrow />
            </span>
          </a>
        </div>
      </div>

      {/* The headline runs on as a band into the footer. Decorative: it repeats the H2. */}
      <div className={styles.band} aria-hidden="true">
        <div className={styles.track} data-contact-marquee>
          {[0, 1].map((copy) => (
            <span key={copy} className={styles.run}>
              {[0, 1, 2].map((i) => (
                <span key={i} className={styles.phrase}>
                  {contact.title}
                  <span className={styles.sep} />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
