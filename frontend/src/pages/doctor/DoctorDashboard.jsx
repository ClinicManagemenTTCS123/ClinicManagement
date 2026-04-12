import React, { useEffect, useState } from 'react';
import { Calendar, Users, FileText, Clock, MoreVertical } from 'lucide-react';
import axios from 'axios'; // Nhớ import axios

const StatCard = ({ title, value, subValue, icon, iconBg }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start transition-all hover:shadow-md">
        <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
            <p className="text-[11px] text-gray-400 font-medium">{subValue}</p>
        </div>
        <div className={`p-3 ${iconBg} rounded-xl flex items-center justify-center`}>
            {React.cloneElement(icon, { size: 22, className: "text-blue-600" })}
        </div>
    </div>
);

const DoctorDashboard = () => {
    // State lưu dữ liệu từ API
    const [dashboardData, setDashboardData] = useState({
        appointmentsToday: 0,
        totalPatients: 0,
        totalMedicalRecords: 0,
        nextAppointmentTime: '--:--',
        nextAppointmentPatient: 'Không có',
        upcomingAppointments: []
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const doctorId = localStorage.getItem("doctorId");
                if (!doctorId) {
                    console.error("Không tìm thấy Doctor ID, vui lòng đăng nhập lại.");
                    return;
                }
                const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
                const res = await axios.get(`${apiUrl}/doctors/${doctorId}/dashboard`);

                setDashboardData(res.data);
            } catch (error) {
                console.error("Lỗi khi tải Dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Tiêu đề */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
                <p className="text-gray-500 text-sm">Hôm nay bạn có {dashboardData.appointmentsToday} lịch hẹn.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Lịch hẹn hôm nay"
                    value={dashboardData.appointmentsToday}
                    subValue="Đang cập nhật"
                    icon={<Calendar />}
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Tổng bệnh nhân"
                    value={dashboardData.totalPatients}
                    subValue="Đã từng khám"
                    icon={<Users />}
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Hồ sơ bệnh án"
                    value={dashboardData.totalMedicalRecords}
                    subValue="Đã lập"
                    icon={<FileText />}
                    iconBg="bg-blue-50"
                />
                <StatCard
                    title="Giờ khám tiếp theo"
                    value={dashboardData.nextAppointmentTime}
                    subValue={dashboardData.nextAppointmentPatient}
                    icon={<Clock />}
                    iconBg="bg-blue-50"
                />
            </div>

            {/* Bảng dữ liệu */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800">Lịch hẹn sắp tới</h2>
                    <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                        <MoreVertical size={20} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                        <tr className="text-gray-400 text-[12px] uppercase tracking-wider border-b border-gray-50">
                            <th className="px-8 py-4 font-bold">Bệnh nhân</th>
                            <th className="px-8 py-4 font-bold">Giờ khám</th>
                            <th className="px-8 py-4 font-bold">Loại khám</th>
                            <th className="px-8 py-4 font-bold">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {dashboardData.upcomingAppointments.length > 0 ? (
                            dashboardData.upcomingAppointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                                    <td className="px-8 py-5 font-semibold text-gray-700">{apt.patientName}</td>
                                    {/* Hàm format thời gian nếu cần, tạm thời lấy startTime */}
                                    <td className="px-8 py-5 text-gray-600 text-sm">
                                        {new Date(apt.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                    <td className="px-8 py-5 text-gray-600 text-sm">{apt.reason || 'Khám bệnh'}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                            apt.status === 'CONFIRMED'
                                                ? 'bg-emerald-50 text-emerald-600'
                                                : 'bg-orange-50 text-orange-600'
                                        }`}>
                                            {apt.status === 'CONFIRMED' ? 'Đã xác nhận' :
                                                apt.status === 'PENDING' ? 'Chờ xác nhận' : apt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-6 text-gray-500">Không có lịch hẹn sắp tới.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
