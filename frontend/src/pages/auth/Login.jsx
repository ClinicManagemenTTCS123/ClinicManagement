import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Heart, Mail, Lock, Eye, EyeOff,Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const loginSchema = z.object({
    email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = async (data) => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

            const response = await axios.post(`${apiUrl}/auth/login`, {
                email: data.email.trim(),
                password: data.password
            });

            const userRole = response.data.role;
            const doctorId = response.data.doctorId;

            localStorage.setItem("userRole", userRole);
            if (doctorId) {
                localStorage.setItem("doctorId", doctorId);
            }

            if (userRole === "ADMIN") {
                navigate("/admin/dashboard");
            } else if (userRole === "DOCTOR") {
                navigate("/doctor/dashboard");
            } else {
                navigate("/patient/dashboard");
            }

        } catch (error) {
            const errorMessage = error.response?.data || "Có lỗi xảy ra khi kết nối máy chủ!";
            alert(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-[#eaf5fa] flex items-center justify-center p-4 font-sans">

            {/* Card Form */}
            <div className="bg-white w-full max-w-[440px] rounded-[24px] p-10 shadow-sm border border-gray-50">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-8">

                    {/* Logo */}
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
                PITI
                <span className="ml-1 bg-gradient-to-r from-[#3fa2d7] to-[#1e60a3] bg-clip-text text-transparent">
                    Clinic
                </span>
            </span>

                            <div className="flex items-center gap-1">
                                <div className="h-[1px] w-3 bg-[#3fa2d7]/40"></div>

                                <span className="text-[9px] font-bold text-[#3fa2d7] uppercase tracking-[0.25em]">
                    Medical System
                </span>
                            </div>

                        </div>

                    </div>

                    <h1 className="text-[26px] font-bold text-[#1f2937] tracking-tight mb-2">
                        Chào mừng quay lại
                    </h1>

                    <p className="text-[#6b7280] text-[15px]">
                        Đăng nhập để truy cập hệ thống quản lý phòng khám
                    </p>

                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email */}
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type="email"
                                placeholder="Email"
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                                    errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#54bced] focus:ring-[#e6f4fb]'
                                } outline-none transition-all text-[15px] placeholder:text-gray-400 focus:ring-4`}
                                {...register('email')}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mật khẩu"
                                className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                                    errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#54bced] focus:ring-[#e6f4fb]'
                                } outline-none transition-all text-[15px] placeholder:text-gray-400 focus:ring-4`}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" strokeWidth={1.5} /> : <Eye className="h-5 w-5" strokeWidth={1.5} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.password.message}</p>
                        )}

                        {/* Forgot Password Link */}
                        <div className="flex justify-end mt-2">
                            <a href="/forgot-password" className="text-sm text-[#54bced] hover:underline">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-[#54bced] hover:bg-[#45a8d8] text-white font-semibold py-3.5 rounded-xl shadow-md transition-colors text-[16px]"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>

                {/* Footer Register Link */}
                <div className="mt-8 text-center text-[15px] text-gray-500">
                    Chưa có tài khoản?{' '}
                    <a href="/register" className="text-[#54bced] hover:underline font-medium">
                        Đăng ký
                    </a>
                </div>
            </div>
        </div>
    );
}
