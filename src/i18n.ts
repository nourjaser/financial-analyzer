/**
 * Bilingual translations — Arabic (ar) and English (en)
 * Usage: import { makeT } from './i18n'; const t = makeT(lang);
 */

type Lang = 'ar' | 'en';

const translations: Record<string, Record<Lang, string>> = {
  // ── App title ──────────────────────────────────────────────────────────────
  appTitleFull:        { ar: 'محلل البيانات المالية المحترف',   en: 'Professional Financial Analyzer' },
  appTitleShort:       { ar: 'محلل البيانات المالية',           en: 'Financial Analyzer' },

  // ── Nav tabs ───────────────────────────────────────────────────────────────
  tabInput:            { ar: 'إدخال',    en: 'Entry' },
  tabAnalysis:         { ar: 'تحليل',   en: 'Analysis' },
  tabHistory:          { ar: 'سجل',     en: 'History' },
  tabCashflow:         { ar: 'تدفقات',  en: 'Cash Flow' },

  // ── Auth ───────────────────────────────────────────────────────────────────
  signIn:              { ar: 'تسجيل الدخول',  en: 'Sign In' },
  signOut:             { ar: 'تسجيل الخروج',  en: 'Sign Out' },
  signOutTitle:        { ar: 'تسجيل الخروج',  en: 'Sign Out' },

  // ── Balance status bar ────────────────────────────────────────────────────
  balanceStatus:       { ar: 'حالة التوازن',          en: 'Balance Status' },
  balancedEq:          { ar: 'المعادلة متوازنة',       en: 'Equation Balanced' },
  unbalancedEq:        { ar: 'المعادلة غير متوازنة',   en: 'Equation Unbalanced' },
  totalAssets:         { ar: 'إجمالي الأصول',           en: 'Total Assets' },
  liabPlusEquity:      { ar: 'الخصوم + الملكية',        en: 'Liabilities + Equity' },
  difference:          { ar: 'الفرق',                   en: 'Difference' },

  // ── Balance sheet section headings ─────────────────────────────────────────
  balanceSheet:        { ar: 'الميزانية العمومية',                en: 'Balance Sheet' },
  nonCurrentAssets:    { ar: 'الأصول غير المتداولة (أولاً)',      en: 'Non-Current Assets (First)' },
  currentAssets:       { ar: 'الأصول المتداولة',                  en: 'Current Assets' },
  nonCurrentLiab:      { ar: 'الخصوم غير المتداولة (أولاً)',      en: 'Non-Current Liabilities (First)' },
  currentLiab:         { ar: 'الخصوم المتداولة',                  en: 'Current Liabilities' },
  equity:              { ar: 'حقوق الملكية',                      en: 'Equity' },
  accountingEquation:  { ar: 'توازن المعادلة المحاسبية',          en: 'Accounting Equation Balance' },
  totalLiabilities:    { ar: 'إجمالي الخصوم',                     en: 'Total Liabilities' },
  liabAndEquity:       { ar: 'الالتزامات + الملكية',              en: 'Liabilities + Equity' },
  unbalancedNote:      {
    ar: '* المعادلة غير متوازنة. يرجى التأكد من أن الأصول تساوي مجموع الالتزامات وحقوق الملكية.',
    en: '* Equation is unbalanced. Please ensure Assets equal Liabilities + Equity.'
  },

  // ── Balance-sheet field labels (input form) ────────────────────────────────
  fixedAssetsNet:           { ar: 'الأصول الثابتة (صافي)',            en: 'Fixed Assets (Net)' },
  intangibleAssets:         { ar: 'الأصول غير الملموسة',              en: 'Intangible Assets' },
  cashEquivalents:          { ar: 'النقدية وما يعادلها',              en: 'Cash & Equivalents' },
  accountsReceivable:       { ar: 'الذمم المدينة (العملاء)',           en: 'Accounts Receivable (Customers)' },
  inventoryEndPeriod:       { ar: 'المخزون (آخر المدة)',               en: 'Inventory (End of Period)' },
  prepaidExpenses:          { ar: 'مصاريف مدفوعة مقدماً',             en: 'Prepaid Expenses' },
  longTermBankLoans:        { ar: 'قروض بنكية طويلة الأجل',           en: 'Long-Term Bank Loans' },
  endOfServiceBenefits:     { ar: 'مخصصات ترك الخدمة',               en: 'End of Service Benefits' },
  accountsPayableSuppliers: { ar: 'الدائنون (الموردون)',               en: 'Accounts Payable (Suppliers)' },
  notesPayable:             { ar: 'أوراق دفع',                        en: 'Notes Payable' },
  shortTermLoans:           { ar: 'قروض قصيرة الأجل',                 en: 'Short-Term Loans' },
  accruedExpenses:          { ar: 'مصاريف مستحقة',                    en: 'Accrued Expenses' },
  partnerCurrentAccount:    { ar: 'جاري شريك',                        en: 'Partner Current Account' },
  paidInCapital:            { ar: 'رأس المال المدفوع',                en: 'Paid-in Capital' },
  retainedEarnings:         { ar: 'الأرباح المبقاة',                  en: 'Retained Earnings' },
  reserves:                 { ar: 'الاحتياطيات',                      en: 'Reserves' },

  // ── Quick-ratios sidebar ───────────────────────────────────────────────────
  quickRatiosTitle:    { ar: 'نظرة سريعة على النسب',           en: 'Quick Ratio Overview' },
  currentRatioLabel:   { ar: 'نسبة التداول',                    en: 'Current Ratio' },
  netProfitMarginLbl:  { ar: 'هامش الربح الصافي',               en: 'Net Profit Margin' },
  debtRatioLabel:      { ar: 'نسبة الدين',                      en: 'Debt Ratio' },
  viewDetailedAnalysis:{ ar: 'عرض التحليل التفصيلي',            en: 'View Detailed Analysis' },

  // ── Income statement ───────────────────────────────────────────────────────
  incomeStatement:     { ar: 'قائمة الدخل',                         en: 'Income Statement' },
  revenueAndCOGS:      { ar: 'الإيرادات والتكاليف المباشرة',        en: 'Revenue & Direct Costs' },
  operatingExpenses:   { ar: 'المصاريف التشغيلية',                   en: 'Operating Expenses' },
  revenueField:        { ar: 'إيرادات المبيعات',                     en: 'Sales Revenue' },
  cogsField:           { ar: 'تكلفة البضاعة المباعة (COGS)',         en: 'Cost of Goods Sold (COGS)' },
  grossProfit:         { ar: 'مجمل الربح:',                          en: 'Gross Profit:' },
  salariesField:       { ar: 'رواتب وأجور',                          en: 'Salaries & Wages' },
  rentsField:          { ar: 'إيجارات',                              en: 'Rent' },
  marketingField:      { ar: 'مصاريف تسويق',                         en: 'Marketing Expenses' },
  depreciationField:   { ar: 'إهلاك الأصول الثابتة',                en: 'Fixed Asset Depreciation' },
  adminExpensesField:  { ar: 'مصاريف إدارية',                        en: 'Administrative Expenses' },
  ebit:                { ar: 'الربح التشغيلي (EBIT):',               en: 'Operating Profit (EBIT):' },
  otherIncomeExpense:  { ar: 'إيرادات/مصاريف أخرى (صافي)',           en: 'Other Income/Expenses (Net)' },
  zakatTaxes:          { ar: 'الزكاة أو الضرائب',                   en: 'Zakat or Taxes' },
  netIncomeFinal:      { ar: 'صافي الربح النهائي:',                  en: 'Net Income:' },

  // ── Period / save controls ─────────────────────────────────────────────────
  periodPlaceholder:   { ar: 'اسم الفترة (Q1 2024)',   en: 'Period name (Q1 2024)' },
  savePeriod:          { ar: 'حفظ',                    en: 'Save' },
  updatePeriod:        { ar: 'تحديث',                  en: 'Update' },
  cancelEdit:          { ar: 'إلغاء التعديل',           en: 'Cancel Edit' },
  resetData:           { ar: 'إعادة تعيين',             en: 'Reset' },
  exportPDF:           { ar: 'تصدير PDF',               en: 'Export PDF' },

  // ── History tab ────────────────────────────────────────────────────────────
  savedPeriods:        { ar: 'الفترات المحفوظة',                       en: 'Saved Periods' },
  noSavedPeriods:      { ar: 'لا توجد فترات محفوظة بعد.',              en: 'No saved periods yet.' },
  editRecord:          { ar: 'تعديل',                                   en: 'Edit' },
  deleteRecord:        { ar: 'حذف',                                     en: 'Delete' },
  netProfitShort:      { ar: 'صافي الربح',                             en: 'Net Profit' },
  liquidityShort:      { ar: 'السيولة',                                 en: 'Liquidity' },

  // ── Comparison section ────────────────────────────────────────────────────
  performanceComparison: { ar: 'مقارنة الأداء',                        en: 'Performance Comparison' },
  baseYear:              { ar: 'سنة الأساس (الحالي)',                   en: 'Base Year (Current)' },
  comparisonYear:        { ar: 'سنة المقارنة (السابق)',                 en: 'Comparison Year (Previous)' },
  currentPeriod:         { ar: 'الفترة الحالية',                        en: 'Current Period' },
  currentPeriodEntry:    { ar: 'الفترة الحالية (البيانات المدخلة)',     en: 'Current Period (Entered Data)' },
  choosePeriod:          { ar: 'اختر فترة...',                          en: 'Choose a period...' },
  selectPeriodPromptTitle:{ ar: 'اختر فترة للمقارنة',                   en: 'Select a Period to Compare' },
  selectPeriodPromptBody: {
    ar: 'قم باختيار أحد السجلات من القائمة الجانبية أو القائمة المنسدلة لمقارنة أدائها.',
    en: 'Select a record from the sidebar or dropdown to compare its performance.'
  },

  // ── Trend analysis ────────────────────────────────────────────────────────
  trendsTitle:         { ar: 'تحليل الاتجاهات (Trends)',   en: 'Trend Analysis' },
  trendsMinPeriods:    {
    ar: 'تحتاج إلى حفظ فترتين على الأقل لعرض الرسوم البيانية للاتجاهات.',
    en: 'You need at least two saved periods to display trend charts.'
  },
  netProfitPctLine:    { ar: 'هامش الربح %',   en: 'Profit Margin %' },
  currentRatioLine:    { ar: 'نسبة التداول',   en: 'Current Ratio' },

  // ── Horizontal analysis ───────────────────────────────────────────────────
  horizontalAnalysis:  { ar: 'التحليل الأفقي للقوائم المالية',  en: 'Horizontal Analysis of Financial Statements' },
  haItem:              { ar: 'البند',              en: 'Item' },
  haPreviousPeriod:    { ar: 'الفترة السابقة',     en: 'Previous Period' },
  haCurrentPeriod:     { ar: 'الفترة الحالية',     en: 'Current Period' },
  haChangeValue:       { ar: 'التغير (قيمة)',       en: 'Change (Value)' },
  haChangePct:         { ar: 'التغير (%)',           en: 'Change (%)' },
  haAssetsSection:     { ar: 'الأصول (Assets)',                        en: 'Assets' },
  haLiabSection:       { ar: 'الخصوم (Liabilities)',                  en: 'Liabilities' },
  haEquitySection:     { ar: 'حقوق الملكية (Equity)',                 en: 'Equity' },
  haIncomeSection:     { ar: 'قائمة الدخل (Income Statement)',        en: 'Income Statement' },

  // ── Cash flow tab ─────────────────────────────────────────────────────────
  cashFlowRequireTwo:  {
    ar: 'تحليل التدفقات النقدية يتطلب فترتين',
    en: 'Cash Flow Analysis Requires Two Periods'
  },
  cashFlowRequireTwoBody: {
    ar: 'يرجى الذهاب إلى "السجل التاريخي" واختيار فترة أساس وفترة مقارنة لاستخراج قائمة التدفقات النقدية.',
    en: 'Please go to "History" and select a base period and a comparison period to generate the cash flow statement.'
  },
  cashFlowTitle:       { ar: 'قائمة التدفقات النقدية (الطريقة غير المباشرة)', en: 'Cash Flow Statement (Indirect Method)' },
  comparedTo:          { ar: 'مقارنة بـ:',                      en: 'Compared to:' },
  cfItemActivity:      { ar: 'البند / النشاط',                   en: 'Item / Activity' },
  cfAmount:            { ar: 'المبلغ',                           en: 'Amount' },

  cfOperatingHeader:   { ar: 'أولاً: التدفقات النقدية من الأنشطة التشغيلية',    en: 'I. Cash Flows from Operating Activities' },
  cfNetIncome:         { ar: 'صافي الربح للفترة',                               en: 'Net Income for the Period' },
  cfAddDeprec:         { ar: 'يضاف: الإهلاك (مصروف غير نقدي)',                 en: 'Add: Depreciation (Non-Cash Expense)' },
  cfDeltaAR:           { ar: 'التغير في الذمم المدينة (العملاء)',                en: 'Change in Accounts Receivable (Customers)' },
  cfDeltaInventory:    { ar: 'التغير في المخزون',                               en: 'Change in Inventory' },
  cfDeltaPrepaid:      { ar: 'التغير في المصاريف المدفوعة مقدماً',              en: 'Change in Prepaid Expenses' },
  cfDeltaAP:           { ar: 'التغير في الدائنين (الموردين)',                   en: 'Change in Accounts Payable (Suppliers)' },
  cfDeltaNotes:        { ar: 'التغير في أوراق الدفع',                           en: 'Change in Notes Payable' },
  cfDeltaAccrued:      { ar: 'التغير في المصاريف المستحقة',                     en: 'Change in Accrued Expenses' },
  cfNetOperating:      { ar: 'صافي التدفقات النقدية من الأنشطة التشغيلية',     en: 'Net Cash from Operating Activities' },

  cfInvestingHeader:   { ar: 'ثانياً: التدفقات النقدية من الأنشطة الاستثمارية',  en: 'II. Cash Flows from Investing Activities' },
  cfDeltaFixed:        { ar: 'التغير في الأصول الثابتة (شراء/بيع)',              en: 'Change in Fixed Assets (Purchase/Sale)' },
  cfDeltaIntangible:   { ar: 'التغير في الأصول غير الملموسة',                   en: 'Change in Intangible Assets' },
  cfNetInvesting:      { ar: 'صافي التدفقات النقدية من الأنشطة الاستثمارية',    en: 'Net Cash from Investing Activities' },

  cfFinancingHeader:   { ar: 'ثالثاً: التدفقات النقدية من الأنشطة التمويلية',   en: 'III. Cash Flows from Financing Activities' },
  cfDeltaLTLoans:      { ar: 'التغير في القروض طويلة الأجل',                    en: 'Change in Long-Term Loans' },
  cfDeltaSTLoans:      { ar: 'التغير في القروض قصيرة الأجل',                    en: 'Change in Short-Term Loans' },
  cfDeltaCapital:      { ar: 'التغير في رأس المال (زيادة/تخفيض)',               en: 'Change in Capital (Increase/Decrease)' },
  cfNetFinancing:      { ar: 'صافي التدفقات النقدية من الأنشطة التمويلية',      en: 'Net Cash from Financing Activities' },

  cfNetChange:         { ar: 'صافي الزيادة/النقص في النقدية خلال الفترة',       en: 'Net Increase/Decrease in Cash During the Period' },
  cfNote:              {
    ar: 'ملاحظة: يتم استخراج هذه القائمة باستخدام الطريقة غير المباشرة بناءً على التغيرات في الميزانية العمومية وقائمة الدخل بين الفترتين المختارتين.',
    en: 'Note: This statement is derived using the indirect method based on changes in the balance sheet and income statement between the two selected periods.'
  },

  // ── Analysis tab ──────────────────────────────────────────────────────────
  viewPeriodAnalysis:  { ar: 'عرض تحليل الفترة:',              en: 'View Period Analysis:' },
  choosePeriodHint:    { ar: 'اختر الفترة لعرض تحليلها المالي', en: 'Select a period to view its financial analysis' },

  // Summary cards
  totalAssetsCard:     { ar: 'إجمالي الأصول',          en: 'Total Assets' },
  netProfitCard:       { ar: 'صافي الربح',              en: 'Net Profit' },
  totalEquityCard:     { ar: 'إجمالي حقوق الملكية',     en: 'Total Equity' },
  currentRatioCard:    { ar: 'نسبة التداول',            en: 'Current Ratio' },

  // Ratio section headers
  liquidityIndicators:   { ar: 'مؤشرات السيولة (Liquidity)',           en: 'Liquidity Indicators' },
  profitabilityIndicators:{ ar: 'مؤشرات الربحية (Profitability)',      en: 'Profitability Indicators' },
  solvencyIndicators:    { ar: 'مؤشرات الملاءة المالية (Solvency)',    en: 'Solvency Indicators' },

  // Ratio labels & descriptions
  currentRatioRatio:       { ar: 'نسبة التداول',                         en: 'Current Ratio' },
  currentRatioDesc:        { ar: 'قدرة الشركة على سداد التزاماتها قصيرة الأجل', en: 'Ability to meet short-term obligations' },
  quickRatioRatio:         { ar: 'النسبة السريعة',                        en: 'Quick Ratio' },
  quickRatioDesc:          { ar: 'السيولة الفورية باستبعاد المخزون',       en: 'Immediate liquidity excluding inventory' },
  grossProfitMarginRatio:  { ar: 'هامش مجمل الربح',                       en: 'Gross Profit Margin' },
  grossProfitMarginDesc:   { ar: 'كفاءة الإنتاج والتسعير',                en: 'Production and pricing efficiency' },
  netProfitMarginRatio:    { ar: 'هامش صافي الربح',                       en: 'Net Profit Margin' },
  netProfitMarginDesc:     { ar: 'الربحية النهائية بعد كافة المصاريف',    en: 'Final profitability after all expenses' },
  roaRatio:                { ar: 'العائد على الأصول',                      en: 'Return on Assets' },
  roaDesc:                 { ar: 'كفاءة استخدام الأصول لتوليد الأرباح',   en: 'Efficiency of using assets to generate profit' },
  roeRatio:                { ar: 'العائد على حقوق الملكية',                en: 'Return on Equity' },
  roeDesc:                 { ar: 'العائد المحقق للمساهمين',                en: 'Return achieved for shareholders' },
  debtToEquityRatio:       { ar: 'نسبة الدين إلى حقوق الملكية',           en: 'Debt-to-Equity Ratio' },
  debtToEquityDesc:        { ar: 'مدى الاعتماد على الديون مقابل التمويل الذاتي', en: 'Reliance on debt vs. self-financing' },

  // Benchmark row inside RatioIndicator
  benchmark:           { ar: 'المعيار',      en: 'Benchmark' },
  statusLabel:         { ar: 'الحالة',       en: 'Status' },
  statusGood:          { ar: 'ممتاز',        en: 'Excellent' },
  statusNeedsWork:     { ar: 'يحتاج تحسين', en: 'Needs Improvement' },

  // Radar chart
  radarTitle:          { ar: 'بصمة الصحة المالية',   en: 'Financial Health Fingerprint' },
  radarPerformance:    { ar: 'الأداء',               en: 'Performance' },
  radarCaption:        {
    ar: 'كلما اتسعت المساحة الزرقاء، زادت قوة التوازن المالي للشركة',
    en: 'The wider the blue area, the stronger the company\'s financial balance'
  },
  radarCurrentLiquidity: { ar: 'السيولة المتداولة', en: 'Current Liquidity' },
  radarQuickLiquidity:   { ar: 'السيولة السريعة',   en: 'Quick Liquidity' },
  radarProfitMargin:     { ar: 'هامش الربح',         en: 'Profit Margin' },
  radarROA:              { ar: 'العائد على الأصول',   en: 'Return on Assets' },
  radarLeverage:         { ar: 'الرافعة المالية',     en: 'Financial Leverage' },

  // Qualitative analysis
  qualitativeTitle:    { ar: 'التحليل النوعي',       en: 'Qualitative Analysis' },
  recommendationsTitle:{ ar: 'توصيات الخبير المالي', en: 'Financial Expert Recommendations' },

  // Comparison chart labels
  compNetMarginPct:    { ar: 'هامش الصافي %',         en: 'Net Margin %' },
  compROAPct:          { ar: 'العائد على الأصول %',    en: 'Return on Assets %' },
  compDebtRatio:       { ar: 'نسبة الدين',             en: 'Debt Ratio' },

  // ── Modals & toasts ───────────────────────────────────────────────────────
  confirmDeleteTitle:  { ar: 'تأكيد الحذف',           en: 'Confirm Delete' },
  confirmDeleteMsg:    {
    ar: 'هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذه العملية.',
    en: 'Are you sure you want to delete this record? This action cannot be undone.'
  },
  cancel:              { ar: 'إلغاء',       en: 'Cancel' },
  deleteFinal:         { ar: 'حذف نهائي',  en: 'Delete' },

  toastLoginRequired:  { ar: 'يرجى تسجيل الدخول لحفظ البيانات',                    en: 'Please sign in to save data' },
  toastPeriodRequired: { ar: 'يرجى إدخال اسم الفترة (مثلاً: الربع الأول 2024)',    en: 'Please enter a period name (e.g. Q1 2024)' },
  toastUpdateSuccess:  { ar: 'تم تحديث البيانات بنجاح',                             en: 'Data updated successfully' },
  toastSaveSuccess:    { ar: 'تم حفظ البيانات بنجاح في السجل التاريخي',            en: 'Data saved successfully to history' },
  toastDeleteSuccess:  { ar: 'تم حذف السجل بنجاح',                                 en: 'Record deleted successfully' },
  toastDBError:        { ar: 'حدث خطأ في الاتصال بقاعدة البيانات',                 en: 'A database connection error occurred' },
  toastFirebaseError:  { ar: 'خطأ في الاتصال بـ Firebase. يرجى التحقق من الإعدادات.', en: 'Firebase connection error. Please check your settings.' },
  toastPDFError:       { ar: 'حدث خطأ أثناء تصدير ملف PDF. يرجى المحاولة مرة أخرى.', en: 'An error occurred while exporting PDF. Please try again.' },

  // ── Footer ────────────────────────────────────────────────────────────────
  footerCopyright:     { ar: '© 2026 نظام التحليل المالي الذكي - جميع الحقوق محفوظة', en: '© 2026 Smart Financial Analysis System - All Rights Reserved' },
  footerSubtitle:      { ar: 'تم التصميم لأغراض المحاسبة القانونية والتحليل المالي الاحترافي', en: 'Designed for legal accounting and professional financial analysis' },

  // ── fieldLabels (horizontal analysis table & quick lookup) ───────────────
  fl_fixedAssets:           { ar: 'الأصول الثابتة',               en: 'Fixed Assets' },
  fl_intangibleAssets:      { ar: 'الأصول غير الملموسة',          en: 'Intangible Assets' },
  fl_cash:                  { ar: 'النقدية وما يعادلها',           en: 'Cash & Equivalents' },
  fl_accountsReceivable:    { ar: 'الذمم المدينة',                 en: 'Accounts Receivable' },
  fl_inventory:             { ar: 'المخزون',                       en: 'Inventory' },
  fl_prepaidExpenses:       { ar: 'مصاريف مدفوعة مقدماً',         en: 'Prepaid Expenses' },
  fl_longTermLoans:         { ar: 'قروض طويلة الأجل',              en: 'Long-Term Loans' },
  fl_endOfServiceBenefits:  { ar: 'مخصصات ترك الخدمة',            en: 'End of Service Benefits' },
  fl_accountsPayable:       { ar: 'الدائنون',                      en: 'Accounts Payable' },
  fl_notesPayable:          { ar: 'أوراق دفع',                     en: 'Notes Payable' },
  fl_shortTermLoans:        { ar: 'قروض قصيرة الأجل',              en: 'Short-Term Loans' },
  fl_accruedExpenses:       { ar: 'مصاريف مستحقة',                 en: 'Accrued Expenses' },
  fl_partnerCurrentAccount: { ar: 'جاري شريك',                     en: 'Partner Current Account' },
  fl_paidInCapital:         { ar: 'رأس المال',                     en: 'Paid-in Capital' },
  fl_retainedEarnings:      { ar: 'الأرباح المبقاة',               en: 'Retained Earnings' },
  fl_reserves:              { ar: 'الاحتياطيات',                   en: 'Reserves' },
  fl_revenue:               { ar: 'المبيعات',                      en: 'Revenue' },
  fl_cogs:                  { ar: 'تكلفة المبيعات',                en: 'Cost of Goods Sold' },
  fl_salaries:              { ar: 'الرواتب',                       en: 'Salaries & Wages' },
  fl_rents:                 { ar: 'الإيجارات',                     en: 'Rent' },
  fl_marketing:             { ar: 'التسويق',                       en: 'Marketing' },
  fl_depreciation:          { ar: 'الإهلاك',                       en: 'Depreciation' },
  fl_adminExpenses:         { ar: 'مصاريف إدارية',                 en: 'Administrative Expenses' },
  fl_otherIncomeExpense:    { ar: 'إيرادات/مصاريف أخرى',           en: 'Other Income/Expenses' },
  fl_zakatTaxes:            { ar: 'الزكاة والضرائب',               en: 'Zakat & Taxes' },
  fl_totalAssets:           { ar: 'إجمالي الأصول',                 en: 'Total Assets' },
  fl_totalLiabilities:      { ar: 'إجمالي الخصوم',                 en: 'Total Liabilities' },
  fl_totalEquity:           { ar: 'إجمالي حقوق الملكية',           en: 'Total Equity' },
  fl_netIncome:             { ar: 'صافي الربح النهائي',             en: 'Net Income' },

  // ── Qualitative analysis strings (from financeUtils) ─────────────────────
  // categories
  qa_liquidity:        { ar: 'السيولة',         en: 'Liquidity' },
  qa_netProfit:        { ar: 'صافي الربح',       en: 'Net Profit' },
  qa_grossProfit:      { ar: 'مجمل الربح',       en: 'Gross Profit' },
  qa_leverage:         { ar: 'الرافعة المالية',   en: 'Financial Leverage' },
  // statuses
  qs_excellent:        { ar: 'ممتاز',    en: 'Excellent' },
  qs_good:             { ar: 'جيد',      en: 'Good' },
  qs_risk:             { ar: 'خطر',      en: 'Risk' },
  qs_caution:          { ar: 'مخاطرة',   en: 'Caution' },
  qs_warning:          { ar: 'تحذير',    en: 'Warning' },
  qs_safe:             { ar: 'آمن',      en: 'Safe' },
  qs_notice:           { ar: 'تنبيه',    en: 'Notice' },
  // text messages
  qt_liqExcellent: {
    ar: 'تتمتع الشركة بسيولة قوية جداً، مما يعني قدرة عالية على سداد الالتزامات قصيرة الأجل.',
    en: 'The company has very strong liquidity, indicating a high capacity to meet short-term obligations.'
  },
  qt_liqGood: {
    ar: 'السيولة في مستوى آمن ومقبول محاسبياً.',
    en: 'Liquidity is at a safe and acceptable level.'
  },
  qt_liqRisk: {
    ar: 'هناك مخاطر في السيولة؛ قد تواجه الشركة صعوبة في سداد التزاماتها العاجلة.',
    en: 'There are liquidity risks; the company may face difficulty meeting urgent obligations.'
  },
  qt_netExcellent: {
    ar: 'هامش الربح الصافي قوي جداً، مما يدل على كفاءة تشغيلية عالية.',
    en: 'The net profit margin is very strong, indicating high operational efficiency.'
  },
  qt_netGood: {
    ar: 'الربحية في نطاق الصناعة المعتاد.',
    en: 'Profitability is within the usual industry range.'
  },
  qt_netRisk: {
    ar: 'الربحية منخفضة؛ يجب مراجعة هيكل التكاليف والمصاريف التشغيلية.',
    en: 'Profitability is low; cost structure and operating expenses should be reviewed.'
  },
  qt_grossExcellent: {
    ar: 'هامش مجمل الربح مرتفع، مما يشير إلى قوة في التسعير أو كفاءة في الإنتاج.',
    en: 'Gross profit margin is high, indicating strong pricing power or production efficiency.'
  },
  qt_grossGood: {
    ar: 'هامش مجمل الربح في مستوى صحي ومستقر.',
    en: 'Gross profit margin is at a healthy and stable level.'
  },
  qt_grossWarning: {
    ar: 'هامش مجمل الربح منخفض؛ قد تكون هناك زيادة في تكاليف الإنتاج أو ضغوط سعرية.',
    en: 'Gross profit margin is low; there may be rising production costs or pricing pressure.'
  },
  qt_levSafe: {
    ar: 'الاعتماد على الديون منخفض جداً، مما يوفر استقراراً مالياً كبيراً.',
    en: 'Debt reliance is very low, providing significant financial stability.'
  },
  qt_levNotice: {
    ar: 'مستوى الديون متوسط؛ يجب مراقبة الالتزامات المالية بانتظام.',
    en: 'Debt level is moderate; financial obligations should be monitored regularly.'
  },
  qt_levRisk: {
    ar: 'الاعتماد المفرط على الديون يمثل خطورة عالية على استمرارية المنشأة.',
    en: 'Excessive reliance on debt poses a high risk to the entity\'s continuity.'
  },

  // ── Recommendations (from financeUtils) ───────────────────────────────────
  rec_liquidity: {
    ar: 'العمل على تحويل الأصول غير المتداولة إلى نقدية أو تحسين تحصيل الذمم المدينة لزيادة السيولة.',
    en: 'Work on converting non-current assets to cash or improving accounts receivable collection to increase liquidity.'
  },
  rec_cogs: {
    ar: 'مراجعة تكلفة البضاعة المباعة (COGS) والتفاوض مع الموردين لخفض التكاليف.',
    en: 'Review the cost of goods sold (COGS) and negotiate with suppliers to reduce costs.'
  },
  rec_admin: {
    ar: 'تحليل المصاريف الإدارية والعمومية للبحث عن فرص لضغط النفقات.',
    en: 'Analyze administrative and general expenses to find opportunities to cut costs.'
  },
  rec_debt: {
    ar: 'التفكير في زيادة رأس المال أو إعادة جدولة الديون لتقليل عبء الفوائد والمخاطر.',
    en: 'Consider increasing capital or rescheduling debts to reduce interest burden and risks.'
  },
  rec_roa: {
    ar: 'تحسين استخدام الأصول الثابتة لزيادة العائد على الاستثمار.',
    en: 'Improve utilization of fixed assets to increase return on investment.'
  },
  rec_default: {
    ar: 'الاستمرار في النهج المالي الحالي مع التركيز على التوسع المدروس.',
    en: 'Continue with the current financial approach while focusing on measured expansion.'
  },
};

export function makeT(lang: Lang) {
  return function t(key: string): string {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] ?? entry['ar'];
  };
}

/**
 * Language-aware fieldLabels builder.
 * Returns a Record<string,string> matching the shape of the original fieldLabels object.
 */
export function makeFieldLabels(lang: Lang): Record<string, string> {
  const fl = (key: string) => {
    const entry = translations[`fl_${key}`];
    if (!entry) return key;
    return entry[lang] ?? entry['ar'];
  };
  return {
    fixedAssets:           fl('fixedAssets'),
    intangibleAssets:      fl('intangibleAssets'),
    cash:                  fl('cash'),
    accountsReceivable:    fl('accountsReceivable'),
    inventory:             fl('inventory'),
    prepaidExpenses:       fl('prepaidExpenses'),
    longTermLoans:         fl('longTermLoans'),
    endOfServiceBenefits:  fl('endOfServiceBenefits'),
    accountsPayable:       fl('accountsPayable'),
    notesPayable:          fl('notesPayable'),
    shortTermLoans:        fl('shortTermLoans'),
    accruedExpenses:       fl('accruedExpenses'),
    partnerCurrentAccount: fl('partnerCurrentAccount'),
    paidInCapital:         fl('paidInCapital'),
    retainedEarnings:      fl('retainedEarnings'),
    reserves:              fl('reserves'),
    revenue:               fl('revenue'),
    cogs:                  fl('cogs'),
    salaries:              fl('salaries'),
    rents:                 fl('rents'),
    marketing:             fl('marketing'),
    depreciation:          fl('depreciation'),
    adminExpenses:         fl('adminExpenses'),
    otherIncomeExpense:    fl('otherIncomeExpense'),
    zakatTaxes:            fl('zakatTaxes'),
    totalAssets:           fl('totalAssets'),
    totalLiabilities:      fl('totalLiabilities'),
    totalEquity:           fl('totalEquity'),
    netIncome:             fl('netIncome'),
  };
}

export type { Lang };
