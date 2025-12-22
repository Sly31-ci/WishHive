/**
 * Receipt Upload Component
 * 
 * Allows users to upload receipt images for purchase verification
 * via camera or gallery picker. Displays OCR extraction results.
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Upload, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { extractReceiptData, OCRResult } from '@/lib/ocr-service';
import { Button } from './Button';
import { Card } from './Card';

interface ReceiptUploadProps {
    onDataExtracted: (data: OCRResult, imageUri: string) => void;
    onCancel?: () => void;
}

export default function ReceiptUpload({ onDataExtracted, onCancel }: ReceiptUploadProps) {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [ocrData, setOcrData] = useState<OCRResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted' || mediaStatus.status !== 'granted') {
            Alert.alert(
                'Permissions Required',
                'Camera and photo library access are needed to upload receipts.'
            );
            return false;
        }
        return true;
    };

    const handleTakePhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            processImage(result.assets[0].uri);
        }
    };

    const handlePickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            processImage(result.assets[0].uri);
        }
    };

    const processImage = async (uri: string) => {
        setImageUri(uri);
        setIsProcessing(true);
        setError(null);
        setOcrData(null);

        try {
            const result = await extractReceiptData(uri);

            if (result.success && result.data) {
                setOcrData(result.data);
            } else {
                setError(result.error || 'Failed to extract data from receipt');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirm = () => {
        if (ocrData && imageUri) {
            onDataExtracted(ocrData, imageUri);
        }
    };

    const handleRetry = () => {
        setImageUri(null);
        setOcrData(null);
        setError(null);
    };

    return (
        <View style={styles.container}>
            {!imageUri ? (
                <Card style={styles.uploadCard}>
                    <Text style={styles.title}>Upload Receipt</Text>
                    <Text style={styles.subtitle}>
                        Take a photo or choose from your library
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handleTakePhoto}
                        >
                            <Camera color={COLORS.primary} size={32} />
                            <Text style={styles.buttonText}>Take Photo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.uploadButton}
                            onPress={handlePickImage}
                        >
                            <Upload color={COLORS.primary} size={32} />
                            <Text style={styles.buttonText}>Choose from Library</Text>
                        </TouchableOpacity>
                    </View>

                    {onCancel && (
                        <Button
                            title="Cancel"
                            variant="ghost"
                            onPress={onCancel}
                            style={styles.cancelButton}
                        />
                    )}
                </Card>
            ) : (
                <Card style={styles.resultCard}>
                    <Image source={{ uri: imageUri }} style={styles.receiptImage} />

                    {isProcessing && (
                        <View style={styles.processingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.processingText}>
                                Extracting receipt data...
                            </Text>
                        </View>
                    )}

                    {error && !isProcessing && (
                        <View style={styles.errorContainer}>
                            <AlertCircle color={COLORS.error} size={24} />
                            <Text style={styles.errorText}>{error}</Text>
                            <Button title="Try Again" onPress={handleRetry} style={styles.retryButton} />
                        </View>
                    )}

                    {ocrData && !isProcessing && (
                        <View style={styles.dataContainer}>
                            <View style={styles.successHeader}>
                                <CheckCircle2 color={COLORS.success} size={24} />
                                <Text style={styles.successText}>Data Extracted</Text>
                            </View>

                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Merchant:</Text>
                                <Text style={styles.dataValue}>{ocrData.merchantName}</Text>
                            </View>

                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Amount:</Text>
                                <Text style={styles.dataValue}>{ocrData.amount}</Text>
                            </View>

                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Date:</Text>
                                <Text style={styles.dataValue}>{ocrData.date}</Text>
                            </View>

                            <View style={styles.dataRow}>
                                <Text style={styles.dataLabel}>Confidence:</Text>
                                <Text
                                    style={[
                                        styles.dataValue,
                                        ocrData.confidence < 0.6 && styles.lowConfidence,
                                    ]}
                                >
                                    {Math.round(ocrData.confidence * 100)}%
                                </Text>
                            </View>

                            {ocrData.confidence < 0.6 && (
                                <View style={styles.warningContainer}>
                                    <AlertCircle color={COLORS.warning} size={20} />
                                    <Text style={styles.warningText}>
                                        Low confidence detection. This will require admin review.
                                    </Text>
                                </View>
                            )}

                            <View style={styles.actionButtons}>
                                <Button
                                    title="Retake"
                                    variant="outline"
                                    onPress={handleRetry}
                                    style={styles.actionButton}
                                />
                                <Button
                                    title="Confirm"
                                    onPress={handleConfirm}
                                    style={styles.actionButton}
                                />
                            </View>
                        </View>
                    )}
                </Card>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    uploadCard: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.dark,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.gray[500],
        marginBottom: 32,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    uploadButton: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: COLORS.light,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        borderWidth: 2,
        borderColor: COLORS.primary + '20',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.dark,
        textAlign: 'center',
    },
    cancelButton: {
        marginTop: 8,
    },
    resultCard: {
        padding: 16,
    },
    receiptImage: {
        width: '100%',
        height: 300,
        borderRadius: 12,
        marginBottom: 16,
    },
    processingContainer: {
        padding: 24,
        alignItems: 'center',
        gap: 12,
    },
    processingText: {
        fontSize: 16,
        color: COLORS.gray[500],
    },
    errorContainer: {
        padding: 24,
        alignItems: 'center',
        gap: 12,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.error,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 8,
    },
    dataContainer: {
        gap: 16,
    },
    successHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    successText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.success,
    },
    dataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light,
    },
    dataLabel: {
        fontSize: 16,
        color: COLORS.gray[500],
        fontWeight: '500',
    },
    dataValue: {
        fontSize: 16,
        color: COLORS.dark,
        fontWeight: '600',
    },
    lowConfidence: {
        color: COLORS.warning,
    },
    warningContainer: {
        flexDirection: 'row',
        gap: 8,
        padding: 12,
        backgroundColor: COLORS.warning + '10',
        borderRadius: 8,
        marginTop: 8,
    },
    warningText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.warning,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    actionButton: {
        flex: 1,
    },
});
