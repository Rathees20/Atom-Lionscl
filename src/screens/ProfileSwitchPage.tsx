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

const { width, height } = Dimensions.get('window');

interface Profile {
  id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: string;
  avatar?: string;
  isActive: boolean;
}

const ProfileSwitchPage: React.FC = () => {
  const { navigateTo, user, setUser } = useNavigation();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles data on component mount
  useEffect(() => {
    loadProfilesData();
  }, []);

  const loadProfilesData = async () => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with actual API call
      const mockProfiles: Profile[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          mobileNumber: '9876543210',
          role: 'Admin',
          isActive: true,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          mobileNumber: '9876543211',
          role: 'Manager',
          isActive: false,
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          mobileNumber: '9876543212',
          role: 'Technician',
          isActive: false,
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          mobileNumber: '9876543213',
          role: 'Customer',
          isActive: false,
        },
      ];

      setProfiles(mockProfiles);
    } catch (error) {
      console.error('Error loading profiles data:', error);
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigateTo('/dashboard');
  };

  const handleProfileSwitch = (selectedProfile: Profile) => {
    Alert.alert(
      'Switch Profile',
      `Are you sure you want to switch to ${selectedProfile.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Switch',
          onPress: () => {
            // Update the current user
            setUser(selectedProfile);
            
            // Update active status
            setProfiles(prev => 
              prev.map(profile => ({
                ...profile,
                isActive: profile.id === selectedProfile.id
              }))
            );
            
            // Navigate back to dashboard
            navigateTo('/dashboard');
            
            Alert.alert('Success', `Switched to ${selectedProfile.name}`);
          },
        },
      ]
    );
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return '#E91E63'; // Pink
      case 'manager':
        return '#2196F3'; // Blue
      case 'technician':
        return '#FF9800'; // Orange
      case 'customer':
        return '#FF6B6B'; // Light Red
      default:
        return '#666666';
    }
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
          
          <Text style={styles.headerTitle}>Switch Profile</Text>
          
          <View style={styles.placeholder} />
        </View>

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profiles...</Text>
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
        
        <Text style={styles.headerTitle}>Switch Profile</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Select a profile to switch to. You can have multiple profiles for different roles.
          </Text>
        </View>

        {profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={[
              styles.profileCard,
              profile.isActive && styles.activeProfileCard
            ]}
            onPress={() => handleProfileSwitch(profile)}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{profile.name}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
                <Text style={styles.profileMobile}>{profile.mobileNumber}</Text>
              </View>
              
              <View style={styles.profileActions}>
                <View style={[styles.roleBadge, { backgroundColor: getRoleColor(profile.role) }]}>
                  <Text style={styles.roleText}>{profile.role}</Text>
                </View>
                {profile.isActive && (
                  <View style={styles.activeIndicator}>
                    <Text style={styles.activeText}>ACTIVE</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {profiles.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No profiles found</Text>
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
  infoContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  profileCard: {
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeProfileCard: {
    borderColor: '#FF6B6B',
    backgroundColor: '#F8FFF8',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  profileMobile: {
    fontSize: 14,
    color: '#666666',
  },
  profileActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  activeIndicator: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
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

export default ProfileSwitchPage;
