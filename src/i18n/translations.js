export const translations = {
  en: {
    navbar: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      projects: 'Projects',
      contact: 'Let’s talk',
      openMenu: 'Open navigation',
      closeMenu: 'Close navigation',
      menu: 'Menu',
    },
  },

  sq: {
    navbar: {
      home: 'Kreu',
      about: 'Rreth nesh',
      services: 'Shërbimet',
      projects: 'Projektet',
      contact: 'Le të flasim',
      openMenu: 'Hap menunë',
      closeMenu: 'Mbyll menunë',
      menu: 'Menu',
    },
  },

  tr: {
    navbar: {
      home: 'Ana Sayfa',
      about: 'Hakkımızda',
      services: 'Hizmetler',
      projects: 'Projeler',
      contact: 'İletişime geçelim',
      openMenu: 'Menüyü aç',
      closeMenu: 'Menüyü kapat',
      menu: 'Menü',
    },
  },
};

export const getTranslations = (language) => {
  return translations[language] || translations.en;
};