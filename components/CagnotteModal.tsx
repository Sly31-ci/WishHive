import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { X, Gift, Heart } from 'lucide-react-native';
import Button from './Button';
import { Input } from './Input';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';
import * as Haptics from 'expo-haptics';

interface CagnotteModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (amount: number, message: string) => Promise<void>;
    itemTitle: string;
    targetAmount: number;
    currentAmount: number;
    currency: string;
}

export function CagnotteModal({
    visible,
    onClose,
    onSubmit,
    itemTitle,
    targetAmount,
    currentAmount,
    currency,
}: CagnotteModalProps) {
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const remaining = Math.max(0, targetAmount - currentAmount);

    const handleConfirm = async () => {
        const numAmount = parseFloat(amount.replace(',', '.'));

        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
            return;
        }

        if (numAmount > remaining && remaining > 0) {
            Alert.alert(
                'Montant élevé',
                `Le montant dépasse le reste à financer (${currency} ${remaining.toFixed(2)}). Voulez-vous continuer ?`,
                [
                    { text: 'Annuler', style: 'cancel' },
                    { text: 'Oui', onPress: () => processContribution(numAmount) }
                ]
            );
            return;
        }

        processContribution(numAmount);
    };

    const processContribution = async (numAmount: number) => {
        setLoading(true);
        try {
            await onSubmit(numAmount, message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onClose();
            setAmount('');
            setMessage('');
        } catch (error) {
            console.error('Contribution error:', error);
            Alert.alert('Erreur', 'Impossible d\'enregistrer votre participation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <Gift size={24} color={COLORS.primary} />
                            <Text style={styles.title}>Participer au cadeau</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={COLORS.gray[500]} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.subtitle}>
                        Combien souhaitez-vous offrir pour "{itemTitle}" ?
                    </Text>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoLabel}>Reste à financer :</Text>
                        <Text style={styles.infoValue}>{currency} {remaining.toFixed(2)}</Text>
                    </View>

                    <Input
                        label="Montant de votre participation"
                        placeholder={`0.00 ${currency}`}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="decimal-pad"
                        autoFocus
                    />

                    <Input
                        label="Petit mot (optionnel)"
                        placeholder="Ex: Joyeux anniversaire ! 🎉"
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={3}
                    />

                    <View style={styles.footer}>
                        <Button
                            title={loading ? 'Envoi...' : `Participer (${currency} ${amount || '0'})`}
                            onPress={handleConfirm}
                            disabled={loading || !amount}
                            loading={loading}
                        />
                        <Text style={styles.secureText}>
                            🔒 Paiement sécurisé par WishHive
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        paddingBottom: Platform.OS === 'ios' ? 40 : SPACING.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.gray[600],
        marginBottom: SPACING.lg,
    },
    infoBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '10',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.lg,
    },
    infoLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '600',
    },
    infoValue: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.primary,
    },
    footer: {
        marginTop: SPACING.lg,
    },
    secureText: {
        textAlign: 'center',
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[500],
        marginTop: SPACING.sm,
    },
});
