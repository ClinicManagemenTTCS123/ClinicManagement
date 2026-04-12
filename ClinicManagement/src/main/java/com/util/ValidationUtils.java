package com.util;

import com.model.enums.DoctorStatus;
import com.model.enums.Gender;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ValidationUtils {
    private ValidationUtils() {}

    // ============================================================
    //  STRING NORMALIZATION
    // ============================================================
    /** null -> true; "" hoặc toàn space -> true */
    public static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    /** trim, nếu rỗng trả null */
    public static String trimOrNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    /** null -> "" */
    public static String safe(String s) {
        return (s == null) ? "" : s;
    }

    // ============================================================
    //  DISPLAY HELPERS
    // ============================================================
    /** 350000 -> "350.000 đ" */
    public static String formatVnd(double v) {
        return String.format("%,.0f đ", v).replace(',', '.');
    }

    /** MALE -> "Nam", FEMALE -> "Nữ", OTHER -> "Khác" */
    public static String genderVi(Gender g) {
        if (g == null) return "";
        return switch (g) {
            case MALE   -> "Nam";
            case FEMALE -> "Nữ";
            case OTHER  -> "Khác";
        };
    }

    /** Map enum trạng thái bác sĩ sang tiếng Việt để hiển thị UI */
    public static String statusVi(DoctorStatus st) {
        if (st == null) return "";
        return switch (st) {
            case ACTIVE            -> "Hoạt động";
            case INACTIVE          -> "Ngưng hoạt động";
            case PENDING_APPROVAL  -> "Chờ duyệt";
            case SUSPENDED         -> "Đình chỉ";
            case ON_LEAVE          -> "Tạm nghỉ";
        };
    }

    /** Sinh prefix mã bác sĩ theo tên khoa */
    public static String codePrefixFromDepartmentName(String name) {
        if (name == null) return "KH";
        return switch (name.trim()) {
            case "Khoa Tim Mạch"      -> "TM";
            case "Khoa Da Liễu"       -> "DL";
            case "Khoa Thần Kinh"     -> "TK";
            case "Khoa Nội Tổng Quát" -> "NTQ";
            case "Khoa Nhi"           -> "NHI";
            case "Khoa Sản"           -> "SAN";
            case "Khoa Phụ Khoa"      -> "PK";
            case "Khoa Mắt"           -> "MAT";
            case "Khoa Nha Khoa"      -> "RHM";
            case "Khoa Tai Mũi Họng"  -> "TMH";
            case "Khoa Tâm Thần"      -> "TT";
            default                   -> "KH";
        };
    }

    // ============================================================
    //  VALIDATION HELPERS
    // ============================================================
    public static boolean isValidPhone(String p) {
        return p != null && p.matches("\\d{10,11}");
    }

    public static boolean isValidEmail(String e) {
        return e != null && e.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }

    public static boolean isValidDob(LocalDate dob) {
        return dob != null && !dob.isAfter(LocalDate.now());
    }

    /**
     * null hoặc số >= 0; ném NumberFormatException nếu không hợp lệ.
     * Dùng khi build dto từ form.
     */
    public static Double parseFee(String s) {
        if (s == null || s.isBlank()) return null;
        double v = Double.parseDouble(s.trim());
        if (v < 0) throw new NumberFormatException("negative");
        return v;
    }

    public static boolean isPositiveNumber(String s){
        if (s == null) return false;
        try {
            return Double.parseDouble(s.trim()) > 0;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static String formatTime(LocalDateTime T){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return T.format(formatter);
    }

    public static String formatDobAsPassword(LocalDate dob) {
        if (dob == null) return "00000000"; // fallback nếu chưa có ngày sinh
        return String.format("%02d%02d%04d",
                dob.getDayOfMonth(),
                dob.getMonthValue(),
                dob.getYear());
    }
}
