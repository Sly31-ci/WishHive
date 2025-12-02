import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/Colors';

interface BadgeProps {
    name: string;
    description: string;
    iconUrl: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    earned?: boolean;
    earnedAt?: string;
}

export function Badge({ name, description, iconUrl, tier, earned = false }: BadgeProps) {
    const getTierColor = (tier: string) => {
        const colors: Record<string, string> = {
            bronze: '#CD7F32',
            silver: '#C0C0C0',
            gold: '#FFD700',
            platinum: '#E5E4E2',
        };
        return colors[tier] || Colors.textSecondary;
    };

    return (
        <View style={[styles.container, !earned && styles.locked]}>
            <View style={[styles.iconContainer, { borderColor: getTierColor(tier) }]}>
                <Image source={{ uri: iconUrl }} style={styles.icon} />
                {!earned && <View style={styles.lockOverlay} />}
            </View>

            <View style={styles.content}>
                <Text style={[styles.name, !earned && styles.lockedText]}>{name}</Text>
                <Text style={[styles.description, !earned && styles.lockedText]} numberOfLines={2}>
                    {description}
                </Text>
                <View style={[styles.tierBadge, { backgroundColor: getTierColor(tier) }]}>
                    <Text style={styles.tierText}>{tier}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    locked: {
        opacity: 0.5,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        position: 'relative',
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.dark,
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    lockedText: {
        color: Colors.textSecondary,
    },
    tierBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    tierText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
        textTransform: 'uppercase',
    },
});
