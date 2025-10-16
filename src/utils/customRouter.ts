// Simple in-memory router for React Native
export type Route = 
  | 'login' 
  | 'register' 
  | 'otp' 
  | 'dashboard' 
  | 'add-complaint' 
  | 'complaints'
  | 'ticket-details'
  | 'routine-maintenance'
  | 'maintenance-details'
  | 'amc-contracts'
  | 'invoice'
  | 'quotation'
  | 'profile-switch';

export class CustomRouter {
  private static instance: CustomRouter;
  private currentRoute: Route = 'login';
  private listeners: Array<(route: Route) => void> = [];

  private constructor() {
    // Simple in-memory router - no web dependencies
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
    this.notifyListeners();
  }
}
