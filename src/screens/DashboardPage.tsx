import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import SideMenu from '../components/SideMenu';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const DashboardPage: React.FC = () => {
  const { user, setUser, navigateTo } = useNavigation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const handleDownloadServiceSlip = () => {
    // Handle download service slip
    console.log('Download service slip');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Side Menu */}
      <SideMenu
        visible={isMenuVisible}
        onClose={handleCloseMenu}
        userData={user}
        onLogout={() => {
          setUser(null);
          navigateTo('/login');
        }}
        onNavigateToAddComplaint={() => navigateTo('/add-complaint')}
        onNavigateToComplaints={() => navigateTo('/complaints')}
        onNavigateToRoutineMaintenance={() => navigateTo('/routine-maintenance')}
        onNavigateToAMCContracts={() => navigateTo('/amc-contracts')}
        onNavigateToInvoice={() => navigateTo('/invoice')}
        onNavigateToQuotation={() => navigateTo('/quotation')}
        onNavigateToProfileSwitch={() => navigateTo('/profile-switch')}
        onNavigateToAboutUs={() => navigateTo('/about-us')}
      />
      
      {/* Blue Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
          <View style={styles.hamburgerIcon}>
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </View>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Dashboard</Text>
        
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Client Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CLIENT INFORMATION</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Installation ID :</Text>
            <Text style={styles.infoValue}>AL9876</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Maintenance ID :</Text>
            <Text style={styles.infoValue}>988888</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Site Name :</Text>
            <Text style={styles.infoValue}>Test Site 1</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address :</Text>
            <Text style={styles.infoValue}>No 27 t h road kaladipet</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City :</Text>
            <Text style={styles.infoValue}>Chennai State : Tamil Nadu</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pin :</Text>
            <Text style={styles.infoValue}>600001</Text>
          </View>
          
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionText}>
              Current Session Login : Test Site 1 | 8072951720 | xxx@gmail.com
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>No AMC</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>No Due Invoices</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>No Open Complaints</Text>
          </TouchableOpacity>
        </View>

        {/* Routine Services Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ROUTINE SERVICES</Text>
          
          <View style={styles.servicesContainer}>
            {/* Last Service Section */}
            <View style={styles.serviceSection}>
              <Text style={styles.serviceSectionTitle}>Last Service</Text>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>Last Service :</Text>
                <Text style={styles.serviceValue}>01/01/1970</Text>
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>Duration :</Text>
                <Text style={styles.serviceValue}></Text>
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>Technician :</Text>
                <Text style={styles.serviceValue}>Not assigned Yet</Text>
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>Code :</Text>
                <Text style={styles.serviceValue}>Nil</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.downloadButton}
                onPress={handleDownloadServiceSlip}
              >
                <Text style={styles.downloadIcon}>⬇</Text>
                <Text style={styles.downloadText}>Download Service Slip</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Upcoming Service Section */}
            <View style={styles.serviceSection}>
              <Text style={styles.serviceSectionTitle}>Upcoming Service</Text>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>Upcoming Service :</Text>
                <Text style={styles.serviceValue}>2024-09-11</Text>
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>Duration :</Text>
                <Text style={styles.serviceValue}>in 397 Days</Text>
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>Technician :</Text>
                <Text style={styles.serviceValue}>soundahr</Text>
              </View>
              
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceLabel}>Code :</Text>
                <Text style={styles.serviceValue}></Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
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
    fontSize: 18,
    color: '#8B5CF6',
    marginRight: 8,
    lineHeight: 18,
  },
  downloadText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});

export default DashboardPage;
