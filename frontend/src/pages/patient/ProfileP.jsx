import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { User, Phone, Mail, MapPin, CreditCard, Shield, Save, Edit2, X, Loader2, Calendar } from 'lucide-react';

const PatientProfile = () => {
    const patientId = localStorage.getItem("patientId") || "1";
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        fetchPatientData();
    }, []);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const response = await patientService.getPatientById(patientId);
            const data = response.data || response;
            setFormData(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu:", error);
            alert("Không tìm thấy bệnh nhân ID = " + patientId);
        } finally {
            setLoading(false);
        }
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                id: parseInt(patientId)
            };
            await patientService.updatePatient(patientId, payload);
            alert("Cập nhật dữ liệu thành công!");
            setIsEditing(false);
            fetchPatientData();
        } catch (error) {
            alert("Cập nhật thất bại!");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-[#0095ff]">
            <Loader2 className="animate-spin mb-2" size={32} />
            <span className="font-medium">Đang kết nối database...</span>
        </div>
    );

    if (!formData) return <div className="p-10 text-center text-red-500 font-bold underline">Lỗi: Không load được dữ liệu!</div>;

    return (
        <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-5">

                        <div className="w-16 h-16 bg-[#0095ff] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {formData.fullName?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{formData.fullName}</h1>
                            <p className="text-gray-400 text-sm">{formData.email}</p>
                            <div className="mt-1 flex gap-2">
                                <span className="bg-blue-50 text-[#0095ff] px-3 py-0.5 rounded-full text-xs font-semibold">Bệnh nhân</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center justify-center gap-2 bg-[#f8fafc] text-gray-600 px-5 py-2 rounded-lg border border-gray-200 font-semibold hover:bg-gray-100 transition-all w-full">
                                <Edit2 size={16} /> Chỉnh sửa
                            </button>
                        ) : (
                            <>
                                <button onClick={handleSave} className="flex items-center justify-center gap-2 bg-[#0095ff] text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all w-full">
                                    <Save size={16} /> Lưu thay đổi
                                </button>
                                <button onClick={() => { setIsEditing(false); fetchPatientData(); }} className="flex items-center justify-center gap-2 bg-gray-50 text-gray-500 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                                    <X size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Form Section */}
                <div className="p-6 md:p-8">
                    <h3 className="text-gray-800 font-bold text-lg mb-6">Thông tin cơ bản</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                        {/* Render Fields */}
                        {[
                            { label: 'Họ và tên', name: 'fullName', icon: <User size={14}/>, type: 'text' },
                            { label: 'Email', name: 'email', icon: <Mail size={14}/>, type: 'email' },
                            { label: 'Số điện thoại', name: 'phone', icon: <Phone size={14}/>, type: 'text' },
                            { label: 'Ngày sinh', name: 'dateOfBirth', icon: <Calendar size={14}/>, type: 'date' },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-gray-400 flex items-center gap-2 ml-1 uppercase tracking-wide">
                                    {field.icon} {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 rounded-xl border transition-all ${
                                        isEditing
                                        ? 'border-blue-200 bg-white focus:ring-2 focus:ring-blue-100 focus:border-[#0095ff] outline-none'
                                        : 'border-transparent bg-[#f8fafc] text-gray-600 cursor-not-allowed'
                                    }`}
                                />
                            </div>
                        ))}

                        {/* Giới tính */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[13px] font-semibold text-gray-400 flex items-center gap-2 ml-1 uppercase tracking-wide">
                                <User size={14}/> Giới tính
                            </label>
                            <select
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full p-3 rounded-xl border transition-all ${
                                    isEditing ? 'border-blue-200 bg-white focus:border-[#0095ff] outline-none' : 'border-transparent bg-[#f8fafc] text-gray-600'
                                }`}
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>

                        {/* Các trường còn lại */}
                        {[
                            { label: 'CCCD/CMND', name: 'cccd', icon: <CreditCard size={14}/>, type: 'text' },
                            { label: 'Mã số bảo hiểm', name: 'insuranceCode', icon: <Shield size={14}/>, type: 'text' },
                        ].map((field) => (
                            <div key={field.name} className="flex flex-col gap-1.5">
                                <label className="text-[13px] font-semibold text-gray-400 flex items-center gap-2 ml-1 uppercase tracking-wide">
                                    {field.icon} {field.label}
                                </label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full p-3 rounded-xl border transition-all ${
                                        isEditing ? 'border-blue-200 bg-white outline-none' : 'border-transparent bg-[#f8fafc] text-gray-600'
                                    }`}
                                />
                            </div>
                        ))}

                        {/* Địa chỉ - Full width */}
                        <div className="md:col-span-2 flex flex-col gap-1.5 mt-2">
                            <label className="text-[13px] font-semibold text-gray-400 flex items-center gap-2 ml-1 uppercase tracking-wide">
                                <MapPin size={14}/> Địa chỉ thường trú
                            </label>
                            <textarea
                                name="address"
                                rows="2"
                                value={formData.address || ''}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full p-3 rounded-xl border transition-all resize-none ${
                                    isEditing ? 'border-blue-200 bg-white outline-none' : 'border-transparent bg-[#f8fafc] text-gray-600'
                                }`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
