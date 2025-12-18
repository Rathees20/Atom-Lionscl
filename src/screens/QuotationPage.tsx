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

interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  customer: string;
  validUntil: string;
  // Additional fields that might be in the API response
  [key: string]: any; // Allow for additional fields
}

const QuotationPage: React.FC = () => {
  const { navigateTo, user } = useNavigation();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load quotations data on component mount
  useEffect(() => {
    loadQuotationsData();
  }, []);

  const loadQuotationsData = async () => {
    try {
      setIsLoading(true);

      // Get email from user object
      const userEmail = user?.email;
      if (!userEmail) {
        Alert.alert('Error', 'User email not found. Please login again.');
        setQuotations([]);
        setIsLoading(false);
        return;
      }

      // Add email as query parameter
      const url = `${API_ENDPOINTS.CUSTOMER_QUOTATIONS}?email=${encodeURIComponent(userEmail)}`;

      console.log('Fetching quotations from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('Quotations API response:', data);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        // Handle different response formats
        let quotationsData = [];

        if (Array.isArray(data)) {
          quotationsData = data;
        } else if (data.quotations) {
          quotationsData = data.quotations;
        } else if (data.results) {
          quotationsData = data.results;
        } else if (data.data) {
          quotationsData = data.data;
        } else {
          // If none of the above, treat the whole response as a single quotation
          quotationsData = [data];
        }

        console.log('Processing quotations data:', quotationsData);

        // Map API response to Quotation interface
        const mappedQuotations: Quotation[] = quotationsData.map((item: any, index: number) => {
          // Create base quotation object with all fields from API response
          const quotation: Quotation = {
            id: item.id?.toString() || item.quotation_id?.toString() || item._id?.toString() || `quotation-${index}`,
            quotationNumber: item.quotation_number || item.quotationNumber || item.quotation_id || item.id || `QT-${index + 1}`,
            date: item.date || item.quotation_date || item.created_at || item.createdAt || 'N/A',
            amount: parseFloat(item.amount || item.total_amount || item.total || item.grand_total || '0') || 0,
            status: (item.status || item.Status || 'pending').toLowerCase() as 'pending' | 'approved' | 'rejected' | 'expired',
            customer: item.customer_name || item.customer || item.Customer || user?.site_name || 'Customer',
            validUntil: item.valid_until || item.validUntil || item.expiry_date || item.expires_at || item.ExpiryDate || 'N/A',
            // Include all other fields from the API response
            ...item
          };

          console.log(`Mapped quotation ${index}:`, quotation);
          return quotation;
        });

        setQuotations(mappedQuotations);
      } else {
        console.error('Error loading quotations:', data.error || data.message || response.statusText);
        Alert.alert('Error', data.error || data.message || 'Failed to load quotations. Please try again.');
        setQuotations([]);
      }
    } catch (error: any) {
      console.error('Error loading quotations data:', error);
      Alert.alert('Error', `Network error: ${error.message || 'Please check your connection and try again.'}`);
      setQuotations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const getStatusColor = (status: string) => {
    const statusStr = safeGetString(status).toLowerCase();
    switch (statusStr) {
      case 'approved':
        return '#FF6B6B'; // Light Red
      case 'pending':
        return '#FF9800'; // Orange
      case 'rejected':
        return '#F44336'; // Red
      case 'expired':
        return '#9E9E9E'; // Gray
      default:
        return '#666666';
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === 'N/A') return dateString;

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
        const parts = dateString.split(/[-\/]/);
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

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    if (isNaN(amount)) return '₹ 0.00';
    return `₹ ${amount.toFixed(2)}`;
  };

  // Helper function to safely get string values
  const safeGetString = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Helper function to safely get number values
  const safeGetNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'object') return 0;
    const num = parseFloat(String(value));
    return isNaN(num) ? 0 : num;
  };

  // Helper function to display additional fields
  const renderAdditionalFields = (quotation: Quotation) => {
    const excludedFields = ['id', 'quotationNumber', 'date', 'amount', 'status', 'customer', 'validUntil', 'description', 'reference', 'notes', 'project'];
    const additionalFields = Object.keys(quotation).filter(key => !excludedFields.includes(key) && quotation[key] !== null && quotation[key] !== undefined && quotation[key] !== '');

    return additionalFields.map((key, index) => {
      const value = quotation[key];
      // Skip if value is N/A
      if (value === 'N/A') return null;

      return (
        <Text key={index} style={styles.additionalInfo}>
          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: {safeGetString(value)}
        </Text>
      );
    }).filter(Boolean); // Remove null values
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

          <Text style={styles.headerTitle}>Quotations</Text>

          <View style={styles.placeholder} />
        </View>

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quotations...</Text>
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

        <Text style={styles.headerTitle}>Quotations</Text>

        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {quotations.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No quotations found for your account.</Text>
            <Text style={styles.additionalInfo}>Please contact support if you believe this is an error.</Text>
          </View>
        )}

        {quotations.map((quotation, index) => (
          <View key={quotation.id} style={styles.quotationCard}>
            <View style={styles.quotationHeader}>
              <Text style={styles.quotationNumber}>{typeof quotation.quotationNumber === 'string' && quotation.quotationNumber.startsWith('#') ? quotation.quotationNumber : `#${safeGetString(quotation.quotationNumber)}`}</Text>
              <Text style={[styles.quotationStatus, { color: getStatusColor(safeGetString(quotation.status)) }]}>
                {safeGetString(quotation.status).toUpperCase()}
              </Text>
            </View>

            <View style={styles.quotationDetails}>
              <Text style={styles.customerName}>{safeGetString(quotation.customer)}</Text>
              <Text style={styles.quotationDate}>Date: {formatDate(safeGetString(quotation.date))}</Text>
              <Text style={styles.validUntil}>Valid Until: {formatDate(safeGetString(quotation.validUntil))}</Text>
              <Text style={styles.quotationAmount}>{formatCurrency(safeGetNumber(quotation.amount))}</Text>
              {/* Display any additional fields that might be in the quotation data */}
              {quotation.description && quotation.description !== 'N/A' && (
                <Text style={styles.additionalInfo}>Description: {safeGetString(quotation.description)}</Text>
              )}
              {quotation.reference && quotation.reference !== 'N/A' && (
                <Text style={styles.additionalInfo}>Reference: {safeGetString(quotation.reference)}</Text>
              )}
              {quotation.notes && quotation.notes !== 'N/A' && (
                <Text style={styles.additionalInfo}>Notes: {safeGetString(quotation.notes)}</Text>
              )}
              {quotation.project && quotation.project !== 'N/A' && (
                <Text style={styles.additionalInfo}>Project: {safeGetString(quotation.project)}</Text>
              )}
              {/* Display all other fields */}
              {renderAdditionalFields(quotation)}
            </View>
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
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  quotationCard: {
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
  quotationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quotationNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  quotationStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  quotationDetails: {
    gap: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  quotationDate: {
    fontSize: 14,
    color: '#666666',
  },
  validUntil: {
    fontSize: 14,
    color: '#666666',
  },
  quotationAmount: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  additionalInfo: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
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

export default QuotationPage;
