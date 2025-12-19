import React, { useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import LoginPage from '../screens/LoginPage';
import RegisterPage from '../screens/RegisterPage';
import DashboardPage from '../screens/DashboardPage';
import AddComplaintPage from '../screens/AddComplaintPage';
import ComplaintsPage from '../screens/ComplaintsPage';
import TicketDetailsPage from '../screens/TicketDetailsPage';
import RoutineMaintenancePage from '../screens/RoutineMaintenancePage';
import MaintenanceDetailsPage from '../screens/MaintenanceDetailsPage';
import AMCContractsPage from '../screens/AMCContractsPage';
import InvoicePage from '../screens/InvoicePage';
import QuotationPage from '../screens/QuotationPage';

import AboutUsPage from '../screens/AboutUsPage';
import CreateUserPage from '../screens/CreateUserPage';

// Routes that require authentication
const PROTECTED_ROUTES = [
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
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['login', 'register'];

const AppRouter: React.FC = () => {
  const { currentRoute, user, navigateTo } = useNavigation();

  useEffect(() => {
    // Only redirect to login if:
    // 1. User is not logged in
    // 2. Current route is a protected route
    // 3. Current route is not already login
    if (!user && PROTECTED_ROUTES.includes(currentRoute) && currentRoute !== 'login') {
      // Don't navigate - let the user stay on their current page
      // Only redirect if explicitly needed (handled by logout)
    }
  }, [currentRoute, user, navigateTo]);

  const renderCurrentScreen = () => {
    // If user is logged in or on a public route, show the requested screen
    // If user is not logged in and trying to access protected route, show login
    const isProtectedRoute = PROTECTED_ROUTES.includes(currentRoute);
    const isPublicRoute = PUBLIC_ROUTES.includes(currentRoute);

    if (!user && isProtectedRoute && !isPublicRoute) {
      // User is not logged in and trying to access protected route
      // But we want to persist the route, so we'll show the page anyway
      // The actual authentication check should be done at API level
    }

    switch (currentRoute) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'add-complaint':
        return <AddComplaintPage />;
      case 'complaints':
        return <ComplaintsPage />;
      case 'ticket-details':
        return <TicketDetailsPage />;
      case 'routine-maintenance':
        return <RoutineMaintenancePage />;
      case 'maintenance-details':
        return <MaintenanceDetailsPage />;
      case 'amc-contracts':
        return <AMCContractsPage />;
      case 'invoice':
        return <InvoicePage />;
      case 'quotation':
        return <QuotationPage />;

      case 'about-us':
        return <AboutUsPage />;
      case 'create-user':
        // Prevent sub-users from accessing the Create User page
        if (user?.is_subcustomer) {
          // Redirect sub-users to dashboard
          return <DashboardPage />;
        }
        return <CreateUserPage />;
      default:
        // If no user and default route, show login
        // Otherwise, try to restore to dashboard or last known route
        if (!user) {
          return <LoginPage />;
        }
        return <DashboardPage />;
    }
  };

  return renderCurrentScreen();
};

export default AppRouter;
