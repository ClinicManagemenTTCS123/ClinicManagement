import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, Calendar, Users, Building2, X, Loader2 } from 'lucide-react';
import { patientService } from '../../services/patientService';

const PatientManagement = () => {

    // PHẦN LOGIC BACKEND

    //state
    const [patients, setPatients] = useState([]); // Khởi tạo mảng rỗng
    const [loading, setLoading] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [filterDate, setFilterDate] = useState(''); // State lưu ngày sinh cần lọc

    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        gender: 'MALE',
        dateOfBirth: '',
        phone: '',
        email: '',
        address: '',
        cccd: '',
        insurance_code: '' // Trùng với cột insurance_code trong ảnh DB của mày
    });

    // Hàm gọi API lấy danh sách bệnh nhân
    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await patientService.getPatients();
            const data = res.data?.content || res.data || [];

            // SẮP XẾP TẠI ĐÂY: b.id - a.id (Giảm dần - Mới nhất lên đầu)
            const sortedData = Array.isArray(data)
                ? [...data].sort((a, b) => b.id - a.id)
                : [];

            setPatients(sortedData);
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
            setPatients([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm goi patientService.createPatient
   const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       try {
           if (editingId) {
               // Gửi lệnh UPDATE lên API
               await patientService.updatePatient(editingId, formData);
               alert("Cập nhật thông tin bệnh nhân thành công!");
           } else {
               // Gửi lệnh CREATE mới
               await patientService.createPatient(formData);
               alert("Thêm bệnh nhân mới thành công!");
           }

           setIsModalOpen(false); // Đóng Modal
           setEditingId(null);    // Reset ID
           fetchPatients();       // Load lại danh sách mới nhất từ DB
       } catch (err) {
           console.error("Lỗi thao tác:", err);
           alert("Thao tác thất bại. Kiểm tra console hoặc Backend!");
       } finally {
           setLoading(false);
       }
   };

    useEffect(() => {
        fetchPatients();
    }, []);

    // Logic lọc thông minh: Search, Giới tính và Ngày sinh
    const filteredData = useMemo(() => {
        if (!Array.isArray(patients)) return [];

        return patients.filter(p => {
            // 1. Lọc theo Tìm kiếm (Tên, SĐT, ID)
            const name = p.fullName || p.name || "";
            const phone = p.phone || "";
            const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                phone.includes(searchTerm) ||
                                String(p.id).includes(searchTerm);

            // 2. Lọc theo Giới tính (Nam/Nữ)
            const uiGender = p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : p.gender;
            const matchGender = filterGender === 'All' || uiGender === filterGender;

            // 3. Lọc theo Ngày sinh
            const patientDate = p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '';
            const matchDate = !filterDate || patientDate === filterDate;

            // Trả về kết quả kết hợp 3 điều kiện
            return matchSearch && matchGender && matchDate;
        });
    return result.sort((a, b) => b.id - a.id);
    }, [patients, searchTerm, filterGender, filterDate]); // Bỏ filterDept khỏi dependency

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    // Xử lý xóa
    const handleDelete = async (id) => {
        if (window.confirm(`Bạn có chắc muốn xóa bệnh nhân mã ${id}?`)) {
            try {
                await patientService.deletePatient(id);
                fetchPatients(); // Tải lại danh sách
            } catch (err) {
                alert("Lỗi khi xóa bệnh nhân!");
            }
        }
    };


    // =========================================================================
    // PHẦN FRONTEND (Giữ nguyên Style của bạn)
    // =========================================================================
    return (
        <div className="p-2 bg-gray-50 min-h-screen font-sans text-[#475467]">
            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">

            {/* Header & Bộ lọc nâng cao */}
                <div className="p-2 border-b border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[22px] font-bold text-gray-800"> Danh sách bệnh nhân</h2>
                        <button
                            onClick={() => {
                                setEditingId(null);
                                setIsReadOnly(false);
                                setFormData({
                                    fullName: '', gender: 'MALE', dateOfBirth: '',
                                    phone: '', email: '', address: '', cccd: '', insurance_code: ''
                                });
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-semibold transition-all"
                        >
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
                                value={searchTerm}
                                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                            />
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

                       {/* Filter Ngày sinh */}
                       <div className="relative">
                           <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                           <input
                               type="date"
                               value={filterDate} // Gắn giá trị vào state
                               onChange={(e) => {
                                   setFilterDate(e.target.value);
                                   setCurrentPage(1); // Reset về trang 1 khi lọc
                               }}
                               className="pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none focus:border-blue-400"
                           />
                           {/* Thêm nút Xóa nhanh ngày nếu muốn */}
                           {filterDate && (
                               <button
                                   onClick={() => setFilterDate('')}
                                   className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                               >
                                   <X size={14} />
                               </button>
                           )}
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
                        {loading ? (
                            <tr><td colSpan="6" className="py-10 text-center text-gray-400">Đang tải dữ liệu...</td></tr>
                        ) : currentItems.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                                <td className="py-5 px-6 font-semibold text-gray-400">{p.id}</td>
                                <td className="py-5 px-6 font-normal text-gray-900">{p.fullName || p.name}</td>
                                <td className="py-5 px-6">
                                    {p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : p.gender}
                                </td>
                                <td className="py-5 px-6">{p.dateOfBirth || p.dob}</td>
                                <td className="py-5 px-6">{p.phone}</td>
                                {/* ============================================================
                                    TABLE BODY: Thêm nút Xem (Eye), Sửa (Edit) và Xóa (Trash)
                                    ============================================================ */}
                                <td className="py-5 px-6">
                                    <div className="flex justify-center items-center gap-3">
                                        {/* Nút Xem - Màu xám, nhấn vào sẽ khóa input */}
                                        <button
                                            title="Xem chi tiết"
                                            onClick={() => {
                                                const formattedDate = p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '';
                                                setFormData({ ...p, dateOfBirth: formattedDate });
                                                setEditingId(p.id);
                                                setIsReadOnly(true); // KHÓA FORM
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        {/* Nút Sửa - Màu cam, nhấn vào cho phép sửa */}
                                        <button
                                            title="Chỉnh sửa"
                                            onClick={() => {
                                                const formattedDate = p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '';
                                                setFormData({ ...p, dateOfBirth: formattedDate });
                                                setEditingId(p.id);
                                                setIsReadOnly(false); // MỞ FORM ĐỂ SỬA
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all"
                                        >
                                            <Edit size={18} />
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
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl disabled:opacity-20"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
           {/* MODAL THÊM/SỬA BỆNH NHÂN */}
           {isModalOpen && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                   <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                       <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                           <h3 className="text-xl font-bold text-gray-800">
                               {/* Logic tiêu đề linh hoạt */}
                               {isReadOnly ? "Chi tiết bệnh nhân" : (editingId ? "Cập nhật thông tin bệnh nhân" : "Thêm bệnh nhân mới")}
                           </h3>
                           <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                               <X size={24} />
                           </button>
                       </div>

                       <form onSubmit={handleSubmit} className="p-6 space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {/* Họ và tên */}
                               <div className="col-span-1 md:col-span-2">
                                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                                   <input
                                       required type="text"
                                       disabled={isReadOnly}
                                       className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all ${
                                           isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:border-blue-500'
                                       }`}
                                       value={formData.fullName}
                                       onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                   />
                               </div>

                               {/* Giới tính */}
                               <div>
                                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Giới tính <span className="text-red-500">*</span></label>
                                   <select
                                       disabled={isReadOnly}
                                       className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all appearance-none ${
                                           isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:border-blue-500'
                                       }`}
                                       value={formData.gender}
                                       onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                   >
                                       <option value="MALE">Nam</option>
                                       <option value="FEMALE">Nữ</option>
                                       <option value="OTHER">Khác</option>
                                   </select>
                               </div>

                               {/* Ngày sinh */}
                               <div>
                                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngày sinh <span className="text-red-500">*</span></label>
                                   <input
                                       required type="date"
                                       disabled={isReadOnly}
                                       className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all ${
                                           isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:border-blue-500'
                                       }`}
                                       value={formData.dateOfBirth}
                                       onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                                   />
                               </div>

                               {/* Số điện thoại */}
                               <div>
                                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                                   <input
                                       required type="tel"
                                       disabled={isReadOnly}
                                       className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all ${
                                           isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:border-blue-500'
                                       }`}
                                       value={formData.phone}
                                       onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                   />
                               </div>

                               {/* Email */}
                               <div>
                                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                                   <input
                                       type="email"
                                       disabled={isReadOnly}
                                       className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all ${
                                           isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:border-blue-500'
                                       }`}
                                       value={formData.email}
                                       onChange={(e) => setFormData({...formData, email: e.target.value})}
                                   />
                               </div>

                               {/* CCCD */}
                               <div>
                                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số CCCD</label>
                                   <input
                                       type="text"
                                       disabled={isReadOnly}
                                       className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all ${
                                           isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:border-blue-500'
                                       }`}
                                       value={formData.cccd}
                                       onChange={(e) => setFormData({...formData, cccd: e.target.value})}
                                   />
                               </div>

                               {/* BHYT */}
                               <div>
                                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã thẻ BHYT</label>
                                   <input
                                       type="text"
                                       disabled={isReadOnly}
                                       className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all ${
                                           isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:border-blue-500'
                                       }`}
                                       value={formData.insurance_code}
                                       onChange={(e) => setFormData({...formData, insurance_code: e.target.value})}
                                   />
                               </div>

                               {/* Địa chỉ */}
                               <div className="col-span-1 md:col-span-2">
                                   <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ thường trú</label>
                                   <textarea
                                       rows="2"
                                       disabled={isReadOnly}
                                       className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm resize-none transition-all ${
                                           isReadOnly ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:border-blue-500'
                                       }`}
                                       value={formData.address}
                                       onChange={(e) => setFormData({...formData, address: e.target.value})}
                                   />
                               </div>
                           </div>

                           {/* Footer Buttons */}
                           <div className="flex gap-3 pt-6">
                               <button
                                   type="button"
                                   onClick={() => setIsModalOpen(false)}
                                   className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm"
                               >
                                   {isReadOnly ? "Đóng" : "Hủy bỏ"}
                               </button>

                               {/* Chỉ hiện nút Lưu/Cập nhật khi không phải chế độ Xem */}
                               {!isReadOnly && (
                                   <button
                                       type="submit"
                                       disabled={loading}
                                       className="flex-1 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm flex justify-center items-center gap-2 shadow-lg shadow-blue-100 disabled:bg-blue-300"
                                   >
                                       {loading ? <Loader2 className="animate-spin" size={18} /> : (editingId ? 'Cập nhật ngay' : 'Lưu bệnh nhân')}
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

export default PatientManagement;