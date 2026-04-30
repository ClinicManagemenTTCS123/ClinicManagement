import api from './api';

const PATIENT_ENDPOINT = '/patients';

export const patientService = {
  // Lấy danh sách (truyền {page, size, search} nếu backend có phân trang)
  getPatients: (params) => api.get(PATIENT_ENDPOINT, { params }),

  // Chi tiết & Dashboard
  getPatientById: (id) => api.get(`${PATIENT_ENDPOINT}/${id}`),
  getDashboard: (id) => api.get(`${PATIENT_ENDPOINT}/${id}/dashboard`),

  // CRUD
  createPatient: (data) => api.post(PATIENT_ENDPOINT, data),
  updatePatient: (id, data) => api.put(`${PATIENT_ENDPOINT}/${id}`, data),
  deletePatient: (id) => api.delete(`${PATIENT_ENDPOINT}/${id}`),

  // Dữ liệu liên quan
  getMedicalRecords: (id) => api.get(`${PATIENT_ENDPOINT}/${id}/medical-records`),
  getInvoices: (id) => api.get(`${PATIENT_ENDPOINT}/${id}/invoices`),
  getAppointments: (id) => api.get(`${PATIENT_ENDPOINT}/${id}/appointments`),

  // Lịch hẹn
  createAppointment: (id, appointmentData) =>
    api.post(`${PATIENT_ENDPOINT}/${id}/appointments`, appointmentData),
  cancelAppointment: (patientId, appointmentId) =>
    api.put(`${PATIENT_ENDPOINT}/${patientId}/appointments/${appointmentId}/cancel`)
};