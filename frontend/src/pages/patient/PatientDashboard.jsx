import React from 'react';
import {
    Calendar,
    Wallet,
    FileText,
    TrendingUp,
    Stethoscope,
    Plus,
    ChevronRight,
    Clock
} from 'lucide-react';

const PatientDashboard = () => {
    // Mock data dựa trên hình ảnh
    const stats = [
        { title: 'Lịch hẹn sắp tới', value: '2', unit: 'lịch hẹn', icon: <Calendar className="text-blue-500" />, bgColor: 'bg-blue-50' },
        { title: 'Cần thanh toán', value: '850.000', unit: '₫', icon: <Wallet className="text-amber-500" />, bgColor: 'bg-amber-50', sub: 'hóa đơn chưa trả' },
        { title: 'Hồ sơ bệnh án', value: '3', unit: 'lần khám', icon: <FileText className="text-emerald-500" />, bgColor: 'bg-emerald-50' },
        { title: 'Quá hạn thanh toán', value: '420.000', unit: '₫', icon: <TrendingUp className="text-red-500" />, bgColor: 'bg-red-50', sub: 'cần xử lý' },
    ];

    const appointments = [
        { doctor: 'BS. Nguyễn Thị Lan', dept: 'Nội khoa', time: '09:00, 18/03/2025', status: 'ĐÃ XÁC NHẬN', statusColor: 'text-blue-600 bg-blue-50' },
        { doctor: 'BS. Trần Văn Minh', dept: 'Tim mạch', time: '14:30, 22/03/2025', status: 'CHỜ XÁC NHẬN', statusColor: 'text-amber-600 bg-amber-50' },
    ];

    const invoices = [
        { doctor: 'BS. Nguyễn Thị Lan', date: '18/03/2025', amount: '350.000 ₫', status: 'Chưa thanh toán', color: 'text-amber-500' },
        { doctor: 'BS. Trần Văn Minh', date: '22/03/2025', amount: '500.000 ₫', status: 'Chưa thanh toán', color: 'text-amber-500' },
        { doctor: 'BS. Phạm Thị Hoa', date: '28/02/2025', amount: '280.000 ₫', status: 'Đã thanh toán', color: 'text-emerald-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Header Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    Chào buổi sáng, An! 👋
                </h1>
                <p className="text-slate-500 mt-1">Đây là tổng quan sức khỏe của bạn hôm nay.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                            {stat.icon}
                        </div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                            <span className="text-sm font-medium text-slate-600">{stat.unit}</span>
                        </div>
                        {stat.sub && <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Appointments */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Lịch hẹn sắp tới</h2>
                        <button className="text-sm font-semibold text-blue-600 flex items-center hover:underline">
                            Xem tất cả <ChevronRight size={16} />
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-2">
                        {appointments.map((appt, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 bg-white hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                        <Stethoscope size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{appt.doctor}</h4>
                                        <p className="text-xs text-slate-500">{appt.dept} • {appt.time}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider ${appt.statusColor}`}>
                  {appt.status}
                </span>
                            </div>
                        ))}

                        <button className="w-full py-4 mt-2 border-2 border-dashed border-blue-100 rounded-xl text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                            <Plus size={18} /> Đặt lịch hẹn mới
                        </button>
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Hóa đơn gần đây</h2>
                        <button className="text-sm font-semibold text-blue-600 flex items-center hover:underline">
                            Tất cả <ChevronRight size={16} />
                        </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
                        {invoices.map((inv, idx) => (
                            <div key={idx} className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{inv.doctor}</h4>
                                    <p className="text-xs text-slate-400 mt-1">{inv.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-slate-800">{inv.amount}</p>
                                    <p className={`text-[10px] font-bold mt-1 ${inv.color}`}>{inv.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Latest Medical Record */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Hồ sơ khám gần nhất</h2>
                    <button className="text-sm font-semibold text-blue-600 flex items-center hover:underline">
                        Xem tất cả <ChevronRight size={16} />
                    </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock size={16} />
                                <span className="text-sm font-medium">Thứ Sáu, 28 tháng 2, 2025</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">BS. Phạm Thị Hoa • Da liễu</h3>
                            <p className="text-slate-600">
                                <span className="font-bold text-slate-800">Chẩn đoán:</span> Viêm da tiếp xúc dị ứng
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Đơn thuốc:</p>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                    Cetirizine 10mg - 1 viên/ngày - 7 ngày
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                    Kem Hydrocortisone 1% - Bôi 2 lần/ngày
                                </li>
                                <li className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                    Loratadine 10mg - 1 viên trước khi ngủ
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;