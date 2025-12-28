'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const [name, setName] = useState('User');
    // Default to dark to match the premium aesthetic init
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Fetch initial settings
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) {
                    setName(data.name);
                    setTheme(data.theme);
                }
            })
            .catch(err => console.error("Failed to load settings", err));
    }, []); // Run once on mount

    useEffect(() => {
        // Apply theme to body
        document.body.setAttribute('data-theme', theme);
    }, [theme]);

    const saveName = (newName) => {
        setName(newName);
        fetch('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        }).catch(err => console.error(err));
    };

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        fetch('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: newTheme })
        }).catch(err => console.error(err));
    };

    return (
        <SettingsContext.Provider value={{ name, saveName, theme, toggleTheme }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);
