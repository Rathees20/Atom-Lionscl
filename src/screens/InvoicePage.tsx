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

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  customer: string;
  // Additional fields that might be in the API response
  [key: string]: any; // Allow for additional fields
}

const InvoicePage: React.FC = () => {
  const { navigateTo, user } = useNavigation();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load invoices data on component mount
  useEffect(() => {
    loadInvoicesData();
  }, []);

  const loadInvoicesData = async () => {
    try {
      setIsLoading(true);

      // Get email from user object
      const userEmail = user?.email;
      if (!userEmail) {
        Alert.alert('Error', 'User email not found. Please login again.');
        setInvoices([]);
        setIsLoading(false);
        return;
      }

      // Add email as query parameter
      const url = `${API_ENDPOINTS.CUSTOMER_INVOICES}?email=${encodeURIComponent(userEmail)}`;

      console.log('Fetching invoices from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      console.log('Invoices API response:', data);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        // Handle different response formats
        let invoicesData = [];

        if (Array.isArray(data)) {
          invoicesData = data;
        } else if (data.invoices) {
          invoicesData = data.invoices;
        } else if (data.results) {
          invoicesData = data.results;
        } else if (data.data) {
          invoicesData = data.data;
        } else {
          // If none of the above, treat the whole response as a single invoice
          invoicesData = [data];
        }

        console.log('Processing invoices data:', invoicesData);

        // Map API response to Invoice interface
        const mappedInvoices: Invoice[] = invoicesData.map((item: any, index: number) => {
          // Create base invoice object with all fields from API response
          const invoice: Invoice = {
            id: item.id?.toString() || item.invoice_id?.toString() || item._id?.toString() || `invoice-${index}`,
            invoiceNumber: item.invoice_number || item.invoiceNumber || item.invoice_id || item.id || `INV-${index + 1}`,
            date: item.date || item.invoice_date || item.created_at || item.createdAt || 'N/A',
            amount: parseFloat(item.amount || item.total_amount || item.total || item.grand_total || '0') || 0,
            status: (item.status || item.Status || 'pending').toLowerCase() as 'paid' | 'pending' | 'overdue',
            customer: item.customer_name || item.customer || item.Customer || user?.site_name || 'Customer',
            // Include all other fields from the API response
            ...item
          };

          console.log(`Mapped invoice ${index}:`, invoice);
          return invoice;
        });

        setInvoices(mappedInvoices);
      } else {
        console.error('Error loading invoices:', data.error || data.message || response.statusText);
        Alert.alert('Error', data.error || data.message || 'Failed to load invoices. Please try again.');
        setInvoices([]);
      }
    } catch (error: any) {
      console.error('Error loading invoices data:', error);
      Alert.alert('Error', `Network error: ${error.message || 'Please check your connection and try again.'}`);
      setInvoices([]);
    } finally {
      setIsLoading(false);
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
  const renderAdditionalFields = (invoice: Invoice) => {
    const excludedFields = ['id', 'invoiceNumber', 'date', 'amount', 'status', 'customer', 'description', 'reference', 'notes', 'project'];
    const additionalFields = Object.keys(invoice).filter(key => !excludedFields.includes(key) && invoice[key] !== null && invoice[key] !== undefined && invoice[key] !== '');

    return additionalFields.map((key, index) => {
      const value = invoice[key];
      // Skip if value is N/A
      if (value === 'N/A') return null;

      return (
        <Text key={index} style={styles.additionalInfo}>
          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: {safeGetString(value)}
        </Text>
      );
    }).filter(Boolean); // Remove null values
  };

  const getStatusColor = (status: string) => {
    const statusStr = safeGetString(status).toLowerCase();
    switch (statusStr) {
      case 'paid':
        return '#4CAF50'; // Green
      case 'pending':
        return '#FF9800'; // Orange
      case 'overdue':
        return '#F44336'; // Red
      default:
        return '#666666';
    }
  };


  const handleBack = () => {
    navigateTo('/dashboard');
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

          <Text style={styles.headerTitle}>Invoices</Text>

          <View style={styles.placeholder} />
        </View>

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading invoices...</Text>
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

        <Text style={styles.headerTitle}>Invoices</Text>

        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {invoices.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No invoices found for your account.</Text>
            <Text style={styles.additionalInfo}>Please contact support if you believe this is an error.</Text>
          </View>
        )}

        {invoices.map((invoice, index) => (
          <View key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <Text style={styles.invoiceNumber}>{typeof invoice.invoiceNumber === 'string' && invoice.invoiceNumber.startsWith('#') ? invoice.invoiceNumber : `#${safeGetString(invoice.invoiceNumber)}`}</Text>
              <Text style={[styles.invoiceStatus, { color: getStatusColor(safeGetString(invoice.status)) }]}>
                {safeGetString(invoice.status).toUpperCase()}
              </Text>
            </View>

            <View style={styles.invoiceDetails}>
              <Text style={styles.customerName}>{safeGetString(invoice.customer)}</Text>
              <Text style={styles.invoiceDate}>{formatDate(safeGetString(invoice.date))}</Text>
              <Text style={styles.invoiceAmount}>{formatCurrency(safeGetNumber(invoice.amount))}</Text>
              {/* Display any additional fields that might be in the invoice data */}
              {invoice.description && invoice.description !== 'N/A' && (
                <Text style={styles.additionalInfo}>Description: {safeGetString(invoice.description)}</Text>
              )}
              {invoice.reference && invoice.reference !== 'N/A' && (
                <Text style={styles.additionalInfo}>Reference: {safeGetString(invoice.reference)}</Text>
              )}
              {invoice.notes && invoice.notes !== 'N/A' && (
                <Text style={styles.additionalInfo}>Notes: {safeGetString(invoice.notes)}</Text>
              )}
              {invoice.project && invoice.project !== 'N/A' && (
                <Text style={styles.additionalInfo}>Project: {safeGetString(invoice.project)}</Text>
              )}
              {/* Display all other fields */}
              {renderAdditionalFields(invoice)}
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
  invoiceCard: {
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  invoiceNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  invoiceStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
  },
  invoiceDetails: {
    gap: 4,
  },
  customerName: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  invoiceDate: {
    fontSize: 14,
    color: '#666666',
  },
  invoiceAmount: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
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
  additionalInfo: {
    fontSize: 14,
    color: '#666666',
    fontStyle: 'italic',
  },
});

export default InvoicePage;
