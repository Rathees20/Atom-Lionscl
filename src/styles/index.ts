import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

// ============================================================================
// APP STYLES
// ============================================================================
export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webContainer: {
    minHeight: height,
    maxWidth: width,
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// ============================================================================
// LOGIN PAGE STYLES
// ============================================================================
export const loginStyles = StyleSheet.create({
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
    color: '#FF6B6B',
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
    color: '#FF6B6B',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

// ============================================================================
// REGISTER PAGE STYLES
// ============================================================================
export const registerStyles = StyleSheet.create({
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
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 10,
  },
  textInput: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 0,
  },
  inputSeparator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: '#424242',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  registerButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// ============================================================================
// OTP VERIFICATION PAGE STYLES
// ============================================================================
export const otpStyles = StyleSheet.create({
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
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  infoText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 10,
  },
  mobileNumber: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 2,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  otpInputEmpty: {
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  otpInputFilled: {
    borderColor: '#FF6B6B',
    backgroundColor: '#F0F8FF',
  },
  verifyButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  verifyButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666666',
  },
  resendLink: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    color: '#CCCCCC',
    textDecorationLine: 'none',
  },
});

// ============================================================================
// DASHBOARD PAGE STYLES
// ============================================================================
export const dashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B6B',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    padding: 5,
  },
  hamburgerIcon: {
    width: 20,
    height: 15,
    justifyContent: 'space-between',
  },
  hamburgerLine: {
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 30,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '600',
    marginBottom: 15,
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
  },
  sessionInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  sessionText: {
    fontSize: 12,
    color: '#999999',
  },
  actionButtonsContainer: {
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
  },
  servicesContainer: {
    flexDirection: 'row',
  },
  serviceSection: {
    flex: 1,
  },
  serviceSectionTitle: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '600',
    marginBottom: 15,
    letterSpacing: 1,
  },
  serviceInfo: {
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  serviceValue: {
    fontSize: 14,
    color: '#000000',
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 15,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 8,
  },
  downloadIcon: {
    fontSize: 16,
    color: '#8B5CF6',
    marginRight: 8,
  },
  downloadText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});

// ============================================================================
// SIDE MENU STYLES
// ============================================================================
export const sideMenuStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FF6B6B',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  geometricPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternShape1: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
  },
  patternShape2: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
  },
  patternShape3: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 40,
  },
  userInfo: {
    zIndex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  userIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  footerCompany: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
    marginBottom: 5,
  },
  footerLink: {
    fontSize: 12,
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
});

// ============================================================================
// COMMON STYLES
// ============================================================================
export const commonStyles = StyleSheet.create({
  // Colors
  primaryColor: '#FF6B6B',
  secondaryBlue: '#8B5CF6',
  orange: '#FF6B35',
  red: '#FF4444',
  gray: '#666666',
  lightGray: '#F5F5F5',
  white: '#FFFFFF',
  black: '#000000',
  
  // Typography
  titleLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  titleSmall: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  bodyLarge: {
    fontSize: 16,
    color: '#000000',
  },
  bodyMedium: {
    fontSize: 14,
    color: '#000000',
  },
  bodySmall: {
    fontSize: 12,
    color: '#666666',
  },
  
  // Spacing
  paddingSmall: 8,
  paddingMedium: 16,
  paddingLarge: 24,
  marginSmall: 8,
  marginMedium: 16,
  marginLarge: 24,
  
  // Border Radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 12,
  radiusXLarge: 16,
  
  // Shadows
  shadowSmall: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});

// ============================================================================
// EXPORT ALL STYLES
// ============================================================================
export default {
  app: appStyles,
  login: loginStyles,
  register: registerStyles,
  otp: otpStyles,
  dashboard: dashboardStyles,
  sideMenu: sideMenuStyles,
  common: commonStyles,
};
