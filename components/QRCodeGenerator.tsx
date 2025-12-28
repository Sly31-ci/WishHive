/**
 * QR Code Generator Component
 * 
 * Generates and displays QR codes for wishlist sharing
 * and seller POS verification.
 */

import React from 'react';
import { View, Text, StyleSheet, Share, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Download, Share2 } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import Button from './Button';
import { Card } from './Card';

interface QRCodeGeneratorProps {
    data: string;
    title?: string;
    subtitle?: string;
    size?: number;
    logoUrl?: string;
    onShare?: () => void;
    onDownload?: () => void;
}

export default function QRCodeGenerator({
    data,
    title = 'Scan to View',
    subtitle,
    size = 200,
    logoUrl,
    onShare,
    onDownload,
}: QRCodeGeneratorProps) {
    const handleShare = async () => {
        try {
            await Share.share({
                message: `${title}\n\n${data}`,
                title: title,
            });
            onShare?.();
        } catch (error) {
            console.error('Error sharing QR code:', error);
        }
    };

    return (
        <Card style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

            <View style={styles.qrContainer}>
                <QRCode
                    value={data}
                    size={size}
                    color={COLORS.dark}
                    backgroundColor={COLORS.light}
                    logo={logoUrl ? { uri: logoUrl } : undefined}
                    logoSize={logoUrl ? 40 : undefined}
                    logoBackgroundColor={COLORS.light}
                    logoMargin={4}
                    logoBorderRadius={8}
                />
            </View>

            <Text style={styles.hint}>
                Point your camera at this code to open
            </Text>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                    <Share2 color={COLORS.primary} size={20} />
                    <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>

                {onDownload && (
                    <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
                        <Download color={COLORS.primary} size={20} />
                        <Text style={styles.actionText}>Download</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.urlText} numberOfLines={2} ellipsizeMode="middle">
                {data}
            </Text>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        gap: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.gray[500],
        textAlign: 'center',
    },
    qrContainer: {
        padding: 16,
        backgroundColor: COLORS.light,
        borderRadius: 16,
        marginVertical: 8,
    },
    hint: {
        fontSize: 14,
        color: COLORS.gray[500],
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: 24,
        marginTop: 8,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: COLORS.primary + '10',
        borderRadius: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    urlText: {
        fontSize: 12,
        color: COLORS.gray[500],
        fontFamily: 'monospace',
        textAlign: 'center',
        marginTop: 8,
        paddingHorizontal: 16,
    },
});
