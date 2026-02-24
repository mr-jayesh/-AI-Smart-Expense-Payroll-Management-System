package com.finance.app.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @JdbcTypeCode(SqlTypes.OTHER)
    @Column(columnDefinition = "uuid")
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "receipt_url")
    private String receiptUrl;

    @Column(name = "date_incurred", nullable = false)
    private LocalDate dateIncurred;

    @Column(name = "is_recurring")
    private Boolean isRecurring;

    @Column(nullable = false, columnDefinition = "varchar")
    private String status;

    @Column(name = "ai_flag_anomaly")
    private Boolean aiFlagAnomaly;

    @Column(name = "anomaly_score")
    private BigDecimal anomalyScore;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Expense() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }

    public LocalDate getDateIncurred() { return dateIncurred; }
    public void setDateIncurred(LocalDate dateIncurred) { this.dateIncurred = dateIncurred; }

    public Boolean getIsRecurring() { return isRecurring; }
    public void setIsRecurring(Boolean isRecurring) { this.isRecurring = isRecurring; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getAiFlagAnomaly() { return aiFlagAnomaly; }
    public void setAiFlagAnomaly(Boolean aiFlagAnomaly) { this.aiFlagAnomaly = aiFlagAnomaly; }

    public BigDecimal getAnomalyScore() { return anomalyScore; }
    public void setAnomalyScore(BigDecimal anomalyScore) { this.anomalyScore = anomalyScore; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
