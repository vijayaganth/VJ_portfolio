/** The hero orb's orbit rings, shared by the markup (rings, resting dots) and the motion layer. */
export type Orbit = { tilt: number; rx: number; ry: number };

/** Tilt in degrees; radii as fractions of the orb box (the rings run past the orb's edge). */
export const orbits: Orbit[] = [
  { tilt: -16, rx: 0.68, ry: 0.2 },
  { tilt: 24, rx: 0.6, ry: 0.15 },
];

/** A point on an orbit at angle `a` (radians; 0 = right, π/2 = nearest the viewer), in % of the orb box. */
export function orbitPoint({ tilt, rx, ry }: Orbit, a: number) {
  const x = rx * 100 * Math.cos(a);
  const y = ry * 100 * Math.sin(a);
  const t = (tilt * Math.PI) / 180;
  return { left: 50 + x * Math.cos(t) - y * Math.sin(t), top: 50 + x * Math.sin(t) + y * Math.cos(t) };
}
