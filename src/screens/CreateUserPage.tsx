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
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';
import { Image } from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const CreateUserPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
    siteName: '',
    siteAddress: '',
    city: '',
    state: '',
    pinCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter name');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter email');
      return;
    }

    if (!formData.mobile.trim() || formData.mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!formData.role.trim()) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    setIsLoading(true);
    
    // TODO: API call will be added here later
    // For now, just show success message
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'User created successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              name: '',
              email: '',
              mobile: '',
              password: '',
              confirmPassword: '',
              role: '',
              siteName: '',
              siteAddress: '',
              city: '',
              state: '',
              pinCode: '',
            });
            navigateTo('/dashboard');
          },
        },
      ]);
    }, 1000);
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      
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
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitText}>
            {isLoading ? 'CREATING...' : 'CREATE'}
          </Text>
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
            <Text style={styles.inputLabel}>Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter name"
              placeholderTextColor="#999999"
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
              placeholder="Enter email"
              placeholderTextColor="#999999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Mobile */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mobile Number *</Text>
            <View style={styles.mobileInputWrapper}>
              <TextInput
                style={styles.mobileTextInput}
                value={formData.mobile}
                onChangeText={(value) => handleInputChange('mobile', value)}
                placeholder="Enter mobile number"
                placeholderTextColor="#999999"
                keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'}
                maxLength={10}
              />
              <Text style={styles.characterCount}>{formData.mobile.length}/10</Text>
            </View>
            <View style={styles.inputUnderline} />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              placeholder="Enter password"
              placeholderTextColor="#999999"
              secureTextEntry
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              placeholder="Confirm password"
              placeholderTextColor="#999999"
              secureTextEntry
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Role */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Role *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.role}
              onChangeText={(value) => handleInputChange('role', value)}
              placeholder="Enter role (e.g., Admin, User, Manager)"
              placeholderTextColor="#999999"
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Site Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Site Name</Text>
            <TextInput
              style={styles.textInput}
              value={formData.siteName}
              onChangeText={(value) => handleInputChange('siteName', value)}
              placeholder="Enter site name"
              placeholderTextColor="#999999"
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Site Address */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Site Address</Text>
            <TextInput
              style={styles.textInput}
              value={formData.siteAddress}
              onChangeText={(value) => handleInputChange('siteAddress', value)}
              placeholder="Enter site address"
              placeholderTextColor="#999999"
              multiline
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* City */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.textInput}
              value={formData.city}
              onChangeText={(value) => handleInputChange('city', value)}
              placeholder="Enter city"
              placeholderTextColor="#999999"
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* State */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>State</Text>
            <TextInput
              style={styles.textInput}
              value={formData.state}
              onChangeText={(value) => handleInputChange('state', value)}
              placeholder="Enter state"
              placeholderTextColor="#999999"
            />
            <View style={styles.inputUnderline} />
          </View>

          {/* Pin Code */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pin Code</Text>
            <TextInput
              style={styles.textInput}
              value={formData.pinCode}
              onChangeText={(value) => handleInputChange('pinCode', value)}
              placeholder="Enter pin code"
              placeholderTextColor="#999999"
              keyboardType="numeric"
              maxLength={6}
            />
            <View style={styles.inputUnderline} />
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
});

export default CreateUserPage;

