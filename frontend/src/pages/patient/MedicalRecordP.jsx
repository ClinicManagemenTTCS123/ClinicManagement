import React, { useState } from 'react';
import {
    FileText,
    ChevronDown,
    ChevronUp,
    Pill,
    Stethoscope,
    Calendar,
    ClipboardList,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

// Mock data mở rộng để demo phân trang
const MEDICAL_HISTORY = [
    { id: 1, diagnosis: "Viêm da tiếp xúc dị ứng", doctor: "BS. Phạm Thị Hoa", specialty: "Da liễu", date: "28/02/2025", prescription: ["Cetirizine 10mg - 1 viên/ngày", "Kem Hydrocortisone 1% - Bôi 2 lần/ngày"], doctorNotes: "Tránh tiếp xúc với xà phòng có hương liệu." },
    { id: 2, diagnosis: "Viêm họng cấp, sốt nhẹ", doctor: "BS. Nguyễn Thị Lan", specialty: "Nội khoa", date: "15/01/2025", prescription: ["Amoxicillin 500mg - 2 viên/ngày", "Paracetamol 500mg - Uống khi sốt"], doctorNotes: "Súc miệng nước muối thường xuyên." },
    { id: 3, diagnosis: "Huyết áp cao độ 1", doctor: "BS. Trần Văn Minh", specialty: "Tim mạch", date: "05/12/2024", prescription: ["Amlodipine 5mg - 1 viên/sáng"], doctorNotes: "Hạn chế ăn mặn, tập thể dục nhẹ nhàng." },
    { id: 4, diagnosis: "Đau dạ dày cấp", doctor: "BS. Lê Quang Hùng", specialty: "Tiêu hóa", date: "20/11/2024", prescription: ["Phosphalugel - 1 gói x 3 lần/ngày", "Esomeprazole 40mg - 1 viên/sáng"], doctorNotes: "Ăn đúng giờ, tránh đồ chua cay, bia rượu." },
    { id: 5, diagnosis: "Rối loạn tiền đình", doctor: "BS. Võ Thị Mai", specialty: "Thần kinh", date: "10/10/2024", prescription: ["Betaserc 24mg - 2 viên/ngày"], doctorNotes: "Nghỉ ngơi hợp lý, tránh thay đổi tư thế đột ngột." },
    { id: 6, diagnosis: "Viêm xoang mãn tính", doctor: "BS. Hoàng Đức Nam", specialty: "Tai Mũi Họng", date: "02/09/2024", prescription: ["Xịt mũi Sterimar", "Telfast 180mg - 1 viên/ngày"], doctorNotes: "Vệ sinh mũi hàng ngày, đeo khẩu trang khi ra ngoài." }
];

export default function MedicalRecordP() {
    const [expandedId, setExpandedId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Hiển thị 3 bản ghi mỗi trang

    // --- Logic Phân Trang ---
    const totalPages = Math.ceil(MEDICAL_HISTORY.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = MEDICAL_HISTORY.slice(indexOfFirstItem, indexOfLastItem);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setExpandedId(null); // Đóng các mục đang mở khi chuyển trang
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Hồ sơ bệnh án</h1>
                <p className="text-slate-500 mt-1">Lịch sử khám bệnh và đơn thuốc của bạn</p>
            </div>

            {/* List of Records */}
            <div className="space-y-4">
                {currentItems.length > 0 ? (
                    currentItems.map((record) => {
                        const isExpanded = expandedId === record.id;
                        return (
                            <div key={record.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">
                                {/* Record Header */}
                                <div
                                    onClick={() => toggleExpand(record.id)}
                                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isExpanded ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'}`}>
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{record.diagnosis}</h3>
                                            <p className="text-sm text-slate-500">{record.doctor} • {record.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-sm">
                                            <Calendar size={16} />
                                            <span>{record.date}</span>
                                        </div>
                                        {isExpanded ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-5 pb-6 animate-in slide-in-from-top-2 duration-300">
                                        <div className="pt-4 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-sky-500 font-bold text-sm uppercase tracking-wider">
                                                    <Pill size={18} /> <span>Đơn thuốc</span>
                                                </div>
                                                <div className="space-y-3">
                                                    {record.prescription.map((pill, index) => (
                                                        <div key={index} className="flex items-start gap-3">
                                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-50 text-sky-600 text-xs font-bold flex items-center justify-center border border-sky-100">{index + 1}</span>
                                                            <p className="text-slate-700 text-sm mt-0.5">{pill}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2 text-blue-500 font-bold text-sm uppercase tracking-wider">
                                                    <Stethoscope size={18} /> <span>Ghi chú bác sĩ</span>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                    <p className="text-slate-600 text-sm leading-relaxed">{record.doctorNotes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <ClipboardList className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="text-slate-500 font-medium">Không tìm thấy hồ sơ nào.</p>
                    </div>
                )}
            </div>

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 pb-10">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${
                            currentPage === 1 ? "text-slate-300 border-gray-100" : "text-slate-600 border-gray-200 hover:bg-white hover:border-blue-400"
                        }`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                                currentPage === index + 1
                                    ? "bg-blue-500 text-white shadow-md shadow-blue-100"
                                    : "text-slate-500 border border-transparent hover:border-gray-200 hover:bg-white"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${
                            currentPage === totalPages ? "text-slate-300 border-gray-100" : "text-slate-600 border-gray-200 hover:bg-white hover:border-blue-400"
                        }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}