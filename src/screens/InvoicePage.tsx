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
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Map API response to Invoice interface
        // Adjust the mapping based on your actual API response structure
        const mappedInvoices: Invoice[] = Array.isArray(data) 
          ? data.map((item: any) => ({
              id: item.id?.toString() || item.invoice_id?.toString() || '',
              invoiceNumber: item.invoice_number || item.invoiceNumber || item.invoice_id?.toString() || 'N/A',
              date: item.date || item.invoice_date || item.created_at || '',
              amount: parseFloat(item.amount || item.total_amount || item.total || '0'),
              status: (item.status || 'pending').toLowerCase() as 'paid' | 'pending' | 'overdue',
              customer: item.customer_name || item.customer || user?.site_name || 'Customer',
            }))
          : (data.invoices || data.results || []).map((item: any) => ({
              id: item.id?.toString() || item.invoice_id?.toString() || '',
              invoiceNumber: item.invoice_number || item.invoiceNumber || item.invoice_id?.toString() || 'N/A',
              date: item.date || item.invoice_date || item.created_at || '',
              amount: parseFloat(item.amount || item.total_amount || item.total || '0'),
              status: (item.status || 'pending').toLowerCase() as 'paid' | 'pending' | 'overdue',
              customer: item.customer_name || item.customer || user?.site_name || 'Customer',
            }));

        setInvoices(mappedInvoices);
      } else {
        console.error('Error loading invoices:', data.error || data.message);
        Alert.alert('Error', data.error || data.message || 'Failed to load invoices. Please try again.');
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error loading invoices data:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
        
        <Text style={styles.headerTitle}>Invoices</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {invoices.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No invoice found</Text>
          </View>
        )}

        {invoices.map((invoice, index) => (
          <View key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <Text style={styles.invoiceNumber}>#{invoice.invoiceNumber}</Text>
              <Text style={[styles.invoiceStatus, { color: getStatusColor(invoice.status) }]}>
                {invoice.status.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.invoiceDetails}>
              <Text style={styles.customerName}>{invoice.customer}</Text>
              <Text style={styles.invoiceDate}>{invoice.date}</Text>
              <Text style={styles.invoiceAmount}>₹{invoice.amount.toFixed(2)}</Text>
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
});

export default InvoicePage;
