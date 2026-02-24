package com.finance.app.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payroll")
public class Payroll {

    @Id
    @JdbcTypeCode(SqlTypes.OTHER)
    @Column(columnDefinition = "uuid")
    private String id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "month_year", nullable = false)
    private LocalDate monthYear;

    @Column(name = "basic_pay", nullable = false)
    private BigDecimal basicPay;

    @Column(nullable = false)
    private BigDecimal hra;

    @Column(name = "special_allowance", nullable = false)
    private BigDecimal specialAllowance;

    @Column(name = "overtime_pay")
    private BigDecimal overtimePay;

    @Column
    private BigDecimal bonus;

    @Column
    private BigDecimal pf;

    @Column(name = "professional_tax")
    private BigDecimal professionalTax;

    @Column
    private BigDecimal tds;

    @Column(name = "leave_deduction")
    private BigDecimal leaveDeduction;

    @Column(name = "net_salary", nullable = false)
    private BigDecimal netSalary;

    @Column(columnDefinition = "varchar(255) default 'Draft'")
    private String status;

    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Payroll() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDate getMonthYear() { return monthYear; }
    public void setMonthYear(LocalDate monthYear) { this.monthYear = monthYear; }

    public BigDecimal getBasicPay() { return basicPay; }
    public void setBasicPay(BigDecimal basicPay) { this.basicPay = basicPay; }

    public BigDecimal getHra() { return hra; }
    public void setHra(BigDecimal hra) { this.hra = hra; }

    public BigDecimal getSpecialAllowance() { return specialAllowance; }
    public void setSpecialAllowance(BigDecimal specialAllowance) { this.specialAllowance = specialAllowance; }

    public BigDecimal getOvertimePay() { return overtimePay; }
    public void setOvertimePay(BigDecimal overtimePay) { this.overtimePay = overtimePay; }

    public BigDecimal getBonus() { return bonus; }
    public void setBonus(BigDecimal bonus) { this.bonus = bonus; }

    public BigDecimal getPf() { return pf; }
    public void setPf(BigDecimal pf) { this.pf = pf; }

    public BigDecimal getProfessionalTax() { return professionalTax; }
    public void setProfessionalTax(BigDecimal professionalTax) { this.professionalTax = professionalTax; }

    public BigDecimal getTds() { return tds; }
    public void setTds(BigDecimal tds) { this.tds = tds; }

    public BigDecimal getLeaveDeduction() { return leaveDeduction; }
    public void setLeaveDeduction(BigDecimal leaveDeduction) { this.leaveDeduction = leaveDeduction; }

    public BigDecimal getNetSalary() { return netSalary; }
    public void setNetSalary(BigDecimal netSalary) { this.netSalary = netSalary; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
