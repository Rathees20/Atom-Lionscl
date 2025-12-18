import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { NavigationProvider } from './src/contexts/NavigationContext';
import AppRouter from './src/components/AppRouter';
import { CustomAlert } from './src/utils/alerts';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const App: React.FC = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState<{ text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive' }[]>([{ text: 'OK' }]);

  useEffect(() => {
    const handleShowAlert = (event: Event) => {
      const customEvent = event as CustomEvent;
      setAlertTitle(customEvent.detail.title);
      setAlertMessage(customEvent.detail.message);
      setAlertButtons(customEvent.detail.buttons || [{ text: 'OK' }]);
      setAlertVisible(true);
    };

    window.addEventListener('showCustomAlert', handleShowAlert as EventListener);
    return () => {
      window.removeEventListener('showCustomAlert', handleShowAlert as EventListener);
    };
  }, []);

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <NavigationProvider>
      <View style={[styles.container, isWeb && styles.webContainer]}>
        <AppRouter />
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          buttons={alertButtons}
          onClose={handleCloseAlert}
        />
      </View>
    </NavigationProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webContainer: {
    minHeight: height,
    maxWidth: width,
    overflow: 'hidden',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
