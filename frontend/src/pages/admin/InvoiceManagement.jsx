import React, { useState, useMemo } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, DollarSign, Filter, CreditCard, Download } from 'lucide-react';

const InvoiceManagement = () => {
    // =========================================================================
    // PHẦN LOGIC (Dữ liệu, Bộ lọc & Phân trang)
    // =========================================================================

    // Giả lập dữ liệu 22 hóa đơn
    const [invoices, setInvoices] = useState(Array.from({ length: 22 }, (_, i) => ({
        id: `HD-${String(i + 1).padStart(3, '0')}`,
        patientName: i % 2 === 0 ? 'Nguyễn Thị Hoa' : 'Trần Văn Bảo',
        date: '2026-03-10',
        amount: (1500000 + (i * 100000)).toLocaleString('vi-VN') + 'đ',
        rawAmount: 1500000 + (i * 100000),
        status: i % 3 === 0 ? 'Chưa thanh toán' : 'Đã thanh toán'
    })));

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Cập nhật trạng thái trực tiếp trên bảng (Nghiệp vụ thu ngân)
    const handleStatusChange = (id, newStatus) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    };

    // Logic lọc thông minh
    const filteredData = useMemo(() => {
        return invoices.filter(inv => {
            const matchSearch = inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = filterStatus === 'All' || inv.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [searchTerm, filterStatus, invoices]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467]">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Header & Smart Filter */}
                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800">Danh sách hóa đơn</h2>
                        <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 text-sm font-semibold transition-all shadow-md shadow-green-100">
                            <Download size={18} /> Xuất báo cáo tài chính
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Tìm kiếm */}
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm mã hóa đơn, tên bệnh nhân..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        {/* Filter Trạng thái */}
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}}
                            >
                                <option value="All">Trạng thái thanh toán</option>
                                <option value="Đã thanh toán">Đã thanh toán</option>
                                <option value="Chưa thanh toán">Chưa thanh toán</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="px-4">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[14px] border-b border-gray-50">
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Mã HĐ</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Bệnh nhân</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Ngày</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Số tiền</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider text-center">Trạng thái</th>
                            <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {currentItems.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-5 px-6 font-semibold text-gray-400">{inv.id}</td>
                                <td className="py-5 px-6 font-normal text-gray-900">{inv.patientName}</td>
                                <td className="py-5 px-6 text-gray-500">{inv.date}</td>
                                <td className="py-5 px-6 font-semibold text-gray-700">{inv.amount}</td>
                                <td className="py-5 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            inv.status === 'Đã thanh toán'
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-orange-50 text-orange-600'
                                        }`}>
                                            {inv.status}
                                        </span>
                                </td>
                                <td className="py-5 px-6">
                                    <div className="flex justify-center items-center gap-2">
                                        {/* Xem chi tiết */}
                                        <button title="Xem" className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                                            <Eye size={18} />
                                        </button>

                                        {/* Thay đổi trạng thái nhanh - Tham khảo image_06079c.png */}
                                        <select
                                            value={inv.status}
                                            onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none bg-white focus:border-blue-400 text-gray-600"
                                        >
                                            <option value="Chưa thanh toán">Chưa thanh toán</option>
                                            <option value="Đã thanh toán">Đã thanh toán</option>
                                        </select>
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
                        Hiển thị {currentItems.length} trên {filteredData.length} hóa đơn
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

export default InvoiceManagement;