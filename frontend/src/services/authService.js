import api from './api';

export const authService = {
    login: async (username, password) => {
        try {
            // ĐỔI 'email' THÀNH 'username' ĐỂ KHỚP BACKEND VÀ DATABASE
            const response = await api.post('/auth/login', {
                username: username, // Gửi key là username
                password: password
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || 'Đăng nhập thất bại';
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', {
                username: userData.username, // Đổi từ email thành username
                password: userData.password,
                confirmPassword: userData.confirmPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || 'Đăng ký thất bại';
        }
    },

    logout: () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('doctorId');
    }
};

export default authService;