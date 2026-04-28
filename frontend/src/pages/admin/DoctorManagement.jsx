import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X, ChevronDown, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import { doctorService } from '../../services/doctorService';
import api from '../../services/api'; // Nếu file api.js export default axios instance

const DoctorManagement = () => {
      // 1. KHAI BÁO STATE

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho Form thêm mới (Khớp với DoctorDto)
    const initialFormState = {
        fullName: '',
            email: '',
            phone: '',
            departmentId: '',
            gender: 'MALE',
            dateOfBirth: '',
            consultationFee: 0,
            address: '',
            notes: '',
            doctorStatus: 'ACTIVE' // Đổi từ AVAILABLE -> ACTIVE
        };
    const [formData, setFormData] = useState(initialFormState);

    // State cho bộ lọc & phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    // 2. GỌI API LẤY DỮ LIỆU

    // Lấy danh sách Khoa
    const fetchDepartments = async () => {
        try {
            const res = await api.get('/departments');

            console.log("Dữ liệu khoa từ Backend:", res.data);

            // Nếu Backend trả về bọc trong field 'data' thì dùng res.data.data
            const actualData = Array.isArray(res.data) ? res.data : res.data.data;
            setDepartments(actualData || []);
        } catch (err) {
            console.error("Lỗi lấy danh sách khoa:", err);
        }
    };

    // Lấy danh sách Bác sĩ
    const fetchDoctors = async () => {
        setLoading(true);
        try {
            const params = {
                keyword: searchTerm || null,
                departmentId: filterDept === 'All' ? null : parseInt(filterDept)
            };
            // Bật dòng này lên khi có API thật
            const res = await doctorService.search(params);
            setDoctors(res.data);

        } catch (err) {
            console.error("Lỗi lấy danh sách bác sĩ:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load dữ liệu khi component chạy lần đầu hoặc khi đổi filter
    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [searchTerm, filterDept]);


    // 3. XỬ LÝ HÀNH ĐỘNG (THÊM, XÓA) & PHÂN TRANG

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bật loading nếu mày đã khai báo state loading

    try {
        // 1. CHUẨN HÓA DỮ LIỆU GỬI ĐI
        const dataToSubmit = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            gender: formData.gender,
            dateOfBirth: formData.dateOfBirth,
            // Ép kiểu số và xử lý NaN
            departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
            consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : 0,
            // Xử lý null cho các trường text không bắt buộc
            address: formData.address || "",
            notes: formData.notes || "",
            doctorStatus: formData.doctorStatus || "ACTIVE"
        };

        // 2. PHÂN LOẠI THÊM HOẶC SỬA
        if (formData.id) {
            // Trường hợp SỬA: Phải có ID
            await doctorService.update(formData.id, dataToSubmit);
            alert("Cập nhật thông tin bác sĩ thành công!");
        } else {
            // Trường hợp THÊM: Không gửi field ID kèm theo trong Body
            await doctorService.create(dataToSubmit);
            alert("Thêm bác sĩ mới thành công!");
        }

        // 3. DỌN DẸP SAU KHI THÀNH CÔNG
        setIsModalOpen(false);
        setFormData(initialFormState); // Reset về trạng thái trống ban đầu
        fetchDoctors(); // Load lại bảng dữ liệu

    } catch (err) {
        console.error("Chi tiết lỗi từ Backend:", err.response?.data);

        // Nếu Backend trả về danh sách lỗi Validation (400)
        const backendError = err.response?.data?.message || err.response?.data;
        alert("Lỗi lưu dữ liệu: " + (typeof backendError === 'string' ? backendError : "Dữ liệu không hợp lệ"));

    } finally {
        setLoading(false); // Tắt loading
    }
};

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này không?")) {
            try {
                // Bật dòng này lên để bắn API thật
                await doctorService.delete(id);
                alert(`Đã gửi yêu cầu xóa ID: ${id}`);
                fetchDoctors();
            } catch (err) {
                alert(err.response?.data || "Không thể xóa bác sĩ này!");
            }
        }
    };
    // Hàm xử lý khi bấm vào nút Sửa
    const handleEdit = (doc) => {

        setFormData({
            ...doc,
            departmentId: doc.departmentId ? doc.departmentId.toString() : '',
            dateOfBirth: doc.dateOfBirth ? doc.dateOfBirth.split('T')[0] : ''
        });
        // 2. Mở khóa các ô nhập liệu (vì đang sửa chứ không phải xem)
        setIsReadOnly(false);
        // 3. Mở Modal lên
        setIsModalOpen(true);
    };

    // Phân trang bằng mảng doctors
    const totalPages = Math.ceil(doctors.length / itemsPerPage) || 1;
    const currentItems = doctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    // 4. GIAO DIỆN HIỂN THỊ

    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467]">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

                {/* Header & Smart Filter */}
                <div className="p-8 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800">Danh sách bác sĩ</h2>
                        <button
                        onClick={() => {
                                setFormData(initialFormState); // Reset form về trống
                                setIsReadOnly(false);          // Cho phép nhập (không khóa)
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 text-sm font-semibold transition-all shadow-md shadow-blue-100"
                        >
                            <Plus size={18} /> Thêm bác sĩ
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[300px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Tìm tên, email, số điện thoại..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
                        </div>

                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <select
                                className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none appearance-none focus:border-blue-400"
                                value={filterDept}
                                onChange={(e) => {setFilterDept(e.target.value); setCurrentPage(1);}}
                            >
                                <option value="All">Tất cả khoa</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
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
                        {loading ? (
                            <tr><td colSpan="5" className="py-10 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
                        ) : currentItems.length === 0 ? (
                            <tr><td colSpan="5" className="py-10 text-center text-gray-500">Không tìm thấy bác sĩ nào.</td></tr>
                        ) : (
                            currentItems.map((doc) => (
                                <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                                    <td className="py-5 px-6 font-normal text-gray-900">{doc.fullName}</td>
                                    <td className="py-5 px-6 text-gray-500">{doc.email}</td>
                                    <td className="py-5 px-6 text-gray-500">{doc.phone}</td>
                                    <td className="py-5 px-6">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                                            {doc.departmentName}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6">
                                        <div className="flex justify-center items-center gap-3">
                                            <button title="Xem"
                                                        onClick={() => {
                                                                setFormData(doc);
                                                                setIsReadOnly(true);
                                                                setIsModalOpen(true);
                                                            }} className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-all">
                                                <Eye size={18} />
                                            </button>
                                            <button title="Sửa"
                                                        onClick={() => handleEdit(doc)}
                                                        className="p-2 text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(doc.id)} title="Xóa" className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-all">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-8 flex items-center justify-between border-t border-gray-50">
                    <p className="text-sm text-gray-400 font-medium">
                        Hiển thị {currentItems.length} trên {doctors.length} bác sĩ
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

            {/* MODAL THÊM BÁC SĨ TÍCH HỢP DATA */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-[600px] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Thêm bác sĩ mới</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* FORM ĐÃ GẮN HÀM XỬ LÝ */}
                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ tên *</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={isReadOnly}
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Giới tính *</label>
                                    <select
                                        required
                                        disabled={isReadOnly}
                                        value={formData.gender}
                                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-sm"
                                    >
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ngày sinh *</label>
                                    <input
                                        type="date"
                                        required
                                        disabled={isReadOnly}
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại *</label>
                                    <input
                                        type="text"
                                        required
                                        disabled={isReadOnly}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        disabled={isReadOnly}
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-all text-sm"
                                    />
                                </div>
                                {/* Thêm vào trong lưới grid của Form, dưới ô Email */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phí khám (VNĐ)</label>
                                    <input
                                        type="number"
                                        disabled={isReadOnly}
                                        value={formData.consultationFee}
                                        onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ</label>
                                    <input
                                        type="text"
                                        disabled={isReadOnly}
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-sm"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ghi chú</label>
                                    <textarea
                                        rows="2"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-sm"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Khoa *</label>
                                    <select
                                        required
                                        disabled={isReadOnly}
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-sm"
                                    >
                                        <option value="">-- Chọn khoa --</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                           {/* ĐOẠN MỚI NÈ */}
                           <div className="flex justify-end gap-3 pt-6">
                               <button
                                   type="button"
                                   onClick={() => setIsModalOpen(false)}
                                   className="px-6 py-2.5 text-gray-500 font-semibold hover:bg-gray-50 rounded-xl transition-all"
                               >
                                   {/* Nếu đang xem thì hiện chữ Đóng, đang thêm thì hiện chữ Hủy */}
                                   {isReadOnly ? "Đóng" : "Hủy"}
                               </button>

                               {/* Chỉ hiện nút Lưu nếu KHÔNG PHẢI đang ở chế độ xem */}
                               {!isReadOnly && (
                                   <button
                                       type="submit"
                                       className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                                   >
                                       Lưu thông tin
                                   </button>
                               )}
                           </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorManagement;