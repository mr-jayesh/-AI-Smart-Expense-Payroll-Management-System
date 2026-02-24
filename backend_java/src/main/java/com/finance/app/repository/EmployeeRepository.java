package com.finance.app.repository;

import com.finance.app.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findByEmail(String email);
    // Find by status logic can be added if needed, e.g. findAllByStatus(String status)
}
