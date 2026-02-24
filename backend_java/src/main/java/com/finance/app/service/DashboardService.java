package com.finance.app.service;

import com.finance.app.repository.AlertRepository;
import com.finance.app.repository.EmployeeRepository;
import com.finance.app.repository.ExpenseRepository;
import com.finance.app.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AlertRepository alertRepository;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total Payroll
        BigDecimal totalPayroll = payrollRepository.sumTotalPayroll();
        if (totalPayroll == null) totalPayroll = BigDecimal.ZERO;

        // Total Expenses
        BigDecimal totalExpenses = expenseRepository.sumApprovedExpenses();
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        // Burn Rate
        BigDecimal burnRate = totalPayroll.add(totalExpenses);

        // Active Employees
        long activeEmployees = employeeRepository.count(); // Assuming all in repo are relevant or use custom query for status='Active'

        // Health Score (Mock)
        int healthScore = 88;

        // Recent Alerts
        List<?> alerts = alertRepository.findTop3ByOrderByCreatedAtDesc();

        // Cash Flow (Mock)
        List<Map<String, Object>> cashFlow = new ArrayList<>();
        cashFlow.add(Map.of("name", "Jan", "income", 4000, "expense", 2400));
        cashFlow.add(Map.of("name", "Feb", "income", 3000, "expense", 1398));
        cashFlow.add(Map.of("name", "Mar", "income", 2000, "expense", 9800));
        cashFlow.add(Map.of("name", "Apr", "income", 2780, "expense", 3908));
        cashFlow.add(Map.of("name", "May", "income", 1890, "expense", 4800));
        cashFlow.add(Map.of("name", "Jun", "income", 2390, "expense", 3800));
        cashFlow.add(Map.of("name", "Jul", "income", 3490, "expense", 4300));

        stats.put("totalPayroll", totalPayroll);
        stats.put("totalExpenses", totalExpenses);
        stats.put("burnRate", burnRate);
        stats.put("activeEmployees", activeEmployees);
        stats.put("healthScore", healthScore);
        stats.put("alerts", alerts);
        stats.put("cashFlow", cashFlow);

        return stats;
    }
}
