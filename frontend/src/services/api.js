import axios from 'axios';

// 1. Cấu hình linh hoạt:
// Nếu chạy thực tế (Production), nó sẽ lấy từ biến môi trường.
// Nếu chạy ở máy mày (Development), nó mặc định là localhost:8081/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Timeout sau 10 giây nếu server không phản hồi, tránh treo trang
    timeout: 10000,
});

// 2. Interceptor cho Request: Trước khi gửi đi
api.interceptors.request.use(
    (config) => {
        // Sau này nếu có làm Login, mày nhét Token vào đây là xong
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Interceptor cho Response: Khi dữ liệu trả về (Xử lý lỗi tập trung)
api.interceptors.response.use(
    (response) => {
        // Nếu Backend trả về dữ liệu thành công, trả về đúng cục data đó thôi
        return response;
    },
    (error) => {
        // Bắt lỗi tập trung ở đây để không phải viết try-catch quá nhiều ở các trang
        if (error.response) {
            const status = error.response.status;
            const message = error.response.data || "Lỗi hệ thống";

            switch (status) {
                case 404:
                    console.error("Lỗi 404: Sai đường dẫn API! Kiểm tra lại Controller ở Java.");
                    break;
                case 500:
                    console.error("Lỗi 500: Server Java đang bị crash/nổ code rồi!");
                    break;
                case 400:
                    console.error("Lỗi 400: Dữ liệu gửi lên không đúng định dạng.");
                    break;
                case 401:
                    console.error("Lỗi 401: Chưa đăng nhập hoặc hết hạn phiên làm việc.");
                    break;
                default:
                    console.error(`Lỗi ${status}:`, message);
            }
        } else if (error.request) {
            // Lỗi khi server không phản hồi (chưa bật Spring Boot)
            console.error("Lỗi kết nối: Server Java chưa bật hoặc bị chặn Firewall rồi mày ơi!");
        } else {
            console.error("Lỗi không xác định:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;