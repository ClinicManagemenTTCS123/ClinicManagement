import api from './api';

/**
 * Lấy dữ liệu thống kê từ Backend (DashboardSummaryDto)
 */
export const getDashboardSummary = async () => {
    try {
        // 1. Kiểm tra khớp URL: Base URL (api.js) + /admin/dashboard
        // Phải khớp hoàn toàn với @RequestMapping trong AdminDashboardController.java
        const response = await api.get('/admin/dashboard');

        // 2. Dữ liệu trả về (response.data) sẽ có các key:
        // totalDoctors, totalPatients, totalDepartments, v.v. (giống hệt file DTO)
        return response.data;

    } catch (error) {
        // 3. Lỗi sẽ được xử lý tập trung tại Interceptor ở file api.js trước
        throw error;
    }
};