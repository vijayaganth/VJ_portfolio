import type { ReactNode } from "react";

type Props = {
  id?: string;
  /** Background token name, e.g. "base" → var(--c-base). Read by the scroll colour motion. */
  bg: "base" | "intro" | "work" | "yellow" | "teal";
  /** Light surfaces use ink text and ink focus rings. */
  surface?: "dark" | "light";
  className?: string;
  children: ReactNode;
};

export function Section({ id, bg, surface = "dark", className, children }: Props) {
  return (
    <section
      id={id}
      data-bg={bg}
      data-surface={surface}
      className={className}
      style={{
        background: `var(--c-${bg})`,
        color: surface === "light" ? "var(--c-ink)" : undefined,
      }}
    >
      {children}
    </section>
  );
}
