// Page settings saved by WuppyCMS (Pages → Edit): src/content/page-settings.json, one entry per page,
// keyed by the page's route as Astro names it (`Astro.routePattern`, e.g. "/[...locale]/about").
import { getImage } from 'astro:assets'
import { i18n } from 'astro:config/client'
import { getEntry } from 'astro:content'

export type PageSettings = {
  title?: string
  draft?: boolean
  publishAt?: string
  author?: string
  seo?: { title?: string; description?: string; canonical?: string; noindex?: boolean }
  og?: { title?: string; description?: string; image?: string }
  search?: { exclude?: boolean; title?: string; description?: string; image?: string }
  /** JSON-LD, as written in the CMS. */
  schema?: string
  head?: string
  body?: string
  /** Texts in the other languages of a page that serves several ([...locale]), by locale path. */
  translations?: Record<string, PageText>
}

export type PageText = Pick<PageSettings, 'title'> & {
  seo?: { title?: string; description?: string; canonical?: string }
  og?: { title?: string; description?: string }
  search?: { title?: string; description?: string }
}

/**
 * Settings of the page at `route` in `locale` (Astro.currentLocale). Outside the default language only that
 * language's texts apply, so an untranslated page keeps the layout's own texts in its language rather
 * than the default language's; images, switches, schema and code are shared.
 */
export const pageSettings = async (route: string, locale?: string): Promise<PageSettings> => {
  let p: PageSettings = {}
  try {
    p = ((await getEntry('pageSettings' as never, route)) as { data?: PageSettings } | undefined)?.data ?? {}
  } catch {
    return {}
  }
  if (!locale || !i18n || locale === i18n.defaultLocale) return p
  const t = p.translations?.[locale] ?? {}
  return {
    ...p,
    title: t.title,
    seo: { noindex: p.seo?.noindex, ...t.seo },
    og: { image: p.og?.image, ...t.og },
    search: { exclude: p.search?.exclude, image: p.search?.image, ...t.search },
  }
}

const images = import.meta.glob<ImageMetadata>('/src/**/*.{png,jpg,jpeg,webp,gif,avif}', { import: 'default' })

/** A picked image as a URL: repo images are paths relative to src/content/page-settings.json (or /… in public/). */
export const pageImage = async (url?: string) => {
  if (!url || /^([a-z]+:)?\/\//i.test(url) || url.startsWith('/')) return url
  const load = images[new URL(url, 'file:///src/content/page-settings.json').pathname]
  return load ? (await getImage({ src: await load() })).src : undefined
}

/**
 * Left out of search engines and the sitemap: a draft, a page set to noindex, or one published later.
 * shortcut: a static site can't hide a page by itself; drafts and scheduled pages are still built (rebuild after
 * "publish at" to list them), upgrade with a check in getStaticPaths when a theme needs it.
 */
export const isHidden = (p: PageSettings) => Boolean(p.draft || p.seo?.noindex || (p.publishAt && new Date(p.publishAt) > new Date()))
