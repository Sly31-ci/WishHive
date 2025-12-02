import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Share2, Eye, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface WishlistCardProps {
    id: string;
    title: string;
    description?: string;
    type: string;
    dueDate?: string;
    viewCount: number;
    itemCount: number;
    imageUrl?: string;
    onPress: () => void;
}

export function WishlistCard({
    title,
    description,
    type,
    dueDate,
    viewCount,
    itemCount,
    imageUrl,
    onPress,
}: WishlistCardProps) {
    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            birthday: Colors.accent,
            wedding: '#FFB6C1',
            christmas: '#2BD4A5',
            baby: '#87CEEB',
            general: Colors.primary,
        };
        return colors[type] || Colors.primary;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            {imageUrl && (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            )}
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={[styles.typeBadge, { backgroundColor: getTypeColor(type) }]}>
                        <Text style={styles.typeText}>{type}</Text>
                    </View>
                    <TouchableOpacity style={styles.shareButton}>
                        <Share2 size={18} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title} numberOfLines={2}>
                    {title}
                </Text>

                {description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {description}
                    </Text>
                )}

                <View style={styles.footer}>
                    <View style={styles.stat}>
                        <Eye size={16} color={Colors.textSecondary} />
                        <Text style={styles.statText}>{viewCount}</Text>
                    </View>

                    <View style={styles.stat}>
                        <Heart size={16} color={Colors.textSecondary} />
                        <Text style={styles.statText}>{itemCount} items</Text>
                    </View>

                    {dueDate && (
                        <View style={styles.stat}>
                            <Calendar size={16} color={Colors.textSecondary} />
                            <Text style={styles.statText}>{dueDate}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 180,
        resizeMode: 'cover',
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    typeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    shareButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.dark,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 16,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        gap: 16,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
});
