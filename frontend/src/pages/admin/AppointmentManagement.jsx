import React, { useState, useEffect, useMemo } from 'react';
import { Search, Edit, Trash2, Eye, Plus, ChevronLeft, ChevronRight, X, Loader2, Check, Calendar as CalendarIcon, Clock, Lightbulb, CheckCircle2, ChevronRight as ChevronRightIcon, UserPlus, UserCheck } from 'lucide-react';
import axios from 'axios';

// Hàm tạo ngày
const generateNext7Days = () => {
    const dates = [];
    for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push({
            fullDate: d.toISOString().split('T')[0],
            dayStr: `T${d.getDay() === 0 ? 'CN' : d.getDay() + 1}`,
            dateNum: d.getDate(),
            monthStr: `Th${d.getMonth() + 1}`
        });
    }
    return dates;
};

const AVAILABLE_TIMES = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];

const AppointmentManagement = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

    // ==========================================
    // 1. STATES DANH SÁCH & BỘ LỌC
    // ==========================================
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ==========================================
    // 2. STATES MODAL & STEPPER (Tạo lịch mới)
    // ==========================================
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'VIEW' });
    const [selectedApt, setSelectedApt] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // States cho Stepper ADD
    const [step, setStep] = useState(1);
    const [patientMode, setPatientMode] = useState('EXISTING'); // 'EXISTING' hoặc 'NEW'
    const [isCreatingPatient, setIsCreatingPatient] = useState(false);

    const [searchDoctorQuery, setSearchDoctorQuery] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState('');

    // State cho Form Thêm bệnh nhân mới
    const [newPatientForm, setNewPatientForm] = useState({
        fullName: '', gender: 'MALE', dateOfBirth: '', phone: '', email: '', address: '', cccd: '', insuranceCode: ''
    });

    const generatedDates = useMemo(() => generateNext7Days(), []);
    const [editForm, setEditForm] = useState({ status: '', reason: '', date: '', time: '' });

    // ==========================================
    // 3. FETCH DATA
    // ==========================================
    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/admin/appointments`, {
                params: { search: searchTerm, status: filterStatus }
            });
            setAppointments(res.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Lỗi lấy lịch hẹn:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDropdownData = async () => {
        try {
            const [resDocs, resPats] = await Promise.all([
                axios.get(`${apiUrl}/admin/doctors`),
                axios.get(`${apiUrl}/patients`)
            ]);
            setDoctors(resDocs.data);
            setPatients(resPats.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu dropdown:", error);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchAppointments(); }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filterStatus]);

    // ==========================================
    // 4. XỬ LÝ SỰ KIỆN
    // ==========================================
    const openModal = (type, apt = null) => {
        setModalConfig({ isOpen: true, type });
        setSelectedApt(apt);

        if (type === 'ADD') {
            setStep(1);
            setPatientMode('EXISTING');
            setSelectedPatientId('');
            setSelectedDoctor(null);
            setSelectedDate(null);
            setSelectedTime(null);
            setReason('');
            setNewPatientForm({ fullName: '', gender: 'MALE', dateOfBirth: '', phone: '', email: '', address: '', cccd: '', insuranceCode: '' });
        } else if (type === 'EDIT' && apt) {
            const [datePart, timePart] = apt.startTime ? apt.startTime.split('T') : ['', ''];
            setEditForm({
                status: apt.status,
                reason: apt.reason || '',
                date: datePart,
                time: timePart ? timePart.substring(0, 5) : ''
            });
        }
    };

    // Hàm tạo bệnh nhân mới rồi sang Bước 2
    const handleCreatePatientAndProceed = async () => {
        if (!newPatientForm.fullName || !newPatientForm.phone || !newPatientForm.dateOfBirth) {
            alert("Vui lòng điền đầy đủ Họ tên, SĐT và Ngày sinh của bệnh nhân!");
            return;
        }
        setIsCreatingPatient(true);
        try {
            // Gọi API tạo bệnh nhân mới
            const res = await axios.post(`${apiUrl}/patients`, newPatientForm);
            const newPatient = res.data;

            // Cập nhật danh sách bệnh nhân ở frontend
            setPatients(prev => [...prev, newPatient]);

            // Gán ID bệnh nhân vừa tạo vào selectedPatientId và chuyển bước 2
            setSelectedPatientId(newPatient.id);
            setStep(2);
        } catch (error) {
            alert(`Lỗi tạo bệnh nhân: ${error.response?.data || error.message}`);
        } finally {
            setIsCreatingPatient(false);
        }
    };

    const handleConfirmAdd = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                patientId: selectedPatientId,
                doctorId: selectedDoctor.id,
                departmentId: selectedDoctor.departmentId,
                startTime: `${selectedDate.fullDate}T${selectedTime}:00`,
                reason: reason,
                status: 'CONFIRMED' // Lễ tân tạo mặc định Đã xác nhận
            };
            await axios.post(`${apiUrl}/admin/appointments`, payload);
            setStep(4);
            fetchAppointments();
        } catch (err) {
            alert(`Lỗi đặt lịch: ${err.response?.data || err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmEdit = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                status: editForm.status,
                reason: editForm.reason,
                startTime: `${editForm.date}T${editForm.time}:00`
            };
            await axios.put(`${apiUrl}/admin/appointments/${selectedApt.id}`, payload);
            alert('Cập nhật thành công!');
            setModalConfig({ isOpen: false, type: 'VIEW' });
            fetchAppointments();
        } catch (err) {
            alert(`Lỗi cập nhật: ${err.response?.data || err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này không?")) return;
        try {
            await axios.delete(`${apiUrl}/admin/appointments/${id}`);
            fetchAppointments();
        } catch (error) {
            alert('Lỗi xóa lịch: ' + (error.response?.data || error.message));
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return { text: 'Chờ xác nhận', class: 'bg-orange-50 text-orange-600' };
            case 'CONFIRMED': return { text: 'Đã xác nhận', class: 'bg-blue-50 text-blue-600' };
            case 'COMPLETED': return { text: 'Hoàn thành', class: 'bg-emerald-50 text-emerald-600' };
            case 'CANCELED': return { text: 'Đã hủy', class: 'bg-red-50 text-red-600' };
            default: return { text: status, class: 'bg-gray-50 text-gray-600' };
        }
    };

    const totalPages = Math.ceil(appointments.length / itemsPerPage);
    const currentItems = appointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467] relative">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                {/* Header & Filter */}
                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800">Quản lý lịch hẹn</h2>
                        <button
                            onClick={() => openModal('ADD')}
                            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all shadow-md shadow-blue-100">
                            <Plus size={18} /> Đặt lịch hẹn mới
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm theo ID, tên bệnh nhân..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 outline-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">Chờ xác nhận</option>
                            <option value="CONFIRMED">Đã xác nhận</option>
                            <option value="COMPLETED">Hoàn thành</option>
                            <option value="CANCELED">Đã hủy</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[13px] border-b border-gray-50 bg-gray-50/50">
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Mã LH</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Bệnh nhân</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Bác sĩ</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Thời gian</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider text-center">Trạng thái</th>
                            <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan="6" className="text-center py-10">Đang tải...</td></tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((item) => {
                                const statusObj = getStatusStyle(item.status);
                                return (
                                    <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="py-4 px-6 font-semibold text-gray-500">#{item.id}</td>
                                        <td className="py-4 px-6 font-bold text-gray-800">{item.patientName || item.patient?.fullName}</td>
                                        <td className="py-4 px-6 text-gray-600">{item.doctorName || item.doctor?.fullName || 'Chưa xếp'}</td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-gray-700">{item.appointment_date}</div>
                                            <div className="text-gray-400 text-xs">{item.startTime ? item.startTime.split('T')[1].substring(0,5) : ''}</div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`px-3 py-1 rounded-md text-[11px] font-bold ${statusObj.class}`}>{statusObj.text}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-center items-center gap-2">
                                                <button onClick={() => openModal('VIEW', item)} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-100 rounded-lg transition-all"><Eye size={16} /></button>
                                                <button onClick={() => openModal('EDIT', item)} className="p-2 text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-lg transition-all"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="6" className="text-center py-10 text-gray-400">Không có dữ liệu</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-6 flex items-center justify-between border-t border-gray-50 bg-white">
                        <p className="text-sm text-gray-400 font-medium">Hiển thị {currentItems.length} / {appointments.length}</p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 text-gray-400 hover:text-blue-600"><ChevronLeft size={18} /></button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-bold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{i + 1}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 text-gray-400 hover:text-blue-600"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================== */}
            {/* MODAL                                      */}
            {/* ========================================== */}
            {modalConfig.isOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col transition-all ${modalConfig.type === 'ADD' ? 'w-full max-w-4xl' : 'w-full max-w-2xl'}`}>

                        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                {modalConfig.type === 'ADD' ? 'Tạo lịch hẹn mới' : modalConfig.type === 'EDIT' ? `Cập nhật lịch hẹn #${selectedApt?.id}` : `Chi tiết lịch hẹn #${selectedApt?.id}`}
                            </h2>
                            <button onClick={() => setModalConfig({isOpen: false})} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>

                        <div className="p-8 bg-gray-50/50 flex-1 overflow-y-auto max-h-[75vh]">

                            {/* --- CHẾ ĐỘ THÊM MỚI (TÁI SỬ DỤNG STEPPER) --- */}
                            {modalConfig.type === 'ADD' && (
                                <div>
                                    {/* Stepper Header */}
                                    {step < 4 && (
                                        <div className="flex items-center gap-4 mb-8">
                                            {[{num: 1, label: 'Bệnh nhân & Bác sĩ'}, {num: 2, label: 'Chọn Ngày giờ'}, {num: 3, label: 'Xác nhận'}].map((s, index) => {
                                                const isActive = step === s.num;
                                                const isCompleted = step > s.num;
                                                return (
                                                    <React.Fragment key={s.num}>
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isCompleted ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                                                {isCompleted ? <Check size={16} strokeWidth={3} /> : s.num}
                                                            </div>
                                                            <span className={`text-sm font-medium hidden sm:block ${isCompleted || isActive ? 'text-slate-800' : 'text-gray-400'}`}>{s.label}</span>
                                                        </div>
                                                        {index < 2 && <div className={`h-[1px] flex-1 max-w-[50px] ${isCompleted ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* STEP 1: Chọn bệnh nhân & Bác sĩ */}
                                    {step === 1 && (
                                        <div className="animate-in fade-in duration-300 space-y-6">

                                            {/* --- TOGGLE BUTTONS CHO BỆNH NHÂN --- */}
                                            <div className="flex bg-gray-200/60 p-1 rounded-xl w-fit">
                                                <button
                                                    onClick={() => setPatientMode('EXISTING')}
                                                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${patientMode === 'EXISTING' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    <UserCheck size={18} /> Bệnh nhân đã có
                                                </button>
                                                <button
                                                    onClick={() => setPatientMode('NEW')}
                                                    className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-lg transition-all ${patientMode === 'NEW' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    <UserPlus size={18} /> Khách vãng lai (Mới)
                                                </button>
                                            </div>

                                            {patientMode === 'EXISTING' ? (
                                                // --- FORM CHỌN BỆNH NHÂN ĐÃ CÓ ---
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Chọn bệnh nhân <span className="text-red-500">*</span></label>
                                                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                                            value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)}>
                                                        <option value="">-- Click để tìm và chọn bệnh nhân --</option>
                                                        {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} ({p.phone})</option>)}
                                                    </select>
                                                </div>
                                            ) : (
                                                // --- FORM THÊM BỆNH NHÂN MỚI TỨC THÌ ---
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                                    <h3 className="font-bold text-slate-800 border-b border-gray-50 pb-3 mb-4">Thông tin bệnh nhân mới</h3>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                                                            <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white text-sm transition-all"
                                                                   value={newPatientForm.fullName} onChange={(e) => setNewPatientForm({...newPatientForm, fullName: e.target.value})} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                                                            <input required type="tel" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white text-sm transition-all"
                                                                   value={newPatientForm.phone} onChange={(e) => setNewPatientForm({...newPatientForm, phone: e.target.value})} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày sinh <span className="text-red-500">*</span></label>
                                                            <input required type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white text-sm transition-all"
                                                                   value={newPatientForm.dateOfBirth} onChange={(e) => setNewPatientForm({...newPatientForm, dateOfBirth: e.target.value})} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giới tính <span className="text-red-500">*</span></label>
                                                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white text-sm transition-all"
                                                                    value={newPatientForm.gender} onChange={(e) => setNewPatientForm({...newPatientForm, gender: e.target.value})}>
                                                                <option value="MALE">Nam</option>
                                                                <option value="FEMALE">Nữ</option>
                                                                <option value="OTHER">Khác</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-span-1 md:col-span-2">
                                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ</label>
                                                            <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 focus:bg-white text-sm transition-all"
                                                                   value={newPatientForm.address} onChange={(e) => setNewPatientForm({...newPatientForm, address: e.target.value})} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* --- CHỌN BÁC SĨ --- */}
                                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                                <label className="block text-sm font-bold text-slate-700 mb-3">Chọn bác sĩ phụ trách <span className="text-red-500">*</span></label>
                                                <div className="relative mb-4">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                    <input type="text" placeholder="Tìm theo tên bác sĩ..." value={searchDoctorQuery} onChange={(e) => setSearchDoctorQuery(e.target.value)}
                                                           className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {doctors.filter(d => d.fullName?.toLowerCase().includes(searchDoctorQuery.toLowerCase())).map((doctor) => (
                                                        <div key={doctor.id} onClick={() => setSelectedDoctor(doctor)}
                                                             className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedDoctor?.id === doctor.id ? 'bg-blue-50 border-blue-400 shadow-md ring-2 ring-blue-50' : 'bg-white border-gray-100 hover:border-blue-200 hover:bg-gray-50'}`}>
                                                            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-sm shrink-0">
                                                                {doctor.fullName?.charAt(0) || 'BS'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-slate-800 text-sm">BS. {doctor.fullName}</h4>
                                                                <span className="text-[10px] font-semibold text-blue-600 bg-blue-100/50 px-2 py-0.5 rounded-md mt-1 inline-block">{doctor.departmentName}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* NÚT NEXT */}
                                            <div className="flex justify-end pt-4">
                                                {patientMode === 'EXISTING' ? (
                                                    <button disabled={!selectedPatientId || !selectedDoctor} onClick={() => setStep(2)}
                                                            className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                                        Tiếp tục <ChevronRightIcon size={18} />
                                                    </button>
                                                ) : (
                                                    <button disabled={!selectedDoctor || isCreatingPatient} onClick={handleCreatePatientAndProceed}
                                                            className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                                        {isCreatingPatient ? <Loader2 className="animate-spin" size={18} /> : null}
                                                        Lưu hồ sơ & Tiếp tục <ChevronRightIcon size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: Chọn Ngày, Giờ & Lý do */}
                                    {step === 2 && (
                                        <div className="animate-in slide-in-from-right-4 duration-300">
                                            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 mb-6 border border-blue-100">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-lg">
                                                        {selectedDoctor?.fullName?.charAt(0) || 'BS'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">BS. {selectedDoctor?.fullName}</h4>
                                                        <p className="text-xs font-medium text-blue-600 bg-white px-2 py-0.5 rounded-md border border-blue-100 mt-1 inline-block">{selectedDoctor?.departmentName}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setStep(1)} className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">Thay đổi</button>
                                            </div>

                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4"><CalendarIcon size={18} className="text-blue-500"/> Chọn ngày khám</h3>
                                                    <div className="flex flex-wrap gap-2.5">
                                                        {generatedDates.map((d, idx) => {
                                                            const isSelected = selectedDate?.fullDate === d.fullDate;
                                                            return (
                                                                <button key={idx} onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                                                                        className={`flex flex-col items-center justify-center w-[72px] h-[85px] rounded-2xl border transition-all ${isSelected ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200' : 'bg-gray-50 border-gray-200 text-slate-600 hover:border-blue-300 hover:bg-white'}`}>
                                                                    <span className={`text-[10px] font-semibold uppercase ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{d.dayStr}</span>
                                                                    <span className="text-xl font-bold my-0.5">{d.dateNum}</span>
                                                                    <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{d.monthStr}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {selectedDate && (
                                                    <div className="animate-in fade-in duration-300">
                                                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4"><Clock size={18} className="text-blue-500"/> Chọn giờ khám</h3>
                                                        <div className="flex flex-wrap gap-3">
                                                            {AVAILABLE_TIMES.map((time, idx) => (
                                                                <button key={idx} onClick={() => setSelectedTime(time)}
                                                                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${selectedTime === time ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-200' : 'bg-gray-50 border-gray-200 text-slate-600 hover:border-blue-300 hover:bg-white'}`}>
                                                                    {time}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <h3 className="text-sm font-bold text-slate-700 mb-2">Lý do khám (Triệu chứng)</h3>
                                                    <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Mô tả tóm tắt tình trạng của bệnh nhân..."
                                                              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all resize-none h-24"></textarea>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-6">
                                                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">Quay lại</button>
                                                <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(3)}
                                                        className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                                    Tiếp tục xác nhận <ChevronRightIcon size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 3: Xác nhận */}
                                    {step === 3 && (
                                        <div className="animate-in slide-in-from-right-4 duration-300 space-y-6">
                                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                <h3 className="font-bold text-lg text-slate-800 border-b border-gray-50 pb-4 mb-4">Phiếu xác nhận thông tin</h3>
                                                <div className="space-y-4">
                                                    <div className="flex justify-between items-center pb-3 border-b border-gray-50/50">
                                                        <span className="text-sm text-slate-500 font-medium">Bệnh nhân</span>
                                                        <span className="text-sm font-bold text-slate-800">{patients.find(p => p.id == selectedPatientId)?.fullName}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center pb-3 border-b border-gray-50/50">
                                                        <span className="text-sm text-slate-500 font-medium">Bác sĩ phụ trách</span>
                                                        <span className="text-sm font-bold text-blue-600">BS. {selectedDoctor?.fullName} <span className="text-slate-400 font-normal">({selectedDoctor?.departmentName})</span></span>
                                                    </div>
                                                    <div className="flex justify-between items-center pb-3 border-b border-gray-50/50">
                                                        <span className="text-sm text-slate-500 font-medium">Thời gian khám</span>
                                                        <span className="text-sm font-bold text-slate-800 bg-gray-100 px-3 py-1 rounded-lg">{selectedTime} - {selectedDate?.dayStr}, {selectedDate?.dateNum} {selectedDate?.monthStr}</span>
                                                    </div>
                                                    <div className="flex justify-between items-start pt-1">
                                                        <span className="text-sm text-slate-500 font-medium">Lý do khám</span>
                                                        <span className="text-sm font-bold text-slate-800 text-right max-w-[50%] leading-relaxed">{reason || <span className="italic text-gray-400 font-normal">Không có ghi chú</span>}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                                    <Lightbulb className="text-emerald-600" size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-emerald-800">Thông báo tự động</h4>
                                                    <p className="text-xs font-medium text-emerald-600/80 mt-1.5 leading-relaxed">
                                                        Sau khi xác nhận, lịch hẹn sẽ được tạo với trạng thái <span className="font-bold text-emerald-700">Đã xác nhận</span> và chuyển thẳng vào danh sách chờ khám của BS. {selectedDoctor?.fullName}.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-4">
                                                <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">Quay lại sửa</button>
                                                <button onClick={handleConfirmAdd} disabled={isSubmitting}
                                                        className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} Xác nhận tạo lịch hẹn
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 4: Thành công */}
                                    {step === 4 && (
                                        <div className="py-12 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                                <CheckCircle2 className="text-emerald-500 w-10 h-10" strokeWidth={2.5} />
                                            </div>
                                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Tạo lịch hẹn thành công!</h2>
                                            <p className="text-slate-500 text-center mb-8 text-sm max-w-sm">
                                                Hệ thống đã ghi nhận lịch hẹn vào dữ liệu. Bệnh nhân có thể tiến hành vào khu vực chờ khám.
                                            </p>
                                            <button onClick={() => setModalConfig({isOpen: false})} className="px-10 py-3 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-lg">
                                                Đóng cửa sổ
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- CHẾ ĐỘ VIEW VÀ EDIT (Dành cho các nút ở bảng) --- */}
                            {modalConfig.type !== 'ADD' && (
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bệnh nhân</p>
                                            <p className="font-bold text-gray-800 mt-1.5">{selectedApt?.patientName || selectedApt?.patient?.fullName}</p>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bác sĩ phụ trách</p>
                                            <p className="font-bold text-blue-600 mt-1.5">{selectedApt?.doctorName || selectedApt?.doctor?.fullName || 'Chưa xếp'}</p>
                                        </div>

                                        {modalConfig.type === 'VIEW' ? (
                                            <>
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Thời gian khám</p>
                                                    <p className="font-bold text-gray-800 mt-1.5">{selectedApt?.appointment_date} lúc {selectedApt?.startTime?.split('T')[1]?.substring(0,5)}</p>
                                                </div>
                                                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Trạng thái</p>
                                                    <div className="mt-1.5"><span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ${getStatusStyle(selectedApt?.status).class}`}>{getStatusStyle(selectedApt?.status).text}</span></div>
                                                </div>
                                                <div className="col-span-1 md:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Lý do khám / Ghi chú</p>
                                                    <p className="text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed">{selectedApt?.reason || <span className="italic text-gray-400">Không có ghi chú</span>}</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700">Ngày khám</label>
                                                    <input type="date" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                                           value={editForm.date} onChange={(e) => setEditForm({...editForm, date: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700">Giờ khám</label>
                                                    <input type="time" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                                           value={editForm.time} onChange={(e) => setEditForm({...editForm, time: e.target.value})} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700">Trạng thái</label>
                                                    <select className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                                            value={editForm.status} onChange={(e) => setEditForm({...editForm, status: e.target.value})}>
                                                        <option value="PENDING">Chờ xác nhận</option>
                                                        <option value="CONFIRMED">Đã xác nhận</option>
                                                        <option value="COMPLETED">Hoàn thành</option>
                                                        <option value="CANCELED">Đã hủy</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-1 md:col-span-2 space-y-2">
                                                    <label className="text-sm font-bold text-gray-700">Lý do khám / Ghi chú</label>
                                                    <textarea className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all h-24 resize-none"
                                                              value={editForm.reason} onChange={(e) => setEditForm({...editForm, reason: e.target.value})}></textarea>
                                                </div>
                                                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-100">
                                                    <button onClick={() => setModalConfig({isOpen: false})} className="px-6 py-2.5 rounded-xl font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-all">Hủy bỏ</button>
                                                    <button onClick={handleConfirmEdit} disabled={isSubmitting} className="px-8 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-100 transition-all">
                                                        {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />} Cập nhật thông tin
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {modalConfig.type === 'VIEW' && (
                                        <div className="flex justify-end pt-4">
                                            <button onClick={() => setModalConfig({isOpen: false})} className="px-8 py-2.5 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-md">Đóng cửa sổ</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentManagement;
