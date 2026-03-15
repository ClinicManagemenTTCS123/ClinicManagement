import React, { useState } from 'react';
import { Stethoscope, Calendar, Clock } from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_APPOINTMENTS = [
    {
        id: 1,
        doctor: 'BS. Nguyễn Thị Lan',
        specialty: 'Nội khoa',
        date: '18/03/2025',
        time: '09:00',
        reason: 'Kiểm tra sức khỏe định kỳ',
        status: 'ĐÃ XÁC NHẬN'
    },
    {
        id: 2,
        doctor: 'BS. Trần Văn Minh',
        specialty: 'Tim mạch',
        date: '22/03/2025',
        time: '14:30',
        reason: 'Đau ngực, khó thở',
        status: 'CHỜ XÁC NHẬN'
    },
    {
        id: 3,
        doctor: 'BS. Phạm Thị Hoa',
        specialty: 'Da liễu',
        date: '28/02/2025',
        time: '10:00',
        reason: 'Nổi mẩn da',
        status: 'ĐÃ KHÁM'
    },
    {
        id: 4,
        doctor: 'BS. Lê Quang Hùng',
        specialty: 'Chỉnh hình',
        date: '15/02/2025',
        time: '13:00',
        reason: 'Đau khớp gối',
        status: 'ĐÃ HỦY'
    }
];

const MyAppointmentsP = () => {
    const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
    const [activeTab, setActiveTab] = useState('all');

    // --- CẤU HÌNH TABS ---
    const tabs = [
        { id: 'all', label: 'Tất cả', match: 'ALL' },
        { id: 'pending', label: 'Chờ xác nhận', match: 'CHỜ XÁC NHẬN' },
        { id: 'confirmed', label: 'Đã xác nhận', match: 'ĐÃ XÁC NHẬN' },
        { id: 'completed', label: 'Đã khám', match: 'ĐÃ KHÁM' },
        { id: 'cancelled', label: 'Đã hủy', match: 'ĐÃ HỦY' }
    ];

    // Lọc danh sách lịch hẹn theo tab hiện tại
    const filteredAppointments = appointments.filter(appt =>
        activeTab === 'all' ? true : appt.status === tabs.find(t => t.id === activeTab)?.match
    );

    // Tính toán số lượng cho từng tab
    const getCount = (match) => {
        if (match === 'ALL') return appointments.length;
        return appointments.filter(a => a.status === match).length;
    };

    // Helper: Lấy màu sắc cho badge trạng thái
    const getStatusStyle = (status) => {
        switch(status) {
            case 'ĐÃ XÁC NHẬN': return 'bg-blue-50 text-blue-600';
            case 'CHỜ XÁC NHẬN': return 'bg-amber-50 text-amber-600';
            case 'ĐÃ KHÁM': return 'bg-emerald-50 text-emerald-600';
            case 'ĐÃ HỦY': return 'bg-slate-100 text-slate-500';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    // Xử lý hủy lịch (Giả lập)
    const handleCancel = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) {
            setAppointments(prev => prev.map(appt =>
                appt.id === id ? { ...appt, status: 'ĐÃ HỦY' } : appt
            ));
        }
    };

    return (
        <div className="max-w-5xl">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Lịch hẹn của tôi</h1>
                <p className="text-sm text-slate-500 mt-1">Quản lý tất cả các lịch hẹn khám của bạn</p>
            </div>

            {/* Tabs Filter */}
            <div className="bg-slate-50/80 p-1.5 rounded-xl inline-flex flex-wrap gap-1 mb-6">
                {tabs.map(tab => {
                    const count = getCount(tab.match);
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                ${isActive
                                ? 'bg-white text-slate-800 shadow-sm border border-gray-100'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
                        >
                            {tab.label}
                            <span className={`text-xs ${isActive ? 'text-blue-500 font-bold' : 'text-slate-400'}`}>
                                ({count})
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Danh sách lịch hẹn */}
            <div className="space-y-4">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appt) => (
                        <div key={appt.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-start justify-between gap-4 animate-in fade-in duration-300">

                            {/* Left: Info */}
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                    <Stethoscope size={24} />
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{appt.doctor}</h3>
                                    <p className="text-sm text-slate-500">{appt.specialty}</p>

                                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} />
                                            <span>{appt.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={16} />
                                            <span>{appt.time}</span>
                                        </div>
                                    </div>

                                    <p className="mt-3 text-sm text-slate-500 italic">
                                        "{appt.reason}"
                                    </p>
                                </div>
                            </div>

                            {/* Right: Status & Actions */}
                            <div className="flex items-center gap-3 self-start md:self-auto">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider ${getStatusStyle(appt.status)}`}>
                                    {appt.status}
                                </span>

                                {/* Nút Hủy Lịch - Chỉ hiện khi Đã/Chờ xác nhận */}
                                {(appt.status === 'ĐÃ XÁC NHẬN' || appt.status === 'CHỜ XÁC NHẬN') && (
                                    <button
                                        onClick={() => handleCancel(appt.id)}
                                        className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors text-slate-400 hover:text-red-500 hover:bg-red-50"
                                    >
                                        Hủy lịch
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <p className="text-slate-400">Không có lịch hẹn nào trong mục này.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAppointmentsP;