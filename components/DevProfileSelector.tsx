import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { User, Settings } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { DEV_PROFILES } from '@/lib/devProfiles';
import { COLORS } from '@/constants/theme';
import Constants from 'expo-constants';

const DEV_MODE = Constants.expoConfig?.extra?.EXPO_PUBLIC_DEV_MODE === 'true';

export function DevProfileSelector() {
    const [isOpen, setIsOpen] = useState(false);
    const { devProfile, switchDevProfile } = useAuth();

    // Only render in dev mode
    if (!DEV_MODE) return null;

    const handleSelectProfile = async (profileId: string) => {
        await switchDevProfile(profileId);
        setIsOpen(false);
    };

    const getProfileIcon = (type: string) => {
        switch (type) {
            case 'normal':
                return '👤';
            case 'seller':
                return '🏪';
            case 'admin':
                return '⚡';
            case 'power':
                return '🚀';
            default:
                return '👤';
        }
    };

    const getProfileColor = (type: string) => {
        switch (type) {
            case 'normal':
                return '#3498db';
            case 'seller':
                return '#e67e22';
            case 'admin':
                return '#e74c3c';
            case 'power':
                return '#9b59b6';
            default:
                return '#3498db';
        }
    };

    return (
        <>
            {/* Floating Button */}
            <TouchableOpacity
                style={[
                    styles.floatingButton,
                    { backgroundColor: devProfile ? getProfileColor(devProfile.type) : COLORS.primary },
                ]}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.8}
            >
                <Text style={styles.floatingButtonIcon as any}>
                    {devProfile ? getProfileIcon(devProfile.type) : '👤'}
                </Text>
                <Settings size={12} color="#fff" style={styles.settingsIcon} />
            </TouchableOpacity>

            {/* Profile Selector Modal */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setIsOpen(false)}>
                    <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle as any}>🔧 Dev Mode Profiles</Text>
                            <TouchableOpacity onPress={() => setIsOpen(false)}>
                                <Text style={styles.closeButton as any}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.profileList}>
                            {DEV_PROFILES.map((profile) => {
                                const isActive = devProfile?.id === profile.id;
                                return (
                                    <TouchableOpacity
                                        key={profile.id}
                                        style={[
                                            styles.profileItem,
                                            isActive && styles.profileItemActive,
                                            { borderLeftColor: getProfileColor(profile.type) },
                                        ]}
                                        onPress={() => handleSelectProfile(profile.id)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.profileItemLeft}>
                                            <Text style={styles.profileIcon as any}>{getProfileIcon(profile.type)}</Text>
                                            <View style={styles.profileInfo}>
                                                <Text style={styles.profileUsername as any}>
                                                    {profile.profile.username}
                                                </Text>
                                                <Text style={styles.profileBio as any} numberOfLines={1}>
                                                    {profile.profile.bio}
                                                </Text>
                                                <View style={styles.profileStats}>
                                                    <Text style={styles.profileStat as any}>
                                                        Lvl {profile.profile.level}
                                                    </Text>
                                                    <Text style={styles.profileStat as any}>•</Text>
                                                    <Text style={styles.profileStat as any}>
                                                        {profile.profile.points} pts
                                                    </Text>
                                                    {profile.wishlists && profile.wishlists.length > 0 && (
                                                        <>
                                                            <Text style={styles.profileStat as any}>•</Text>
                                                            <Text style={styles.profileStat as any}>
                                                                {profile.wishlists.length} wishlists
                                                            </Text>
                                                        </>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                        {isActive && (
                                            <View style={styles.activeIndicator}>
                                                <Text style={styles.activeIndicatorText as any}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <Text style={styles.footerText as any}>
                                Sélectionnez un profil pour tester différents types d'utilisateurs
                            </Text>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        zIndex: 9999,
    },
    floatingButtonIcon: {
        fontSize: 24,
    },
    settingsIcon: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 500,
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.dark,
    },
    closeButton: {
        fontSize: 24,
        color: COLORS.gray,
        fontWeight: 'bold',
    },
    profileList: {
        padding: 16,
    },
    profileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderLeftWidth: 4,
    },
    profileItemActive: {
        backgroundColor: '#e8f5e9',
    },
    profileItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profileIcon: {
        fontSize: 32,
        marginRight: 12,
    },
    profileInfo: {
        flex: 1,
    },
    profileUsername: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 4,
    },
    profileBio: {
        fontSize: 13,
        color: COLORS.gray,
        marginBottom: 6,
    },
    profileStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    profileStat: {
        fontSize: 11,
        color: COLORS.gray,
        fontWeight: '600',
    },
    activeIndicator: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIndicatorText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#f8f9fa',
    },
    footerText: {
        fontSize: 12,
        color: COLORS.gray,
        textAlign: 'center',
    },
});
