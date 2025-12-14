import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from 'react-native';
import { Share2, Copy, QrCode, X } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { shareWishlist, copyShareLink, generateQRCode } from '@/lib/shareWishlist';
import * as Haptics from 'expo-haptics';

interface ShareWishlistButtonProps {
    wishlistId: string;
    wishlistTitle: string;
    variant?: 'primary' | 'secondary' | 'icon';
}

export default function ShareWishlistButton({
    wishlistId,
    wishlistTitle,
    variant = 'primary'
}: ShareWishlistButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const handleShare = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await shareWishlist(wishlistId, wishlistTitle);
    };

    const handleCopyLink = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await copyShareLink(wishlistId);
    };

    const handleShowQR = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const url = await generateQRCode(wishlistId);
        if (url) {
            setQrCodeUrl(url);
            setShowModal(true);
        }
    };

    const handleOpenOptions = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowModal(true);
    };

    if (variant === 'icon') {
        return (
            <>
                <TouchableOpacity style={styles.iconButton} onPress={handleOpenOptions}>
                    <Share2 size={24} color={COLORS.primary} />
                </TouchableOpacity>
                {renderModal()}
            </>
        );
    }

    const buttonStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
    const textStyle = variant === 'primary' ? styles.primaryText : styles.secondaryText;
    const iconColor = variant === 'primary' ? COLORS.white : COLORS.primary;

    return (
        <>
            <TouchableOpacity style={buttonStyle} onPress={handleOpenOptions}>
                <Share2 size={20} color={iconColor} />
                <Text style={textStyle}>Partager</Text>
            </TouchableOpacity>
            {renderModal()}
        </>
    );

    function renderModal() {
        return (
            <Modal
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Partager la wishlist</Text>
                            <TouchableOpacity onPress={() => setShowModal(false)}>
                                <X size={24} color={COLORS.dark} />
                            </TouchableOpacity>
                        </View>

                        {/* QR Code Display */}
                        {qrCodeUrl && (
                            <View style={styles.qrContainer}>
                                <Image
                                    source={{ uri: qrCodeUrl }}
                                    style={styles.qrCode}
                                    resizeMode="contain"
                                />
                                <Text style={styles.qrLabel}>Scannez pour accéder</Text>
                            </View>
                        )}

                        {/* Share Options */}
                        <View style={styles.options}>
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => {
                                    setShowModal(false);
                                    handleShare();
                                }}
                            >
                                <View style={styles.optionIcon}>
                                    <Share2 size={24} color={COLORS.primary} />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>Partager</Text>
                                    <Text style={styles.optionDesc}>Via SMS, WhatsApp, etc.</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => {
                                    setShowModal(false);
                                    handleCopyLink();
                                }}
                            >
                                <View style={styles.optionIcon}>
                                    <Copy size={24} color={COLORS.primary} />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>Copier le lien</Text>
                                    <Text style={styles.optionDesc}>Coller où vous voulez</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.option}
                                onPress={handleShowQR}
                            >
                                <View style={styles.optionIcon}>
                                    <QrCode size={24} color={COLORS.primary} />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionTitle}>QR Code</Text>
                                    <Text style={styles.optionDesc}>Partager en personne</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        ...SHADOWS.md,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    iconButton: {
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.gray[100],
    },
    primaryText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.white,
    },
    secondaryText: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
    },
    qrContainer: {
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.gray[50],
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
    },
    qrCode: {
        width: 250,
        height: 250,
    },
    qrLabel: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    options: {
        gap: SPACING.sm,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.gray[50],
        borderRadius: BORDER_RADIUS.md,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 2,
    },
    optionDesc: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
});
