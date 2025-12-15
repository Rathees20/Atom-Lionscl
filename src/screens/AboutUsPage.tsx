import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const AboutUsPage: React.FC = () => {
  const { navigateTo } = useNavigation();

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const handleOpenWebsite = async () => {
    const url = 'https://atomlifts.com/';
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined') {
          window.open(url, '_blank');
        }
      } else {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', `Don't know how to open URL: ${url}`);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open the website');
    }
  };

  const services = [
    'Elevator and Escalator Spares Manufacturing',
    'New Lift Installation/Dismantling',
    'Elevator Enhancement Services',
    'Modernization',
    'Elevator Consultation and Analysis',
    'AMC/One-Time Service',
    'Lift Licensing Services (New/Renewal)',
    'Call Backs/Repairings',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image 
            source={require('../assets/left-chevron.png')} 
            style={styles.backIcon} 
            resizeMode="contain" 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroCard}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>ATOM</Text>
            </View>
            <Text style={styles.companyName}>ATOM LIFTS INDIA PVT LTD</Text>
            <Text style={styles.tagline}>"Lift Your Expectations!"</Text>
            <View style={styles.divider} />
            <Text style={styles.establishedText}>Since 2008</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>ℹ️</Text>
            <Text style={styles.sectionTitle}>About Us</Text>
          </View>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              We specialize in the repair, modernization, and installation of all types of commercial and residential elevators with a 24/7 emergency service. Our experienced technicians are available to provide reliable and timely service, ensuring your safety and satisfaction.
            </Text>
           {/* <Text style={styles.aboutText}>
              Originally initiated by Mr. Rajendran (former Chief Engineer – Mitsubishi Elevators & Escalators, Japan) as CARE Genuine Elevator Spares & Co.
            </Text>  */}
          </View>
        </View>

        {/* Website Link Section */}
        <View style={styles.section}>
          <View style={styles.websiteCard}>
            <View style={styles.websiteHeader}>
              <Text style={styles.websiteIcon}>🌐</Text>
              <Text style={styles.websiteTitle}>Visit Our Website</Text>
            </View>
            <TouchableOpacity 
              style={styles.websiteButton}
              onPress={handleOpenWebsite}
              activeOpacity={0.8}
            >
              <Text style={styles.websiteLink}>https://atomlifts.com/</Text>
              <View style={styles.arrowContainer}>
                <Text style={styles.arrowIcon}>→</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Services Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>⚙️</Text>
            <Text style={styles.sectionTitle}>Our Services</Text>
          </View>
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <View key={index} style={styles.serviceCard}>
                <View style={styles.serviceIconContainer}>
                  <Text style={styles.serviceIcon}>✓</Text>
                </View>
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Image 
              source={require('../assets/telephone.png')} 
              style={styles.sectionIconImage}
              resizeMode="contain"
            />
            <Text style={styles.sectionTitle}>Contact Us</Text>
          </View>
          <View style={styles.contactCard}>
            <View style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Image 
                  source={require('../assets/phone.png')} 
                  style={styles.contactIconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>For Sales</Text>
                <Text style={styles.contactValue}>96000 87456</Text>
                <Text style={styles.contactValue}>90030 87456</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Image 
                  source={require('../assets/service.png')} 
                  style={styles.contactIconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>For Service</Text>
                <Text style={styles.contactValue}>95008 37737</Text>
                <Text style={styles.contactValue}>86088 87456</Text>
              </View>
            </View>

            <View style={styles.contactItem}>
              <View style={styles.contactIconContainer}>
                <Image 
                  source={require('../assets/mail.png')} 
                  style={styles.contactIconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>sales@atomlifts.com</Text>
                <Text style={styles.contactValue}>admin@atomlifts.com</Text>
              </View>
            </View>

            <View style={[styles.contactItem, styles.lastContactItem]}>
              <View style={styles.contactIconContainer}>
                <Image 
                  source={require('../assets/Address.png')} 
                  style={styles.contactIconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Address</Text>
                <Text style={styles.contactValue}>
                  73 Pillayar Koil Street,{'\n'}
                  Ambattur Indus Estate,{'\n'}
                  Ambattur, Tamil Nadu 600050, IN
                </Text>
              </View>
            </View>
          </View>
        </View>

       

        {/* Footer Spacing */}
        <View style={styles.footerSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  heroSection: {
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 4,
    borderTopColor: '#4CAF50',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    width: 60,
    height: 3,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    marginBottom: 12,
  },
  establishedText: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  sectionIconImage: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#4CAF50',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutText: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'justify',
  },
  websiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  websiteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  websiteIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  websiteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0052A3',
  },
  websiteLink: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 48) / 2 - 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  serviceIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  serviceIcon: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  serviceText: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 20,
    flex: 1,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastContactItem: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactIconImage: {
    width: 24,
    height: 24,
    tintColor: '#4CAF50',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 6,
  },
  contactValue: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderTopWidth: 3,
    borderTopColor: '#4CAF50',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  footerSpacing: {
    height: 20,
  },
});

export default AboutUsPage;
