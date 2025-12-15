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

const USER_STORAGE_KEY = 'atom-lionscl:user';
const MOBILE_STORAGE_KEY = 'atom-lionscl:mobile-number';
const NAV_DATA_STORAGE_KEY = 'atom-lionscl:navigation-data';
const ROUTE_STORAGE_KEY = 'atom-lionscl:current-route';

const canUseBrowserStorage = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (!canUseBrowserStorage()) return fallback;
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) return fallback;
    return JSON.parse(storedValue) as T;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key: string, value: unknown): void => {
  if (!canUseBrowserStorage()) return;
  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors (e.g., private browsing or quota exceeded)
  }
};

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<any>(() => loadFromStorage(USER_STORAGE_KEY, null));
  const [mobileNumber, setMobileNumberState] = useState<string>(() => loadFromStorage(MOBILE_STORAGE_KEY, ''));
  const [navigationData, setNavigationDataState] = useState<any>(() => loadFromStorage(NAV_DATA_STORAGE_KEY, null));
  const router = CustomRouter.getInstance();
  const [currentRoute, setCurrentRoute] = useState<Route>(router.getCurrentRoute());

  useEffect(() => {
    // Initialize router and subscribe to route changes
    router.initialize();
    
    // If user exists but route is login, navigate to dashboard
    // This handles the case where user refreshes and route defaults to login
    if (user && router.getCurrentRoute() === 'login') {
      router.navigate('dashboard');
    }
    
    const unsubscribe = router.subscribe((route: Route) => {
      setCurrentRoute(route);
    });

    return unsubscribe;
  }, []);
  
  // Separate effect to handle user state changes
  useEffect(() => {
    // If user is logged in and on login page, redirect to dashboard
    if (user && router.getCurrentRoute() === 'login') {
      router.navigate('dashboard');
    }
    // If user is logged out and not on login/register, stay on current page
    // (Only redirect on explicit logout, which is handled in setUser)
  }, [user]);

  useEffect(() => {
    saveToStorage(USER_STORAGE_KEY, user);
  }, [user]);

  useEffect(() => {
    saveToStorage(MOBILE_STORAGE_KEY, mobileNumber || null);
  }, [mobileNumber]);

  useEffect(() => {
    saveToStorage(NAV_DATA_STORAGE_KEY, navigationData);
  }, [navigationData]);

  const setUser = (value: any) => {
    setUserState(value);
    // If user is being cleared (logout), also clear the route and navigate to login
    if (value === null || value === undefined) {
      // Clear persisted route on logout
      if (canUseBrowserStorage()) {
        try {
          window.localStorage.removeItem(ROUTE_STORAGE_KEY);
        } catch {
          // Ignore storage errors
        }
      }
      // Navigate to login on logout
      router.navigate('login');
    }
  };

  const setMobileNumber = (value: string) => {
    setMobileNumberState(value);
  };

  const navigateTo = (path: string, data?: any) => {
    // Convert path to route
    const route = path.startsWith('/') ? path.slice(1) : path;
    const validRoute = route.replace('-', '-') as Route;
    
    // Store navigation data if provided
    if (data) {
      setNavigationDataState(data);
    }
    
    router.navigate(validRoute);
  };

  const clearNavigationData = () => {
    setNavigationDataState(null);
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
