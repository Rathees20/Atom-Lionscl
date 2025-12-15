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
  Image,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface TicketDetails {
  id: string;
  ticketId: string;
  siteId: string;
  siteName: string;
  address: string;
  assignAt: string;
  assignDate: string;
  assignTo: string;
  attendAt: string;
  attendBy: string;
  duration: string;
  status: string;
  statusColor: string;
}

interface CollapsibleSection {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  isExpanded: boolean;
  content?: React.ReactNode;
}

const TicketDetailsPage: React.FC = () => {
  const { navigateTo, navigationData } = useNavigation();
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [collapsibleSections, setCollapsibleSections] = useState<CollapsibleSection[]>([
    {
      id: 'ticket-info',
      title: 'Ticket Info',
      icon: 'ⓘ',
      iconColor: '#2196F3',
      isExpanded: false,
      content: (
        <View style={styles.ticketInfoContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Subject:</Text>
            <Text style={styles.infoValue}>LIFT NOT WORKING.</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Type:</Text>
            <Text style={styles.infoValue}>Break Down Calls</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact Person Name:</Text>
            <Text style={styles.infoValue}>Suriya</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact Person Mobile No:</Text>
            <Text style={styles.infoValue}>9597754821</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Description:</Text>
            <Text style={styles.infoValue}></Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Priority:</Text>
            <Text style={[styles.infoValue, { color: '#F44336', fontWeight: 'bold' }]}>High</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Solution Provided:</Text>
            <Text style={styles.infoValue}>part replaced, Customer Side Power issues</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Technician Remark:</Text>
            <Text style={styles.infoValue}>lift normal</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Technician Signature:</Text>
            <Text style={[styles.infoValue, styles.signatureText]}>[Signature]</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer Signature:</Text>
            <Text style={[styles.infoValue, styles.signatureText]}>[Signature]</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Signature Holder Name:</Text>
            <Text style={styles.infoValue}>sunat</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Signature Holder Designation:</Text>
            <Text style={styles.infoValue}>Building Owner</Text>
          </View>
        </View>
      ),
    },
    {
      id: 'ticket-closing-info',
      title: 'Ticket Closing Info',
      icon: '⚙',
      iconColor: '#9C27B0',
      isExpanded: false,
      content: (
        <View style={styles.ticketInfoContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Technician Remark:</Text>
            <Text style={styles.infoValue}>lift normal</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Closed By:</Text>
            <Text style={styles.infoValue}>Adhilakshmi</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Close Mode:</Text>
            <Text style={styles.infoValue}>by mobile app</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Technician Signature:</Text>
            <Text style={[styles.infoValue, styles.signatureText]}>[Signature]</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Customer Signature:</Text>
            <Text style={[styles.infoValue, styles.signatureText]}>[Signature]</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Signature Holder Name:</Text>
            <Text style={styles.infoValue}>sunat</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Signature Holder Designation:</Text>
            <Text style={styles.infoValue}>Building Owner</Text>
          </View>
        </View>
      ),
    },
    {
      id: 'material',
      title: 'Material',
      icon: '🛒',
      iconColor: '#9C27B0',
      isExpanded: false,
    },
    {
      id: 'project-details',
      title: 'Project Details',
      icon: '📋',
      iconColor: '#2196F3',
      isExpanded: false,
      content: (
        <View style={styles.ticketInfoContent}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PROJECT NAME:</Text>
            <Text style={styles.infoValue}>Test Site 1</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>AMC REF.:</Text>
            <Text style={styles.infoValue}></Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>AMC TYPE:</Text>
            <Text style={styles.infoValue}></Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>AMC STATUS:</Text>
            <Text style={styles.infoValue}></Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>AMC EXPIRY DATE:</Text>
            <Text style={[styles.infoValue, { color: '#4CAF50', fontWeight: 'bold' }]}>(Active)</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <View style={styles.addressRow}>
              <Text style={[styles.infoValue, { color: '#2196F3' }]}>No 27 th road kaladipet</Text>
              <TouchableOpacity style={styles.mapButton} onPress={handleViewMap}>
                <Text style={styles.mapIcon}>🔲</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ),
    },
  ]);

  // Load ticket details on component mount
  useEffect(() => {
    loadTicketDetails();
  }, []);

  const loadTicketDetails = async () => {
    try {
      setIsLoading(true);
      
      // Use navigation data if available, otherwise load from API
      if (navigationData) {
        setTicketDetails(navigationData);
      } else {
        // Mock data - replace with actual API call
        const mockTicketDetails: TicketDetails = {
          id: '1',
          ticketId: '679',
          siteId: '988888',
          siteName: 'Test Site 1',
          address: 'No 27 th road kaladipet',
          assignAt: '06:04 PM',
          assignDate: '22/09/2025',
          assignTo: 'Adhilakshmi;',
          attendAt: '22/09/2025 06:14 pm',
          attendBy: 'Adhilakshmi\nAdhilakshmi;',
          duration: '0.06 Hours',
          status: 'closed',
          statusColor: '#4CAF50',
        };
        setTicketDetails(mockTicketDetails);
      }
    } catch (error) {
      console.error('Error loading ticket details:', error);
      setTicketDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/complaints');
  };

  const handleExportPDF = () => {
    Alert.alert('Export PDF', 'PDF export functionality will be implemented.');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality will be implemented.');
  };

  const handleViewMap = () => {
    Alert.alert('View Map', 'Map view functionality will be implemented.');
  };

  const toggleSection = (sectionId: string) => {
    setCollapsibleSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
  };

  if (isLoading) {
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
          
          <Text style={styles.headerTitle}>Ticket</Text>
        </View>

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading ticket details...</Text>
        </View>
      </View>
    );
  }

  if (!ticketDetails) {
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
          
          <Text style={styles.headerTitle}>Ticket</Text>
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No ticket details available.</Text>
        </View>
      </View>
    );
  }

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
        
        <Text style={styles.headerTitle}>Ticket</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ticket ID Card */}
        <View style={styles.card}>
          <View style={styles.ticketIdContainer}>
            <Text style={styles.ticketIdLabel}>Ticket id: </Text>
            <Text style={styles.ticketIdValue}>{ticketDetails.ticketId}</Text>
            
            <View style={styles.ticketActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleExportPDF}>
                <Text style={styles.pdfIcon}>📄</Text>
                <Text style={styles.pdfText}>PDF</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Text style={styles.shareIcon}>🔗</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Site Information Card */}
        <View style={styles.card}>
          <View style={styles.siteInfo}>
            <View style={styles.siteIconContainer}>
              <Text style={styles.siteIcon}>🏢</Text>
            </View>
            
            <View style={styles.siteDetails}>
              <Text style={styles.siteId}>{ticketDetails.siteId}</Text>
              <Text style={styles.siteName}>{ticketDetails.siteName}</Text>
              <View style={styles.addressContainer}>
                <Text style={styles.address}>{ticketDetails.address}</Text>
                <TouchableOpacity style={styles.mapButton} onPress={handleViewMap}>
                  <Text style={styles.mapIcon}>🔲</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline and Status Card */}
        <View style={styles.card}>
          {/* Timeline Section */}
          <View style={styles.timelineContainer}>
            {/* Assign At */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Assign At: {ticketDetails.assignAt}</Text>
                  <Text style={styles.timelineDate}>{ticketDetails.assignDate}</Text>
                </View>
              </View>
              
              <View style={styles.timelineRight}>
                <Text style={styles.timelineLabel}>Assign To:</Text>
                <Text style={styles.timelineValue}>{ticketDetails.assignTo}</Text>
              </View>
            </View>

            {/* Timeline Line */}
            <View style={styles.timelineLine} />

            {/* Attend At */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Attend At: {ticketDetails.attendAt}</Text>
                </View>
              </View>
              
              <View style={styles.timelineRight}>
                <Text style={styles.timelineLabel}>Attend By:</Text>
                <Text style={styles.timelineValue}>{ticketDetails.attendBy}</Text>
              </View>
            </View>
          </View>

          {/* Duration and Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.duration}>Duration: {ticketDetails.duration}</Text>
            <Text style={[styles.status, { color: ticketDetails.statusColor }]}>
              ({ticketDetails.status})
            </Text>
          </View>
        </View>

        {/* Collapsible Sections */}
        {collapsibleSections.map((section) => (
          <View key={section.id} style={styles.card}>
            <TouchableOpacity 
              style={styles.collapsibleHeader}
              onPress={() => toggleSection(section.id)}
            >
              <View style={styles.sectionHeaderLeft}>
                <Text style={[styles.sectionIcon, { color: section.iconColor }]}>
                  {section.icon}
                </Text>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              
              <Text style={styles.expandIcon}>
                {section.isExpanded ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            
            {section.isExpanded && section.content && (
              <View style={styles.collapsibleContent}>
                {section.content}
              </View>
            )}
          </View>
        ))}
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
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
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
  ticketIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketIdLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  ticketIdValue: {
    fontSize: 18,
    color: '#F44336',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  ticketActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    padding: 5,
  },
  pdfIcon: {
    fontSize: 16,
    color: '#F44336',
    marginRight: 4,
  },
  pdfText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: 'bold',
  },
  shareIcon: {
    fontSize: 16,
    color: '#F44336',
  },
  siteInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  siteIconContainer: {
    marginRight: 15,
    marginTop: 5,
  },
  siteIcon: {
    fontSize: 24,
    color: '#2196F3',
  },
  siteDetails: {
    flex: 1,
  },
  siteId: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 4,
  },
  siteName: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  address: {
    fontSize: 14,
    color: '#2196F3',
    flex: 1,
  },
  mapButton: {
    padding: 5,
  },
  mapIcon: {
    fontSize: 16,
    color: '#2196F3',
  },
  timelineContainer: {
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  timelineLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
    marginRight: 10,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 14,
    color: '#333333',
  },
  timelineRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  timelineValue: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'right',
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E91E63',
    marginLeft: 3,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duration: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 16,
    fontWeight: 'normal',
  },
  collapsibleContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  ticketInfoContent: {
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    width: 160,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  signatureText: {
    fontStyle: 'italic',
    color: '#666666',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default TicketDetailsPage;
