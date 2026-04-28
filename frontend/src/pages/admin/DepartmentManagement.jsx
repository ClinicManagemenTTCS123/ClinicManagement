import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // States cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState(null);
    const [editingId, setEditingId] = useState(null); // Lưu ID khi đang sửa
    const [formData, setFormData] = useState({
        name: '',
        base_fee: '',
        description: ''
    });

    const fetchDepartments = async (search = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8081/api/departments`, {
                params: { search: search }
            });
            setDepartments(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khoa:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchDepartments(searchTerm);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

// Hàm mở Modal Xem chi tiết
    const handleViewDetails = async (id) => {
        try {
            // Gọi API lấy chi tiết khoa. Java sẽ trả về object kèm Set<Doctor>
            const response = await axios.get(`http://localhost:8081/api/departments/${id}`);
            setSelectedDept(response.data);
            setIsViewModalOpen(true);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết:", error);
            alert("Không thể tải thông tin chi tiết khoa.");
        }
    };

    // Mở modal để thêm mới
    const openAddModal = () => {
        setEditingId(null);
        setFormData({ name: '', base_fee: '', description: '' });
        setIsModalOpen(true);
    };

    // Mở modal để chỉnh sửa
    const openEditModal = (dept) => {
        setEditingId(dept.id);
        setFormData({
            name: dept.name,
            base_fee: dept.baseFee, // Lưu ý lấy đúng baseFee từ Java response
            description: dept.description || ''
        });
        setIsModalOpen(true);
    };

    // Hàm xử lý gửi Form (Cả Thêm và Sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dataToSubmit = {
            name: formData.name,
            baseFee: parseFloat(formData.base_fee),
            description: formData.description
        };

        try {
            if (editingId) {
                // Gửi yêu cầu CẬP NHẬT (PUT)
                await axios.put(`http://localhost:8081/api/departments/${editingId}`, dataToSubmit);
                alert("Cập nhật khoa thành công!");
            } else {
                // Gửi yêu cầu THÊM MỚI (POST)
                await axios.post(`http://localhost:8081/api/departments`, dataToSubmit);
                alert("Thêm khoa mới thành công!");
            }
            setIsModalOpen(false);
            fetchDepartments(searchTerm);
        } catch (error) {
            alert("Lỗi: " + (error.response?.data?.message || "Không thể lưu dữ liệu"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm xóa khoa
    const handleDelete = async (id, name) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa khoa "${name}"?`)) {
            try {
                await axios.delete(`http://localhost:8081/api/departments/${id}`);
                alert("Xóa thành công!");
                fetchDepartments(searchTerm);
            } catch (error) {
                alert("Lỗi: " + (error.response?.data || "Không thể xóa khoa này"));
            }
        }
    };

    const totalPages = Math.ceil(departments.length / itemsPerPage);
    const currentItems = departments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467] relative">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Header */}
                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-[22px] font-bold text-gray-800">Quản lý Khoa</h2>
                            <p className="text-sm text-gray-500">Quản lý danh sách phòng ban và phí dịch vụ</p>
                        </div>
                        <button
                            onClick={openAddModal}
                            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all shadow-lg shadow-blue-100"
                        >
                            <Plus size={18} /> Thêm khoa mới
                        </button>
                    </div>
                    {/* Search Bar - Thêm đoạn này */}
                        <div className="relative max-w-4xl">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tên khoa..."
                                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                </div>

                {/* Table Section */}
                <div className="px-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[#8A92A6] text-[13px] border-b border-gray-100">
                                <th className="py-4 px-6 font-semibold uppercase tracking-wider w-[40%]">Tên khoa</th>
                                <th className="py-4 px-6 font-semibold uppercase tracking-wider w-[30%]">Phí cơ bản</th>
                                <th className="py-4 px-6 text-center font-semibold uppercase tracking-wider w-[30%]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {!loading && currentItems.map((dept) => (
                                <tr key={dept.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-5 px-6 text-[15px] font-medium text-[#101828]">{dept.name}</td>
                                    <td className="py-5 px-6">
                                        <span className="bg-[#EEF4FF] text-[#3538CD] text-[12px] font-medium px-4 py-1.5 rounded-full">
                                            {Number(dept.baseFee)?.toLocaleString()} VNĐ
                                        </span>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex justify-center items-center gap-3">

                                            <button
                                                onClick={() => handleViewDetails(dept.id)}
                                                title="Xem chi tiết"
                                                className="text-[#667085] hover:text-gray-900 transition-colors"
                                            >
                                                <Eye size={20} />
                                            </button>

                                            {/* Nút Sửa */}
                                            <button
                                                onClick={() => openEditModal(dept)}
                                                className="p-2 bg-[#FFF9F2] text-[#E67E22] rounded-lg hover:bg-[#FDEEDC] border border-[#FDEEDC]"
                                            >
                                                <Edit size={18} />
                                            </button>

                                            {/* Nút Xóa */}
                                            <button
                                                onClick={() => handleDelete(dept.id, dept.name)}
                                                className="p-2 bg-[#FFF1F3] text-[#E11D48] rounded-lg hover:bg-[#FFE4E8] border border-[#FFE4E8]"
                                            >
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
                <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-white">
                    <div className="text-sm text-gray-500">
                        Hiển thị <span className="font-medium text-gray-700">{currentItems.length}</span> trên tổng số <span className="font-medium text-gray-700">{departments.length}</span> khoa
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>

                        {/* Hiển thị số trang */}
                        <div className="flex items-center gap-1">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                                        currentPage === index + 1
                                            ? "bg-[#2563eb] text-white shadow-md shadow-blue-100"
                                            : "text-gray-600 hover:bg-gray-100 border border-transparent"
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>


            {/* MODAL (Dùng chung cho Thêm và Sửa) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingId ? "Cập Nhật Khoa" : "Thêm Khoa Mới"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên khoa <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phí cơ bản (VNĐ) <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    type="number"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm"
                                    value={formData.base_fee}
                                    onChange={(e) => setFormData({...formData, base_fee: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
                                <textarea
                                    rows="3"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm flex justify-center items-center gap-2 disabled:bg-blue-300"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (editingId ? 'Cập nhật' : 'Lưu lại')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        {/* MODAL XEM CHI TIẾT */}
        {isViewModalOpen && selectedDept && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">Khoa: {selectedDept.name}</h3>
                            <p className="text-sm text-gray-500">Thông tin chi tiết và danh sách nhân sự</p>
                        </div>
                        <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh]">
                        {/* Thông tin phí & Mô tả */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <p className="text-[12px] font-semibold text-blue-400 uppercase">Phí cơ bản</p>
                                <p className="text-lg font-bold text-blue-700">{selectedDept.baseFee?.toLocaleString()} VNĐ</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[12px] font-semibold text-gray-400 uppercase">Mô tả</p>
                                <p className="text-sm text-gray-600">{selectedDept.description || "Chưa có mô tả"}</p>
                            </div>
                        </div>

                        {/* Bảng danh sách bác sĩ */}
                        <div>
                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                                {/* Sửa từ .doctors thành .doctorNames */}
                                Danh sách bác sĩ ({selectedDept.doctorNames?.length || 0})
                            </h4>
                            <div className="border border-gray-100 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-medium">
                                        <tr>
                                            <th className="py-3 px-4 w-1/2">Họ và tên</th>
                                            <th className="py-3 px-4 w-1/2">Số điện thoại</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {selectedDept.doctorNames && selectedDept.doctorNames.length > 0 ? (
                                            selectedDept.doctorNames.map((name, index) => (
                                                <tr key={index} className="hover:bg-gray-50/30 text-gray-600 transition-colors">
                                                    {/* Hiển thị Tên */}
                                                    <td className="py-3 px-4 font-medium text-gray-800">
                                                        {name}
                                                    </td>
                                                    {/* Hiển thị SĐT tương ứng từ mảng doctorPhones */}
                                                    <td className="py-3 px-4 font-mono text-blue-600">
                                                        {selectedDept.doctorPhones && selectedDept.doctorPhones[index]
                                                            ? selectedDept.doctorPhones[index]
                                                            : "Đang cập nhật..."}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" className="py-10 text-center text-gray-400 italic">
                                                    Khoa này hiện chưa có bác sĩ trực thuộc.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default DepartmentManagement;