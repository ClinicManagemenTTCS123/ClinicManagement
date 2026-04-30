import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { Bell, UserCircle } from 'lucide-react';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sidebar cố định bên trái */}
            <Sidebar />

            {/* Vùng nội dung bên phải */}
            <div className="flex-1 ml-64 flex flex-col">

                {/* Header dùng chung */}
                <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold">
                        {/* Tiêu đề này có thể làm động tùy theo trang */}
                        Hệ thống quản lý Phòng Khám
                    </div>

                    <div className="flex items-center gap-6 text-gray-500">

                        <div className="flex items-center gap-2 cursor-pointer">
                            <UserCircle size={24} />
                            <span className="font-medium text-gray-800">Admin</span>
                        </div>
                    </div>
                </header>

                {/* Nơi hiển thị các trang con (Dashboard, Bác sĩ...) */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;