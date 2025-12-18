import React, { useState, useEffect } from 'react';
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
  Alert,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';
import { API_ENDPOINTS } from '../utils/api';

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
  const { navigateTo, navigationData, clearNavigationData, user } = useNavigation();
  const [isRoutineServiceExpanded, setIsRoutineServiceExpanded] = useState(false);
  const [isMaterialInfoExpanded, setIsMaterialInfoExpanded] = useState(false);
  const [maintenanceDetails, setMaintenanceDetails] = useState<MaintenanceDetails>(maintenanceItem || navigationData || {
    id: 'N/A',
    amcRef: 'N/A',
    siteId: 'N/A',
    siteName: 'Site information not available',
    siteAddress: 'Address not specified',
    serviceDate: 'Date not specified',
    month: 'Month not specified',
    siteCity: 'City not specified',
    status: 'all',
    blockWing: 'Not specified',
    attendAt: 'Not scheduled',
    attendBy: 'Not assigned',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load maintenance details from API
  useEffect(() => {
    loadMaintenanceDetails();
  }, [navigationData?.id]);

  const loadMaintenanceDetails = async () => {
    try {
      setIsLoading(true);

      // Get maintenance ID from navigation data
      const maintenanceId = navigationData?.id || maintenanceItem?.id;

      // If we already have complete data from navigation, use it
      if (navigationData && navigationData.id && navigationData.siteName) {
        setMaintenanceDetails(navigationData);
        setIsLoading(false);
        return;
      }

      if (!maintenanceId) {
        // Use the initial data if no ID
        if (maintenanceItem || navigationData) {
          setMaintenanceDetails(maintenanceItem || navigationData);
        }
        setIsLoading(false);
        return;
      }

      const userEmail = user?.email;
      if (!userEmail) {
        Alert.alert('Error', 'User email not found. Please login again.');
        setIsLoading(false);
        return;
      }

      // Fetch all services and find the matching one
      const url = `${API_ENDPOINTS.ROUTINE_SERVICES_ALL}?email=${encodeURIComponent(userEmail)}`;
      console.log('Fetching maintenance details from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Maintenance details API Response:', JSON.stringify(data, null, 2));

      if (response.ok) {
        // Handle different response formats
        let servicesArray: any[] = [];

        if (Array.isArray(data)) {
          servicesArray = data;
        } else if (data.services || data.routine_services || data.results) {
          servicesArray = data.services || data.routine_services || data.results;
          if (!Array.isArray(servicesArray)) {
            servicesArray = [];
          }
        }

        // Find the matching service by ID
        const serviceData = servicesArray.find((item: any) => {
          const itemId = item.id?.toString() ||
            item.service_id?.toString() ||
            item.maintenance_id?.toString() ||
            '';
          return itemId === maintenanceId.toString();
        });

        if (serviceData) {
          // Map API response to MaintenanceDetails interface
          const details: MaintenanceDetails = {
            id: serviceData.id?.toString() || maintenanceId,
            amcRef: serviceData.amc_ref ||
              serviceData.amcRef ||
              serviceData.amc_reference ||
              serviceData.amc?.reference ||
              `AMC${maintenanceId}`,
            siteId: serviceData.site_id?.toString() ||
              serviceData.siteId?.toString() ||
              serviceData.site?.id?.toString() ||
              `SITE${maintenanceId}`,
            siteName: serviceData.site_name ||
              serviceData.siteName ||
              serviceData.site?.name ||
              serviceData.project_name ||
              `Site ${maintenanceId}`,
            siteAddress: serviceData.site_address ||
              serviceData.siteAddress ||
              serviceData.address ||
              serviceData.site?.address ||
              'Address not specified',
            serviceDate: serviceData.service_date ||
              serviceData.serviceDate ||
              serviceData.date ||
              serviceData.scheduled_date ||
              'Date not specified',
            month: serviceData.month ||
              serviceData.service_month ||
              serviceData.serviceMonth ||
              (serviceData.service_date ? new Date(serviceData.service_date).toLocaleString('default', { month: 'long' }) : 'Month not specified'),
            siteCity: serviceData.site_city ||
              serviceData.siteCity ||
              serviceData.city ||
              serviceData.site?.city ||
              'City not specified',
            status: (serviceData.status || 'all').toLowerCase(),
            blockWing: serviceData.block_wing ||
              serviceData.blockWing ||
              serviceData.block ||
              'Not specified',
            attendAt: serviceData.attend_at ||
              serviceData.attendAt ||
              serviceData.attended_at ||
              'Not scheduled',
            attendBy: serviceData.attend_by ||
              serviceData.attendBy ||
              serviceData.technician ||
              serviceData.technician_name ||
              'Not assigned',
          };

          setMaintenanceDetails(details);
        } else {
          // Use navigation data if API doesn't have the item
          if (navigationData) {
            // Enhance navigation data with better defaults
            const enhancedData = {
              ...navigationData,
              amcRef: navigationData.amcRef || `AMC${maintenanceId}`,
              siteId: navigationData.siteId || `SITE${maintenanceId}`,
              siteName: navigationData.siteName || `Site ${maintenanceId}`,
              siteAddress: navigationData.siteAddress || 'Address not specified',
              serviceDate: navigationData.serviceDate || 'Date not specified',
              month: navigationData.month || 'Month not specified',
              siteCity: navigationData.siteCity || 'City not specified',
              status: (navigationData.status || 'all').toLowerCase(),
              blockWing: navigationData.blockWing || 'Not specified',
              attendAt: navigationData.attendAt || 'Not scheduled',
              attendBy: navigationData.attendBy || 'Not assigned',
            };
            setMaintenanceDetails(enhancedData);
          } else if (maintenanceItem) {
            // Enhance maintenance item data with better defaults
            const enhancedData = {
              ...maintenanceItem,
              amcRef: maintenanceItem.amcRef || `AMC${maintenanceId}`,
              siteId: maintenanceItem.siteId || `SITE${maintenanceId}`,
              siteName: maintenanceItem.siteName || `Site ${maintenanceId}`,
              siteAddress: maintenanceItem.siteAddress || 'Address not specified',
              serviceDate: maintenanceItem.serviceDate || 'Date not specified',
              month: maintenanceItem.month || 'Month not specified',
              siteCity: maintenanceItem.siteCity || 'City not specified',
              status: (maintenanceItem.status || 'all').toLowerCase(),
              blockWing: maintenanceItem.blockWing || 'Not specified',
              attendAt: maintenanceItem.attendAt || 'Not scheduled',
              attendBy: maintenanceItem.attendBy || 'Not assigned',
            };
            setMaintenanceDetails(enhancedData);
          }
        }
      }
    } catch (error) {
      console.error('Error loading maintenance details:', error);
      // Use navigation data as fallback with better defaults
      if (navigationData) {
        const maintenanceId = navigationData?.id;
        const enhancedData = {
          ...navigationData,
          amcRef: navigationData.amcRef || (maintenanceId ? `AMC${maintenanceId}` : 'N/A'),
          siteId: navigationData.siteId || (maintenanceId ? `SITE${maintenanceId}` : 'N/A'),
          siteName: navigationData.siteName || (maintenanceId ? `Site ${maintenanceId}` : 'N/A'),
          siteAddress: navigationData.siteAddress || 'Address not specified',
          serviceDate: navigationData.serviceDate || 'Date not specified',
          month: navigationData.month || 'Month not specified',
          siteCity: navigationData.siteCity || 'City not specified',
          status: (navigationData.status || 'all').toLowerCase(),
          blockWing: navigationData.blockWing || 'Not specified',
          attendAt: navigationData.attendAt || 'Not scheduled',
          attendBy: navigationData.attendBy || 'Not assigned',
        };
        setMaintenanceDetails(enhancedData);
      } else if (maintenanceItem) {
        const maintenanceId = maintenanceItem?.id;
        const enhancedData = {
          ...maintenanceItem,
          amcRef: maintenanceItem.amcRef || (maintenanceId ? `AMC${maintenanceId}` : 'N/A'),
          siteId: maintenanceItem.siteId || (maintenanceId ? `SITE${maintenanceId}` : 'N/A'),
          siteName: maintenanceItem.siteName || (maintenanceId ? `Site ${maintenanceId}` : 'N/A'),
          siteAddress: maintenanceItem.siteAddress || 'Address not specified',
          serviceDate: maintenanceItem.serviceDate || 'Date not specified',
          month: maintenanceItem.month || 'Month not specified',
          siteCity: maintenanceItem.siteCity || 'City not specified',
          status: (maintenanceItem.status || 'all').toLowerCase(),
          blockWing: maintenanceItem.blockWing || 'Not specified',
          attendAt: maintenanceItem.attendAt || 'Not scheduled',
          attendBy: maintenanceItem.attendBy || 'Not assigned',
        };
        setMaintenanceDetails(enhancedData);
      }
    } finally {
      setIsLoading(false);
    }
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
    const normalizedStatus = status?.toLowerCase() || '';
    switch (normalizedStatus) {
      case 'completed':
        return '#4CAF50'; // Green
      case 'due':
        return '#FF9800'; // Orange
      case 'overdue':
        return '#F44336'; // Red
      case 'in progress':
      case 'inprogress':
      case 'in-progress':
        return '#2196F3'; // Blue
      case 'all':
      case 'pending':
        return '#9E9E9E'; // Gray
      default:
        return '#666666'; // Dark gray
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />

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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading maintenance details...</Text>
          </View>
        ) : (
          <>
            {/* AMC Reference Section */}
            <View style={styles.amcSection}>
              <View style={styles.amcLeft}>
                <Text style={styles.amcLabel}>AMC Ref.</Text>
                <Text style={styles.amcValue}>{maintenanceDetails.amcRef}</Text>
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
                  <Text style={styles.siteId}>{maintenanceDetails.siteId}</Text>
                  <Text style={styles.siteName}>{maintenanceDetails.siteName}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addressContainer} onPress={handleAddressPress}>
                <Text style={styles.addressText}>{maintenanceDetails.siteAddress}</Text>
                <Text style={styles.externalLinkIcon}>🔗</Text>
              </TouchableOpacity>
            </View>

            {/* Service Details Section */}
            <View style={styles.serviceSection}>
              <View style={styles.serviceRow}>
                <View style={styles.serviceLeft}>
                  <Text style={styles.serviceDateLabel}>Service Date:</Text>
                  <Text style={styles.serviceDateValue}>{maintenanceDetails.serviceDate}</Text>
                  <Text style={styles.monthText}>{maintenanceDetails.month}</Text>
                </View>

                <View style={styles.timelineContainer}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineLine} />
                  <View style={[styles.timelineDot, styles.timelineDotFilled]} />
                </View>

                <View style={styles.serviceRight}>
                  <Text style={styles.siteCityLabel}>Site City:</Text>
                  <Text style={styles.siteCityValue}>{maintenanceDetails.siteCity}</Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailsLeft}>
                  <Text style={styles.statusLabel}>Status:</Text>
                  <Text style={[styles.statusValue, { color: getStatusColor(maintenanceDetails.status) }]}>
                    {maintenanceDetails.status}
                  </Text>
                </View>
                <View style={styles.detailsRight}>
                  <Text style={styles.blockLabel}>Block / Wing:</Text>
                  <Text style={styles.blockValue}>{maintenanceDetails.blockWing}</Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailsLeft}>
                  <Text style={styles.attendLabel}>Attend By:</Text>
                  <Text style={styles.attendValue}>{maintenanceDetails.attendBy}</Text>
                </View>
                <View style={styles.detailsRight}>
                  <Text style={styles.attendAtLabel}>Attend At:</Text>
                  <Text style={styles.attendAtValue}>{maintenanceDetails.attendAt}</Text>
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
          </>
        )}
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
    backgroundColor: '#FF6B6B',
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
    color: '#FF6B6B',
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
  loadingContainer: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default MaintenanceDetailsPage;
