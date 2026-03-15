import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, ChevronDown, ChevronLeft, ChevronRight, Building2, Stethoscope } from 'lucide-react';

const DoctorManagement = () => {
    // =========================================================================
    // PHẦN LOGIC (Dữ liệu, Bộ lọc & Phân trang)
    // =========================================================================
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Giả lập dữ liệu 25 bác sĩ để test phân trang
    const [doctors] = useState(Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: i % 2 === 0 ? `Nguyễn Văn An ${i + 1}` : `Trần Thị Bình ${i + 1}`,
        email: `doctor${i + 1}@clinic.vn`,
        phone: `09012345${i.toString().padStart(2, '0')}`,
        dept: i % 3 === 0 ? 'Nội khoa' : i % 3 === 1 ? 'Ngoại khoa' : 'Nhi khoa',
        specialty: i % 3 === 0 ? 'Tim mạch' : i % 3 === 1 ? 'Chấn thương' : 'Nhi tổng quát'
    })));

    // States cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Logic lọc thông minh
    const filteredDoctors = useMemo(() => {
        return doctors.filter(doc => {
            const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.phone.includes(searchTerm) ||
                doc.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchDept = filterDept === 'All' || doc.dept === filterDept;
            return matchSearch && matchDept;
        });
    }, [searchTerm, filterDept, doctors]);

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
    const currentItems = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // =========================================================================
    // PHẦN FRONTEND (UI Đồng bộ hoàn toàn)
    // =========================================================================
    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467]">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Header & Smart Filter */}
                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800">Danh sách bác sĩ</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all shadow-md shadow-blue-100"
                        >
                            <Plus size={18} /> Thêm bác sĩ
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm tên, email, số điện thoại..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        {/* Filter Khoa */}
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => {setFilterDept(e.target.value); setCurrentPage(1);}}
                            >
                                <option value="All">Tất cả khoa</option>
                                <option value="Nội khoa">Nội khoa</option>
                                <option value="Ngoại khoa">Ngoại khoa</option>
                                <option value="Nhi khoa">Nhi khoa</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[14px] border-b border-gray-50">
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Họ tên</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Email</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Số điện thoại</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Khoa</th>
                            <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {currentItems.map((doc) => (
                            <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-5 px-6 font-normal text-gray-900">{doc.name}</td>
                                <td className="py-5 px-6 text-gray-500">{doc.email}</td>
                                <td className="py-5 px-6 text-gray-500">{doc.phone}</td>
                                <td className="py-5 px-6">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                                            {doc.dept}
                                        </span>
                                </td>
                                <td className="py-5 px-6">
                                    <div className="flex justify-center items-center gap-3">
                                        <button title="Xem" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                                            <Eye size={18} />
                                        </button>
                                        <button title="Sửa" className="p-2 text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all">
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
                        Hiển thị {currentItems.length} trên {filteredDoctors.length} bác sĩ
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl disabled:opacity-20 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => handlePageChange(i + 1)}
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
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl disabled:opacity-20 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL THÊM BÁC SĨ (Giữ nguyên cấu trúc nhưng đồng bộ Style) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-[500px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Thêm bác sĩ mới</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form className="p-8 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Họ tên</label>
                                <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all text-sm" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                    <input type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại</label>
                                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Khoa</label>
                                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-sm">
                                    <option>Chọn khoa</option>
                                    <option>Nội khoa</option>
                                    <option>Ngoại khoa</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-all">Hủy</button>
                                <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">Lưu thông tin</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorManagement;