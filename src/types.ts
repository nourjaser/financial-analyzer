export interface FinancialData {
  // Assets - Non-Current (First)
  fixedAssets: number;
  intangibleAssets: number;
  
  // Assets - Current
  cash: number;
  accountsReceivable: number;
  inventory: number;
  prepaidExpenses: number;
  
  // Liabilities - Long-term (First)
  longTermLoans: number;
  endOfServiceBenefits: number;
  
  // Liabilities - Current
  accountsPayable: number;
  notesPayable: number;
  shortTermLoans: number;
  accruedExpenses: number;
  
  // Equity
  paidInCapital: number;
  retainedEarnings: number;
  reserves: number;
  
  // Income Statement
  revenue: number;
  cogs: number;
  
  // Operating Expenses
  salaries: number;
  rents: number;
  marketing: number;
  depreciation: number;
  
  // Other
  otherIncomeExpense: number;
  zakatTaxes: number;
}

export interface FinancialRatios {
  currentRatio: number;
  quickRatio: number;
  grossProfitMargin: number;
  netProfitMargin: number;
  roa: number;
  debtToEquity: number;
}

export interface AnalysisResult {
  ratios: FinancialRatios;
  isBalanced: boolean;
  totalAssets: number;
  totalLiabilitiesAndEquity: number;
  difference: number;
}

export interface CashFlowResult {
  operating: {
    netIncome: number;
    depreciation: number;
    deltaAR: number;
    deltaInventory: number;
    deltaPrepaid: number;
    deltaAP: number;
    deltaNotesPayable: number;
    deltaAccrued: number;
    total: number;
  };
  investing: {
    deltaFixedAssets: number;
    deltaIntangibleAssets: number;
    total: number;
  };
  financing: {
    deltaLongTermLoans: number;
    deltaShortTermLoans: number;
    deltaCapital: number;
    total: number;
  };
  netCashFlow: number;
}

export interface HistoricalRecord {
  id: string;
  periodName: string;
  date: string;
  data: FinancialData;
  analysis: AnalysisResult;
}
