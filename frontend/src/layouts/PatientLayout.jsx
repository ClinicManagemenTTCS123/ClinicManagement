import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarPatient from '../components/Sidebar/SidebarPatient'; // Đảm bảo bạn đã tạo file này từ bước trước
import { Bell, UserCircle, Search, ChevronDown, CreditCard } from 'lucide-react';

const PatientLayout = () => {
    const navigate = useNavigate();

    // Giả định lấy thông tin từ localStorage hoặc Context API
    const userName = "Nguyễn Văn Khách Hàng";
    const patientID = "BN-2026-0812";

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar cố định cho Bệnh nhân */}
            <SidebarPatient />

            {/* Vùng nội dung chính bên phải */}
            <div className="flex-1 ml-64 flex flex-col">

                {/* Header Section */}
                <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">

                    {/* Left: Tìm kiếm nhanh dịch vụ/bác sĩ */}
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm bác sĩ, chuyên khoa, dịch vụ..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                        />
                    </div>

                    {/* Right: Thông báo & Hồ sơ cá nhân */}
                    <div className="flex items-center gap-6">

                        {/* Ví điện tử/Số dư (Tùy chọn cho Bệnh nhân) */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-colors">
                            <CreditCard size={16} className="text-emerald-600" />
                            <span className="text-[13px] font-bold text-emerald-700">0đ</span>
                        </div>

                        {/* Notification Bell */}
                        <div className="relative cursor-pointer text-gray-400 hover:text-blue-500 transition-all p-2 hover:bg-gray-50 rounded-lg">
                            <Bell size={20} />
                            {/* Chấm đỏ thông báo */}
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-[1px] bg-gray-100"></div>

                        {/* User Profile Info */}
                        <div className="flex items-center gap-3 group cursor-pointer p-1 pr-3 hover:bg-gray-50 rounded-xl transition-all">
                            <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                <UserCircle size={22} />
                            </div>

                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-sm font-bold text-gray-800 tracking-tight">
                                    {userName}
                                </span>
                                <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                                    ID: {patientID}
                                </span>
                            </div>

                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" />
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-8 flex-1">
                    {/* Hiệu ứng chuyển cảnh mượt mà khi đổi trang */}
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Outlet />
                    </div>
                </main>

                {/* Footer (Optional) */}
                <footer className="px-8 py-4 text-center text-[12px] text-gray-400 border-t border-gray-50">
                    &copy; 2026 PITI Clinic Medical System. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default PatientLayout;