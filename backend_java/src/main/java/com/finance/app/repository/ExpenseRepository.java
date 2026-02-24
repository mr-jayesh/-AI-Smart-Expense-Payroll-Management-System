package com.finance.app.repository;

import com.finance.app.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, String> {
    List<Expense> findAllByOrderByDateIncurredDesc();

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.status = 'Approved'")
    BigDecimal sumApprovedExpenses();
}
