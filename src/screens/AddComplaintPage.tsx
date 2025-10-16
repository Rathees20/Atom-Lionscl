import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
// Responsive spacing for small devices
const horizontalPadding = width <= 360 ? 12 : 20;
const sectionSpacing = width <= 360 ? 18 : 25;

const AddComplaintPage: React.FC = () => {
  const { user, navigateTo } = useNavigation();
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactPersonMobile, setContactPersonMobile] = useState(user?.mobileNumber || '8072951720');
  const [selectedLift, setSelectedLift] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const complaintTemplates = [
    'LIFT NOT WORKING',
    'Controller Not in ON Position',
    'Abnormal Noise From Motor',
    'Display Not Working',
    'Cabin Vibration',
  ];


  const handleTemplateToggle = (template: string) => {
    setSelectedTemplates(prev => 
      prev.includes(template) 
        ? prev.filter(t => t !== template)
        : [...prev, template]
    );
  };

  const handleSubmit = async () => {
    if (!contactPersonName.trim()) {
      Alert.alert('Error', 'Please enter contact person name');
      return;
    }

    if (contactPersonMobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!selectedLift.trim()) {
      Alert.alert('Error', 'Please select a lift');
      return;
    }

    if (selectedTemplates.length === 0 && !description.trim()) {
      Alert.alert('Error', 'Please select at least one complaint template or add a description');
      return;
    }

    setIsLoading(true);
    
    const complaintData = {
      contactPersonName,
      contactPersonMobile,
      selectedLift,
      selectedTemplates,
      description,
      timestamp: new Date().toISOString(),
    };

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Complaint submitted successfully!');
      navigateTo('/dashboard');
    }, 1000);
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E91E63" />
      
      {/* Pink Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image 
            source={require('../assets/left-chevron.png')} 
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Add Complaint</Text>
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.submitIcon}>✓</Text>
          <Text style={styles.submitText}>
            {isLoading ? 'SUBMITTING...' : 'SUBMIT'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Person Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contact Person Name</Text>
          <TextInput
            style={styles.textInput}
            value={contactPersonName}
            onChangeText={setContactPersonName}
            placeholder=""
            placeholderTextColor="#999999"
          />
          <View style={styles.inputUnderline} />
        </View>

        {/* Contact Person Mobile */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contact Person Mobile No.</Text>
          <View style={styles.mobileInputWrapper}>
            <TextInput
              style={styles.mobileTextInput}
              value={contactPersonMobile}
              onChangeText={setContactPersonMobile}
              placeholder=""
              placeholderTextColor="#999999"
              keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'phone-pad'}
              maxLength={10}
            />
            <Text style={styles.characterCount}>{contactPersonMobile.length}/10</Text>
          </View>
          <View style={styles.inputUnderline} />
        </View>

        {/* Select Lift */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Select Lift</Text>
          <TouchableOpacity style={styles.liftSelector}>
            <Text style={selectedLift ? styles.liftSelectorText : styles.liftSelectorPlaceholder}>
              {selectedLift || 'Select Lift'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Complaint Templates */}
        <View style={styles.templatesContainer}>
          <Text style={styles.sectionTitle}>Complaint Templates</Text>
          {complaintTemplates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={styles.templateItem}
              onPress={() => handleTemplateToggle(template)}
            >
              <View style={styles.checkbox}>
                {selectedTemplates.includes(template) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.templateText}>{template}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder=""
            placeholderTextColor="#999999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E91E63',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
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
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  submitIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 6,
    lineHeight: 20,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: width <= 360 ? 20 : 30,
    paddingHorizontal: horizontalPadding,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: sectionSpacing,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  mobileInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  mobileTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    paddingVertical: 12,
    paddingRight: 50,
  },
  characterCount: {
    position: 'absolute',
    right: 0,
    fontSize: 12,
    color: '#666666',
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 5,
  },
  liftSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  liftSelectorText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
    paddingLeft: 8,
  },
  liftSelectorPlaceholder: {
    fontSize: 16,
    color: '#999999',
    flex: 1,
    paddingLeft: 8,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666666',
    marginRight: 8,
    lineHeight: 12,
    fontWeight: 'normal',
  },
  templatesContainer: {
    marginBottom: sectionSpacing,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 15,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 3,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  templateText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  descriptionContainer: {
    marginBottom: sectionSpacing,
  },
  descriptionInput: {
    fontSize: 16,
    color: '#000000',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    minHeight: 120,
    textAlignVertical: 'top',
  },
});

export default AddComplaintPage;
