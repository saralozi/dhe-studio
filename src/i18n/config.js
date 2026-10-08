export const supportedLanguages = ['en', 'sq', 'tr'];
export const defaultLanguage = 'en';

export const prefixedLanguages = supportedLanguages.filter(
  (language) => language !== defaultLanguage
);

export const getLanguageFromPath = (pathname) => {
  const first = pathname.split('/')[1];
  return prefixedLanguages.includes(first) ? first : defaultLanguage;
};

// '/sq/about' -> '/about'
export const stripLanguage = (pathname) => {
  const [, first, ...rest] = pathname.split('/');
  return prefixedLanguages.includes(first)
    ? '/' + rest.join('/')
    : pathname;
};

// ('/about', 'sq') -> '/sq/about'
export const localizePath = (path, language) => {
  if (language === defaultLanguage) return path;
  return path === '/' ? `/${language}` : `/${language}${path}`;
};