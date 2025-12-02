/**
 * Verification Status Component
 * 
 * Displays the current status of a purchase verification
 * with appropriate icons, colors, and messaging.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import Card from './Card';

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'review_required';

interface VerificationStatusProps {
    status: VerificationStatus;
    verifiedAt?: string;
    rejectionReason?: string;
    estimatedTime?: string;
}

export default function VerificationStatus({
    status,
    verifiedAt,
    rejectionReason,
    estimatedTime = '24-48 hours',
}: VerificationStatusProps) {
    const getStatusConfig = () => {
        switch (status) {
            case 'approved':
                return {
                    icon: <CheckCircle2 color={Colors.success} size={48} />,
                    title: 'Verified ✓',
                    message: 'Your purchase has been verified!',
                    color: Colors.success,
                    backgroundColor: Colors.success + '10',
                };
            case 'rejected':
                return {
                    icon: <XCircle color={Colors.error} size={48} />,
                    title: 'Verification Failed',
                    message: rejectionReason || 'Could not verify this purchase.',
                    color: Colors.error,
                    backgroundColor: Colors.error + '10',
                };
            case 'review_required':
                return {
                    icon: <AlertTriangle color={Colors.warning} size={48} />,
                    title: 'Manual Review Required',
                    message: `This verification requires admin review. Expected time: ${estimatedTime}`,
                    color: Colors.warning,
                    backgroundColor: Colors.warning + '10',
                };
            case 'pending':
            default:
                return {
                    icon: <Clock color={Colors.primary} size={48} />,
                    title: 'Pending Verification',
                    message: `Awaiting seller confirmation. Expected time: ${estimatedTime}`,
                    color: Colors.primary,
                    backgroundColor: Colors.primary + '10',
                };
        }
    };

    const config = getStatusConfig();

    return (
        <Card style={[styles.container, { backgroundColor: config.backgroundColor }]}>
            <View style={styles.iconContainer}>{config.icon}</View>

            <Text style={[styles.title, { color: config.color }]}>
                {config.title}
            </Text>

            <Text style={styles.message}>{config.message}</Text>

            {verifiedAt && status === 'approved' && (
                <Text style={styles.timestamp}>
                    Verified on {new Date(verifiedAt).toLocaleDateString()}
                </Text>
            )}

            {status === 'pending' && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        You'll receive a notification once the seller confirms your purchase.
                    </Text>
                </View>
            )}

            {status === 'review_required' && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Our team will manually review your submission. This typically takes 1-2 business days.
                    </Text>
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
        color: Colors.gray,
        textAlign: 'center',
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 14,
        color: Colors.gray,
        marginTop: 4,
    },
    infoBox: {
        marginTop: 16,
        padding: 12,
        backgroundColor: Colors.light,
        borderRadius: 8,
        width: '100%',
    },
    infoText: {
        fontSize: 14,
        color: Colors.dark,
        textAlign: 'center',
        lineHeight: 20,
    },
});
