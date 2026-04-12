package com.model.mapper;


import com.model.dto.InvoiceDto;
import com.model.entity.Invoice;

import java.util.List;
import java.util.stream.Collectors;

public class InvoiceMapper {

    public InvoiceDto toDto(Invoice invoice) {
        if (invoice == null) {
            return null;
        }

        InvoiceDto dto = new InvoiceDto();
        dto.setId(invoice.getId());
        dto.setTotal(invoice.getTotal());
        dto.setDetails(invoice.getDetails());
        dto.setStatus(invoice.getStatus());
        dto.setCreatedAt(invoice.getCreatedAt());

        if (invoice.getAppointment() != null) {
            dto.setAppointmentId(invoice.getAppointment().getId());
            if (invoice.getAppointment().getDoctor() != null) {
                dto.setDoctorName(invoice.getAppointment().getDoctor().getFullName());
            }
        }

        if (invoice.getPatient() != null) {
            dto.setPatientName(invoice.getPatient().getFullName());
        }

        return dto;
    }

    public List<InvoiceDto> toDtoList(List<Invoice> invoices) {
        if (invoices == null) {
            return null;
        }
        return invoices.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}

