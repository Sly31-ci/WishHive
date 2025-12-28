/**
 * 🎨 Icon Component - Design System Wrapper
 * 
 * Wrapper intelligent autour de lucide-react-native
 * Garantit des couleurs cohérentes et accessibles
 */

import React from 'react';
import * as LucideIcons from 'lucide-react-native';
import { theme } from '@/theme';

type IconName = keyof typeof LucideIcons;

type IconVariant =
    | 'default'      // Neutral (#52525B - ratio 7.1:1)
    | 'subtle'       // Decorative (#71717A)
    | 'active'       // Brand primary text (#B87100)
    | 'activeSecondary'  // Brand secondary text
    | 'activeAccent'     // Brand accent text
    | 'disabled'     // Disabled state
    | 'success'      // Success green
    | 'error'        // Error red
    | 'warning'      // Warning orange
    | 'info';        // Info blue

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;

interface IconProps {
    /** Nom de l'icône Lucide */
    name: IconName;

    /** Variante sémantique (auto-choose color) */
    variant?: IconVariant;

    /** Taille (xs, sm, md, lg, xl ou nombre) */
    size?: IconSize;

    /** Couleur custom (override) */
    color?: string;

    /** Props supplémentaires */
    [key: string]: any;
}

export function Icon({
    name,
    variant = 'default',
    size = 'md',
    color: customColor,
    ...props
}: IconProps) {
    const IconComponent = LucideIcons[name] as any;

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in lucide-react-native`);
        return null;
    }

    // Get size (number)
    const getSize = (): number => {
        if (typeof size === 'number') return size;

        const sizeMap: Record<string, number> = {
            xs: theme.semantic.icon.sizes.xs,   // 16
            sm: theme.semantic.icon.sizes.sm,   // 20
            md: theme.semantic.icon.sizes.md,   // 24
            lg: theme.semantic.icon.sizes.lg,   // 28
            xl: theme.semantic.icon.sizes.xl,   // 32
        };

        return sizeMap[size] || 24;
    };

    // Get color (IMPORTANTES: variantes texte pour brand)
    const getColor = (): string => {
        if (customColor) return customColor;

        const colorMap: Record<IconVariant, string> = {
            default: theme.semantic.icon.colors.default,               // #52525B ✅ Ratio 7.1:1
            subtle: theme.semantic.icon.colors.subtle,                 // #71717A
            active: theme.semantic.icon.colors.active,                 // #B87100 (primaryText) ✅
            activeSecondary: theme.semantic.icon.colors.activeSecondary, // #4A28B8 ✅
            activeAccent: theme.semantic.icon.colors.activeAccent,     // #007650 ✅
            disabled: theme.semantic.icon.colors.disabled,
            success: theme.semantic.icon.colors.success,
            error: theme.semantic.icon.colors.error,
            warning: theme.semantic.icon.colors.warning,
            info: theme.semantic.icon.colors.info,
        };

        return colorMap[variant];
    };

    return (
        <IconComponent
            size={getSize()}
            color={getColor()}
            {...props}
        />
    );
}

// Re-export types
export type { IconName, IconVariant, IconSize, IconProps };

export default Icon;
