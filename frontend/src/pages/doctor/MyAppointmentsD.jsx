import React, { useEffect, useState, useRef } from 'react';
import {
    Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    MoreVertical, Stethoscope, X, Activity, ClipboardList, CheckCircle
} from 'lucide-react';
import axios from 'axios';

const XRAY_OPTIONS = [
    'Chụp X-Quang Panorama (Toàn cảnh)',
    'Chụp Conebeam CT 3D',
    'Chụp phim Cephalo',
    'Chụp phim quanh chóp'
];

const SERVICE_OPTIONS = [
    'Lấy cao răng & Đánh bóng',
    'Trám răng Composite',
    'Nhổ răng khôn (Tiểu phẫu)',
    'Điều trị tủy',
    'Bọc răng sứ Zirconia',
    'Cắm ghép Implant'
];

const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatFullDateVN = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const MyAppointmentsD = () => {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const todayStr = getTodayString();
    const [startDate, setStartDate] = useState(todayStr);
    const [endDate, setEndDate] = useState(todayStr);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewRecordData, setViewRecordData] = useState(null);
    const [isFetchingRecord, setIsFetchingRecord] = useState(false);

    const openViewModal = async (apt) => {
        setSelectedApt(apt);
        setOpenDropdownId(null);
        setViewRecordData(null);
        setIsViewModalOpen(true);
        setIsFetchingRecord(true);

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
            const res = await axios.get(`${apiUrl}/medical-records/by-appointment/${apt.id}`, {
                params: { _t: new Date().getTime() }
            });

            if (res.data && res.data.id) {
                setViewRecordData(res.data);
            } else {
                setViewRecordData({ notFound: true });
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu hồ sơ", error);
            setViewRecordData({ notFound: true });
        } finally {
            setIsFetchingRecord(false);
        }
    };

    const [examData, setExamData] = useState({
        symptoms: '',
        notes: '',
        toothDetails: '',
        indications: [],
        services: []
    });

    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const doctorId = localStorage.getItem("doctorId");
            if (!doctorId) return;

            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

            const res = await axios.get(`${apiUrl}/doctors/${doctorId}/appointments`, {
                params: {
                    search: searchTerm,
                    status: statusFilter,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    _t: new Date().getTime()
                }
            });

            setAppointments(res.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const updateAppointmentStatus = async (appointmentId, newStatus) => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
            await axios.put(`${apiUrl}/doctors/appointments/${appointmentId}/status`, null, {
                params: { status: newStatus }
            });
            fetchAppointments();
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Không thể cập nhật trạng thái lịch hẹn.");
        }
    };
    const handleConfirm = (aptId) => {
        setOpenDropdownId(null);
        if (window.confirm("Bạn muốn xác nhận lịch hẹn này?")) {
            updateAppointmentStatus(aptId, 'CONFIRMED');
        }
    };


    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchAppointments(); }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter, startDate, endDate]);

    const totalItems = appointments.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const currentItems = appointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    const openExamModal = async (apt) => {
        setSelectedApt(apt);
        setOpenDropdownId(null);
        setIsExamModalOpen(true);

        setExamData({ symptoms: apt.reason || '', notes: '', toothDetails: '', indications: [], services: [] });

        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
            const res = await axios.get(`${apiUrl}/medical-records/by-appointment/${apt.id}`, {
                params: { _t: new Date().getTime() } // Ngăn cache
            });

            if (res.data && res.data.id) {
                const savedIndications = res.data.indications ? res.data.indications.split(', ') : [];
                const savedServices = res.data.services ? res.data.services.split(', ') : [];

                setExamData({
                    symptoms: res.data.symptoms || apt.reason || '',
                    notes: res.data.notes || '',
                    toothDetails: res.data.toothDetails || '',
                    indications: savedIndications,
                    services: savedServices
                });
            }
        } catch (error) {
            console.error("Chưa có hồ sơ trước đó hoặc lỗi lấy dữ liệu", error);
        }
    };
    const submitExamRecord = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

            await axios.post(`${apiUrl}/medical-records/upsert-exam`, {
                appointmentId: selectedApt.id,
                symptoms: examData.symptoms,
                toothDetails: examData.toothDetails,
                indications: examData.indications.join(', '),
                services: examData.services.join(', ')
            });

            await updateAppointmentStatus(selectedApt.id, 'COMPLETED');

            alert("Đã lưu chỉ định & hồ sơ nha khoa thành công!");
            setIsExamModalOpen(false);
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert("Có lỗi xảy ra khi lưu dữ liệu.");
        }
    };

    const handleIndicationChange = (option, isChecked) => {
        setExamData(prev => {
            const current = prev.indications || [];
            if (isChecked) {
                if (!current.includes(option)) return { ...prev, indications: [...current, option] };
                return prev;
            } else {
                return { ...prev, indications: current.filter(item => item !== option) };
            }
        });
    };

    const handleServiceChange = (option, isChecked) => {
        setExamData(prev => {
            const current = prev.services || [];
            if (isChecked) {
                if (!current.includes(option)) return { ...prev, services: [...current, option] };
                return prev;
            } else {
                return { ...prev, services: current.filter(item => item !== option) };
            }
        });
    };

    const renderStatus = (status) => {
        const baseClass = "px-3 py-1 rounded-full text-[11px] font-bold tracking-wide";
        switch (status) {
            case 'CONFIRMED': return <span className={`${baseClass} bg-emerald-50 text-emerald-600`}>Đã xác nhận</span>;
            case 'PENDING': return <span className={`${baseClass} bg-orange-50 text-orange-600`}>Chờ xác nhận</span>;
            case 'CANCELED': return <span className={`${baseClass} bg-red-50 text-red-600`}>Đã hủy</span>;
            case 'COMPLETED': return <span className={`${baseClass} bg-blue-50 text-blue-600`}>Hoàn thành</span>;
            default: return <span className={`${baseClass} bg-gray-50 text-gray-600`}>{status}</span>;
        }
    };

    return (
        <div className="space-y-6 relative">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Lịch hẹn của tôi</h1>
                <p className="text-sm text-gray-500">Quản lý và tra cứu danh sách lịch hẹn khám bệnh</p>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Tìm tên bệnh nhân..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                        <span className="text-xs text-gray-500 font-medium">Từ:</span>
                        <input
                            type="date"
                            className="bg-transparent text-sm outline-none text-gray-700 cursor-pointer"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                        <span className="text-xs text-gray-500 font-medium">Đến:</span>
                        <input
                            type="date"
                            className="bg-transparent text-sm outline-none text-gray-700 cursor-pointer"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <select
                        className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 cursor-pointer shadow-sm min-w-[160px]"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="PENDING">Chờ xác nhận</option>
                        <option value="COMPLETED">Hoàn thành</option>
                        <option value="CANCELED">Đã hủy</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible">
                <div className="overflow-x-visible min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="text-gray-400 text-[12px] uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
                            <th className="px-8 py-5 font-bold">Bệnh nhân</th>
                            <th className="px-8 py-5 font-bold">Ngày khám</th>
                            <th className="px-8 py-5 font-bold">Giờ khám</th>
                            <th className="px-8 py-5 font-bold">Lý do</th>
                            <th className="px-8 py-5 font-bold">Trạng thái</th>
                            <th className="px-8 py-5 font-bold text-center">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50" ref={dropdownRef}>
                        {isLoading ? (
                            <tr><td colSpan="6" className="px-8 py-10 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((apt) => {
                                const timeString = apt.startTime ? new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A';
                                const isDropdownOpen = openDropdownId === apt.id;

                                return (
                                    <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-5 font-bold text-gray-700">{apt.patientName || 'Chưa rõ'}</td>
                                        <td className="px-8 py-5 text-gray-600 text-sm font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarIcon size={14} className="text-gray-400"/>
                                                {apt.startTime ?
                                                    new Date(apt.startTime).toLocaleString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })
                                                    : 'N/A'
                                                }
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-gray-600 text-sm font-medium">{timeString}</td>
                                        <td className="px-8 py-5 text-gray-600 text-sm truncate max-w-[200px]" title={apt.reason}>{apt.reason || 'Khám bệnh'}</td>
                                        <td className="px-8 py-5">{renderStatus(apt.status)}</td>
                                        <td className="px-8 py-5 text-center relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Tránh giựt/xung đột sự kiện
                                                    setOpenDropdownId(isDropdownOpen ? null : apt.id);
                                                }}
                                                className="p-2 bg-gray-50 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={16} />
                                            </button>

                                            {isDropdownOpen && (
                                                <div className="absolute right-8 top-12 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-2xl z-[999] py-1">
                                                    {apt.status === 'PENDING' && (
                                                        <button
                                                            onClick={() => handleConfirm(apt.id)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-emerald-600 font-semibold hover:bg-emerald-50 flex items-center gap-2 border-b border-gray-50"
                                                        >
                                                            <CheckCircle size={15} /> Xác nhận lịch
                                                        </button>
                                                    )}

                                                    {apt.status === 'CONFIRMED' && (
                                                        <button
                                                            onClick={() => openExamModal(apt)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-blue-600 font-semibold hover:bg-blue-50 flex items-center gap-2"
                                                        >
                                                            <Stethoscope size={15} /> Khám bệnh
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => openViewModal(apt)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2"
                                                    >
                                                        <ClipboardList size={15} /> Xem hồ sơ
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="6" className="px-8 py-10 text-center text-gray-400 italic">Không tìm thấy lịch hẹn nào.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-8 py-5 bg-white border-t border-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Hiển thị <span className="text-gray-600 font-medium">{currentItems.length}</span> trên <span className="text-gray-600 font-medium">{totalItems}</span> lịch hẹn
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 transition-all"><ChevronLeft size={18} /></button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button key={index + 1} onClick={() => paginate(index + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === index + 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-gray-500 hover:bg-gray-100'}`}>{index + 1}</button>
                            ))}
                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 transition-all"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                )}
            </div>

            {isExamModalOpen && selectedApt && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Stethoscope className="text-blue-500" /> Bắt đầu khám bệnh
                            </h2>
                            <button onClick={() => setIsExamModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">

                            <div className="bg-white p-5 rounded-2xl border border-blue-50 shadow-sm flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {selectedApt.patientName?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800">{selectedApt.patientName}</h3>
                                    <div className="flex gap-6 mt-1 text-sm text-slate-500">
                                        <p><span className="font-medium text-slate-400">Mã LH:</span> {selectedApt.id}</p>
                                        <span className="font-medium text-slate-400">Ngày khám:</span> {formatFullDateVN(selectedApt.startTime)}
                                    </div>
                                    <p className="mt-3 text-sm text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-lg font-medium border border-amber-100">
                                        Lý do: {selectedApt.reason || 'Bệnh nhân không ghi chú lý do'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Triệu chứng / Lý do khám</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
                                        rows="2"
                                        placeholder="VD: Đau nhức khi nhai, ê buốt khi uống lạnh..."
                                        value={examData.symptoms}
                                        onChange={(e) => setExamData({...examData, symptoms: e.target.value})}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Vị trí răng (Mã răng)</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
                                        placeholder="VD: Răng 46, Răng 38..."
                                        value={examData.toothDetails}
                                        onChange={(e) => setExamData({...examData, toothDetails: e.target.value})}
                                    />
                                    <p className="text-[11px] text-gray-400 mt-2 italic">Ghi chú chính xác mã răng.</p>
                                </div>
                            </div>

                            <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-gray-50 pb-3">
                                    <Activity size={18} className="text-sky-500" /> Chỉ định Cận lâm sàng (Chụp phim)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                    {XRAY_OPTIONS.map((option, idx) => {
                                        const isChecked = (examData.indications || []).includes(option);
                                        return (
                                            <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-sky-50 border-sky-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-sky-500 rounded border-gray-300 focus:ring-sky-500 cursor-pointer"
                                                    checked={isChecked}
                                                    onChange={(e) => handleIndicationChange(option, e.target.checked)}
                                                />
                                                <span className={`text-sm ${isChecked ? 'font-bold text-sky-700' : 'font-medium text-gray-700'}`}>{option}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-gray-50 pb-3">
                                    <Stethoscope size={18} className="text-emerald-500" /> Chỉ định Dịch vụ Điều trị (Thủ thuật)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                    {SERVICE_OPTIONS.map((option, idx) => {
                                        const isChecked = (examData.services || []).includes(option);
                                        return (
                                            <label key={idx} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}>
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer"
                                                    checked={isChecked}
                                                    onChange={(e) => handleServiceChange(option, e.target.checked)}
                                                />
                                                <span className={`text-sm ${isChecked ? 'font-bold text-emerald-700' : 'font-medium text-gray-700'}`}>{option}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3">
                            <button onClick={() => setIsExamModalOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">
                                Hủy bỏ
                            </button>
                            <button onClick={submitExamRecord} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                                <ClipboardList size={16}/> Lưu chỉ định & Hồ sơ
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* MODAL XEM HỒ SƠ */}
            {isViewModalOpen && selectedApt && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <ClipboardList className="text-blue-500" />
                                Chi tiết hồ sơ bệnh án
                            </h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">
                            <div className="bg-white p-5 rounded-2xl border border-blue-50 shadow-sm flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    {selectedApt.patientName?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800">{selectedApt.patientName}</h3>
                                    <div className="flex gap-6 mt-1 text-sm text-slate-500">
                                        <p><span className="font-medium text-slate-400">Mã LH:</span> {selectedApt.id}</p>
                                        <span className="font-medium text-slate-400">Ngày khám:</span> {formatFullDateVN(selectedApt.startTime)}
                                    </div>
                                </div>
                            </div>

                            {isFetchingRecord ? (
                                <div className="text-center py-10 text-blue-500 font-medium">Đang tải hồ sơ...</div>
                            ) : viewRecordData?.notFound ? (
                                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <p className="text-gray-500 font-medium">Chưa có hồ sơ bệnh án cho lịch hẹn này.</p>
                                    <p className="text-sm text-gray-400 mt-1">Vui lòng chọn tính năng "Khám bệnh" để tạo hồ sơ mới.</p>
                                </div>
                            ) : (
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Triệu chứng / Lý do khám</label>
                                            <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{viewRecordData?.symptoms || 'Không có ghi nhận'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Vị trí Răng</label>
                                            <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{viewRecordData?.toothDetails || 'Không có'}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Chẩn đoán</label>
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm font-semibold text-blue-700">{viewRecordData?.diagnosis || 'Chưa chẩn đoán'}</div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Chỉ định chụp phim</label>
                                            <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{viewRecordData?.indications || 'Không có'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Dịch vụ điều trị</label>
                                            <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{viewRecordData?.services || 'Không có'}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Đơn thuốc</label>
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">{viewRecordData?.prescription || 'Không có đơn thuốc'}</div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Ghi chú bác sĩ</label>
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700 italic">{viewRecordData?.notes || 'Không có ghi chú'}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-gray-100 text-slate-600 font-semibold hover:bg-gray-200 transition-colors">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsD;
