import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getLanguageFromPath,
  localizePath,
  stripLanguage,
  supportedLanguages,
} from '../i18n/config';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const language = getLanguageFromPath(pathname);

  const setLanguage = useCallback(
    (newLanguage) => {
      if (!supportedLanguages.includes(newLanguage)) return;

      navigate(
        localizePath(stripLanguage(pathname), newLanguage) +
          search +
          hash
      );
    },
    [pathname, search, hash, navigate]
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const contextValue = useMemo(
    () => ({ language, setLanguage, supportedLanguages }),
    [language, setLanguage]
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