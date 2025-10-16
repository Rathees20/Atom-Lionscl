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
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');

interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  customer: string;
  validUntil: string;
}

const QuotationPage: React.FC = () => {
  const { navigateTo } = useNavigation();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load quotations data on component mount
  useEffect(() => {
    loadQuotationsData();
  }, []);

  const loadQuotationsData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API call
      const mockQuotations: Quotation[] = [
        // Empty array for now to show "No quotation found" message
      ];

      setQuotations(mockQuotations);
    } catch (error) {
      console.error('Error loading quotations data:', error);
      setQuotations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50'; // Green
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

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0066CC" />
        
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
      <StatusBar barStyle="light-content" backgroundColor="#0066CC" />
      
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
            <Text style={styles.emptyText}>No quotation found</Text>
          </View>
        )}

        {quotations.map((quotation, index) => (
          <View key={quotation.id} style={styles.quotationCard}>
            <View style={styles.quotationHeader}>
              <Text style={styles.quotationNumber}>#{quotation.quotationNumber}</Text>
              <Text style={[styles.quotationStatus, { color: getStatusColor(quotation.status) }]}>
                {quotation.status.toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.quotationDetails}>
              <Text style={styles.customerName}>{quotation.customer}</Text>
              <Text style={styles.quotationDate}>Date: {quotation.date}</Text>
              <Text style={styles.validUntil}>Valid Until: {quotation.validUntil}</Text>
              <Text style={styles.quotationAmount}>₹{quotation.amount.toFixed(2)}</Text>
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
    backgroundColor: '#0066CC',
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
