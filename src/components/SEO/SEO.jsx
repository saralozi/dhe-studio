import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useLanguage } from '../../context/LanguageContext';
import {
  defaultLanguage,
  localizePath,
  stripLanguage,
  supportedLanguages,
} from '../../i18n/config';

/*
  The real address of the website, without a slash at the end.
  It comes from the .env file (VITE_SITE_URL).
*/
const SITE_URL = (
  import.meta.env.VITE_SITE_URL || 'https://studiodhe.com'
).replace(/\/$/, '');

// Preview image used when a page does not give its own image.
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

// Language codes that social networks understand.
const OG_LOCALES = {
  en: 'en_US',
  sq: 'sq_AL',
  tr: 'tr_TR',
};

/*
  Find a tag in <head> and update it.
  If it does not exist yet, create it.
*/
const setTag = (selector, tagName, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

// Full address of a page in a given language.
const pageUrl = (path, language) => {
  return `${SITE_URL}${localizePath(path, language)}`;
};

export default function SEO({
  title,
  description,
  image,
  noindex = false,
}) {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    // '/sq/about' becomes '/about'
    const path = stripLanguage(pathname);

    // Official address of this page in the current language
    const url = pageUrl(path, language);

    const ogImage = image || DEFAULT_IMAGE;

    /* 1. Title (browser tab and Google headline) */

    document.title = title;

    /* 2. Description (grey text under the Google headline) */

    setTag('meta[name="description"]', 'meta', {
      name: 'description',
      content: description,
    });

    /* 3. Canonical (the official address of this page) */

    setTag('link[rel="canonical"]', 'link', {
      rel: 'canonical',
      href: url,
    });

    /* 4. Open Graph (preview card in WhatsApp, LinkedIn, etc.) */

    setTag('meta[property="og:title"]', 'meta', {
      property: 'og:title',
      content: title,
    });

    setTag('meta[property="og:description"]', 'meta', {
      property: 'og:description',
      content: description,
    });

    setTag('meta[property="og:url"]', 'meta', {
      property: 'og:url',
      content: url,
    });

    setTag('meta[property="og:image"]', 'meta', {
      property: 'og:image',
      content: ogImage,
    });

    setTag('meta[property="og:locale"]', 'meta', {
      property: 'og:locale',
      content: OG_LOCALES[language],
    });

    /* 5. Robots (noindex = "do not list this page in Google") */

    const robots = document.head.querySelector(
      'meta[name="robots"]'
    );

    if (noindex) {
      setTag('meta[name="robots"]', 'meta', {
        name: 'robots',
        content: 'noindex',
      });
    } else if (robots) {
      robots.remove();
    }

    /* 6. hreflang (the same page in the other languages) */

    document.head
      .querySelectorAll('link[data-seo-alternate]')
      .forEach((element) => element.remove());

    [...supportedLanguages, 'x-default'].forEach((code) => {
      const link = document.createElement('link');

      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', code);
      link.setAttribute(
        'href',
        pageUrl(
          path,
          code === 'x-default' ? defaultLanguage : code
        )
      );
      link.setAttribute('data-seo-alternate', '');

      document.head.appendChild(link);
    });
  }, [title, description, image, noindex, pathname, language]);

  // This component shows nothing on the page.
  return null;
}
