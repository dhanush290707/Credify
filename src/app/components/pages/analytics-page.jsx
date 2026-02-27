import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import {
  TrendingUp, TrendingDown, DollarSign, Users, CreditCard,
  Calendar, Download, RefreshCw, BarChart3 } from
'lucide-react';
import { toast } from 'sonner';
import {
  Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from
'recharts';

export function AnalyticsPage() {
  const { loans, users, transactions, payments } = useApp();
  const [dateRange, setDateRange] = useState('30days');
  const [metric, setMetric] = useState('revenue');

  // Calculate comprehensive analytics
  const totalLoans = loans.length;
  const totalUsers = users.length;
  const totalRevenue = transactions.filter((t) => t.type === 'payment' && t.status === 'completed').
  reduce((sum, t) => sum + t.amount, 0);
  const totalDisbursed = transactions.filter((t) => t.type === 'disbursement' && t.status === 'completed').
  reduce((sum, t) => sum + t.amount, 0);

  // Loan status breakdown
  const loanStatusData = [
  { name: 'Pending', value: loans.filter((l) => l.status === 'pending').length, color: '#f59e0b' },
  { name: 'Approved', value: loans.filter((l) => l.status === 'approved').length, color: '#2563eb' },
  { name: 'Active', value: loans.filter((l) => l.status === 'active').length, color: '#10b981' },
  { name: 'Rejected', value: loans.filter((l) => l.status === 'rejected').length, color: '#ef4444' },
  { name: 'Completed', value: loans.filter((l) => l.status === 'completed').length, color: '#6366f1' }].
  filter((item) => item.value > 0);

  // User role distribution
  const userRoleData = [
  { name: 'Borrowers', value: users.filter((u) => u.role === 'borrower').length, color: '#2563eb' },
  { name: 'Lenders', value: users.filter((u) => u.role === 'lender').length, color: '#10b981' },
  { name: 'Analysts', value: users.filter((u) => u.role === 'analyst').length, color: '#f59e0b' },
  { name: 'Admins', value: users.filter((u) => u.role === 'admin').length, color: '#8b5cf6' }];


  // Loan purpose distribution
  const loanPurposeData = loans.reduce((acc, loan) => {
    acc[loan.purpose] = (acc[loan.purpose] || 0) + 1;
    return acc;
  }, {});

  const purposeChartData = Object.entries(loanPurposeData).map(([name, value]) => ({
    name,
    value
  }));

  // Monthly trends (simulated - would be calculated from actual dates)
  const monthlyData = [
  { month: 'Jan', revenue: 85000, loans: 45, users: 145, approvalRate: 75, disbursed: 980000 },
  { month: 'Feb', revenue: 92000, loans: 52, users: 163, approvalRate: 78, disbursed: 1050000 },
  { month: 'Mar', revenue: 88000, loans: 48, users: 175, approvalRate: 72, disbursed: 980000 },
  { month: 'Apr', revenue: 98000, loans: 61, users: 192, approvalRate: 80, disbursed: 1200000 },
  { month: 'May', revenue: 105000, loans: 55, users: 210, approvalRate: 77, disbursed: 1150000 },
  { month: 'Jun', revenue: 112000, loans: 67, users: 228, approvalRate: 82, disbursed: 1350000 }];


  // Performance metrics
  const performanceData = [
  { subject: 'Approval Rate', A: 82, fullMark: 100 },
  { subject: 'Payment Rate', A: 94, fullMark: 100 },
  { subject: 'User Satisfaction', A: 88, fullMark: 100 },
  { subject: 'Platform Health', A: 91, fullMark: 100 },
  { subject: 'Growth Rate', A: 76, fullMark: 100 }];


  // Loan amount distribution
  const loanAmountRanges = [
  { range: '$0-$10K', count: loans.filter((l) => l.amount < 10000).length },
  { range: '$10K-$25K', count: loans.filter((l) => l.amount >= 10000 && l.amount < 25000).length },
  { range: '$25K-$50K', count: loans.filter((l) => l.amount >= 25000 && l.amount < 50000).length },
  { range: '$50K-$100K', count: loans.filter((l) => l.amount >= 50000 && l.amount < 100000).length },
  { range: '$100K+', count: loans.filter((l) => l.amount >= 100000).length }];


  // Credit score distribution
  const creditScoreRanges = [
  { range: '300-550', count: loans.filter((l) => l.creditScore && l.creditScore < 550).length, risk: 'High' },
  { range: '550-650', count: loans.filter((l) => l.creditScore && l.creditScore >= 550 && l.creditScore < 650).length, risk: 'Medium-High' },
  { range: '650-700', count: loans.filter((l) => l.creditScore && l.creditScore >= 650 && l.creditScore < 700).length, risk: 'Medium' },
  { range: '700-750', count: loans.filter((l) => l.creditScore && l.creditScore >= 700 && l.creditScore < 750).length, risk: 'Medium-Low' },
  { range: '750-850', count: loans.filter((l) => l.creditScore && l.creditScore >= 750).length, risk: 'Low' }];


  // Payment performance
  const paymentStats = {
    onTime: payments.filter((p) => p.status === 'paid').length,
    overdue: payments.filter((p) => {
      return p.status === 'upcoming' && new Date(p.dueDate) < new Date();
    }).length,
    upcoming: payments.filter((p) => p.status === 'upcoming').length,
    collectionRate: payments.length > 0 ?
    (payments.filter((p) => p.status === 'paid').length / payments.length * 100).toFixed(1) :
    0
  };

  // Key Performance Indicators
  const kpis = [
  {
    name: 'Average Loan Amount',
    value: `$${(loans.reduce((sum, l) => sum + l.amount, 0) / loans.length).toFixed(0)}`,
    change: '+12%',
    trend: 'up'
  },
  {
    name: 'Approval Rate',
    value: `${(loans.filter((l) => l.status === 'approved' || l.status === 'active').length / loans.length * 100).toFixed(1)}%`,
    change: '+5%',
    trend: 'up'
  },
  {
    name: 'Default Rate',
    value: '1.8%',
    change: '-0.4%',
    trend: 'up'
  },
  {
    name: 'Collection Rate',
    value: `${paymentStats.collectionRate}%`,
    change: '+3%',
    trend: 'up'
  }];


  // Export analytics report
  const exportAnalytics = () => {
    const analyticsReport = {
      generatedAt: new Date().toISOString(),
      dateRange,
      summary: {
        totalLoans,
        totalUsers,
        totalRevenue,
        totalDisbursed
      },
      loanStatusBreakdown: loanStatusData,
      userRoleDistribution: userRoleData,
      loanPurposeDistribution: purposeChartData,
      monthlyTrends: monthlyData,
      performanceMetrics: performanceData,
      kpis,
      paymentStatistics: paymentStats
    };

    const blob = new Blob([JSON.stringify(analyticsReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast.success('Analytics report exported!');
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Advanced Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business intelligence and insights</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-secondary rounded-lg">
            
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">
            
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={exportAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpis.map((kpi, idx) =>
        <Card key={idx} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{kpi.name}</p>
                <p className="text-2xl font-medium">{kpi.value}</p>
              </div>
              {kpi.trend === 'up' ?
            <TrendingUp className="text-green-600" size={24} /> :

            <TrendingDown className="text-red-600" size={24} />
            }
            </div>
            <div className={`text-sm ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {kpi.change} vs last period
            </div>
          </Card>
        )}
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-900">Total Revenue</p>
            <DollarSign className="text-blue-600" size={24} />
          </div>
          <p className="text-3xl text-blue-900 mb-2">${(totalRevenue / 1000).toFixed(1)}K</p>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <TrendingUp size={16} />
            <span>+23.5% growth</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-900">Total Disbursed</p>
            <CreditCard className="text-green-600" size={24} />
          </div>
          <p className="text-3xl text-green-900 mb-2">${(totalDisbursed / 1000000).toFixed(2)}M</p>
          <div className="flex items-center gap-2 text-sm text-green-700">
            <TrendingUp size={16} />
            <span>+18.2% growth</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-purple-900">Active Users</p>
            <Users className="text-purple-600" size={24} />
          </div>
          <p className="text-3xl text-purple-900 mb-2">{totalUsers}</p>
          <div className="flex items-center gap-2 text-sm text-purple-700">
            <TrendingUp size={16} />
            <span>+15.8% growth</span>
          </div>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue & Disbursement Trend */}
        <Card className="p-6">
          <h3 className="mb-4">Revenue & Disbursement Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
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

        {/* Loan Applications & Approval Rate */}
        <Card className="p-6">
          <h3 className="mb-4">Loan Applications & Approval Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="loans" fill="#2563eb" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="approvalRate" stroke="#10b981" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Loan Status Distribution */}
        <Card className="p-6">
          <h3 className="mb-4">Loan Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={loanStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                
                {loanStatusData.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={entry.color} />
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* User Role Distribution */}
        <Card className="p-6">
          <h3 className="mb-4">User Role Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                
                {userRoleData.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={entry.color} />
                )}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance Radar */}
        <Card className="p-6">
          <h3 className="mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" stroke="#64748b" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" />
              <Radar name="Performance" dataKey="A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Loan Amount Distribution */}
        <Card className="p-6">
          <h3 className="mb-4">Loan Amount Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loanAmountRanges}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Credit Score Distribution */}
        <Card className="p-6">
          <h3 className="mb-4">Credit Score & Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={creditScoreRanges} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="range" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {creditScoreRanges.map((entry, index) =>
                <Cell
                  key={`cell-${index}`}
                  fill={
                  entry.risk === 'Low' ? '#10b981' :
                  entry.risk === 'Medium-Low' ? '#84cc16' :
                  entry.risk === 'Medium' ? '#f59e0b' :
                  entry.risk === 'Medium-High' ? '#f97316' :
                  '#ef4444'
                  } />

                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Loan Purpose Breakdown */}
      <Card className="p-6 mb-6">
        <h3 className="mb-4">Loan Purpose Breakdown</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={purposeChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-start gap-3">
            <TrendingUp className="text-green-600 mt-1" size={24} />
            <div>
              <h4 className="mb-2">Strong Growth</h4>
              <p className="text-sm text-muted-foreground">
                Platform showing consistent growth across all metrics with 23% revenue increase
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-start gap-3">
            <BarChart3 className="text-blue-600 mt-1" size={24} />
            <div>
              <h4 className="mb-2">High Performance</h4>
              <p className="text-sm text-muted-foreground">
                {paymentStats.collectionRate}% collection rate demonstrates excellent payment discipline
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-start gap-3">
            <Calendar className="text-yellow-600 mt-1" size={24} />
            <div>
              <h4 className="mb-2">Focus Area</h4>
              <p className="text-sm text-muted-foreground">
                Monitor {paymentStats.overdue} overdue payments for improved cash flow management
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}