import api from './api';

export const doctorService = {
    // GET /api/admin/doctors?keyword=...&departmentId=...&status=...
    search: (params) => {
        return api.get('/admin/doctors', { params });
    },

    // GET /api/admin/doctors/{id}
    getById: (id) => {
        return api.get(`/admin/doctors/${id}`);
    },

    // POST /api/admin/doctors
    create: (data) => {
        return api.post('/admin/doctors', data);
    },

    // PUT /api/admin/doctors/{id}
    update: (id, data) => {
        return api.put(`/admin/doctors/${id}`, data);
    },

    // DELETE /api/admin/doctors/{id}
    delete: (id) => {
        return api.delete(`/admin/doctors/${id}`);
    }
};