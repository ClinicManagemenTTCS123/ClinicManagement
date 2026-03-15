import React, { useState, useRef } from 'react';
import { Camera, Save } from 'lucide-react';

const ProfileD = () => {
    /* =============================================
       1. PHẦN CODE LOGIC (Logic & State)
       ============================================= */

    // Quản lý trạng thái hiển thị ảnh đại diện
    const [avatarUrl, setAvatarUrl] = useState(null);

    // Tham chiếu đến thẻ input file ẩn để kích hoạt khi bấm nút Camera
    const fileInputRef = useRef(null);

    // Hàm xử lý khi người dùng chọn file ảnh từ máy tính
    const handleFileChange = (event) => {
        const file = event.target.files[0];

        // Kiểm tra nếu có file và file đó phải là định dạng hình ảnh
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();

            // Sau khi đọc xong file, cập nhật URL vào State để hiển thị lên giao diện
            reader.onloadend = () => {
                setAvatarUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Hàm giả lập cú click vào input file
    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    // Hàm xử lý khi nhấn nút "Lưu thay đổi"
    const handleSave = () => {
        alert("Đã gửi yêu cầu lưu dữ liệu!");
        // Ở đây bạn sẽ viết code gọi API (Axios/Fetch) để lưu vào Database
    };


    /* =============================================
       2. PHẦN CODE FRONTEND (UI & Layout)
       ============================================= */
    return (
        <div className="p-2 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-3xl">

                {/* Tiêu đề trang */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân</h1>
                    <p className="text-slate-500 text-sm">Chỉnh sửa thông tin cá nhân của bạn</p>
                </div>

                {/* Card nội dung chính */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-700 mb-6">Thông tin bác sĩ</h3>

                    {/* Header: Avatar & Tên */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative">
                            {/* Khung chứa ảnh/chữ viết tắt */}
                            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold overflow-hidden border-2 border-white shadow-sm">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    "NA"
                                )}
                            </div>

                            {/* Logic: Input file này luôn bị ẩn */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileChange}
                            />

                            {/* Nút bấm Camera (Kích hoạt logic upload) */}
                            <button
                                onClick={triggerUpload}
                                className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full border-2 border-white text-white hover:bg-blue-600 transition-all shadow-md active:scale-90"
                            >
                                <Camera size={14} />
                            </button>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">Nguyễn Văn An</h2>
                            <p className="text-slate-500 font-medium">Nội tổng quát</p>
                        </div>
                    </div>

                    {/* Form Fields: Các ô nhập liệu */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Họ và tên</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                defaultValue="Nguyễn Văn An"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Số điện thoại</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                defaultValue="0987654321"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Email</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                defaultValue="an.nguyen@clinicpro.vn"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-600">Chuyên khoa</label>
                            <input
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                                defaultValue="Nội tổng quát"
                            />
                        </div>
                    </div>

                    {/* Nút bấm lưu (Kích hoạt logic lưu) */}
                    <button
                        onClick={handleSave}
                        className="mt-8 flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm active:shadow-inner"
                    >
                        <Save size={18} />
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileD;