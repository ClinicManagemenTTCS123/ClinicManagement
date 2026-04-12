import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarDoctor from '../components/Sidebar/SidebarDoctor';
import { Bell, UserCircle, Search, ChevronDown } from 'lucide-react';

const DoctorLayout = () => {
    const navigate = useNavigate();

    // Lấy thông tin từ localStorage (Mock data từ trang Login)
    const userRole = localStorage.getItem("userRole") || "doctor";
    const userName = "Dr. Nguyen Van An"; // Bạn có thể lấy từ JSON.parse(localStorage.getItem("user"))

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            <SidebarDoctor />

            <div className="flex-1 ml-64 flex flex-col">

                <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bệnh nhân, lịch hẹn..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">

                        <div className="relative cursor-pointer text-gray-400 hover:text-blue-500 transition-all p-2 hover:bg-gray-50 rounded-lg">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </div>

                        {/* Divider */}
                        <div className="h-8 w-[1px] bg-gray-100"></div>

                        {/* User Profile Info */}
                        <div className="flex items-center gap-3 group cursor-pointer p-1 pr-3 hover:bg-gray-50 rounded-xl transition-all">
                            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                                <UserCircle size={22} />
                            </div>

                            <div className="flex flex-col items-start leading-tight">
                                <span className="text-sm font-bold text-gray-800 tracking-tight">
                                    {userName}
                                </span>
                                <span className="text-[11px] text-green-500 font-semibold uppercase tracking-wider">
                                    On Duty
                                </span>
                            </div>

                            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" />
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-8 flex-1">
                    {/* Thêm hiệu ứng chuyển cảnh nhẹ cho nội dung */}
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

export default DoctorLayout;
