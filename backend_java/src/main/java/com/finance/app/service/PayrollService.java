package com.finance.app.service;

import com.finance.app.model.Employee;
import com.finance.app.model.Payroll;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class PayrollService {

    public Map<String, Object> calculateMonthlyPayroll(Employee employee, int overtimeHours, int unpaidLeaves, LocalDate monthYear) {
        // Base Salary is Annual CTC
        BigDecimal annualCTC = employee.getBaseSalary();
        BigDecimal monthlyCTC = annualCTC.divide(BigDecimal.valueOf(12), 2, RoundingMode.HALF_UP);

        // 1. Earnings Structure
        // Basic is 40% of CTC
        BigDecimal basic = monthlyCTC.multiply(BigDecimal.valueOf(0.40)).setScale(0, RoundingMode.HALF_UP);

        // HRA is 50% of Basic
        BigDecimal hra = basic.multiply(BigDecimal.valueOf(0.50)).setScale(0, RoundingMode.HALF_UP);

        // Overtime: Hourly Rate = MonthlyCTC / 176
        BigDecimal hourlyRate = monthlyCTC.divide(BigDecimal.valueOf(176), 2, RoundingMode.HALF_UP);
        BigDecimal overtimePay = hourlyRate.multiply(BigDecimal.valueOf(2 * overtimeHours)).setScale(0, RoundingMode.HALF_UP);

        // Special Allowance = MonthlyCTC - Basic - HRA
        BigDecimal special = monthlyCTC.subtract(basic).subtract(hra).setScale(0, RoundingMode.HALF_UP);
        if (special.compareTo(BigDecimal.ZERO) < 0) {
            special = BigDecimal.ZERO;
        }

        BigDecimal grossEarnings = basic.add(hra).add(special).add(overtimePay);

        // 2. Deductions

        // Leave Deduction
        BigDecimal perDayPay = monthlyCTC.divide(BigDecimal.valueOf(30), 2, RoundingMode.HALF_UP);
        BigDecimal leaveDeduction = perDayPay.multiply(BigDecimal.valueOf(unpaidLeaves)).setScale(0, RoundingMode.HALF_UP);

        // PF: 12% of Basic, capped at 1800
        BigDecimal pf = basic.multiply(BigDecimal.valueOf(0.12)).setScale(0, RoundingMode.HALF_UP);
        if (pf.compareTo(BigDecimal.valueOf(1800)) > 0) {
            pf = BigDecimal.valueOf(1800);
        }

        // Professional Tax
        BigDecimal professionalTax = BigDecimal.valueOf(200);

        // TDS
        // Projected Annual Income = (Gross - Leave) * 12
        BigDecimal projectedAnnualIncome = grossEarnings.subtract(leaveDeduction).multiply(BigDecimal.valueOf(12));
        BigDecimal annualTax = BigDecimal.ZERO;

        if (projectedAnnualIncome.compareTo(BigDecimal.valueOf(1500000)) > 0) {
            annualTax = projectedAnnualIncome.subtract(BigDecimal.valueOf(1500000))
                    .multiply(BigDecimal.valueOf(0.3)).add(BigDecimal.valueOf(150000));
        } else if (projectedAnnualIncome.compareTo(BigDecimal.valueOf(1000000)) > 0) {
            annualTax = projectedAnnualIncome.subtract(BigDecimal.valueOf(1000000))
                    .multiply(BigDecimal.valueOf(0.15)).add(BigDecimal.valueOf(75000));
        } else if (projectedAnnualIncome.compareTo(BigDecimal.valueOf(600000)) > 0) {
            annualTax = projectedAnnualIncome.subtract(BigDecimal.valueOf(600000))
                    .multiply(BigDecimal.valueOf(0.10));
        }

        BigDecimal monthlyTds = annualTax.divide(BigDecimal.valueOf(12), 0, RoundingMode.HALF_UP);

        BigDecimal totalDeductions = pf.add(professionalTax).add(monthlyTds).add(leaveDeduction);

        // 3. Net Pay
        BigDecimal netPay = grossEarnings.subtract(totalDeductions).setScale(0, RoundingMode.HALF_UP);

        Map<String, Object> result = new HashMap<>();
        
        Map<String, BigDecimal> earnings = new HashMap<>();
        earnings.put("basic", basic);
        earnings.put("hra", hra);
        earnings.put("special", special);
        earnings.put("overtime", overtimePay);
        earnings.put("gross", grossEarnings);
        result.put("earnings", earnings);

        Map<String, BigDecimal> deductions = new HashMap<>();
        deductions.put("pf", pf);
        deductions.put("professionalTax", professionalTax);
        deductions.put("tds", monthlyTds);
        deductions.put("leave", leaveDeduction);
        deductions.put("total", totalDeductions);
        result.put("deductions", deductions);

        result.put("netPay", netPay);

        return result;
    }
}
