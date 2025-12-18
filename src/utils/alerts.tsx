import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Dimensions,
    Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    buttons: AlertButton[];
    onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    buttons,
    onClose,
}) => {
    const handleButtonPress = (onPress?: () => void) => {
        if (onPress) {
            onPress();
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonContainer}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    button.style === 'cancel' && styles.cancelButton,
                                    button.style === 'destructive' && styles.destructiveButton,
                                ]}
                                onPress={() => handleButtonPress(button.onPress)}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        button.style === 'cancel' && styles.cancelButtonText,
                                        button.style === 'destructive' && styles.destructiveButtonText,
                                    ]}
                                >
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '100%',
        maxWidth: 350,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    message: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
    button: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginLeft: 10,
        borderRadius: 5,
        backgroundColor: '#2196F3',
        minWidth: 70,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    destructiveButton: {
        backgroundColor: '#f44336',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    cancelButtonText: {
        color: '#333',
    },
    destructiveButtonText: {
        color: 'white',
    },
});

// Cross-platform Alert utility
class CrossPlatformAlert {
    private static showAlert = (
        title: string,
        message: string,
        buttons: AlertButton[] = [{ text: 'OK' }]
    ) => {
        // For web platform, we'll use our custom alert
        if (Platform.OS === 'web') {
            // We'll store alert data in a way that components can access it
            // This requires the app to wrap the root component with our alert provider
            if (typeof window !== 'undefined') {
                const event = new CustomEvent('showCustomAlert', {
                    detail: { title, message, buttons },
                });
                window.dispatchEvent(event);
            }
            return;
        }

        // For mobile platforms, use the native Alert
        // Note: This would require importing Alert from react-native in the consuming component
        console.warn(
            'CrossPlatformAlert: Native Alert not available in this context. Please use the native Alert component for mobile platforms.'
        );
    };

    static alert = (
        title: string,
        message: string,
        buttons?: AlertButton[],
        _options?: { cancelable?: boolean; onDismiss?: () => void }
    ) => {
        this.showAlert(title, message, buttons || [{ text: 'OK' }]);
    };
}

export { CustomAlert, CrossPlatformAlert };