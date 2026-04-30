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
        departmentName: '',
        gender: 'MALE',
        dateOfBirth: '',
        address: '',
        notes: '',
        consultationFee: 0
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

                const data = res.data;

                // Xử lý mảng ngày tháng từ Java trả về: [YYYY, MM, DD] -> YYYY-MM-DD
                let formattedDob = '';
                if (Array.isArray(data.dateOfBirth)) {
                    const [year, month, day] = data.dateOfBirth;
                    formattedDob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                } else if (data.dateOfBirth) {
                    formattedDob = data.dateOfBirth.split('T')[0];
                }

                setFormData({
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    departmentName: data.departmentName || 'Chưa xác định',
                    gender: data.gender || 'MALE',
                    dateOfBirth: formattedDob,
                    address: data.address || '',
                    notes: data.notes || '',
                    consultationFee: data.consultationFee || 0
                });

                // Nếu backend có trả về avatar thì hiển thị
                if (data.avatar) {
                    setAvatarUrl(data.avatar);
                }

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
            // Kiểm tra dung lượng (giới hạn 2MB để tránh lỗi DB nếu lưu Base64)
            if (file.size > 2 * 1024 * 1024) {
                alert("Vui lòng chọn ảnh có dung lượng nhỏ hơn 2MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUrl(reader.result); // Lưu base64
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

            // Gửi toàn bộ dữ liệu, bao gồm cả ảnh (nếu có)
            const payload = {
                ...formData,
                avatar: avatarUrl
            };

            await axios.put(`${apiUrl}/doctors/${doctorId}`, payload);

            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert("Có lỗi xảy ra khi lưu thông tin.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-blue-500"><Loader2 className="animate-spin" size={32}/></div>;
    }

    return (
        <div className="p-4 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h1>
                    <p className="text-slate-500 text-sm">Xem và chỉnh sửa thông tin chi tiết của bạn</p>
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

                    {/* Lưới thông tin */}
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
                            <label className="text-sm font-bold text-slate-600">Giới tính</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium"
                                value={formData.gender}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Ngày sinh</label>
                            <input
                                type="date"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Địa chỉ</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium"
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Phí khám (VNĐ)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100/50 text-slate-500 transition-all text-sm font-medium cursor-not-allowed"
                                value={formData.consultationFee}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-600">Email </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-100/50   transition-all text-sm font-medium"
                                value={formData.email}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-600">Giới thiệu / Ghi chú</label>
                            <textarea
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm font-medium h-24 resize-none"
                                value={formData.notes}
                                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                placeholder="Viết vài dòng giới thiệu về kinh nghiệm, chuyên môn của bác sĩ..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end mt-8 pt-6 border-t border-gray-50">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 w-full md:w-auto"
                        >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileD;
