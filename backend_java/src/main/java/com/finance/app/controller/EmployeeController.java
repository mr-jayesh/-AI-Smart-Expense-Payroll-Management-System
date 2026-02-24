package com.finance.app.controller;

import com.finance.app.model.Employee;
import com.finance.app.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addEmployee(@RequestBody Employee employee) {
        if (employee.getFullName() == null || employee.getEmail() == null || employee.getBaseSalary() == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Missing required fields"));
        }

        if (employeeRepository.findByEmail(employee.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(java.util.Map.of("error", "Email already exists"));
        }

        employee.setId(UUID.randomUUID().toString());
        if (employee.getJoinDate() == null) employee.setJoinDate(LocalDate.now());
        if (employee.getStatus() == null) employee.setStatus("Active");
        if (employee.getRole() == null) employee.setRole("Employee");

        Employee saved = employeeRepository.save(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Map.of("message", "Employee added successfully", "id", saved.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable String id) {
        employeeRepository.deleteById(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Employee deleted successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable String id, @RequestBody Employee employeeDetails) {
        return employeeRepository.findById(id).map(employee -> {
            employee.setFullName(employeeDetails.getFullName());
            employee.setEmail(employeeDetails.getEmail());
            employee.setRole(employeeDetails.getRole());
            employee.setDepartment(employeeDetails.getDepartment());
            employee.setBaseSalary(employeeDetails.getBaseSalary());
            employee.setJoinDate(employeeDetails.getJoinDate());
            employee.setStatus(employeeDetails.getStatus());
            employee.setBankAccountNo(employeeDetails.getBankAccountNo());
            employee.setBankIfsc(employeeDetails.getBankIfsc());
            
            employeeRepository.save(employee);
            return ResponseEntity.ok(java.util.Map.of("message", "Employee updated successfully"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(java.util.Map.of("error", "Employee not found")));
    }
}
