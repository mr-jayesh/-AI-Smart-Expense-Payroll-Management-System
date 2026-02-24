package com.finance.app.repository;

import com.finance.app.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, String> {
    List<Payroll> findAllByOrderByMonthYearDesc();

    @Query("SELECT SUM(p.netSalary) FROM Payroll p WHERE p.status = 'Paid' OR p.status = 'Approved'")
    BigDecimal sumTotalPayroll();
}
