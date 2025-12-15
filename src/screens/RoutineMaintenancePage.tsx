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
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface MaintenanceItem {
  id: string;
  serviceDate: string;
  assign: string;
  status: 'all' | 'due' | 'overdue' | 'in progress' | 'completed';
  month: string;
}

const RoutineMaintenancePage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filteredItems, setFilteredItems] = useState<MaintenanceItem[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isTimeFrameDropdownOpen, setIsTimeFrameDropdownOpen] = useState(false);
  
  const statusOptions = ['all', 'due', 'overdue', 'in progress', 'completed'];
  const timeFrameOptions = [
    'All',
    'Previous Day',
    'Next 3 days',
    'Next 7 days',
    'Next 15 days',
    'Next 30 days',
    'Next 45 days',
    
  ];

  // Load maintenance items on component mount
  useEffect(() => {
    loadMaintenanceItems();
  }, []);

  // Update filtered items when maintenance items change
  useEffect(() => {
    setFilteredItems(maintenanceItems);
  }, [maintenanceItems]);

  const loadMaintenanceItems = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // Example API call:
      // const response = await fetch('/api/maintenance-items', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${userToken}` // if needed
      //   }
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }
      // 
      // const data = await response.json();
      // setMaintenanceItems(data);
      
      // For now, set empty array - data will come from API
      setMaintenanceItems([]);
    } catch (error) {
      console.error('Error loading maintenance items:', error);
      setMaintenanceItems([]);
      // You could show an error message to the user here
      // Alert.alert('Error', 'Failed to load maintenance items. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const handleGoToDetails = (item: MaintenanceItem) => {
    // Transform MaintenanceItem to MaintenanceDetails format
    const maintenanceDetails = {
      id: item.id,
      amcRef: `AMC${item.id}`, // Generate AMC ref from ID
      siteId: `98${item.id}`, // Generate site ID from item ID
      siteName: `Site ${item.id}`,
      siteAddress: 'Address not specified',
      serviceDate: item.serviceDate,
      month: item.month,
      siteCity: 'City not specified',
      status: item.status,
      blockWing: '',
      attendAt: '',
      attendBy: item.assign === 'Not assigned Yet' ? '' : item.assign,
    };
    
    navigateTo('/maintenance-details', maintenanceDetails);
  };

  const handleFilter = () => {
    setIsFilterModalVisible(true);
  };

  const handleCloseFilterModal = () => {
    setIsFilterModalVisible(false);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsStatusDropdownOpen(false);
  };

  const handleTimeFrameSelect = (timeFrame: string) => {
    setSelectedTimeFrame(timeFrame);
    setIsTimeFrameDropdownOpen(false);
  };

  const handleFilterSearch = () => {
    // Apply filters based on selected options
    let filtered = maintenanceItems;
    
    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }
    
    if (selectedTimeFrame && selectedTimeFrame !== 'All') {
      // Filter by time frame logic here
      // For now, just show all items as the time frame filtering would require
      // actual date calculations based on the service dates
      // This is a placeholder for the time frame filtering logic
    }
    
    setFilteredItems(filtered);
    setIsFilterModalVisible(false);
    Alert.alert('Filter Applied', 'Results have been filtered based on your selection.');
  };

  const handleSearchToggle = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
      setFilteredItems(maintenanceItems);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredItems(maintenanceItems);
    } else {
      const filtered = maintenanceItems.filter(item =>
        item.serviceDate.toLowerCase().includes(query.toLowerCase()) ||
        item.assign.toLowerCase().includes(query.toLowerCase()) ||
        item.month.toLowerCase().includes(query.toLowerCase()) ||
        item.status.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const handleRefresh = () => {
    loadMaintenanceItems();
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '(completed)';
      case 'due':
        return '(due)';
      case 'overdue':
        return '(overdue)';
      case 'in progress':
        return '(in progress)';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      
      {/* Blue Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image 
            source={require('../assets/left-chevron.png')} 
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Routine Maintenance</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchToggle}>
            <Image 
              source={require('../assets/search.png')} 
              style={styles.searchIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Input */}
      {isSearchVisible && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search maintenance items..."
            placeholderTextColor="#999"
            autoFocus={true}
          />
        </View>
      )}

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Loading maintenance items...</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No maintenance items found matching your search.' : 'No maintenance items available.'}
            </Text>
          </View>
        ) : (
          filteredItems.map((item, index) => (
          <View key={item.id} style={styles.maintenanceItem}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemNumber}>{index + 1}.</Text>
              <TouchableOpacity style={styles.expandButton}>
                <Text style={styles.expandIcon}>▼</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.itemDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Service Date:</Text>
                <Text style={styles.detailValue}>{item.serviceDate}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assign:</Text>
                <Text style={styles.detailValue}>
                  {item.assign} ({item.month})
                </Text>
              </View>
              
              <View style={styles.statusRow}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {getStatusText(item.status)}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.goToDetailsButton}
              onPress={() => handleGoToDetails(item)}
            >
              <Text style={styles.goToDetailsText}>Go to Details</Text>
            </TouchableOpacity>
          </View>
          ))
        )}
      </ScrollView>

      {/* Filter Floating Action Button */}
      <TouchableOpacity style={styles.filterFab} onPress={handleFilter}>
        <Image 
          source={require('../assets/filter.png')} 
          style={styles.filterIcon}
          resizeMode="contain"
        />
        <Text style={styles.filterText}>Filter</Text>
      </TouchableOpacity>

      {/* Filter Options Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseFilterModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Handle */}
            <View style={styles.modalHandle} />
            
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <Text style={styles.modalSubtitle}>Select your preferences below to filter results.</Text>
            </View>

            {/* Filter Fields */}
            <View style={styles.filterFields}>
              {/* Status Filter */}
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>Status</Text>
                <TouchableOpacity 
                  style={styles.filterDropdown}
                  onPress={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  <Text style={[styles.filterDropdownText, selectedStatus ? styles.filterDropdownTextSelected : null]}>
                    {selectedStatus || 'Select Status'}
                  </Text>
                  <Text style={styles.dropdownIcon}>{isStatusDropdownOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                
                {/* Status Options Dropdown */}
                {isStatusDropdownOpen && (
                  <View style={styles.dropdownOptions}>
                    {statusOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownOption,
                          selectedStatus === option ? styles.dropdownOptionSelected : null
                        ]}
                        onPress={() => handleStatusSelect(option)}
                      >
                        <Text style={[
                          styles.dropdownOptionText,
                          selectedStatus === option ? styles.dropdownOptionTextSelected : null
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Time Frame Filter */}
              <View style={styles.filterField}>
                <Text style={styles.filterLabel}>For</Text>
                <TouchableOpacity 
                  style={styles.filterDropdown}
                  onPress={() => setIsTimeFrameDropdownOpen(!isTimeFrameDropdownOpen)}
                >
                  <Text style={[styles.filterDropdownText, selectedTimeFrame ? styles.filterDropdownTextSelected : null]}>
                    {selectedTimeFrame || 'Select Time Frame'}
                  </Text>
                  <Text style={styles.dropdownIcon}>{isTimeFrameDropdownOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                
                {/* Time Frame Options Dropdown */}
                {isTimeFrameDropdownOpen && (
                  <View style={styles.dropdownOptions}>
                    {timeFrameOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownOption,
                          selectedTimeFrame === option ? styles.dropdownOptionSelected : null
                        ]}
                        onPress={() => handleTimeFrameSelect(option)}
                      >
                        <Text style={[
                          styles.dropdownOptionText,
                          selectedTimeFrame === option ? styles.dropdownOptionTextSelected : null
                        ]}>
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Search Button */}
            <TouchableOpacity style={styles.filterSearchButton} onPress={handleFilterSearch}>
              <Text style={styles.filterSearchButtonText}>SEARCH</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshButton: {
    padding: 5,
    marginRight: 10,
  },
  refreshIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    lineHeight: 22,
  },
  searchButton: {
    padding: 5,
  },
  searchIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  maintenanceItem: {
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
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  itemNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  expandButton: {
    padding: 5,
  },
  expandIcon: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 16,
    fontWeight: 'normal',
  },
  itemDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  statusRow: {
    marginTop: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  goToDetailsButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goToDetailsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  filterFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  filterIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#FFFFFF',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // Filter Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    minHeight: height * 0.5,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666666',
  },
  filterFields: {
    marginBottom: 30,
  },
  filterField: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  filterDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterDropdownText: {
    fontSize: 16,
    color: '#999999',
    flex: 1,
  },
  filterDropdownTextSelected: {
    color: '#333333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666666',
  },
  dropdownOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownOption: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dropdownOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333333',
  },
  dropdownOptionTextSelected: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  filterSearchButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RoutineMaintenancePage;
