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
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';
import { API_ENDPOINTS } from '../utils/api';
import { CrossPlatformAlert } from '../utils/alerts';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const LoginPage: React.FC = () => {
  const { navigateTo, setUser } = useNavigation();
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedOtp, setIsFocusedOtp] = useState(false);

  const handleGenerateOTP = async () => {
    if (!email.trim()) {
      CrossPlatformAlert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      CrossPlatformAlert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.CUSTOMER_GENERATE_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        CrossPlatformAlert.alert('Success', data.message || 'OTP sent to your email');
      } else {
        CrossPlatformAlert.alert('Error', data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!email.trim()) {
      CrossPlatformAlert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!otpCode.trim() || otpCode.length !== 6) {
      CrossPlatformAlert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.CUSTOMER_VERIFY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          otp_code: otpCode.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store customer data and navigate to dashboard
        setUser(data.customer);
        navigateTo('/dashboard');
      } else {
        CrossPlatformAlert.alert('Error', data.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      CrossPlatformAlert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email.trim()) {
      CrossPlatformAlert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.CUSTOMER_RESEND_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        CrossPlatformAlert.alert('Success', data.message || 'OTP resent to your email');
      } else {
        CrossPlatformAlert.alert('Error', data.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      CrossPlatformAlert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section with Gradient Background */}
        <View style={styles.headerSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>ATOM</Text>
          </View>
          <Text style={styles.companyName}>ATOM LIFTS</Text>
          <Text style={styles.tagline}>User Portal</Text>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitleText}>Sign in to continue</Text>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={[
              styles.inputWrapper,
              isFocusedEmail && styles.inputWrapperFocused
            ]}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../assets/mail.png')}
                  style={styles.inputIcon}
                  resizeMode="contain"
                />
              </View>
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={isWeb}
                editable={!otpSent}
                onFocus={() => setIsFocusedEmail(true)}
                onBlur={() => setIsFocusedEmail(false)}
              />
            </View>
          </View>

          {/* OTP Input - Show only after OTP is sent */}
          {otpSent && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>OTP Code</Text>
              <View style={[
                styles.inputWrapper,
                isFocusedOtp && styles.inputWrapperFocused
              ]}>
                <View style={styles.iconContainer}>
                  <Text style={styles.lockIcon}>🔐</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor="#999999"
                  keyboardType="number-pad"
                  maxLength={6}
                  autoCapitalize="none"
                  autoCorrect={false}
                  onFocus={() => setIsFocusedOtp(true)}
                  onBlur={() => setIsFocusedOtp(false)}
                />
              </View>
            </View>
          )}

          {/* Resend OTP Link - Show only after OTP is sent */}
          {otpSent && (
            <TouchableOpacity
              style={styles.forgotPasswordLink}
              onPress={handleResendOTP}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Resend OTP?</Text>
            </TouchableOpacity>
          )}

          {/* Generate OTP / Verify OTP Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              (isLoading || !email.trim() || (otpSent && otpCode.length !== 6)) && styles.loginButtonDisabled
            ]}
            onPress={otpSent ? handleVerifyOTP : handleGenerateOTP}
            disabled={isLoading || !email.trim() || (otpSent && otpCode.length !== 6)}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>
                  {otpSent ? 'VERIFY OTP' : 'SEND OTP'}
                </Text>
                <Text style={styles.arrowIcon}>→</Text>
              </>
            )}
          </TouchableOpacity>

        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Atom Lifts India Pvt Ltd</Text>
          <Text style={styles.footerText}>All Rights Reserved</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerSection: {
    backgroundColor: '#FF6B6B',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B6B',
    letterSpacing: 2,
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#E8F5E9',
    fontWeight: '500',
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  cardHeader: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '400',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
    paddingLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 4,
    minHeight: 56,
  },
  inputWrapperFocused: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  inputIcon: {
    width: 20,
    height: 20,
    tintColor: '#FF6B6B',
  },
  lockIcon: {
    fontSize: 20,
    color: '#FF6B6B',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 12,
    fontWeight: '400',
  },
  eyeButton: {
    padding: 8,
    marginLeft: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCCCCC',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginRight: 8,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLinkText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default LoginPage;
