import React, { useState } from 'react';
import { Save } from 'lucide-react';

const MedicalRecordD = () => {
    // State quản lý dữ liệu form
    const [formData, setFormData] = useState({
        patientName: '', // Chuyển từ ID sang nhập tên trực tiếp
        symptoms: '',
        diagnosis: '',
        prescription: '',
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu hồ sơ bệnh án:", formData);
        alert("Đã lưu hồ sơ cho bệnh nhân: " + formData.patientName);
    };

    return (
        <div className="max-w-4xl">
            {/* --- TIÊU ĐỀ TRANG --- */}
            <div className="mb-8">
                <h1 className="text-[32px] font-bold text-gray-950 tracking-tight">Hồ sơ bệnh án</h1>
                <p className="text-gray-500 text-[15px] mt-1">
                    Cập nhật hồ sơ bệnh án sau khi khám
                </p>
            </div>

            {/* --- FORM TẠO HỒ SƠ --- */}
            <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
                <h2 className="text-[18px] font-bold text-gray-950 mb-6">Tạo hồ sơ bệnh án</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Bệnh nhân - Nhập text bình thường */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-semibold text-gray-700">Bệnh nhân</label>
                        <input
                            type="text"
                            placeholder="Nhập tên bệnh nhân..."
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-[14px] text-[15px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                            value={formData.patientName}
                            onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                            required
                        />
                    </div>

                    {/* Triệu chứng */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-semibold text-gray-700">Triệu chứng</label>
                        <textarea
                            placeholder="Mô tả triệu chứng của bệnh nhân..."
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-[14px] text-[15px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                            value={formData.symptoms}
                            onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                        />
                    </div>

                    {/* Chẩn đoán */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-semibold text-gray-700">Chẩn đoán</label>
                        <input
                            type="text"
                            placeholder="Nhập chẩn đoán..."
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-[14px] text-[15px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                        />
                    </div>

                    {/* Đơn thuốc */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-semibold text-gray-700">Đơn thuốc</label>
                        <textarea
                            placeholder="Nhập đơn thuốc..."
                            rows="4"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-[14px] text-[15px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                            value={formData.prescription}
                            onChange={(e) => setFormData({...formData, prescription: e.target.value})}
                        />
                    </div>

                    {/* Ghi chú của bác sĩ */}
                    <div className="space-y-2">
                        <label className="text-[15px] font-semibold text-gray-700">Ghi chú của bác sĩ</label>
                        <textarea
                            placeholder="Ghi chú thêm..."
                            rows="3"
                            className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-[14px] text-[15px] outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        />
                    </div>

                    {/* Nút lưu hồ sơ bệnh án */}
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-3 bg-[#A5C9FF] hover:bg-[#94bcf7] text-blue-900 font-bold rounded-[14px] transition-all shadow-sm active:scale-95"
                    >
                        <Save size={18} />
                        Lưu hồ sơ bệnh án
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MedicalRecordD;