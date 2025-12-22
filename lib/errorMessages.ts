/**
 * User-friendly error message mapping for Supabase and general errors.
 */

export function getErrorMessage(error: any): string {
    if (!error) return 'An unexpected error occurred';

    const message = error.message || String(error);
    const code = error.code;

    // Supabase Auth Errors
    if (message.includes('Invalid login credentials')) {
        return 'Email ou mot de passe incorrect. Recommence un petit coup ! 🍯';
    }

    if (message.includes('User already registered')) {
        return 'Cet email est déjà utilisé. Tu as peut-être déjà un compte ? ✨';
    }

    if (message.includes('Email not confirmed')) {
        return 'N\'oublie pas de confirmer ton email pour accéder à ta ruche ! 📧';
    }

    if (message.includes('Password should be at least 6 characters')) {
        return 'Ton mot de passe doit faire au moins 6 caractères pour être bien sécurisé. 🔒';
    }

    // Network Errors
    if (message.includes('Network request failed') || message.includes('fetch')) {
        return 'Oups, petit souci de connexion. Vérifie ton réseau et réessaie ! 🌐';
    }

    // Rate Limiting
    if (code === 'over_limit' || message.includes('rate limit')) {
        return 'Doucement l\'abeille ! Trop de tentatives, attends un instant. 🐝';
    }

    // Default Fallback
    return message || 'Une erreur est survenue. Réessaie dans un instant !';
}
