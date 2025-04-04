import { createContext, useContext, useState } from "react";

// Create context
const TranslationContext = createContext();

// Custom hook to use context
export const useTranslation = () => useContext(TranslationContext);

// Provider component
export const TranslationProvider = ({ children }) => {
    const [translation, setTranslation] = useState("");

    return (
        <TranslationContext.Provider value={{ translation, setTranslation }}>
            {children}
        </TranslationContext.Provider>
    );
};
