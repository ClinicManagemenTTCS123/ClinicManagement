import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { User, Lock, Eye, EyeOff, Plus } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. Cập nhật Schema thành username
const loginSchema = z.object({
    username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
    password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        // 2. Cập nhật defaultValues
        defaultValues: { username: '', password: '' },
    });
    // tai khoan mac dinh neu k co dl
    const onSubmit = async (data) => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

            const response = await axios.post(`${apiUrl}/auth/login`, {
                username: data.username.trim(),
                password: data.password
            });

            // 1. Lấy role và các ID tiềm năng từ backend trả về
            // Backend hiện tại trả về: { message, role, doctorId, patientId }
            const { role, doctorId, patientId } = response.data;

            localStorage.setItem("userRole", role);

            if (role === "ADMIN") {
                navigate("/admin/dashboard");
            }
            else if (role === "DOCTOR") {
                // 2. Ưu tiên lấy doctorId từ API, nếu null/undefined thì mới lấy "1"
                const finalDoctorId = doctorId || "1";
                localStorage.setItem("doctorId", finalDoctorId.toString());
                navigate("/doctor/dashboard");
            }
            else if (role === "PATIENT") {
                // 3. Ưu tiên lấy patientId từ API, nếu null/undefined thì mới lấy "1"
                const finalPatientId = patientId || "1";
                localStorage.setItem("patientId", finalPatientId.toString());
                navigate("/patient/dashboard");
            }

        } catch (error) {
            // Lấy thông báo lỗi cụ thể từ Backend nếu có (ví dụ: "Sai tài khoản...")
            const errorMsg = error.response?.data || "Đăng nhập thất bại! Kiểm tra lại tài khoản test.";
            alert(errorMsg);
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

                    {/* Username  */}
                    <div>
                        <div className="relative">
                            {/*  icon User */}
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" strokeWidth={1.5} />
                            <input
                                type="text"
                                placeholder="Tên đăng nhập"
                                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                                    errors.username ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#54bced] focus:ring-[#e6f4fb]'
                                } outline-none transition-all text-[15px] placeholder:text-gray-400 focus:ring-4`}
                                {...register('username')}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-[#e74c3c] text-sm mt-1.5 ml-1">{errors.username.message}</p>
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