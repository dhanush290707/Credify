import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from './card';
import {
  TrendingUp, TrendingDown, AlertTriangle, Activity, Target,
  DollarSign, Percent, CreditCard, Download,
  RefreshCw, BarChart3,
  LineChart as LineChartIcon, Layers } from
'lucide-react';
import { toast } from 'sonner';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  ComposedChart, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer } from
'recharts';

export function AnalystDashboard() {
  const { loans, users, transactions, payments } = useApp();
  const [timeframe, setTimeframe] = useState('30d');
  const [viewMode, setViewMode] = useState('overview');

  // ===== CORE METRICS CALCULATION =====

  // Loan Metrics
  const totalLoansValue = loans.reduce((sum, l) => sum + l.amount, 0);
  const avgLoanSize = loans.length > 0 ? totalLoansValue / loans.length : 0;
  const activeLoanValue = loans.filter((l) => l.status === 'active').reduce((sum, l) => sum + l.amount, 0);

  // Approval Metrics
  const totalApplications = loans.length;
  const approvedLoans = loans.filter((l) => l.status === 'approved' || l.status === 'active').length;
  const rejectedLoans = loans.filter((l) => l.status === 'rejected').length;
  const pendingLoans = loans.filter((l) => l.status === 'pending').length;
  const approvalRate = totalApplications > 0 ? (approvedLoans / totalApplications * 100).toFixed(1) : '0';
  const rejectionRate = totalApplications > 0 ? (rejectedLoans / totalApplications * 100).toFixed(1) : '0';

  // Financial Metrics
  const totalRevenue = transactions.filter((t) => t.type === 'payment' && t.status === 'completed').
  reduce((sum, t) => sum + t.amount, 0);
  const totalDisbursed = transactions.filter((t) => t.type === 'disbursement' && t.status === 'completed').
  reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalRevenue - totalDisbursed;

  // Payment Performance
  const totalPayments = payments.length;
  const paidPayments = payments.filter((p) => p.status === 'paid').length;
  const overduePayments = payments.filter((p) => {
    return p.status === 'upcoming' && new Date(p.dueDate) < new Date();
  }).length;
  const paymentSuccessRate = totalPayments > 0 ? (paidPayments / totalPayments * 100).toFixed(1) : '0';
  const delinquencyRate = totalPayments > 0 ? (overduePayments / totalPayments * 100).toFixed(1) : '0';

  // User Metrics
  const totalBorrowers = users.filter((u) => u.role === 'borrower').length;
  const totalLenders = users.filter((u) => u.role === 'lender').length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const userEngagementRate = users.length > 0 ? (activeUsers / users.length * 100).toFixed(1) : '0';

  // ===== ADVANCED ANALYTICS =====

  // Credit Score Distribution with Risk Buckets
  const creditScoreBuckets = [
  { range: '300-549', min: 300, max: 549, count: 0, risk: 'Critical', color: '#dc2626' },
  { range: '550-619', min: 550, max: 619, count: 0, risk: 'High', color: '#f97316' },
  { range: '620-679', min: 620, max: 679, count: 0, risk: 'Medium-High', color: '#f59e0b' },
  { range: '680-739', min: 680, max: 739, count: 0, risk: 'Medium', color: '#eab308' },
  { range: '740-799', min: 740, max: 799, count: 0, risk: 'Low', color: '#84cc16' },
  { range: '800-850', min: 800, max: 850, count: 0, risk: 'Excellent', color: '#22c55e' }];


  loans.forEach((loan) => {
    if (loan.creditScore) {
      const bucket = creditScoreBuckets.find((b) => loan.creditScore >= b.min && loan.creditScore <= b.max);
      if (bucket) bucket.count++;
    }
  });

  // Loan Size Distribution
  const loanSizeDistribution = [
  { range: '$0-$10K', min: 0, max: 10000, count: 0, avgRate: 0, totalAmount: 0 },
  { range: '$10K-$25K', min: 10000, max: 25000, count: 0, avgRate: 0, totalAmount: 0 },
  { range: '$25K-$50K', min: 25000, max: 50000, count: 0, avgRate: 0, totalAmount: 0 },
  { range: '$50K-$100K', min: 50000, max: 100000, count: 0, avgRate: 0, totalAmount: 0 },
  { range: '$100K+', min: 100000, max: Infinity, count: 0, avgRate: 0, totalAmount: 0 }];


  loans.forEach((loan) => {
    const bucket = loanSizeDistribution.find((b) => loan.amount >= b.min && loan.amount < b.max);
    if (bucket) {
      bucket.count++;
      bucket.totalAmount += loan.amount;
      bucket.avgRate += loan.interestRate;
    }
  });

  loanSizeDistribution.forEach((bucket) => {
    if (bucket.count > 0) {
      bucket.avgRate = bucket.avgRate / bucket.count;
    }
  });

  // Loan Purpose Analysis
  const purposeAnalysis = loans.reduce((acc, loan) => {
    if (!acc[loan.purpose]) {
      acc[loan.purpose] = {
        purpose: loan.purpose,
        count: 0,
        totalAmount: 0,
        avgAmount: 0,
        avgRate: 0,
        defaultRate: 0
      };
    }
    acc[loan.purpose].count++;
    acc[loan.purpose].totalAmount += loan.amount;
    acc[loan.purpose].avgRate += loan.interestRate;
    return acc;
  }, {});

  const purposeData = Object.values(purposeAnalysis).map((item) => ({
    ...item,
    avgAmount: item.totalAmount / item.count,
    avgRate: item.avgRate / item.count
  }));

  // Monthly Performance Trends (simulated 12-month data)
  const monthlyTrends = [
  { month: 'Jan', applications: 45, approvals: 34, revenue: 85000, disbursed: 980000, avgScore: 705, delinquency: 2.1 },
  { month: 'Feb', applications: 52, approvals: 41, revenue: 92000, disbursed: 1050000, avgScore: 710, delinquency: 1.9 },
  { month: 'Mar', applications: 48, approvals: 35, revenue: 88000, disbursed: 980000, avgScore: 708, delinquency: 2.3 },
  { month: 'Apr', applications: 61, approvals: 49, revenue: 98000, disbursed: 1200000, avgScore: 715, delinquency: 1.7 },
  { month: 'May', applications: 55, approvals: 42, revenue: 105000, disbursed: 1150000, avgScore: 718, delinquency: 1.5 },
  { month: 'Jun', applications: 67, approvals: 55, revenue: 112000, disbursed: 1350000, avgScore: 722, delinquency: 1.4 },
  { month: 'Jul', applications: 58, approvals: 47, revenue: 119000, disbursed: 1280000, avgScore: 720, delinquency: 1.6 },
  { month: 'Aug', applications: 63, approvals: 51, revenue: 125000, disbursed: 1400000, avgScore: 725, delinquency: 1.3 },
  { month: 'Sep', applications: 71, approvals: 58, revenue: 132000, disbursed: 1480000, avgScore: 728, delinquency: 1.2 },
  { month: 'Oct', applications: 68, approvals: 56, revenue: 138000, disbursed: 1520000, avgScore: 730, delinquency: 1.1 },
  { month: 'Nov', applications: 74, approvals: 62, revenue: 145000, disbursed: 1600000, avgScore: 733, delinquency: 1.0 },
  { month: 'Dec', applications: 79, approvals: 67, revenue: 152000, disbursed: 1680000, avgScore: 735, delinquency: 0.9 }];


  // Portfolio Health Metrics
  const portfolioHealth = [
  { metric: 'Credit Quality', score: 85, benchmark: 80 },
  { metric: 'Diversification', score: 78, benchmark: 75 },
  { metric: 'Liquidity', score: 92, benchmark: 85 },
  { metric: 'Profitability', score: 88, benchmark: 82 },
  { metric: 'Risk Management', score: 81, benchmark: 78 },
  { metric: 'Growth Rate', score: 76, benchmark: 70 }];


  // Risk Matrix
  const riskSegments = [
  { segment: 'Low Risk', count: loans.filter((l) => (l.creditScore || 0) >= 740).length, exposure: 0, avgDefault: 0.5 },
  { segment: 'Medium Risk', count: loans.filter((l) => (l.creditScore || 0) >= 650 && (l.creditScore || 0) < 740).length, exposure: 0, avgDefault: 2.5 },
  { segment: 'High Risk', count: loans.filter((l) => (l.creditScore || 0) < 650).length, exposure: 0, avgDefault: 8.5 }];


  riskSegments.forEach((segment) => {
    const segmentLoans = loans.filter((l) => {
      if (segment.segment === 'Low Risk') return (l.creditScore || 0) >= 740;
      if (segment.segment === 'Medium Risk') return (l.creditScore || 0) >= 650 && (l.creditScore || 0) < 740;
      return (l.creditScore || 0) < 650;
    });
    segment.exposure = segmentLoans.reduce((sum, l) => sum + l.amount, 0);
  });

  // Cohort Performance (by month)
  const cohortData = [
  { cohort: 'Jan 2024', loans: 45, active: 42, defaulted: 1, performance: 93 },
  { cohort: 'Feb 2024', loans: 52, active: 50, defaulted: 1, performance: 96 },
  { cohort: 'Mar 2024', loans: 48, active: 47, defaulted: 0, performance: 98 },
  { cohort: 'Apr 2024', loans: 61, active: 60, defaulted: 1, performance: 98 },
  { cohort: 'May 2024', loans: 55, active: 55, defaulted: 0, performance: 100 },
  { cohort: 'Jun 2024', loans: 67, active: 67, defaulted: 0, performance: 100 }];


  // Export comprehensive report
  const exportAnalyticsReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeframe,
      executiveSummary: {
        totalLoansValue,
        avgLoanSize,
        approvalRate: parseFloat(approvalRate),
        paymentSuccessRate: parseFloat(paymentSuccessRate),
        delinquencyRate: parseFloat(delinquencyRate),
        netCashFlow
      },
      portfolioMetrics: {
        activeLoanValue,
        totalRevenue,
        totalDisbursed,
        pendingLoans
      },
      riskAnalysis: {
        creditScoreDistribution: creditScoreBuckets,
        riskSegments,
        delinquencyRate: parseFloat(delinquencyRate)
      },
      performanceTrends: monthlyTrends,
      portfolioHealth,
      cohortAnalysis: cohortData,
      loanPurposeAnalysis: purposeData
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analyst_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast.success('Comprehensive analytics report exported!');
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Financial Analytics Dashboard</h1>
          <p className="text-muted-foreground">Advanced portfolio analysis and risk management</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 bg-secondary rounded-lg">
            
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">
            
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={exportAnalyticsReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setViewMode('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          viewMode === 'overview' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`
          }>
          
          <Activity size={18} />
          Overview
        </button>
        <button
          onClick={() => setViewMode('risk')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          viewMode === 'risk' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`
          }>
          
          <AlertTriangle size={18} />
          Risk Analysis
        </button>
        <button
          onClick={() => setViewMode('portfolio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          viewMode === 'portfolio' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`
          }>
          
          <Layers size={18} />
          Portfolio Health
        </button>
        <button
          onClick={() => setViewMode('predictive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          viewMode === 'predictive' ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'}`
          }>
          
          <Target size={18} />
          Predictive Insights
        </button>
      </div>

      {/* OVERVIEW VIEW */}
      {viewMode === 'overview' &&
      <>
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
                <DollarSign className="text-blue-600" size={20} />
              </div>
              <p className="text-3xl mb-2">${(activeLoanValue / 1000000).toFixed(2)}M</p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp size={16} />
                <span>+12.5% vs last period</span>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <Percent className="text-green-600" size={20} />
              </div>
              <p className="text-3xl mb-2">{approvalRate}%</p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp size={16} />
                <span>+2.3% improvement</span>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-yellow-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Delinquency Rate</p>
                <AlertTriangle className="text-yellow-600" size={20} />
              </div>
              <p className="text-3xl mb-2">{delinquencyRate}%</p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingDown size={16} />
                <span>-0.4% improvement</span>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Avg Loan Size</p>
                <CreditCard className="text-purple-600" size={20} />
              </div>
              <p className="text-3xl mb-2">${(avgLoanSize / 1000).toFixed(0)}K</p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <TrendingUp size={16} />
                <span>+8.2% growth</span>
              </div>
            </Card>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Payment Success</p>
              <p className="text-2xl font-medium">{paymentSuccessRate}%</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Active Borrowers</p>
              <p className="text-2xl font-medium">{totalBorrowers}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Net Cash Flow</p>
              <p className="text-2xl font-medium">${(netCashFlow / 1000).toFixed(0)}K</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Pending Review</p>
              <p className="text-2xl font-medium">{pendingLoans}</p>
            </Card>
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Application & Approval Trends */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <LineChartIcon size={20} className="text-primary" />
                Application & Approval Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis yAxisId="left" stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="applications" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="approvals" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="avgScore" stroke="#f59e0b" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </Card>

            {/* Revenue vs Disbursement */}
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Revenue vs Disbursement
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrends}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDisbursed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="disbursed" stroke="#2563eb" fillOpacity={1} fill="url(#colorDisbursed)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Loan Size Distribution */}
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Loan Size Distribution & Average Rates</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={loanSizeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="range" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="avgRate" stroke="#ef4444" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          {/* Loan Purpose Analysis */}
          <Card className="p-6">
            <h3 className="mb-4">Loan Purpose Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={purposeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="purpose" type="category" stroke="#64748b" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                <Bar dataKey="avgAmount" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      }

      {/* RISK ANALYSIS VIEW */}
      {viewMode === 'risk' &&
      <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {riskSegments.map((segment, idx) =>
          <Card key={idx} className={`p-6 border-l-4 ${
          segment.segment === 'Low Risk' ? 'border-l-green-500' :
          segment.segment === 'Medium Risk' ? 'border-l-yellow-500' :
          'border-l-red-500'}`
          }>
                <h3 className="mb-4">{segment.segment}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Count</p>
                    <p className="text-2xl font-medium">{segment.count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Exposure</p>
                    <p className="text-xl font-medium">${(segment.exposure / 1000).toFixed(0)}K</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Default Rate</p>
                    <p className="text-xl font-medium">{segment.avgDefault}%</p>
                  </div>
                </div>
              </Card>
          )}
          </div>

          {/* Credit Score Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h3 className="mb-4">Credit Score Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={creditScoreBuckets}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="range" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {creditScoreBuckets.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                  data={riskSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, count }) => `${segment}: ${count}`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="count">
                  
                    <Cell fill="#22c55e" />
                    <Cell fill="#eab308" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Delinquency Trends */}
          <Card className="p-6">
            <h3 className="mb-4">Delinquency Rate Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="delinquency" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      }

      {/* PORTFOLIO HEALTH VIEW */}
      {viewMode === 'portfolio' &&
      <>
          {/* Portfolio Health Radar */}
          <Card className="p-6 mb-6">
            <h3 className="mb-4">Portfolio Health Score vs Industry Benchmark</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={portfolioHealth}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" stroke="#64748b" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" />
                <Radar name="Your Portfolio" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
                <Radar name="Industry Benchmark" dataKey="benchmark" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Card>

          {/* Cohort Performance */}
          <Card className="p-6">
            <h3 className="mb-4">Cohort Performance Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cohortData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="cohort" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="loans" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="defaulted" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </>
      }

      {/* PREDICTIVE INSIGHTS VIEW */}
      {viewMode === 'predictive' &&
      <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <h3 className="mb-4 text-blue-900">30-Day Forecast</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-blue-700">Expected Applications</p>
                  <p className="text-3xl font-medium text-blue-900">82 ± 5</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Projected Revenue</p>
                  <p className="text-2xl font-medium text-blue-900">$158K</p>
                </div>
                <div>
                  <p className="text-sm text-blue-700">Confidence Level</p>
                  <p className="text-xl font-medium text-blue-900">94%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <h3 className="mb-4 text-green-900">Growth Projection</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-green-700">Portfolio Growth</p>
                  <p className="text-3xl font-medium text-green-900">+15.3%</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">New Borrowers</p>
                  <p className="text-2xl font-medium text-green-900">~47</p>
                </div>
                <div>
                  <p className="text-sm text-green-700">Trend</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-green-700" size={20} />
                    <p className="text-xl font-medium text-green-900">Positive</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <h3 className="mb-4 text-yellow-900">Risk Alerts</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-yellow-700">High Risk Loans</p>
                  <p className="text-3xl font-medium text-yellow-900">{loans.filter((l) => (l.creditScore || 0) < 650).length}</p>
                </div>
                <div>
                  <p className="text-sm text-yellow-700">Predicted Defaults</p>
                  <p className="text-2xl font-medium text-yellow-900">2-3</p>
                </div>
                <div>
                  <p className="text-sm text-yellow-700">Action Required</p>
                  <p className="text-xl font-medium text-yellow-900">Monitor</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Predictive Trends */}
          <Card className="p-6 mb-6">
            <h3 className="mb-4">12-Month Performance Projection</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="projRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#projRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <Target className="text-blue-600 mt-1" size={24} />
                <div>
                  <h4 className="mb-2 font-medium">Strategic Recommendation</h4>
                  <p className="text-sm text-muted-foreground">
                    Focus on mid-sized loans ($25K-$50K) with 720+ credit scores for optimal risk-return balance. 
                    This segment shows 98% repayment rate with 12.5% ROI.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-yellow-500">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 mt-1" size={24} />
                <div>
                  <h4 className="mb-2 font-medium">Risk Mitigation</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor {overduePayments} overdue payments closely. Implement early warning system for 
                    borrowers with payment delays exceeding 5 days.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </>
      }
    </div>);

}