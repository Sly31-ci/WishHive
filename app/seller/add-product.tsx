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
import Button from '@/components/Button';
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
            console.log('📸 Starting image upload...');

            const fileName = `${user?.id}/${Date.now()}.${fileExtension}`;
            console.log('📁 Uploading to:', fileName);

            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(fileName, decode(base64Data), {
                    contentType: `image/${fileExtension}`,
                    upsert: false,
                });

            if (error) {
                console.error('❌ Upload error:', error);

                // Check if it's a bucket not found error
                if (error.message?.includes('Bucket not found') || error.message?.includes('bucket')) {
                    throw new Error(
                        'Le bucket de stockage n\'existe pas encore.\n\n' +
                        'Veuillez créer le bucket "product-images" dans votre dashboard Supabase.\n\n' +
                        'Consultez STORAGE_SETUP.md pour les instructions.'
                    );
                }

                throw error;
            }

            console.log('✅ Image uploaded:', data);

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(fileName);

            console.log('🔗 Public URL:', publicUrl);
            setImages([...images, publicUrl]);

            Alert.alert('✅ Succès', 'Image ajoutée avec succès!');
        } catch (error: any) {
            console.error('❌ Error uploading image:', error);
            Alert.alert(
                '❌ Échec de l\'upload',
                error.message || 'Impossible d\'uploader l\'image. Veuillez réessayer.'
            );
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
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        try {
            setLoading(true);
            console.log('🚀 Starting product creation...');

            // 1. Get seller ID
            console.log('📝 Fetching seller profile for user:', user?.id);
            const { data: sellerData, error: sellerError } = await supabase
                .from('sellers')
                .select('id')
                .eq('user_id', user?.id!)
                .single();

            if (sellerError) {
                console.error('❌ Seller error:', sellerError);
                throw new Error('Profil vendeur non trouvé. Veuillez vous inscrire comme vendeur d\'abord.');
            }

            if (!sellerData) {
                console.error('❌ No seller data found');
                throw new Error('Profil vendeur non trouvé');
            }

            console.log('✅ Seller found:', sellerData.id);

            // 2. Create product
            console.log('📦 Creating product with data:', {
                seller_id: sellerData.id,
                title,
                price: parseFloat(price),
                stock_count: parseInt(stock),
                images_count: images.length
            });

            const { data: productData, error: productError } = await supabase
                .from('products')
                .insert({
                    seller_id: sellerData.id,
                    title,
                    description: description || null,
                    price: parseFloat(price),
                    stock_count: parseInt(stock),
                    currency: 'USD',
                    is_active: true,
                    images: images.length > 0 ? images : [],
                    variations: {}
                })
                .select()
                .single();

            if (productError) {
                console.error('❌ Product creation error:', productError);
                throw productError;
            }

            console.log('✅ Product created successfully:', productData);

            // Clear form
            setTitle('');
            setDescription('');
            setPrice('');
            setStock('');
            setImages([]);

            Alert.alert(
                '✅ Succès',
                `Produit "${title}" créé avec succès!${images.length > 0 ? `\n${images.length} image(s) ajoutée(s)` : ''}`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            console.log('🔙 Navigating back to seller dashboard');
                            router.back();
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('❌ Error adding product:', error);
            Alert.alert(
                'Erreur',
                error.message || 'Échec de la création du produit. Veuillez réessayer.',
                [{ text: 'OK' }]
            );
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
