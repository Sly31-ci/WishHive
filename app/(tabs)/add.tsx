import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '@/constants/theme';

// This is a placeholder screen for the FAB (Floating Action Button)
// It should never be visible as the FAB redirects to other screens
export default function AddScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Add Screen Placeholder</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.light,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    text: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.gray[600],
    },
});
