export function generateSlug(title: string): string {
    if (!title) return '';

    const base = title
        .toLowerCase()
        .normalize('NFD') // Decompose accents
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens

    const suffix = Math.random().toString(36).substring(2, 6); // 4 random chars

    return `${base}-${suffix}`;
}
