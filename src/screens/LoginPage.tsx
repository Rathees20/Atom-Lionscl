import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const LoginPage: React.FC = () => {
  const { setMobileNumber: setContextMobileNumber, navigateTo } = useNavigation();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setContextMobileNumber(mobileNumber);
      navigateTo('/otp');
    }, 1000);
  };

  const handlePasswordLogin = () => {
    Alert.alert('Info', 'Password login screen would open here');
  };

  const handleRegister = () => {
    navigateTo('/register');
  };

  return (
    <View style={[styles.container, isWeb && styles.webContainer]}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>ATOM USER APP</Text>
      </View>

      {/* Login Form */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login Via OTP</Text>
        
        {/* Mobile Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Registered Mobile Number</Text>
          <View style={styles.inputWrapper}>
            <View style={styles.phoneIcon}>
              <Text style={styles.phoneIconText}>📱</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={mobileNumber}
              onChangeText={(value) => {
                const digitsOnly = value.replace(/[^0-9]/g, '');
                setMobileNumber(digitsOnly);
              }}
              placeholder=""
              keyboardType="numeric"
              maxLength={10}
              autoFocus={isWeb}
            />
            <Text style={styles.characterCount}>{mobileNumber.length}/10</Text>
          </View>
          <View style={styles.inputUnderline} />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.continueButtonText}>
            {isLoading ? 'LOADING...' : 'CONTINUE'}
          </Text>
          <Text style={styles.arrowIcon}>→</Text>
        </TouchableOpacity>

        {/* Password Login Link */}
        <TouchableOpacity style={styles.passwordLink} onPress={handlePasswordLogin}>
          <Text style={styles.linkText}>Login With Password</Text>
        </TouchableOpacity>

        {/* Register Link */}
        {/* <TouchableOpacity style={styles.registerLink} onPress={handleRegister}>
          <Text style={styles.linkText}>Register your business with Lionsol</Text>
        </TouchableOpacity> */}
      </View>

      {/* Footer */}
      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>Designed & Developed by</Text>
        <Text style={styles.footerText}>LIONSOL INFOWAY PVT. LTD.</Text>
        <TouchableOpacity style={styles.websiteLink}>
          <Text style={styles.websiteText}>https://lionsol.in</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  webContainer: {
    minHeight: height,
    maxWidth: isWeb ? 400 : width,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: isWeb ? 40 : 60,
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B35', // Orange color for LIONSCL
    letterSpacing: 2,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  phoneIcon: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  phoneIconText: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingLeft: 40,
    paddingRight: 50,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6', // Purple underline
  },
  characterCount: {
    position: 'absolute',
    right: 0,
    fontSize: 12,
    color: '#666666',
  },
  inputUnderline: {
    height: 2,
    backgroundColor: '#8B5CF6',
    marginTop: -2,
  },
  continueButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  arrowIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  registerLink: {
    alignSelf: 'center',
    marginBottom: 40,
  },
  linkText: {
    color: '#0066CC',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 4,
  },
  websiteLink: {
    marginTop: 8,
  },
  websiteText: {
    color: '#0066CC',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default LoginPage;
