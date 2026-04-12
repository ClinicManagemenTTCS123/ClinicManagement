import React, { useEffect, useState } from 'react';
import {
    Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    Eye, Edit, X, Save, FileText, Pill, Stethoscope, User
} from 'lucide-react';
import axios from 'axios';

const MedicalRecordD = () => {
    // ==========================================
    // 1. STATE DỮ LIỆU & BỘ LỌC
    // ==========================================
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // ==========================================
    // 2. STATE MODAL XEM/SỬA HỒ SƠ
    // ==========================================
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [formData, setFormData] = useState({
        symptoms: '',
        diagnosis: '',
        prescription: '',
        notes: ''
    });

    // ==========================================
    // 3. API FETCH (Lấy danh sách hồ sơ)
    // ==========================================
    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const doctorId = localStorage.getItem("doctorId");
            if (!doctorId) return;

            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

            // Yêu cầu Backend cần có API: GET /api/doctors/{doctorId}/medical-records
            const res = await axios.get(`${apiUrl}/doctors/${doctorId}/medical-records`, {
                params: {
                    search: searchTerm,
                    startDate: startDate || null,
                    endDate: endDate || null
                }
            });

            setRecords(res.data);
            setCurrentPage(1);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu hồ sơ:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => { fetchRecords(); }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, startDate, endDate]);

    // ==========================================
    // 4. LOGIC PHÂN TRANG
    // ==========================================
    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const currentItems = records.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) setCurrentPage(pageNumber);
    };

    // ==========================================
    // 5. HÀM XỬ LÝ SỰ KIỆN MODAL
    // ==========================================
    const handleViewRecord = (record) => {
        setSelectedRecord(record);
        setFormData({
            symptoms: record.symptoms || '',
            diagnosis: record.diagnosis || '',
            prescription: record.prescription || '',
            notes: record.notes || ''
        });
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    const handleEditRecord = (record) => {
        setSelectedRecord(record);
        setFormData({
            symptoms: record.symptoms || '',
            diagnosis: record.diagnosis || '',
            prescription: record.prescription || '',
            notes: record.notes || ''
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const handleSaveRecord = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
            // Yêu cầu Backend cần có API: PUT /api/medical-records/{id}
            await axios.put(`${apiUrl}/medical-records/${selectedRecord.id}`, formData);

            alert("Đã cập nhật hồ sơ bệnh án thành công!");
            setIsModalOpen(false);
            fetchRecords(); // Tải lại danh sách
        } catch (error) {
            console.error("Lỗi cập nhật hồ sơ:", error);
            alert("Có lỗi xảy ra khi lưu hồ sơ.");
        }
    };

    return (
        <div className="space-y-6 relative">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Hồ sơ bệnh án</h1>
                <p className="text-sm text-gray-500">Tra cứu và cập nhật hồ sơ bệnh án của bệnh nhân</p>
            </div>

            {/* THANH CÔNG CỤ & BỘ LỌC */}
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
                </div>
            </div>

            {/* BẢNG DANH SÁCH HỒ SƠ */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="text-gray-400 text-[12px] uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
                            <th className="px-8 py-5 font-bold">Mã HS</th>
                            <th className="px-8 py-5 font-bold">Bệnh nhân</th>
                            <th className="px-8 py-5 font-bold">Ngày lập</th>
                            <th className="px-8 py-5 font-bold">Chẩn đoán</th>
                            <th className="px-8 py-5 font-bold text-center">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan="5" className="px-8 py-10 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((record) => {
                                const dateString = record.createdAt ? new Date(record.createdAt).toLocaleDateString('vi-VN') : 'N/A';

                                return (
                                    <tr key={record.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-5 font-bold text-gray-500">#{record.id}</td>
                                        <td className="px-8 py-5 font-bold text-gray-700">{record.patientName}</td>
                                        <td className="px-8 py-5 text-gray-600 text-sm font-medium">
                                            <div className="flex items-center gap-1.5"><CalendarIcon size={14} className="text-gray-400"/> {dateString}</div>
                                        </td>
                                        <td className="px-8 py-5 text-gray-600 text-sm truncate max-w-[250px]" title={record.diagnosis}>{record.diagnosis || 'Chưa chẩn đoán'}</td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewRecord(record)}
                                                    className="p-2 bg-gray-50 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditRecord(record)}
                                                    className="p-2 bg-gray-50 text-gray-500 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                                                    title="Sửa hồ sơ"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="5" className="px-8 py-10 text-center text-gray-400 italic">Không tìm thấy hồ sơ bệnh án nào.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* PHÂN TRANG */}
                {totalPages > 1 && (
                    <div className="px-8 py-5 bg-white border-t border-gray-50 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Hiển thị <span className="text-gray-600 font-medium">{currentItems.length}</span> trên <span className="text-gray-600 font-medium">{totalItems}</span> hồ sơ
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

            {/* ==================================================== */}
            {/* MODAL XEM / SỬA HỒ SƠ */}
            {/* ==================================================== */}
            {isModalOpen && selectedRecord && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">

                        {/* Modal Header */}
                        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="text-blue-500" />
                                {isEditMode ? 'Cập nhật hồ sơ bệnh án' : 'Chi tiết hồ sơ bệnh án'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50 space-y-6">

                            {/* Thông tin bệnh nhân cố định */}
                            <div className="bg-white p-5 rounded-2xl border border-blue-50 shadow-sm flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                    <User size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-800">{selectedRecord.patientName}</h3>
                                    <div className="flex gap-6 mt-1 text-sm text-slate-500">
                                        <p><span className="font-medium text-slate-400">Mã HS:</span> #{selectedRecord.id}</p>
                                        <p><span className="font-medium text-slate-400">Ngày lập:</span> {new Date(selectedRecord.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                                {/* Triệu chứng */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Triệu chứng lâm sàng</label>
                                    {isEditMode ? (
                                        <textarea
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
                                            rows="2"
                                            value={formData.symptoms}
                                            onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">{formData.symptoms || 'Không có ghi nhận'}</div>
                                    )}
                                </div>

                                {/* Chẩn đoán */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Chẩn đoán</label>
                                    {isEditMode ? (
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
                                            value={formData.diagnosis}
                                            onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm font-semibold text-blue-700">{formData.diagnosis || 'Chưa chẩn đoán'}</div>
                                    )}
                                </div>

                                {/* Đơn thuốc */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Pill size={16} className="text-emerald-500"/> Đơn thuốc</label>
                                    {isEditMode ? (
                                        <textarea
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
                                            rows="3"
                                            value={formData.prescription}
                                            onChange={(e) => setFormData({...formData, prescription: e.target.value})}
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">{formData.prescription || 'Không có đơn thuốc'}</div>
                                    )}
                                </div>

                                {/* Ghi chú */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Stethoscope size={16} className="text-amber-500"/> Ghi chú của bác sĩ</label>
                                    {isEditMode ? (
                                        <textarea
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
                                            rows="2"
                                            value={formData.notes}
                                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        />
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700 italic">{formData.notes || 'Không có ghi chú'}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition-colors">
                                Đóng
                            </button>
                            {isEditMode && (
                                <button onClick={handleSaveRecord} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                                    <Save size={16}/> Lưu thay đổi
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalRecordD;
