package com.finance.app.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        return Map.of("status", "ok", "service", "Payroll API (Java)");
    }

    @GetMapping("/")
    public String root() {
        return "AI Finance Backend is Running! (Java)";
    }
}
