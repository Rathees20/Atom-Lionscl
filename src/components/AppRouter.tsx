import React from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import LoginPage from '../screens/LoginPage';
import RegisterPage from '../screens/RegisterPage';
import OTPVerificationPage from '../screens/OTPVerificationPage';
import DashboardPage from '../screens/DashboardPage';
import AddComplaintPage from '../screens/AddComplaintPage';
import ComplaintsPage from '../screens/ComplaintsPage';
import TicketDetailsPage from '../screens/TicketDetailsPage';
import RoutineMaintenancePage from '../screens/RoutineMaintenancePage';
import MaintenanceDetailsPage from '../screens/MaintenanceDetailsPage';
import AMCContractsPage from '../screens/AMCContractsPage';
import InvoicePage from '../screens/InvoicePage';
import QuotationPage from '../screens/QuotationPage';
import ProfileSwitchPage from '../screens/ProfileSwitchPage';

const AppRouter: React.FC = () => {
  const { currentRoute } = useNavigation();

  const renderCurrentScreen = () => {
    switch (currentRoute) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'otp':
        return <OTPVerificationPage />;
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
      case 'profile-switch':
        return <ProfileSwitchPage />;
      default:
        return <LoginPage />;
    }
  };

  return renderCurrentScreen();
};

export default AppRouter;
