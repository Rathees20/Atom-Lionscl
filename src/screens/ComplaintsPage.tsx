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
  TextInput,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface Complaint {
  id: string;
  ticketNumber: string;
  createdDate: string;
  createdTime: string;
  assignedDate: string;
  assignedTime: string;
  status: 'open' | 'assigned' | 'in-progress' | 'closed';
  statusText: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const ComplaintsPage: React.FC = () => {
  const { navigateTo, navigationData } = useNavigation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Load complaints data on component mount
  useEffect(() => {
    loadComplaintsData();
  }, []);

  const loadComplaintsData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API call
      const mockComplaints: Complaint[] = [
        {
          id: '1',
          ticketNumber: '679',
          createdDate: '22 Sep, 2025',
          createdTime: '18:04:24',
          assignedDate: '22 Sep, 2025',
          assignedTime: '18:10:26',
          status: 'closed',
          statusText: '22 Sep, 2025 18:04:24 (closed)',
          description: 'LIFT NOT WORKING - Controller Not in ON Position',
          priority: 'high',
        },
        {
          id: '2',
          ticketNumber: '680',
          createdDate: '23 Sep, 2025',
          createdTime: '09:15:30',
          assignedDate: '23 Sep, 2025',
          assignedTime: '09:30:15',
          status: 'in-progress',
          statusText: '23 Sep, 2025 09:15:30 (in-progress)',
          description: 'Abnormal Noise From Motor',
          priority: 'medium',
        },
        {
          id: '3',
          ticketNumber: '681',
          createdDate: '24 Sep, 2025',
          createdTime: '14:22:45',
          assignedDate: '24 Sep, 2025',
          assignedTime: '14:45:20',
          status: 'assigned',
          statusText: '24 Sep, 2025 14:22:45 (assigned)',
          description: 'Display Not Working',
          priority: 'low',
        },
      ];

      setComplaints(mockComplaints);
    } catch (error) {
      console.error('Error loading complaints data:', error);
      setComplaints([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const handleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery(''); // Clear search when hiding
    }
  };

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchVisible(false);
  };

  const handleGoToDetails = (complaint: Complaint) => {
    // Navigate to ticket details page
    navigateTo('/ticket-details', complaint);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed':
        return '#4CAF50'; // Green
      case 'in-progress':
        return '#FF9800'; // Orange
      case 'assigned':
        return '#2196F3'; // Blue
      case 'open':
        return '#F44336'; // Red
      default:
        return '#666666';
    }
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.statusText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.priority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
          
          <Text style={styles.headerTitle}>Tickets</Text>
          
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Image 
              source={require('../assets/search.png')} 
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading tickets...</Text>
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
        
        <Text style={styles.headerTitle}>Tickets</Text>
        
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Image 
            source={require('../assets/search.png')} 
            style={styles.searchIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearchInputChange}
              placeholder="Search tickets by number, description, status..."
              placeholderTextColor="#999999"
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Search Results Info */}
      {isSearchVisible && searchQuery.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsText}>
            {filteredComplaints.length} ticket{filteredComplaints.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredComplaints.map((complaint, index) => (
          <View key={complaint.id} style={styles.ticketCard}>
            {/* Ticket Number and Details */}
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketNumber}>{index + 1}.</Text>
              
              <View style={styles.ticketDetails}>
                <Text style={styles.ticketId}>
                  {complaint.ticketNumber} # Created at {complaint.createdDate}
                </Text>
                <Text style={styles.ticketTime}>
                  {complaint.createdTime} # Assign at {complaint.assignedDate}
                </Text>
                <Text style={styles.ticketAssignTime}>
                  {complaint.assignedTime}(A)
                </Text>
                
                {/* Status */}
                <Text style={[styles.ticketStatus, { color: getStatusColor(complaint.status) }]}>
                  {complaint.statusText}
                </Text>
              </View>
              
              <TouchableOpacity style={styles.expandButton} onPress={() => toggleExpanded(complaint.id)}>
                <Text style={styles.expandIcon}>{expandedIds.has(complaint.id) ? '▲' : '▼'}</Text>
              </TouchableOpacity>
            </View>

            {/* Go to Details Button - only when expanded */}
            {expandedIds.has(complaint.id) && (
              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => handleGoToDetails(complaint)}
              >
                <Text style={styles.detailsButtonText}>Go to Details</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {filteredComplaints.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tickets found</Text>
          </View>
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
  searchButton: {
    padding: 5,
  },
  searchIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: 'bold',
  },
  searchResultsContainer: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  searchResultsText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  ticketNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginRight: 10,
    marginTop: 2,
  },
  ticketDetails: {
    flex: 1,
  },
  ticketId: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  ticketTime: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
  },
  ticketAssignTime: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 8,
  },
  ticketStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  expandButton: {
    padding: 5,
    marginLeft: 10,
  },
  expandIcon: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 16,
    fontWeight: 'normal',
  },
  detailsButton: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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

export default ComplaintsPage;
