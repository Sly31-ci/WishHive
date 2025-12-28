import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    TextInput,
    FlatList,
} from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
    ArrowLeft,
    UserPlus,
    Users,
    Trash2,
    Shield,
    MessageCircle,
    History,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

type Collaborator = {
    id: string;
    user_id: string;
    username: string;
    avatar_url: string | null;
    role: 'owner' | 'editor' | 'viewer';
    added_at: string;
};

type Activity = {
    id: string;
    user_id: string;
    username: string;
    action: string;
    timestamp: string;
};

export default function CollaborativeWishlistScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [wishlistTitle, setWishlistTitle] = useState('');
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        loadCollaborativeData();
    }, [id]);

    const loadCollaborativeData = async () => {
        if (!id || !user) return;

        try {
            // Load wishlist details
            const { data: wishlist, error: wishlistError } = await supabase
                .from('wishlists')
                .select('title, owner_id')
                .eq('id', id)
                .single();

            if (wishlistError) throw wishlistError;

            setWishlistTitle(wishlist.title);
            setIsOwner(wishlist.owner_id === user.id);

            // Load collaborators
            const { data: collabData, error: collabError } = await supabase
                .from('collaborative_wishlists')
                .select(`
                    id,
                    user_id,
                    role,
                    added_at,
                    profiles:user_id (
                        username,
                        avatar_url
                    )
                `)
                .eq('wishlist_id', id);

            if (collabError) throw collabError;

            const formattedCollabs = collabData?.map((c: any) => ({
                id: c.id,
                user_id: c.user_id,
                username: c.profiles?.username || 'Unknown',
                avatar_url: c.profiles?.avatar_url,
                role: c.role,
                added_at: c.added_at,
            })) || [];

            setCollaborators(formattedCollabs);

            // Load activity history
            const { data: activityData, error: activityError } = await supabase
                .from('wishlist_activities')
                .select(`
                    id,
                    user_id,
                    action,
                    created_at,
                    profiles:user_id (
                        username
                    )
                `)
                .eq('wishlist_id', id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (activityError) throw activityError;

            const formattedActivities = activityData?.map((a: any) => ({
                id: a.id,
                user_id: a.user_id,
                username: a.profiles?.username || 'Unknown',
                action: a.action,
                timestamp: a.created_at,
            })) || [];

            setActivities(formattedActivities);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInviteCollaborator = async () => {
        if (!inviteEmail.trim() || !id || !user) return;

        try {
            // Find user by email
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id, username')
                .eq('email', inviteEmail.toLowerCase())
                .single();

            if (profileError) {
                Alert.alert('Error', 'User not found');
                return;
            }

            // Check if already a collaborator
            const existing = collaborators.find(c => c.user_id === profile.id);
            if (existing) {
                Alert.alert('Error', 'User is already a collaborator');
                return;
            }

            // Add collaborator
            const { error: insertError } = await supabase
                .from('collaborative_wishlists')
                .insert({
                    wishlist_id: id,
                    user_id: profile.id,
                    role: 'editor',
                });

            if (insertError) throw insertError;

            // Log activity
            await supabase.from('wishlist_activities').insert({
                wishlist_id: id,
                user_id: user.id,
                action: `invited ${profile.username} as editor`,
            });

            setInviteEmail('');
            loadCollaborativeData();
            Alert.alert('Success', 'Collaborator invited!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleOpenChat = async () => {
        if (!id || !wishlistTitle) return;
        try {
            // Check if room already exists for this wishlist
            const { data: existingRoom } = await supabase
                .from('chat_rooms')
                .select('id')
                .eq('target_id', id)
                .eq('type', 'wishlist')
                .single();

            if (existingRoom) {
                router.push(`/social/chat/${existingRoom.id}`);
                return;
            }

            // Create new room if not exists
            const { data: newRoom, error: createError } = await supabase
                .from('chat_rooms')
                .insert({
                    type: 'wishlist',
                    target_id: id,
                    name: `Chat: ${wishlistTitle}`,
                })
                .select()
                .single();

            if (createError) throw createError;
            router.push(`/social/chat/${newRoom.id}`);

        } catch (error: any) {
            Alert.alert('Error', 'Impossible d\'ouvrir la discussion.');
        }
    };

    const handleChangeRole = async (collaboratorId: string, newRole: 'editor' | 'viewer') => {
        if (!isOwner) {
            Alert.alert('Error', 'Only the owner can change roles');
            return;
        }

        try {
            const { error } = await supabase
                .from('collaborative_wishlists')
                .update({ role: newRole })
                .eq('id', collaboratorId);

            if (error) throw error;

            if (user?.id) {
                await supabase.from('wishlist_activities').insert({
                    wishlist_id: id,
                    user_id: user.id,
                    action: `changed role to ${newRole}`,
                });
            }

            loadCollaborativeData();
            Alert.alert('Success', 'Role updated');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleRemoveCollaborator = async (collaboratorId: string, username: string) => {
        if (!isOwner) {
            Alert.alert('Error', 'Only the owner can remove collaborators');
            return;
        }

        Alert.alert(
            'Remove Collaborator',
            `Remove ${username} from this wishlist?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('collaborative_wishlists')
                                .delete()
                                .eq('id', collaboratorId);

                            if (error) throw error;

                            if (user?.id) {
                                await supabase.from('wishlist_activities').insert({
                                    wishlist_id: id,
                                    user_id: user.id,
                                    action: `removed ${username}`,
                                });
                            }

                            loadCollaborativeData();
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const renderCollaborator = ({ item }: { item: Collaborator }) => (
        <Card style={styles.collaboratorCard}>
            <View style={styles.collaboratorInfo}>
                <View style={styles.avatar}>
                    <Users size={20} color={COLORS.primary} />
                </View>
                <View style={styles.collaboratorDetails}>
                    <Text style={styles.collaboratorName}>{item.username}</Text>
                    <Text style={styles.collaboratorRole}>
                        {item.role === 'owner' ? '👑 Owner' :
                            item.role === 'editor' ? '✏️ Editor' : '👁️ Viewer'}
                    </Text>
                </View>
            </View>
            {isOwner && item.role !== 'owner' && (
                <View style={styles.collaboratorActions}>
                    <TouchableOpacity
                        onPress={() => handleChangeRole(
                            item.id,
                            item.role === 'editor' ? 'viewer' : 'editor'
                        )}
                        style={styles.roleButton}
                    >
                        <Shield size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleRemoveCollaborator(item.id, item.username)}
                        style={styles.removeButton}
                    >
                        <Trash2 size={16} color={COLORS.error} />
                    </TouchableOpacity>
                </View>
            )}
        </Card>
    );

    const renderActivity = ({ item }: { item: Activity }) => (
        <View style={styles.activityItem}>
            <View style={styles.activityDot} />
            <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                    <Text style={styles.activityUser}>{item.username}</Text> {item.action}
                </Text>
                <Text style={styles.activityTime}>
                    {new Date(item.timestamp).toLocaleString()}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Collaborative Wishlist',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.content}>
                {/* Wishlist Info */}
                <Card style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.wishlistTitle}>{wishlistTitle}</Text>
                            <Text style={styles.collaboratorCount}>
                                {collaborators.length} collaborator{collaborators.length !== 1 ? 's' : ''}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.chatIconButton}
                            onPress={handleOpenChat}
                        >
                            <MessageCircle size={24} color={COLORS.primary} />
                            <Text style={styles.chatIconText}>Discussion</Text>
                        </TouchableOpacity>
                    </View>
                </Card>

                {/* Invite Section */}
                {isOwner && (
                    <Card style={styles.inviteCard}>
                        <View style={styles.inviteHeader}>
                            <UserPlus size={20} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>Invite Collaborator</Text>
                        </View>
                        <Input
                            placeholder="Enter email address"
                            value={inviteEmail}
                            onChangeText={setInviteEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <Button
                            title="Send Invitation"
                            onPress={handleInviteCollaborator}
                            disabled={!inviteEmail.trim()}
                        />
                    </Card>
                )}

                {/* Collaborators List */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Users size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Collaborators</Text>
                    </View>
                    <FlatList
                        data={collaborators}
                        renderItem={renderCollaborator}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No collaborators yet</Text>
                        }
                    />
                </View>

                {/* Activity History */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <History size={20} color={COLORS.dark} />
                        <Text style={styles.sectionTitle}>Activity History</Text>
                    </View>
                    <Card style={styles.activityCard}>
                        <FlatList
                            data={activities}
                            renderItem={renderActivity}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>No activity yet</Text>
                            }
                        />
                    </Card>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
    },
    content: {
        flex: 1,
        padding: SPACING.md,
    },
    infoCard: {
        marginBottom: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    chatIconButton: {
        alignItems: 'center',
        padding: SPACING.sm,
        backgroundColor: COLORS.primary + '10',
        borderRadius: BORDER_RADIUS.md,
    },
    chatIconText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
        marginTop: 2,
    },
    wishlistTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    collaboratorCount: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    inviteCard: {
        marginBottom: SPACING.md,
    },
    inviteHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
    },
    collaboratorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    collaboratorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray[100],
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    collaboratorDetails: {
        flex: 1,
    },
    collaboratorName: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.dark,
    },
    collaboratorRole: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.gray[600],
    },
    collaboratorActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    roleButton: {
        padding: SPACING.sm,
    },
    removeButton: {
        padding: SPACING.sm,
    },
    activityCard: {
        padding: SPACING.md,
    },
    activityItem: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    activityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginTop: 6,
        marginRight: SPACING.sm,
    },
    activityContent: {
        flex: 1,
    },
    activityText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    activityUser: {
        fontWeight: '600',
    },
    activityTime: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.gray[600],
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.gray[600],
        fontSize: FONT_SIZES.sm,
        paddingVertical: SPACING.lg,
    },
});
