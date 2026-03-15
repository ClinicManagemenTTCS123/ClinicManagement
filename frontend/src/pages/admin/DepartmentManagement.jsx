import React, { useState, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, UserCheck, Activity } from 'lucide-react';

const DepartmentManagement = () => {
    // =========================================================================
    // PHẦN LOGIC BACKEND (Dữ liệu & Xử lý bộ lọc)
    // =========================================================================

    const allDepartments = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: i === 0 ? 'Khoa Nội' : i === 1 ? 'Khoa Ngoại' : `Chuyên khoa ${i + 1}`,
        head: i % 2 === 0 ? 'BS. Nguyễn Văn An' : 'BS. Lê Thị Thảo',
        room: `Phòng ${100 + i}`,
        status: i % 4 === 0 ? 'Tạm dừng' : 'Hoạt động'
    }));

    // States cho Filter và Phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [filterHead, setFilterHead] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Logic lọc thông minh cho Khoa
    const filteredDepts = useMemo(() => {
        return allDepartments.filter(dept => {
            const matchSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dept.room.toLowerCase().includes(searchTerm.toLowerCase());
            const matchHead = filterHead === 'All' || dept.head === filterHead;
            const matchStatus = filterStatus === 'All' || dept.status === filterStatus;
            return matchSearch && matchHead && matchStatus;
        });
    }, [searchTerm, filterHead, filterStatus]);

    const totalPages = Math.ceil(filteredDepts.length / itemsPerPage);
    const currentItems = filteredDepts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);







    // =========================================================================
    // PHẦN FRONTEND (UI Đồng nhất với trang Bệnh nhân)
    // =========================================================================

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467]">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Header & Bộ lọc nâng cao */}
                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800">Quản lý Khoa</h2>
                        <button className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all">
                            <Plus size={18} /> Thêm khoa mới
                        </button>
                    </div>

                    {/* Toolbar Filter */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm tên khoa, số phòng..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        {/* Filter Trưởng khoa */}
                        <div className="relative">
                            <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => {setFilterHead(e.target.value); setCurrentPage(1);}}
                            >
                                <option value="All">Trưởng khoa</option>
                                <option value="BS. Nguyễn Văn An">BS. Nguyễn Văn An</option>
                                <option value="BS. Lê Thị Thảo">BS. Lê Thị Thảo</option>
                            </select>
                        </div>

                        {/* Filter Trạng thái */}
                        <div className="relative">
                            <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}}
                            >
                                <option value="All">Trạng thái</option>
                                <option value="Hoạt động">Hoạt động</option>
                                <option value="Tạm dừng">Tạm dừng</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[14px] border-b border-gray-50">
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Tên khoa</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Trưởng khoa</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Vị trí</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider text-center">Trạng thái</th>
                            <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {currentItems.map((dept) => (
                            <tr key={dept.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-5 px-6 font-semibold text-blue-600 cursor-pointer hover:underline">
                                    {dept.name}
                                </td>
                                <td className="py-5 px-6 font-normal text-gray-900">{dept.head}</td>
                                <td className="py-5 px-6 text-gray-500">{dept.room}</td>
                                <td className="py-5 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            dept.status === 'Hoạt động'
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {dept.status}
                                        </span>
                                </td>
                                <td className="py-5 px-6">
                                    {/* Nút thao tác đồng bộ với trang Bệnh nhân */}
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
                        Hiển thị {currentItems.length} trên {filteredDepts.length} khoa
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

export default DepartmentManagement;