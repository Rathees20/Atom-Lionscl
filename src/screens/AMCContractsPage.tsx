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

interface AMCContract {
  id: string;
  contractId: string;
  status: string;
  statusColor: string;
  period: string;
  periodStatus: string;
  amcType: string;
  contractAmount: number | undefined;
  paidAmount: number | undefined;
  dueAmount: number | undefined;
  agreementUrl?: string;
}

const AMCContractsPage: React.FC = () => {
  const { navigateTo, navigationData } = useNavigation();
  const [contract, setContract] = useState<AMCContract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load contract data on component mount
  useEffect(() => {
    loadContractData();
  }, []);

  const loadContractData = async () => {
    try {
      setIsLoading(true);
      
      // Use navigation data if available, otherwise load from API
      if (navigationData) {
        setContract(navigationData);
      } else {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/amc-contracts/${contractId}`);
        // const data = await response.json();
        // setContract(data);
        
        // For now, show empty state - data will come from API
        setContract(null);
      }
    } catch (error) {
      console.error('Error loading contract data:', error);
      setContract(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const handleDownloadAgreement = async () => {
    if (!contract?.agreementUrl) {
      Alert.alert('Error', 'Agreement document is not available for download.');
      return;
    }

    try {
      setIsDownloading(true);
      
      if (isWeb) {
        // For web, open the document in a new tab or download
        const link = document.createElement('a');
        link.href = contract.agreementUrl;
        link.download = `AMC_${contract.contractId}_Agreement.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Alert.alert('Success', 'Agreement download started successfully!');
      } else {
        // For mobile, you would use a library like react-native-fs or expo-file-system
        // Example with expo-file-system:
        // import * as FileSystem from 'expo-file-system';
        // const { uri } = await FileSystem.downloadAsync(
        //   contract.agreementUrl,
        //   FileSystem.documentDirectory + `AMC_${contract.contractId}_Agreement.pdf`
        // );
        // Alert.alert('Success', 'Agreement downloaded successfully!');
        
        Alert.alert('Download', 'Download functionality will be implemented for mobile devices.');
      }
    } catch (error) {
      console.error('Error downloading agreement:', error);
      Alert.alert('Error', 'Failed to download agreement. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return '₹ 0.00';
    }
    return `₹ ${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'overdue':
        return '#FF9800';
      case 'active':
        return '#4CAF50';
      case 'expired':
        return '#F44336';
      case 'pending':
        return '#2196F3';
      default:
        return '#666666';
    }
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
          
          <Text style={styles.headerTitle}>AMC Contracts</Text>
          
          <View style={styles.headerRight} />
        </View>

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading contract details...</Text>
        </View>
      </View>
    );
  }

  if (!contract) {
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
          
          <Text style={styles.headerTitle}>AMC Contracts</Text>
          
          <View style={styles.headerRight} />
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No contract details available.</Text>
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
        
        <Text style={styles.headerTitle}>AMC Contracts</Text>
        
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contract Details Card */}
        <View style={styles.contractCard}>
          {/* Contract ID */}
          <Text style={styles.contractId}>{contract.contractId}</Text>
          
          {/* Status */}
          <Text style={[styles.status, { color: getStatusColor(contract.status) }]}>
            {contract.status}
          </Text>
          
          {/* Period */}
          <View style={styles.periodContainer}>
            <Text style={styles.periodText}>{contract.period}</Text>
            <Text style={styles.periodStatus}>{contract.periodStatus}</Text>
          </View>
          
          {/* AMC Type */}
          <Text style={styles.amcType}>AMC Type: {contract.amcType}</Text>
          
          {/* Financial Details */}
          <View style={styles.financialSection}>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Contract Amount:</Text>
              <Text style={styles.financialValue}>{formatCurrency(contract.contractAmount)}</Text>
            </View>
            
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Paid Amount:</Text>
              <Text style={styles.financialValue}>{formatCurrency(contract.paidAmount)}</Text>
            </View>
            
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Due Amount:</Text>
              <Text style={styles.financialValue}>{formatCurrency(contract.dueAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Download Button */}
        <TouchableOpacity 
          style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]}
          onPress={handleDownloadAgreement}
          disabled={isDownloading}
        >
          <Text style={styles.downloadButtonText}>
            {isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD AGREEMENT'}
          </Text>
        </TouchableOpacity>
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
  headerRight: {
    width: 34, // Same width as back button for balance
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contractCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contractId: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  periodContainer: {
    marginBottom: 16,
  },
  periodText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  periodStatus: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '500',
  },
  amcType: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 24,
  },
  financialSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  financialLabel: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  financialValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: '#E91E63',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  downloadButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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

export default AMCContractsPage;
