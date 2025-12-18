import React, { useState, useEffect } from 'react';
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
  KeyboardAvoidingView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';
import { API_ENDPOINTS } from '../utils/api';
import { CrossPlatformAlert } from '../utils/alerts';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
// Responsive spacing for small devices
const horizontalPadding = width <= 360 ? 12 : 20;
const sectionSpacing = width <= 360 ? 18 : 25;

interface Lift {
  id: string;
  name: string;
  liftId?: string;
  liftNumber?: string;
}

const AddComplaintPage: React.FC = () => {
  const { user, navigateTo } = useNavigation();
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactPersonMobile, setContactPersonMobile] = useState(user?.mobileNumber || user?.mobile || '');
  const [selectedLift, setSelectedLift] = useState('');
  const [selectedLiftId, setSelectedLiftId] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLifts, setIsLoadingLifts] = useState(false);
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [showLiftModal, setShowLiftModal] = useState(false);

  const complaintTemplates = [
    'LIFT NOT WORKING',
    'Controller Not in ON Position',
    'Abnormal Noise From Motor',
    'Display Not Working',
    'Cabin Vibration',
  ];

  // Load lifts when component mounts or when user email becomes available
  useEffect(() => {
    if (user?.email) {
      loadLifts();
    }
  }, [user?.email]);

  // Check for existing active complaints
  const checkExistingComplaints = async (): Promise<boolean> => {
    try {
      const userEmail = user?.email;
      if (!userEmail) {
        return false;
      }

      const url = `${API_ENDPOINTS.CUSTOMER_COMPLAINTS}?email=${encodeURIComponent(userEmail)}&status=open`;
      console.log('Checking for existing complaints:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Handle different response formats
        let complaintsArray: any[] = [];

        if (Array.isArray(data)) {
          complaintsArray = data;
        } else if (data.complaints && Array.isArray(data.complaints)) {
          complaintsArray = data.complaints;
        } else if (data.results && Array.isArray(data.results)) {
          complaintsArray = data.results;
        } else if (data.data && Array.isArray(data.data)) {
          complaintsArray = data.data;
        } else if (typeof data === 'object' && data !== null) {
          // Try to find any array property
          const keys = Object.keys(data);
          for (const key of keys) {
            if (Array.isArray(data[key])) {
              complaintsArray = data[key];
              break;
            }
          }
        }

        // Filter for active complaints (open, assigned, in-progress)
        const activeComplaints = complaintsArray.filter((complaint: any) => {
          const status = (complaint.status || '').toLowerCase();
          return status === 'open' || status === 'assigned' || status === 'in-progress';
        });

        console.log('Active complaints found:', activeComplaints.length);
        return activeComplaints.length > 0;
      }
    } catch (error) {
      console.error('Error checking existing complaints:', error);
    }

    // If there's an error, we'll allow the user to submit to avoid blocking them
    return false;
  };

  const loadLifts = async () => {
    try {
      setIsLoadingLifts(true);

      const userEmail = user?.email;
      if (!userEmail) {
        console.warn('User email not available for loading lifts');
        setIsLoadingLifts(false);
        return;
      }

      const url = `${API_ENDPOINTS.CUSTOMER_LIFTS}?email=${encodeURIComponent(userEmail)}`;
      console.log('Fetching lifts from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Lifts API Response:', JSON.stringify(data, null, 2));

      if (response.ok) {
        // Handle different response formats
        let liftsArray: any[] = [];

        if (Array.isArray(data)) {
          liftsArray = data;
        } else if (data.lifts && Array.isArray(data.lifts)) {
          liftsArray = data.lifts;
        } else if (data.results && Array.isArray(data.results)) {
          liftsArray = data.results;
        } else if (data.data && Array.isArray(data.data)) {
          liftsArray = data.data;
        } else if (typeof data === 'object' && data !== null) {
          // Try to find any array property
          const keys = Object.keys(data);
          for (const key of keys) {
            if (Array.isArray(data[key])) {
              liftsArray = data[key];
              break;
            }
          }
        }

        console.log('Extracted lifts array:', liftsArray);

        // Map API response to Lift interface
        const mappedLifts: Lift[] = liftsArray.map((item: any, index: number) => {
          // Try multiple field name variations for ID
          const id = item.id?.toString() ||
            item.lift_id?.toString() ||
            item.liftId?.toString() ||
            index.toString();

          // Try multiple field name variations for name
          const name = item.name ||
            item.lift_name ||
            item.liftName ||
            item.lift_number ||
            item.liftNumber ||
            item.title ||
            item.label ||
            `Lift ${id}`;

          return {
            id: id,
            name: name,
            liftId: item.lift_id?.toString() || item.liftId?.toString() || item.id?.toString() || id,
            liftNumber: item.lift_number || item.liftNumber || item.number,
          };
        });

        console.log('Mapped lifts:', mappedLifts);
        setLifts(mappedLifts);

        if (mappedLifts.length === 0) {
          console.warn('No lifts found in API response');
        }
      } else {
        console.error('Error loading lifts:', data.error || data.message);
        // Don't show alert for empty response, just log it
        if (data.error || data.message) {
          CrossPlatformAlert.alert('Error', data.error || data.message || 'Failed to load lifts. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error loading lifts:', error);
      CrossPlatformAlert.alert('Error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsLoadingLifts(false);
    }
  };

  const handleTemplateToggle = (template: string) => {
    setSelectedTemplates(prev =>
      prev.includes(template)
        ? prev.filter(t => t !== template)
        : [...prev, template]
    );
  };

  const handleSubmit = async () => {
    if (!contactPersonName.trim()) {
      CrossPlatformAlert.alert('Error', 'Please enter contact person name');
      return;
    }

    if (contactPersonMobile.length !== 10) {
      CrossPlatformAlert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!selectedLift.trim() || !selectedLiftId) {
      CrossPlatformAlert.alert('Error', 'Please select a lift');
      return;
    }

    if (selectedTemplates.length === 0 && !description.trim()) {
      CrossPlatformAlert.alert('Error', 'Please select at least one complaint template or add a description');
      return;
    }

    // Check for existing active complaints
    const hasActiveComplaints = await checkExistingComplaints();

    if (hasActiveComplaints) {
      CrossPlatformAlert.alert(
        'Active Complaint Exists',
        'You already have an active complaint. Please wait until it is resolved before submitting a new one.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Confirmation alert before submitting
    CrossPlatformAlert.alert(
      'Confirm Submission',
      'Are you sure you want to submit this complaint?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: async () => {
            setIsLoading(true);

            try {
              const userEmail = user?.email;
              if (!userEmail) {
                CrossPlatformAlert.alert('Error', 'User email not found. Please login again.');
                setIsLoading(false);
                return;
              }

              // Prepare complaint data
              const complaintData = {
                email: userEmail,
                contact_person_name: contactPersonName.trim(),
                contact_person_mobile: contactPersonMobile.trim(),
                lift_id: selectedLiftId,
                lift_name: selectedLift,
                complaint_templates: selectedTemplates,
                description: description.trim(),
                complaint_type: selectedTemplates.length > 0 ? selectedTemplates.join(', ') : description.trim(),
              };

              console.log('Submitting complaint:', complaintData);
              const response = await fetch(API_ENDPOINTS.CUSTOMER_CREATE_COMPLAINT, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(complaintData),
              });

              console.log('Response status:', response.status);
              console.log('Response ok:', response.ok);

              let data;
              try {
                const text = await response.text();
                console.log('Response text:', text);
                data = text ? JSON.parse(text) : {};
              } catch (parseError) {
                console.error('Error parsing response:', parseError);
                data = {};
              }

              // Check if request was successful (status 200-299 or 201 for created)
              if (response.ok || response.status === 201 || response.status === 200) {
                // Reset form first
                setContactPersonName('');
                setContactPersonMobile(user?.mobileNumber || user?.mobile || '');
                setSelectedLift('');
                setSelectedLiftId('');
                setSelectedTemplates([]);
                setDescription('');

                // Show success message
                const successMessage = data.message ||
                  data.success ||
                  data.detail ||
                  'Complaint submitted successfully!';

                CrossPlatformAlert.alert('Success', successMessage, [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigateTo('/dashboard');
                    },
                  },
                ]);
              } else {
                // Handle error response
                const errorMessage = data.error ||
                  data.message ||
                  data.detail ||
                  data.non_field_errors?.[0] ||
                  `Failed to submit complaint. Status: ${response.status}`;
                CrossPlatformAlert.alert('Error', errorMessage);
              }
            } catch (error) {
              console.error('Error submitting complaint:', error);
              CrossPlatformAlert.alert('Error', 'Network error. Please check your connection and try again.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLiftSelect = (lift: Lift) => {
    setSelectedLift(lift.name);
    setSelectedLiftId(lift.id);
    setShowLiftModal(false);
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
            <TouchableOpacity
              style={styles.liftSelector}
              onPress={() => {
                if (isLoadingLifts) {
                  return; // Don't open modal while loading
                }
                if (lifts.length === 0) {
                  // Try to reload lifts
                  CrossPlatformAlert.alert(
                    'No Lifts Available',
                    'No lifts found. Would you like to reload?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Reload', onPress: () => loadLifts() },
                    ]
                  );
                } else {
                  setShowLiftModal(true);
                }
              }}
              disabled={isLoadingLifts}
            >
              {isLoadingLifts ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#E91E63" />
                  <Text style={styles.loadingText}>Loading lifts...</Text>
                </View>
              ) : (
                <>
                  <Text style={selectedLift ? styles.liftSelectorText : styles.liftSelectorPlaceholder}>
                    {selectedLift || 'Select Lift'}
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </>
              )}
            </TouchableOpacity>
            {lifts.length > 0 && !isLoadingLifts && (
              <Text style={styles.liftCountText}>
                {lifts.length} lift{lifts.length !== 1 ? 's' : ''} available
              </Text>
            )}
          </View>

          {/* Lift Selection Modal */}
          <Modal
            visible={showLiftModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowLiftModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Lift</Text>
                  <TouchableOpacity onPress={() => setShowLiftModal(false)}>
                    <Text style={styles.modalCloseButton}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScrollView}>
                  {lifts.length === 0 ? (
                    <View style={styles.emptyLiftsContainer}>
                      <Text style={styles.emptyLiftsText}>No lifts available</Text>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => {
                          setShowLiftModal(false);
                          loadLifts();
                        }}
                      >
                        <Text style={styles.retryButtonText}>Retry</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    lifts.map((lift) => (
                      <TouchableOpacity
                        key={lift.id}
                        style={[
                          styles.liftOption,
                          selectedLiftId === lift.id && styles.liftOptionSelected
                        ]}
                        onPress={() => handleLiftSelect(lift)}
                      >
                        <Text style={[
                          styles.liftOptionText,
                          selectedLiftId === lift.id && styles.liftOptionTextSelected
                        ]}>
                          {lift.name}
                        </Text>
                        {selectedLiftId === lift.id && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>

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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.7,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  modalCloseButton: {
    fontSize: 24,
    color: '#666666',
    fontWeight: '300',
  },
  modalScrollView: {
    maxHeight: height * 0.6,
  },
  liftOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  liftOptionSelected: {
    backgroundColor: '#FFF5F8',
  },
  liftOptionText: {
    fontSize: 16,
    color: '#333333',
    flex: 1,
  },
  liftOptionTextSelected: {
    color: '#E91E63',
    fontWeight: '600',
  },
  emptyLiftsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyLiftsText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  liftCountText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default AddComplaintPage;
