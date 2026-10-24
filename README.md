# DHÈ Studio

![CI](https://github.com/saralozi/dhe-studio/actions/workflows/ci.yml/badge.svg)

A multilingual portfolio and client-inquiry platform for **DHÈ Studio — Designing Human Experiences**, an architecture and interior design studio focused on how people experience the spaces around them.

**Live site:** [studiodhe.com](https://studiodhe.com)

![Home page](docs/screenshots/home.png)

| Projects with search and filter | Project page with gallery |
|---|---|
| ![Projects](docs/screenshots/project-list.png) | ![Project detail](docs/screenshots/project-details.png) |

| Fullscreen gallery | Project inquiry form |
|---|---|
| ![Lightbox](docs/screenshots/gallery.png) | ![Contact form](docs/screenshots/contact.png) |

## At a glance

- **What it is:** a freelance client project. A complete platform where the studio manages its own projects and services, shows its work in three languages (English, Albanian, Turkish) and receives structured client inquiries.
- **My role:** design and full-stack development, from the CMS and the serverless backend to SEO, deployment, DNS and email setup.
- **Stack:** React 19, Vite, Sanity CMS, Cloudflare Workers, D1, Workers AI, Turnstile, Resend.
- **Quality (Lighthouse, production site):** Desktop 99 performance, 100 accessibility, 100 best practices, 100 SEO. Mobile 93 / 96 / 100 / 100 on simulated slow 4G (scores vary a few points between runs). Security headers: A on securityheaders.com, with an enforced Content-Security-Policy.
- **Automated checks:** GitHub Actions lints and builds the website and runs the Worker's 11 tests on every push.
- **Built in about three weeks** (September 21 to October 12, 2026), then measured and optimized, with a clear Git history.

## Features

**Website**

- Responsive React site with an animated exterior-to-interior hero
- Home, About, Services, Projects, Project details, Contact, Privacy Policy and a custom 404
- Project pages with an image and video gallery, a keyboard-accessible lightbox and an optional hero video
- Project search and category filter
- Accessible navigation and semantic structure, with alt text required for every image

**Multilingual (English, Albanian, Turkish)**

- Each language has its own URL: `/about`, `/sq/about`, `/tr/about`
- The language comes from the URL, so every version can be linked, shared and indexed
- All content is editable in all three languages, with English as the fallback

**Content management**

- Sanity Studio for projects, services and the About page
- Localized fields for titles, descriptions and image alt text
- Sanity image pipeline for optimized, cropped images

**SEO**

- Per-page title, description, canonical URL and Open Graph tags, in each language
- `hreflang` links between language versions
- `sitemap.xml` and `robots.txt` generated at every build, including every project from Sanity
- Social preview image and favicon set

**Performance, accessibility and security**

- Responsive hero images with `srcset`, so phones download about 130 KB instead of 800 KB
- Self-hosted font, with no request to Google Fonts
- Security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy, COOP, Permissions-Policy), a Content-Security-Policy and an automatic HTTPS redirect

**Client inquiries**

- Contact form with validation and a consent link to the privacy policy
- Rate limiting and Cloudflare Turnstile spam protection
- Inquiries stored in D1 before any email is sent
- AI-structured project brief with a safe fallback
- Email notification to the studio through Resend
- 11 automated tests (Vitest) covering validation, spam protection, rate limiting, the AI fallback, email failures and what gets stored in the database

## How it works

```mermaid
flowchart LR
  V[Visitor] --> W[React website]
  W -->|content| S[(Sanity CMS)]
  W -->|inquiry| K[Cloudflare Worker]
  K --> T[Turnstile check]
  K --> A[Workers AI brief]
  K --> D[(D1 database)]
  K --> R[Resend email]
  R --> E[Studio inbox]
```

**Inquiry flow**

1. A visitor completes the contact form and the Turnstile check.
2. React sends the inquiry to the Cloudflare Worker.
3. The Worker applies a rate limit (5 requests per minute per IP), validates every field and verifies the Turnstile token.
4. The project message and the interface language are sent to the AI model. The visitor's name, email and phone number are never sent to it.
5. The inquiry and the structured brief are saved in D1.
6. The Worker sends the email through Resend and records whether it was sent or failed.

## What the AI does, and what it doesn't

The AI feature does not design projects or give architectural advice. Its only job is to turn a client's natural message into an organized brief: project type, location, approximate area, timeline, budget, main priorities and the information that is still missing.

- Anything the client did not say stays clearly marked as "Not provided" instead of being invented.
- A person at the studio reads every inquiry, together with the client's original message.
- The client's name, email address and phone number are never sent to the model.
- If the AI step fails, the original message is used instead and the inquiry still goes through.

## Engineering decisions

- **The language lives in the URL.** An early version kept it in browser storage, which gave every language the same address. Moving it into the path makes each version indexable and shareable, and lets `hreflang` and the sitemap describe all of them.
- **Cheap checks run first.** Rate limit, then validation, then Turnstile, and only then the AI and the database. Abusive traffic never reaches the expensive steps.
- **Store first, email second.** The inquiry is saved before the email is attempted, with a status column (`pending`, `sent`, `failed`), so a delivery problem can never lose a client's message. An idempotency key makes retries safe.
- **The AI is a bounded helper, not a decision maker.** Its output is constrained by a JSON schema, validated field by field and cleaned. The visitor's message is treated as untrusted input. If anything fails, the original message is used instead. Everything placed in the email is escaped.
- **Generated, not hand-written, SEO files.** A build script reads the project slugs from Sanity and writes the sitemap and robots file, so a new project is never missing.
- **Content model built for editors.** Localized fields, required alt text in every language and one shared slug per project keep the editing simple and the URLs stable.
- **Measure, then fix.** Performance work started from Lighthouse reports on the live site, not from guesses. Each change targeted one finding, and the site was measured again afterwards.
- **Tests mock the outside world.** The Worker tests replace Workers AI, the rate limiter, Turnstile and Resend, and check what is stored in a real test database.

## Performance, accessibility and security results

After launch I measured the live site with Lighthouse and fixed what the reports showed.

| | Before | After |
| --- | --- | --- |
| Mobile performance | 73 | 93 |
| Desktop performance | 96 | 99 |
| Desktop accessibility | 92 | 100 |
| Mobile Largest Contentful Paint (Core Web Vitals) | 7.1 s | 3.0 s |
| Mobile First Contentful Paint | 2.4 s | 1.8 s |
| Security headers | none | A |

What changed, and why:

- **Hero images.** Two photos weighed about 800 KB and slowed down phones. I compressed them, made an 800 px version for phones and used `srcset` so each device downloads only the size it needs.
- **Font loading.** The font was loaded through a CSS `@import`, which made the browser wait for several requests in a row. It is now served from the site itself with `@fontsource/manrope`, which also means visitors' browsers no longer contact Google.
- **Preconnect.** The Sanity connection opens early.
- **Accessibility (WCAG).** Low-contrast greys were darkened and the language buttons made larger, so they meet the WCAG contrast and touch-target guidelines.
- **Security.** A `public/_headers` file sets the security headers, and Cloudflare redirects all HTTP traffic to HTTPS. A Content-Security-Policy limits where scripts, styles, images and connections may come from. It was first run in report-only mode and checked in the browser console, then enforced.

## Development timeline

| Dates | What happened |
| --- | --- |
| Sep 21 – 23 | First version of the site, Sanity Studio and content schemas, frontend connected to the CMS, services and projects loaded from Sanity |
| Sep 24 | First client inquiry flow on a Cloudflare Worker |
| Sep 30 – Oct 3 | Multilingual CMS content, language selector and site translations, homepage interactions, redesigned projects and project details |
| Oct 4 – 6 | Inquiry backend hardened: validation, D1 storage, Turnstile, AI brief with tests, rate limiting, Resend email; video support and refined galleries |
| Oct 9 – 10 | Language-prefixed URLs, SEO component, privacy policy, sitemap and robots generation, favicon |
| Oct 11 – 12 | Production deployment on Cloudflare, real spam protection, domain connected |
| Oct 22 – 23 | Performance and security pass: responsive hero images, self-hosted font, security headers, HTTPS redirect, contrast and tap-target fixes |

## Production setup

Some of the work lives in service dashboards, not in this repository:

- **Hosting.** Cloudflare builds the site from GitHub on every push and serves it with single-page-app routing. The custom domains are declared in `wrangler.jsonc`.
- **DNS.** The domain's nameservers were moved to Cloudflare. The records for the studio mailbox and for email sending were carried over intact and kept as DNS-only.
- **Email.** The sending domain is verified in Resend with SPF and DKIM records. The Worker sends from an address on that domain.
- **Spam protection.** A Turnstile widget with a hostname allowlist. The site key is public, and the secret key is stored only in the Worker.
- **Secrets.** Stored as Worker secrets and build variables, never in the repository.
- **Allowed origins.** The production domain is listed in the Sanity CORS settings, the Worker and the Turnstile widget.
- **Security headers.** Set in `public/_headers`, including a Content-Security-Policy that allows only the services the site uses (Sanity, Cloudflare Turnstile and Web Analytics, the inquiry Worker). Cloudflare's "Always Use HTTPS" redirects every HTTP request.
- **Search.** The site is registered in Google Search Console and the generated sitemap is submitted.

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, JavaScript, CSS, `@fontsource/manrope` (self-hosted font) |
| CMS | Sanity, GROQ, `@sanity/image-url`, `sanity-plugin-internationalized-array` |
| Backend | Cloudflare Workers, D1, Workers AI, Rate Limiting binding |
| Spam protection | Cloudflare Turnstile |
| Email | Resend |
| Hosting and DNS | Cloudflare |
| Testing and linting | Vitest with the Cloudflare Workers plugin, oxlint |

## Project structure

```
dhe-studio/
├── src/
│   ├── components/      # pages and shared components
│   ├── context/         # language context
│   ├── i18n/            # translations, privacy text, URL helpers
│   └── sanity/          # client, GROQ queries, image helper
├── public/              # favicon, social image, static assets, _headers (security headers)
├── scripts/
│   └── generate-sitemap.mjs   # builds sitemap.xml and robots.txt
├── worker/              # Cloudflare Worker: inquiry API, tests, migrations
├── studio/              # Sanity Studio and content schemas
└── wrangler.jsonc       # website deployment settings
```

## Getting started

**Requirements:** Node.js 22 or newer.

```bash
npm install
npm run dev
```

```bash
npm run build     # generates the sitemap, then builds the site
npm run preview   # serves the production build locally
npm run lint
```

### Environment variables (website)

Create a `.env` file in the project root. These values become public once the site is built, so never put a secret in a `VITE_` variable.

| Name | Purpose |
| --- | --- |
| `VITE_SANITY_PROJECT_ID` | Sanity project |
| `VITE_SANITY_DATASET` | Sanity dataset |
| `VITE_SANITY_API_VERSION` | Sanity API version |
| `VITE_SITE_URL` | Public site address, used for canonical URLs and the sitemap |
| `VITE_API_URL` | Address of the inquiry Worker |
| `VITE_TURNSTILE_SITE_KEY` | Public Turnstile site key |

### The inquiry Worker

```bash
cd worker
npm install
npx wrangler dev          # run locally
npx vitest run            # run the tests
```

Local secrets go in `.dev.vars`, which is ignored by Git.

| Name | Type | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | secret | Sends the inquiry email |
| `TURNSTILE_SECRET_KEY` | secret | Verifies the spam check |
| `INQUIRY_FROM_EMAIL` | secret or variable | Sender address on the verified domain |
| `INQUIRY_TO_EMAIL` | secret or variable | Studio inbox |
| `AI` | binding | Workers AI |
| `INQUIRY_RATE_LIMITER` | binding | Request rate limit |
| `dhe_studio_inquiries_db` | D1 binding | Inquiry storage |

**Deploying the Worker:** set the secrets with `npx wrangler secret put NAME`, create the table with `npx wrangler d1 migrations apply dhe-studio-inquiries-db --remote`, then run `npx wrangler deploy`.

## Roadmap

- Request Sanity images at display size
- Admin dashboard for inquiries, with a retry button for failed emails
- Automatic retry of failed notification emails
- Cross-language semantic search across projects
- Albanian and Turkish versions of the privacy policy
- Lighthouse checks in CI

## Credits

Designed and developed by Sara Lozi ([@saralozi](https://github.com/saralozi)).

The DHÈ Studio name, logo, project images and written content belong to DHÈ Studio.