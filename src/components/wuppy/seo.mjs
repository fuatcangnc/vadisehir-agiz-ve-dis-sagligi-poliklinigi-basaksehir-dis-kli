// Astro integration: one source per SEO tag. A layout may write its own <title>, description, canonical, robots and
// share tags (by hand, astro-seo or any other component) next to <PageSeo />. PageSeo marks its tags with two
// <meta name="wuppy-seo"> markers; a tag PageSeo writes replaces the layout's tags of that kind (all og:image* of
// the layout go when PageSeo has an og:image), anything PageSeo doesn't write stays the layout's, galleries included.
// Runs as middleware, so it covers built (static) pages, server-rendered ones and astro dev alike.

const UNIQUE = /^(title|canonical|description|robots|author|og:(title|description|url|type|image|site_name|locale)|twitter:(card|title|description|image))$/;
const TAG = /<title\b[^>]*>[\s\S]*?<\/title>|<(?:meta|link)\b(?:[^>"']|"[^"]*"|'[^']*')*>|<(script|style|template|noscript)\b[\s\S]*?<\/\1>/gi;
const MARK = /^<meta\s+name=["']?wuppy-seo["']?\s+content=["']?(start|end)["']?\s*\/?>$/i;

/** og:image:alt, og:image:width … belong with og:image (and twitter:image:alt with twitter:image). */
const groupOf = (tag) => {
  if (/^<title/i.test(tag)) return "title";
  if (/^<link/i.test(tag)) return /\srel\s*=\s*["']?canonical["'\s>/]/i.test(tag) ? "canonical" : undefined;
  if (!/^<meta/i.test(tag)) return undefined; // script/style/… bodies are skipped whole
  const key = tag.match(/\s(?:name|property)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)?.slice(1).find(Boolean)?.toLowerCase();
  const group = key?.replace(/^(og:image|twitter:image)(:.*)?$/, "$1");
  return group && UNIQUE.test(group) ? group : undefined;
};

/** Drops the layout's SEO tags that PageSeo (between the markers) also writes, and the markers. */
export const dedupeHead = (html) => {
  const end = html.search(/<\/head>/i);
  if (end < 0) return html;
  const head = html.slice(0, end);
  const tags = [...head.matchAll(TAG)].map((m) => ({ at: m.index, text: m[0], mark: m[0].match(MARK)?.[1], group: groupOf(m[0]) }));
  const start = tags.findIndex((t) => t.mark === "start");
  const stop = tags.findIndex((t, i) => i > start && t.mark === "end");
  if (start < 0 || stop < 0) return html;
  const ours = new Set(tags.slice(start + 1, stop).map((t) => t.group).filter(Boolean));
  const drop = tags.filter((t, i) => t.mark || (ours.has(t.group) && (i < start || i > stop)));
  let out = "";
  let at = 0;
  for (const t of drop) {
    out += head.slice(at, t.at);
    at = t.at + t.text.length;
  }
  return out + head.slice(at) + html.slice(end);
};

/** @type {import('astro').MiddlewareHandler} */
export const onRequest = async (_, next) => {
  const response = await next();
  if (!response.headers.get("content-type")?.includes("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(dedupeHead(await response.text()), { status: response.status, statusText: response.statusText, headers });
};

/** @returns {import('astro').AstroIntegration} */
export default () => ({
  name: "wuppy-seo",
  hooks: { "astro:config:setup": ({ addMiddleware }) => addMiddleware({ entrypoint: new URL(import.meta.url), order: "pre" }) },
});
