import React, { useState, useEffect, useRef } from 'react';
import { Camera, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

const ProfileD = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        departmentName: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const doctorId = localStorage.getItem("doctorId");
                if (!doctorId) return;

                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
                const res = await axios.get(`${apiUrl}/doctors/${doctorId}`, {
                    params: { _t: new Date().getTime() }
                });

                setFormData({
                    fullName: res.data.fullName || '',
                    phone: res.data.phone || '',
                    email: res.data.email || '',
                    departmentName: res.data.departmentName || 'Chưa xác định'
                });
            } catch (error) {
                console.error("Lỗi lấy thông tin:", error);
                alert("Không thể tải thông tin hồ sơ.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const doctorId = localStorage.getItem("doctorId");
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

            await axios.put(`${apiUrl}/doctors/${doctorId}`, {
                fullName: formData.fullName,
                phone: formData.phone
            });

            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert("Có lỗi xảy ra khi lưu thông tin.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Đang tải thông tin hồ sơ...</div>;
    }

    return (
        <div className="p-2 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-3xl">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h1>
                    <p className="text-slate-500 text-sm">Xem và chỉnh sửa thông tin liên hệ của bạn</p>
                </div>

                <div className="bg-white rounded-[24px] shadow-sm p-8 border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                    <h3 className="text-lg font-bold text-slate-700 mb-6 border-b border-gray-50 pb-4">Thông tin bác sĩ</h3>

                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 bg-blue-100 rounded-[24px] flex items-center justify-center text-blue-600 text-2xl font-bold overflow-hidden border border-blue-50 shadow-sm">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    formData.fullName.charAt(0) || "BS"
                                )}
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            <button
                                onClick={triggerUpload}
                                className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-xl border-2 border-white text-white hover:bg-blue-700 transition-all shadow-md"
                            >
                                <Camera size={14} />
                            </button>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">{formData.fullName}</h2>
                            <p className="text-blue-600 font-bold text-sm bg-blue-50 inline-block px-3 py-1 rounded-lg mt-2">
                                {formData.departmentName}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Họ và tên</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Số điện thoại</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Email (Tài khoản)</label>
                            <input
                                type="email"
                                readOnly
                                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-500 transition-all text-sm font-medium cursor-not-allowed"
                                value={formData.email}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Chuyên khoa</label>
                            <input
                                type="text"
                                readOnly
                                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-500 transition-all text-sm font-medium cursor-not-allowed"
                                value={formData.departmentName}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="mt-8 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 w-full md:w-auto"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileD;
