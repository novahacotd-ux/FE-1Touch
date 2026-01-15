import { useState } from 'react';
import { LanguageContext } from './LanguageContext';
import { translations } from './LanguageContext';

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');

    const t = (key) => {
        return translations[language][key] || key;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'vi' : 'en');
    };

    const value = {
        language,
        setLanguage,
        toggleLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
