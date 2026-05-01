import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Download, User, Calendar, Receipt, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { patientService } from '../../services/patientService';
import api from '../../services/api';

export default function PatientBilling() {
    const patientId = localStorage.getItem("patientId") || "1";

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Fetch dữ liệu qua Service
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await patientService.getInvoices(patientId);
            const data = response.data || response;
            setInvoices(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi lấy hóa đơn:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [patientId]);

    // Xử lý thanh toán sử dụng instance axios chung
    const handlePayment = async (invoiceId) => {
        if (!window.confirm("Xác nhận thanh toán hóa đơn này?")) return;
        try {
            // Sử dụng file api.js của bạn để tự động có BaseURL và Interceptor
            await api.put(`/patients/${patientId}/invoices/${invoiceId}/pay`);
            alert("Thanh toán thành công!");
            fetchInvoices(); // Load lại dữ liệu
        } catch (error) {
            console.error("Lỗi thanh toán:", error);
            alert("Đã xảy ra lỗi khi thanh toán");
        }
    }

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
    const formatDate = (dateArr) => {
        if(!dateArr) return '';
        if(Array.isArray(dateArr)) {
            return new Date(dateArr[0], dateArr[1]-1, dateArr[2], dateArr[3], dateArr[4]).toLocaleString('vi-VN');
        }
        return new Date(dateArr).toLocaleString('vi-VN');
    };

    // Tính toán Summary
    const totalUnpaid = invoices.filter(i => i.status === 'UNPAID').reduce((sum, i) => sum + i.total, 0);
    const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0);

    // Phân trang & Lọc
    const filteredInvoices = invoices.filter(invoice => {
        if (activeTab === "all") return true;
        return invoice.status === activeTab;
    });

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const currentItems = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
    };

    const CustomBadge = ({ status }) => {
        if (status === 'UNPAID') return <div className="flex items-center border px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-600 border-orange-100"><Clock className="w-3.5 h-3.5 mr-1.5"/> Chưa thanh toán</div>;
        if (status === 'PAID') return <div className="flex items-center border px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border-green-100"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5"/> Đã thanh toán</div>;
        return null;
    };

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500"/></div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-50/50 min-h-screen">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Hóa đơn khám bệnh</h1>
                <p className="text-slate-500 mt-1">Quản lý và thanh toán hóa đơn của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-orange-50 p-3 rounded-full"><Clock className="w-6 h-6 text-orange-500"/></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Cần thanh toán</p>
                        <h2 className="text-2xl font-bold text-slate-800">{formatCurrency(totalUnpaid)}</h2>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-full"><CheckCircle2 className="w-6 h-6 text-green-500"/></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Đã thanh toán</p>
                        <h2 className="text-2xl font-bold text-slate-800">{formatCurrency(totalPaid)}</h2>
                    </div>
                </div>
            </div>

            <div className="bg-slate-100/80 p-1 rounded-xl flex gap-1 w-fit">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'UNPAID', label: 'Chưa thanh toán' },
                    { id: 'PAID', label: 'Đã thanh toán' }
                ].map((tab) => (
                    <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {currentItems.length === 0 && <div className="text-center py-10 text-gray-400">Không có hóa đơn nào</div>}

                {currentItems.map((invoice) => (
                    <div key={invoice.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
                        <div className="p-5 flex justify-between items-start border-b border-gray-50">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Mã Hóa Đơn: {invoice.id}</p>
                                <h3 className="text-base font-bold text-slate-800">{invoice.details}</h3>
                            </div>
                            <CustomBadge status="{invoice.status}"/>
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-gray-50 bg-slate-50/30">
                            <div>
                                <p className="flex items-center text-[11px] text-slate-400 font-bold uppercase mb-1"><Calendar className="w-3 h-3 mr-1"/> Ngày tạo</p>
                                <p className="text-sm font-semibold text-slate-700">{formatDate(invoice.createdAt)}</p>
                            </div>
                            <div>
                                <p className="flex items-center text-[11px] text-slate-400 font-bold uppercase mb-1"><Receipt className="w-3 h-3 mr-1"/> Tổng tiền</p>
                                <p className="text-sm font-bold text-slate-800 text-blue-600">{formatCurrency(invoice.total)}</p>
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-between bg-white">
                            <button className="flex items-center text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
                                <Download className="w-4 h-4 mr-2"/> <span className="text-sm font-semibold">Tải PDF</span>
                            </button>
                            {invoice.status === 'UNPAID' && (
                                <button onClick={() => handlePayment(invoice.id)} className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl px-6 py-2.5 shadow-lg shadow-sky-200 transition-all">
                                    Thanh toán ngay
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

{/* Pagination Section */}
            {totalPages > 0 && (
                <div className="mt-8 px-8 py-5 border rounded-2xl flex items-center justify-between bg-white shadow-sm border-gray-100">
                    <div className="text-sm text-gray-500 font-medium">
                        {/* FIX: Đổi từ records.length thành filteredInvoices.length hoặc invoices.length */}
                        Hiển thị <span className="text-blue-600">{currentItems.length}</span> trên tổng số <span className="text-gray-700">{filteredInvoices.length}</span> mục
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg border transition-all ${
                                currentPage === 1 ? "text-gray-300 border-gray-100 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                            }`}
                        >
                            <ChevronLeft size={20} />
                        </button>

                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                                            currentPage === pageNumber ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 border border-transparent hover:border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`p-2 rounded-lg border transition-all ${
                                (currentPage === totalPages || totalPages === 0) ? "text-gray-300 border-gray-100 cursor-not-allowed" : "text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                            }`}
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}