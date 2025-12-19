// Simple in-memory router for React Native
export type Route = 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'add-complaint' 
  | 'complaints'
  | 'ticket-details'
  | 'routine-maintenance'
  | 'maintenance-details'
  | 'amc-contracts'
  | 'invoice'
  | 'quotation'

  | 'about-us'
  | 'create-user';

const ROUTE_STORAGE_KEY = 'atom-lionscl:current-route';

const isValidRoute = (value: string): value is Route => {
  return [
    'login',
    'register',
    'dashboard',
    'add-complaint',
    'complaints',
    'ticket-details',
    'routine-maintenance',
    'maintenance-details',
    'amc-contracts',
    'invoice',
    'quotation',

    'about-us',
    'create-user',
  ].includes(value);
};

const canUseBrowserStorage = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  } catch {
    return false;
  }
};

export class CustomRouter {
  private static instance: CustomRouter;
  private currentRoute: Route = 'login';
  private listeners: Array<(route: Route) => void> = [];

  private constructor() {
    // Simple in-memory router - no web dependencies
    const persistedRoute = this.loadPersistedRoute();
    if (persistedRoute) {
      this.currentRoute = persistedRoute;
    } else {
      // Only default to login if no persisted route exists
      this.currentRoute = 'login';
    }
  }

  static getInstance(): CustomRouter {
    if (!CustomRouter.instance) {
      CustomRouter.instance = new CustomRouter();
    }
    return CustomRouter.instance;
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentRoute));
  }

  navigate(route: Route): void {
    if (this.currentRoute === route) return;

    this.currentRoute = route;
    this.persistRoute(route);
    this.notifyListeners();
  }

  getCurrentRoute(): Route {
    return this.currentRoute;
  }

  subscribe(listener: (route: Route) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Initialize router
  initialize(): void {
    // Simple initialization - no web dependencies
    const persistedRoute = this.loadPersistedRoute();
    if (persistedRoute && persistedRoute !== this.currentRoute) {
      this.currentRoute = persistedRoute;
    }
    this.notifyListeners();
  }

  private persistRoute(route: Route): void {
    if (!canUseBrowserStorage()) return;
    try {
      window.localStorage.setItem(ROUTE_STORAGE_KEY, route);
    } catch {
      // Ignore storage errors (e.g., private mode, quota exceeded)
    }
  }

  private loadPersistedRoute(): Route | null {
    if (!canUseBrowserStorage()) return null;
    try {
      const storedValue = window.localStorage.getItem(ROUTE_STORAGE_KEY);
      if (storedValue && isValidRoute(storedValue)) {
        return storedValue;
      }
      return null;
    } catch {
      return null;
    }
  }
}
