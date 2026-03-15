import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, Eye, Plus, ChevronLeft, ChevronRight, User, Calendar, Stethoscope, Clock } from 'lucide-react';

const AppointmentManagement = () => {
    // =========================================================================
    // PHẦN LOGIC (Dữ liệu, Bộ lọc & Phân trang)
    // =========================================================================

    // Giả lập dữ liệu 25 lịch hẹn
    const [appointments] = useState(Array.from({ length: 25 }, (_, i) => ({
        id: `LH${String(i + 1).padStart(3, '0')}`,
        patientName: i % 2 === 0 ? 'Nguyễn Thị Hoa' : 'Trần Văn Bảo',
        doctorName: i % 3 === 0 ? 'BS. Nguyễn Văn An' : 'BS. Trần Thị Bình',
        date: '2026-03-15',
        time: i % 2 === 0 ? '08:00' : '09:30',
        reason: i % 4 === 0 ? 'Khám tổng quát' : 'Đau lưng',
        status: i % 5 === 0 ? 'Đã hủy' : i % 3 === 0 ? 'Hoàn thành' : 'Chờ khám'
    })));

    // States cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Logic lọc thông minh
    const filteredData = useMemo(() => {
        return appointments.filter(item => {
            const matchSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = filterStatus === 'All' || item.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [searchTerm, filterStatus, appointments]);

    // Tính toán phân trang
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Màu sắc cho từng trạng thái lịch hẹn
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Chờ khám': return 'bg-orange-50 text-orange-600';
            case 'Đang khám': return 'bg-blue-50 text-blue-600';
            case 'Hoàn thành': return 'bg-green-50 text-green-600';
            case 'Đã hủy': return 'bg-red-50 text-red-600';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467]">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Header & Smart Filter */}
                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800">Danh sách lịch hẹn</h2>
                        <button className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all shadow-md shadow-blue-100">
                            <Plus size={18} /> Đặt lịch hẹn mới
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm mã lịch hẹn, tên bệnh nhân..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        {/* Filter Trạng thái */}
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}}
                            >
                                <option value="All">Tất cả trạng thái</option>
                                <option value="Chờ khám">Chờ khám</option>
                                <option value="Đang khám">Đang khám</option>
                                <option value="Hoàn thành">Hoàn thành</option>
                                <option value="Đã hủy">Đã hủy</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[14px] border-b border-gray-50">
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Mã LH</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Bệnh nhân</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Bác sĩ</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Thời gian</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider text-center">Trạng thái</th>
                            <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {currentItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-5 px-6 font-semibold text-gray-400">{item.id}</td>
                                <td className="py-5 px-6 font-normal text-gray-900">{item.patientName}</td>
                                <td className="py-5 px-6 text-gray-500">{item.doctorName}</td>
                                <td className="py-5 px-6">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-700">{item.date}</div>
                                        <div className="text-gray-400 text-xs">{item.time}</div>
                                    </div>
                                </td>
                                <td className="py-5 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(item.status)}`}>
                                            {item.status}
                                        </span>
                                </td>
                                <td className="py-5 px-6">
                                    {/* Nút thao tác đồng bộ với hệ thống */}
                                    <div className="flex justify-center items-center gap-3">
                                        <button title="Xem" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                                            <Eye size={18} />
                                        </button>
                                        <button title="Sửa" className="p-2 text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all">
                                            <Edit size={18} />
                                        </button>
                                        <button title="Hủy lịch" className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all">
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
                        Hiển thị {currentItems.length} trên {filteredData.length} lịch hẹn
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl disabled:opacity-20 transition-all"
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
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl disabled:opacity-20 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentManagement;