import { defineCollection } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'

// Translations live side by side: `site/<locale>.json`, `menus/<locale>.json`, `services/<locale>/<slug>.md`,
// `posts/<locale>/<slug>.md`. A translation keeps the same file name in every locale.

/** Every text on the site that isn't a page of its own, one file per language. */
const site = defineCollection({
  loader: glob({ base: './src/content/site', pattern: '*.json' }),
  schema: z.object({
    nav: z.object({
      home: z.string(),
      company: z.string(),
      about: z.string(),
      services: z.string(),
      blog: z.string(),
      contact: z.string(),
    }),
    cta: z.string(),
    topbar: z.string(),
    whatsapp: z.object({ message: z.string(), online: z.string(), help: z.string(), ask: z.string() }),
    hero: z.object({
      eyebrow: z.string(),
      title: z.string(),
      accent: z.string(),
      text: z.string(),
      primary: z.string(),
      rating: z.string(),
      panel: z.string(),
      status: z.string(),
    }),
    highlights: z.array(z.string()),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })),
    services: z.object({
      badge: z.string(),
      title: z.string(),
      accent: z.string(),
      intro: z.string(),
      more: z.string(),
      all: z.string(),
      help: z.string(),
      details: z.string(),
      count: z.string(),
    }),
    pillars: z.object({
      badge: z.string(),
      title: z.string(),
      accent: z.string(),
      text: z.string(),
      view: z.string(),
      items: z.array(z.object({
        title: z.string(),
        subtitle: z.string(),
        tag: z.string(),
        text: z.string(),
        list: z.string(),
        bullets: z.array(z.string()),
        action: z.string(),
      })),
    }),
    why: z.object({
      badge: z.string(),
      title: z.string(),
      text: z.string(),
      features: z.array(z.object({ title: z.string(), text: z.string() })),
      stats: z.array(z.object({ value: z.number(), suffix: z.string(), label: z.string(), text: z.string() })),
    }),
    process: z.object({
      badge: z.string(),
      title: z.string(),
      text: z.string(),
      kicker: z.string(),
      center: z.string(),
      action: z.string(),
      steps: z.array(z.object({ title: z.string(), text: z.string() })),
    }),
    testimonials: z.object({
      badge: z.string(),
      title: z.string(),
      accent: z.string(),
      text: z.string(),
      see: z.string(),
      source: z.string(),
      verified: z.string(),
      prev: z.string(),
      next: z.string(),
      items: z.array(z.object({ name: z.string(), role: z.string(), project: z.string(), quote: z.string(), rating: z.number().optional() })),
    }),
    quote: z.object({
      badge: z.string(),
      title: z.string(),
      accent: z.string(),
      text: z.string(),
      steps: z.array(z.object({ title: z.string(), text: z.string() })),
      hotline: z.string(),
    }),
    form: z.object({
      eyebrow: z.string(),
      title: z.string(),
      text: z.string(),
      name: z.string(),
      namePlaceholder: z.string(),
      phone: z.string(),
      company: z.string(),
      companyPlaceholder: z.string(),
      service: z.string(),
      choose: z.string(),
      details: z.string(),
      detailsPlaceholder: z.string(),
      consent: z.string(),
      send: z.string(),
      safe: z.string(),
      reply: z.string(),
      sent: z.string(),
      heading: z.string(),
    }),
    blog: z.object({
      badge: z.string(),
      title: z.string(),
      intro: z.string(),
      readMore: z.string(),
      all: z.string(),
      related: z.string(),
      summary: z.string(),
      consultTitle: z.string(),
      consultText: z.string(),
      consultAction: z.string(),
    }),
    faq: z.object({
      badge: z.string(),
      title: z.string(),
      text: z.string(),
      items: z.array(z.object({ question: z.string(), answer: z.string() })),
      bannerTitle: z.string(),
      bannerAccent: z.string(),
      bannerText: z.string(),
    }),
    ctaBanner: z.object({ eyebrow: z.string(), title: z.string(), text: z.string(), help: z.string(), call: z.string() }),
    about: z.object({
      eyebrow: z.string(),
      title: z.string(),
      intro: z.string(),
      kicker: z.string(),
      heading: z.string(),
      body: z.string(),
      principles: z.string(),
      principlesTitle: z.string(),
      band: z.string(),
    }),
    service: z.object({
      scope: z.string(),
      title: z.string(),
      body: z.string(),
      checks: z.string(),
      checkItems: z.array(z.string()),
      stepsTitle: z.string(),
      sideKicker: z.string(),
      sideTitle: z.string(),
      sideText: z.string(),
      sideList: z.array(z.string()),
      related: z.string(),
      relatedTitle: z.string(),
      formTitle: z.string(),
      formHeading: z.string(),
      formText: z.string(),
    }),
    contact: z.object({
      eyebrow: z.string(),
      title: z.string(),
      intro: z.string(),
      kicker: z.string(),
      heading: z.string(),
      text: z.string(),
      office: z.string(),
      phoneEmail: z.string(),
      hours: z.string(),
      hoursValue: z.string(),
      closed: z.string(),
      phone: z.string(),
      email: z.string(),
    }),
    footer: z.object({ tagline: z.string(), rights: z.string(), contact: z.string(), trust: z.array(z.string()) }),
    notFound: z.object({ title: z.string(), text: z.string(), home: z.string() }),
  }),
})

/** Company details shared by every language. */
const settings = defineCollection({
  loader: glob({ base: './src/content/settings', pattern: '*.json' }),
  schema: z.object({
    brand: z.string(),
    phone: z.string(),
    email: z.string(),
    address: z.string(),
    whatsapp: z.string(),
    googleReviewsUrl: z.string(),
    googleRating: z.string().optional(),
    facebook: z.string(),
    instagram: z.string(),
    youtube: z.string(),
  }),
})

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
    image: z.string(),
    benefits: z.array(z.string()).default([]),
  }),
})

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    category: z.string(),
    image: z.string(),
  }),
})

/** Navigation menus, one file per language: each key is a menu (e.g. `main`, `footer`). */
const menuLink = z.object({ label: z.string(), href: z.string() })
const menus = defineCollection({
  loader: glob({ base: './src/content/menus', pattern: '*.json' }),
  schema: z.record(z.string(), z.array(menuLink.extend({ type: z.string().optional(), children: z.array(menuLink).optional() }))),
})

/**
 * Display locations: the places on the page that show a menu, and which menu each shows. The theme reads
 * `header` and `footer`; add your own (e.g. `sidebar`) in WuppyCMS and show it with `menu(locale, 'sidebar')`.
 */
const menuLocations = defineCollection({
  loader: file('./src/content/menu-locations.json'),
  schema: z.object({ menu: z.string() }),
})

/** Page settings from WuppyCMS (SEO, sharing, schema, page code), keyed by `Astro.routePattern`: components/wuppy/. */
const pageSettings = defineCollection({ loader: file('./src/content/page-settings.json') })

export const collections = { site, settings, services, posts, menus, menuLocations, pageSettings }
