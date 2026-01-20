/**
 * 🔄 Composant de Migration des Thèmes de Wishlists
 * 
 * Permet d'exécuter la migration depuis l'app mobile
 * Accessible uniquement en mode développement
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
} from 'react-native';
import { RefreshCw, Check, X, AlertCircle } from 'lucide-react-native';
import { migrateWishlistsToDefaultTheme, rollbackMigration } from '../../scripts/migrate-wishlists-theme';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

export default function WishlistThemeMigration() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleMigrate = async () => {
        Alert.alert(
            '🔄 Migration des Wishlists',
            'Cette action va mettre à jour toutes les wishlists non customisées vers le nouveau thème WishHive (orange + violet).\n\nLes wishlists déjà customisées ne seront PAS modifiées.\n\nContinuer ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Migrer',
                    style: 'default',
                    onPress: async () => {
                        setLoading(true);
                        setResult(null);

                        try {
                            const migrationResult = await migrateWishlistsToDefaultTheme();
                            setResult(migrationResult);

                            if (migrationResult.success) {
                                Alert.alert(
                                    '✅ Migration Réussie',
                                    `${migrationResult.updated} wishlists ont été mises à jour vers le thème WishHive !\n\n${migrationResult.skipped} wishlists customisées ont été ignorées.`
                                );
                            } else {
                                Alert.alert(
                                    '❌ Erreur',
                                    'La migration a rencontré des erreurs. Consultez les logs pour plus de détails.'
                                );
                            }
                        } catch (error) {
                            console.error('Erreur migration:', error);
                            Alert.alert('❌ Erreur', 'Une erreur est survenue lors de la migration.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleRollback = async () => {
        Alert.alert(
            '⚠️ Rollback',
            'ATTENTION : Cette action va annuler la migration et restaurer l\'ancien thème gris.\n\nÊtes-vous sûr ?',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Rollback',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const rollbackResult = await rollbackMigration();
                            setResult(rollbackResult);

                            if (rollbackResult.success) {
                                Alert.alert(
                                    '✅ Rollback Réussi',
                                    `${rollbackResult.rolledBack} wishlists ont été restaurées.`
                                );
                            }
                        } catch (error) {
                            console.error('Erreur rollback:', error);
                            Alert.alert('❌ Erreur', 'Erreur lors du rollback.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🔄 Migration Thème Wishlists</Text>
                <Text style={styles.subtitle}>
                    Met à jour les wishlists non customisées vers le thème WishHive
                </Text>
            </View>

            <View style={styles.infoBox}>
                <AlertCircle size={20} color={COLORS.primary} />
                <Text style={styles.infoText}>
                    Cette migration applique le nouveau thème par défaut (🟡 Orange #FFB937 + 🟣 Violet #7F5BFF) à toutes les wishlists qui utilisent encore l'ancien thème gris.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎨 Nouveau Thème Par Défaut</Text>
                <View style={styles.colorPreview}>
                    <View style={[styles.colorBox, { backgroundColor: '#FFB937' }]}>
                        <Text style={styles.colorLabel}>🟡 Orange</Text>
                        <Text style={styles.colorHex}>#FFB937</Text>
                    </View>
                    <View style={[styles.colorBox, { backgroundColor: '#7F5BFF' }]}>
                        <Text style={styles.colorLabel}>🟣 Violet</Text>
                        <Text style={styles.colorHex}>#7F5BFF</Text>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.buttonPrimary]}
                    onPress={handleMigrate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.white} />
                    ) : (
                        <>
                            <RefreshCw size={20} color={COLORS.white} />
                            <Text style={styles.buttonText}>Lancer la Migration</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.buttonSecondary]}
                    onPress={handleRollback}
                    disabled={loading}
                >
                    <X size={20} color={COLORS.error} />
                    <Text style={[styles.buttonText, { color: COLORS.error }]}>
                        Rollback (Annuler)
                    </Text>
                </TouchableOpacity>
            </View>

            {result && (
                <View style={styles.resultBox}>
                    <Text style={styles.resultTitle}>
                        {result.success ? '✅ Résultat' : '❌ Erreur'}
                    </Text>
                    {result.updated !== undefined && (
                        <Text style={styles.resultText}>
                            ✅ Migrées : {result.updated} wishlists
                        </Text>
                    )}
                    {result.skipped !== undefined && (
                        <Text style={styles.resultText}>
                            ⏭️  Ignorées : {result.skipped} wishlists (déjà customisées)
                        </Text>
                    )}
                    {result.errors !== undefined && result.errors > 0 && (
                        <Text style={[styles.resultText, { color: COLORS.error }]}>
                            ❌ Erreurs : {result.errors}
                        </Text>
                    )}
                    {result.total !== undefined && (
                        <Text style={styles.resultText}>
                            📊 Total : {result.total} wishlists
                        </Text>
                    )}
                </View>
            )}

            <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                    ⚠️ Note : Les wishlists déjà customisées par les utilisateurs ne seront PAS modifiées.
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary + '10',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.lg,
        gap: SPACING.sm,
    },
    infoText: {
        flex: 1,
        fontSize: FONT_SIZES.sm,
        color: COLORS.dark,
        lineHeight: 20,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    colorPreview: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    colorBox: {
        flex: 1,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    colorLabel: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    colorHex: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        opacity: 0.9,
    },
    buttonContainer: {
        gap: SPACING.md,
        marginBottom: SPACING.xl,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        gap: SPACING.sm,
    },
    buttonPrimary: {
        backgroundColor: COLORS.primary,
    },
    buttonSecondary: {
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.error,
    },
    buttonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.white,
    },
    resultBox: {
        backgroundColor: COLORS.white,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    },
    resultTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.md,
    },
    resultText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    warningBox: {
        backgroundColor: COLORS.warning + '10',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.warning,
    },
    warningText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.dark,
        lineHeight: 20,
    },
});
