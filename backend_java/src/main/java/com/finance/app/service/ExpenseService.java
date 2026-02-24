package com.finance.app.service;

import com.finance.app.model.Alert;
import com.finance.app.model.Expense;
import com.finance.app.repository.AlertRepository;
import com.finance.app.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private AlertRepository alertRepository;
    
    // We can use RestTemplate or WebClient. RestTemplate is simpler without adding WebFlux dependency.
    private final RestTemplate restTemplate = new RestTemplate();
    private final String AI_SERVICE_URL = "http://localhost:8000/predict/anomaly";

    public Expense saveExpense(Expense expense, int dayOfWeek, int roleEncoded) {
        // AI Anomaly Check
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("amount", expense.getAmount());
            request.put("category_id", expense.getCategory().getId());
            request.put("day_of_week", dayOfWeek);
            request.put("role_encoded", roleEncoded);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(AI_SERVICE_URL, request, Map.class);

            if (response != null && Boolean.TRUE.equals(response.get("is_anomaly"))) {
                expense.setStatus("Flagged"); // Or 'Pending' but flagged
                expense.setAiFlagAnomaly(true);
                // Handle confidence score safely
                Object confidence = response.get("confidence");
                if (confidence instanceof Number) {
                    expense.setAnomalyScore(BigDecimal.valueOf(((Number) confidence).doubleValue()));
                }

                // Create Alert
                Alert alert = new Alert();
                alert.setId(UUID.randomUUID().toString());
                alert.setType("Expense Anomaly");
                alert.setMessage("Expense of ₹" + expense.getAmount() + " flagged by AI.");
                alert.setSeverity("High");
                alert.setIsRead(false);
                alertRepository.save(alert);
            } else {
                expense.setStatus("Pending");
            }

        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            // Fallback: Proceed without AI check
            expense.setStatus("Pending");
        }

        return expenseRepository.save(expense);
    }
}
