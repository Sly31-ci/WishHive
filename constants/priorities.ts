import { COLORS } from './theme';

export const PRIORITY_LEVELS = {
    URGENT: 400,
    IMPORTANT: 300,
    DESIRED: 200,
    BONUS: 100,
    LIST: 0,
};

export const getPriorityLabel = (priority: number) => {
    if (priority >= PRIORITY_LEVELS.URGENT) return 'Urgent 🔥';
    if (priority >= PRIORITY_LEVELS.IMPORTANT) return 'Important 💖';
    if (priority >= PRIORITY_LEVELS.DESIRED) return 'Souhaité 🎯';
    if (priority >= PRIORITY_LEVELS.BONUS) return 'Bonus ⭐';
    return 'Liste 💎';
};

export const getPriorityColor = (priority: number) => {
    if (priority >= PRIORITY_LEVELS.URGENT) return COLORS.error;
    if (priority >= PRIORITY_LEVELS.IMPORTANT) return COLORS.warning; // Or a specific pink/orange
    if (priority >= PRIORITY_LEVELS.DESIRED) return COLORS.success;
    if (priority >= PRIORITY_LEVELS.BONUS) return COLORS.primary; // Blue-ish
    return COLORS.gray[500];
};

export const PRIORITY_OPTIONS = [
    { label: 'Urgent 🔥', value: PRIORITY_LEVELS.URGENT, color: COLORS.error },
    { label: 'Important 💖', value: PRIORITY_LEVELS.IMPORTANT, color: COLORS.warning },
    { label: 'Souhaité 🎯', value: PRIORITY_LEVELS.DESIRED, color: COLORS.success },
    { label: 'Bonus ⭐', value: PRIORITY_LEVELS.BONUS, color: COLORS.primary },
    { label: 'Liste 💎', value: PRIORITY_LEVELS.LIST, color: COLORS.gray[500] },
];
