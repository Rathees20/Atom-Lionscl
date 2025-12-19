import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Switch,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';
import { API_ENDPOINTS } from '../utils/api';
import { CustomAlert } from '../utils/alerts';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const CreateUserPage: React.FC = () => {
  const { navigateTo, user } = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    canAccessApp: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Please enter name',
        type: 'error'
      });
      return;
    }

    if (!formData.email.trim()) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Please enter email',
        type: 'error'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Please enter a valid email address',
        type: 'error'
      });
      return;
    }

    // Phone validation (if provided)
    if (formData.phone.trim() && formData.phone.length !== 10) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Please enter a valid 10-digit phone number',
        type: 'error'
      });
      return;
    }

    // Check if customer is logged in
    if (!user?.email) {
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Please login to create sub-customers',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);

    try {
      const requestBody: any = {
        customer_email: user.email,
        name: formData.name.trim(),
        email: formData.email.trim(),
        can_access_app: formData.canAccessApp,
      };

      // Add optional fields if provided
      if (formData.phone.trim()) {
        requestBody.phone = formData.phone.trim();
      }

      const response = await fetch(API_ENDPOINTS.CREATE_SUB_CUSTOMER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          visible: true,
          title: 'Success',
          message: data.message || 'Sub-customer created successfully!',
          type: 'success'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          canAccessApp: true,
        });
      } else {
        setAlert({
          visible: true,
          title: 'Error',
          message: data.error || 'Failed to create sub-customer. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating sub-customer:', error);
      setAlert({
        visible: true,
        title: 'Error',
        message: 'Network error. Please check your connection and try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const closeAlert = () => {
    setAlert({
      ...alert,
      visible: false
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />

      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        buttons={[{ text: 'OK', onPress: closeAlert }]}
        onClose={closeAlert}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('../assets/left-chevron.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create User</Text>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitText}>CREATE</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter full name"
              placeholderTextColor="#999999"
              autoFocus
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Enter email address"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.mobileInputWrapper}>
              <TextInput
                style={styles.mobileTextInput}
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value.replace(/[^0-9]/g, ''))}
                placeholder="Enter phone number (optional)"
                placeholderTextColor="#999999"
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'}
                maxLength={10}
              />
              {formData.phone.length > 0 && (
                <Text style={styles.characterCount}>{formData.phone.length}/10</Text>
              )}
            </View>
            <View style={styles.inputUnderline} />
          </View>

          {/* Can Access App Toggle */}
          <View style={styles.switchContainer}>
            <View style={styles.switchLabelContainer}>
              <Text style={styles.switchLabel}>Allow Access to Mobile App</Text>
              <Text style={styles.switchDescription}>
                Enable this to allow the sub-customer to login and access the customer mobile app
              </Text>
            </View>
            <Switch
              value={formData.canAccessApp}
              onValueChange={(value) => handleInputChange('canAccessApp', value)}
              trackColor={{ false: '#E0E0E0', true: '#FF6B6B' }}
              thumbColor={formData.canAccessApp ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  submitButton: {
    padding: 8,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  mobileInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  mobileTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    paddingRight: 50,
  },
  characterCount: {
    position: 'absolute',
    right: 0,
    fontSize: 12,
    color: '#666666',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 10,
  },
  switchLabelContainer: {
    flex: 1,
    marginRight: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
});

export default CreateUserPage;

