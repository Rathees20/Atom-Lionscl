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
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
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
  onNavigateToProfileSwitch?: () => void;
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
  onNavigateToProfileSwitch,
}) => {
  const menuItems: MenuItem[] = [
    {
      id: 'book-complaint',
      title: 'Book a Complaint',
      icon: '📞',
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
      icon: '🔄',
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
      icon: '⏰',
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
      icon: '📄',
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
      icon: '📋',
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
      icon: '🧾',
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
      icon: '🏢',
      onPress: () => {
        console.log('About Us pressed');
        onClose();
      },
    },
    {
      id: 'switch-profile',
      title: 'Switch Profile',
      icon: '🔄',
      onPress: () => {
        if (onNavigateToProfileSwitch) {
          onNavigateToProfileSwitch();
        }
        onClose();
      },
    },
    {
      id: 'logout',
      title: 'Logout',
      icon: '🚪',
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
    return '******1720';
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
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
                <Text style={styles.userText}>Test Site 1</Text>
              </View>
              
              <View style={styles.userItem}>
                <Text style={styles.userIcon}>📱</Text>
                <Text style={styles.userText}>
                  {formatMobileNumber(userData?.mobileNumber || '8072951720')}
                </Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuItemText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Designed & Developed By</Text>
            <Text style={styles.footerCompany}>Lionsol Infoway Pvt. Ltd.</Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>https://lionsol.in</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: '#0066CC',
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
    color: '#0066CC',
    fontWeight: '600',
    marginBottom: 5,
  },
  footerLink: {
    fontSize: 12,
    color: '#0066CC',
    textDecorationLine: 'underline',
  },
});

export default SideMenu;
