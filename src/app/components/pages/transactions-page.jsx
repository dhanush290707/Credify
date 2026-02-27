import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import { Search, Download } from 'lucide-react';
import { toast } from 'sonner';

export function TransactionsPage() {
  const { transactions, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.loanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate totals
  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const completedAmount = filteredTransactions.
  filter((t) => t.status === 'completed').
  reduce((sum, txn) => sum + txn.amount, 0);

  const handleExport = () => {
    const csvContent = [
    ['ID', 'Loan ID', 'User', 'Type', 'Amount', 'Status', 'Date'].join(','),
    ...filteredTransactions.map((txn) =>
    [txn.id, txn.loanId, txn.userName, txn.type, txn.amount, txn.status, txn.date].join(',')
    )].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Transactions exported successfully!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':return 'bg-green-100 text-green-700';
      case 'pending':return 'bg-yellow-100 text-yellow-700';
      case 'failed':return 'bg-red-100 text-red-700';
      default:return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'payment':return 'bg-blue-100 text-blue-700';
      case 'disbursement':return 'bg-purple-100 text-purple-700';
      case 'fee':return 'bg-orange-100 text-orange-700';
      default:return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Transactions</h1>
          <p className="text-muted-foreground">View all financial transactions</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-lg hover:bg-primary/90 w-full sm:w-auto justify-center">
          
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
          <p className="text-2xl">{filteredTransactions.length}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
          <p className="text-2xl">${totalAmount.toLocaleString()}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Completed Amount</p>
          <p className="text-2xl text-green-600">${completedAmount.toLocaleString()}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg" />
            
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="all">All Types</option>
            <option value="payment">Payment</option>
            <option value="disbursement">Disbursement</option>
            <option value="fee">Fee</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Transaction ID</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Loan ID</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">User</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) =>
              <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="py-3 px-4 text-sm font-medium">{txn.id}</td>
                  <td className="py-3 px-4 text-sm">{txn.loanId}</td>
                  <td className="py-3 px-4 text-sm">{txn.userName}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getTypeColor(txn.type)}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">${txn.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{txn.date}</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {filteredTransactions.length === 0 &&
          <div className="text-center py-8 text-muted-foreground">
              No transactions found matching your criteria
            </div>
          }
        </div>
      </Card>
    </div>);

}