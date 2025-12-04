import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    FlatList,
    Modal,
} from 'react-native';
import { router, Stack } from 'expo-router';
import {
    ArrowLeft,
    Users,
    UserPlus,
    UserMinus,
    Share2,
    TrendingUp,
    Plus,
} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

type FriendCircle = {
    id: string;
    name: string;
    description: string | null;
    member_count: number;
    created_at: string;
};

type CircleMember = {
    id: string;
    user_id: string;
    username: string;
    avatar_url: string | null;
};

export default function FriendCirclesScreen() {
    const { user } = useAuth();
    const [circles, setCircles] = useState<FriendCircle[]>([]);
    const [selectedCircle, setSelectedCircle] = useState<FriendCircle | null>(null);
    const [members, setMembers] = useState<CircleMember[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [newCircleName, setNewCircleName] = useState('');
    const [newCircleDescription, setNewCircleDescription] = useState('');
    const [addMemberEmail, setAddMemberEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCircles();
    }, []);

    const loadCircles = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('friend_circles')
                .select(`
                    id,
                    name,
                    description,
                    created_at,
                    circle_members (count)
                `)
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedCircles = data?.map((c: any) => ({
                id: c.id,
                name: c.name,
                description: c.description,
                member_count: c.circle_members?.[0]?.count || 0,
                created_at: c.created_at,
            })) || [];

            setCircles(formattedCircles);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCircleMembers = async (circleId: string) => {
        try {
            const { data, error } = await supabase
                .from('circle_members')
                .select(`
                    id,
                    user_id,
                    profiles:user_id (
                        username,
                        avatar_url
                    )
                `)
                .eq('circle_id', circleId);

            if (error) throw error;

            const formattedMembers = data?.map((m: any) => ({
                id: m.id,
                user_id: m.user_id,
                username: m.profiles?.username || 'Unknown',
                avatar_url: m.profiles?.avatar_url,
            })) || [];

            setMembers(formattedMembers);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleCreateCircle = async () => {
        if (!newCircleName.trim() || !user) return;

        try {
            const { data, error } = await supabase
                .from('friend_circles')
                .insert({
                    owner_id: user.id,
                    name: newCircleName.trim(),
                    description: newCircleDescription.trim() || null,
                })
                .select()
                .single();

            if (error) throw error;

            setNewCircleName('');
            setNewCircleDescription('');
            setShowCreateModal(false);
            loadCircles();
            Alert.alert('Success', 'Friend circle created!');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleAddMember = async () => {
        if (!addMemberEmail.trim() || !selectedCircle || !user) return;

        try {
            // Find user by email
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('id, username')
                .eq('email', addMemberEmail.toLowerCase())
                .single();

            if (profileError) {
                Alert.alert('Error', 'User not found');
                return;
            }

            // Check if already a member
            const existing = members.find(m => m.user_id === profile.id);
            if (existing) {
                Alert.alert('Error', 'User is already in this circle');
                return;
            }

            // Add member
            const { error: insertError } = await supabase
                .from('circle_members')
                .insert({
                    circle_id: selectedCircle.id,
                    user_id: profile.id,
                });

            if (insertError) throw insertError;

            setAddMemberEmail('');
            loadCircleMembers(selectedCircle.id);
            loadCircles(); // Refresh member count
            Alert.alert('Success', `${profile.username} added to circle!`);
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const handleRemoveMember = async (memberId: string, username: string) => {
        Alert.alert(
            'Remove Member',
            `Remove ${username} from this circle?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('circle_members')
                                .delete()
                                .eq('id', memberId);

                            if (error) throw error;

                            if (selectedCircle) {
                                loadCircleMembers(selectedCircle.id);
                                loadCircles(); // Refresh member count
                            }
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteCircle = async (circleId: string, circleName: string) => {
        Alert.alert(
            'Delete Circle',
            `Delete "${circleName}"? This will remove all members.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('friend_circles')
                                .delete()
                                .eq('id', circleId);

                            if (error) throw error;

                            loadCircles();
                            Alert.alert('Success', 'Circle deleted');
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const handleViewMembers = (circle: FriendCircle) => {
        setSelectedCircle(circle);
        loadCircleMembers(circle.id);
        setShowMembersModal(true);
    };

    const renderCircle = ({ item }: { item: FriendCircle }) => (
        <Card style={styles.circleCard}>
            <View style={styles.circleHeader}>
                <View style={styles.circleIcon}>
                    <Users size={24} color={COLORS.primary} />
                </View>
                <View style={styles.circleInfo}>
                    <Text style={styles.circleName}>{item.name}</Text>
                    {item.description && (
                        <Text style={styles.circleDescription}>{item.description}</Text>
                    )}
                    <Text style={styles.memberCount}>
                        {item.member_count} member{item.member_count !== 1 ? 's' : ''}
                    </Text>
                </View>
            </View>
            <View style={styles.circleActions}>
                <TouchableOpacity
                    onPress={() => handleViewMembers(item)}
                    style={styles.actionButton}
                >
                    <Users size={18} color={COLORS.primary} />
                    <Text style={styles.actionButtonText}>Members</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDeleteCircle(item.id, item.name)}
                    style={[styles.actionButton, styles.deleteButton]}
                >
                    <UserMinus size={18} color={COLORS.error} />
                    <Text style={[styles.actionButtonText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );

    const renderMember = ({ item }: { item: CircleMember }) => (
        <View style={styles.memberItem}>
            <View style={styles.memberInfo}>
                <View style={styles.memberAvatar}>
                    <Users size={16} color={COLORS.primary} />
                </View>
                <Text style={styles.memberName}>{item.username}</Text>
            </View>
            <TouchableOpacity
                onPress={() => handleRemoveMember(item.id, item.username)}
                style={styles.removeMemberButton}
            >
                <UserMinus size={16} color={COLORS.error} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Friend Circles',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => setShowCreateModal(true)}>
                            <Plus size={24} color={COLORS.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView style={styles.content}>
                {/* Info Card */}
                <Card style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Organize Your Friends</Text>
                    <Text style={styles.infoText}>
                        Create circles to group friends and share wishlists with specific groups
                    </Text>
                </Card>

                {/* Circles List */}
                <FlatList
                    data={circles}
                    renderItem={renderCircle}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    ListEmptyComponent={
                        <Card style={styles.emptyCard}>
                            <Users size={48} color={COLORS.textLight} />
                            <Text style={styles.emptyText}>No circles yet</Text>
                            <Text style={styles.emptySubtext}>
                                Create your first circle to organize friends
                            </Text>
                            <Button
                                title="Create Circle"
                                onPress={() => setShowCreateModal(true)}
                                style={styles.createButton}
                            />
                        </Card>
                    }
                />
            </ScrollView>

            {/* Create Circle Modal */}
            <Modal
                visible={showCreateModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCreateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create Friend Circle</Text>
                        <Input
                            placeholder="Circle name (e.g., Family, Work Friends)"
                            value={newCircleName}
                            onChangeText={setNewCircleName}
                        />
                        <Input
                            placeholder="Description (optional)"
                            value={newCircleDescription}
                            onChangeText={setNewCircleDescription}
                            multiline
                        />
                        <View style={styles.modalActions}>
                            <Button
                                title="Cancel"
                                onPress={() => setShowCreateModal(false)}
                                variant="outline"
                                style={styles.modalButton}
                            />
                            <Button
                                title="Create"
                                onPress={handleCreateCircle}
                                disabled={!newCircleName.trim()}
                                style={styles.modalButton}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Members Modal */}
            <Modal
                visible={showMembersModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowMembersModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedCircle?.name} Members
                        </Text>

                        <View style={styles.addMemberSection}>
                            <Input
                                placeholder="Add member by email"
                                value={addMemberEmail}
                                onChangeText={setAddMemberEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                            <Button
                                title="Add"
                                onPress={handleAddMember}
                                disabled={!addMemberEmail.trim()}
                            />
                        </View>

                        <FlatList
                            data={members}
                            renderItem={renderMember}
                            keyExtractor={(item) => item.id}
                            style={styles.membersList}
                            ListEmptyComponent={
                                <Text style={styles.emptyMembersText}>
                                    No members yet. Add someone to get started!
                                </Text>
                            }
                        />

                        <Button
                            title="Close"
                            onPress={() => setShowMembersModal(false)}
                            variant="outline"
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: SPACING.md,
    },
    infoCard: {
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.primary + '10',
        borderColor: COLORS.primary + '30',
        borderWidth: 1,
    },
    infoTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    infoText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.dark,
        lineHeight: 20,
    },
    circleCard: {
        marginBottom: SPACING.md,
    },
    circleHeader: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    circleIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    circleInfo: {
        flex: 1,
    },
    circleName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: SPACING.xs,
    },
    circleDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    memberCount: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '500',
    },
    circleActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.xs,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
        backgroundColor: COLORS.backgroundSecondary,
    },
    deleteButton: {
        backgroundColor: COLORS.error + '10',
    },
    actionButtonText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.primary,
    },
    deleteText: {
        color: COLORS.error,
    },
    emptyCard: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
        marginBottom: SPACING.xs,
    },
    emptySubtext: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textLight,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    createButton: {
        minWidth: 200,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    modalContent: {
        backgroundColor: COLORS.background,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: '700',
        color: COLORS.dark,
        marginBottom: SPACING.lg,
    },
    modalActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.md,
    },
    modalButton: {
        flex: 1,
    },
    addMemberSection: {
        marginBottom: SPACING.lg,
    },
    membersList: {
        maxHeight: 300,
        marginBottom: SPACING.lg,
    },
    memberItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    memberAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.sm,
    },
    memberName: {
        fontSize: FONT_SIZES.md,
        color: COLORS.dark,
    },
    removeMemberButton: {
        padding: SPACING.sm,
    },
    emptyMembersText: {
        textAlign: 'center',
        color: COLORS.textSecondary,
        fontSize: FONT_SIZES.sm,
        paddingVertical: SPACING.lg,
    },
});
