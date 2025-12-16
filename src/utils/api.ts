// API Configuration

const API_BASE_URL = 'https://atomlift.technuob.com'; // Update this with your backend URL

export const API_ENDPOINTS = {
  // Customer authentication
  CUSTOMER_GENERATE_OTP: `${API_BASE_URL}/customer/api/customer/generate-otp/`,
  CUSTOMER_VERIFY_OTP: `${API_BASE_URL}/customer/api/customer/verify-otp/`,
  CUSTOMER_RESEND_OTP: `${API_BASE_URL}/customer/api/customer/resend-otp/`,
  // Customer invoices
  CUSTOMER_INVOICES: `${API_BASE_URL}/invoice/api/customer/invoices/`,
  // Customer quotations
  CUSTOMER_QUOTATIONS: `${API_BASE_URL}/quotation/api/customer/quotations/`,
  // Customer AMCs
  CUSTOMER_AMCS: `${API_BASE_URL}/amc/api/customer/amcs/`,
  // Customer complaints
  CUSTOMER_LIFTS: `${API_BASE_URL}/complaints/api/customer/lifts/`,
  CUSTOMER_COMPLAINTS: `${API_BASE_URL}/complaints/api/customer/complaints/`,
};

export default API_BASE_URL;

