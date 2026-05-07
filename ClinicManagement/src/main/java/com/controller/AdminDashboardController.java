package com.controller;

import com.model.dto.DashboardSummaryDto;
import com.service.IAdminDashboardService;
import com.service.impl.AdminDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final IAdminDashboardService adminDashboardService = new AdminDashboardService();

    // Dashboard thống kê nhanh cho Admin
    @GetMapping
    public ResponseEntity<DashboardSummaryDto> getDashboard() {
        try {
            return ResponseEntity.ok(adminDashboardService.getDashboardSummary());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}