import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CustomRouter, Route } from '../utils/customRouter';

interface NavigationContextType {
  user: any;
  mobileNumber: string;
  navigationData: any;
  setUser: (user: any) => void;
  setMobileNumber: (mobileNumber: string) => void;
  navigateTo: (path: string, data?: any) => void;
  clearNavigationData: () => void;
  currentRoute: Route;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [navigationData, setNavigationData] = useState<any>(null);
  const router = CustomRouter.getInstance();
  const [currentRoute, setCurrentRoute] = useState<Route>(router.getCurrentRoute());

  useEffect(() => {
    // Initialize router and subscribe to route changes
    router.initialize();
    
    const unsubscribe = router.subscribe((route: Route) => {
      setCurrentRoute(route);
    });

    return unsubscribe;
  }, []);

  const navigateTo = (path: string, data?: any) => {
    // Convert path to route
    const route = path.startsWith('/') ? path.slice(1) : path;
    const validRoute = route.replace('-', '-') as Route;
    
    // Store navigation data if provided
    if (data) {
      setNavigationData(data);
    }
    
    router.navigate(validRoute);
  };

  const clearNavigationData = () => {
    setNavigationData(null);
  };

  const value: NavigationContextType = {
    user,
    mobileNumber,
    navigationData,
    setUser,
    setMobileNumber,
    navigateTo,
    clearNavigationData,
    currentRoute,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
