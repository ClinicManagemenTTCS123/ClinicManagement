import React from 'react';
import { Calendar, Users, FileText, Clock, MoreVertical } from 'lucide-react';

// 1. Phải định nghĩa StatCard TRƯỚC khi sử dụng nó ở dưới
const StatCard = ({ title, value, subValue, icon, iconBg }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start transition-all hover:shadow-md">
        <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
            <p className="text-[11px] text-gray-400 font-medium">{subValue}</p>
        </div>
        <div className={`p-3 ${iconBg} rounded-xl flex items-center justify-center`}>
            {React.cloneElement(icon, { size: 22, className: "text-blue-600" })}
        </div>
    </div>
);

const DoctorDashboard = () => {
    const appointments = [
        { id: 1, patient: 'Trần Văn Hùng', time: '09:00', type: 'Tái khám', status: 'Đã xác nhận' },
        { id: 2, patient: 'Lê Thị Mai', time: '09:30', type: 'Khám mới', status: 'Đã xác nhận' },
        { id: 3, patient: 'Phạm Đức Anh', time: '10:00', type: 'Tái khám', status: 'Chờ xác nhận' },
        { id: 4, patient: 'Nguyễn Thị Bình', time: '10:30', type: 'Khám mới', status: 'Đã xác nhận' },
        { id: 5, patient: 'Hoàng Minh Tuấn', time: '11:00', type: 'Tái khám', status: 'Chờ xác nhận' },
    ];

    return (
        <div className="space-y-8">
            {/* Tiêu đề */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
                <p className="text-gray-500 text-sm">Xin chào, BS. Nguyễn Văn An. Hôm nay bạn có 8 lịch hẹn.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Lịch hẹn hôm nay"
                    value="8"
                    subValue="+2 so với hôm qua"
                    icon={<Calendar />}
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Bệnh nhân"
                    value="124"
                    subValue="+5 tuần này"
                    icon={<Users />}
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Hồ sơ bệnh án"
                    value="89"
                    subValue="3 chờ cập nhật"
                    icon={<FileText />}
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Giờ khám tiếp theo"
                    value="10:30"
                    subValue="Nguyễn Thị Bình"
                    icon={<Clock />}
                    iconBg="bg-blue-50"
                />
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Lịch hẹn sắp tới</h2>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <MoreVertical size={20} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[12px] uppercase tracking-wider border-b border-gray-50">
                            <th className="px-8 py-4 font-bold">Bệnh nhân</th>
                            <th className="px-8 py-4 font-bold">Giờ khám</th>
                            <th className="px-8 py-4 font-bold">Loại khám</th>
                            <th className="px-8 py-4 font-bold">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {appointments.map((apt) => (
                            <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                <td className="px-8 py-5 font-semibold text-gray-700">{apt.patient}</td>
                                <td className="px-8 py-5 text-gray-600 text-sm">{apt.time}</td>
                                <td className="px-8 py-5 text-gray-600 text-sm">{apt.type}</td>
                                <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                            apt.status === 'Đã xác nhận'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-orange-50 text-orange-600'
                                        }`}>
                                            {apt.status}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;