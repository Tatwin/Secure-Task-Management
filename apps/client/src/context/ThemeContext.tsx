import React, { createContext, useContext, useState, useEffect } from 'react';

type ColorPalette = {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
};

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    palette: ColorPalette;
    setMode: (mode: ThemeMode) => void;
    setPalette: (palette: Partial<ColorPalette>) => void;
    resetTheme: () => void;
}

const defaultLight: ColorPalette = {
    primary: '#3b82f6',
    secondary: '#6366f1',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
};

const defaultDark: ColorPalette = {
    primary: '#60a5fa',
    secondary: '#818cf8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    border: '#334155',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setModeState] = useState<ThemeMode>(() => {
        const saved = localStorage.getItem('theme-mode');
        return (saved as ThemeMode) || 'light';
    });

    const [palette, setPaletteState] = useState<ColorPalette>(() => {
        const saved = localStorage.getItem('theme-palette');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return mode === 'light' ? defaultLight : defaultDark;
            }
        }
        return mode === 'light' ? defaultLight : defaultDark;
    });

    // Handle initial mode setup
    useEffect(() => {
        const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
        if (savedMode) {
            setModeState(savedMode);
            document.documentElement.classList.toggle('dark', savedMode === 'dark');
        }
    }, []);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        localStorage.setItem('theme-mode', newMode);
        document.documentElement.classList.toggle('dark', newMode === 'dark');

        // Preserve primary/secondary colors but update backgrounds/text for the new mode
        const targetDefaults = newMode === 'light' ? defaultLight : defaultDark;

        setPaletteState(prev => ({
            ...targetDefaults,
            primary: prev.primary,
            secondary: prev.secondary
        }));
    };

    useEffect(() => {
        localStorage.setItem('theme-palette', JSON.stringify(palette));

        const root = document.documentElement;
        root.style.setProperty('--color-primary', palette.primary);
        root.style.setProperty('--color-secondary', palette.secondary);
        root.style.setProperty('--color-background', palette.background);
        root.style.setProperty('--color-surface', palette.surface);
        root.style.setProperty('--color-text', palette.text);
        root.style.setProperty('--color-text-muted', palette.textMuted);
        root.style.setProperty('--color-border', palette.border);
    }, [palette]);

    const setPalette = (newPalette: Partial<ColorPalette>) => {
        setPaletteState(prev => ({ ...prev, ...newPalette }));
    };

    const resetTheme = () => {
        const newPalette = mode === 'light' ? defaultLight : defaultDark;
        setPaletteState(newPalette);
    };

    return (
        <ThemeContext.Provider value={{ mode, palette, setMode, setPalette, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
