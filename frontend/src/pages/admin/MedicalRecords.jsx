import React, { useState, useMemo } from 'react';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Stethoscope, FileText, User } from 'lucide-react';

const MedicalRecordManagement = () => {
    // =========================================================================
    // PHẦN LOGIC (Dữ liệu mẫu, Lọc & Phân trang)
    // =========================================================================

    // Giả lập 25 hồ sơ bệnh án
    const [records] = useState(Array.from({ length: 25 }, (_, i) => ({
        id: `HS-${1024 + i}`,
        patientName: i % 2 === 0 ? 'Nguyễn Thị Hoa' : 'Trần Văn Bảo',
        doctorName: i % 3 === 0 ? 'BS. Nguyễn Văn An' : 'BS. Trần Thị Bình',
        date: `2026-03-${String(10 + (i % 5)).padStart(2, '0')}`,
        diagnosis: i % 4 === 0 ? 'Viêm họng cấp' : 'Thoái hóa cột sống',
        treatment: i % 4 === 0 ? 'Kháng sinh, giảm đau' : 'Vật lý trị liệu'
    })));

    const [searchTerm, setSearchTerm] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Logic tìm kiếm thông minh (Mã hồ sơ hoặc Tên bệnh nhân)
    const filteredRecords = useMemo(() => {
        return records.filter(rec => {
            const matchSearch = rec.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rec.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDoctor = filterDoctor === 'All' || rec.doctorName === filterDoctor;
            return matchSearch && matchDoctor;
        });
    }, [searchTerm, filterDoctor, records]);

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const currentItems = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467]">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Header & Smart Filter */}
                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-blue-600" /> Hồ sơ bệnh án
                        </h2>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all">
                                <Stethoscope size={18} /> Lập hồ sơ mới
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm mã hồ sơ, tên bệnh nhân..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => {setFilterDoctor(e.target.value); setCurrentPage(1);}}
                            >
                                <option value="All">Tất cả bác sĩ</option>
                                <option value="BS. Nguyễn Văn An">BS. Nguyễn Văn An</option>
                                <option value="BS. Trần Thị Bình">BS. Trần Thị Bình</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[14px] border-b border-gray-50">
                            <th className="py-4 px-6 font-medium uppercase">Mã HS</th>
                            <th className="py-4 px-6 font-medium uppercase">Bệnh nhân</th>
                            <th className="py-4 px-6 font-medium uppercase">Bác sĩ</th>
                            <th className="py-4 px-6 font-medium uppercase">Ngày khám</th>
                            <th className="py-4 px-6 font-medium uppercase">Chẩn đoán</th>
                            <th className="py-4 px-6 text-center font-medium uppercase">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {currentItems.map((rec) => (
                            <tr key={rec.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-5 px-6 font-semibold text-gray-400">{rec.id}</td>
                                <td className="py-5 px-6 font-normal text-gray-900">{rec.patientName}</td>
                                <td className="py-5 px-6 text-gray-500">{rec.doctorName}</td>
                                <td className="py-5 px-6 text-gray-500">{rec.date}</td>
                                <td className="py-5 px-6">
                                    <div className="max-w-[200px] truncate text-gray-700 font-medium" title={rec.diagnosis}>
                                        {rec.diagnosis}
                                    </div>
                                </td>
                                <td className="py-5 px-6">
                                    <div className="flex justify-center items-center gap-2">
                                        {/* Thao tác đồng bộ: Xem, Sửa, Xóa */}
                                        <button title="Xem hồ sơ" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                                            <Eye size={18} />
                                        </button>
                                        <button title="Chỉnh sửa" className="p-2 text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all">
                                            <Edit size={18} />
                                        </button>
                                        <button title="Xóa" className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Section */}
                <div className="p-8 flex items-center justify-between border-t border-gray-50">
                    <p className="text-sm text-gray-400 font-medium">
                        Hiển thị {currentItems.length} trên {filteredRecords.length} hồ sơ
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl disabled:opacity-20"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                                    currentPage === i + 1
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                        : 'text-gray-400 hover:bg-gray-50'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl disabled:opacity-20"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordManagement;