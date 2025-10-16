import React from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { NavigationProvider } from './src/contexts/NavigationContext';
import AppRouter from './src/components/AppRouter';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const App: React.FC = () => {
        return (
    <NavigationProvider>
    <View style={[styles.container, isWeb && styles.webContainer]}>
        <AppRouter />
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
