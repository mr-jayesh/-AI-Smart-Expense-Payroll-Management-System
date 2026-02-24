package com.finance.app.repository;

import com.finance.app.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {
    List<Alert> findTop3ByOrderByCreatedAtDesc();
    List<Alert> findAllByOrderByCreatedAtDesc();
}
