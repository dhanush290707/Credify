import { useState } from 'react';
import {
  DollarSign, Users, CreditCard, TrendingUp, ArrowUp,
  Search, CheckCircle, XCircle, Clock, AlertTriangle,
  UserPlus, FileText, Download, RefreshCw, MoreVertical } from
'lucide-react';
import { Card, StatsCard } from './card';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from
'recharts';

export function AdminDashboard() {
  const { transactions, users, loans, approveLoan, rejectLoan, updateUser, addUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('7days');
  const [showQuickActions, setShowQuickActions] = useState(false);

  // Calculate comprehensive stats
  const totalLoans = loans.length;
  const activeLoans = loans.filter((l) => l.status === 'active').length;
  const pendingLoans = loans.filter((l) => l.status === 'pending').length;
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const newUsersThisWeek = users.filter((u) => {
    const createdDate = new Date(u.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate >= weekAgo;
  }).length;

  const revenue = transactions.
  filter((t) => t.type === 'payment' && t.status === 'completed').
  reduce((sum, t) => sum + t.amount, 0);

  const disbursed = transactions.
  filter((t) => t.type === 'disbursement' && t.status === 'completed').
  reduce((sum, t) => sum + t.amount, 0);

  // Growth calculations (mock comparison with last period)
  const loanGrowth = 12.5;
  const userGrowth = 18.3;
  const revenueGrowth = 23.1;

  // Recent transactions (last 10)
  const recentTransactions = [...transactions].
  sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).
  slice(0, 10);

  // Filter transactions
  const filteredTransactions = recentTransactions.filter((txn) => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pending loan requests
  const pendingLoanRequests = loans.filter((l) => l.status === 'pending').slice(0, 5);

  // Recent users
  const recentUsers = [...users].
  sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).
  slice(0, 5);

  // Activity feed
  const activityFeed = [
  ...transactions.slice(0, 3).map((t) => ({
    id: t.id,
    type: 'transaction',
    message: `${t.userName} ${t.type === 'payment' ? 'made a payment of' : 'received'} $${t.amount.toLocaleString()}`,
    time: t.date,
    status: t.status
  })),
  ...loans.filter((l) => l.status === 'pending').slice(0, 2).map((l) => ({
    id: l.id,
    type: 'loan',
    message: `${l.borrowerName} applied for a loan of $${l.amount.toLocaleString()}`,
    time: l.appliedDate,
    status: 'pending'
  })),
  ...users.slice(0, 2).map((u) => ({
    id: u.id,
    type: 'user',
    message: `New ${u.role} ${u.name} registered`,
    time: u.createdAt,
    status: u.status
  }))].
  sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

  // Chart data - Loans over time
  const loanTrendData = [
  { date: 'Mon', applications: 12, approvals: 8, rejections: 2 },
  { date: 'Tue', applications: 15, approvals: 11, rejections: 3 },
  { date: 'Wed', applications: 10, approvals: 7, rejections: 2 },
  { date: 'Thu', applications: 18, approvals: 13, rejections: 4 },
  { date: 'Fri', applications: 14, approvals: 10, rejections: 3 },
  { date: 'Sat', applications: 8, approvals: 6, rejections: 1 },
  { date: 'Sun', applications: 6, approvals: 4, rejections: 1 }];


  // Revenue trend data
  const revenueTrendData = [
  { month: 'Jan', revenue: 85000, target: 80000 },
  { month: 'Feb', revenue: 92000, target: 85000 },
  { month: 'Mar', revenue: 88000, target: 90000 },
  { month: 'Apr', revenue: 98000, target: 95000 },
  { month: 'May', revenue: 105000, target: 100000 },
  { month: 'Jun', revenue: 112000, target: 105000 }];


  // User growth data
  const userGrowthData = [
  { month: 'Jan', borrowers: 120, lenders: 25, total: 145 },
  { month: 'Feb', borrowers: 135, lenders: 28, total: 163 },
  { month: 'Mar', borrowers: 145, lenders: 30, total: 175 },
  { month: 'Apr', borrowers: 160, lenders: 32, total: 192 },
  { month: 'May', borrowers: 175, lenders: 35, total: 210 },
  { month: 'Jun', borrowers: 190, lenders: 38, total: 228 }];


  // Handlers
  const handleApproveLoan = (loanId, borrowerName) => {
    // For demo, use first lender
    const lender = users.find((u) => u.role === 'lender');
    if (!lender) {
      toast.error('No lender available');
      return;
    }
    approveLoan(loanId, lender.id, lender.name);
    toast.success(`Loan for ${borrowerName} approved!`);
  };

  const handleRejectLoan = (loanId, borrowerName) => {
    if (confirm(`Reject loan application from ${borrowerName}?`)) {
      rejectLoan(loanId);
      toast.success('Loan application rejected');
    }
  };

  const handleUserStatusChange = (userId, status, userName) => {
    updateUser(userId, { status });
    toast.success(`${userName}'s status updated to ${status}`);
  };

  const handleQuickAddUser = () => {
    const name = prompt('Enter user name:');
    const email = prompt('Enter user email:');
    const role = prompt('Enter role (borrower/lender/analyst):');

    if (name && email && role) {
      addUser({
        name,
        email,
        role: role || 'borrower',
        status: 'active'
      });
      toast.success('User added successfully!');
    }
  };

  const exportDashboardData = () => {
    const dashboardData = {
      summary: {
        totalLoans,
        activeLoans,
        pendingLoans,
        totalUsers,
        activeUsers,
        revenue,
        disbursed
      },
      transactions: recentTransactions,
      loans: loans,
      users: users,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin_dashboard_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast.success('Dashboard data exported!');
  };

  const refreshData = () => {
    toast.success('Data refreshed!');
    window.location.reload();
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete platform overview and control center</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">
            
            <RefreshCw size={18} />
            Refresh
          </button>
          <button
            onClick={exportDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">
            
            <Download size={18} />
            Export
          </button>
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            
            <MoreVertical size={18} />
            Quick Actions
          </button>
        </div>
      </div>

      {/* Quick Actions Panel */}
      {showQuickActions &&
      <Card className="p-4 mb-6">
          <h3 className="mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
            onClick={handleQuickAddUser}
            className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg hover:bg-secondary/80">
            
              <UserPlus size={24} />
              <span className="text-sm">Add User</span>
            </button>
            <button
            onClick={() => window.location.href = '#/loans'}
            className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg hover:bg-secondary/80">
            
              <CreditCard size={24} />
              <span className="text-sm">View Loans</span>
            </button>
            <button
            onClick={() => window.location.href = '#/reports'}
            className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg hover:bg-secondary/80">
            
              <FileText size={24} />
              <span className="text-sm">Reports</span>
            </button>
            <button
            onClick={() => window.location.href = '#/settings'}
            className="flex flex-col items-center gap-2 p-4 bg-secondary rounded-lg hover:bg-secondary/80">
            
              <Users size={24} />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </Card>
      }

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Loans"
          value={totalLoans.toString()}
          icon={<CreditCard size={24} />}
          trend={`${loanGrowth > 0 ? '+' : ''}${loanGrowth}% from last month`}
          trendUp={loanGrowth > 0} />
        
        <StatsCard
          title="Active Loans"
          value={activeLoans.toString()}
          icon={<TrendingUp size={24} />}
          trend={`${pendingLoans} pending approval`} />
        
        <StatsCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={<Users size={24} />}
          trend={`${userGrowth > 0 ? '+' : ''}${userGrowth}% (${newUsersThisWeek} new this week)`}
          trendUp={userGrowth > 0} />
        
        <StatsCard
          title="Revenue"
          value={`$${(revenue / 1000).toFixed(1)}K`}
          icon={<DollarSign size={24} />}
          trend={`${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% from last month`}
          trendUp={revenueGrowth > 0} />
        
      </div>

      {/* System Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl">{activeUsers}</p>
            </div>
            <CheckCircle className="text-blue-500" size={24} />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl">{pendingLoans}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Disbursed</p>
              <p className="text-2xl">${(disbursed / 1000).toFixed(0)}K</p>
            </div>
            <ArrowUp className="text-green-500" size={24} />
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Alerts</p>
              <p className="text-2xl">{loans.filter((l) => l.status === 'rejected').length}</p>
            </div>
            <AlertTriangle className="text-red-500" size={24} />
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Loan Applications Trend */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Loan Applications (Last 7 Days)</h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm px-3 py-1 bg-secondary rounded-lg">
              
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
              <option value="90days">90 Days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={loanTrendData}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="applications" stroke="#2563eb" fillOpacity={1} fill="url(#colorApplications)" />
              <Area type="monotone" dataKey="approvals" stroke="#10b981" fillOpacity={0.3} fill="#10b981" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Trend */}
        <Card className="p-6">
          <h3 className="mb-4">Revenue Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
              <Bar dataKey="target" fill="#e2e8f0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card className="p-6 mb-6">
        <h3 className="mb-4">User Growth Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="borrowers" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="lenders" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Loan Requests - With Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Pending Loan Requests ({pendingLoans})</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {pendingLoanRequests.length === 0 ?
            <p className="text-center py-8 text-muted-foreground">No pending requests</p> :

            pendingLoanRequests.map((loan) =>
            <div key={loan.id} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{loan.borrowerName}</p>
                      <p className="text-xs text-muted-foreground">{loan.purpose}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${loan.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{loan.duration}mo @ {loan.interestRate}%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      Credit: {loan.creditScore} • Applied: {loan.appliedDate}
                    </div>
                    <div className="flex gap-2">
                      <button
                    onClick={() => handleApproveLoan(loan.id, loan.borrowerName)}
                    className="flex items-center gap-1 text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    
                        <CheckCircle size={14} />
                        Approve
                      </button>
                      <button
                    onClick={() => handleRejectLoan(loan.id, loan.borrowerName)}
                    className="flex items-center gap-1 text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                    
                        <XCircle size={14} />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
            )
            }
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="p-6">
          <h3 className="mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {activityFeed.map((activity, idx) =>
            <div key={`${activity.id}-${idx}`} className="flex gap-3 p-3 bg-secondary rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
              activity.status === 'completed' ? 'bg-green-500' :
              activity.status === 'pending' ? 'bg-yellow-500' :
              activity.status === 'active' ? 'bg-blue-500' :
              'bg-gray-500'}`
              } />
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions - With Search & Filter */}
        <Card className="p-6">
          <h3 className="mb-4">Recent Transactions</h3>
          
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg text-sm" />
              
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm">
              
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm text-muted-foreground">ID</th>
                  <th className="text-left py-3 text-sm text-muted-foreground">User</th>
                  <th className="text-left py-3 text-sm text-muted-foreground">Type</th>
                  <th className="text-left py-3 text-sm text-muted-foreground">Amount</th>
                  <th className="text-left py-3 text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.slice(0, 8).map((txn) =>
                <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="py-3 text-sm">{txn.id}</td>
                    <td className="py-3 text-sm">{txn.userName}</td>
                    <td className="py-3 text-sm capitalize">{txn.type}</td>
                    <td className="py-3 text-sm font-medium">${txn.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    txn.status === 'completed' ?
                    'bg-green-100 text-green-700' :
                    txn.status === 'pending' ?
                    'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'}`
                    }>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* User Management - With Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Recent Users</h3>
            <button
              onClick={handleQuickAddUser}
              className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-lg hover:bg-primary/90">
              
              + Add User
            </button>
          </div>
          <div className="space-y-3">
            {recentUsers.map((user) =>
            <div key={user.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground capitalize mb-1">{user.role}</p>
                  <select
                  value={user.status}
                  onChange={(e) => handleUserStatusChange(user.id, e.target.value, user.name)}
                  className={`text-xs px-2 py-1 rounded-full border-0 ${
                  user.status === 'active' ?
                  'bg-green-100 text-green-700' :
                  user.status === 'pending' ?
                  'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'}`
                  }>
                  
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Loan Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        <Card className="p-4 border-l-4 border-l-yellow-500">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl">{loans.filter((l) => l.status === 'pending').length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-sm text-muted-foreground mb-1">Approved</p>
          <p className="text-2xl">{loans.filter((l) => l.status === 'approved').length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-2xl">{loans.filter((l) => l.status === 'active').length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-sm text-muted-foreground mb-1">Rejected</p>
          <p className="text-2xl">{loans.filter((l) => l.status === 'rejected').length}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl">{loans.filter((l) => l.status === 'completed').length}</p>
        </Card>
      </div>
    </div>);

}