#!/usr/bin/env node

/**
 * 🚀 Migration Automatique Design System
 * 
 * Ce script migre automatiquement les fichiers vers le nouveau Design System
 */

const fs = require('fs');
const path = require('path');

const MIGRATION_RULES = {
    // Imports à remplacer
    imports: [
        {
            from: /import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS.*} from '@\/constants\/theme';/g,
            to: `import { theme } from '@/theme';
import { H1, H2, H3, Body, Caption } from '@/components/Text';
import Icon from '@/components/Icon';
import Colors from '@/theme/colors';

// Backward compatibility
const COLORS = {
    ...Colors.light,
    white: Colors.brand.pureWhite,
    gray: Colors.gray,
    dark: Colors.light.textPrimary,
};
const SPACING = theme.spacing;
const FONT_SIZES = theme.typography.sizes;
const BORDER_RADIUS = theme.borderRadius;`
        }
    ],

    // Icons Lucide à remplacer
    lucideIcons: [
        'ArrowLeft', 'Send', 'X', 'AtSign', 'Check', 'MessageSquare',
        'Bell', 'Heart', 'Eye', 'Calendar', 'Trash2', 'Package',
        'Plus', 'TrendingUp', 'Sparkles', 'User', 'Settings',
        'LogOut', 'Edit', 'Share2', 'Download'
    ]
};

function migrateFile(filePath) {
    console.log(`📝 Migrating: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Remplacer les imports theme
    MIGRATION_RULES.imports.forEach(rule => {
        if (rule.from.test(content)) {
            content = content.replace(rule.from, rule.to);
            modified = true;
        }
    });

    // 2. Supprimer imports Lucide individuels (ils seront via Icon component)
    const lucideImportRegex = /import { ([^}]+) } from 'lucide-react-native';/g;
    const lucideMatch = content.match(lucideImportRegex);

    if (lucideMatch) {
        // Icons sont maintenant via <Icon name="..." />
        // On garde l'import pour backward compat si nécessaire
        console.log(`  ℹ️  Lucide icons found - migrate to <Icon> component manually`);
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✅ Migrated successfully`);
        return true;
    }

    console.log(`  ⏭️  No changes needed`);
    return false;
}

function migrateDirectory(dirPath, extensions = ['.tsx', '.ts']) {
    const files = fs.readdirSync(dirPath);
    let migratedCount = 0;

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Skip node_modules, .git, etc.
            if (!['node_modules', '.git', '.expo', 'dist', 'build'].includes(file)) {
                migratedCount += migrateDirectory(filePath, extensions);
            }
        } else if (extensions.some(ext => file.endsWith(ext))) {
            if (migrateFile(filePath)) {
                migratedCount++;
            }
        }
    });

    return migratedCount;
}

// Main
const args = process.argv.slice(2);
const targetPath = args[0] || './app';

console.log('🚀 Design System Migration Script');
console.log('==================================\n');
console.log(`Target: ${targetPath}\n`);

const count = migrateDirectory(targetPath);

console.log(`\n📊 Migration Summary`);
console.log(`====================`);
console.log(`✅ ${count} files migrated`);
console.log(`\n⚠️  Manual steps remaining:`);
console.log(`   - Replace Lucide icon usage with <Icon name="..." />`);
console.log(`   - Replace <Text style={}> with <Body>, <Caption>, etc.`);
console.log(`   - Test all screens`);
