import api from './api';

const medicalRecordService = {
    /**
     * Lấy danh sách hồ sơ bệnh án (Admin)
     * @param {string} search - Từ khóa tìm kiếm (tên BN, BS, chẩn đoán)
     * @param {string} startDate - Định dạng YYYY-MM-DD
     * @param {string} endDate - Định dạng YYYY-MM-DD
     */
    getAllRecords: async (search = '', startDate = '', endDate = '') => {
        const params = {};
        if (search) params.search = search;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        // Gọi đến @GetMapping trong Controller
        const response = await api.get('/medical-records', { params });
        return response.data;
    },

    /**
     * Lấy chi tiết một hồ sơ bệnh án theo ID
     */
    getRecordById: async (id) => {
        const response = await api.get(`/medical-records/${id}`);
        return response.data;
    },

    /**
     * Lấy lịch sử khám bệnh của một bệnh nhân cụ thể
     */
    getRecordsByPatient: async (patientId) => {
        const response = await api.get(`/medical-records/patient/${patientId}`);
        return response.data;
    },

    /**
     * Lấy hồ sơ bệnh án dựa trên mã lịch hẹn (Appointment ID)
     */
    getByAppointmentId: async (aptId) => {
        const response = await api.get(`/medical-records/by-appointment/${aptId}`);
        return response.data;
    },

    /**
     * Thêm mới hoặc Cập nhật hồ sơ khám bệnh (Dành cho Bác sĩ/Admin)
     * Khớp với @PostMapping("/upsert-exam") trong Java
     */
    upsertExamRecord: async (medicalRecordDto) => {
        const response = await api.post('/medical-records/upsert-exam', medicalRecordDto);
        return response.data;
    },

    /**
     * Cập nhật thông tin hồ sơ bệnh án qua ID
     */
    updateRecord: async (id, medicalRecordDto) => {
        const response = await api.put(`/medical-records/${id}`, medicalRecordDto);
        return response.data;
    },

    /**
     * Xóa hồ sơ bệnh án
     */
    deleteRecord: async (id) => {
        const response = await api.delete(`/medical-records/${id}`);
        return response.data;
    }
};

export default medicalRecordService;