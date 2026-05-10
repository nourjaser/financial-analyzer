/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRightLeft, 
  PieChart as PieChartIcon,
  FileText,
  AlertTriangle,
  Lightbulb,
  Download,
  RefreshCw,
  History,
  Save,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Wallet,
  Activity,
  Target,
  Pencil,
  X,
  FileDown,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { FinancialData, HistoricalRecord } from './types';
import { calculateRatios, getQualitativeAnalysis, getRecommendations, calculateHorizontalAnalysis, calculateCashFlow } from './lib/financeUtils';
import { auth, db, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, getDocFromServer } from 'firebase/firestore';

const fieldLabels: Record<string, string> = {
  fixedAssets: 'الأصول الثابتة',
  intangibleAssets: 'الأصول غير الملموسة',
  cash: 'النقدية وما يعادلها',
  accountsReceivable: 'الذمم المدينة',
  inventory: 'المخزون',
  prepaidExpenses: 'مصاريف مدفوعة مقدماً',
  longTermLoans: 'قروض طويلة الأجل',
  endOfServiceBenefits: 'مخصصات ترك الخدمة',
  accountsPayable: 'الدائنون',
  notesPayable: 'أوراق دفع',
  shortTermLoans: 'قروض قصيرة الأجل',
  accruedExpenses: 'مصاريف مستحقة',
  partnerCurrentAccount: 'جاري شريك',
  paidInCapital: 'رأس المال',
  retainedEarnings: 'الأرباح المبقاة',
  reserves: 'الاحتياطيات',
  revenue: 'المبيعات',
  cogs: 'تكلفة المبيعات',
  salaries: 'الرواتب',
  rents: 'الإيجارات',
  marketing: 'التسويق',
  depreciation: 'الإهلاك',
  adminExpenses: 'مصاريف إدارية',
  otherIncomeExpense: 'إيرادات/مصاريف أخرى',
  zakatTaxes: 'الزكاة والضرائب',
  totalAssets: 'إجمالي الأصول',
  totalLiabilities: 'إجمالي الخصوم',
  totalEquity: 'إجمالي حقوق الملكية',
  netIncome: 'صافي الربح النهائي'
};

const initialData: FinancialData = {
  fixedAssets: 0,
  intangibleAssets: 0,
  cash: 0,
  accountsReceivable: 0,
  inventory: 0,
  prepaidExpenses: 0,
  longTermLoans: 0,
  endOfServiceBenefits: 0,
  accountsPayable: 0,
  notesPayable: 0,
  shortTermLoans: 0,
  accruedExpenses: 0,
  partnerCurrentAccount: 0,
  paidInCapital: 0,
  retainedEarnings: 0,
  reserves: 0,
  revenue: 0,
  cogs: 0,
  salaries: 0,
  rents: 0,
  marketing: 0,
  depreciation: 0,
  adminExpenses: 0,
  otherIncomeExpense: 0,
  zakatTaxes: 0
};

export default function App() {
  const [data, setData] = useState<FinancialData>(initialData);
  const [activeTab, setActiveTab] = useState<'input' | 'analysis' | 'history' | 'cashflow'>('input');
  const [history, setHistory] = useState<HistoricalRecord[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [periodName, setPeriodName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<'current' | string>('current');
  const [baseId, setBaseId] = useState<'current' | string>('current');
  const [targetId, setTargetId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);

  // Toast Auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Error Handler
  const handleFirestoreError = (error: any, operation: string, path: string | null) => {
    const errInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      },
      operation,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    setToast({ message: 'حدث خطأ في الاتصال بقاعدة البيانات', type: 'error' });
  };

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        // Reset state on logout for privacy
        setData(initialData);
        setViewingId('current');
        setBaseId('current');
        setTargetId(null);
        setEditingId(null);
        setPeriodName('');
      }
    });
    return () => unsubscribe();
  }, []);

  // Connection Test
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, '_internal_', 'connection_test'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. The client is offline.");
          setToast({ message: 'خطأ في الاتصال بـ Firebase. يرجى التحقق من الإعدادات.', type: 'error' });
        }
      }
    }
    testConnection();
  }, []);

  // Firestore Listener
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const q = query(
      collection(db, 'history'),
      where('userId', '==', user.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as HistoricalRecord[];
      setHistory(records);
    });

    return () => unsubscribe();
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const currentAnalysis = useMemo(() => calculateRatios(data), [data]);

  const viewingRecord = useMemo(() => {
    if (viewingId === 'current') {
      return { 
        id: 'current',
        periodName: 'الفترة الحالية (البيانات المدخلة)',
        data: data,
        analysis: currentAnalysis
      };
    }
    const found = history.find(h => h.id === viewingId);
    return found || { 
      id: 'current',
      periodName: 'الفترة الحالية (البيانات المدخلة)',
      data: data,
      analysis: currentAnalysis
    };
  }, [viewingId, data, currentAnalysis, history]);

  const qualitative = useMemo(() => getQualitativeAnalysis(viewingRecord.analysis.ratios), [viewingRecord]);
  const recommendations = useMemo(() => getRecommendations(viewingRecord.analysis.ratios), [viewingRecord]);

  const saveToHistory = async () => {
    if (!user) {
      setToast({ message: 'يرجى تسجيل الدخول لحفظ البيانات', type: 'error' });
      return;
    }
    if (!periodName.trim()) {
      setToast({ message: 'يرجى إدخال اسم الفترة (مثلاً: الربع الأول 2024)', type: 'error' });
      return;
    }

    try {
      if (editingId) {
        const docRef = doc(db, 'history', editingId);
        await updateDoc(docRef, {
          periodName,
          data: { ...data },
          analysis: { ...currentAnalysis },
          updatedAt: serverTimestamp()
        });
        setEditingId(null);
        setPeriodName('');
        setToast({ message: 'تم تحديث البيانات بنجاح', type: 'success' });
      } else {
        await addDoc(collection(db, 'history'), {
          userId: user.uid,
          periodName,
          date: new Date().toISOString(),
          data: { ...data },
          analysis: { ...currentAnalysis },
          createdAt: serverTimestamp()
        });
        setPeriodName('');
        setToast({ message: 'تم حفظ البيانات بنجاح في السجل التاريخي', type: 'success' });
      }
    } catch (error) {
      handleFirestoreError(error, 'WRITE', 'history');
    }
  };

  const handleEdit = (record: HistoricalRecord) => {
    setData(record.data);
    setPeriodName(record.periodName);
    setEditingId(record.id);
    setActiveTab('input');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPeriodName('');
    setData(initialData);
  };

  const deleteFromHistory = async (id: string) => {
    setConfirmModal({
      message: 'هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذه العملية.',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'history', id));
          if (baseId === id) setBaseId('current');
          if (targetId === id) setTargetId(null);
          if (viewingId === id) setViewingId('current');
          setToast({ message: 'تم حذف السجل بنجاح', type: 'success' });
        } catch (error) {
          handleFirestoreError(error, 'DELETE', `history/${id}`);
        }
        setConfirmModal(null);
      }
    });
  };

  const exportToPDF = async () => {
    const element = document.getElementById('analysis-report');
    if (!element) return;

    setIsExporting(true);
    try {
      // html-to-image handles modern CSS like oklch much better than html2canvas
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#f8fafc', // slate-50
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit A4
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));
      
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (img.height * imgWidth) / img.width;
      
      pdf.addImage(dataUrl, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`Financial_Analysis_${viewingRecord.periodName}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
      setToast({ message: 'حدث خطأ أثناء تصدير ملف PDF. يرجى المحاولة مرة أخرى.', type: 'error' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Strict numeric validation: allow only digits and one decimal point
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }

    setData(prev => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value)
    }));
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Calculated values for display
  const getCalculatedValues = (d: FinancialData) => {
    const grossProfit = d.revenue - d.cogs;
    const totalOpEx = d.salaries + d.rents + d.marketing + d.depreciation + d.adminExpenses;
    const ebit = grossProfit - totalOpEx;
    const netIncome = ebit + d.otherIncomeExpense - d.zakatTaxes;
    const totalEquity = d.paidInCapital + d.retainedEarnings + d.reserves;
    return { grossProfit, totalOpEx, ebit, netIncome, totalEquity };
  };

  const currentValues = getCalculatedValues(data);
  const viewingValues = getCalculatedValues(viewingRecord.data);

  // Comparison logic
  const baseRecord = useMemo(() => {
    if (baseId === 'current') {
      return { id: 'current', periodName: 'الفترة الحالية', data, analysis: currentAnalysis };
    }
    return history.find(h => h.id === baseId) || { id: 'current', periodName: 'الفترة الحالية', data, analysis: currentAnalysis };
  }, [baseId, history, data, currentAnalysis]);

  const targetRecord = useMemo(() => {
    return history.find(h => h.id === targetId) || history[0] || null;
  }, [targetId, history]);

  // Comparison data
  const comparisonData = useMemo(() => {
    if (!targetRecord) return [];
    return [
      { name: 'نسبة التداول', current: baseRecord.analysis.ratios.currentRatio, previous: targetRecord.analysis.ratios.currentRatio },
      { name: 'النسبة السريعة', current: baseRecord.analysis.ratios.quickRatio, previous: targetRecord.analysis.ratios.quickRatio },
      { name: 'هامش الصافي %', current: baseRecord.analysis.ratios.netProfitMargin, previous: targetRecord.analysis.ratios.netProfitMargin },
      { name: 'العائد على الأصول %', current: baseRecord.analysis.ratios.roa, previous: targetRecord.analysis.ratios.roa },
      { name: 'نسبة الدين', current: baseRecord.analysis.ratios.debtToEquity, previous: targetRecord.analysis.ratios.debtToEquity },
    ];
  }, [baseRecord, targetRecord]);

  // Trend data
  const trendData = useMemo(() => {
    const allRecords = [
      ...history,
      {
        id: 'current',
        periodName: 'الفترة الحالية',
        date: new Date().toISOString(),
        analysis: currentAnalysis,
        data: data
      }
    ];
    const sorted = allRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map(h => ({
      period: h.periodName,
      netProfit: h.analysis.ratios.netProfitMargin,
      currentRatio: h.analysis.ratios.currentRatio,
      roa: h.analysis.ratios.roa
    }));
  }, [history, currentAnalysis, data]);

  // Horizontal Analysis
  const horizontalAnalysis = useMemo(() => {
    if (!targetRecord) return null;
    const analysis = calculateHorizontalAnalysis(baseRecord.data, targetRecord.data);
    
    // Add calculated totals to horizontal analysis
    const prevValues = getCalculatedValues(targetRecord.data);
    const currValues = getCalculatedValues(baseRecord.data);
    
    const addTotal = (key: string, curr: number, prev: number) => {
      const change = curr - prev;
      const percentChange = prev !== 0 ? (change / prev) * 100 : 0;
      analysis[key] = { current: curr, previous: prev, change, percentChange };
    };

    addTotal('totalAssets', baseRecord.analysis.totalAssets, targetRecord.analysis.totalAssets);
    addTotal('totalLiabilities', baseRecord.analysis.totalLiabilitiesAndEquity - currValues.totalEquity, targetRecord.analysis.totalLiabilitiesAndEquity - prevValues.totalEquity);
    addTotal('totalEquity', currValues.totalEquity, prevValues.totalEquity);
    addTotal('netIncome', currValues.netIncome, prevValues.netIncome);

    return analysis;
  }, [baseRecord, targetRecord]);

  // Cash Flow Analysis
  const cashFlowData = useMemo(() => {
    if (!targetRecord) return null;
    return calculateCashFlow(baseRecord.data, targetRecord.data);
  }, [baseRecord, targetRecord]);

  // Radar Chart Data
  const radarData = useMemo(() => {
    const normalize = (val: number, min: number, max: number) => {
      const normalized = ((val - min) / (max - min)) * 100;
      return Math.min(Math.max(normalized, 0), 100);
    };

    return [
      { subject: 'السيولة المتداولة', A: normalize(viewingRecord.analysis.ratios.currentRatio, 0.5, 2.5), fullMark: 100 },
      { subject: 'السيولة السريعة', A: normalize(viewingRecord.analysis.ratios.quickRatio, 0.5, 2.0), fullMark: 100 },
      { subject: 'هامش الربح', A: normalize(viewingRecord.analysis.ratios.netProfitMargin, 0, 20), fullMark: 100 },
      { subject: 'العائد على الأصول', A: normalize(viewingRecord.analysis.ratios.roa, 0, 15), fullMark: 100 },
      { subject: 'الرافعة المالية', A: normalize(2 - viewingRecord.analysis.ratios.debtToEquity, 0, 2), fullMark: 100 },
    ];
  }, [viewingRecord]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 min-h-16 py-2 sm:py-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg shrink-0">
              <Calculator className="text-white w-4 sm:w-6 h-4 sm:h-6" />
            </div>
            <h1 className="text-sm sm:text-xl font-bold text-slate-800 truncate">
              <span className="hidden sm:inline">محلل البيانات المالية المحترف</span>
              <span className="sm:hidden">محلل البيانات المالية</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-1 md:flex-none overflow-x-auto">
            <div className="flex gap-1 sm:gap-2 flex-wrap md:flex-nowrap">
              <button
                onClick={() => setActiveTab('input')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'input' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                إدخال
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'analysis' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                تحليل
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'history' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                سجل
              </button>
              <button
                onClick={() => setActiveTab('cashflow')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'cashflow' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                تدفقات
              </button>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-800 leading-none">{user.displayName}</p>
                  <p className="text-[10px] text-slate-500">{user.email}</p>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <button 
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
            >
              {/* Balance Sheet Input */}
              <div className="lg:col-span-2 space-y-6">
                {/* Real-time Balance Summary (Mobile/Quick View) */}
                <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 transition-all ${currentAnalysis.isBalanced ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${currentAnalysis.isBalanced ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {currentAnalysis.isBalanced ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">حالة التوازن</p>
                      <p className={`text-sm font-bold ${currentAnalysis.isBalanced ? 'text-green-700' : 'text-red-700'}`}>
                        {currentAnalysis.isBalanced ? 'المعادلة متوازنة' : 'المعادلة غير متوازنة'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">إجمالي الأصول</p>
                      <p className="font-mono font-bold text-slate-700">{currentAnalysis.totalAssets.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">الخصوم + الملكية</p>
                      <p className="font-mono font-bold text-slate-700">{currentAnalysis.totalLiabilitiesAndEquity.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">الفرق</p>
                      <p className={`font-mono font-bold ${currentAnalysis.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {currentAnalysis.difference.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 border-b pb-3 sm:pb-4 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="text-blue-600 w-4 sm:w-5 h-4 sm:h-5" />
                      <h2 className="text-base sm:text-lg font-semibold">الميزانية العمومية</h2>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                      <input
                        type="text"
                        placeholder="اسم الفترة (Q1 2024)"
                        value={periodName}
                        onChange={(e) => setPeriodName(e.target.value)}
                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none min-w-0"
                      />
                      <button
                        onClick={saveToHistory}
                        className={`${editingId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-colors whitespace-nowrap`}
                      >
                        {editingId ? <RefreshCw className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {editingId ? 'تحديث' : 'حفظ'}
                      </button>
                      {editingId && (
                        <button
                          onClick={cancelEdit}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
                          title="إلغاء التعديل"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    {/* Assets Section */}
                    <section className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider border-r-4 border-blue-600 pr-2">الأصول غير المتداولة (أولاً)</h3>
                        <InputField label="الأصول الثابتة (صافي)" name="fixedAssets" value={data.fixedAssets} onChange={handleInputChange} />
                        <InputField label="الأصول غير الملموسة" name="intangibleAssets" value={data.intangibleAssets} onChange={handleInputChange} />
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-r-4 border-slate-400 pr-2">الأصول المتداولة</h3>
                        <InputField label="النقدية وما يعادلها" name="cash" value={data.cash} onChange={handleInputChange} />
                        <InputField label="الذمم المدينة (العملاء)" name="accountsReceivable" value={data.accountsReceivable} onChange={handleInputChange} />
                        <InputField label="المخزون (آخر المدة)" name="inventory" value={data.inventory} onChange={handleInputChange} />
                        <InputField label="مصاريف مدفوعة مقدماً" name="prepaidExpenses" value={data.prepaidExpenses} onChange={handleInputChange} />
                      </div>
                    </section>

                    {/* Liabilities & Equity Section */}
                    <section className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider border-r-4 border-red-600 pr-2">الخصوم غير المتداولة (أولاً)</h3>
                        <InputField label="قروض بنكية طويلة الأجل" name="longTermLoans" value={data.longTermLoans} onChange={handleInputChange} />
                        <InputField label="مخصصات ترك الخدمة" name="endOfServiceBenefits" value={data.endOfServiceBenefits} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider border-r-4 border-slate-400 pr-2">الخصوم المتداولة</h3>
                        <InputField label="الدائنون (الموردون)" name="accountsPayable" value={data.accountsPayable} onChange={handleInputChange} />
                        <InputField label="أوراق دفع" name="notesPayable" value={data.notesPayable} onChange={handleInputChange} />
                        <InputField label="قروض قصيرة الأجل" name="shortTermLoans" value={data.shortTermLoans} onChange={handleInputChange} />
                        <InputField label="مصاريف مستحقة" name="accruedExpenses" value={data.accruedExpenses} onChange={handleInputChange} />
                        <InputField label="جاري شريك" name="partnerCurrentAccount" value={data.partnerCurrentAccount} onChange={handleInputChange} />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider border-r-4 border-green-600 pr-2">حقوق الملكية</h3>
                        <InputField label="رأس المال المدفوع" name="paidInCapital" value={data.paidInCapital} onChange={handleInputChange} />
                        <InputField label="الأرباح المبقاة" name="retainedEarnings" value={data.retainedEarnings} onChange={handleInputChange} />
                        <InputField label="الاحتياطيات" name="reserves" value={data.reserves} onChange={handleInputChange} />
                      </div>
                    </section>
                  </div>
                </div>

                <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6 border-b pb-3 sm:pb-4">
                    <TrendingUp className="text-green-600 w-4 sm:w-5 h-4 sm:h-5" />
                    <h2 className="text-base sm:text-lg font-semibold">قائمة الدخل</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">الإيرادات والتكاليف المباشرة</h3>
                      <InputField label="إيرادات المبيعات" name="revenue" value={data.revenue} onChange={handleInputChange} />
                      <InputField label="تكلفة البضاعة المباعة (COGS)" name="cogs" value={data.cogs} onChange={handleInputChange} />
                      <div className="p-3 bg-slate-50 rounded-lg flex justify-between items-center">
                        <span className="text-sm font-bold">مجمل الربح:</span>
                        <span className="font-mono font-bold text-blue-600">{currentValues.grossProfit.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">المصاريف التشغيلية</h3>
                      <InputField label="رواتب وأجور" name="salaries" value={data.salaries} onChange={handleInputChange} />
                      <InputField label="إيجارات" name="rents" value={data.rents} onChange={handleInputChange} />
                      <InputField label="مصاريف تسويق" name="marketing" value={data.marketing} onChange={handleInputChange} />
                      <InputField label="إهلاك الأصول الثابتة" name="depreciation" value={data.depreciation} onChange={handleInputChange} />
                      <InputField label="مصاريف إدارية" name="adminExpenses" value={data.adminExpenses} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <div className="p-3 bg-slate-100 rounded-lg flex justify-between items-center">
                        <span className="text-sm font-bold">الربح التشغيلي (EBIT):</span>
                        <span className="font-mono font-bold text-indigo-600">{currentValues.ebit.toLocaleString()}</span>
                      </div>
                      <InputField label="إيرادات/مصاريف أخرى (صافي)" name="otherIncomeExpense" value={data.otherIncomeExpense} onChange={handleInputChange} />
                      <InputField label="الزكاة أو الضرائب" name="zakatTaxes" value={data.zakatTaxes} onChange={handleInputChange} />
                      <div className="p-3 bg-blue-600 text-white rounded-lg flex justify-between items-center shadow-md">
                        <span className="text-sm font-bold">صافي الربح النهائي:</span>
                        <span className="font-mono font-bold">{currentValues.netIncome.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Sidebar */}
              <div className="space-y-4 md:space-y-6">
                <div className={`p-6 rounded-xl border-2 transition-all ${currentAnalysis.isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">توازن المعادلة المحاسبية</h3>
                    {currentAnalysis.isBalanced ? (
                      <CheckCircle2 className="text-green-600 w-6 h-6" />
                    ) : (
                      <ShieldAlert className="text-red-600 w-6 h-6" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>إجمالي الأصول:</span>
                      <span className="font-mono font-bold">{currentAnalysis.totalAssets.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الالتزامات + الملكية:</span>
                      <span className="font-mono font-bold">{currentAnalysis.totalLiabilitiesAndEquity.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
                      <span>الفرق:</span>
                      <span className={currentAnalysis.difference === 0 ? 'text-green-600' : 'text-red-600'}>
                        {currentAnalysis.difference.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!currentAnalysis.isBalanced && (
                    <p className="mt-4 text-xs text-red-600 leading-relaxed">
                      * المعادلة غير متوازنة. يرجى التأكد من أن الأصول تساوي مجموع الالتزامات وحقوق الملكية.
                    </p>
                  )}
                </div>

                <div className="bg-slate-800 text-white p-6 rounded-xl shadow-lg">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    نظرة سريعة على النسب
                  </h3>
                  <div className="space-y-4">
                    <QuickStat label="نسبة التداول" value={currentAnalysis.ratios.currentRatio.toFixed(2)} />
                    <QuickStat label="هامش الربح الصافي" value={`${currentAnalysis.ratios.netProfitMargin.toFixed(1)}%`} />
                    <QuickStat label="نسبة الدين" value={currentAnalysis.ratios.debtToEquity.toFixed(2)} />
                  </div>
                  <button 
                    onClick={() => setActiveTab('analysis')}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    عرض التحليل التفصيلي
                    <ArrowRightLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'history' ? (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* History List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <History className="text-blue-600" />
                      الفترات المحفوظة
                    </h3>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                      {history.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">لا توجد فترات محفوظة بعد.</p>
                      ) : (
                        history.map((item) => (
                          <div 
                            key={item.id}
                            className={`p-4 rounded-lg border transition-all cursor-pointer group ${targetId === item.id ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                            onClick={() => setTargetId(item.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-slate-800">{item.periodName}</h4>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(item.date).toLocaleDateString('ar-EG')}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit(item);
                                  }}
                                  className="text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="تعديل"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFromHistory(item.id);
                                  }}
                                  className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="حذف"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex gap-4 text-[10px] font-bold text-slate-500">
                              <span>صافي الربح: {item.analysis.ratios.netProfitMargin.toFixed(1)}%</span>
                              <span>السيولة: {item.analysis.ratios.currentRatio.toFixed(2)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Comparison & Trends */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <ArrowRightLeft className="text-blue-600" />
                        مقارنة الأداء
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400">سنة الأساس (الحالي)</label>
                          <select 
                            value={baseId}
                            onChange={(e) => setBaseId(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="current">الفترة الحالية</option>
                            {history.map(record => (
                              <option key={record.id} value={record.id}>{record.periodName}</option>
                            ))}
                          </select>
                        </div>
                        <ArrowRightLeft className="w-4 h-4 text-slate-300 mt-4" />
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400">سنة المقارنة (السابق)</label>
                          <select 
                            value={targetId || ''}
                            onChange={(e) => setTargetId(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="" disabled>اختر فترة...</option>
                            {history.map(record => (
                              <option key={record.id} value={record.id}>{record.periodName}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {targetRecord ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparisonData} layout="vertical" margin={{ right: 40, left: 20 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                              <XAxis type="number" reversed={true} />
                              <YAxis dataKey="name" type="category" width={100} orientation="right" />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="current" name={baseRecord.periodName} fill="#3b82f6" radius={[4, 0, 0, 4]} />
                              <Bar dataKey="previous" name={targetRecord.periodName} fill="#94a3b8" radius={[4, 0, 0, 4]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                          {comparisonData.map((stat, idx) => {
                            const diff = stat.current - stat.previous;
                            const isPositive = diff > 0;
                            return (
                              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-sm font-medium">{stat.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs text-slate-500">{stat.previous.toFixed(2)}</span>
                                  <ArrowRightLeft className="w-3 h-3 text-slate-300" />
                                  <span className="font-mono font-bold">{stat.current.toFixed(2)}</span>
                                  <div className={`flex items-center text-[10px] font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {Math.abs(diff).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50 border border-blue-100 p-12 rounded-xl text-center">
                        <History className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                        <h3 className="text-blue-800 font-bold">اختر فترة للمقارنة</h3>
                        <p className="text-blue-600 text-sm mt-2">قم باختيار أحد السجلات من القائمة الجانبية أو القائمة المنسدلة لمقارنة أدائها.</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <TrendingUp className="text-green-600" />
                      تحليل الاتجاهات (Trends)
                    </h3>
                    <div className="h-64">
                      {trendData.length < 2 ? (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                          تحتاج إلى حفظ فترتين على الأقل لعرض الرسوم البيانية للاتجاهات.
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="period" reversed={true} />
                            <YAxis orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="netProfit" name="هامش الربح %" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="currentRatio" name="نسبة التداول" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Analysis Table */}
                  {horizontalAnalysis && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <ArrowRightLeft className="text-blue-600" />
                        التحليل الأفقي للقوائم المالية
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm">
                          <thead>
                            <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                              <th className="px-4 py-3 font-bold border-b">البند</th>
                              <th className="px-4 py-3 font-bold border-b">الفترة السابقة</th>
                              <th className="px-4 py-3 font-bold border-b">الفترة الحالية</th>
                              <th className="px-4 py-3 font-bold border-b">التغير (قيمة)</th>
                              <th className="px-4 py-3 font-bold border-b">التغير (%)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {[
                              { title: 'الأصول (Assets)', fields: ['fixedAssets', 'intangibleAssets', 'cash', 'accountsReceivable', 'inventory', 'prepaidExpenses', 'totalAssets'] },
                              { title: 'الخصوم (Liabilities)', fields: ['longTermLoans', 'endOfServiceBenefits', 'accountsPayable', 'notesPayable', 'shortTermLoans', 'accruedExpenses', 'partnerCurrentAccount', 'totalLiabilities'] },
                              { title: 'حقوق الملكية (Equity)', fields: ['paidInCapital', 'retainedEarnings', 'reserves', 'totalEquity'] },
                              { title: 'قائمة الدخل (Income Statement)', fields: ['revenue', 'cogs', 'salaries', 'rents', 'marketing', 'depreciation', 'adminExpenses', 'otherIncomeExpense', 'zakatTaxes', 'netIncome'] }
                            ].map((section) => (
                              <React.Fragment key={section.title}>
                                <tr className="bg-slate-100/50">
                                  <td colSpan={5} className="px-4 py-2 font-bold text-blue-800">{section.title}</td>
                                </tr>
                                {section.fields.map((key) => {
                                  const stats = horizontalAnalysis[key as keyof typeof horizontalAnalysis];
                                  if (!stats) return null;
                                  const isTotal = key.startsWith('total') || key === 'netIncome';
                                  return (
                                    <tr key={key} className={`hover:bg-slate-50 transition-colors ${isTotal ? 'bg-slate-50 font-bold' : ''}`}>
                                      <td className={`px-4 py-3 font-medium pr-8 ${isTotal ? 'text-blue-900' : ''}`}>{fieldLabels[key] || key}</td>
                                      <td className="px-4 py-3 font-mono">{stats.previous.toLocaleString()}</td>
                                      <td className="px-4 py-3 font-mono">{stats.current.toLocaleString()}</td>
                                      <td className={`px-4 py-3 font-mono font-bold ${stats.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stats.change >= 0 ? '+' : ''}{stats.change.toLocaleString()}
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className={`flex items-center gap-1 font-bold ${stats.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {stats.percentChange >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                          {Math.abs(stats.percentChange).toFixed(1)}%
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'cashflow' ? (
            <motion.div 
              key="cashflow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {!cashFlowData ? (
                <div className="bg-blue-50 border border-blue-100 p-12 rounded-xl text-center">
                  <Wallet className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                  <h3 className="text-blue-800 font-bold">تحليل التدفقات النقدية يتطلب فترتين</h3>
                  <p className="text-blue-600 text-sm mt-2">يرجى الذهاب إلى "السجل التاريخي" واختيار فترة أساس وفترة مقارنة لاستخراج قائمة التدفقات النقدية.</p>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Wallet className="text-blue-600" />
                      قائمة التدفقات النقدية (الطريقة غير المباشرة)
                    </h2>
                    <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                      مقارنة بـ: {targetRecord?.periodName}
                    </div>
                  </div>
                  
                  <div className="p-0">
                    <table className="w-full text-right text-sm">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider">
                          <th className="px-6 py-3 font-bold border-b">البند / النشاط</th>
                          <th className="px-6 py-3 font-bold border-b text-left">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* Operating Activities */}
                        <tr className="bg-blue-50/30">
                          <td colSpan={2} className="px-6 py-3 font-bold text-blue-800">أولاً: التدفقات النقدية من الأنشطة التشغيلية</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">صافي الربح للفترة</td>
                          <td className="px-6 py-3 font-mono text-left">{cashFlowData.operating.netIncome.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">يضاف: الإهلاك (مصروف غير نقدي)</td>
                          <td className="px-6 py-3 font-mono text-left text-green-600">+{cashFlowData.operating.depreciation.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في الذمم المدينة (العملاء)</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.operating.deltaAR > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {cashFlowData.operating.deltaAR > 0 ? '-' : '+'}{Math.abs(cashFlowData.operating.deltaAR).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في المخزون</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.operating.deltaInventory > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {cashFlowData.operating.deltaInventory > 0 ? '-' : '+'}{Math.abs(cashFlowData.operating.deltaInventory).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في المصاريف المدفوعة مقدماً</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.operating.deltaPrepaid > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {cashFlowData.operating.deltaPrepaid > 0 ? '-' : '+'}{Math.abs(cashFlowData.operating.deltaPrepaid).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في الدائنين (الموردين)</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.operating.deltaAP > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {cashFlowData.operating.deltaAP > 0 ? '+' : '-'}{Math.abs(cashFlowData.operating.deltaAP).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في أوراق الدفع</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.operating.deltaNotesPayable > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {cashFlowData.operating.deltaNotesPayable > 0 ? '+' : '-'}{Math.abs(cashFlowData.operating.deltaNotesPayable).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في المصاريف المستحقة</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.operating.deltaAccrued > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {cashFlowData.operating.deltaAccrued > 0 ? '+' : '-'}{Math.abs(cashFlowData.operating.deltaAccrued).toLocaleString()}
                          </td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td className="px-6 py-3">صافي التدفقات النقدية من الأنشطة التشغيلية</td>
                          <td className={`px-6 py-3 font-mono text-left border-t-2 border-slate-300 ${cashFlowData.operating.total >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {cashFlowData.operating.total.toLocaleString()}
                          </td>
                        </tr>

                        {/* Investing Activities */}
                        <tr className="bg-blue-50/30">
                          <td colSpan={2} className="px-6 py-3 font-bold text-blue-800">ثانياً: التدفقات النقدية من الأنشطة الاستثمارية</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في الأصول الثابتة (شراء/بيع)</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.investing.deltaFixedAssets > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {cashFlowData.investing.deltaFixedAssets > 0 ? '-' : '+'}{Math.abs(cashFlowData.investing.deltaFixedAssets).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في الأصول غير الملموسة</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.investing.deltaIntangibleAssets > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {cashFlowData.investing.deltaIntangibleAssets > 0 ? '-' : '+'}{Math.abs(cashFlowData.investing.deltaIntangibleAssets).toLocaleString()}
                          </td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td className="px-6 py-3">صافي التدفقات النقدية من الأنشطة الاستثمارية</td>
                          <td className={`px-6 py-3 font-mono text-left border-t-2 border-slate-300 ${cashFlowData.investing.total >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {cashFlowData.investing.total.toLocaleString()}
                          </td>
                        </tr>

                        {/* Financing Activities */}
                        <tr className="bg-blue-50/30">
                          <td colSpan={2} className="px-6 py-3 font-bold text-blue-800">ثالثاً: التدفقات النقدية من الأنشطة التمويلية</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في القروض طويلة الأجل</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.financing.deltaLongTermLoans > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {cashFlowData.financing.deltaLongTermLoans > 0 ? '+' : '-'}{Math.abs(cashFlowData.financing.deltaLongTermLoans).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في القروض قصيرة الأجل</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.financing.deltaShortTermLoans > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {cashFlowData.financing.deltaShortTermLoans > 0 ? '+' : '-'}{Math.abs(cashFlowData.financing.deltaShortTermLoans).toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-3 pr-10">التغير في رأس المال (زيادة/تخفيض)</td>
                          <td className={`px-6 py-3 font-mono text-left ${cashFlowData.financing.deltaCapital > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {cashFlowData.financing.deltaCapital > 0 ? '+' : '-'}{Math.abs(cashFlowData.financing.deltaCapital).toLocaleString()}
                          </td>
                        </tr>
                        <tr className="bg-slate-50 font-bold">
                          <td className="px-6 py-3">صافي التدفقات النقدية من الأنشطة التمويلية</td>
                          <td className={`px-6 py-3 font-mono text-left border-t-2 border-slate-300 ${cashFlowData.financing.total >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {cashFlowData.financing.total.toLocaleString()}
                          </td>
                        </tr>

                        {/* Net Change */}
                        <tr className="bg-blue-900 text-white font-bold text-lg">
                          <td className="px-6 py-4">صافي الزيادة/النقص في النقدية خلال الفترة</td>
                          <td className="px-6 py-4 font-mono text-left">{cashFlowData.netCashFlow.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <div className="flex items-center gap-3 text-slate-600 italic text-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      ملاحظة: يتم استخراج هذه القائمة باستخدام الطريقة غير المباشرة بناءً على التغيرات في الميزانية العمومية وقائمة الدخل بين الفترتين المختارتين.
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="analysis"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Period Selector */}
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <History className="w-4 sm:w-5 h-4 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800">عرض تحليل الفترة:</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500">اختر الفترة لعرض تحليلها المالي</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <select
                    value={viewingId}
                    onChange={(e) => setViewingId(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:flex-none sm:min-w-[200px]"
                  >
                    <option value="current">الفترة الحالية (البيانات المدخلة)</option>
                    {history.map(record => (
                      <option key={record.id} value={record.id}>{record.periodName}</option>
                    ))}
                  </select>
                  <button
                    onClick={exportToPDF}
                    disabled={isExporting}
                    className="flex items-center gap-1.5 sm:gap-2 bg-slate-800 hover:bg-slate-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                    PDF
                  </button>
                </div>
              </div>

              <div id="analysis-report" className="space-y-4 sm:space-y-8 p-1">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <SummaryCard 
                  label="إجمالي الأصول" 
                  value={viewingRecord.analysis.totalAssets.toLocaleString()} 
                  icon={<PieChartIcon className="text-blue-600" />} 
                  color="blue"
                />
                <SummaryCard 
                  label="صافي الربح" 
                  value={viewingValues.netIncome.toLocaleString()} 
                  icon={<TrendingUp className="text-green-600" />} 
                  color="green"
                />
                <SummaryCard 
                  label="إجمالي حقوق الملكية" 
                  value={viewingValues.totalEquity.toLocaleString()} 
                  icon={<ShieldAlert className="text-purple-600" />} 
                  color="purple"
                />
                <SummaryCard 
                  label="نسبة التداول" 
                  value={viewingRecord.analysis.ratios.currentRatio.toFixed(2)} 
                  icon={<Activity className="text-orange-600" />} 
                  color="orange"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                {/* Left Column: Ratio Cards */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-8">
                  {/* Liquidity Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold flex items-center gap-2">
                      <Activity className="text-blue-600 w-5 h-5" />
                      مؤشرات السيولة (Liquidity)
                    </div>
                    <div className="p-3 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <RatioIndicator 
                        label="نسبة التداول" 
                        value={viewingRecord.analysis.ratios.currentRatio} 
                        benchmark={1.5} 
                        format="number"
                        description="قدرة الشركة على سداد التزاماتها قصيرة الأجل"
                      />
                      <RatioIndicator 
                        label="النسبة السريعة" 
                        value={viewingRecord.analysis.ratios.quickRatio} 
                        benchmark={1.0} 
                        format="number"
                        description="السيولة الفورية باستبعاد المخزون"
                      />
                    </div>
                  </div>

                  {/* Profitability Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold flex items-center gap-2">
                      <TrendingUp className="text-green-600 w-5 h-5" />
                      مؤشرات الربحية (Profitability)
                    </div>
                    <div className="p-3 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <RatioIndicator 
                        label="هامش مجمل الربح" 
                        value={viewingRecord.analysis.ratios.grossProfitMargin} 
                        benchmark={30} 
                        format="percent"
                        description="كفاءة الإنتاج والتسعير"
                      />
                      <RatioIndicator 
                        label="هامش صافي الربح" 
                        value={viewingRecord.analysis.ratios.netProfitMargin} 
                        benchmark={10} 
                        format="percent"
                        description="الربحية النهائية بعد كافة المصاريف"
                      />
                      <RatioIndicator 
                        label="العائد على الأصول" 
                        value={viewingRecord.analysis.ratios.roa} 
                        benchmark={8} 
                        format="percent"
                        description="كفاءة استخدام الأصول لتوليد الأرباح"
                      />
                      <RatioIndicator 
                        label="العائد على حقوق الملكية" 
                        value={(viewingValues.netIncome / viewingValues.totalEquity) * 100} 
                        benchmark={12} 
                        format="percent"
                        description="العائد المحقق للمساهمين"
                      />
                    </div>
                  </div>

                  {/* Solvency Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold flex items-center gap-2">
                      <ShieldAlert className="text-purple-600 w-5 h-5" />
                      مؤشرات الملاءة المالية (Solvency)
                    </div>
                    <div className="p-6">
                      <RatioIndicator 
                        label="نسبة الدين إلى حقوق الملكية" 
                        value={viewingRecord.analysis.ratios.debtToEquity} 
                        benchmark={1.0} 
                        format="number"
                        inverse
                        description="مدى الاعتماد على الديون مقابل التمويل الذاتي"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column: Visual Analysis */}
                <div className="space-y-8">
                  {/* Radar Chart */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <Target className="text-red-600" />
                      بصمة الصحة المالية
                    </h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar
                            name="الأداء"
                            dataKey="A"
                            stroke="#2563eb"
                            fill="#3b82f6"
                            fillOpacity={0.6}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-4">
                      كلما اتسعت المساحة الزرقاء، زادت قوة التوازن المالي للشركة
                    </p>
                  </div>

                  {/* Qualitative Analysis */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                      <AlertTriangle className="text-orange-600" />
                      التحليل النوعي
                    </h3>
                    <div className="space-y-4">
                      {qualitative.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-slate-50 border-r-4 border-slate-300">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-bold text-slate-500">{item.category}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border ${item.color.replace('text', 'border')}`}>
                              {item.status}
                            </span>
                          </div>
                          <p className={`text-xs font-medium ${item.color}`}>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white p-4 sm:p-8 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Lightbulb className="w-20 sm:w-32 h-20 sm:h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <Lightbulb className="text-yellow-400 w-6 sm:w-8 h-6 sm:h-8" />
                    توصيات الخبير المالي
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {recommendations.map((rec, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/5"
                      >
                        <div className="bg-yellow-400 text-blue-900 rounded-full p-1 mt-1 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <p className="text-sm leading-relaxed">{rec}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-3 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="text-sm font-bold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">تأكيد الحذف</h3>
              <p className="text-slate-600 mb-8">{confirmModal.message}</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setConfirmModal(null)}
                  className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  إلغاء
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
                >
                  حذف نهائي
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 نظام التحليل المالي الذكي - جميع الحقوق محفوظة</p>
          <p className="mt-2">تم التصميم لأغراض المحاسبة القانونية والتحليل المالي الاحترافي</p>
        </div>
      </footer>
    </div>
  );
}

function InputField({ label, name, value, onChange }: { label: string, name: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="text"
        inputMode="decimal"
        name={name}
        value={value === 0 ? '' : value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono"
        placeholder="0.00"
      />
    </div>
  );
}

function QuickStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-bold text-lg">{value}</span>
    </div>
  );
}

function RatioRow({ category, name, value, benchmark }: { category: string, name: string, value: string, benchmark: string }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 text-sm text-slate-500">{category}</td>
      <td className="px-6 py-4 font-medium">{name}</td>
      <td className="px-6 py-4 font-mono font-bold text-blue-600">{value}</td>
      <td className="px-6 py-4 text-sm text-slate-400">{benchmark}</td>
    </tr>
  );
}

function SummaryCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: 'blue' | 'green' | 'purple' | 'orange' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-100 text-blue-600',
    green: 'bg-green-50 border-green-100 text-green-600',
    purple: 'bg-purple-50 border-purple-100 text-purple-600',
    orange: 'bg-orange-50 border-orange-100 text-orange-600'
  };

  return (
    <div className={`p-3 sm:p-6 rounded-xl border shadow-sm ${colors[color]} bg-white`}>
      <div className="flex justify-between items-start mb-2 sm:mb-4">
        <div className={`p-1.5 sm:p-2 rounded-lg ${colors[color].split(' ')[0]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-[10px] sm:text-xs font-bold mb-1 truncate">{label}</p>
        <p className="text-base sm:text-2xl font-black text-slate-900 font-mono break-all">{value}</p>
      </div>
    </div>
  );
}

function RatioIndicator({ label, value, benchmark, format, description, inverse = false }: { 
  label: string, 
  value: number, 
  benchmark: number, 
  format: 'number' | 'percent', 
  description: string,
  inverse?: boolean
}) {
  const isGood = inverse ? value <= benchmark : value >= benchmark;
  const progress = Math.min(Math.max((value / (benchmark * 1.5)) * 100, 10), 100);
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-sm font-bold text-slate-800">{label}</h4>
          <p className="text-[10px] text-slate-400 leading-tight max-w-[150px]">{description}</p>
        </div>
        <div className="text-right">
          <span className={`text-lg font-black font-mono ${isGood ? 'text-green-600' : 'text-orange-600'}`}>
            {format === 'percent' ? `${value.toFixed(1)}%` : value.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full rounded-full ${isGood ? 'bg-green-500' : 'bg-orange-500'}`}
        />
      </div>
      <div className="flex justify-between text-[10px] font-bold text-slate-400">
        <span>المعيار: {format === 'percent' ? `${benchmark}%` : benchmark}</span>
        <span>الحالة: {isGood ? 'ممتاز' : 'يحتاج تحسين'}</span>
      </div>
    </div>
  );
}
