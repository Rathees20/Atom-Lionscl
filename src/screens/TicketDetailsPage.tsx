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
  Alert,
  Image,
  Linking,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';
import { API_ENDPOINTS } from '../utils/api';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

interface TicketDetails {
  id: string;
  ticketId: string;
  ticketNumber?: string;
  siteId: string;
  siteName: string;
  address: string;
  assignAt: string;
  assignDate: string;
  assignTo: string;
  attendAt: string;
  attendBy: string;
  duration: string;
  status: string;
  statusColor: string;
  // Additional fields for ticket info
  subject?: string;
  type?: string;
  contactPersonName?: string;
  contactPersonMobile?: string;
  description?: string;
  priority?: string;
  solutionProvided?: string;
  technicianRemark?: string;
  technicianSignature?: string;
  customerSignature?: string;
  signatureHolderName?: string;
  signatureHolderDesignation?: string;
  closedBy?: string;
  closeMode?: string;
  projectName?: string;
  amcRef?: string;
  amcType?: string;
  amcStatus?: string;
  amcExpiryDate?: string;
}

interface CollapsibleSection {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  isExpanded: boolean;
  content?: React.ReactNode;
}

const TicketDetailsPage: React.FC = () => {
  const { navigateTo, navigationData, user } = useNavigation();
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState<any>(null);
  const [collapsibleSections, setCollapsibleSections] = useState<CollapsibleSection[]>([]);

  // Load ticket details on component mount
  useEffect(() => {
    loadTicketDetails();
  }, [navigationData]);

  // Update collapsible sections when ticket details change
  useEffect(() => {
    if (ticketDetails) {
      updateCollapsibleSections();
    }
  }, [ticketDetails]);

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') return '';
    try {
      // Handle various date formats
      let date: Date;

      // If it's already in DD/MM/YYYY format, return as is
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return dateString;
      }

      // Try parsing as ISO date string
      date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Try parsing as other formats
        const parts = dateString.split(/[-/ :]/);
        if (parts.length >= 3) {
          // Try YYYY-MM-DD or DD-MM-YYYY
          if (parts[0].length === 4) {
            date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
          } else {
            date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }

        // If still invalid, return original string
        if (isNaN(date.getTime())) {
          return dateString;
        }
      }

      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.warn('Error formatting date:', dateString, error);
      return dateString;
    }
  };

  // Helper function to format time
  const formatTime = (dateString: string): string => {
    if (!dateString || dateString === 'null' || dateString === 'undefined') return '';
    try {
      // Handle various time formats
      let date: Date;

      // If it's already in HH:MM AM/PM format, return as is
      if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(dateString)) {
        return dateString;
      }

      // Try parsing as ISO date string
      date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Try parsing as other formats
        const parts = dateString.split(/[-/ :]/);
        if (parts.length >= 3) {
          // Try YYYY-MM-DD HH:MM:SS format
          if (parts[0].length === 4) {
            date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}T${parts[3] || '00'}:${parts[4] || '00'}:${parts[5] || '00'}`);
          }
        }

        // If still invalid, return original string
        if (isNaN(date.getTime())) {
          return dateString;
        }
      }

      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    } catch (error) {
      console.warn('Error formatting time:', dateString, error);
      return dateString;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    if (!status) return '#F44336';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('closed') || statusLower.includes('completed')) return '#4CAF50';
    if (statusLower.includes('progress') || statusLower.includes('in-progress') || statusLower.includes('in_progress')) return '#FF9800';
    if (statusLower.includes('assigned') || statusLower.includes('open')) return '#2196F3';
    if (statusLower.includes('pending')) return '#9E9E9E';
    return '#F44336';
  };

  const loadTicketDetails = async () => {
    try {
      setIsLoading(true);

      // Get complaint ID or ticket number from navigation data
      const complaintId = navigationData?.id || navigationData?.ticketNumber || navigationData?.ticketId;

      // If we already have complete data from navigation, use it
      if (navigationData && (navigationData.id || navigationData.ticketId || navigationData.ticketNumber)) {
        // Map navigation data to TicketDetails interface
        const navData = navigationData;

        // Log navigation data for debugging
        console.log('Using navigation data for ticket details:', navData);
        console.log('Available fields in navigation data:', Object.keys(navData || {}));

        // Map navigation data to TicketDetails interface with better field extraction
        const ticketDetails: TicketDetails = {
          id: navData.id?.toString() ||
            navData.complaint_id?.toString() ||
            navData.ticket_id?.toString() ||
            navData.ticketId?.toString() ||
            navData.ticketNumber?.toString() ||
            navData.ticket_number?.toString() ||
            complaintId ||
            'N/A',
          ticketId: navData.ticketNumber?.toString() ||
            navData.ticketId?.toString() ||
            navData.ticket_id?.toString() ||
            navData.ticket_number?.toString() ||
            navData.id?.toString() ||
            complaintId ||
            'N/A',
          ticketNumber: navData.ticketNumber?.toString() ||
            navData.ticketId?.toString() ||
            navData.ticket_id?.toString() ||
            navData.ticket_number?.toString() ||
            navData.id?.toString() ||
            complaintId ||
            'N/A',
          siteId: navData.siteId?.toString() ||
            navData.site_id?.toString() ||
            navData.lift_id?.toString() ||
            navData.liftId?.toString() ||
            navData.project_id?.toString() ||
            '',
          siteName: navData.siteName ||
            navData.site_name ||
            navData.projectName ||
            navData.project_name ||
            navData.liftName ||
            navData.lift_name ||
            navData.project ||
            'Site information not available',
          address: navData.address ||
            navData.site_address ||
            navData.project_address ||
            navData.siteAddress ||
            navData.projectAddress ||
            navData.location ||
            'Address not specified',
          assignAt: formatTime(navData.assignAt ||
            navData.assignedTime ||
            navData.assigned_at ||
            navData.assign_date ||
            navData.assigned_date ||
            navData.assignedAt ||
            ''),
          assignDate: formatDate(navData.assignDate ||
            navData.assignedDate ||
            navData.assign_date ||
            navData.assigned_date ||
            navData.createdDate ||
            navData.created_date ||
            navData.createdAt ||
            navData.created_at ||
            ''),
          assignTo: navData.assignTo ||
            navData.assignedTo ||
            navData.assigned_to ||
            navData.assigned_technician ||
            navData.technician_name ||
            navData.technician ||
            navData.assigned_user ||
            navData.assignee ||
            'Not assigned',
          attendAt: formatTime(navData.attendAt ||
            navData.attendedAt ||
            navData.attend_at ||
            navData.attended_at ||
            navData.attendedTime ||
            ''),
          attendBy: navData.attendBy ||
            navData.attendedBy ||
            navData.attended_by ||
            navData.technician_name ||
            navData.technician ||
            navData.attended_user ||
            'Not attended',
          duration: navData.duration ||
            navData.time_taken ||
            navData.timeTaken ||
            navData.timeRequired ||
            navData.time_required ||
            'N/A',
          status: navData.status ||
            navData.complaint_status ||
            navData.ticket_status ||
            'Open',
          statusColor: getStatusColor(navData.status ||
            navData.complaint_status ||
            navData.ticket_status ||
            'Open'),
          // Additional fields
          subject: navData.subject ||
            navData.complaint_type ||
            navData.issue_type ||
            navData.type ||
            navData.title ||
            navData.description?.substring(0, 50) ||
            navData.problem?.substring(0, 50) ||
            'Subject not specified',
          type: navData.type ||
            navData.complaint_category ||
            navData.category ||
            navData.complaint_type ||
            navData.issue_type ||
            navData.complaintType ||
            'Break Down Calls',
          contactPersonName: navData.contactPersonName ||
            navData.contact_person_name ||
            navData.contactName ||
            navData.contact_name ||
            navData.customerName ||
            navData.customer_name ||
            navData.name ||
            navData.fullName ||
            navData.full_name ||
            'Not specified',
          contactPersonMobile: navData.contactPersonMobile ||
            navData.contact_person_mobile ||
            navData.contactMobile ||
            navData.contact_mobile ||
            navData.customerMobile ||
            navData.customer_mobile ||
            navData.mobile ||
            navData.phone ||
            navData.phoneNumber ||
            'Not specified',
          description: navData.description ||
            navData.problem_description ||
            navData.issue_description ||
            navData.complaint_details ||
            navData.problem ||
            navData.details ||
            navData.issue ||
            'No description available',
          priority: navData.priority ||
            navData.severity ||
            navData.urgency ||
            navData.level ||
            'Medium',
          solutionProvided: navData.solutionProvided ||
            navData.solution_provided ||
            navData.solution ||
            navData.resolution ||
            navData.resolved_solution ||
            navData.fix ||
            'Not provided',
          technicianRemark: navData.technicianRemark ||
            navData.technician_remark ||
            navData.remarks ||
            navData.comment ||
            navData.notes ||
            navData.feedback ||
            'No remarks',
          technicianSignature: navData.technicianSignature ||
            navData.technician_signature ||
            navData.signature ||
            navData.tech_signature ||
            navData.technician_sign ||
            '[Signature]',
          customerSignature: navData.customerSignature ||
            navData.customer_signature ||
            navData.cust_signature ||
            navData.customer_sign ||
            '[Signature]',
          signatureHolderName: navData.signatureHolderName ||
            navData.signature_holder_name ||
            navData.signed_by_name ||
            navData.signatory_name ||
            navData.signatureName ||
            'Not specified',
          signatureHolderDesignation: navData.signatureHolderDesignation ||
            navData.signature_holder_designation ||
            navData.signed_by_designation ||
            navData.signatory_designation ||
            navData.signatureDesignation ||
            'Not specified',
          closedBy: navData.closedBy ||
            navData.closed_by ||
            navData.closed_user ||
            navData.closedByUser ||
            'Not closed',
          closeMode: navData.closeMode ||
            navData.close_mode ||
            navData.closure_mode ||
            navData.mode_of_closure ||
            'Not specified',
          projectName: navData.projectName ||
            navData.project_name ||
            navData.siteName ||
            navData.site_name ||
            navData.liftName ||
            navData.lift_name ||
            navData.project ||
            'Project not specified',
          amcRef: navData.amcRef ||
            navData.amc_ref ||
            navData.amc_reference ||
            navData.amcReference ||
            navData.amcId ||
            'AMC not linked',
          amcType: navData.amcType ||
            navData.amc_type ||
            navData.amcCategory ||
            navData.amc_category ||
            'Not specified',
          amcStatus: navData.amcStatus ||
            navData.amc_status ||
            navData.amcState ||
            navData.amc_state ||
            'Not specified',
          amcExpiryDate: formatDate(navData.amcExpiryDate ||
            navData.amc_expiry_date ||
            navData.expiry_date ||
            navData.amcExpiry ||
            navData.amc_expiry ||
            ''),
        };

        console.log('Mapped ticket details from navigation data:', ticketDetails);
        setTicketDetails(ticketDetails);
        setIsLoading(false);
        return;
      }

      if (!complaintId) {
        Alert.alert('Error', 'Ticket ID not found.');
        setIsLoading(false);
        return;
      }

      const userEmail = user?.email;
      if (!userEmail) {
        Alert.alert('Error', 'User email not found. Please login again.');
        setIsLoading(false);
        return;
      }

      // Try multiple endpoint formats
      // First try: Get all complaints and find the matching one
      const url = `${API_ENDPOINTS.CUSTOMER_COMPLAINTS}?email=${encodeURIComponent(userEmail)}`;
      console.log('Fetching ticket details from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let data;
      try {
        const text = await response.text();
        console.log('Response text:', text.substring(0, 200));

        if (!text || text.trim().startsWith('<!DOCTYPE')) {
          throw new Error('Received HTML instead of JSON (likely 404 page)');
        }

        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        // Try alternative endpoint format
        const altUrl = `${API_ENDPOINTS.CUSTOMER_COMPLAINTS}${complaintId}/?email=${encodeURIComponent(userEmail)}`;
        console.log('Trying alternative URL:', altUrl);

        try {
          const altResponse = await fetch(altUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const altText = await altResponse.text();
          if (altText && !altText.trim().startsWith('<!DOCTYPE')) {
            data = altText ? JSON.parse(altText) : {};
          } else {
            throw new Error('Alternative endpoint also failed');
          }
        } catch (altError) {
          console.error('Alternative endpoint also failed:', altError);
          Alert.alert('Error', 'Failed to load ticket details. The ticket may not exist or the API endpoint is incorrect.');
          setTicketDetails(null);
          setIsLoading(false);
          return;
        }
      }

      console.log('Ticket details API Response:', JSON.stringify(data, null, 2));

      if (response.ok || data) {
        // Handle different response formats
        let ticketData = data;

        // If response is an array, find the matching complaint
        if (Array.isArray(data)) {
          ticketData = data.find((item: any) => {
            const itemId = item.id?.toString() ||
              item.complaint_id?.toString() ||
              item.ticket_id?.toString() ||
              item.ticket_number?.toString() ||
              '';
            const itemTicketNumber = item.ticket_number?.toString() ||
              item.ticketNumber?.toString() ||
              item.ticket_id?.toString() ||
              '';
            return itemId === complaintId.toString() ||
              itemTicketNumber === complaintId.toString() ||
              item.id?.toString() === complaintId.toString();
          });

          if (!ticketData) {
            Alert.alert('Error', 'Ticket not found in the list.');
            setTicketDetails(null);
            setIsLoading(false);
            return;
          }
        }

        setTicketData(ticketData);

        // Log ticketData to help debug field names
        console.log('Ticket Data from API:', JSON.stringify(ticketData, null, 2));
        console.log('Available fields in ticketData:', Object.keys(ticketData || {}));

        // Use navigationData as fallback for missing fields
        const navData = navigationData || {};

        // Map API response to TicketDetails interface with better field extraction
        // Log all available fields for debugging
        console.log('Mapping ticket data. Available fields:', Object.keys(ticketData || {}));

        const ticketDetails: TicketDetails = {
          id: ticketData.id?.toString() ||
            ticketData.complaint_id?.toString() ||
            ticketData.ticket_id?.toString() ||
            ticketData.ticketId?.toString() ||
            ticketData.ticket_number?.toString() ||
            navData.id?.toString() ||
            complaintId ||
            'N/A',
          ticketId: ticketData.ticket_number?.toString() ||
            ticketData.ticketNumber?.toString() ||
            ticketData.ticket_id?.toString() ||
            ticketData.ticketId?.toString() ||
            ticketData.id?.toString() ||
            navData.ticketNumber?.toString() ||
            navData.ticketId?.toString() ||
            complaintId ||
            'N/A',
          ticketNumber: ticketData.ticket_number?.toString() ||
            ticketData.ticketNumber?.toString() ||
            ticketData.ticket_id?.toString() ||
            ticketData.ticketId?.toString() ||
            ticketData.id?.toString() ||
            navData.ticketNumber?.toString() ||
            'N/A',
          siteId: ticketData.site_id?.toString() ||
            ticketData.siteId?.toString() ||
            ticketData.site?.id?.toString() ||
            ticketData.lift?.site_id?.toString() ||
            ticketData.lift?.siteId?.toString() ||
            ticketData.lift_id?.toString() ||
            ticketData.liftId?.toString() ||
            ticketData.project_id?.toString() ||
            '',
          siteName: ticketData.site_name ||
            ticketData.siteName ||
            ticketData.site?.name ||
            ticketData.lift?.site_name ||
            ticketData.lift?.siteName ||
            ticketData.project_name ||
            ticketData.projectName ||
            ticketData.lift_name ||
            ticketData.liftName ||
            ticketData.lift?.name ||
            ticketData.project ||
            navData.siteName ||
            'Site information not available',
          address: ticketData.address ||
            ticketData.site?.address ||
            ticketData.lift?.address ||
            ticketData.project_address ||
            ticketData.projectAddress ||
            ticketData.location ||
            navData.address ||
            'Address not specified',
          assignAt: formatTime(ticketData.assigned_date ||
            ticketData.assigned_at ||
            ticketData.assign_date ||
            ticketData.assigned_time ||
            ticketData.assignedAt ||
            navData.assignedTime ||
            navData.assignAt ||
            ''),
          assignDate: formatDate(ticketData.assigned_date ||
            ticketData.assigned_at ||
            ticketData.assign_date ||
            ticketData.created_date ||
            ticketData.created_at ||
            ticketData.createdAt ||
            ticketData.created_at ||
            navData.assignedDate ||
            navData.assignDate ||
            navData.createdDate ||
            ''),
          assignTo: ticketData.assigned_to ||
            ticketData.assignTo ||
            ticketData.assigned_technician ||
            ticketData.assignedTechnician ||
            ticketData.technician_name ||
            ticketData.technicianName ||
            ticketData.assigned_user ||
            ticketData.assignedUser ||
            ticketData.assigned_user_name ||
            ticketData.assignedUserName ||
            ticketData.technician ||
            ticketData.assignee ||
            ticketData.assigned_person ||
            ticketData.assignedPerson ||
            ticketData.technician?.name ||
            ticketData.technician?.full_name ||
            ticketData.assigned_to_user?.name ||
            ticketData.assigned_to_user?.full_name ||
            ticketData.user?.name ||
            ticketData.user?.full_name ||
            navData.assignTo ||
            'Not assigned',
          attendAt: formatTime(ticketData.attend_at ||
            ticketData.attended_at ||
            ticketData.attended_date ||
            ticketData.attend_time ||
            ticketData.attendedTime ||
            ''),
          attendBy: ticketData.attend_by ||
            ticketData.attendBy ||
            ticketData.attended_by ||
            ticketData.attendedBy ||
            ticketData.technician_name ||
            ticketData.technician ||
            ticketData.attended_user ||
            navData.attendBy ||
            'Not attended',
          duration: ticketData.duration ||
            ticketData.time_taken ||
            ticketData.timeTaken ||
            ticketData.time_required ||
            ticketData.timeRequired ||
            'N/A',
          status: ticketData.status ||
            ticketData.complaint_status ||
            ticketData.ticket_status ||
            navData.status ||
            'Open',
          statusColor: getStatusColor(ticketData.status ||
            ticketData.complaint_status ||
            ticketData.ticket_status ||
            navData.status ||
            'Open'),
          // Additional fields
          subject: ticketData.subject ||
            ticketData.complaint_type ||
            ticketData.complaintType ||
            ticketData.issue_type ||
            ticketData.title ||
            ticketData.description?.substring(0, 50) ||
            navData.description?.substring(0, 50) ||
            ticketData.problem_description?.substring(0, 50) ||
            ticketData.problem?.substring(0, 50) ||
            'Subject not specified',
          type: ticketData.type ||
            ticketData.complaint_category ||
            ticketData.complaintCategory ||
            ticketData.category ||
            ticketData.complaint_type ||
            ticketData.issue_type ||
            ticketData.complaintType ||
            navData.type ||
            'Break Down Calls',
          contactPersonName: ticketData.contact_person_name ||
            ticketData.contactPersonName ||
            ticketData.contact_name ||
            ticketData.contactName ||
            ticketData.customer_name ||
            ticketData.customerName ||
            ticketData.name ||
            ticketData.full_name ||
            ticketData.fullName ||
            navData.contactPersonName ||
            'Not specified',
          contactPersonMobile: ticketData.contact_person_mobile ||
            ticketData.contactPersonMobile ||
            ticketData.contact_mobile ||
            ticketData.contactMobile ||
            ticketData.customer_mobile ||
            ticketData.customerMobile ||
            ticketData.mobile ||
            ticketData.phone ||
            ticketData.phoneNumber ||
            navData.contactPersonMobile ||
            'Not specified',
          description: ticketData.description ||
            ticketData.problem_description ||
            ticketData.problemDescription ||
            ticketData.issue_description ||
            ticketData.issueDescription ||
            ticketData.complaint_details ||
            ticketData.complaintDetails ||
            ticketData.problem ||
            ticketData.details ||
            ticketData.issue ||
            (Array.isArray(ticketData.complaint_templates) ? ticketData.complaint_templates.join(', ') :
              typeof ticketData.complaint_templates === 'string' ? ticketData.complaint_templates :
                ticketData.complaint_templates ? String(ticketData.complaint_templates) : '') ||
            navData.description ||
            'No description available',
          priority: ticketData.priority ||
            ticketData.severity ||
            ticketData.urgency ||
            ticketData.level ||
            navData.priority ||
            'Medium',
          solutionProvided: ticketData.solution_provided ||
            ticketData.solutionProvided ||
            ticketData.solution ||
            ticketData.resolution ||
            ticketData.resolved_solution ||
            ticketData.resolution_details ||
            ticketData.fix ||
            navData.solutionProvided ||
            'Not provided',
          technicianRemark: ticketData.technician_remark ||
            ticketData.technicianRemark ||
            ticketData.remark ||
            ticketData.remarks ||
            ticketData.comment ||
            ticketData.comments ||
            ticketData.technician_comment ||
            ticketData.technician_comments ||
            ticketData.notes ||
            ticketData.feedback ||
            navData.technicianRemark ||
            'No remarks',
          technicianSignature: ticketData.technician_signature ||
            ticketData.technicianSignature ||
            ticketData.signature ||
            ticketData.tech_signature ||
            ticketData.technician_sign ||
            navData.technicianSignature ||
            '[Signature]',
          customerSignature: ticketData.customer_signature ||
            ticketData.customerSignature ||
            ticketData.cust_signature ||
            ticketData.customer_sign ||
            navData.customerSignature ||
            '[Signature]',
          signatureHolderName: ticketData.signature_holder_name ||
            ticketData.signatureHolderName ||
            ticketData.signed_by_name ||
            ticketData.signedByName ||
            ticketData.signatory_name ||
            ticketData.signatureName ||
            navData.signatureHolderName ||
            'Not specified',
          signatureHolderDesignation: ticketData.signature_holder_designation ||
            ticketData.signatureHolderDesignation ||
            ticketData.signed_by_designation ||
            ticketData.signedByDesignation ||
            ticketData.signatory_designation ||
            ticketData.signatureDesignation ||
            navData.signatureHolderDesignation ||
            'Not specified',
          closedBy: ticketData.closed_by ||
            ticketData.closedBy ||
            ticketData.closed_user ||
            ticketData.closedUser ||
            ticketData.closed_person ||
            ticketData.closedByUser ||
            navData.closedBy ||
            'Not closed',
          closeMode: ticketData.close_mode ||
            ticketData.closeMode ||
            ticketData.closure_mode ||
            ticketData.closureMode ||
            ticketData.mode_of_closure ||
            ticketData.closureMode ||
            navData.closeMode ||
            'Not specified',
          projectName: ticketData.project_name ||
            ticketData.projectName ||
            ticketData.site_name ||
            ticketData.siteName ||
            ticketData.lift_name ||
            ticketData.liftName ||
            ticketData.site?.name ||
            ticketData.project ||
            navData.projectName ||
            'Project not specified',
          amcRef: ticketData.amc_ref ||
            ticketData.amcRef ||
            ticketData.amc_reference ||
            ticketData.amcReference ||
            ticketData.amc_id ||
            ticketData.amcId ||
            navData.amcRef ||
            'AMC not linked',
          amcType: ticketData.amc_type ||
            ticketData.amcType ||
            ticketData.amctype ||
            ticketData.amcCategory ||
            ticketData.amc_category ||
            navData.amcType ||
            'Not specified',
          amcStatus: ticketData.amc_status ||
            ticketData.amcStatus ||
            ticketData.amcstatus ||
            ticketData.amcState ||
            ticketData.amc_state ||
            navData.amcStatus ||
            'Not specified',
          amcExpiryDate: formatDate(ticketData.amc_expiry_date ||
            ticketData.amcExpiryDate ||
            ticketData.expiry_date ||
            ticketData.amc_expiry ||
            ticketData.amcExpiry ||
            ticketData.amcexpirydate ||
            ''),
        };

        console.log('Mapped ticket details:', ticketDetails);

        setTicketDetails(ticketDetails);
      } else {
        console.error('Error loading ticket details:', data.error || data.message);
        Alert.alert('Error', data.error || data.message || 'Failed to load ticket details. Please try again.');
        setTicketDetails(null);
      }
    } catch (error) {
      console.error('Error loading ticket details:', error);
      Alert.alert('Error', 'Network error. Please check your connection and try again.');
      setTicketDetails(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCollapsibleSections = () => {
    if (!ticketDetails) return;

    const sections: CollapsibleSection[] = [
      {
        id: 'ticket-info',
        title: 'Ticket Info',
        icon: 'ⓘ',
        iconColor: '#2196F3',
        isExpanded: false,
        content: (
          <View style={styles.ticketInfoContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Subject:</Text>
              <Text style={styles.infoValue}>{ticketDetails.subject || 'Not specified'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{ticketDetails.type || 'Break Down Calls'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Person Name:</Text>
              <Text style={styles.infoValue}>{ticketDetails.contactPersonName || 'Not specified'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Contact Person Mobile No:</Text>
              <Text style={styles.infoValue}>{ticketDetails.contactPersonMobile || 'Not specified'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Description:</Text>
              <Text style={styles.infoValue}>{ticketDetails.description || 'No description available'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Priority:</Text>
              <Text style={[styles.infoValue, { color: '#F44336', fontWeight: 'bold' }]}>
                {ticketDetails.priority ? ticketDetails.priority.charAt(0).toUpperCase() + ticketDetails.priority.slice(1) : 'Not specified'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Solution Provided:</Text>
              <Text style={styles.infoValue}>{ticketDetails.solutionProvided || 'Not provided'}</Text>
            </View>

            {ticketDetails.technicianRemark && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Technician Remark:</Text>
                <Text style={styles.infoValue}>{ticketDetails.technicianRemark}</Text>
              </View>
            )}

            {ticketDetails.technicianSignature && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Technician Signature:</Text>
                <Text style={[styles.infoValue, styles.signatureText]}>
                  {ticketDetails.technicianSignature || '[Signature]'}
                </Text>
              </View>
            )}

            {ticketDetails.customerSignature && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Customer Signature:</Text>
                <Text style={[styles.infoValue, styles.signatureText]}>
                  {ticketDetails.customerSignature || '[Signature]'}
                </Text>
              </View>
            )}

            {ticketDetails.signatureHolderName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Signature Holder Name:</Text>
                <Text style={styles.infoValue}>{ticketDetails.signatureHolderName}</Text>
              </View>
            )}

            {ticketDetails.signatureHolderDesignation && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Signature Holder Designation:</Text>
                <Text style={styles.infoValue}>{ticketDetails.signatureHolderDesignation}</Text>
              </View>
            )}
          </View>
        ),
      },
      {
        id: 'ticket-closing-info',
        title: 'Ticket Closing Info',
        icon: '⚙',
        iconColor: '#9C27B0',
        isExpanded: false,
        content: (
          <View style={styles.ticketInfoContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Technician Remark:</Text>
              <Text style={styles.infoValue}>{ticketDetails.technicianRemark || 'No remarks'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Closed By:</Text>
              <Text style={styles.infoValue}>{ticketDetails.closedBy || 'Not closed'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Close Mode:</Text>
              <Text style={styles.infoValue}>{ticketDetails.closeMode || 'Not specified'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Technician Signature:</Text>
              <Text style={[styles.infoValue, styles.signatureText]}>
                {ticketDetails.technicianSignature || '[Signature]'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Customer Signature:</Text>
              <Text style={[styles.infoValue, styles.signatureText]}>
                {ticketDetails.customerSignature || '[Signature]'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Signature Holder Name:</Text>
              <Text style={styles.infoValue}>{ticketDetails.signatureHolderName || 'Not specified'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Signature Holder Designation:</Text>
              <Text style={styles.infoValue}>{ticketDetails.signatureHolderDesignation || 'Not specified'}</Text>
            </View>
          </View>
        ),
      },
      {
        id: 'material',
        title: 'Material',
        icon: '🛒',
        iconColor: '#9C27B0',
        isExpanded: false,
        content: (
          <View style={styles.ticketInfoContent}>
            <Text style={styles.infoValue}>No material information available.</Text>
          </View>
        ),
      },
      {
        id: 'project-details',
        title: 'Project Details',
        icon: '📋',
        iconColor: '#2196F3',
        isExpanded: false,
        content: (
          <View style={styles.ticketInfoContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>PROJECT NAME:</Text>
              <Text style={styles.infoValue}>{ticketDetails.projectName || 'Project not specified'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AMC REF.:</Text>
              <Text style={styles.infoValue}>{ticketDetails.amcRef || 'AMC not linked'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AMC TYPE:</Text>
              <Text style={styles.infoValue}>{ticketDetails.amcType || 'Not specified'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AMC STATUS:</Text>
              <Text style={styles.infoValue}>{ticketDetails.amcStatus || 'Not specified'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>AMC EXPIRY DATE:</Text>
              <Text style={[styles.infoValue, { color: '#FF6B6B', fontWeight: 'bold' }]}>
                {(ticketDetails.amcExpiryDate || 'Not specified')}{ticketDetails.amcStatus === 'Active' ? ' (Active)' : ''}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <View style={styles.addressRow}>
                <Text style={[styles.infoValue, { color: '#2196F3' }]}>{ticketDetails.address || 'Address not specified'}</Text>
                <TouchableOpacity style={styles.mapButton} onPress={handleViewMap}>
                  <Text style={styles.mapIcon}>🔲</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ),
      },
    ];

    setCollapsibleSections(sections);
  };

  const handleBack = () => {
    navigateTo('/complaints');
  };

  const handleExportPDF = async () => {
    if (!ticketDetails) {
      Alert.alert('Error', 'No ticket details available.');
      return;
    }

    try {
      // Get the ticket reference/id
      const reference = ticketDetails.ticketId || ticketDetails.id;
      if (!reference) {
        Alert.alert('Error', 'Unable to identify ticket reference.');
        return;
      }

      // Construct the PDF download URL
      const pdfUrl = API_ENDPOINTS.CUSTOMER_COMPLAINT_PDF.replace('{reference}', reference);

      console.log('Attempting to download PDF from:', pdfUrl);

      // Fetch the PDF content and create a proper download
      try {
        const response = await fetch(pdfUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();

        // For web platforms, create a proper download
        if (isWeb) {
          try {
            // Create a temporary link element for PDF download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `ticket-${reference}-${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            Alert.alert(
              'Download Complete',
              'Your ticket PDF has been downloaded successfully.',
              [{ text: 'OK' }]
            );
          } catch (error) {
            console.error('Error initiating download:', error);
            // Fallback: open in new tab
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            Alert.alert(
              'Download Initiated',
              'Ticket PDF is being prepared. Check your browser downloads.',
              [{ text: 'OK' }]
            );
          }
        } else {
          // For mobile platforms, create a Blob URL and open it
          try {
            const fileReader = new FileReader();
            fileReader.onload = function () {
              const base64data = fileReader.result as string;
              // Create a data URI for the PDF
              const dataUri = `data:application/pdf;base64,${base64data.split(',')[1]}`;
              Linking.openURL(dataUri).catch(err => {
                console.error('Error opening PDF:', err);
                Alert.alert(
                  'Download Ready',
                  'Your ticket PDF is ready. Please check your device downloads or use a PDF viewer app.',
                  [{ text: 'OK' }]
                );
              });
            };
            fileReader.readAsDataURL(blob);
          } catch (mobileError) {
            console.error('Error handling mobile download:', mobileError);
            // Fallback: open the direct URL
            Linking.openURL(pdfUrl).catch(err => {
              console.error('Error opening URL:', err);
              Alert.alert(
                'Download',
                'Opening browser to download your ticket PDF.',
                [{ text: 'OK' }]
              );
            });
          }
        }
      } catch (fetchError) {
        console.error('Error fetching PDF:', fetchError);
        Alert.alert(
          'Download Failed',
          'Failed to download the PDF. Please try again later.',
          [{ text: 'OK' }]
        );
        return;
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      Alert.alert('Error', 'Failed to export PDF. Please try again.');
    }
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality will be implemented.');
  };

  const handleViewMap = () => {
    Alert.alert('View Map', 'Map view functionality will be implemented.');
  };

  const toggleSection = (sectionId: string) => {
    setCollapsibleSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      )
    );
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

          <Text style={styles.headerTitle}>Ticket</Text>
        </View>

        {/* Loading State */}
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading ticket details...</Text>
        </View>
      </View>
    );
  }

  if (!ticketDetails) {
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

          <Text style={styles.headerTitle}>Ticket</Text>
        </View>

        {/* Empty State */}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No ticket details available.</Text>
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

        <Text style={styles.headerTitle}>Ticket</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ticket ID Card */}
        <View style={styles.card}>
          <View style={styles.ticketIdContainer}>
            <Text style={styles.ticketIdLabel}>Ticket id: </Text>
            <Text style={styles.ticketIdValue}>{ticketDetails.ticketId}</Text>

            <View style={styles.ticketActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleExportPDF}>
                <Text style={styles.pdfIcon}>📄</Text>
                <Text style={styles.pdfText}>PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Text style={styles.shareIcon}>🔗</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Site Information Card */}
        <View style={styles.card}>
          <View style={styles.siteInfo}>
            <View style={styles.siteIconContainer}>
              <Text style={styles.siteIcon}>🏢</Text>
            </View>

            <View style={styles.siteDetails}>
              <Text style={styles.siteId}>{ticketDetails.siteId}</Text>
              <Text style={styles.siteName}>{ticketDetails.siteName}</Text>
              <View style={styles.addressContainer}>
                <Text style={styles.address}>{ticketDetails.address}</Text>
                <TouchableOpacity style={styles.mapButton} onPress={handleViewMap}>
                  <Text style={styles.mapIcon}>🔲</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline and Status Card */}
        <View style={styles.card}>
          {/* Timeline Section */}
          <View style={styles.timelineContainer}>
            {/* Assign At */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>
                    Assign At: {ticketDetails.assignAt}
                  </Text>
                  {ticketDetails.assignDate && (
                    <Text style={styles.timelineDate}>{ticketDetails.assignDate}</Text>
                  )}
                </View>
              </View>

              <View style={styles.timelineRight}>
                <Text style={styles.timelineLabel}>Assign To:</Text>
                <Text style={styles.timelineValue}>{ticketDetails.assignTo}</Text>
              </View>
            </View>

            {/* Timeline Line */}
            <View style={styles.timelineLine} />

            {/* Attend At */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>
                    Attend At: {ticketDetails.attendAt}
                  </Text>
                </View>
              </View>

              <View style={styles.timelineRight}>
                <Text style={styles.timelineLabel}>Attend By:</Text>
                <Text style={styles.timelineValue}>{ticketDetails.attendBy}</Text>
              </View>
            </View>
          </View>

          {/* Duration and Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.duration}>
              Duration: {ticketDetails.duration}
            </Text>
            <Text style={[styles.status, { color: ticketDetails.statusColor }]}>
              ({ticketDetails.status})
            </Text>
          </View>
        </View>

        {/* Collapsible Sections */}
        {collapsibleSections.map((section) => (
          <View key={section.id} style={styles.card}>
            <TouchableOpacity
              style={styles.collapsibleHeader}
              onPress={() => toggleSection(section.id)}
            >
              <View style={styles.sectionHeaderLeft}>
                <Text style={[styles.sectionIcon, { color: section.iconColor }]}>
                  {section.icon}
                </Text>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>

              <Text style={styles.expandIcon}>
                {section.isExpanded ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {section.isExpanded && section.content && (
              <View style={styles.collapsibleContent}>
                {section.content}
              </View>
            )}
          </View>
        ))}
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
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticketIdLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  ticketIdValue: {
    fontSize: 18,
    color: '#F44336',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  ticketActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    padding: 5,
  },
  pdfIcon: {
    fontSize: 16,
    color: '#F44336',
    marginRight: 4,
  },
  pdfText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: 'bold',
  },
  shareIcon: {
    fontSize: 16,
    color: '#F44336',
  },
  siteInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  siteIconContainer: {
    marginRight: 15,
    marginTop: 5,
  },
  siteIcon: {
    fontSize: 24,
    color: '#2196F3',
  },
  siteDetails: {
    flex: 1,
  },
  siteId: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    marginBottom: 4,
  },
  siteName: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  address: {
    fontSize: 14,
    color: '#2196F3',
    flex: 1,
  },
  mapButton: {
    padding: 5,
  },
  mapIcon: {
    fontSize: 16,
    color: '#2196F3',
  },
  timelineContainer: {
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  timelineLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E91E63',
    marginRight: 10,
    marginTop: 6,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 14,
    color: '#333333',
  },
  timelineRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  timelineValue: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'right',
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E91E63',
    marginLeft: 3,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  duration: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  expandIcon: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 16,
    fontWeight: 'normal',
  },
  collapsibleContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  ticketInfoContent: {
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    width: 160,
    marginRight: 10,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  signatureText: {
    fontStyle: 'italic',
    color: '#666666',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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

export default TicketDetailsPage;
