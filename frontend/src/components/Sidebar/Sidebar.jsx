import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Thêm useNavigate để điều hướng sau khi logout
import {
    LayoutDashboard,
    UserCog,
    Building2,
    Users,
    CalendarDays,
    FileText,
    ClipboardList,
    LogOut, Plus
} from 'lucide-react';

// 1. Cấu hình Menu (Dữ liệu tĩnh)
export const sidebarMenu = [
    {
        title: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutDashboard size={20} />,
        roles: ['admin', 'doctor', 'patient']
    },
    {
        title: 'Quản lý bác sĩ',
        path: '/admin/doctors',
        icon: <UserCog size={20} />,
        roles: ['admin']
    },
    {
        title: 'Quản lý khoa',
        path: '/admin/departments',
        icon: <Building2 size={20} />,
        roles: ['admin']
    },
    {
        title: 'Quản lý bệnh nhân',
        path: '/admin/patients',
        icon: <Users size={20} />,
        roles: ['admin', 'doctor']
    },
    {
        title: 'Quản lý lịch hẹn',
        path: '/admin/appointments',
        icon: <CalendarDays size={20} />,
        roles: ['admin', 'doctor', 'patient']
    },
    {
        title: 'Quản lý hóa đơn',
        path: '/admin/invoices',
        icon: <FileText size={20} />,
        roles: ['admin']
    },
    {
        title: 'Hồ sơ bệnh án',
        path: '/admin/medical-records',
        icon: <ClipboardList size={20} />,
        roles: ['admin', 'doctor', 'patient']
    },
];

const Sidebar = ({ userRole = 'admin' }) => {

    /* =============================================
       1. PHẦN CODE LOGIC
       ============================================= */
    const navigate = useNavigate();

    // Lọc danh sách menu dựa trên vai trò người dùng
    const filteredMenu = sidebarMenu.filter(item => item.roles.includes(userRole));

    // ĐỊNH NGHĨA HÀM LOGOUT (Lỗi của bạn nằm ở đây - thiếu hàm này)
    const handleLogout = () => {
        // Xóa token hoặc session nếu có (ví dụ: localStorage.clear())
        console.log("Đã đăng xuất");

        // Điều hướng về trang login
        navigate('/login');
    };


    /* =============================================
       2. PHẦN CODE FRONTEND (UI)
       ============================================= */
    return (
        <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
            {/* Logo PITI */}
            <div className="flex items-center gap-3 pt-8 px-6 mb-8">
                <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#3fa2d7] via-[#3491c2] to-[#1e60a3] rounded-[1.25rem] flex items-center justify-center text-white shadow-[0_10px_25px_-4px_rgba(63,162,215,0.6)]">
                        <span className="text-2xl font-black italic tracking-tighter">P</span>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-50">
                            <Plus className="w-3.5 h-3.5 text-[#3fa2d7]" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col -space-y-1 text-left">
                    <span className="text-xl font-black tracking-tighter text-slate-900 flex items-center">
                        PITI
                        <span className="ml-1 bg-gradient-to-r from-[#3fa2d7] to-[#1e60a3] bg-clip-text text-transparent">
                            Clinic
                        </span>
                    </span>
                    <div className="flex items-center gap-1">
                        <div className="h-[1px] w-3 bg-[#3fa2d7]/40"></div>
                        <span className="text-[9px] font-bold text-[#3fa2d7] uppercase tracking-[0.25em]">
                            Medical System
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <div className="px-4 py-2 flex-1 overflow-y-auto">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[2px] mb-4 px-4">
                    Menu chính
                </p>

                <nav className="space-y-1">
                    {filteredMenu.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 font-semibold'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-blue-500'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`transition-colors duration-300 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-[14px]">{item.title}</span>
                                    {isActive && (
                                        <div className="absolute right-0 w-1.5 h-6 bg-blue-600 rounded-l-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Logout Section  */}
            <div className="p-4 border-t border-gray-50">
                <button
                    onClick={handleLogout} // Gọi hàm đã định nghĩa ở phần logic
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all duration-300 group"
                >
                    <LogOut size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[14px] font-bold">Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;