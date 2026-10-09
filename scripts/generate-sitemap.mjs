/*
  Generates public/sitemap.xml and public/robots.txt before every build.

  - Lists every page in every language (en, sq, tr).
  - Adds a hreflang link for each language version.
  - Reads the project slugs from Sanity, so new projects appear
    automatically after the next build.

  Run automatically by:  npm run build
*/

import { mkdirSync, writeFileSync } from 'node:fs';
import { createClient } from '@sanity/client';
import { loadEnv } from 'vite';

const env = loadEnv('production', process.cwd(), 'VITE_');

const SITE_URL = (
  env.VITE_SITE_URL || 'https://studiodhe.com'
).replace(/\/$/, '');

const languages = ['en', 'sq', 'tr'];
const defaultLanguage = 'en';

// Pages that always exist
const staticPaths = [
  '/',
  '/about',
  '/services',
  '/projects',
  '/contact',
  '/privacy',
];

// '/about' + 'sq' -> '/sq/about'
const localizePath = (path, language) => {
  if (language === defaultLanguage) return path;
  return path === '/' ? `/${language}` : `/${language}${path}`;
};

const escapeXml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

// Get the project slugs from Sanity
const getProjects = async () => {
  try {
    const client = createClient({
      projectId: env.VITE_SANITY_PROJECT_ID,
      dataset: env.VITE_SANITY_DATASET,
      apiVersion: env.VITE_SANITY_API_VERSION,
      useCdn: false,
      perspective: 'published',
    });

    return await client.fetch(
      `*[_type == "project" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`
    );
  } catch (error) {
    console.warn(
      'Sitemap: could not read projects from Sanity. ' +
        'Only the static pages will be listed.'
    );
    console.warn(error.message);
    return [];
  }
};

// One <url> block per page and language
const createUrlBlocks = (path, lastModified) => {
  const alternates = [
    ...languages.map(
      (language) =>
        `    <xhtml:link rel="alternate" hreflang="${language}" href="${escapeXml(
          SITE_URL + localizePath(path, language)
        )}" />`
    ),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
      SITE_URL + localizePath(path, defaultLanguage)
    )}" />`,
  ].join('\n');

  return languages
    .map((language) => {
      const lastmod = lastModified
        ? `\n    <lastmod>${lastModified.slice(0, 10)}</lastmod>`
        : '';

      return `  <url>
    <loc>${escapeXml(SITE_URL + localizePath(path, language))}</loc>${lastmod}
${alternates}
  </url>`;
    })
    .join('\n');
};

const projects = await getProjects();

const blocks = [
  ...staticPaths.map((path) => createUrlBlocks(path)),
  ...projects.map((project) =>
    createUrlBlocks(
      `/projects/${project.slug}`,
      project._updatedAt
    )
  ),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${blocks.join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

mkdirSync('public', { recursive: true });
writeFileSync('public/sitemap.xml', sitemap);
writeFileSync('public/robots.txt', robots);

console.log(
  `Sitemap created: ${staticPaths.length} pages and ${projects.length} projects, in ${languages.length} languages.`
);
