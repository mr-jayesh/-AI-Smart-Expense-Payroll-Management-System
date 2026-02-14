/**
 * Payroll Service
 * Handles the core logic for calculating employee salaries.
 */

interface Employee {
  id: string;
  baseSalary: number; // Annual CTC or Monthly Base
  department: string;
}

interface PayrollInput {
  employee: Employee;
  overtimeHours: number;
  unpaidLeaves: number;
  monthYear: Date;
}

interface PayrollResult {
  earnings: {
    basic: number;
    hra: number;
    special: number;
    overtime: number;
    gross: number;
  };
  deductions: {
    pf: number;
    professionalTax: number;
    tds: number;
    leave: number;
    total: number;
  };
  netPay: number;
}

export class PayrollService {
  
  /**
   * Calculate detailed payroll breakdown for an employee
   */
  public calculateMonthlyPayroll(input: PayrollInput): PayrollResult {
    const { employee, overtimeHours, unpaidLeaves } = input;
    
    // Assuming baseSalary is ANNUAL CTC for this calculation
    // Convert to monthly components
    const monthlyCTC = employee.baseSalary / 12;

    // 1. Earnings Structure
    // Basic is typically 40-50% of CTC
    const basic = Math.round(monthlyCTC * 0.40); 
    
    // HRA (House Rent Allowance) - 50% of Basic for Metro, 40% Non-Metro. Let's assume 50%.
    const hra = Math.round(basic * 0.50);
    
    // Calculate Overtime
    // Standard working hours: 22 days * 8 hours = 176 hours
    const hourlyRate = monthlyCTC / 176;
    const overtimePay = Math.round(hourlyRate * 2 * overtimeHours); // 2x Overtime rate

    // Special Allowance is the balancing component
    // Gross = Basic + HRA + Special + Overtime
    // Special = MonthlyCTC - Basic - HRA
    let special = Math.round(monthlyCTC - basic - hra);
    if (special < 0) special = 0; // Guard clause

    const grossEarnings = basic + hra + special + overtimePay;

    // 2. Deductions
    
    // Leave Deduction (Loss of Pay)
    // Per day calculation on Gross (excluding overtime usually, but simplified here to Month Gross)
    const perDayPay = monthlyCTC / 30; // Standard 30 days
    const leaveDeduction = Math.round(perDayPay * unpaidLeaves);

    // Provident Fund (PF)
    // 12% of Basic, often capped at on ceiling of 15000 basic -> 1800.
    let pf = Math.round(basic * 0.12);
    if (pf > 1800) pf = 1800; // Statutory Cap

    // Professional Tax (PT)
    // Varies by state, typical fixed amount.
    const professionalTax = 200;

    // TDS (Tax Deducted at Source)
    // Simplified Progressive Tax Logic on ANNUALIZED income
    // Projected Annual Income = (Gross - Leave) * 12
    const projectedAnnualIncome = (grossEarnings - leaveDeduction) * 12;
    let annualTax = 0;
    
    // Simplified Tax Slabs (New Regime style)
    if (projectedAnnualIncome > 1500000) {
      annualTax = (projectedAnnualIncome - 1500000) * 0.3 + 150000; // 30% + slab below
    } else if (projectedAnnualIncome > 1000000) {
      annualTax = (projectedAnnualIncome - 1000000) * 0.15 + 75000;
    } else if (projectedAnnualIncome > 600000) {
      annualTax = (projectedAnnualIncome - 600000) * 0.10;
    }
    
    const monthlyTds = Math.round(annualTax / 12);

    const totalDeductions = pf + professionalTax + monthlyTds + leaveDeduction;

    // 3. Net Pay
    const netPay = grossEarnings - totalDeductions;

    return {
      earnings: {
        basic,
        hra,
        special,
        overtime: overtimePay,
        gross: grossEarnings
      },
      deductions: {
        pf,
        professionalTax,
        tds: monthlyTds,
        leave: leaveDeduction,
        total: totalDeductions
      },
      netPay: Math.round(netPay) // Round off final content
    };
  }
}
