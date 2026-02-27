import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import { Search, Filter } from 'lucide-react';

export function LoansPage() {
  const { loans, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter loans based on user role
  const userLoans = currentUser?.role === 'borrower' ?
  loans.filter((l) => l.borrowerId === currentUser.id) :
  currentUser?.role === 'lender' ?
  loans.filter((l) => l.lenderId === currentUser.id || l.status === 'pending') :
  loans;

  // Apply search and filter
  const filteredLoans = userLoans.filter((loan) => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':return 'bg-green-100 text-green-700';
      case 'approved':return 'bg-blue-100 text-blue-700';
      case 'pending':return 'bg-yellow-100 text-yellow-700';
      case 'rejected':return 'bg-red-100 text-red-700';
      case 'completed':return 'bg-gray-100 text-gray-700';
      default:return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl mb-2">All Loans</h1>
        <p className="text-muted-foreground">View and manage loan applications</p>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search by ID, borrower, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg" />
            
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg">
              
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Loans Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Loan ID</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Borrower</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Rate</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Duration</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Purpose</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Applied</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) =>
              <tr key={loan.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="py-3 px-4 text-sm font-medium">{loan.id}</td>
                  <td className="py-3 px-4 text-sm">{loan.borrowerName}</td>
                  <td className="py-3 px-4 text-sm">${loan.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm">{loan.interestRate}%</td>
                  <td className="py-3 px-4 text-sm">{loan.duration} months</td>
                  <td className="py-3 px-4 text-sm">{loan.purpose}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{loan.appliedDate}</td>
                </tr>
              )}
            </tbody>
          </table>
          
          {filteredLoans.length === 0 &&
          <div className="text-center py-8 text-muted-foreground">
              No loans found matching your criteria
            </div>
          }
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredLoans.length} of {userLoans.length} loans</p>
        </div>
      </Card>
    </div>);

}