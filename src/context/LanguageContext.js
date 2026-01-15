import { createContext } from 'react';
import { en } from '../i18n/en';
import { vi } from '../i18n/vi';
export const LanguageContext = createContext(null);

export const translations = {
    en,
    vi
};