import React, { useState } from 'react';
import { Clock, CheckCircle2, Download, User, Calendar, Receipt, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data mở rộng để demo phân trang
const invoicesData = [
    { id: "INV1", doctorName: "BS. Nguyễn Thị Lan", specialty: "Nội khoa", patientName: "Nguyễn Văn An", date: "18/03/2025", amount: 350000, status: "unpaid" },
    { id: "INV2", doctorName: "BS. Trần Văn Minh", specialty: "Tim mạch", patientName: "Nguyễn Văn An", date: "22/03/2025", amount: 500000, status: "unpaid" },
    { id: "INV3", doctorName: "BS. Phạm Thị Hoa", specialty: "Da liễu", patientName: "Nguyễn Văn An", date: "28/02/2025", amount: 280000, status: "paid" },
    { id: "INV4", doctorName: "BS. Lê Quang Hùng", specialty: "Chỉnh hình", patientName: "Nguyễn Văn An", date: "15/02/2025", amount: 420000, status: "overdue" },
    { id: "INV5", doctorName: "BS. Võ Thị Mai", specialty: "Thần kinh", patientName: "Nguyễn Văn An", date: "10/02/2025", amount: 450000, status: "paid" },
    { id: "INV6", doctorName: "BS. Hoàng Đức Nam", specialty: "Nhi khoa", patientName: "Nguyễn Văn An", date: "05/02/2025", amount: 300000, status: "paid" },
    { id: "INV7", doctorName: "BS. Ngô Bảo Châu", specialty: "Nội khoa", patientName: "Nguyễn Văn An", date: "01/02/2025", amount: 350000, status: "unpaid" },
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
};

export default function PatientBilling() {
    const [activeTab, setActiveTab] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3; // Số lượng hóa đơn mỗi trang

    // 1. Lọc dữ liệu theo Tab
    const filteredInvoices = invoicesData.filter(invoice => {
        if (activeTab === "all") return true;
        return invoice.status === activeTab;
    });

    // 2. Tính toán phân trang
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

    // Reset về trang 1 khi đổi Tab
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);
    };

    // Component Badge nội bộ
    const CustomBadge = ({ status }) => {
        const styles = {
            unpaid: "bg-orange-50 text-orange-600 border-orange-100",
            paid: "bg-green-50 text-green-600 border-green-100",
            overdue: "bg-red-50 text-red-600 border-red-100"
        };
        const icons = {
            unpaid: <Clock className="w-3.5 h-3.5 mr-1.5" />,
            paid: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />,
            overdue: <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
        };
        const labels = { unpaid: "Chưa thanh toán", paid: "Đã thanh toán", overdue: "Quá hạn" };

        return (
            <div className={`flex items-center border px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {icons[status]} {labels[status]}
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Hóa đơn khám bệnh</h1>
                <p className="text-slate-500 mt-1">Quản lý và thanh toán hóa đơn của bạn</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-orange-50 p-3 rounded-full"><Clock className="w-6 h-6 text-orange-500" /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Cần thanh toán</p>
                        <h2 className="text-2xl font-bold text-slate-800">850.000 đ</h2>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-50 p-3 rounded-full"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Đã thanh toán</p>
                        <h2 className="text-2xl font-bold text-slate-800">280.000 đ</h2>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-slate-100/80 p-1 rounded-xl flex gap-1 w-fit">
                {[
                    { id: 'all', label: 'Tất cả' },
                    { id: 'unpaid', label: 'Chưa thanh toán' },
                    { id: 'paid', label: 'Đã thanh toán' },
                    { id: 'overdue', label: 'Quá hạn' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Invoice List */}
            <div className="space-y-4">
                {currentItems.map((invoice) => (
                    <div key={invoice.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
                        <div className="p-5 flex justify-between items-start border-b border-gray-50">
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{invoice.id}</p>
                                <h3 className="text-base font-bold text-slate-800">{invoice.doctorName}</h3>
                                <p className="text-sm text-slate-500">{invoice.specialty}</p>
                            </div>
                            <CustomBadge status={invoice.status} />
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-50 bg-slate-50/30">
                            <div>
                                <p className="flex items-center text-[11px] text-slate-400 font-bold uppercase mb-1"><User className="w-3 h-3 mr-1" /> Bệnh nhân</p>
                                <p className="text-sm font-semibold text-slate-700">{invoice.patientName}</p>
                            </div>
                            <div>
                                <p className="flex items-center text-[11px] text-slate-400 font-bold uppercase mb-1"><Calendar className="w-3 h-3 mr-1" /> Ngày khám</p>
                                <p className="text-sm font-semibold text-slate-700">{invoice.date}</p>
                            </div>
                            <div>
                                <p className="flex items-center text-[11px] text-slate-400 font-bold uppercase mb-1"><Receipt className="w-3 h-3 mr-1" /> Phí khám</p>
                                <p className="text-sm font-bold text-slate-800">{formatCurrency(invoice.amount)}</p>
                            </div>
                        </div>

                        <div className="p-4 flex items-center justify-between bg-white">
                            <button className="flex items-center text-slate-500 hover:text-slate-800 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50">
                                <Download className="w-4 h-4 mr-2" /> <span className="text-sm font-semibold">Tải hóa đơn</span>
                            </button>
                            {(invoice.status === 'unpaid' || invoice.status === 'overdue') && (
                                <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm rounded-xl px-6 py-2.5 shadow-lg shadow-sky-200 transition-all">
                                    Thanh toán ngay
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pb-10">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg border transition-colors ${
                            currentPage === 1 ? "text-slate-300 border-gray-100" : "text-slate-600 border-gray-200 hover:bg-white hover:border-sky-500"
                        }`}
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                                currentPage === index + 1
                                    ? "bg-sky-500 text-white shadow-md shadow-sky-100"
                                    : "text-slate-500 border border-transparent hover:border-gray-200 hover:bg-white"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg border transition-colors ${
                            currentPage === totalPages ? "text-slate-300 border-gray-100" : "text-slate-600 border-gray-200 hover:bg-white hover:border-sky-500"
                        }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}