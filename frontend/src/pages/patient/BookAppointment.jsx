import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    ChevronRight,
    Check,
    Calendar as CalendarIcon,
    Clock,
    Lightbulb,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import api from '../../services/api';
const generateNext7Days = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push({
            fullDate: d.toISOString().split('T')[0], // YYYY-MM-DD
            dayStr: `T${d.getDay() === 0 ? 'CN' : d.getDay() + 1}`,
            dateNum: d.getDate(),
            monthStr: `Th${d.getMonth() + 1}`
        });
    }
    return dates;
};

const AVAILABLE_TIMES = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];

const BookAppointment = () => {
    const navigate = useNavigate();
    const patientId = localStorage.getItem("patientId") || "1";

    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const generatedDates = generateNext7Days();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await doctorService.search({});
                console.log("Dữ liệu API trả về:", response);
                let data = response.data || response;
                if (data.content) {
                    data = data.content;
                }

                setDoctors(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Lỗi fetch bác sĩ:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);
    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            const dateTimeString = `${selectedDate.fullDate}T${selectedTime}:00`;

            const payload = {
                doctorId: selectedDoctor.id,
                departmentId: selectedDoctor.departmentId,
                startTime: dateTimeString,
                reason: reason,
                status: 'PENDING'
            };
            const res = await api.post(`/patients/${patientId}/appointments`, payload);

            setStep(4);
            setTimeout(() => navigate('/patient/my-appointments'), 2500);

        } catch (err) {
            const errText = err.response?.data || err.message || "Lỗi không xác định";
            alert(`Lỗi đặt lịch: ${errText}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepper = () => {
        const steps = [
            { num: 1, label: 'Chọn bác sĩ' },
            { num: 2, label: 'Chọn ngày giờ' },
            { num: 3, label: 'Xác nhận' }
        ];

        return (
            <div className="flex items-center gap-4 mb-8">
                {steps.map((s, index) => {
                    const isActive = step === s.num;
                    const isCompleted = step > s.num;
                    return (
                        <React.Fragment key={s.num}>
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                                    ${isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {isCompleted ? <Check size={16} strokeWidth={3} /> : s.num}
                                </div>
                                <span className={`text-sm font-medium ${isCompleted || isActive ? 'text-slate-800' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`h-[1px] w-16 ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    };

    if (loading) return <div className="flex flex-col items-center justify-center min-h-[300px] text-blue-500"><Loader2 className="animate-spin mb-2" size={32} />Đang tải danh sách bác sĩ...</div>;

    return (
        <div className="max-w-4xl">
            {step < 4 && renderStepper()}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                {step === 1 && (
                    <div className="animate-in fade-in duration-300">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Chọn bác sĩ</h2>
                            <p className="text-sm text-slate-500 mt-1">Tìm kiếm bác sĩ theo tên hoặc chuyên khoa</p>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm bác sĩ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent focus:border-blue-100 focus:bg-white rounded-xl text-sm outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {doctors.filter(d => d.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || d.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())).map((doctor) => (
                                <div
                                    key={doctor.id}
                                    onClick={() => { setSelectedDoctor(doctor); setStep(2); }}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-blue-50/50 hover:border-blue-100 cursor-pointer transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold">
                                            {doctor.fullName?.charAt(0) || 'BS'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{doctor.fullName}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{doctor.departmentName || 'Chưa rõ khoa'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && selectedDoctor && (
                    <div className="animate-in slide-in-from-right-4 duration-300">

                        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 mb-8 border border-blue-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold">
                                    {selectedDoctor.fullName?.charAt(0) || 'BS'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{selectedDoctor.fullName}</h4>
                                    <p className="text-xs text-slate-500">{selectedDoctor.departmentName}</p>
                                </div>
                            </div>
                            <button onClick={() => setStep(1)} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Đổi
                            </button>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <CalendarIcon size={18} className="text-blue-500"/> Chọn ngày khám
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {generatedDates.map((d, idx) => {
                                    const isSelected = selectedDate?.fullDate === d.fullDate;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                                            className={`flex flex-col items-center justify-center w-[72px] h-[88px] rounded-xl border transition-all
                                                ${isSelected ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 border-transparent text-slate-600 hover:border-blue-200 hover:bg-white'}`}
                                        >
                                            <span className={`text-[11px] font-semibold uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{d.dayStr}</span>
                                            <span className="text-xl font-bold my-0.5">{d.dateNum}</span>
                                            <span className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{d.monthStr}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="mb-8 animate-in fade-in duration-300">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Clock size={18} className="text-blue-500"/> Chọn giờ khám
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {AVAILABLE_TIMES.map((time, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedTime(time)}
                                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border
                                                ${selectedTime === time ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 border-transparent text-slate-600 hover:border-blue-200 hover:bg-white'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-800 mb-2">Lý do khám (tùy chọn)</h3>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Mô tả triệu chứng hoặc lý do khám..."
                                className="w-full p-4 bg-slate-50 border border-transparent rounded-xl text-sm outline-none focus:border-blue-200 focus:bg-white transition-all resize-none h-28"
                            ></textarea>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-gray-200 hover:bg-gray-50 flex-1 transition-all"
                            >
                                Quay lại
                            </button>
                            <button
                                disabled={!selectedDate || !selectedTime}
                                onClick={() => setStep(3)}
                                className={`px-8 py-3 rounded-xl font-semibold text-white flex-1 transition-all flex items-center justify-center gap-2
                                    ${(!selectedDate || !selectedTime) ? 'bg-blue-300 cursor-not-allowed' : 'bg-[#1DA1F2] hover:bg-blue-500 shadow-md shadow-blue-500/20'}`}
                            >
                                Tiếp tục <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Xác nhận đặt lịch</h2>
                            <p className="text-sm text-slate-500 mt-1">Kiểm tra thông tin trước khi xác nhận</p>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-6 mb-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                    <span className="text-sm text-slate-500">Bác sĩ</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedDoctor?.fullName}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                    <span className="text-sm text-slate-500">Chuyên khoa</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedDoctor?.departmentName}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                    <span className="text-sm text-slate-500">Ngày khám</span>
                                    <span className="text-sm font-bold text-slate-800">
                                        {selectedDate?.dayStr}, {selectedDate?.dateNum} {selectedDate?.monthStr}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                    <span className="text-sm text-slate-500">Giờ khám</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between items-start py-2">
                                    <span className="text-sm text-slate-500">Lý do khám</span>
                                    <span className="text-sm font-bold text-slate-800 text-right max-w-[50%]">
                                        {reason || "Không ghi chú"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-8 flex gap-3">
                            <Lightbulb className="text-amber-500 shrink-0 mt-0.5" size={20} />
                            <div>
                                <h4 className="text-sm font-bold text-blue-800">Hóa đơn tự động</h4>
                                <p className="text-xs text-blue-600/80 mt-1">
                                    Sau khi đặt lịch thành công, hệ thống sẽ tự động tạo hóa đơn khám bệnh. Vui lòng thanh toán trước khi đến khám.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="px-8 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-gray-200 hover:bg-gray-50 flex-1 transition-all"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-xl font-semibold text-white bg-[#1DA1F2] hover:bg-blue-500 flex-1 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Xác nhận đặt lịch"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 className="text-emerald-500 w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Đặt lịch thành công!</h2>
                        <p className="text-slate-500 text-center mb-2 text-sm">
                            Hệ thống đã ghi nhận lịch hẹn và tạo hóa đơn tự động.
                        </p>
                        <p className="text-blue-500 text-sm font-medium animate-pulse">
                            Đang tự động chuyển đến trang lịch hẹn...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;
