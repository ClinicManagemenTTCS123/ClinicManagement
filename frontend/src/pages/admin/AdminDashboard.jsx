import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../../services/admindashboardService';
import { Users, UserPlus, Building2, CalendarDays, ReceiptText, FileText } from 'lucide-react';

const AdminDashboard = () => {
    const [summary, setSummary] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        totalDepartments: 0,
        appointmentsToday: 0,
        pendingInvoices: 0,
        totalMedicalRecords: 0
    });
    const [loading, setLoading] = useState(true);

    const loadDashboardData = async () => {
        try {
            const data = await getDashboardSummary();
            setSummary(data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Component con
    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value.toLocaleString()}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="text-blue-600" />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Tổng quan hệ thống</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Bác sĩ"
                    value={summary.totalDoctors}
                    icon={Users}
                    color="bg-blue-50"
                />
                <StatCard
                    title="Bệnh nhân"
                    value={summary.totalPatients}
                    icon={UserPlus}
                    color="bg-green-50"
                />
                <StatCard
                    title="Khoa"
                    value={summary.totalDepartments}
                    icon={Building2}
                    color="bg-purple-50"
                />
                <StatCard
                    title="Lịch hẹn hôm nay"
                    value={summary.appointmentsToday}
                    icon={CalendarDays}
                    color="bg-orange-50"
                />
                <StatCard
                    title="Hóa đơn chờ xử lý"
                    value={summary.pendingInvoices}
                    icon={ReceiptText}
                    color="bg-red-50"
                />
                <StatCard
                    title="Hồ sơ bệnh án"
                    value={summary.totalMedicalRecords}
                    icon={FileText}
                    color="bg-teal-50"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;