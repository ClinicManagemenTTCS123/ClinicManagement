import React, { useState } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const MyAppointmentsD = () => {
    // 1. Dữ liệu mẫu (Giả lập 22 người để thấy rõ 3 trang)
    const allAppointments = Array.from({ length: 22 }, (_, i) => ({
        id: i + 1,
        patient: i === 0 ? 'Trần Văn Hùng' : i === 1 ? 'Lê Thị Mai' : `Bệnh nhân số ${i + 1}`,
        date: '2026-03-14',
        time: i % 2 === 0 ? '09:00' : '10:30',
        type: i % 3 === 0 ? 'Tái khám' : 'Khám mới',
        status: i % 4 === 0 ? 'Đã xác nhận' : i % 4 === 1 ? 'Chờ xác nhận' : i % 4 === 2 ? 'Hoàn thành' : 'Đã hủy'
    }));

    // 2. State quản lý
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Quy định 10 người mỗi trang

    // 3. Logic Lọc dữ liệu (Chạy trước khi phân trang)
    const filteredData = allAppointments.filter(apt => {
        const matchesSearch = apt.patient.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "Tất cả" || apt.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // 4. Logic Phân trang chuẩn (Cắt danh sách 10 người)
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // ĐÂY LÀ BIẾN QUAN TRỌNG ĐỂ HIỂN THỊ TRÊN BẢNG
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Hàm chuyển trang
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const renderStatus = (status) => {
        const baseClass = "px-3 py-1 rounded-full text-[11px] font-bold";
        switch (status) {
            case 'Đã xác nhận': return <span className={`${baseClass} bg-emerald-50 text-emerald-600`}>{status}</span>;
            case 'Chờ xác nhận': return <span className={`${baseClass} bg-orange-50 text-orange-600`}>{status}</span>;
            case 'Đã hủy': return <span className={`${baseClass} bg-red-50 text-red-600`}>{status}</span>;
            case 'Hoàn thành': return <span className={`${baseClass} bg-blue-50 text-blue-600`}>{status}</span>;
            default: return <span className={`${baseClass} bg-gray-50 text-gray-600`}>{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* --- BỘ LỌC & TÌM KIẾM --- */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Lịch hẹn của tôi</h1>
                    <p className="text-sm text-gray-500">Quản lý danh sách lịch hẹn khám bệnh</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Tìm tên bệnh nhân..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-50 transition-all"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    <select
                        className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 outline-none hover:bg-gray-50 cursor-pointer shadow-sm"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="Tất cả">Tất cả trạng thái</option>
                        <option value="Đã xác nhận">Đã xác nhận</option>
                        <option value="Chờ xác nhận">Chờ xác nhận</option>
                        <option value="Hoàn thành">Hoàn thành</option>
                        <option value="Đã hủy">Đã hủy</option>
                    </select>
                </div>
            </div>

            {/* --- BẢNG DỮ LIỆU --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="text-gray-400 text-[12px] uppercase tracking-wider border-b border-gray-50">
                            <th className="px-8 py-5 font-bold">Bệnh nhân</th>
                            <th className="px-8 py-5 font-bold">Ngày khám</th>
                            <th className="px-8 py-5 font-bold">Giờ khám</th>
                            <th className="px-8 py-5 font-bold">Loại khám</th>
                            <th className="px-8 py-5 font-bold">Trạng thái</th>
                            <th className="px-8 py-5 font-bold text-center">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {currentItems.length > 0 ? (
                            currentItems.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-semibold text-gray-700">{apt.patient}</td>
                                    <td className="px-8 py-5 text-gray-600 text-sm italic">{apt.date}</td>
                                    <td className="px-8 py-5 text-gray-600 text-sm">{apt.time}</td>
                                    <td className="px-8 py-5 text-gray-600 text-sm">{apt.type}</td>
                                    <td className="px-8 py-5">{renderStatus(apt.status)}</td>
                                    <td className="px-8 py-5 text-center">
                                        <button className="inline-flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors text-xs font-semibold">
                                            <Eye size={16} /> Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-8 py-10 text-center text-gray-400 italic">Không tìm thấy lịch hẹn phù hợp.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* --- PHÂN TRANG (PAGINATION) --- */}
                <div className="px-8 py-5 bg-white border-t border-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                        Hiển thị <span className="text-gray-600 font-medium">{currentItems.length}</span> trên <span className="text-gray-600 font-medium">{totalItems}</span> bệnh nhân
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Nút lùi */}
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-all"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {/* Danh sách số trang */}
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                                    currentPage === index + 1
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        {/* Nút tiến */}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAppointmentsD;