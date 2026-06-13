import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationEN from './locales/en/translation.json';
import translationAR from './locales/ar/translation.json';

const resources = {
  en: { translation: translationEN },
  ar: { translation: translationAR }
};

const savedLanguage = localStorage.getItem('i18nextLng') || 'en';



i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
    resources,
    fallbackLng: 'ar',
    detection:
     {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], 
    },
    interpolation: { escapeValue: false }
  }
);


export default i18n;
