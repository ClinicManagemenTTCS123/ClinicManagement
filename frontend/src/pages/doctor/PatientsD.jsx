import React, { useState } from 'react';
import { Search, Phone, CalendarDays, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

// --- 1. MOCK DATA (Dữ liệu mẫu) ---
const mockPatients = [
    {
        id: 1, name: "Trần Văn Hùng", phone: "0901234567", lastVisit: "2026-03-10",
        dob: "1985-06-12", email: "hung.tran@email.com", visitCount: 5,
        history: [
            { date: "2026-03-10", diagnosis: "Viêm họng cấp", prescription: "Amoxicillin 500mg x 3 lần/ngày" },
            { date: "2026-02-15", diagnosis: "Cảm cúm", prescription: "Paracetamol 500mg, Vitamin C" },
            { date: "2026-01-20", diagnosis: "Đau dạ dày", prescription: "Omeprazole 20ms x 2 lần/ngày" },
        ]
    },
    // Tạo thêm dữ liệu giả để hiện thanh cuộn
    ...Array.from({ length: 12 }, (_, i) => ({
        id: i + 2, name: `Bệnh nhân ${i + 2}`, phone: `09345678${i}`, lastVisit: "2026-03-12",
        dob: "1995-01-01", email: "test@email.com", visitCount: 1,
        history: [{ date: "2026-03-12", diagnosis: "Kiểm tra sức khỏe định kỳ", prescription: "Không có" }]
    }))
];

export default function PatientsD() {
    const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = mockPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
    );

    return (
        <div className="flex flex-col h-full bg-[#F8FAFC]">
            {/* CHÚ THÍCH: ĐOẠN NÀY LÀ CSS CHO THANH CUỘN NẰM TRONG FILE JSX LUÔN */}
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
                `}
            </style>

            <main className="flex-1 p-2">
                <div className="mb-8">
                    <h1 className="text-[32px] font-bold text-gray-950 tracking-tight">Bệnh nhân</h1>
                    <p className="text-gray-500 text-[15px] mt-1">Tra cứu thông tin bệnh nhân đã đặt lịch khám</p>
                </div>

                <div className="flex gap-6 items-start h-[calc(100vh-200px)]">

                    {/* --- CỘT TRÁI: DANH SÁCH CÓ THANH CUỘN --- */}
                    <div className="w-1/3 flex flex-col bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden h-full">

                        {/* Tìm kiếm cố định ở trên */}
                        <div className="p-4 border-b border-gray-50">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Tìm theo tên hoặc số điện thoại..."
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-[14px] text-[14px] outline-none focus:ring-1 focus:ring-blue-200"
                                />
                            </div>
                        </div>

                        {/* VÙNG CUỘN DANH SÁCH BỆNH NHÂN */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                            {filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => setSelectedPatient(patient)}
                                    className={`p-4 rounded-[18px] border transition-all cursor-pointer ${
                                        selectedPatient?.id === patient.id
                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                            : 'border-transparent hover:bg-gray-50'
                                    }`}
                                >
                                    <h3 className={`text-[15px] font-bold ${selectedPatient?.id === patient.id ? 'text-blue-700' : 'text-gray-950'}`}>
                                        {patient.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2 text-gray-500">
                                        <Phone size={13} />
                                        <span className="text-[13px] font-medium">{patient.phone}</span>
                                    </div>
                                    <p className="text-[12px] text-gray-400 mt-1 italic">Khám gần nhất: {patient.lastVisit}</p>
                                </div>
                            ))}
                        </div>


                    </div>

                    {/* --- CỘT PHẢI: CHI TIẾT BỆNH NHÂN (CŨNG CÓ THANH CUỘN NẾU QUÁ DÀI) --- */}
                    <div className="flex-1 h-full overflow-y-auto custom-scrollbar pr-2 space-y-6">
                        {selectedPatient ? (
                            <>
                                {/* Block: Thông tin cơ bản */}
                                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
                                    <h2 className="text-[19px] font-bold text-gray-950 mb-6">Thông tin bệnh nhân</h2>
                                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                        <InfoItem label="Họ tên" value={selectedPatient.name} />
                                        <InfoItem label="Ngày sinh" value={selectedPatient.dob} />
                                        <InfoItem label="Số điện thoại" value={selectedPatient.phone} icon={<Phone size={14}/>} />
                                        <InfoItem label="Email" value={selectedPatient.email} icon={<Mail size={14}/>} />
                                        <div>
                                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">Số lần khám</p>
                                            <span className="inline-flex px-3 py-1 mt-2 rounded-lg bg-blue-50 text-blue-600 font-bold text-[13px] border border-blue-100">
                                                {selectedPatient.visitCount} lần
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Block: Lịch sử (Timeline) */}
                                <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
                                    <h2 className="text-[19px] font-bold text-gray-950 mb-8">Lịch sử khám bệnh</h2>
                                    <div className="relative pl-8 space-y-10 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                                        {selectedPatient.history?.map((visit, idx) => (
                                            <div key={idx} className="relative">
                                                {/* Dấu chấm Timeline */}
                                                <div className="absolute -left-[35px] top-1.5 w-[16px] h-[16px] bg-white border-4 border-blue-500 rounded-full z-10 shadow-sm shadow-blue-100"></div>

                                                <p className="text-[12px] text-gray-400 font-bold tracking-tight">{visit.date}</p>
                                                <p className="text-[17px] font-bold text-gray-900 mt-1">{visit.diagnosis}</p>
                                                <div className="mt-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 text-[14px] text-gray-600 leading-relaxed">
                                                    <span className="font-bold text-gray-800">Đơn thuốc:</span> {visit.prescription}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-medium bg-white/50">
                                Chọn một bệnh nhân từ danh sách để xem hồ sơ
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Component phụ cho hiển thị mục thông tin
const InfoItem = ({ label, value, icon }) => (
    <div>
        <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2 mt-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            <p className="text-[15px] font-bold text-gray-950 leading-none">{value || '---'}</p>
        </div>
    </div>
);