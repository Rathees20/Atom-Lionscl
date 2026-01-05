// API Configuration

const API_BASE_URL = 'https://admin.careelevators.in'; // Update this with your backend URL

export const API_ENDPOINTS = {
  // Customer authentication
  CUSTOMER_GENERATE_OTP: `${API_BASE_URL}/customer/api/customer/generate-otp/`,
  CUSTOMER_VERIFY_OTP: `${API_BASE_URL}/customer/api/customer/verify-otp/`,
  CUSTOMER_RESEND_OTP: `${API_BASE_URL}/customer/api/customer/resend-otp/`,
  CUSTOMER_LOGOUT: `${API_BASE_URL}/customer/api/customer/logout/`,
  // Customer invoices
  CUSTOMER_INVOICES: `${API_BASE_URL}/invoice/api/customer/invoices/`,
  // Customer quotations
  CUSTOMER_QUOTATIONS: `${API_BASE_URL}/quotation/api/customer/quotations/`,
  // Customer AMCs
  CUSTOMER_AMCS: `${API_BASE_URL}/amc/api/customer/amcs/`,
  CUSTOMER_AMC_DOWNLOAD_AGREEMENT: `${API_BASE_URL}/amc/api/customer/amcs/{amc_id}/download-agreement/`,
  // Customer complaints
  CUSTOMER_LIFTS: `${API_BASE_URL}/complaints/api/customer/lifts/`,
  CUSTOMER_COMPLAINTS: `${API_BASE_URL}/complaints/api/customer/complaints/`,
  CUSTOMER_CREATE_COMPLAINT: `${API_BASE_URL}/complaints/api/customer/complaints/create/`,
  CUSTOMER_COMPLAINT_PDF: `${API_BASE_URL}/complaints/api/customer/complaints/{reference}/pdf/`,
  // Routine services
  ROUTINE_SERVICES: `${API_BASE_URL}/routine-services/api/mobile/routine-services/`,
  ROUTINE_SERVICES_ALL: `${API_BASE_URL}/routine-services/api/mobile/routine-services/all/`,
  ROUTINE_SERVICES_DOWNLOAD_SLIP: `${API_BASE_URL}/routine-services/api/mobile/download-service-slip`,
  // Customer sub-customers
  CREATE_SUB_CUSTOMER: `${API_BASE_URL}/subcustomer/api/create/`,
  LIST_SUB_CUSTOMERS: `${API_BASE_URL}/subcustomer/api/list/`,
  SUB_CUSTOMER_DETAIL: (subCustomerId: string | number) => `${API_BASE_URL}/subcustomer/api/${subCustomerId}/`,
  UPDATE_SUB_CUSTOMER: (subCustomerId: string | number) => `${API_BASE_URL}/subcustomer/api/${subCustomerId}/update/`,
  DELETE_SUB_CUSTOMER: (subCustomerId: string | number) => `${API_BASE_URL}/subcustomer/api/${subCustomerId}/delete/`,
};

export default API_BASE_URL;

