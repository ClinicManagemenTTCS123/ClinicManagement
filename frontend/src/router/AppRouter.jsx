import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DoctorLayout from "../layouts/DoctorLayout";
import PatientLayout from "../layouts/PatientLayout";


// Public Pages
import Home from "../pages/home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Admin Pages
import Dashboard from "../pages/admin/AdminDashboard";
import DoctorManagement from "../pages/admin/DoctorManagement";
import DepartmentManagement from "../pages/admin/DepartmentManagement";
import PatientManagement from "../pages/admin/PatientManagement";
import AppointmentManagement from "../pages/admin/AppointmentManagement";
import InvoiceManagement from "../pages/admin/InvoiceManagement";
import MedicalRecords from "../pages/admin/MedicalRecords";

// Doctor Pages
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import MyAppointmentsD from "../pages/doctor/MyAppointmentsD";
import PatientsD from "../pages/doctor/PatientsD";
import MedicalRecordD from "../pages/doctor/MedicalRecordD";
import ProfileD from "../pages/doctor/ProfileD";

// Patient Pages
import PatientDashboard from "../pages/patient/PatientDashboard";
import BookAppointment from "../pages/patient/BookAppointment";
import MyAppointmentsP from "../pages/patient/MyAppointmentsP";
import InvoicesP from "../pages/patient/InvoicesP";
import ProfileP from "../pages/patient/ProfileP";
import MedicalRecordP from "../pages/patient/MedicalRecordP";



function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- 1. TRANG CÔNG KHAI --- */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* --- 2. CỤM ADMIN (Sử dụng Layout chung) --- */}
                <Route path="/admin" element={<AdminLayout role="admin" />}>
                    <Route index element={<Navigate to="dashboard" replace />} />

                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="doctors" element={<DoctorManagement />} />
                    <Route path="departments" element={<DepartmentManagement />} />
                    <Route path="patients" element={<PatientManagement />} />
                    <Route path="appointments" element={<AppointmentManagement />} />
                    <Route path="invoices" element={<InvoiceManagement />} />
                    <Route path="medical-records" element={<MedicalRecords />} />
                </Route>

                {/* --- 3. CỤM BÁC SĨ --- */}
                <Route path="/doctor" element={<DoctorLayout />}>
                    <Route path="dashboard" element={<DoctorDashboard />} />
                    <Route path="my-appointments" element={<MyAppointmentsD />} />
                    <Route path="patients" element={<PatientsD />} />
                    <Route path="medical-records" element={<MedicalRecordD />} />
                    <Route path="profile" element={<ProfileD />} />
                </Route>

                {/* --- 4. CỤM BỆNH NHÂN --- */}
                <Route path="/patient" element={<PatientLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="book-appointment" element={<BookAppointment />} />
                    <Route path="my-appointments" element={<MyAppointmentsP />} />
                    <Route path="medical-records" element={<MedicalRecordP />} />
                    <Route path="invoices" element={<InvoicesP />} />
                    <Route path="profile" element={<ProfileP />} />
                </Route>

                {/* --- 5. LỖI 404 --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;