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
  Alert,
} from 'react-native';
import SideMenu from '../components/SideMenu';
import { useNavigation } from '../contexts/NavigationContext';
import { API_ENDPOINTS } from '../utils/api';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface AMCSummary {
  totalContracts: number;
  activeContracts: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  latestContract?: {
    contractId: string;
    status: string;
    period: string;
  };
}

interface RoutineService {
  lastService?: {
    date: string;
    duration: string;
    technician: string;
    code: string;
  };
  upcomingService?: {
    date: string;
    duration: string;
    technician: string;
    code: string;
  };
}

const DashboardPage: React.FC = () => {
  const { user, setUser, navigateTo } = useNavigation();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [amcSummary, setAmcSummary] = useState<AMCSummary | null>(null);
  const [isLoadingAMC, setIsLoadingAMC] = useState(true);
  const [routineService, setRoutineService] = useState<RoutineService | null>(null);
  const [isLoadingRoutine, setIsLoadingRoutine] = useState(true);

  useEffect(() => {
    loadAMCData();
    loadRoutineServices();
  }, []);

  const loadAMCData = async () => {
    try {
      setIsLoadingAMC(true);
      
      const userEmail = user?.email;
      if (!userEmail) {
        setIsLoadingAMC(false);
        return;
      }
      
      const url = `${API_ENDPOINTS.CUSTOMER_AMCS}?email=${encodeURIComponent(userEmail)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        const amcs = Array.isArray(data) ? data : (data.amcs || data.contracts || data.results || []);
        
        const summary: AMCSummary = {
          totalContracts: amcs.length,
          activeContracts: amcs.filter((item: any) => 
            (item.status || '').toLowerCase() === 'active'
          ).length,
          totalAmount: amcs.reduce((sum: number, item: any) => 
            sum + (parseFloat(item.contract_amount || item.contractAmount || '0') || 0), 0
          ),
          paidAmount: amcs.reduce((sum: number, item: any) => 
            sum + (parseFloat(item.paid_amount || item.paidAmount || '0') || 0), 0
          ),
          dueAmount: amcs.reduce((sum: number, item: any) => 
            sum + (parseFloat(item.due_amount || item.dueAmount || '0') || 0), 0
          ),
          latestContract: amcs.length > 0 ? {
            contractId: amcs[0].contract_id || amcs[0].contractId || amcs[0].amc_id?.toString() || 'N/A',
            status: amcs[0].status || 'N/A',
            period: amcs[0].period || amcs[0].contract_period || 
              (amcs[0].start_date && amcs[0].end_date ? `${amcs[0].start_date} - ${amcs[0].end_date}` : 'N/A'),
          } : undefined,
        };
        
        setAmcSummary(summary);
      }
    } catch (error) {
      console.error('Error loading AMC data:', error);
    } finally {
      setIsLoadingAMC(false);
    }
  };

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setIsMenuVisible(false);
  };

  const handleLogout = async () => {
    try {
      const userEmail = user?.email;
      
      // Call logout API
      if (userEmail) {
        const url = `${API_ENDPOINTS.CUSTOMER_LOGOUT}?email=${encodeURIComponent(userEmail)}`;
        console.log('Logging out:', url);
        
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          console.log('Logout API Response:', data);
          
          // Continue with logout even if API call fails
        } catch (error) {
          console.error('Error calling logout API:', error);
          // Continue with logout even if API call fails
        }
      }
      
      // Clear user and navigate to login
      setUser(null);
      navigateTo('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear user and navigate to login even if there's an error
      setUser(null);
      navigateTo('/login');
    }
  };

  const loadRoutineServices = async () => {
    try {
      setIsLoadingRoutine(true);
      
      const userEmail = user?.email;
      if (!userEmail) {
        setIsLoadingRoutine(false);
        return;
      }
      
      const url = `${API_ENDPOINTS.ROUTINE_SERVICES}?email=${encodeURIComponent(userEmail)}`;
      console.log('Fetching routine services from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Routine services API Response:', JSON.stringify(data, null, 2));
      console.log('Response keys:', Object.keys(data || {}));

      if (response.ok) {
        // Handle different response formats
        let servicesData = data;
        
        if (Array.isArray(data)) {
          // If array, use first item or combine data
          servicesData = data.length > 0 ? data[0] : {};
        } else if (data.services || data.routine_services || data.results) {
          servicesData = data.services || data.routine_services || data.results;
          if (Array.isArray(servicesData)) {
            servicesData = servicesData.length > 0 ? servicesData[0] : {};
          }
        }
        
        console.log('Extracted servicesData:', JSON.stringify(servicesData, null, 2));
        console.log('ServicesData keys:', Object.keys(servicesData || {}));
        
        // Extract last service data - check for nested objects or flat structure
        const lastServiceData = servicesData.last_service || 
                               servicesData.lastService || 
                               servicesData.last || 
                               servicesData;
        
        // Extract upcoming service data - check for nested objects or flat structure
        const upcomingServiceData = servicesData.upcoming_service || 
                                   servicesData.upcomingService || 
                                   servicesData.upcoming || 
                                   servicesData;
        
        // Map API response to RoutineService interface with comprehensive field checking
        const routineService: RoutineService = {
          lastService: {
            date: lastServiceData.last_service_date || 
                 lastServiceData.lastServiceDate || 
                 lastServiceData.service_date ||
                 lastServiceData.date ||
                 lastServiceData.last_service ||
                 lastServiceData.lastService ||
                 servicesData.last_service_date ||
                 servicesData.lastServiceDate ||
                 '',
            duration: lastServiceData.last_service_duration || 
                     lastServiceData.lastServiceDuration || 
                     lastServiceData.duration ||
                     lastServiceData.service_duration ||
                     servicesData.last_service_duration ||
                     servicesData.lastServiceDuration ||
                     '',
            technician: lastServiceData.last_service_technician || 
                      lastServiceData.lastServiceTechnician || 
                      lastServiceData.technician ||
                      lastServiceData.technician_name ||
                      lastServiceData.technicianName ||
                      lastServiceData.last_technician ||
                      lastServiceData.last_technician_name ||
                      servicesData.last_service_technician ||
                      servicesData.lastServiceTechnician ||
                      'Not assigned Yet',
            code: lastServiceData.last_service_code || 
                 lastServiceData.lastServiceCode || 
                 lastServiceData.code ||
                 lastServiceData.service_code ||
                 servicesData.last_service_code ||
                 servicesData.lastServiceCode ||
                 'Nil',
          },
          upcomingService: {
            date: upcomingServiceData.upcoming_service_date || 
                 upcomingServiceData.upcomingServiceDate || 
                 upcomingServiceData.service_date ||
                 upcomingServiceData.date ||
                 upcomingServiceData.upcoming_service ||
                 upcomingServiceData.upcomingService ||
                 servicesData.upcoming_service_date ||
                 servicesData.upcomingServiceDate ||
                 '',
            duration: upcomingServiceData.upcoming_service_duration || 
                     upcomingServiceData.upcomingServiceDuration || 
                     upcomingServiceData.duration ||
                     upcomingServiceData.service_duration ||
                     servicesData.upcoming_service_duration ||
                     servicesData.upcomingServiceDuration ||
                     '',
            technician: upcomingServiceData.upcoming_service_technician || 
                      upcomingServiceData.upcomingServiceTechnician || 
                      upcomingServiceData.technician ||
                      upcomingServiceData.technician_name ||
                      upcomingServiceData.technicianName ||
                      upcomingServiceData.upcoming_technician ||
                      upcomingServiceData.upcoming_technician_name ||
                      servicesData.upcoming_service_technician ||
                      servicesData.upcomingServiceTechnician ||
                      'Not assigned',
            code: upcomingServiceData.upcoming_service_code || 
                 upcomingServiceData.upcomingServiceCode || 
                 upcomingServiceData.code ||
                 upcomingServiceData.service_code ||
                 servicesData.upcoming_service_code ||
                 servicesData.upcomingServiceCode ||
                 '',
          },
        };
        
        console.log('Mapped routine service:', JSON.stringify(routineService, null, 2));
        setRoutineService(routineService);
      }
    } catch (error) {
      console.error('Error loading routine services:', error);
    } finally {
      setIsLoadingRoutine(false);
    }
  };

  const handleDownloadServiceSlip = () => {
    // Handle download service slip
    console.log('Download service slip');
  };

  // Helper function to format date
  const formatServiceDate = (dateString: string): string => {
    if (!dateString || dateString === 'N/A' || dateString === '') return 'N/A';
    
    try {
      // Handle different date formats
      let date: Date;
      
      // If it's already in DD/MM/YYYY format, return as is
      if (typeof dateString === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return dateString;
      }
      
      // Try parsing as ISO date string
      date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Try parsing as other formats
        const parts = dateString.split(/[-/]/);
        if (parts.length === 3) {
          // Try YYYY-MM-DD or DD-MM-YYYY
          if (parts[0].length === 4) {
            date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
          } else {
            date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
        
        // If still invalid, return original string
        if (isNaN(date.getTime())) {
          return dateString;
        }
      }
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString || 'N/A';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />
      
      {/* Side Menu */}
      <SideMenu
        visible={isMenuVisible}
        onClose={handleCloseMenu}
        userData={user}
        onLogout={handleLogout}
        onNavigateToAddComplaint={() => navigateTo('/add-complaint')}
        onNavigateToComplaints={() => navigateTo('/complaints')}
        onNavigateToRoutineMaintenance={() => navigateTo('/routine-maintenance')}
        onNavigateToAMCContracts={() => navigateTo('/amc-contracts')}
        onNavigateToInvoice={() => navigateTo('/invoice')}
        onNavigateToQuotation={() => navigateTo('/quotation')}
        onNavigateToProfileSwitch={() => navigateTo('/profile-switch')}
        onNavigateToAboutUs={() => navigateTo('/about-us')}
        onNavigateToCreateUser={() => navigateTo('/create-user')}
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
          
          {user?.reference_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reference ID :</Text>
              <Text style={styles.infoValue}>{user.reference_id}</Text>
            </View>
          )}
          
          {user?.job_no && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Job No :</Text>
              <Text style={styles.infoValue}>{user.job_no}</Text>
            </View>
          )}
          
          {user?.site_name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Site Name :</Text>
              <Text style={styles.infoValue}>{user.site_name}</Text>
            </View>
          )}
          
          {user?.site_address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address :</Text>
              <Text style={styles.infoValue}>{user.site_address}</Text>
            </View>
          )}
          
          {(user?.city_name || user?.province_state_name) && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Location :</Text>
              <Text style={styles.infoValue}>
                {[user.city_name, user.province_state_name].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}
          
          {user?.pin_code && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Pin Code :</Text>
              <Text style={styles.infoValue}>{user.pin_code}</Text>
            </View>
          )}
          
          {user?.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone :</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          )}
          
          {user?.mobile && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mobile :</Text>
              <Text style={styles.infoValue}>{user.mobile}</Text>
            </View>
          )}
          
          {user?.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email :</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          )}
          
          {user?.contact_person_name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Person :</Text>
              <Text style={styles.infoValue}>{user.contact_person_name}</Text>
            </View>
          )}
          
          {user?.branch_name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Branch :</Text>
              <Text style={styles.infoValue}>{user.branch_name}</Text>
            </View>
          )}
          
          {user?.route_name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Route :</Text>
              <Text style={styles.infoValue}>{user.route_name}</Text>
            </View>
          )}
          
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionText}>
              Current Session : {user?.site_name || 'N/A'} | {user?.phone || user?.mobile || 'N/A'} | {user?.email || 'N/A'}
            </Text>
          </View>
        </View>

        {/* AMC Details Card */}
        {!isLoadingAMC && amcSummary && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>AMC DETAILS</Text>
            
            <View style={styles.amcSummaryRow}>
              <View style={styles.amcSummaryItem}>
                <Text style={styles.amcSummaryLabel}>Total Contracts</Text>
                <Text style={styles.amcSummaryValue}>{amcSummary.totalContracts}</Text>
              </View>
              
              <View style={styles.amcSummaryItem}>
                <Text style={styles.amcSummaryLabel}>Active Contracts</Text>
                <Text style={[styles.amcSummaryValue, { color: '#FF6B6B' }]}>
                  {amcSummary.activeContracts}
                </Text>
              </View>
            </View>
            
            <View style={styles.amcFinancialRow}>
              <View style={styles.amcFinancialItem}>
                <Text style={styles.amcFinancialLabel}>Total Amount</Text>
                <Text style={styles.amcFinancialValue}>
                  ₹{amcSummary.totalAmount.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.amcFinancialItem}>
                <Text style={styles.amcFinancialLabel}>Paid Amount</Text>
                <Text style={[styles.amcFinancialValue, { color: '#FF6B6B' }]}>
                  ₹{amcSummary.paidAmount.toFixed(2)}
                </Text>
              </View>
              
              <View style={styles.amcFinancialItem}>
                <Text style={styles.amcFinancialLabel}>Due Amount</Text>
                <Text style={[styles.amcFinancialValue, { color: '#F44336' }]}>
                  ₹{amcSummary.dueAmount.toFixed(2)}
                </Text>
              </View>
            </View>
            
            {amcSummary.latestContract && (
              <View style={styles.latestContractSection}>
                <Text style={styles.latestContractTitle}>Latest Contract</Text>
                <View style={styles.latestContractInfo}>
                  <Text style={styles.latestContractLabel}>Contract ID:</Text>
                  <Text style={styles.latestContractValue}>
                    {amcSummary.latestContract.contractId}
                  </Text>
                </View>
                <View style={styles.latestContractInfo}>
                  <Text style={styles.latestContractLabel}>Status:</Text>
                  <Text style={styles.latestContractValue}>
                    {amcSummary.latestContract.status}
                  </Text>
                </View>
                <View style={styles.latestContractInfo}>
                  <Text style={styles.latestContractLabel}>Period:</Text>
                  <Text style={styles.latestContractValue}>
                    {amcSummary.latestContract.period}
                  </Text>
                </View>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigateTo('/amc-contracts')}
            >
              <Text style={styles.viewAllButtonText}>View All AMC Contracts</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {amcSummary ? `${amcSummary.totalContracts} AMC${amcSummary.totalContracts !== 1 ? 's' : ''}` : 'No AMC'}
            </Text>
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
          
          {isLoadingRoutine ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading routine services...</Text>
            </View>
          ) : (
            <View style={styles.servicesContainer}>
              {/* Last Service Section */}
              <View style={styles.serviceSection}>
                <Text style={styles.serviceSectionTitle}>Last Service</Text>
                
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel}>Last Service :</Text>
                  <Text style={styles.serviceValue}>
                    {routineService?.lastService?.date && routineService.lastService.date.trim() !== '' 
                      ? formatServiceDate(routineService.lastService.date) 
                      : 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel}>Duration :</Text>
                  <Text style={styles.serviceValue}>
                    {routineService?.lastService?.duration && routineService.lastService.duration.trim() !== '' 
                      ? routineService.lastService.duration 
                      : 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel}>Technician :</Text>
                  <Text style={styles.serviceValue}>
                    {routineService?.lastService?.technician && routineService.lastService.technician.trim() !== '' 
                      ? routineService.lastService.technician 
                      : 'Not assigned Yet'}
                  </Text>
                </View>
                
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel}>Code :</Text>
                  <Text style={styles.serviceValue}>
                    {routineService?.lastService?.code && routineService.lastService.code.trim() !== '' 
                      ? routineService.lastService.code 
                      : 'Nil'}
                  </Text>
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
                  <Text style={styles.serviceValue}>
                    {routineService?.upcomingService?.date && routineService.upcomingService.date.trim() !== '' 
                      ? formatServiceDate(routineService.upcomingService.date) 
                      : 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel}>Duration :</Text>
                  <Text style={styles.serviceValue}>
                    {routineService?.upcomingService?.duration && routineService.upcomingService.duration.trim() !== '' 
                      ? routineService.upcomingService.duration 
                      : 'N/A'}
                  </Text>
                </View>
                
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel}>Technician :</Text>
                  <Text style={styles.serviceValue}>
                    {routineService?.upcomingService?.technician && routineService.upcomingService.technician.trim() !== '' 
                      ? routineService.upcomingService.technician 
                      : 'Not assigned'}
                  </Text>
                </View>
                
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceLabel}>Code :</Text>
                  <Text style={styles.serviceValue}>
                    {routineService?.upcomingService?.code && routineService.upcomingService.code.trim() !== '' 
                      ? routineService.upcomingService.code 
                      : 'N/A'}
                  </Text>
                </View>
              </View>
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
  amcSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  amcSummaryItem: {
    alignItems: 'center',
  },
  amcSummaryLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  amcSummaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  amcFinancialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  amcFinancialItem: {
    flex: 1,
    alignItems: 'center',
  },
  amcFinancialLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
  },
  amcFinancialValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  latestContractSection: {
    marginBottom: 15,
  },
  latestContractTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  latestContractInfo: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  latestContractLabel: {
    fontSize: 14,
    color: '#666666',
    width: 80,
  },
  latestContractValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
  },
  viewAllButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  viewAllButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default DashboardPage;
