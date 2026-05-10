import { FinancialData, FinancialRatios, AnalysisResult, CashFlowResult } from '../types';

export const calculateRatios = (data: FinancialData): AnalysisResult => {
  const totalNonCurrentAssets = data.fixedAssets + data.intangibleAssets;
  const totalCurrentAssets = data.cash + data.accountsReceivable + data.inventory + data.prepaidExpenses;
  const totalAssets = totalNonCurrentAssets + totalCurrentAssets;
  
  const totalLongTermLiabilities = data.longTermLoans + data.endOfServiceBenefits;
  const totalCurrentLiabilities = data.accountsPayable + data.notesPayable + data.shortTermLoans + data.accruedExpenses + data.partnerCurrentAccount;
  const totalLiabilities = totalLongTermLiabilities + totalCurrentLiabilities;
  
  const totalEquity = data.paidInCapital + data.retainedEarnings + data.reserves;
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  
  const currentRatio = totalCurrentLiabilities !== 0 ? totalCurrentAssets / totalCurrentLiabilities : 0;
  const quickRatio = totalCurrentLiabilities !== 0 ? (totalCurrentAssets - data.inventory) / totalCurrentLiabilities : 0;
  
  const grossProfit = data.revenue - data.cogs;
  const grossProfitMargin = data.revenue !== 0 ? (grossProfit / data.revenue) * 100 : 0;
  
  const totalOperatingExpenses = data.salaries + data.rents + data.marketing + data.depreciation + data.adminExpenses;
  const ebit = grossProfit - totalOperatingExpenses;
  const netIncome = ebit + data.otherIncomeExpense - data.zakatTaxes;
  
  const netProfitMargin = data.revenue !== 0 ? (netIncome / data.revenue) * 100 : 0;
  const roa = totalAssets !== 0 ? (netIncome / totalAssets) * 100 : 0;
  const debtToEquity = totalEquity !== 0 ? totalLiabilities / totalEquity : 0;

  return {
    ratios: {
      currentRatio,
      quickRatio,
      grossProfitMargin,
      netProfitMargin,
      roa,
      debtToEquity
    },
    isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 1, // Allow 1 unit rounding
    totalAssets,
    totalLiabilitiesAndEquity,
    difference: totalAssets - totalLiabilitiesAndEquity
  };
};

export const getQualitativeAnalysis = (ratios: FinancialRatios) => {
  const analysis = [];
  
  // Liquidity
  if (ratios.currentRatio > 2) {
    analysis.push({
      category: 'السيولة',
      status: 'ممتاز',
      text: 'تتمتع الشركة بسيولة قوية جداً، مما يعني قدرة عالية على سداد الالتزامات قصيرة الأجل.',
      color: 'text-green-600'
    });
  } else if (ratios.currentRatio >= 1.2) {
    analysis.push({
      category: 'السيولة',
      status: 'جيد',
      text: 'السيولة في مستوى آمن ومقبول محاسبياً.',
      color: 'text-blue-600'
    });
  } else {
    analysis.push({
      category: 'السيولة',
      status: 'خطر',
      text: 'هناك مخاطر في السيولة؛ قد تواجه الشركة صعوبة في سداد التزاماتها العاجلة.',
      color: 'text-red-600'
    });
  }

  // Profitability - Net Margin
  if (ratios.netProfitMargin > 15) {
    analysis.push({
      category: 'صافي الربح',
      status: 'ممتاز',
      text: 'هامش الربح الصافي قوي جداً، مما يدل على كفاءة تشغيلية عالية.',
      color: 'text-green-600'
    });
  } else if (ratios.netProfitMargin >= 5) {
    analysis.push({
      category: 'صافي الربح',
      status: 'جيد',
      text: 'الربحية في نطاق الصناعة المعتاد.',
      color: 'text-blue-600'
    });
  } else {
    analysis.push({
      category: 'صافي الربح',
      status: 'مخاطرة',
      text: 'الربحية منخفضة؛ يجب مراجعة هيكل التكاليف والمصاريف التشغيلية.',
      color: 'text-red-600'
    });
  }

  // Profitability - Gross Margin
  if (ratios.grossProfitMargin > 40) {
    analysis.push({
      category: 'مجمل الربح',
      status: 'ممتاز',
      text: 'هامش مجمل الربح مرتفع، مما يشير إلى قوة في التسعير أو كفاءة في الإنتاج.',
      color: 'text-green-600'
    });
  } else if (ratios.grossProfitMargin >= 20) {
    analysis.push({
      category: 'مجمل الربح',
      status: 'جيد',
      text: 'هامش مجمل الربح في مستوى صحي ومستقر.',
      color: 'text-blue-600'
    });
  } else {
    analysis.push({
      category: 'مجمل الربح',
      status: 'تحذير',
      text: 'هامش مجمل الربح منخفض؛ قد تكون هناك زيادة في تكاليف الإنتاج أو ضغوط سعرية.',
      color: 'text-orange-600'
    });
  }

  // Leverage
  if (ratios.debtToEquity < 0.5) {
    analysis.push({
      category: 'الرافعة المالية',
      status: 'آمن',
      text: 'الاعتماد على الديون منخفض جداً، مما يوفر استقراراً مالياً كبيراً.',
      color: 'text-green-600'
    });
  } else if (ratios.debtToEquity <= 1.5) {
    analysis.push({
      category: 'الرافعة المالية',
      status: 'تنبيه',
      text: 'مستوى الديون متوسط؛ يجب مراقبة الالتزامات المالية بانتظام.',
      color: 'text-blue-600'
    });
  } else {
    analysis.push({
      category: 'الرافعة المالية',
      status: 'مخاطرة',
      text: 'الاعتماد المفرط على الديون يمثل خطورة عالية على استمرارية المنشأة.',
      color: 'text-red-600'
    });
  }

  return analysis;
};

export const getRecommendations = (ratios: FinancialRatios) => {
  const recommendations = [];
  
  if (ratios.currentRatio < 1.2) {
    recommendations.push('العمل على تحويل الأصول غير المتداولة إلى نقدية أو تحسين تحصيل الذمم المدينة لزيادة السيولة.');
  }
  
  if (ratios.netProfitMargin < 5) {
    recommendations.push('مراجعة تكلفة البضاعة المباعة (COGS) والتفاوض مع الموردين لخفض التكاليف.');
    recommendations.push('تحليل المصاريف الإدارية والعمومية للبحث عن فرص لضغط النفقات.');
  }
  
  if (ratios.debtToEquity > 1.5) {
    recommendations.push('التفكير في زيادة رأس المال أو إعادة جدولة الديون لتقليل عبء الفوائد والمخاطر.');
  }
  
  if (ratios.roa < 5) {
    recommendations.push('تحسين استخدام الأصول الثابتة لزيادة العائد على الاستثمار.');
  }

  if (recommendations.length === 0) {
    recommendations.push('الاستمرار في النهج المالي الحالي مع التركيز على التوسع المدروس.');
  }

  return recommendations;
};

export const calculateHorizontalAnalysis = (current: FinancialData, previous: FinancialData) => {
  const analysis: Record<string, { current: number; previous: number; change: number; percentChange: number }> = {};
  
  Object.keys(current).forEach((key) => {
    const k = key as keyof FinancialData;
    const currVal = current[k];
    const prevVal = previous[k];
    const change = currVal - prevVal;
    const percentChange = prevVal !== 0 ? (change / prevVal) * 100 : 0;
    
    analysis[k] = {
      current: currVal,
      previous: prevVal,
      change,
      percentChange
    };
  });
  
  return analysis;
};

export const calculateCashFlow = (current: FinancialData, previous: FinancialData): CashFlowResult => {
  const currentGrossProfit = current.revenue - current.cogs;
  const currentOpEx = current.salaries + current.rents + current.marketing + current.depreciation + current.adminExpenses;
  const currentNetIncome = (currentGrossProfit - currentOpEx) + current.otherIncomeExpense - current.zakatTaxes;

  const deltaAR = current.accountsReceivable - previous.accountsReceivable;
  const deltaInventory = current.inventory - previous.inventory;
  const deltaPrepaid = current.prepaidExpenses - previous.prepaidExpenses;
  const deltaAP = current.accountsPayable - previous.accountsPayable;
  const deltaNotesPayable = current.notesPayable - previous.notesPayable;
  const deltaAccrued = current.accruedExpenses - previous.accruedExpenses;

  const operatingTotal = currentNetIncome + current.depreciation - deltaAR - deltaInventory - deltaPrepaid + deltaAP + deltaNotesPayable + deltaAccrued;

  const deltaFixedAssets = current.fixedAssets - previous.fixedAssets;
  const deltaIntangibleAssets = current.intangibleAssets - previous.intangibleAssets;
  const investingTotal = -(deltaFixedAssets + deltaIntangibleAssets);

  const deltaLongTermLoans = current.longTermLoans - previous.longTermLoans;
  const deltaShortTermLoans = current.shortTermLoans - previous.shortTermLoans;
  const deltaCapital = current.paidInCapital - previous.paidInCapital;
  const financingTotal = deltaLongTermLoans + deltaShortTermLoans + deltaCapital;

  return {
    operating: {
      netIncome: currentNetIncome,
      depreciation: current.depreciation,
      deltaAR,
      deltaInventory,
      deltaPrepaid,
      deltaAP,
      deltaNotesPayable,
      deltaAccrued,
      total: operatingTotal
    },
    investing: {
      deltaFixedAssets,
      deltaIntangibleAssets,
      total: investingTotal
    },
    financing: {
      deltaLongTermLoans,
      deltaShortTermLoans,
      deltaCapital,
      total: financingTotal
    },
    netCashFlow: operatingTotal + investingTotal + financingTotal
  };
};
