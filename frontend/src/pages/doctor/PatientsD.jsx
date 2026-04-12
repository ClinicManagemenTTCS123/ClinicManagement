import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, Calendar as CalendarIcon, ClipboardList } from 'lucide-react';
import axios from 'axios';

export default function PatientsD() {
    // STATE
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // GỌI API LẤY DỮ LIỆU
    useEffect(() => {
        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const doctorId = localStorage.getItem("doctorId");
                if (!doctorId) return;

                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
                const res = await axios.get(`${apiUrl}/doctors/${doctorId}/patients`, {
                    params: { search: searchTerm }
                });

                setPatients(res.data);
                // Tự động chọn bệnh nhân đầu tiên nếu có danh sách
                if (res.data.length > 0 && !selectedPatient) {
                    setSelectedPatient(res.data[0]);
                } else if (res.data.length === 0) {
                    setSelectedPatient(null);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách bệnh nhân:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchPatients();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // HÀM HELPER TÌM LẦN KHÁM GẦN NHẤT
    const getLastVisitDate = (history) => {
        if (!history || history.length === 0) return "Chưa khám";
        // Sắp xếp giảm dần theo ngày tạo
        const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return new Date(sorted[0].createdAt).toLocaleDateString('vi-VN');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-[#F8FAFC]">
            {/* CSS Ẩn thanh cuộn xấu xí */}
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                `}
            </style>

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Bệnh nhân</h1>
                <p className="text-gray-500 text-[14px] mt-1">Tra cứu thông tin bệnh nhân đã đặt lịch khám</p>
            </div>

            <div className="flex gap-6 items-start h-full pb-6 overflow-hidden">
                {/* --- CỘT TRÁI: DANH SÁCH BỆNH NHÂN --- */}
                <div className="w-1/3 flex flex-col bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden h-full shrink-0">

                    {/* Tìm kiếm */}
                    <div className="p-4 border-b border-gray-50">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm theo tên hoặc SĐT..."
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-[12px] text-sm outline-none focus:bg-white focus:border-blue-200 transition-all"
                            />
                        </div>
                    </div>

                    {/* Danh sách cuộn */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {isLoading ? (
                            <div className="text-center text-sm text-gray-400 py-10">Đang tải dữ liệu...</div>
                        ) : patients.length > 0 ? (
                            patients.map((patient) => {
                                const isSelected = selectedPatient?.id === patient.id;
                                return (
                                    <div
                                        key={patient.id}
                                        onClick={() => setSelectedPatient(patient)}
                                        className={`p-4 rounded-[16px] border transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                : 'bg-white border-transparent hover:bg-gray-50'
                                        }`}
                                    >
                                        <h3 className={`text-[15px] font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                                            {patient.fullName}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-2 text-gray-500">
                                            <Phone size={13} />
                                            <span className="text-[13px] font-medium">{patient.phone}</span>
                                        </div>
                                        <p className="text-[12px] text-gray-400 mt-1 italic">
                                            Khám gần nhất: <span className="font-medium">{getLastVisitDate(patient.history)}</span>
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center text-sm text-gray-400 py-10">Không tìm thấy bệnh nhân.</div>
                        )}
                    </div>
                </div>

                {/* --- CỘT PHẢI: CHI TIẾT BỆNH NHÂN --- */}
                <div className="flex-1 h-full overflow-y-auto custom-scrollbar pr-2 space-y-6">
                    {selectedPatient ? (
                        <>
                            {/* Block 1: Thông tin cơ bản */}
                            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                                <h2 className="text-[18px] font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4">Thông tin bệnh nhân</h2>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                    <InfoItem label="Họ tên" value={selectedPatient.fullName} />
                                    <InfoItem label="Ngày sinh" value={selectedPatient.dateOfBirth} />
                                    <InfoItem label="Số điện thoại" value={selectedPatient.phone} icon={<Phone size={14}/>} />
                                    <InfoItem label="Email" value={selectedPatient.email} icon={<Mail size={14}/>} />
                                    <div className="col-span-2 pt-2 border-t border-gray-50">
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Thống kê</p>
                                        <span className="inline-flex px-4 py-1.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-[13px] border border-blue-100">
                                            Số lần khám: {selectedPatient.visitCount || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Block 2: Lịch sử khám bệnh Timeline */}
                            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100 animate-in fade-in zoom-in-95 duration-200 delay-75">
                                <h2 className="text-[18px] font-bold text-gray-800 mb-8 border-b border-gray-50 pb-4">Lịch sử khám bệnh</h2>

                                {selectedPatient.history && selectedPatient.history.length > 0 ? (
                                    <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                        {selectedPatient.history.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map((visit, idx) => (
                                            <div key={idx} className="relative">
                                                {/* Dấu chấm Timeline */}
                                                <div className="absolute -left-[35px] top-1.5 w-[16px] h-[16px] bg-white border-4 border-blue-500 rounded-full z-10 shadow-sm"></div>

                                                <div className="flex items-center gap-2 mb-1">
                                                    <CalendarIcon size={14} className="text-gray-400"/>
                                                    <p className="text-[12px] text-gray-500 font-bold tracking-tight">
                                                        {new Date(visit.createdAt).toLocaleDateString('vi-VN')}
                                                    </p>
                                                </div>

                                                <p className="text-[16px] font-bold text-gray-800 mt-1">{visit.diagnosis || 'Chưa có chẩn đoán'}</p>

                                                {visit.prescription && (
                                                    <div className="mt-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 text-[14px] text-gray-600 leading-relaxed">
                                                        <span className="font-bold text-gray-700 block mb-1">Đơn thuốc/Chỉ định:</span>
                                                        {visit.prescription}
                                                    </div>
                                                )}

                                                {visit.notes && (
                                                    <p className="mt-3 text-[13px] text-gray-500 italic flex gap-1.5">
                                                        <span className="font-semibold text-gray-600 not-italic">Ghi chú:</span> {visit.notes}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                        <ClipboardList size={40} className="mb-3 text-gray-300" />
                                        <p className="text-sm font-medium">Bệnh nhân chưa có lịch sử khám bệnh.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-medium bg-white/50">
                            Chọn một bệnh nhân để xem chi tiết
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Component phụ hiển thị Label/Value
const InfoItem = ({ label, value, icon }) => (
    <div>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2 mt-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            <p className="text-[14px] font-bold text-gray-800 leading-none">{value || '---'}</p>
        </div>
    </div>
);
