import { site } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { OrbSlot } from "@/components/orb/OrbSlot";
import { orbits, orbitPoint } from "./orbit";
import styles from "./Hero.module.css";

function Orbit({ half }: { half: "back" | "front" }) {
  // viewBox is 0..100 around the orb centre at 50,50; the rings run past the orb's edge.
  return (
    <svg className={styles.orbits} viewBox="0 0 100 100" data-orbit-layer={half} aria-hidden="true">
      {orbits.map(({ tilt, rx, ry }, i) => {
        const x = rx * 100;
        const y = ry * 100;
        // Far half: the upper arc (left → right over the top). Near half: the lower arc.
        const d =
          half === "back"
            ? `M ${50 - x} 50 A ${x} ${y} 0 0 1 ${50 + x} 50`
            : `M ${50 - x} 50 A ${x} ${y} 0 0 0 ${50 + x} 50`;
        return (
          <g key={i} transform={`rotate(${tilt} 50 50)`}>
            <path className={styles.ring} d={d} />
          </g>
        );
      })}
    </svg>
  );
}

export function Hero() {
  const { hero } = site;
  // "Frontend lead turned AI product engineer." → the new role carries the gradient.
  const [before, role] = hero.title.split(/(?<=turned) /);

  return (
    <Section bg="base" className={styles.hero}>
      <div className={styles.grid} aria-hidden="true" />

      {/* The nav is fixed above the page (components/layout/Nav); the hero starts below it. */}
      <div className={`container ${styles.inner}`}>
        {/* Orb with orbit rings; dots travel the rings and pass behind and in front of it. */}
        <div className={styles.orbWrap} data-hero-orb>
          <Orbit half="back" />
          <OrbSlot className={styles.orb} />
          <Orbit half="front" />
          {/* The motion layer moves each dot along its ring and swaps it behind or in front of the orb. */}
          {orbits.map((orbit, i) => {
            // Resting place (no JS, reduced motion): on the near half of its ring.
            const { left, top } = orbitPoint(orbit, i ? 2.2 : 0.9);
            return (
              <span
                key={i}
                className={styles.dot}
                data-orbit-dot={i}
                data-accent={i ? "yellow" : "teal"}
                style={{ left: `${left}%`, top: `${top}%` }}
                aria-hidden="true"
              />
            );
          })}
        </div>

        <div className={styles.content} data-hero-content>
          <div className={styles.eyebrowRow} data-hero-reveal>
            <span className={`label ${styles.eyebrow}`}>
              <span className={styles.pulse} aria-hidden="true" />
              {hero.eyebrow}
            </span>
          </div>
          <h1 className={styles.title} data-split="lines">
            {before} <span className={styles.role}>{role}</span>
          </h1>
          <p className={styles.body} data-hero-reveal>{hero.body}</p>
          <a href="#work" className={`label ${styles.cue}`} data-hero-reveal>
            <span className={styles.cueLine} aria-hidden="true" />
            <span>{hero.cue}</span>
          </a>
        </div>
      </div>
    </Section>
  );
}
