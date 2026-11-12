// Screenshots of the running site for visual QA: `pnpm shots [url]`.
// Uses the locally installed Chrome (no browser download). Output: shots/<viewport>[-reduced]-<name>.png
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";

const url = process.argv[2] ?? "http://localhost:3000";
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };
const stops = ["top", "#work", "work-mid", "work-end", "#journey", "#skills", "#contact"];

await mkdir("shots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

for (const [name, viewport] of Object.entries(viewports)) {
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const page = await browser.newPage({ viewport, reducedMotion });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);

    for (const stop of stops) {
      // Scroll through intermediate positions so scroll-triggered tweens fire as a user would see them.
      const target = await page.evaluate((stop) => {
        const work = document.querySelector("#work");
        const spacer = work.closest(".pin-spacer") ?? work;
        const top = (el) => el.getBoundingClientRect().top + scrollY;
        if (stop === "top") return 0;
        if (stop === "work-mid") return top(spacer) + (spacer.offsetHeight - innerHeight) / 2;
        if (stop === "work-end") return top(spacer) + spacer.offsetHeight - innerHeight - 1;
        return top(document.querySelector(stop));
      }, stop);
      await page.evaluate(async (y) => {
        for (let i = 1; i <= 10; i++) {
          window.scrollTo(0, scrollY + (y - scrollY) * (i / 10));
          await new Promise((r) => setTimeout(r, 40));
        }
      }, target);
      await page.waitForTimeout(1500);
      const file = `shots/${name}${reducedMotion === "reduce" ? "-reduced" : ""}-${stop.replace("#", "")}.png`;
      await page.screenshot({ path: file });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    console.log(`${name}${reducedMotion === "reduce" ? " (reduced)" : ""}: overflowX=${overflow} errors=${errors.length ? errors.join(" | ") : "none"}`);
    await page.close();
  }
}
await browser.close();
