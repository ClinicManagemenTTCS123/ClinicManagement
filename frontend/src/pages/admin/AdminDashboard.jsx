import React from 'react';
import { Contact, Users, Building, Calendar, Receipt, ClipboardList } from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { title: 'Bác sĩ', value: '24', subtext: '+2 tháng này', icon: <Contact size={24} className="text-blue-500" />, iconBg: 'bg-blue-50' },
        { title: 'Bệnh nhân', value: '1283', subtext: '+45 tháng này', icon: <Users size={24} className="text-blue-500" />, iconBg: 'bg-blue-50' },
        { title: 'Khoa', value: '8', subtext: '', icon: <Building size={24} className="text-blue-500" />, iconBg: 'bg-blue-50' },
        { title: 'Lịch hẹn hôm nay', value: '18', subtext: '', icon: <Calendar size={24} className="text-blue-500" />, iconBg: 'bg-blue-50' },
        { title: 'Hóa đơn chờ xử lý', value: '12', subtext: '', icon: <Receipt size={24} className="text-blue-500" />, iconBg: 'bg-blue-50' },
        { title: 'Hồ sơ bệnh án', value: '3420', subtext: '', icon: <ClipboardList size={24} className="text-blue-500" />, iconBg: 'bg-blue-50' },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                                {stat.icon}
                            </div>
                        </div>
                        {stat.subtext && (
                            <p className="text-emerald-500 text-xs font-medium">{stat.subtext}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;