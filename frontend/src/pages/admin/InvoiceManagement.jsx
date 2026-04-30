import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, CreditCard, Download, Trash2, X, FileText } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
const InvoiceManagement = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/admin/invoices`);
            setInvoices(res.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách hóa đơn:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await axios.put(`${apiUrl}/admin/invoices/${id}/status`, null, { params: { status: newStatus } });

            setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
        } catch (error) {
            alert("Lỗi cập nhật trạng thái!");
        }
    };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Bạn có chắc chắn muốn xóa hóa đơn này không?")) return;
//         try {
//             await axios.delete(`${apiUrl}/admin/invoices/${id}`);
//             fetchInvoices();
//         } catch (error) {
//             alert("Lỗi khi xóa hóa đơn!");
//         }
//     };

    const openViewModal = (invoice) => {
        setSelectedInvoice(invoice);
        setIsViewModalOpen(true);
    };

    const handleExportExcel = () => {
        if (invoices.length === 0) {
            alert("Không có dữ liệu hóa đơn để xuất báo cáo!");
            return;
        }

        const excelData = invoices.map((inv) => ({
            "Mã HĐ": inv.id,
            "Tên bệnh nhân": inv.patientName || 'Chưa cập nhật',
            "Bác sĩ phụ trách": inv.doctorName || 'Chưa cập nhật',
            "Ngày lập": formatDate(inv.createdAt),
            "Tổng tiền (VNĐ)": inv.total || 0,
            "Trạng thái": inv.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán',
            "Chi tiết dịch vụ": inv.details || 'Không có chi tiết'
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const wscols = [
            { wch: 10 },
            { wch: 25 },
            { wch: 25 },
            { wch: 20 },
            { wch: 18 },
            { wch: 20 },
            { wch: 40 }
        ];
        worksheet['!cols'] = wscols;
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Báo Cáo Tài Chính");

        const dateStr = new Date().toISOString().split('T')[0];
        XLSX.writeFile(workbook, `Bao_Cao_Tai_Chinh_Phong_Kham_${dateStr}.xlsx`);
    };

    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        if (Array.isArray(dateInput)) {
            return new Date(dateInput[0], dateInput[1]-1, dateInput[2], dateInput[3], dateInput[4]).toLocaleString('vi-VN');
        }
        return new Date(dateInput).toLocaleString('vi-VN');
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0) + ' ₫';

   const filteredData = useMemo(() => {
       // Bước 1: Lọc dữ liệu theo Search và Status
       const result = invoices.filter(inv => {
           const matchSearch = (inv.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
               String(inv.id).includes(searchTerm);
           const matchStatus = filterStatus === 'ALL' || inv.status === filterStatus;
           return matchSearch && matchStatus;
       });

       // Bước 2: Sắp xếp theo ID giảm dần (Mã hóa đơn lớn nhất/mới nhất lên đầu)
       // Dùng b.id - a.id để đưa ID lớn lên trên
       return result.sort((a, b) => Number(b.id) - Number(a.id));

   }, [searchTerm, filterStatus, invoices]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467] relative">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800">Danh sách hóa đơn</h2>
                        <button onClick={handleExportExcel} className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 text-sm font-semibold transition-all shadow-md shadow-emerald-100">
                            <Download size={18} /> Xuất báo cáo tài chính
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm mã hóa đơn, tên bệnh nhân..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                onChange={(e) => {setFilterStatus(e.target.value); setCurrentPage(1);}}
                            >
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="PAID">Đã thanh toán</option>
                                <option value="UNPAID">Chưa thanh toán</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[13px] border-b border-gray-50 bg-gray-50/50">
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Mã HĐ</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Bệnh nhân</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Ngày lập</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider">Số tiền</th>
                            <th className="py-4 px-6 font-medium uppercase tracking-wider text-center">Trạng thái</th>
                            <th className="py-4 px-6 text-center font-medium uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {isLoading ? (
                            <tr><td colSpan="6" className="text-center py-10 text-gray-400">Đang tải dữ liệu...</td></tr>
                        ) : currentItems.length > 0 ? currentItems.map((inv) => (
                            <tr key={inv.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="py-4 px-6 text-gray-500 font-medium">{inv.id}</td>
                                <td className="py-4 px-6 text-gray-900 font-medium">{inv.patientName}</td>
                                <td className="py-4 px-6 text-gray-500 text-sm">{formatDate(inv.createdAt)}</td>
                                <td className="py-4 px-6 font-bold text-slate-900">{formatCurrency(inv.total)}</td>
                                <td className="py-4 px-6 text-center">
                                    <span className={`px-3 py-1 rounded-md text-[11px] font-bold inline-block w-[120px] ${
                                        inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                        {inv.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex justify-center items-center gap-2">
                                        <button onClick={() => openViewModal(inv)} title="Xem chi tiết" className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-100 rounded-lg transition-all">
                                            <Eye size={16} />
                                        </button>

                                        <select
                                            value={inv.status}
                                            onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 outline-none hover:bg-gray-50 cursor-pointer focus:border-blue-400 text-gray-600"
                                        >
                                            <option value="UNPAID">Chưa thanh toán</option>
                                            <option value="PAID">Đã thanh toán</option>
                                        </select>


                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="6" className="text-center py-10 text-gray-400">Không tìm thấy hóa đơn</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="p-6 flex items-center justify-between border-t border-gray-50 bg-white">
                        <p className="text-sm text-gray-400 font-medium">Hiển thị {currentItems.length} trên {filteredData.length} hóa đơn</p>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30"><ChevronLeft size={18} /></button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-bold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{i + 1}</button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-30"><ChevronRight size={18} /></button>
                        </div>
                    </div>
                )}
            </div>

            {isViewModalOpen && selectedInvoice && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col">

                        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="text-blue-500" />
                                Chi tiết hóa đơn {selectedInvoice.id}
                            </h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 bg-gray-50/50 flex-1 space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-sm text-slate-500 font-medium">Bệnh nhân</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedInvoice.patientName}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-sm text-slate-500 font-medium">Bác sĩ</span>
                                    <span className="text-sm font-bold text-slate-800">{selectedInvoice.doctorName || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-sm text-slate-500 font-medium">Ngày lập</span>
                                    <span className="text-sm font-bold text-slate-800">{formatDate(selectedInvoice.createdAt)}</span>
                                </div>
                                <div className="flex justify-between items-start pb-3 border-b border-gray-50">
                                    <span className="text-sm text-slate-500 font-medium">Chi tiết dịch vụ</span>
                                    <span className="text-sm font-medium text-slate-800 text-right max-w-[60%] whitespace-pre-wrap leading-relaxed">{selectedInvoice.details || 'Không có chi tiết'}</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                                    <span className="text-sm text-slate-500 font-medium">Trạng thái</span>
                                    <span className={`px-3 py-1 rounded-md text-[11px] font-bold ${selectedInvoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {selectedInvoice.status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-base font-bold text-slate-800">TỔNG TIỀN</span>
                                    <span className="text-xl font-black text-blue-600">{formatCurrency(selectedInvoice.total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="px-8 py-2.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-colors shadow-md">
                                Đóng cửa sổ
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default InvoiceManagement;
