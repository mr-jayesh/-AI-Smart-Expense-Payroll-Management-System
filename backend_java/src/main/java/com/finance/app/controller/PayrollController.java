package com.finance.app.controller;

import com.finance.app.model.Employee;
import com.finance.app.model.Payroll;
import com.finance.app.repository.PayrollRepository;
import com.finance.app.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private PayrollRepository payrollRepository;

    @PostMapping("/calculate")
    public Map<String, Object> calculatePayroll(@RequestBody Map<String, Object> request) {
        @SuppressWarnings("unchecked")
        Map<String, Object> empMap = (Map<String, Object>) request.get("employee");

        Employee employee = new Employee();
        employee.setId((String) empMap.get("id"));
        employee.setBaseSalary(new java.math.BigDecimal(empMap.get("baseSalary").toString()));

        int overtimeHours = request.get("overtimeHours") != null ? ((Number) request.get("overtimeHours")).intValue() : 0;
        int unpaidLeaves = request.get("unpaidLeaves") != null ? ((Number) request.get("unpaidLeaves")).intValue() : 0;

        String dateStr = (String) request.get("monthYear");
        LocalDate monthYear = dateStr != null ? LocalDate.parse(dateStr.substring(0, 10)) : LocalDate.now();

        return payrollService.calculateMonthlyPayroll(employee, overtimeHours, unpaidLeaves, monthYear);
    }

    @GetMapping
    public List<Map<String, Object>> getAllPayroll() {
        return payrollRepository.findAllByOrderByMonthYearDesc()
            .stream()
            .map(p -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", p.getId());
                // Flatten employee info
                Employee emp = p.getEmployee();
                dto.put("employee_name", emp != null ? emp.getFullName() : "Unknown");
                dto.put("employee_id", emp != null ? emp.getId() : null);
                dto.put("department", emp != null ? emp.getDepartment() : null);
                // Payroll fields with snake_case names matching frontend expectations
                dto.put("month_year", p.getMonthYear() != null ? p.getMonthYear().toString() : null);
                dto.put("basic_pay", p.getBasicPay());
                dto.put("hra", p.getHra());
                dto.put("special_allowance", p.getSpecialAllowance());
                dto.put("overtime_pay", p.getOvertimePay());
                dto.put("bonus", p.getBonus());
                dto.put("pf", p.getPf());
                dto.put("professional_tax", p.getProfessionalTax());
                dto.put("tds", p.getTds());
                dto.put("leave_deduction", p.getLeaveDeduction());
                dto.put("net_salary", p.getNetSalary());
                dto.put("status", p.getStatus());
                dto.put("payment_date", p.getPaymentDate() != null ? p.getPaymentDate().toString() : null);
                dto.put("created_at", p.getCreatedAt() != null ? p.getCreatedAt().toString() : null);
                return dto;
            })
            .collect(Collectors.toList());
    }
}
