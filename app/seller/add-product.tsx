import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { ArrowLeft, Upload, DollarSign, Package, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

export default function AddProductScreen() {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                if (asset.base64) {
                    await uploadImage(asset.base64, asset.uri.split('.').pop() || 'jpg');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const uploadImage = async (base64Data: string, fileExtension: string) => {
        try {
            setUploading(true);
            const fileName = `${user?.id}/${Date.now()}.${fileExtension}`;
            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(fileName, decode(base64Data), {
                    contentType: `image/${fileExtension}`,
                    upsert: false,
                });

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            setImages([...images, publicUrl]);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            Alert.alert('Upload Failed', 'Could not upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleAddProduct = async () => {
        if (!title || !price || !stock) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            // 1. Get seller ID
            const { data: sellerData, error: sellerError } = await supabase
                .from('sellers')
                .select('id')
                .eq('user_id', user?.id!)
                .single();

            if (sellerError || !sellerData) {
                throw new Error('Seller profile not found');
            }

            // 2. Create product
            const { error: productError } = await supabase
                .from('products')
                .insert({
                    seller_id: sellerData.id,
                    title,
                    description,
                    price: parseFloat(price),
                    stock_count: parseInt(stock),
                    currency: 'USD',
                    is_active: true,
                    images: images,
                    variations: {}
                });

            if (productError) throw productError;

            Alert.alert('Success', 'Product added successfully!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Error adding product:', error);
            Alert.alert('Error', error.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: 'Add New Product',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ArrowLeft size={24} color={COLORS.dark} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Product Title *</Text>
                        <Card style={styles.inputCard}>
                            <Input
                                placeholder="e.g. Handmade Ceramic Mug"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </Card>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Price (USD) *</Text>
                            <Card style={styles.inputCard}>
                                <Input
                                    placeholder="0.00"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="decimal-pad"
                                    icon={<DollarSign size={20} color={COLORS.gray[400]} />}
                                />
                            </Card>
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Stock *</Text>
                            <Card style={styles.inputCard}>
                                <Input
                                    placeholder="0"
                                    value={stock}
                                    onChangeText={setStock}
                                    keyboardType="number-pad"
                                    icon={<Package size={20} color={COLORS.gray[400]} />}
                                />
                            </Card>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description</Text>
                        <Card style={styles.inputCard}>
                            <Input
                                placeholder="Describe your product..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                            />
                        </Card>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Images</Text>
                        <View style={styles.imagesContainer}>
                            {images.map((uri, index) => (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri }} style={styles.uploadedImage} />
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={() => removeImage(index)}
                                    >
                                        <X size={16} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <TouchableOpacity
                                style={styles.uploadButton}
                                onPress={pickImage}
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <ActivityIndicator color={COLORS.primary} />
                                ) : (
                                    <>
                                        <Upload size={24} color={COLORS.primary} />
                                        <Text style={styles.uploadText}>Add Image</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button
                        title="Create Product"
                        onPress={handleAddProduct}
                        loading={loading}
                        style={styles.submitButton}
                    />
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
        padding: SPACING.lg,
    },
    form: {
        gap: SPACING.lg,
    },
    inputGroup: {
        gap: SPACING.xs,
    },
    row: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.dark,
        marginLeft: SPACING.xs,
    },
    inputCard: {
        padding: SPACING.xs,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
    },
    imageWrapper: {
        width: 100,
        height: 100,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
        position: 'relative',
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        padding: 4,
    },
    uploadButton: {
        width: 100,
        height: 100,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        gap: SPACING.xs,
    },
    uploadText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: FONT_SIZES.xs,
    },
    submitButton: {
        marginTop: SPACING.md,
    },
});
