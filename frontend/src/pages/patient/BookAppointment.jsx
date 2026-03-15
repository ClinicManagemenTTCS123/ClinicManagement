import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    ChevronRight,
    Check,
    Calendar as CalendarIcon,
    Clock,
    Lightbulb,
    CheckCircle2
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_DOCTORS = [
    { id: 'NL', name: 'BS. Nguyễn Thị Lan', specialty: 'Nội khoa', rating: '4.9/5.0', color: 'bg-blue-500' },
    { id: 'TM', name: 'BS. Trần Văn Minh', specialty: 'Tim mạch', rating: '4.8/5.0', color: 'bg-blue-500' },
    { id: 'PH', name: 'BS. Phạm Thị Hoa', specialty: 'Da liễu', rating: '4.7/5.0', color: 'bg-blue-500' },
    { id: 'LH', name: 'BS. Lê Quang Hùng', specialty: 'Chỉnh hình', rating: '4.9/5.0', color: 'bg-blue-500' },
    { id: 'VM', name: 'BS. Võ Thị Mai', specialty: 'Thần kinh', rating: '4.6/5.0', color: 'bg-blue-500' },
    { id: 'HN', name: 'BS. Hoàng Đức Nam', specialty: 'Nhi khoa', rating: '4.8/5.0', color: 'bg-blue-500' },
];

const MOCK_DATES = [
    { day: 'T2', date: '16', month: 'Th3' },
    { day: 'T3', date: '17', month: 'Th3' },
    { day: 'T4', date: '18', month: 'Th3' },
    { day: 'T5', date: '19', month: 'Th3' },
    { day: 'T6', date: '20', month: 'Th3' },
    { day: 'T7', date: '21', month: 'Th3' },
    { day: 'T2', date: '23', month: 'Th3' },
    { day: 'T3', date: '24', month: 'Th3' },
    { day: 'T4', date: '25', month: 'Th3' },
    { day: 'T5', date: '26', month: 'Th3' },
    { day: 'T6', date: '27', month: 'Th3' },
    { day: 'T7', date: '28', month: 'Th3' },
];

const MOCK_TIMES = ['08:00', '09:00', '10:00', '14:00', '15:00'];

const BookAppointment = () => {
    const navigate = useNavigate();

    // --- STATES ---
    const [step, setStep] = useState(1);

    // Step 1: Doctor selection
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Step 2: Date & Time selection
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState('');

    // --- HANDLERS ---
    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const handleConfirm = () => {
        setStep(4); // Chuyển sang màn hình Thành công
        // Giả lập gọi API và chuyển trang sau 2.5 giây
        setTimeout(() => {
            navigate('/patient/my-appointments');
        }, 2500);
    };

    // --- RENDER HELPERS ---
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

    return (
        <div className="max-w-4xl">
            {/* Header Stepper */}
            {step < 4 && renderStepper()}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                {/* --- BƯỚC 1: CHỌN BÁC SĨ --- */}
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
                            {MOCK_DOCTORS.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.specialty.toLowerCase().includes(searchQuery.toLowerCase())).map((doctor) => (
                                <div
                                    key={doctor.id}
                                    onClick={() => handleDoctorSelect(doctor)}
                                    className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-blue-50/50 hover:border-blue-100 cursor-pointer transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${doctor.color}`}>
                                            {doctor.id}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{doctor.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{doctor.specialty}</span>
                                                <span className="text-xs text-amber-500 font-medium flex items-center gap-1">
                                                    ★ {doctor.rating}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- BƯỚC 2: CHỌN NGÀY GIỜ --- */}
                {step === 2 && selectedDoctor && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        {/* Selected Doctor Card */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50/50 mb-8 border border-blue-100">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${selectedDoctor.color}`}>
                                    {selectedDoctor.id}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">{selectedDoctor.name}</h4>
                                    <p className="text-xs text-slate-500">{selectedDoctor.specialty}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setStep(1)}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                Đổi
                            </button>
                        </div>

                        {/* Date Selection */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <CalendarIcon size={18} className="text-blue-500"/> Chọn ngày khám
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {MOCK_DATES.map((d, idx) => {
                                    const isSelected = selectedDate === d.date;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => { setSelectedDate(d.date); setSelectedTime(null); }}
                                            className={`flex flex-col items-center justify-center w-[72px] h-[88px] rounded-xl border transition-all
                                                ${isSelected
                                                ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20'
                                                : 'bg-slate-50 border-transparent text-slate-600 hover:border-blue-200 hover:bg-white'}`}
                                        >
                                            <span className={`text-[11px] font-semibold uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{d.day}</span>
                                            <span className="text-xl font-bold my-0.5">{d.date}</span>
                                            <span className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{d.month}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Selection */}
                        {selectedDate && (
                            <div className="mb-8 animate-in fade-in duration-300">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Clock size={18} className="text-blue-500"/> Chọn giờ khám
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {MOCK_TIMES.map((time, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedTime(time)}
                                            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all border
                                                ${selectedTime === time
                                                ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20'
                                                : 'bg-slate-50 border-transparent text-slate-600 hover:border-blue-200 hover:bg-white'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reason Input */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-slate-800 mb-2">Lý do khám (tùy chọn)</h3>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Mô tả triệu chứng hoặc lý do khám..."
                                className="w-full p-4 bg-slate-50 border border-transparent rounded-xl text-sm outline-none focus:border-blue-200 focus:bg-white transition-all resize-none h-28"
                            ></textarea>
                        </div>

                        {/* Action Buttons */}
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

                {/* --- BƯỚC 3: XÁC NHẬN --- */}
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
                                    <span className="text-sm font-bold text-slate-800">{selectedDoctor?.name}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                    <span className="text-sm text-slate-500">Chuyên khoa</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedDoctor?.specialty}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                    <span className="text-sm text-slate-500">Ngày khám</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedDate}/03/2026</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                    <span className="text-sm text-slate-500">Giờ khám</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-200/60">
                                    <span className="text-sm text-slate-500">Bệnh nhân</span>
                                    <span className="text-sm font-bold text-slate-800">Nguyễn Văn An</span>
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
                                    Sau khi đặt lịch, hệ thống sẽ tự động tạo hóa đơn phí khám cho bạn. Vui lòng thanh toán trước khi đến khám.
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
                                className="px-8 py-3 rounded-xl font-semibold text-white bg-[#1DA1F2] hover:bg-blue-500 shadow-md shadow-blue-500/20 flex-1 transition-all"
                            >
                                Xác nhận đặt lịch
                            </button>
                        </div>
                    </div>
                )}

                {/* --- BƯỚC 4: THÀNH CÔNG --- */}
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
                            Đang chuyển đến trang lịch hẹn...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookAppointment;