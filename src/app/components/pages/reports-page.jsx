import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import { Download, FileText, TrendingUp, Users, CreditCard, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from
'recharts';

export function ReportsPage() {
  const { loans, users, transactions, payments } = useApp();
  const [reportType, setReportType] = useState('overview');
  const [dateRange, setDateRange] = useState('30days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Calculate date range
  const getDateRange = () => {
    const end = new Date();
    let start = new Date();

    switch (dateRange) {
      case '7days':
        start.setDate(end.getDate() - 7);
        break;
      case '30days':
        start.setDate(end.getDate() - 30);
        break;
      case '90days':
        start.setDate(end.getDate() - 90);
        break;
      case '1year':
        start.setFullYear(end.getFullYear() - 1);
        break;
      case 'custom':
        if (startDate && endDate) {
          start = new Date(startDate);
          return { start, end: new Date(endDate) };
        }
        break;
    }

    return { start, end };
  };

  const { start: rangeStart, end: rangeEnd } = getDateRange();

  // Filter data by date range
  const filterByDate = (items, dateField) => {
    return items.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= rangeStart && itemDate <= rangeEnd;
    });
  };

  // Loan Statistics
  const loanStats = {
    total: loans.length,
    active: loans.filter((l) => l.status === 'active').length,
    pending: loans.filter((l) => l.status === 'pending').length,
    approved: loans.filter((l) => l.status === 'approved').length,
    rejected: loans.filter((l) => l.status === 'rejected').length,
    completed: loans.filter((l) => l.status === 'completed').length,
    totalAmount: loans.reduce((sum, l) => sum + l.amount, 0),
    avgAmount: loans.length > 0 ? loans.reduce((sum, l) => sum + l.amount, 0) / loans.length : 0
  };

  // User Statistics
  const userStats = {
    total: users.length,
    borrowers: users.filter((u) => u.role === 'borrower').length,
    lenders: users.filter((u) => u.role === 'lender').length,
    analysts: users.filter((u) => u.role === 'analyst').length,
    admins: users.filter((u) => u.role === 'admin').length,
    active: users.filter((u) => u.status === 'active').length,
    pending: users.filter((u) => u.status === 'pending').length,
    suspended: users.filter((u) => u.status === 'suspended').length
  };

  // Financial Statistics
  const financialStats = {
    totalTransactions: transactions.length,
    totalRevenue: transactions.filter((t) => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    totalDisbursed: transactions.filter((t) => t.type === 'disbursement' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0),
    pendingPayments: payments.filter((p) => p.status === 'upcoming').reduce((sum, p) => sum + p.amount, 0),
    completedPayments: payments.filter((p) => p.status === 'paid').length,
    overduePayments: payments.filter((p) => {
      return p.status === 'upcoming' && new Date(p.dueDate) < new Date();
    }).length
  };

  // Loans by Status for Pie Chart
  const loansByStatus = [
  { name: 'Active', value: loanStats.active, color: '#10b981' },
  { name: 'Pending', value: loanStats.pending, color: '#f59e0b' },
  { name: 'Approved', value: loanStats.approved, color: '#2563eb' },
  { name: 'Rejected', value: loanStats.rejected, color: '#ef4444' },
  { name: 'Completed', value: loanStats.completed, color: '#6366f1' }].
  filter((item) => item.value > 0);

  // Loans by Purpose
  const loansByPurpose = loans.reduce((acc, loan) => {
    acc[loan.purpose] = (acc[loan.purpose] || 0) + 1;
    return acc;
  }, {});

  const purposeData = Object.entries(loansByPurpose).map(([name, value]) => ({
    name,
    value
  }));

  // Users by Role
  const usersByRole = [
  { name: 'Borrowers', value: userStats.borrowers, color: '#2563eb' },
  { name: 'Lenders', value: userStats.lenders, color: '#10b981' },
  { name: 'Analysts', value: userStats.analysts, color: '#f59e0b' },
  { name: 'Admins', value: userStats.admins, color: '#8b5cf6' }];


  // Monthly trends (mock data - would be calculated from actual dates)
  const monthlyTrends = [
  { month: 'Jan', loans: 45, users: 120, revenue: 85000 },
  { month: 'Feb', loans: 52, users: 135, revenue: 92000 },
  { month: 'Mar', loans: 48, users: 145, revenue: 88000 },
  { month: 'Apr', loans: 61, users: 160, revenue: 98000 },
  { month: 'May', loans: 55, users: 175, revenue: 105000 },
  { month: 'Jun', loans: 67, users: 190, revenue: 112000 }];


  // Export Functions
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((item) => Object.values(item).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Report exported successfully!');
  };

  const exportLoanReport = () => {
    const data = loans.map((loan) => ({
      ID: loan.id,
      Borrower: loan.borrowerName,
      Amount: loan.amount,
      Rate: loan.interestRate,
      Duration: loan.duration,
      Purpose: loan.purpose,
      Status: loan.status,
      AppliedDate: loan.appliedDate,
      RemainingBalance: loan.remainingBalance || 0
    }));
    exportToCSV(data, 'loan_report');
  };

  const exportUserReport = () => {
    const data = users.map((user) => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Role: user.role,
      Status: user.status,
      CreatedAt: user.createdAt
    }));
    exportToCSV(data, 'user_report');
  };

  const exportFinancialReport = () => {
    const data = transactions.map((txn) => ({
      ID: txn.id,
      LoanID: txn.loanId,
      User: txn.userName,
      Type: txn.type,
      Amount: txn.amount,
      Status: txn.status,
      Date: txn.date
    }));
    exportToCSV(data, 'financial_report');
  };

  const exportFullReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      dateRange: `${rangeStart.toISOString().split('T')[0]} to ${rangeEnd.toISOString().split('T')[0]}`,
      loanStatistics: loanStats,
      userStatistics: userStats,
      financialStatistics: financialStats
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `full_report_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast.success('Full report exported successfully!');
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl mb-2">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business intelligence and reporting</p>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <button
          onClick={() => setReportType('overview')}
          className={`p-4 rounded-lg border-2 transition-colors ${
          reportType === 'overview' ?
          'border-primary bg-primary/10' :
          'border-border hover:border-primary/50'}`
          }>
          
          <FileText className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">Overview</p>
        </button>
        <button
          onClick={() => setReportType('loans')}
          className={`p-4 rounded-lg border-2 transition-colors ${
          reportType === 'loans' ?
          'border-primary bg-primary/10' :
          'border-border hover:border-primary/50'}`
          }>
          
          <CreditCard className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">Loans</p>
        </button>
        <button
          onClick={() => setReportType('users')}
          className={`p-4 rounded-lg border-2 transition-colors ${
          reportType === 'users' ?
          'border-primary bg-primary/10' :
          'border-border hover:border-primary/50'}`
          }>
          
          <Users className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">Users</p>
        </button>
        <button
          onClick={() => setReportType('financial')}
          className={`p-4 rounded-lg border-2 transition-colors ${
          reportType === 'financial' ?
          'border-primary bg-primary/10' :
          'border-border hover:border-primary/50'}`
          }>
          
          <TrendingUp className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">Financial</p>
        </button>
        <button
          onClick={() => setReportType('custom')}
          className={`p-4 rounded-lg border-2 transition-colors ${
          reportType === 'custom' ?
          'border-primary bg-primary/10' :
          'border-border hover:border-primary/50'}`
          }>
          
          <Calendar className="mx-auto mb-2" size={24} />
          <p className="text-sm font-medium">Custom</p>
        </button>
      </div>

      {/* Date Range Filter */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          {dateRange === 'custom' &&
          <>
              <div>
                <label className="block text-sm mb-2">Start Date</label>
                <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>
              <div>
                <label className="block text-sm mb-2">End Date</label>
                <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>
            </>
          }
          <div className="flex items-end">
            <button
              onClick={exportFullReport}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
              
              <Download size={20} />
              Export All
            </button>
          </div>
        </div>
      </Card>

      {/* Overview Report */}
      {reportType === 'overview' &&
      <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Loans</p>
                <CreditCard className="text-primary" size={20} />
              </div>
              <p className="text-3xl mb-1">{loanStats.total}</p>
              <p className="text-xs text-green-600">↑ {loanStats.active} Active</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Users</p>
                <Users className="text-primary" size={20} />
              </div>
              <p className="text-3xl mb-1">{userStats.total}</p>
              <p className="text-xs text-green-600">↑ {userStats.active} Active</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <TrendingUp className="text-primary" size={20} />
              </div>
              <p className="text-3xl mb-1">${(financialStats.totalRevenue / 1000).toFixed(1)}K</p>
              <p className="text-xs text-green-600">↑ 23.5% vs last month</p>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Disbursed</p>
                <Download className="text-primary" size={20} />
              </div>
              <p className="text-3xl mb-1">${(financialStats.totalDisbursed / 1000).toFixed(1)}K</p>
              <p className="text-xs text-muted-foreground">{transactions.filter((t) => t.type === 'disbursement').length} transactions</p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="mb-4">Loans by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                  data={loansByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value">
                  
                    {loansByStatus.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="loans" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      }

      {/* Loan Report */}
      {reportType === 'loans' &&
      <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Loan Report</h2>
            <button
            onClick={exportLoanReport}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            
              <Download size={20} />
              Export Loans
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Average Loan Amount</p>
              <p className="text-3xl">${loanStats.avgAmount.toFixed(0).toLocaleString()}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Loan Value</p>
              <p className="text-3xl">${(loanStats.totalAmount / 1000).toFixed(1)}K</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Approval Rate</p>
              <p className="text-3xl">{loanStats.total > 0 ? (loanStats.approved / loanStats.total * 100).toFixed(1) : 0}%</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Loans by Purpose</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={purposeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      }

      {/* User Report */}
      {reportType === 'users' &&
      <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">User Report</h2>
            <button
            onClick={exportUserReport}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            
              <Download size={20} />
              Export Users
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 border-l-4 border-l-blue-500">
              <p className="text-sm text-muted-foreground mb-1">Borrowers</p>
              <p className="text-3xl">{userStats.borrowers}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-green-500">
              <p className="text-sm text-muted-foreground mb-1">Lenders</p>
              <p className="text-3xl">{userStats.lenders}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-yellow-500">
              <p className="text-sm text-muted-foreground mb-1">Analysts</p>
              <p className="text-3xl">{userStats.analysts}</p>
            </Card>
            <Card className="p-6 border-l-4 border-l-purple-500">
              <p className="text-sm text-muted-foreground mb-1">Admins</p>
              <p className="text-3xl">{userStats.admins}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Users by Role</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usersByRole}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {usersByRole.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={entry.color} />
                )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      }

      {/* Financial Report */}
      {reportType === 'financial' &&
      <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl">Financial Report</h2>
            <button
            onClick={exportFinancialReport}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            
              <Download size={20} />
              Export Transactions
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-green-50 border-green-200">
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl text-green-700">${financialStats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">From {financialStats.completedPayments} payments</p>
            </Card>
            <Card className="p-6 bg-blue-50 border-blue-200">
              <p className="text-sm text-muted-foreground mb-1">Total Disbursed</p>
              <p className="text-3xl text-blue-700">${financialStats.totalDisbursed.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Across {loans.filter((l) => l.status === 'active').length} active loans</p>
            </Card>
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
              <p className="text-3xl text-yellow-700">${financialStats.pendingPayments.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">{financialStats.overduePayments} overdue</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="mb-4">Revenue Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      }

      {/* Custom Report */}
      {reportType === 'custom' &&
      <Card className="p-8 text-center">
          <Calendar className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="mb-2">Custom Report Builder</h3>
          <p className="text-muted-foreground mb-4">
            Select custom date ranges and export specific data sets
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
            onClick={exportLoanReport}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90">
            
              <Download size={20} />
              Export Loans
            </button>
            <button
            onClick={exportUserReport}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90">
            
              <Download size={20} />
              Export Users
            </button>
            <button
            onClick={exportFinancialReport}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90">
            
              <Download size={20} />
              Export Financials
            </button>
          </div>
        </Card>
      }
    </div>);

}