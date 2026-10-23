

// Reads from .env (VITE_API_URL) with fallback to local backend
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const ADMIN_API_ENDPOINTS = {
  login: `${API_URL}/admin/login`,
  fetchDonations: `${API_URL}/admin/stripe/payers`,
  fetchApplications: `${API_URL}/admin/loanApplications`,
  fetchUsers: `${API_URL}/admin/users`,
  updateUserProfile: `${API_URL}/admin/updateUserProfile`,
  loanstatus: `${API_URL}/admin/loanstatus`,
  deleteuser: `${API_URL}/admin/deleteuser`,
  updateloan: `${API_URL}/admin/updateLoanApplication`,
  DeleteLoanApplication: `${API_URL}/admin/deleteLoanApplication`,
  fetchAiPipeline: `${API_URL}/admin/ai-pipeline`,
  batchApproveAi: `${API_URL}/admin/ai-pipeline/batch-approve`,
};
