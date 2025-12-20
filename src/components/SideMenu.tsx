import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  ImageSourcePropType,
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface MenuItem {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  onPress: () => void;
}

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  userData?: any;
  onLogout?: () => void;
  onNavigateToAddComplaint?: () => void;
  onNavigateToComplaints?: () => void;
  onNavigateToRoutineMaintenance?: () => void;
  onNavigateToAMCContracts?: () => void;
  onNavigateToInvoice?: () => void;
  onNavigateToQuotation?: () => void;

  onNavigateToAboutUs?: () => void;
  onNavigateToCreateUser?: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  userData,
  onLogout,
  onNavigateToAddComplaint,
  onNavigateToComplaints,
  onNavigateToRoutineMaintenance,
  onNavigateToAMCContracts,
  onNavigateToInvoice,
  onNavigateToQuotation,
  onNavigateToAboutUs,
  onNavigateToCreateUser,
}) => {
  const menuIcons: Record<string, ImageSourcePropType> = {
    bookComplaint: require('../assets/Book a complaint.png'),
    preventiveServices: require('../assets/Preventive services.png'),
    complaints: require('../assets/Complaint.png'),
    contracts: require('../assets/Contracts.png'),
    quotation: require('../assets/Quatation.png'),
    invoice: require('../assets/invoice.png'),
    aboutUs: require('../assets/About us.png'),
    createUser: require('../assets/user.png'),

    logout: require('../assets/logout.png'),
  };
  const telephoneIcon = require('../assets/telephone.png');

  const menuItems: MenuItem[] = [
    {
      id: 'book-complaint',
      title: 'Book a Complaint',
      icon: menuIcons.bookComplaint,
      onPress: () => {
        onClose();
        if (onNavigateToAddComplaint) {
          onNavigateToAddComplaint();
        }
      },
    },
    {
      id: 'preventive-services',
      title: 'Preventive Services',
      icon: menuIcons.preventiveServices,
      onPress: () => {
        onClose();
        if (onNavigateToRoutineMaintenance) {
          onNavigateToRoutineMaintenance();
        }
      },
    },
    {
      id: 'complaints',
      title: 'Complaints',
      icon: menuIcons.complaints,
      onPress: () => {
        onClose();
        if (onNavigateToComplaints) {
          onNavigateToComplaints();
        }
      },
    },
    {
      id: 'contracts',
      title: 'Contracts',
      icon: menuIcons.contracts,
      onPress: () => {
        onClose();
        if (onNavigateToAMCContracts) {
          onNavigateToAMCContracts();
        }
      },
    },
    {
      id: 'quotation',
      title: 'Quotation',
      icon: menuIcons.quotation,
      onPress: () => {
        if (onNavigateToQuotation) {
          onNavigateToQuotation();
        }
        onClose();
      },
    },
    {
      id: 'invoice',
      title: 'Invoice',
      icon: menuIcons.invoice,
      onPress: () => {
        if (onNavigateToInvoice) {
          onNavigateToInvoice();
        }
        onClose();
      },
    },
    {
      id: 'about-us',
      title: 'About Us',
      icon: menuIcons.aboutUs,
      onPress: () => {
        onClose();
        if (onNavigateToAboutUs) {
          onNavigateToAboutUs();
        }
      },
    },

    {
      id: 'create-user',
      title: 'Create User',
      icon: menuIcons.createUser,
      onPress: () => {
        onClose();
        if (onNavigateToCreateUser) {
          onNavigateToCreateUser();
        }
      },
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: menuIcons.logout,
      onPress: () => {
        onClose();
        if (onLogout) {
          onLogout();
        }
      },
    },
  ];

  const formatMobileNumber = (number: string) => {
    if (number && number.length === 10) {
      return `******${number.slice(6)}`;
    }
    if (number && number.length > 0) {
      // Handle numbers that might be longer or shorter
      const last4 = number.slice(-4);
      return `******${last4}`;
    }
    return '******1720';
  };

  // Get customer details from userData
  const siteName = userData?.site_name || userData?.siteName || 'Customer';
  const phoneNumber = userData?.mobile || userData?.phone || userData?.mobileNumber || '';

  // Filter out Create User menu item for sub-users
  const filteredMenuItems = userData?.is_subcustomer
    ? menuItems.filter(item => item.id !== 'create-user')
    : menuItems;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.menuContainer}>
          {/* Blue Header with Geometric Pattern */}
          <View style={styles.header}>
            <View style={styles.geometricPattern}>
              <View style={styles.patternShape1} />
              <View style={styles.patternShape2} />
              <View style={styles.patternShape3} />
            </View>

            <View style={styles.userInfo}>
              <View style={styles.userItem}>
                <Text style={styles.userIcon}>👤</Text>
                <Text style={styles.userText}>{siteName}</Text>
              </View>

              {phoneNumber && (
                <View style={styles.userItem}>
                  <Image source={telephoneIcon} style={styles.userIconImage} resizeMode="contain" />
                  <Text style={styles.userText}>
                    {formatMobileNumber(phoneNumber)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
            {filteredMenuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemIcon}>
                  <Image source={item.icon} style={styles.menuIcon} resizeMode="contain" />
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          {/* <View style={styles.footer}>
            <Text style={styles.footerText}>Designed & Developed By</Text>
            <Text style={styles.footerCompany}>Lionsol Infoway Pvt. Ltd.</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>https://lionsol.in</Text>
            </TouchableOpacity>
          </View> */}
        </View>

        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 24,
    marginRight: 15,
    width: 24,
    height: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  userIconImage: {
    width: 20,
    height: 20,
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
    width: 24,
    height: 24,
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

export default SideMenu;
