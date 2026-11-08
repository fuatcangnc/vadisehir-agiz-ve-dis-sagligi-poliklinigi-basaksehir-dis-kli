// @astrojs/sitemap filter: pages hidden in WuppyCMS (draft, "Sitemap indexing" off or published later) stay out of the sitemap. Keys are Astro route patterns.
// shortcut: a [...rest] parameter matches a locale-shaped segment (en, pt-br) or none, the starter's [...locale]; upgrade if rest routes mean more.
import { existsSync, readFileSync } from "node:fs";

const pageSettings = existsSync("./src/content/page-settings.json") ? JSON.parse(readFileSync("./src/content/page-settings.json", "utf8")) : {};
const hiddenRoutes = Object.entries(pageSettings)
  // A page published later is left out until a build after its date.
  .filter(([, p]) => p.draft || p.seo?.noindex || (p.publishAt && new Date(p.publishAt) > new Date()))
  .map(([route]) => new RegExp(`^${route.replace(/\/$/, "").replace(/(\/)?\[(\.\.\.)?[^\]]+\]/g, (_, slash = "", rest) => (rest ? `(${slash}[a-z]{2}(-[a-z]{2,4})?)?` : `${slash}[^/]+`))}/?$`));

const keep = (page) => !hiddenRoutes.some((r) => r.test(new URL(page).pathname));
export default keep;

/** @astrojs/sitemap options with the WuppyCMS filter joined to the site's own filter: `sitemap(withWuppyFilter(options))`. */
export const withWuppyFilter = (options = {}) => ({ ...options, filter: (page) => keep(page) && (options.filter?.(page) ?? true) });
