import React, { useState, useEffect } from 'react';
import { Calendar, Wallet, FileText, TrendingUp, Stethoscope, Plus, ChevronRight, Clock, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';

const PatientDashboard = () => {
    const patientId = localStorage.getItem("patientId");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!patientId) {
            setErrorMessage("Vui lòng đăng nhập lại.");
            setLoading(false);
            return;
        }

        const fetchDashboard = async () => {
            try {
                const response = await patientService.getDashboard(patientId);
                setData(response.data || response);
            } catch (error) {
                console.error("Lỗi:", error);
                if (error?.response?.status === 404) {
                    setErrorMessage("Không tìm thấy thông tin bệnh nhân. Vui lòng đăng nhập lại.");
                } else {
                    setErrorMessage("Đã xảy ra lỗi khi kết nối với máy chủ.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-blue-500">
                <Loader2 className="animate-spin mb-2" size={32} />
                <span className="font-medium">Đang tải dữ liệu tổng quan...</span>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-red-500 font-medium mb-4">{errorMessage}</div>
                <button
                    onClick={() => { localStorage.clear(); navigate('/login'); }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Quay lại Đăng nhập
                </button>
            </div>
        );
    }

    if (!data) return null;
    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN').format(amount || 0) + ' ₫';

    // Format ngày giờ đẹp hơn (không có giây, format giống hình 2)
    const formatDate = (dateInput) => {
        if (!dateInput) return '';
        let d;
        if (Array.isArray(dateInput)) {
            d = new Date(dateInput[0], dateInput[1]-1, dateInput[2], dateInput[3], dateInput[4]);
        } else {
            d = new Date(dateInput);
        }
        const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        return `${time}, ${date}`;
    };

    // Chuẩn hóa UI cho trạng thái
    const getApptStatusUI = (status) => {
        switch(status) {
            case 'CONFIRMED': return { label: 'ĐÃ XÁC NHẬN', className: 'text-blue-600 bg-blue-50' };
            case 'PENDING': return { label: 'CHỜ XÁC NHẬN', className: 'text-amber-600 bg-amber-50' };
            case 'COMPLETED': return { label: 'ĐÃ KHÁM', className: 'text-emerald-600 bg-emerald-50' };
            case 'CANCELED': return { label: 'ĐÃ HỦY', className: 'text-slate-500 bg-slate-100' };
            default: return { label: status, className: 'text-gray-600 bg-gray-50' };
        }
    };

    return (
        <div className="space-y-8 max-w-6xl">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                   Tổng quan hôm nay
                </h1>

            </div>

            {/* Chỉnh lại grid-cols-3 vì dữ liệu bạn đang có 3 khối */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4"><Calendar className="text-blue-500" size={20}/></div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Lịch hẹn sắp tới</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-slate-800">{data.upcomingAppointmentsCount}</span>
                        <span className="text-sm font-medium text-slate-600">lịch hẹn</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4"><Wallet className="text-amber-500" size={20}/></div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Cần thanh toán</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-slate-800">{formatCurrency(data.unpaidInvoicesTotal)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{data.unpaidInvoicesCount} hóa đơn chưa trả</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4"><FileText className="text-emerald-500" size={20}/></div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Hồ sơ bệnh án</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-slate-800">{data.totalMedicalRecords}</span>
                        <span className="text-sm font-medium text-slate-600">lần khám</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Lịch hẹn của tôi</h2>
                        <Link to="/patient/my-appointments" className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-700 transition-colors">
                            {/* Đã sửa size="{16}" thành size={16} */}
                            Xem tất cả <ChevronRight size={16} className="ml-1"/>
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-2 space-y-2 shadow-sm">
                        {data.upcomingAppointments && data.upcomingAppointments.length > 0 ? (
                            data.upcomingAppointments.map((appt) => {
                                const statusUI = getApptStatusUI(appt.status);
                                return (
                                    <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-blue-50 hover:bg-blue-50/30 transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                                                {/* Đã sửa size="{24}" thành size={24} */}
                                                <Stethoscope size={24}/>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{appt.doctorName ? `BS. ${appt.doctorName}` : 'Chưa xếp bác sĩ'}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{appt.departmentName} • {formatDate(appt.startTime)}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide shrink-0 ${statusUI.className}`}>
                                            {statusUI.label}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">Không có lịch hẹn nào sắp tới</div>
                        )}

                        <Link to="/patient/book-appointment" className="w-full py-3.5 mt-2 border border-dashed border-blue-200 rounded-xl text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                            {/* Đã sửa size="{18}" thành size={18} */}
                            <Plus size={18}/> Đặt lịch hẹn mới
                        </Link>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Hóa đơn gần đây</h2>
                        <Link to="/patient/invoices" className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-700 transition-colors">
                            {/* Đã sửa size="{16}" thành size={16} */}
                            Tất cả <ChevronRight size={16} className="ml-1"/>
                        </Link>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5 shadow-sm">
                        {data.recentInvoices && data.recentInvoices.length > 0 ? (
                            data.recentInvoices.map((inv) => (
                                <div key={inv.id} className="flex justify-between items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Hóa đơn {inv.id}</h4>
                                        <p className="text-[11px] text-slate-400 mt-1">{formatDate(inv.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-slate-800">{formatCurrency(inv.total)}</p>
                                        <p className={`text-[10px] font-bold mt-1 ${inv.status === 'UNPAID' ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            {inv.status === 'UNPAID' ? 'Chưa thanh toán' : 'Đã thanh toán'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 text-sm py-4">Chưa có hóa đơn nào</div>
                        )}
                    </div>
                </div>
            </div>

            {data.latestMedicalRecord && (
                <div className="space-y-4 mt-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">Hồ sơ khám gần nhất</h2>
                        <Link to="/patient/medical-records" className="text-sm font-semibold text-blue-600 flex items-center hover:text-blue-700 transition-colors">
                            {/* Đã sửa size="{16}" thành size={16} */}
                            Xem tất cả <ChevronRight size={16} className="ml-1"/>
                        </Link>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400 mb-1">
                                    {/* Đã sửa size="{16}" thành size={16} */}
                                    <Clock size={16}/>
                                    <span className="text-xs font-medium">{formatDate(data.latestMedicalRecord.createdAt)}</span>
                                </div>
                                <h3 className="text-base font-bold text-slate-800">BS. {data.latestMedicalRecord.doctorName} <span className="text-slate-400 font-normal ml-1">• {data.latestMedicalRecord.departmentName || 'Đa khoa'}</span></h3>

                                <p className="text-sm text-slate-700 mt-2">
                                    <span className="font-semibold text-slate-800 mr-1">Chẩn đoán:</span>
                                    {data.latestMedicalRecord.diagnosis}
                                </p>
                            </div>

                            <div className="space-y-2 md:border-l md:border-gray-100 md:pl-8">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đơn thuốc & Ghi chú</p>
                                <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                    {data.latestMedicalRecord.prescription || <span className="text-slate-400 italic">Không có đơn thuốc</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDashboard;
