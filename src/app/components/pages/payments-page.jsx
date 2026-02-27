import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import {
  Search, Calendar, DollarSign, CheckCircle,
  AlertCircle, Clock, Download, Eye, XCircle } from
'lucide-react';
import { toast } from 'sonner';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from
'recharts';

export function PaymentsPage() {
  const { payments, loans, makePayment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange, setDateRange] = useState('30days');
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.loanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Sort by due date
  const sortedPayments = [...filteredPayments].sort((a, b) =>
  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Calculate statistics
  const stats = {
    total: payments.length,
    upcoming: payments.filter((p) => p.status === 'upcoming').length,
    paid: payments.filter((p) => p.status === 'paid').length,
    overdue: payments.filter((p) => {
      return p.status === 'upcoming' && new Date(p.dueDate) < new Date();
    }).length,
    totalUpcoming: payments.filter((p) => p.status === 'upcoming').reduce((sum, p) => sum + p.amount, 0),
    totalPaid: payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    totalOverdue: payments.filter((p) => {
      return p.status === 'upcoming' && new Date(p.dueDate) < new Date();
    }).reduce((sum, p) => sum + p.amount, 0)
  };

  // Payment status distribution
  const statusDistribution = [
  { name: 'Paid', value: stats.paid, color: '#10b981' },
  { name: 'Upcoming', value: stats.upcoming - stats.overdue, color: '#2563eb' },
  { name: 'Overdue', value: stats.overdue, color: '#ef4444' }].
  filter((item) => item.value > 0);

  // Monthly payment trends
  const monthlyTrends = [
  { month: 'Jan', collected: 45000, expected: 50000 },
  { month: 'Feb', collected: 52000, expected: 55000 },
  { month: 'Mar', collected: 48000, expected: 50000 },
  { month: 'Apr', collected: 61000, expected: 60000 },
  { month: 'May', collected: 58000, expected: 65000 },
  { month: 'Jun', collected: 67000, expected: 70000 }];


  // Payment by borrower (top 5)
  const paymentsByBorrower = payments.reduce((acc, payment) => {
    acc[payment.borrowerName] = (acc[payment.borrowerName] || 0) + payment.amount;
    return acc;
  }, {});

  const topBorrowers = Object.entries(paymentsByBorrower).
  sort((a, b) => b[1] - a[1]).
  slice(0, 5).
  map(([name, amount]) => ({ name, amount }));

  // Check if payment is overdue
  const isOverdue = (payment) => {
    return payment.status === 'upcoming' && new Date(payment.dueDate) < new Date();
  };

  // Get days until/overdue
  const getDaysInfo = (dueDate) => {
    const days = Math.floor((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: `${Math.abs(days)} days overdue`, isOverdue: true };
    if (days === 0) return { text: 'Due today', isOverdue: false };
    return { text: `Due in ${days} days`, isOverdue: false };
  };

  // Handle mark as paid (admin override)
  const handleMarkAsPaid = (paymentId, borrowerName) => {
    if (confirm(`Mark payment as paid for ${borrowerName}?`)) {
      makePayment(paymentId);
      toast.success('Payment marked as paid!');
      setSelectedPayment(null);
    }
  };

  // Export payments
  const exportPayments = () => {
    const data = filteredPayments.map((payment) => ({
      ID: payment.id,
      LoanID: payment.loanId,
      Borrower: payment.borrowerName,
      Amount: payment.amount,
      Principal: payment.principal,
      Interest: payment.interest,
      DueDate: payment.dueDate,
      PaidDate: payment.paidDate || 'N/A',
      Status: payment.status
    }));

    const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map((row) => Object.values(row).join(','))].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Payments exported successfully!');
  };

  // Send reminder (mock function)
  const sendReminder = (paymentId, borrowerName) => {
    toast.success(`Reminder sent to ${borrowerName}!`);
  };

  const selectedPaymentData = selectedPayment ? payments.find((p) => p.id === selectedPayment) : null;
  const selectedLoan = selectedPaymentData ? loans.find((l) => l.id === selectedPaymentData.loanId) : null;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Payment Management</h1>
          <p className="text-muted-foreground">Track and manage all loan payments</p>
        </div>
        <button
          onClick={exportPayments}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          
          <Download size={18} />
          Export Payments
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Payments</p>
            <DollarSign className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl">{stats.total}</p>
          <p className="text-xs text-muted-foreground mt-2">All time</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Paid</p>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className="text-3xl">${(stats.totalPaid / 1000).toFixed(1)}K</p>
          <p className="text-xs text-green-600 mt-2">↑ {stats.paid} payments</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Upcoming</p>
            <Clock className="text-yellow-600" size={20} />
          </div>
          <p className="text-3xl">${(stats.totalUpcoming / 1000).toFixed(1)}K</p>
          <p className="text-xs text-muted-foreground mt-2">{stats.upcoming} pending</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Overdue</p>
            <AlertCircle className="text-red-600" size={20} />
          </div>
          <p className="text-3xl">${(stats.totalOverdue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-red-600 mt-2">⚠ {stats.overdue} late</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Collection Trend */}
        <Card className="p-6">
          <h3 className="mb-4">Monthly Collection Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Bar dataKey="collected" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expected" fill="#e2e8f0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Status Distribution */}
        <Card className="p-6">
          <h3 className="mb-4">Payment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value">
                
                {statusDistribution.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={entry.color} />
                )}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Top Borrowers by Payment */}
      <Card className="p-6 mb-6">
        <h3 className="mb-4">Top Borrowers by Total Payment</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topBorrowers} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" stroke="#64748b" />
            <YAxis dataKey="name" type="category" stroke="#64748b" width={120} />
            <Tooltip />
            <Bar dataKey="amount" fill="#2563eb" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by ID, borrower, or loan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg" />
            
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="7days">Next 7 Days</option>
            <option value="30days">Next 30 Days</option>
            <option value="90days">Next 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Payment ID</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Loan ID</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Borrower</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Principal</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Interest</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Due Date</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPayments.map((payment) => {
                const daysInfo = getDaysInfo(payment.dueDate);
                const overdueStatus = isOverdue(payment);

                return (
                  <tr key={payment.id} className={`border-b border-border last:border-0 hover:bg-secondary/50 ${
                  overdueStatus ? 'bg-red-50' : ''}`
                  }>
                    <td className="py-3 px-4 text-sm font-medium">{payment.id}</td>
                    <td className="py-3 px-4 text-sm">{payment.loanId}</td>
                    <td className="py-3 px-4 text-sm">{payment.borrowerName}</td>
                    <td className="py-3 px-4 text-sm font-medium">${payment.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">${payment.principal.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">${payment.interest.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <div>{payment.dueDate}</div>
                      <div className={`text-xs ${daysInfo.isOverdue ? 'text-red-600' : 'text-muted-foreground'}`}>
                        {daysInfo.text}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      payment.status === 'paid' ?
                      'bg-green-100 text-green-700' :
                      overdueStatus ?
                      'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'}`
                      }>
                        {overdueStatus ? 'Overdue' : payment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment.id)}
                          className="p-1 hover:bg-secondary rounded"
                          title="View Details">
                          
                          <Eye size={16} />
                        </button>
                        {payment.status === 'upcoming' &&
                        <>
                            <button
                            onClick={() => sendReminder(payment.id, payment.borrowerName)}
                            className="p-1 hover:bg-blue-100 text-blue-600 rounded"
                            title="Send Reminder">
                            
                              <Calendar size={16} />
                            </button>
                            <button
                            onClick={() => handleMarkAsPaid(payment.id, payment.borrowerName)}
                            className="p-1 hover:bg-green-100 text-green-600 rounded"
                            title="Mark as Paid">
                            
                              <CheckCircle size={16} />
                            </button>
                          </>
                        }
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>

          {sortedPayments.length === 0 &&
          <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="mx-auto mb-4" size={48} />
              <p>No payments found matching your criteria</p>
            </div>
          }
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {sortedPayments.length} of {payments.length} payments</p>
        </div>
      </Card>

      {/* Payment Detail Modal */}
      {selectedPaymentData &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">Payment Details - {selectedPaymentData.id}</h2>
              <button onClick={() => setSelectedPayment(null)} className="p-2 hover:bg-secondary rounded-lg">
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment ID</p>
                <p className="text-lg font-medium">{selectedPaymentData.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loan ID</p>
                <p className="text-lg">{selectedPaymentData.loanId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Borrower</p>
                <p className="text-lg">{selectedPaymentData.borrowerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-lg font-medium">${selectedPaymentData.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Principal</p>
                <p className="text-lg">${selectedPaymentData.principal.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interest</p>
                <p className="text-lg">${selectedPaymentData.interest.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                <p className="text-lg">{selectedPaymentData.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <span className={`inline-block text-sm px-3 py-1 rounded-full capitalize ${
              selectedPaymentData.status === 'paid' ?
              'bg-green-100 text-green-700' :
              'bg-blue-100 text-blue-700'}`
              }>
                  {selectedPaymentData.status}
                </span>
              </div>
              {selectedPaymentData.paidDate &&
            <div className="col-span-2">
                  <p className="text-sm text-muted-foreground mb-1">Paid Date</p>
                  <p className="text-lg">{selectedPaymentData.paidDate}</p>
                </div>
            }
            </div>

            {selectedLoan &&
          <div className="p-4 bg-secondary rounded-lg mb-6">
                <h3 className="mb-3">Related Loan Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Loan Amount:</span>
                    <span className="ml-2 font-medium">${selectedLoan.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interest Rate:</span>
                    <span className="ml-2 font-medium">{selectedLoan.interestRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="ml-2 font-medium">{selectedLoan.duration} months</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Purpose:</span>
                    <span className="ml-2 font-medium">{selectedLoan.purpose}</span>
                  </div>
                </div>
              </div>
          }

            {selectedPaymentData.status === 'upcoming' &&
          <div className="flex gap-3">
                <button
              onClick={() => sendReminder(selectedPaymentData.id, selectedPaymentData.borrowerName)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              
                  <Calendar size={20} />
                  Send Reminder
                </button>
                <button
              onClick={() => handleMarkAsPaid(selectedPaymentData.id, selectedPaymentData.borrowerName)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              
                  <CheckCircle size={20} />
                  Mark as Paid
                </button>
              </div>
          }
          </Card>
        </div>
      }
    </div>);

}