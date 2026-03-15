import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Users, Droplet, Edit2, Check, X } from "lucide-react";

// --- Custom Components ---

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 ${className}`}>
        {children}
    </div>
);

const CustomBadge = ({ children, variant = "blue" }) => {
    const styles = {
        blue: "bg-blue-50 text-blue-600",
        red: "bg-red-50 text-red-500"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
    );
};

// --- Main Page Component ---

const PatientProfilePage = () => {
    // 1. Quản lý trạng thái chỉnh sửa
    const [isEditing, setIsEditing] = useState(false);

    // 2. Quản lý dữ liệu người dùng
    const [userData, setUserData] = useState({
        fullName: "Nguyễn Văn An",
        email: "nguyenvanan@email.com",
        phone: "0901 234 567",
        address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
        birthday: "1990-05-15",
        gender: "Nam",
        bloodGroup: "A+"
    });

    // Bản sao tạm thời để hủy nếu không muốn lưu
    const [tempData, setTempData] = useState({ ...userData });

    const handleEdit = () => {
        setTempData({ ...userData });
        setIsEditing(true);
    };

    const handleSave = () => {
        setUserData({ ...tempData });
        setIsEditing(false);
        // Ở đây bạn có thể gọi API để lưu vào Database
        console.log("Đã lưu dữ liệu:", tempData);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setTempData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-6 bg-[#fcfcfd] min-h-screen font-sans">

            {/* Header Section */}
            <Card className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 bg-[#0099ff] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                        {userData.fullName.split(' ').pop()?.substring(0, 2).toUpperCase() || "NA"}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{userData.fullName}</h1>
                        <p className="text-slate-500 text-sm">{userData.email}</p>
                        <div className="flex gap-2 pt-2">
                            <CustomBadge variant="blue">Bệnh nhân</CustomBadge>
                            <CustomBadge variant="red">Nhóm máu: {userData.bloodGroup}</CustomBadge>
                        </div>
                    </div>
                </div>

                {/* Nút điều khiển chính */}
                {!isEditing ? (
                    <button
                        onClick={handleEdit}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all"
                    >
                        <Edit2 size={16} /> Chỉnh sửa
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg font-medium transition-all"
                        >
                            <X size={16} /> Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0099ff] hover:bg-blue-600 text-white rounded-lg font-medium shadow-md transition-all"
                        >
                            <Check size={16} /> Lưu thay đổi
                        </button>
                    </div>
                )}
            </Card>

            {/* Thông tin cơ bản Section */}
            <Card className="p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-8">Thông tin cơ bản</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <InputField
                        label="Họ và tên" icon={User} isEditing={isEditing}
                        value={isEditing ? tempData.fullName : userData.fullName}
                        onChange={(v) => handleChange('fullName', v)}
                    />
                    <InputField
                        label="Email" icon={Mail} isEditing={isEditing}
                        value={isEditing ? tempData.email : userData.email}
                        onChange={(v) => handleChange('email', v)}
                    />
                    <InputField
                        label="Số điện thoại" icon={Phone} isEditing={isEditing}
                        value={isEditing ? tempData.phone : userData.phone}
                        onChange={(v) => handleChange('phone', v)}
                    />

                    <div className="hidden md:block"></div>

                    <div className="md:col-span-2">
                        <InputField
                            label="Địa chỉ" icon={MapPin} isEditing={isEditing}
                            value={isEditing ? tempData.address : userData.address}
                            onChange={(v) => handleChange('address', v)}
                        />
                    </div>

                    <InputField
                        label="Ngày sinh" icon={Calendar} isEditing={isEditing} type="date"
                        value={isEditing ? tempData.birthday : userData.birthday}
                        onChange={(v) => handleChange('birthday', v)}
                    />
                    <InputField
                        label="Giới tính" icon={Users} isEditing={isEditing}
                        value={isEditing ? tempData.gender : userData.gender}
                        onChange={(v) => handleChange('gender', v)}
                    />

                    <div className="w-1/2">
                        <InputField
                            label="Nhóm máu" icon={Droplet} isEditing={isEditing}
                            value={isEditing ? tempData.bloodGroup : userData.bloodGroup}
                            onChange={(v) => handleChange('bloodGroup', v)}
                        />
                    </div>
                </div>
            </Card>

            {/* Thống kê sức khỏe (Giữ nguyên) */}
            <Card className="p-8">
                <h2 className="text-lg font-bold text-slate-800 mb-6">Thống kê sức khỏe</h2>
                <div className="grid grid-cols-3 gap-4">
                    {[{ l: "Lần khám", v: "3" }, { l: "Lịch sắp tới", v: "2" }, { l: "Hóa đơn", v: "4" }].map((item, i) => (
                        <div key={i} className="bg-slate-50/80 rounded-2xl p-6 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-[#0099ff]">{item.v}</span>
                            <span className="text-sm text-slate-500 font-medium mt-1">{item.l}</span>
                        </div>
                    ))}
                </div>
            </Card>

        </div>
    );
};

// Component phụ cho Input để tái sử dụng
const InputField = ({ label, icon: Icon, value, isEditing, onChange, type = "text" }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-slate-400" />} {label}
        </label>
        {isEditing ? (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 bg-white border border-blue-200 rounded-lg text-slate-700 font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
        ) : (
            <div className="w-full p-3 bg-slate-50/80 border border-transparent rounded-lg text-slate-700 font-medium ">
                {value}
            </div>
        )}
    </div>
);

export default PatientProfilePage;