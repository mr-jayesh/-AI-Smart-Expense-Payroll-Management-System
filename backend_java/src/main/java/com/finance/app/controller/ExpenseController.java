package com.finance.app.controller;

import com.finance.app.model.Category;
import com.finance.app.model.Employee;
import com.finance.app.model.Expense;
import com.finance.app.repository.CategoryRepository;
import com.finance.app.repository.ExpenseRepository;
import com.finance.app.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/expenses")
    public List<Map<String, Object>> getAllExpenses() {
        return expenseRepository.findAllByOrderByDateIncurredDesc()
            .stream()
            .map(exp -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", exp.getId());
                // Flatten employee info
                Employee emp = exp.getEmployee();
                dto.put("employee_name", emp != null ? emp.getFullName() : null);
                dto.put("employee_id", emp != null ? emp.getId() : null);
                // Flatten category info
                Category cat = exp.getCategory();
                dto.put("category_name", cat != null ? cat.getName() : null);
                dto.put("category_id", cat != null ? cat.getId() : null);
                // Expense fields
                dto.put("amount", exp.getAmount());
                dto.put("description", exp.getDescription());
                dto.put("date_incurred", exp.getDateIncurred() != null ? exp.getDateIncurred().toString() : null);
                dto.put("status", exp.getStatus());
                dto.put("is_recurring", exp.getIsRecurring());
                dto.put("ai_flag_anomaly", exp.getAiFlagAnomaly());
                dto.put("anomaly_score", exp.getAnomalyScore());
                dto.put("created_at", exp.getCreatedAt() != null ? exp.getCreatedAt().toString() : null);
                return dto;
            })
            .collect(Collectors.toList());
    }

    @PostMapping("/expenses")
    public ResponseEntity<?> addExpense(@RequestBody Map<String, Object> request) {
        String userId = (String) request.get("user_id");
        String amountStr = request.get("amount").toString();
        Integer categoryId = request.get("category_id") instanceof Number
            ? ((Number) request.get("category_id")).intValue()
            : Integer.parseInt((String) request.get("category_id"));
        String description = (String) request.get("description");
        String dateStr = (String) request.get("date_incurred");

        if (userId == null || amountStr == null || categoryId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
        }

        Expense expense = new Expense();
        expense.setId(UUID.randomUUID().toString());
        expense.setAmount(new java.math.BigDecimal(amountStr));
        expense.setDescription(description);
        expense.setDateIncurred(dateStr != null ? LocalDate.parse(dateStr.substring(0, 10)) : LocalDate.now());

        Employee emp = new Employee();
        emp.setId(userId);
        expense.setEmployee(emp);

        Category cat = new Category();
        cat.setId(categoryId);
        expense.setCategory(cat);

        int dayOfWeekForAi = expense.getDateIncurred().getDayOfWeek().getValue() - 1;
        expenseService.saveExpense(expense, dayOfWeekForAi, 1);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Expense added successfully", "id", expense.getId()));
    }

    @GetMapping("/categories")
    public List<Map<String, Object>> getCategories() {
        return categoryRepository.findAll()
            .stream()
            .map(cat -> {
                Map<String, Object> dto = new HashMap<>();
                dto.put("id", cat.getId());
                dto.put("name", cat.getName());
                dto.put("budget_limit", cat.getBudgetLimit());
                dto.put("description", cat.getDescription());
                return dto;
            })
            .collect(Collectors.toList());
    }
}
