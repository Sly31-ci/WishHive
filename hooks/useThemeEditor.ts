import { useState, useCallback } from 'react';
import { WishlistTheme } from '../constants/wishlistThemes';

interface ThemeEditorState {
    currentTheme: WishlistTheme;
    history: WishlistTheme[];
    historyIndex: number;
    originalTheme: WishlistTheme;
    hasChanges: boolean;
}

interface UseThemeEditorReturn {
    theme: WishlistTheme;
    updateTheme: (updates: Partial<WishlistTheme>) => void;
    undo: () => void;
    redo: () => void;
    reset: () => void;
    canUndo: boolean;
    canRedo: boolean;
    hasChanges: boolean;
}

/**
 * Hook personnalisé pour gérer l'édition de thème avec historique undo/redo
 */
export function useThemeEditor(initialTheme: WishlistTheme): UseThemeEditorReturn {
    const [state, setState] = useState<ThemeEditorState>({
        currentTheme: initialTheme,
        history: [initialTheme],
        historyIndex: 0,
        originalTheme: initialTheme,
        hasChanges: false,
    });

    const updateTheme = useCallback((updates: Partial<WishlistTheme>) => {
        setState(prevState => {
            const newTheme = { ...prevState.currentTheme, ...updates };

            // Créer un nouveau historique en supprimant tout ce qui est après l'index actuel
            const newHistory = prevState.history.slice(0, prevState.historyIndex + 1);
            newHistory.push(newTheme);

            // Limiter l'historique à 50 entrées pour éviter les problèmes de mémoire
            const limitedHistory = newHistory.slice(-50);

            return {
                ...prevState,
                currentTheme: newTheme,
                history: limitedHistory,
                historyIndex: limitedHistory.length - 1,
                hasChanges: true,
            };
        });
    }, []);

    const undo = useCallback(() => {
        setState(prevState => {
            if (prevState.historyIndex > 0) {
                const newIndex = prevState.historyIndex - 1;
                return {
                    ...prevState,
                    currentTheme: prevState.history[newIndex],
                    historyIndex: newIndex,
                    hasChanges: newIndex > 0,
                };
            }
            return prevState;
        });
    }, []);

    const redo = useCallback(() => {
        setState(prevState => {
            if (prevState.historyIndex < prevState.history.length - 1) {
                const newIndex = prevState.historyIndex + 1;
                return {
                    ...prevState,
                    currentTheme: prevState.history[newIndex],
                    historyIndex: newIndex,
                    hasChanges: true,
                };
            }
            return prevState;
        });
    }, []);

    const reset = useCallback(() => {
        setState(prevState => ({
            currentTheme: prevState.originalTheme,
            history: [prevState.originalTheme],
            historyIndex: 0,
            originalTheme: prevState.originalTheme,
            hasChanges: false,
        }));
    }, []);

    return {
        theme: state.currentTheme,
        updateTheme,
        undo,
        redo,
        reset,
        canUndo: state.historyIndex > 0,
        canRedo: state.historyIndex < state.history.length - 1,
        hasChanges: state.hasChanges,
    };
}
