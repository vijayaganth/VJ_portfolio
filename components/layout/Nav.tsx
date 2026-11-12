"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/content/site";
import styles from "./Nav.module.css";

/**
 * Fixed header over the whole page. Transparent on the hero, a dark glass bar once the page scrolls.
 * Desktop: the links sit in a pill with an indicator that follows the hover and rests on the section
 * in view. Phones: a menu button opens the links in a panel.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState<CSSProperties>({ opacity: 0 });
  const pill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // The section crossing the middle of the viewport is the active one.
    const sections = site.nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
          else setActive((current) => (current === `#${e.target.id}` ? null : current));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  // The indicator sits under the hovered link, else the active one, else fades out.
  useEffect(() => {
    const target = hover ?? active;
    const link = target ? pill.current?.querySelector<HTMLElement>(`[href="${target}"]`) : null;
    setIndicator(link ? { opacity: 1, left: link.offsetLeft, width: link.offsetWidth } : (prev) => ({ ...prev, opacity: 0 }));
  }, [hover, active]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.header} data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <nav className={`container ${styles.nav}`} aria-label="Primary">
        <a href="#top" className={styles.wordmark} aria-label={site.name} onClick={() => setOpen(false)}>
          <span className={styles.mark} aria-hidden="true" />
          <span className={styles.name} aria-hidden="true">
            {[...site.name].map((letter, i) => (
              <span key={i} className={styles.letter} style={{ "--i": i } as CSSProperties}>
                {letter}
              </span>
            ))}
          </span>
        </a>

        <div className={styles.pill} ref={pill} onPointerLeave={() => setHover(null)}>
          <span className={styles.indicator} style={indicator} aria-hidden="true" />
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.link}
              aria-current={active === item.href ? "location" : undefined}
              onPointerEnter={() => setHover(item.href)}
              onFocus={() => setHover(item.href)}
              onBlur={() => setHover(null)}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className={styles.end}>
          <a href={`mailto:${site.email}`} className={styles.cta}>
            {site.cta}
          </a>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="nav-panel"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={styles.bars} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Phones only: the links, full size. */}
      <div id="nav-panel" className={styles.panel} hidden={!open}>
        <div className="container">
          {site.nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.panelLink}
              aria-current={active === item.href ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className={styles.panelIndex} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
