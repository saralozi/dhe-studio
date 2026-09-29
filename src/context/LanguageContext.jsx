import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const supportedLanguages = ['en', 'sq', 'tr'];

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const savedLanguage =
      localStorage.getItem('dhe-language');

    if (
      savedLanguage &&
      supportedLanguages.includes(savedLanguage)
    ) {
      return savedLanguage;
    }

    return 'en';
  });

  const setLanguage = (newLanguage) => {
    if (!supportedLanguages.includes(newLanguage)) {
      return;
    }

    setLanguageState(newLanguage);
  };

  useEffect(() => {
    localStorage.setItem('dhe-language', language);

    document.documentElement.lang = language;
  }, [language]);

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      supportedLanguages,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider.'
    );
  }

  return context;
};