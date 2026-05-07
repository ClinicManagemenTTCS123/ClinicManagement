import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, User, Mail, Lock, Eye, EyeOff, CircleUserRound } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. Tạo Schema validation bao gồm cả username
const formSchema = z.object({
    fullName: z.string().min(1, 'Vui lòng nhập họ và tên'),
    username: z.string()
        .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
        .regex(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập không được chứa dấu hoặc khoảng trắng'),
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không đúng định dạng'),
    username: z.string().min(4, 'Tên đăng nhập phải có ít nhất 4 ký tự'), // Thêm username
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ['confirmPassword'],
});
export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            username: '', // Thêm default value
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

            // Gửi đủ 5 trường dữ liệu lên Backend
            const response = await axios.post(`${apiUrl}/auth/register`, {
                fullName: data.fullName.trim(),
                email: data.email.trim(),
                username: data.username.trim(), // Thêm username vào payload
                password: data.password,
                confirmPassword: data.confirmPassword
            });

            alert(response.data.message || 'Đăng ký thành công!');
            navigate('/login');

        } catch (error) {
            const errorMessage = error.response?.data || "Có lỗi xảy ra khi đăng ký!";
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-[#eaf5fa] flex items-center justify-center p-4 font-sans text-[#1f2937]">
            <div className="bg-white w-full max-w-[440px] rounded-[24px] p-10 shadow-sm border border-gray-50">
                <div className="flex flex-col items-center text-center mb-8">
                    {/* Phần Logo giữ nguyên */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#3fa2d7] via-[#3491c2] to-[#1e60a3] rounded-[1.25rem] flex items-center justify-center text-white shadow-[0_10px_25px_-4px_rgba(63,162,215,0.6)]">
                                <span className="text-2xl font-black italic tracking-tighter">P</span>
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-50">
                                    <Plus className="w-3.5 h-3.5 text-[#3fa2d7]" />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col -space-y-1 text-left">
                            <span className="text-xl font-black tracking-tighter text-slate-900 flex items-center">
                                PITI <span className="ml-1 bg-gradient-to-r from-[#3fa2d7] to-[#1e60a3] bg-clip-text text-transparent">Clinic</span>
                            </span>
                            <div className="flex items-center gap-1">
                                <div className="h-[1px] w-3 bg-[#3fa2d7]/40"></div>
                                <span className="text-[9px] font-bold text-[#3fa2d7] uppercase tracking-[0.25em]">Medical System</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-[26px] font-bold tracking-tight mb-2">Tạo tài khoản mới</h1>
                    <p className="text-[#6b7280] text-[15px]">Đăng ký để truy cập Hệ thống Quản lý</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Họ và Tên */}
                    <div>
                        <div className="relative">
                            <CircleUserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="Họ và tên"
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#54bced] focus:ring-[#e6f4fb]'} outline-none transition-all text-[15px] placeholder:text-gray-400 focus:ring-4`}
                                {...register('fullName')}
                            />
                        </div>
                        {errors.fullName && <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.fullName.message}</p>}
                    </div>
                    {/* Tên đăng nhập (Username) */}
                    <div>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="Tên đăng nhập "
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                                    errors.username ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#54bced]'
                                } outline-none transition-all text-[15px] focus:ring-4`}
                                {...register('username')}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.username.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type="email"
                                placeholder="Email"
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#54bced] focus:ring-[#e6f4fb]'} outline-none transition-all text-[15px] placeholder:text-gray-400 focus:ring-4`}
                                {...register('email')}
                            />
                        </div>
                        {errors.email && <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.email.message}</p>}
                    </div>

                    {/* Tên đăng nhập (Username) - THÊM MỚI Ở ĐÂY */}
                    <div>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.username ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#54bced] focus:ring-[#e6f4fb]'} outline-none transition-all text-[15px] placeholder:text-gray-400 focus:ring-4`}
                                {...register('username')}
                            />
                        </div>
                        {errors.username && <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.username.message}</p>}
                    </div>

                    {/* Mật khẩu */}
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mật khẩu"
                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#54bced] focus:ring-[#e6f4fb]'} outline-none transition-all text-[15px] placeholder:text-gray-400 focus:ring-4`}
                                {...register('password')}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={1.5} /> : <Eye className="h-5 w-5" strokeWidth={1.5} />}
                            </button>
                        </div>
                        {errors.password && <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.password.message}</p>}
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Xác nhận mật khẩu"
                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#54bced] focus:ring-[#e6f4fb]'} outline-none transition-all text-[15px] placeholder:text-gray-400 focus:ring-4`}
                                {...register('confirmPassword')}
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" strokeWidth={1.5} /> : <Eye className="h-5 w-5" strokeWidth={1.5} />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-[#54bced] hover:bg-[#45a8d8] text-white font-semibold py-3.5 rounded-xl shadow-md transition-colors text-[16px]">
                            Đăng ký ngay
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center text-[15px] text-gray-500">
                    Bạn đã có tài khoản? <a href="/login" className="text-[#54bced] hover:underline font-medium">Đăng nhập</a>
                </div>
            </div>
        </div>
    );
}
