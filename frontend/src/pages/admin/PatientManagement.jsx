import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Calendar, Users, Building2 } from 'lucide-react';

const MedicalManagement = () => {
    // =========================================================================
    // PHẦN LOGIC BACKEND (Dữ liệu & Bộ lọc)
    // =========================================================================

    const [view, setView] = useState('patient'); // 'patient' hoặc 'department'

    // Dữ liệu mẫu Bệnh nhân
    const initialPatients = Array.from({ length: 22 }, (_, i) => ({
        id: `BN${String(i + 1).padStart(3, '0')}`,
        name: i % 2 === 0 ? `Nguyễn Văn Nam ${i + 1}` : `Lê Thị Thảo ${i + 1}`,
        gender: i % 2 === 0 ? 'Nam' : 'Nữ',
        dob: `199${i % 9}-12-01`,
        phone: `09876543${i}`,
        dept: i % 3 === 0 ? 'Khoa Nội' : 'Khoa Ngoại'
    }));

    // State cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('All');
    const [filterDept, setFilterDept] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Logic lọc thông minh
    const filteredData = useMemo(() => {
        return initialPatients.filter(p => {
            const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.phone.includes(searchTerm);
            const matchGender = filterGender === 'All' || p.gender === filterGender;
            const matchDept = filterDept === 'All' || p.dept === filterDept;
            return matchSearch && matchGender && matchDept;
        });
    }, [searchTerm, filterGender, filterDept]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



    // =========================================================================
    // PHẦN FRONTEND (UI Đồng nhất & Nút thao tác mới)
    // =========================================================================

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467]">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">


            {/* Header & Bộ lọc nâng cao */}
                <div className="p-2 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800">  Danh sách bệnh nhân</h2>
                        <button className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all">
                            <Plus size={18} /> Thêm bệnh nhân
                        </button>
                    </div>

                    {/* Thanh công cụ tìm kiếm & Filter Dropdowns */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm tên, số điện thoại, mã bệnh nhân..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        {/* Filter Khoa/Phòng */}
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => setFilterDept(e.target.value)}
                            >
                                <option value="All">Tất cả khoa</option>
                                <option value="Khoa Nội">Khoa Nội</option>
                                <option value="Khoa Ngoại">Khoa Ngoại</option>
                            </select>
                        </div>

                        {/* Filter Giới tính */}
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => setFilterGender(e.target.value)}
                            >
                                <option value="All">Giới tính</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        </div>

                        {/* Filter Ngày sinh (Khoảng thời gian) */}
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="date"
                                className="pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-blue-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[14px] border-b border-gray-50">
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Mã BN</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Họ tên</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Giới tính</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Ngày sinh</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">SĐT</th>
                            <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {currentItems.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-5 px-6 font-semibold text-gray-400">{p.id}</td>
                                <td className="py-5 px-6 font-normal text-gray-900">{p.name}</td>
                                <td className="py-5 px-6">{p.gender}</td>
                                <td className="py-5 px-6">{p.dob}</td>
                                <td className="py-5 px-6">{p.phone}</td>
                                <td className="py-5 px-6">
                                    {/* NÚT THAO TÁC CÓ NỀN MÀU (GIỐNG ẢNH MẪU) */}
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
                        Hiển thị {currentItems.length} trên {filteredData.length} bệnh nhân
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
                                    currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-400 hover:bg-gray-50'
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

export default MedicalManagement;