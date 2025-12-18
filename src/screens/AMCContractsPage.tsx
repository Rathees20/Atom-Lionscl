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
import { API_ENDPOINTS } from '../utils/api';

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
  const { navigateTo, navigationData, user } = useNavigation();
  const [contracts, setContracts] = useState<AMCContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load contract data on component mount
  useEffect(() => {
    loadContractData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'overdue':
        return '#FF9800';
      case 'active':
        return '#FF6B6B';
      case 'expired':
        return '#F44336';
      case 'pending':
        return '#2196F3';
      default:
        return '#666666';
    }
  };

  const loadContractData = async () => {
    try {
      setIsLoading(true);

      // Get email from user object
      const userEmail = user?.email;
      if (!userEmail) {
        Alert.alert('Error', 'User email not found. Please login again.');
        setContracts([]);
        setIsLoading(false);
        return;
      }

      // Add email as query parameter
      const url = `${API_ENDPOINTS.CUSTOMER_AMCS}?email=${encodeURIComponent(userEmail)}`;

      console.log('Fetching AMC contracts from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('AMC contracts API response:', data);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        // Map API response to AMCContract interface
        let contractsData = [];

        // Handle different response formats
        if (Array.isArray(data)) {
          contractsData = data;
        } else if (data.amcs) {
          contractsData = data.amcs;
        } else if (data.contracts) {
          contractsData = data.contracts;
        } else if (data.results) {
          contractsData = data.results;
        } else if (data.data) {
          contractsData = data.data;
        } else {
          // If none of the above, treat the whole response as a single contract
          contractsData = [data];
        }

        console.log('Processing contracts data:', contractsData);

        const mappedContracts: AMCContract[] = contractsData.map((item: any, index: number) => {
          const mappedItem = {
            id: item.id?.toString() || item.amc_id?.toString() || item.contract_id?.toString() || `contract-${index}`,
            contractId: item.contract_id || item.contractId || item.amc_id || `CONTRACT-${index + 1}`,
            status: (item.status || item.Status || 'Pending').toString(),
            statusColor: getStatusColor(item.status || item.Status || 'Pending'),
            period: item.period || item.contract_period || item.Period || (item.start_date && item.end_date
              ? `${item.start_date} - ${item.end_date}` : (item.startDate && item.endDate ? `${item.startDate} - ${item.endDate}` : 'N/A')),
            periodStatus: item.period_status || item.status || item.Status || 'Active',
            amcType: item.amc_type || item.type || item.AmcType || item.amcType || 'Standard',
            contractAmount: item.contract_amount ? parseFloat(item.contract_amount) : (item.amount ? parseFloat(item.amount) : (item.ContractAmount ? parseFloat(item.ContractAmount) : undefined)),
            paidAmount: item.paid_amount ? parseFloat(item.paid_amount) : (item.paid ? parseFloat(item.paid) : (item.PaidAmount ? parseFloat(item.PaidAmount) : undefined)),
            dueAmount: item.due_amount ? parseFloat(item.due_amount) : (item.due ? parseFloat(item.due) : (item.DueAmount ? parseFloat(item.DueAmount) : undefined)),
            agreementUrl: item.agreement_url || item.agreementUrl || item.document_url || item.documentUrl || item.AgreementUrl || item.DocumentUrl,
          };

          console.log(`Mapped contract ${index}:`, mappedItem);
          return mappedItem;
        });

        console.log('Final mapped contracts:', mappedContracts);
        setContracts(mappedContracts);
      } else {
        console.error('Error loading AMC contracts:', data.error || data.message || response.statusText);
        Alert.alert('Error', data.error || data.message || 'Failed to load AMC contracts. Please try again.');
        setContracts([]);
      }
    } catch (error: any) {
      console.error('Error loading contract data:', error);
      Alert.alert('Error', `Network error: ${error.message || 'Please check your connection and try again.'}`);
      setContracts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const handleDownloadAgreement = async (contract: AMCContract) => {
    // Check if contract has an ID for the API endpoint
    if (!contract?.id) {
      Alert.alert('Error', 'Contract ID not found. Cannot download agreement.');
      return;
    }

    try {
      setIsDownloading(true);

      // Construct the download URL using the API endpoint
      const downloadUrl = API_ENDPOINTS.CUSTOMER_AMC_DOWNLOAD_AGREEMENT.replace('{amc_id}', contract.id);

      console.log('Downloading agreement from:', downloadUrl);

      if (isWeb) {
        // For web, open the document in a new tab or download
        const link = document.createElement('a');
        link.href = downloadUrl;
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
        //   downloadUrl,
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
    // Ensure amount is a number before formatting
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numAmount)) {
      return '₹ 0.00';
    }
    return `₹ ${numAmount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />

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

        {/* Client Information */}
        {user?.reference_id && (
          <View style={styles.clientInfoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reference ID:</Text>
              <Text style={styles.infoValue}>{user.reference_id}</Text>
            </View>
          </View>
        )}

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading contract details...</Text>
        </View>
      </View>
    );
  }

  if (contracts.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />

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

        {/* Client Information */}
        {user?.reference_id && (
          <View style={styles.clientInfoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reference ID:</Text>
              <Text style={styles.infoValue}>{user.reference_id}</Text>
            </View>
          </View>
        )}

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No AMC contracts found for your account.</Text>
          <Text style={styles.emptySubtext}>Please contact support if you believe this is an error.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B6B" />

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
        {/* Client Information */}
        {user?.reference_id && (
          <View style={styles.clientInfoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Reference ID:</Text>
              <Text style={styles.infoValue}>{user.reference_id}</Text>
            </View>
          </View>
        )}

        {contracts.map((contract) => (
          <View key={contract.id}>
            {/* Contract Details Card */}
            <View style={styles.contractCard}>
              {/* Contract ID */}
              <Text style={styles.contractId}>{contract.contractId || 'N/A'}</Text>

              {/* Status */}
              <Text style={[styles.status, { color: contract.statusColor || getStatusColor(contract.status || 'Pending') }]}>
                {contract.status}
              </Text>

              {/* Period */}
              <View style={styles.periodContainer}>
                <Text style={styles.periodText}>{contract.period || 'N/A'}</Text>
                <Text style={styles.periodStatus}>{contract.periodStatus || 'N/A'}</Text>
              </View>

              {/* AMC Type */}
              <Text style={styles.amcType}>AMC Type: {contract.amcType || 'Standard'}</Text>

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
            {contract.id && (
              <TouchableOpacity
                style={[styles.downloadButton, isDownloading && styles.downloadButtonDisabled]}
                onPress={() => handleDownloadAgreement(contract)}
                disabled={isDownloading}
              >
                <Text style={styles.downloadButtonText}>
                  {isDownloading ? 'DOWNLOADING...' : 'DOWNLOAD AGREEMENT'}
                </Text>
              </TouchableOpacity>
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
  emptySubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginTop: 10,
  },
  clientInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    margin: 20,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
});

export default AMCContractsPage;
