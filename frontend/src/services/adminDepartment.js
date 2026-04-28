import axios from 'axios';

const API_URL = '/api/departments';

export const departmentService = {
  // GET /api/departments?search=...
  getAll: (searchTerm = '') =>
    axios.get(`${API_URL}?search=${searchTerm}`),

  // GET /api/departments/1
  getById: (id) =>
    axios.get(`${API_URL}/${id}`),

  // POST /api/departments
  create: (data) =>
    axios.post(API_URL, data),

  // PUT /api/departments/1
  update: (id, data) =>
    axios.put(`${API_URL}/${id}`, data),

  // DELETE /api/departments/1
  delete: (id) =>
    axios.delete(`${API_URL}/${id}`)
};