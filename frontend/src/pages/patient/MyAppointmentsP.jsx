import React, { useEffect, useMemo, useState } from 'react';
import { Stethoscope, Calendar, Clock } from 'lucide-react';
import { patientService } from '../../services/patientService';

// --- ENUM STATUS (chuẩn backend) ---
const STATUS = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    COMPLETED: 'COMPLETED',
    CANCELED: 'CANCELED'
};

// --- UI CONFIG ---
const STATUS_UI = {
    [STATUS.PENDING]: { label: 'CHỜ XÁC NHẬN', className: 'bg-amber-50 text-amber-600' },
    [STATUS.CONFIRMED]: { label: 'ĐÃ XÁC NHẬN', className: 'bg-blue-50 text-blue-600' },
    [STATUS.COMPLETED]: { label: 'ĐÃ KHÁM', className: 'bg-emerald-50 text-emerald-600' },
    [STATUS.CANCELED]: { label: 'ĐÃ HỦY', className: 'bg-slate-100 text-slate-500' }
};

// --- TABS ---
const TABS = [
    { id: 'all', label: 'Tất cả', match: null },
    { id: 'pending', label: 'Chờ xác nhận', match: STATUS.PENDING },
    { id: 'confirmed', label: 'Đã xác nhận', match: STATUS.CONFIRMED },
    { id: 'completed', label: 'Đã khám', match: STATUS.COMPLETED },
    { id: 'canceled', label: 'Đã hủy', match: STATUS.CANCELED }
];

const MyAppointmentsP = () => {
    const patientId = localStorage.getItem("patientId") || "1";

    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- FETCH DATA BẰNG SERVICE ---
    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await patientService.getAppointments(patientId);
                const data = response.data || response;
                setAppointments(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi:", err);
                setError("Không thể tải lịch hẹn. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [patientId]);

    // --- CANCEL BẰNG SERVICE ---
    const handleCancel = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;

        try {
            await patientService.cancelAppointment(patientId, id);
            setAppointments(prev =>
                prev.map(appt =>
                    appt.id === id ? { ...appt, status: STATUS.CANCELED } : appt
                )
            );
        } catch (err) {
            alert("Lỗi khi hủy lịch. Vui lòng kiểm tra lại.");
        }
    };

    // Hàm format Date
    const formatDateTime = (dateInput) => {
        if (!dateInput) return { date: '', time: '' };
        let d;
        if (Array.isArray(dateInput)) {
            d = new Date(dateInput[0], dateInput[1]-1, dateInput[2], dateInput[3], dateInput[4]);
        } else {
            d = new Date(dateInput);
        }
        return {
            date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
    };

    // --- FILTER ---
    const filteredAppointments = useMemo(() => {
        const tab = TABS.find(t => t.id === activeTab);
        if (!tab || !tab.match) return appointments;
        return appointments.filter(a => a.status === tab.match);
    }, [appointments, activeTab]);

    // --- COUNT ---
    const getCount = (match) => {
        if (!match) return appointments.length;
        return appointments.filter(a => a.status === match).length;
    };

    // --- RENDER ---
    return (
        <div className="max-w-5xl">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Lịch hẹn của tôi</h1>
                <p className="text-sm text-slate-500 mt-1">Quản lý tất cả các lịch hẹn khám của bạn</p>
            </div>

            <div className="bg-slate-50 p-1.5 rounded-xl inline-flex flex-wrap gap-1 mb-6">
                {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    const count = getCount(tab.match);

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                                ${isActive ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            {tab.label}
                            <span className="text-xs text-blue-500 font-bold">({count})</span>
                        </button>
                    );
                })}
            </div>

            {loading && <div className="text-center py-10 text-slate-400">Đang tải...</div>}
            {error && <div className="text-center py-10 text-red-500">{error}</div>}

            {!loading && !error && (
                <div className="space-y-4">
                    {filteredAppointments.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                            <p className="text-slate-400">Không có lịch hẹn nào</p>
                        </div>
                    ) : (
                        filteredAppointments.map(appt => {
                            const statusUI = STATUS_UI[appt.status] || {};
                            const { date, time } = formatDateTime(appt.startTime);

                            return (
                                <div key={appt.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:border-blue-100 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                                            {/* ĐÃ SỬA LỖI SIZE TẠI ĐÂY */}
                                            <Stethoscope size={24} />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-base text-slate-800">
                                                {appt.doctorName ? `BS. ${appt.doctorName}` : "Chưa xếp bác sĩ"}
                                            </h3>
                                            <p className="text-sm text-slate-500">{appt.departmentName}</p>

                                            <div className="flex gap-4 mt-2.5 text-sm text-slate-500">
                                                <span className="flex items-center gap-1.5">
                                                    {/* ĐÃ SỬA LỖI SIZE TẠI ĐÂY */}
                                                    <Calendar size={15} />{date}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    {/* ĐÃ SỬA LỖI SIZE TẠI ĐÂY */}
                                                    <Clock size={15} />{time}
                                                </span>
                                            </div>

                                            {appt.reason && (
                                                <p className="mt-2.5 text-sm italic text-slate-500">"{appt.reason}"</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-start justify-end gap-4 mt-2 md:mt-0">
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide ${statusUI.className}`}>
                                            {statusUI.label}
                                        </span>

                                        {(appt.status === STATUS.PENDING || appt.status === STATUS.CONFIRMED) && (
                                            <button
                                                onClick={() => handleCancel(appt.id)}
                                                className="text-[13px] font-medium text-slate-400 hover:text-red-500 transition-colors mt-0.5"
                                            >
                                                Hủy lịch
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsP;
