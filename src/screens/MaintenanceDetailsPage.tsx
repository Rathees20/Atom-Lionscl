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
  Image,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface MaintenanceDetails {
  id: string;
  amcRef: string;
  siteId: string;
  siteName: string;
  siteAddress: string;
  serviceDate: string;
  month: string;
  siteCity: string;
  status: string;
  blockWing?: string;
  attendAt?: string;
  attendBy?: string;
}

interface MaintenanceDetailsPageProps {
  maintenanceItem?: MaintenanceDetails;
}

const MaintenanceDetailsPage: React.FC<MaintenanceDetailsPageProps> = ({ maintenanceItem }) => {
  const { navigateTo, navigationData, clearNavigationData } = useNavigation();
  const [isRoutineServiceExpanded, setIsRoutineServiceExpanded] = useState(false);
  const [isMaterialInfoExpanded, setIsMaterialInfoExpanded] = useState(false);

  // Use passed data, navigation data, or show empty state
  const maintenanceDetails: MaintenanceDetails = maintenanceItem || navigationData || {
    id: '',
    amcRef: '',
    siteId: '',
    siteName: '',
    siteAddress: '',
    serviceDate: '',
    month: '',
    siteCity: '',
    status: '',
    blockWing: '',
    attendAt: '',
    attendBy: '',
  };

  const handleBack = () => {
    clearNavigationData();
    navigateTo('/routine-maintenance');
  };

  const handleShare = () => {
    // Handle share functionality
    console.log('Share maintenance details');
  };

  const handleViewPDF = () => {
    // Navigate to AMC contracts page with contract data
    const contractData = {
      id: maintenanceDetails.id,
      contractId: maintenanceDetails.amcRef,
      status: 'Overdue by 44 Days',
      statusColor: '#FF9800',
      period: '01/09/2024 to 31/08/2025',
      periodStatus: '(Ended)',
      amcType: 'ATOM - FREE AMC',
      contractAmount: 0.00,
      paidAmount: 0.00,
      dueAmount: 0.00,
      agreementUrl: 'https://example.com/amc-agreement.pdf', // Replace with actual URL
    };
    
    navigateTo('/amc-contracts', contractData);
  };

  const handleAddressPress = () => {
    // Handle address click - could open maps
    console.log('Open address in maps');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'due':
        return '#FF9800';
      case 'overdue':
        return '#F44336';
      case 'in progress':
        return '#2196F3';
      default:
        return '#666666';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Routine Maintenance</Text>
        
        <View style={styles.headerRight}>
          {/* Empty space for balance */}
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AMC Reference Section */}
        <View style={styles.amcSection}>
          <View style={styles.amcLeft}>
            <Text style={styles.amcLabel}>AMC Ref.</Text>
            <Text style={styles.amcValue}>{maintenanceDetails.amcRef || 'N/A'}</Text>
          </View>
          <View style={styles.amcRight}>
            <TouchableOpacity style={styles.iconButton} onPress={handleViewPDF}>
              <Text style={styles.iconText}>📄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Text style={styles.iconText}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Site Information Section */}
        <View style={styles.siteSection}>
          <View style={styles.siteHeader}>
            <Text style={styles.siteIcon}>🏢</Text>
            <View style={styles.siteInfo}>
              <Text style={styles.siteId}>{maintenanceDetails.siteId || 'N/A'}</Text>
              <Text style={styles.siteName}>{maintenanceDetails.siteName || 'N/A'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>
            <Text style={styles.addressText}>{maintenanceDetails.siteAddress || 'Address not available'}</Text>
            <Text style={styles.externalLinkIcon}>🔗</Text>
          </TouchableOpacity>
        </View>

        {/* Service Details Section */}
        <View style={styles.serviceSection}>
          <View style={styles.serviceRow}>
            <View style={styles.serviceLeft}>
              <Text style={styles.serviceDateLabel}>Service Date:</Text>
              <Text style={styles.serviceDateValue}>{maintenanceDetails.serviceDate || 'N/A'}</Text>
              <Text style={styles.monthText}>{maintenanceDetails.month || 'N/A'}</Text>
            </View>
            
            <View style={styles.timelineContainer}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineLine} />
              <View style={[styles.timelineDot, styles.timelineDotFilled]} />
            </View>
            
            <View style={styles.serviceRight}>
              <Text style={styles.siteCityLabel}>Site City:</Text>
              <Text style={styles.siteCityValue}>{maintenanceDetails.siteCity || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailsLeft}>
              <Text style={styles.statusLabel}>Status:</Text>
              <Text style={[styles.statusValue, { color: getStatusColor(maintenanceDetails.status) }]}>
                {maintenanceDetails.status || 'N/A'}
              </Text>
            </View>
            <View style={styles.detailsRight}>
              <Text style={styles.blockLabel}>Block / Wing:</Text>
              <Text style={styles.blockValue}>{maintenanceDetails.blockWing || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.detailsRow}>
            <View style={styles.detailsLeft}>
              <Text style={styles.attendLabel}>Attend By:</Text>
              <Text style={styles.attendValue}>{maintenanceDetails.attendBy || 'Not assigned'}</Text>
            </View>
            <View style={styles.detailsRight}>
              <Text style={styles.attendAtLabel}>Attend At:</Text>
              <Text style={styles.attendAtValue}>{maintenanceDetails.attendAt || 'Not scheduled'}</Text>
            </View>
          </View>
        </View>

        {/* Expandable Sections */}
        <View style={styles.expandableSection}>
          <TouchableOpacity 
            style={styles.expandableHeader}
            onPress={() => setIsRoutineServiceExpanded(!isRoutineServiceExpanded)}
          >
            <View style={styles.expandableLeft}>
              <Text style={styles.expandableIcon}>💼</Text>
              <Text style={styles.expandableTitle}>Routine Service Info</Text>
            </View>
            <Text style={styles.expandableChevron}>
              {isRoutineServiceExpanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {isRoutineServiceExpanded && (
            <View style={styles.expandableContent}>
              <Text style={styles.expandableText}>
                Detailed routine service information will be displayed here.
                This could include service history, next scheduled maintenance,
                equipment details, and other relevant information.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.expandableSection}>
          <TouchableOpacity 
            style={styles.expandableHeader}
            onPress={() => setIsMaterialInfoExpanded(!isMaterialInfoExpanded)}
          >
            <View style={styles.expandableLeft}>
              <Text style={styles.expandableIcon}>🛒</Text>
              <Text style={styles.expandableTitle}>Material Info</Text>
            </View>
            <Text style={styles.expandableChevron}>
              {isMaterialInfoExpanded ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          
          {isMaterialInfoExpanded && (
            <View style={styles.expandableContent}>
              <Text style={styles.expandableText}>
                Material information will be displayed here.
                This could include parts used, materials required,
                inventory status, and procurement details.
              </Text>
            </View>
          )}
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
  backButton: {
    padding: 5,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 34, // Same width as back button for balance
  },
  content: {
    flex: 1,
    padding: 15,
  },
  amcSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amcLeft: {
    flex: 1,
  },
  amcLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  amcValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  amcRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    padding: 8,
  },
  iconText: {
    fontSize: 20,
  },
  siteSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  siteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  siteIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  siteInfo: {
    flex: 1,
  },
  siteId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  siteName: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addressText: {
    fontSize: 14,
    color: '#4CAF50',
    flex: 1,
  },
  externalLinkIcon: {
    fontSize: 12,
    marginLeft: 5,
  },
  serviceSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceLeft: {
    flex: 1,
  },
  serviceDateLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  serviceDateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  monthText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  timelineContainer: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E91E63',
    backgroundColor: 'transparent',
  },
  timelineDotFilled: {
    backgroundColor: '#E91E63',
  },
  timelineLine: {
    width: 2,
    height: 30,
    backgroundColor: '#E91E63',
    marginVertical: 5,
  },
  serviceRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  siteCityLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  siteCityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailsLeft: {
    flex: 1,
  },
  detailsRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  blockLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  blockValue: {
    fontSize: 16,
    color: '#333333',
  },
  attendLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  attendValue: {
    fontSize: 16,
    color: '#333333',
  },
  attendAtLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  attendAtValue: {
    fontSize: 16,
    color: '#333333',
  },
  expandableSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  expandableLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expandableIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  expandableTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  expandableChevron: {
    fontSize: 16,
    color: '#666666',
  },
  expandableContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  expandableText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default MaintenanceDetailsPage;
