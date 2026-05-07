import React from 'react';
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    ArrowRight, Calendar, Users, FileText,
    BarChart3, ShieldCheck, Bell, Check, Star,
    Plus, UserCog, Banknote, Activity
} from "lucide-react";
import clinic from "../assets/clinic.png";
import { Link } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const features = [
        {
            title: "Tối ưu hóa Điều phối Lịch hẹn",
            desc: "Hệ thống hóa quy trình đăng ký khám, giúp chủ phòng khám theo dõi sát sao lưu lượng bệnh nhân và tối ưu hóa thời gian làm việc của bác sĩ.",
            icon: <Calendar className="w-8 h-8" />
        },
        {
            title: "Quản trị Nhân sự & Chuyên khoa",
            desc: "Dễ dàng thiết lập cơ cấu tổ chức, quản lý hồ sơ đội ngũ y bác sĩ và phân tách danh mục chuyên khoa nha khoa một cách khoa học.",
            icon: <UserCog className="w-8 h-8" />
        },
        {
            title: "Số hóa Hồ sơ Nha khoa (EMR)",
            desc: "Chuyển đổi toàn bộ bệnh án giấy sang hồ sơ điện tử. Cho phép lưu trữ lịch sử điều trị bệnh nhân.",
            icon: <FileText className="w-8 h-8" />
        },
        {
            title: "Kiểm soát Tài chính Tự động",
            desc: "Tự động khởi tạo hóa đơn phí khám ngay khi đặt lịch, giúp chủ phòng khám quản lý dòng tiền minh bạch, chính xác và chống thất thoát.",
            icon: <Banknote className="w-8 h-8" />
        },
        {
            title: "Quản lý Dữ liệu Khách hàng",
            desc: "Lưu trữ tập trung thông tin bệnh nhân, giúp phòng khám xây dựng cơ sở dữ liệu khách hàng chất lượng để phục vụ các kế hoạch chăm sóc lâu dài.",
            icon: <Users className="w-8 h-8" />
        },
        {
            title: "Hệ thống Lưu trữ & Báo cáo",
            desc: "Tổng hợp toàn bộ dữ liệu từ lịch hẹn, hóa đơn đến bệnh án vào một hệ thống duy nhất, giúp chủ phòng khám có cái nhìn tổng thể về tình hình vận hành.",
            icon: <BarChart3 className="w-8 h-8" />
        },
    ];

    return (
        <div className="min-h-screen bg-white font-['Inter',_sans-serif] text-slate-900 scroll-smooth">
            {/* 1. NAVBAR - THÊM MÀU NỀN DỊU */}
            <nav className="fixed top-0 w-full bg-[#f0f9ff]/90 backdrop-blur-md z-50 border-b border-blue-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer select-none">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#3fa2d7] via-[#3491c2] to-[#1e60a3] rounded-[1.25rem] flex items-center justify-center text-white shadow-[0_10px_25px_-4px_rgba(63,162,215,0.6)] transform transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-105">
                                <span className="text-2xl font-black italic tracking-tighter">P</span>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-50">
                                    <Plus className="w-3.5 h-3.5 text-[#3fa2d7] stroke-[4]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col -space-y-1.5 text-left">
            <span className="text-2xl font-black tracking-tighter text-slate-900 flex items-center">
                PITI
                <span className="ml-1 bg-gradient-to-r from-[#3fa2d7] to-[#1e60a3] bg-clip-text text-transparent">
                    Clinic
                </span>
            </span>
                            <div className="flex items-center gap-1.5">
                                <div className="h-[1px] w-3 bg-[#3fa2d7]/40"></div>
                                <span className="text-[10px] font-bold text-[#3fa2d7] uppercase tracking-[0.25em]">
                    Medical System
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:flex gap-10">
                        <a href="#features" className="text-sm font-bold text-slate-600 hover:text-[#3fa2d7] transition-colors">Tính năng</a>
                        <a href="#how-it-works" className="text-sm font-bold text-slate-600 hover:text-[#3fa2d7] transition-colors">Quy trình</a>
                        <a href="#testimonials" className="text-sm font-bold text-slate-600 hover:text-[#3fa2d7] transition-colors">Đánh giá</a>
                        <a href="#contact" className="text-sm font-bold text-slate-600 hover:text-[#3fa2d7] transition-colors">Liên hệ</a>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/login">
                        <Button variant="ghost" className="text-slate-600 font-bold hover:bg-blue-100/50">Đăng nhập</Button>
                        </Link>

                        <Link to="/register">
                        <Button className="bg-gradient-to-r from-[#3197D4] to-[#6ECFF6] hover:bopacity-8 text-white font-medium shadow-md transition-all active:scale-95 text-sm">Bắt đầu ngay</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* 2. HERO SECTION - CẬP NHẬT NỘI DUNG MỚI */}
                <section className="pt-60 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-12">
                        <h1 className="text-[3.8rem] font-black text-[#0F172A] leading-[1.1] tracking-tighter">
                            Quản lý phòng khám <br />
                            <span className="bg-gradient-to-r from-[#3197D4] via-[#4BB6E9] to-[#6ECFF6] bg-clip-text text-transparent">
        thông minh
    </span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                            PITI Clinic mang đến nền tảng quản lý phòng khám hiện đại, <br className="hidden md:block" />
                            để bạn tập trung trọn vẹn vào việc chăm sóc bệnh nhân.
                        </p>

                        <Button
                        onClick={() => navigate("/login")}
                            className="bg-gradient-to-r from-[#3197D4] to-[#6ECFF6] hover:opacity-90 text-white font-bold h-16 px-10 text-lg rounded-xl shadow-[0_4px_14px_0_rgba(63,162,215,0.4)] border-none flex items-center gap-3 transition-all group active:scale-95"
                        >
                            Bắt đầu sử dụng
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </Button>

                    </div>

                    {/* Ảnh Mockup */}
                    <div className="relative">
                        <div className="bg-[#e0f2fe] rounded-[50px] p-4 md:p-6 aspect-[4/3] overflow-hidden border border-blue-50 shadow-inner">
                            <img
                                src={clinic}
                                alt="Giao diện phần mềm"
                                className="w-full h-full object-cover rounded-2xl shadow-2xl transform rotate-[-3deg] hover:rotate-0 transition-all duration-700"
                            />
                        </div>

                    </div>
                </section>

                {/* 4. TÍNH NĂNG NỔI BẬT */}
                <section id="features" className="py-32 px-6 bg-[#f8fafc]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            {/* Phóng to font size (text-2xl) và tăng khoảng cách tracking */}
                            <h3 className="text-[#3fa2d7] font-black text-2xl md:text-3xl tracking-[0.2em] uppercase">
                                Tính năng nổi bật
                            </h3>

                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {features.map((f, i) => (
                                <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-blue-50 hover:shadow-2xl hover:shadow-blue-200/40 hover:-translate-y-2 transition-all duration-300 group">
                                    <div className="w-16 h-16 bg-blue-50 text-[#3fa2d7] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#3fa2d7] group-hover:text-white transition-colors duration-300">
                                        {f.icon}
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{f.title}</h4>
                                    <p className="text-slate-500 leading-relaxed font-medium text-sm md:text-base">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. QUY TRÌNH - TỐI ƯU UI/UX */}
                <section id="how-it-works" className="py-32 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24 space-y-2"> {/* Giảm space-y để sub-title và title gần nhau hơn */}
                            <h3 className="text-[#3fa2d7] font-black text-sm tracking-[0.3em] uppercase opacity-80">
                                Quy trình
                            </h3>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                                Bắt đầu chỉ với 3 bước
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto relative">
                            {/* Đường line mờ kết nối các bước trên desktop */}
                            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[2px] bg-slate-100/80 -z-0"></div>

                            {[
                                { step: "01", title: "Đăng ký nhanh", desc: "Tạo tài khoản và thiết lập hồ sơ phòng khám chỉ trong vài phút." },
                                { step: "02", title: "Nhập dữ liệu", desc: "Nhập liệu thông tin bệnh nhân và đội ngũ bác sĩ trực quan, khoa học." },
                                { step: "03", title: "Bắt đầu quản lý", desc: "Dễ dàng nắm bắt tình hình phòng khám qua hệ thống quản lý hóa đơn và bệnh án." }
                            ].map((item, i) => (
                                <div key={i} className="text-center flex flex-col items-center group relative z-10">
                                    {/* Box số: Chỉnh shadow-blue-100 để bóng đổ mịn và xanh nhẹ như ảnh */}
                                    <div className="w-20 h-20 bg-white text-[#3fa2d7] rounded-[2rem] flex items-center justify-center text-3xl font-black mb-10
                        shadow-[0_20px_50px_rgba(186,230,253,0.4)]
                        group-hover:bg-[#3fa2d7] group-hover:text-white group-hover:-translate-y-2
                        transition-all duration-500 ease-out border border-blue-50/50">
                                        {item.step}
                                    </div>

                                    <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">
                                        {item.title}
                                    </h4>


                                    <p className="text-slate-500 text-[1.05rem] font-medium leading-[1.7] px-2">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* 5. TESTIMONIALS - ĐÁNH GIÁ */}
                <section id="testimonials" className="py-32 px-6 bg-[#F0F9FF]/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20 space-y-4">
                            <h3 className="text-[#0EA5E9] font-black text-sm tracking-[0.3em] uppercase">Đánh giá</h3>
                            <h2 className="text-5xl font-black text-slate-900">Tin tưởng bởi các bác sĩ</h2>
                            <p className="text-slate-500 text-xl font-medium">Đồng hành cùng hàng trăm phòng khám trên hành trình chăm sóc sức khỏe.</p>
                        </div>


                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { name: "BS. Nguyễn Thu Hương ", role: "Phòng khám Nha khoa", text: "Từ khi áp dụng hệ thống, quy trình đặt lịch và làm thủ tục trở nên chuyên nghiệp hơn hẳn. Bệnh nhân không còn phải chờ đợi lâu . " },
                                { name: "BS. Trần Minh Nguyệt", role: "Phòng khám Nha khoa", text: "Giao diện rất hiện đại và mượt mà. Mọi thông tin từ hồ sơ bệnh án đến lịch hẹn đều được tìm kiếm rất nhanh." },
                                { name: "BS. Lê Phan Anh", role: "Phòng khám Nha khoa", text: "Dữ liệu báo cáo cực kỳ chi tiết giúp tôi dễ dàng kiểm tra các hóa đơn đã thanh toán hoặc còn nợ chỉ trong vài giây." }
                            ].map((review, i) => (
                                <div key={i} className="bg-white p-10 rounded-[3rem] border border-blue-50 shadow-sm hover:shadow-xl transition-all duration-300">
                                    <div className="flex gap-1 mb-8">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 mb-10 text-lg italic leading-relaxed font-medium">"{review.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-[#0EA5E9]">BS</div>
                                        <div>
                                            <div className="font-black text-slate-900 text-lg">{review.name}</div>
                                            <div className="text-sm text-[#0EA5E9] font-bold uppercase tracking-wider">{review.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. CONTACT / CTA SECTION */}
                <section id="contact" className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="bg-gradient-to-br from-[#3fa2d7] to-[#0369a1] rounded-[4rem] p-16 md:p-28 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 space-y-10">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
                                Sẵn sàng chuyển đổi số cho phòng khám của bạn?
                            </h2>

                            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                                <Button size="lg"
                                onClick={() => navigate("/register")}
                                className="bg-white text-[#3fa2d7] hover:bg-blue-50 font-black h-20 px-12 rounded-2xl text-xl transition-all active:scale-95">

                                    Bắt đầu ngay miễn phí
                                </Button>
                                <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 font-black h-20 px-12 rounded-2xl text-xl">
                                    Tìm hiểu thêm
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* 8. FOOTER */}
            <footer className="bg-white pt-24 pb-12 border-t border-slate-100 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#3fa2d7] rounded-lg flex items-center justify-center text-white font-black">P</div>
                            <span className="text-xl font-black">PITI Clinic</span>
                        </div>
                        <p className="text-slate-500 font-medium">Nền tảng quản lý phòng khám.</p>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest text-sm">Sản phẩm</h4>
                        <div className="flex flex-col gap-2 text-slate-500 font-medium">
                            <a href="#">Tính năng</a>
                            <a href="#">Bảng giá</a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest text-sm">Hỗ trợ</h4>
                        <div className="flex flex-col gap-2 text-slate-500 font-medium">
                            <a href="#">Trung tâm giúp đỡ</a>
                            <a href="#">Liên hệ</a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-black uppercase tracking-widest text-sm">Pháp lý</h4>
                        <div className="flex flex-col gap-2 text-slate-500 font-medium">
                            <a href="#">Chính sách bảo mật</a>
                            <a href="#">Điều khoản sử dụng</a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-50 text-center text-slate-400 text-sm font-medium">
                    © 2026 PITI Clinic.
                </div>
            </footer>
        </div>
    );
};

export default Home;
