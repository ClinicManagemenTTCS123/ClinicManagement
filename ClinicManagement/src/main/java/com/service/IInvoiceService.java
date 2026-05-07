package com.service;

import com.model.dto.InvoiceDto;
import com.model.enums.InvoiceStatus;

import java.util.List;

public interface IInvoiceService {
    List<InvoiceDto> getAllInvoices();
    void updateInvoiceStatus(Integer id, InvoiceStatus status);
    void deleteInvoice(Integer id);
}
