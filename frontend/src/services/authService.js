// Danh sách tài khoản mock
const MOCK_USERS = [
    {
        email: "admin@gmail.com",
        password: "123",
        role: "admin",
        name: "Quản trị viên"
    },
    {
        email: "doctor@gmail.com",
        password: "123",
        role: "doctor",
        name: "BS. Nguyễn Văn An"
    },
    {
        email: "patient@gmail.com",
        password: "123",
        role: "patient",
        name: "Bệnh nhân A"
    }
];

export const loginService = (email, password) => {
    return new Promise((resolve, reject) => {
        // Giả lập thời gian chờ của server 500ms
        setTimeout(() => {
            const user = MOCK_USERS.find(u => u.email === email && u.password === password);

            if (user) {
                // Lưu thông tin vào localStorage để các trang khác sử dụng
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("isLogin", "true");
                resolve(user);
            } else {
                reject("Email hoặc mật khẩu không chính xác!");
            }
        }, 500);
    });
};