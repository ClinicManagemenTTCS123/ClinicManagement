import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit3, Loader2, X, Save, FileText,Calendar, User, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react';
import medicalRecordService from '../../services/medicalRecordService';

const MedicalRecord = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('edit'); // 'edit' hoặc 'view'

  const initialFormState = {
    id: '',
    appointmentId: '',
    patientId: '',
    patientName: '',
    doctorId: '',
    doctorName: '',
    symptoms: '',
    diagnosis: '',
    prescription: '',
    notes: '',
    toothDetails: '',
    indications: '',
    services: '',
    createdAt: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadRecords();
  }, [searchTerm]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordService.getAllRecords(searchTerm);
      setRecords(data);
    } catch (error) {
      console.error("Lỗi load dữ liệu", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (record, mode) => {
    setFormData({ ...initialFormState, ...record });
    setViewMode(mode);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    if (viewMode === 'view') return;
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (viewMode === 'view') return;
    try {
      await medicalRecordService.updateRecord(formData.id, formData);
      alert("Cập nhật hồ sơ thành công!");
      setIsModalOpen(false);
      loadRecords();
    } catch (error) {
      alert("Lỗi khi cập nhật!");
    }
  };


    // Số lượng bản ghi trên mỗi trang
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // Tính toán dữ liệu cho trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // 'records' là mảng lấy từ API
    const currentItems = records.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(records.length / itemsPerPage);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      // Cuộn lên đầu bảng khi chuyển trang (tùy chọn)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset về trang 1 mỗi khi tìm kiếm
    useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm]);
  return (
    <div className="p-5 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm p-5">

        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">

            <h1 className="text-2xl font-bold text-[#1e293b]">Hồ sơ bệnh án</h1>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm mã hồ sơ, tên bệnh nhân..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table danh sách */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#94a3b8] text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-4 px-4 font-semibold">Mã HS</th>
                <th className="py-4 px-4 font-semibold">Bệnh nhân</th>
                <th className="py-4 px-4 font-semibold">Bác sĩ khám</th>
                <th className="py-4 px-4 font-semibold">Ngày tạo</th>
                <th className="py-4 px-4 font-semibold">Chẩn đoán</th>
                <th className="py-4 px-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
              ) : currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors border-b border-gray-50">
                  <td className="py-4 px-4 font-medium text-blue-600">HS-{item.id}</td>
                  <td className="py-4 px-4 font-semibold text-gray-800">{item.patientName}</td>
                  <td className="py-4 px-4 text-gray-600">{item.doctorName}</td>
                  <td className="py-4 px-4 text-gray-500">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="py-4 px-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">{item.diagnosis}</span></td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleOpenModal(item, 'view')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all" title="Xem">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleOpenModal(item, 'edit')} className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-all" title="Sửa">
                        <Edit3 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div className="mt-6 px-4 py-6 flex items-center justify-between border-t border-gray-50">
            <p className="text-sm text-gray-400 font-medium">
                Hiển thị {currentItems.length} trên {records.length} hồ sơ
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

      {/* MODAL CHUNG (VIEW & EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {viewMode === 'view' ? 'Chi tiết hồ sơ bệnh án' : 'Cập nhật hồ sơ bệnh án'}
                </h2>
                <p className="text-sm text-gray-500">Mã hồ sơ: HS-{formData.id}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Thông tin hành chính (Read Only) */}
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-2">
                   <div className="flex items-center gap-3">
                      <User className="text-blue-500" size={18}/>
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">Bệnh nhân</p>
                        <p className="font-semibold text-gray-700">{formData.patientName || 'N/A'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Stethoscope className="text-green-500" size={18}/>
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">Bác sĩ phụ trách</p>
                        <p className="font-semibold text-gray-700">{formData.doctorName || 'N/A'}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Calendar className="text-orange-500" size={18}/>
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">Ngày lập hồ sơ</p>
                        <p className="font-semibold text-gray-700">{new Date(formData.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                   </div>
                </div>

                {/* Các trường từ Database */}
                <div className="md:col-span-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Răng điều trị</label>
                  <input
                    name="toothDetails"
                    value={formData.toothDetails || ''}
                    onChange={handleChange}
                    disabled={viewMode === 'view'}
                    placeholder="Ví dụ: Răng số 6..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dịch vụ thực hiện</label>
                  <input
                    name="services"
                    value={formData.services || ''}
                    onChange={handleChange}
                    disabled={viewMode === 'view'}
                    placeholder="Lấy cao răng, hàn răng..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Triệu chứng lâm sàng</label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms || ''}
                    onChange={handleChange}
                    disabled={viewMode === 'view'}
                    rows="2"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chẩn đoán của bác sĩ</label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis || ''}
                    onChange={handleChange}
                    disabled={viewMode === 'view'}
                    rows="2"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chỉ định / Hướng dẫn</label>
                  <textarea
                    name="indications"
                    value={formData.indications || ''}
                    onChange={handleChange}
                    disabled={viewMode === 'view'}
                    rows="2"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Đơn thuốc </label>
                  <textarea
                    name="prescription"
                    value={formData.prescription || ''}
                    onChange={handleChange}
                    disabled={viewMode === 'view'}
                    rows="3"
                    placeholder="Tên thuốc, liều dùng..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú  </label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    disabled={viewMode === 'view'}
                    rows="2"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:text-gray-500 resize-none"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-6 border-t flex justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                  {viewMode === 'view' ? 'Đóng' : 'Hủy bỏ'}
                </button>
                {viewMode === 'edit' && (
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200 font-medium"
                  >
                    <Save size={20} />
                    Lưu hồ sơ
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

export default MedicalRecord;