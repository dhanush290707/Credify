import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import {
  Search, CheckCircle, XCircle, Eye, Clock,
  AlertCircle, Users, Download } from
'lucide-react';
import { toast } from 'sonner';

export function BorrowerRequestsPage() {
  const { loans, users, approveLoan, rejectLoan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Get all loan requests
  const allRequests = loans;

  // Filter requests
  const filteredRequests = allRequests.filter((loan) => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;
    const matchesPurpose = filterPurpose === 'all' || loan.purpose === filterPurpose;
    return matchesSearch && matchesStatus && matchesPurpose;
  });

  // Sort requests
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case 'amount':
        return b.amount - a.amount;
      case 'creditScore':
        return (b.creditScore || 0) - (a.creditScore || 0);
      case 'date':
      default:
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
    }
  });

  // Statistics
  const stats = {
    total: loans.length,
    pending: loans.filter((l) => l.status === 'pending').length,
    approved: loans.filter((l) => l.status === 'approved' || l.status === 'active').length,
    rejected: loans.filter((l) => l.status === 'rejected').length,
    totalAmount: loans.filter((l) => l.status === 'pending').reduce((sum, l) => sum + l.amount, 0),
    avgAmount: loans.filter((l) => l.status === 'pending').length > 0 ?
    loans.filter((l) => l.status === 'pending').reduce((sum, l) => sum + l.amount, 0) / loans.filter((l) => l.status === 'pending').length :
    0
  };

  // Get unique purposes for filter
  const purposes = [...new Set(loans.map((l) => l.purpose))];

  // Handle approve
  const handleApprove = (loanId, borrowerName) => {
    const lender = users.find((u) => u.role === 'lender');
    if (!lender) {
      toast.error('No lender available to assign');
      return;
    }

    if (confirm(`Approve loan request for ${borrowerName}?`)) {
      approveLoan(loanId, lender.id, lender.name);
      toast.success(`Loan approved for ${borrowerName}!`);
      setSelectedRequest(null);
    }
  };

  // Handle reject
  const handleReject = (loanId, borrowerName) => {
    const reason = prompt(`Reject loan for ${borrowerName}. Enter reason (optional):`);
    if (reason !== null) {
      rejectLoan(loanId);
      toast.success(`Loan rejected for ${borrowerName}`);
      setSelectedRequest(null);
    }
  };

  // Handle bulk action
  const handleBulkApprove = () => {
    const pendingRequests = loans.filter((l) => l.status === 'pending');
    const lender = users.find((u) => u.role === 'lender');

    if (!lender) {
      toast.error('No lender available');
      return;
    }

    if (confirm(`Approve all ${pendingRequests.length} pending requests?`)) {
      pendingRequests.forEach((loan) => {
        approveLoan(loan.id, lender.id, lender.name);
      });
      toast.success(`${pendingRequests.length} loans approved!`);
    }
  };

  // Export requests
  const exportRequests = () => {
    const data = filteredRequests.map((loan) => ({
      ID: loan.id,
      Borrower: loan.borrowerName,
      Amount: loan.amount,
      Purpose: loan.purpose,
      Rate: loan.interestRate,
      Duration: loan.duration,
      CreditScore: loan.creditScore || 'N/A',
      Status: loan.status,
      AppliedDate: loan.appliedDate
    }));

    const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map((row) => Object.values(row).join(','))].
    join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `borrower_requests_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('Requests exported successfully!');
  };

  // Risk assessment
  const getRiskLevel = (creditScore) => {
    if (!creditScore) return { level: 'unknown', color: 'gray', label: 'Unknown' };
    if (creditScore >= 750) return { level: 'low', color: 'green', label: 'Low Risk' };
    if (creditScore >= 650) return { level: 'medium', color: 'yellow', label: 'Medium Risk' };
    return { level: 'high', color: 'red', label: 'High Risk' };
  };

  const selectedLoan = selectedRequest ? loans.find((l) => l.id === selectedRequest) : null;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Borrower Requests</h1>
          <p className="text-muted-foreground">Review and manage loan applications</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportRequests}
            className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">
            
            <Download size={18} />
            Export
          </button>
          {stats.pending > 0 &&
          <button
            onClick={handleBulkApprove}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            
              <CheckCircle size={18} />
              Approve All ({stats.pending})
            </button>
          }
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <Users className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl">{stats.total}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <Clock className="text-yellow-600" size={20} />
          </div>
          <p className="text-3xl">{stats.pending}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Approved</p>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className="text-3xl">{stats.approved}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <XCircle className="text-red-600" size={20} />
          </div>
          <p className="text-3xl">{stats.rejected}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by ID or borrower..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg" />
            
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterPurpose}
            onChange={(e) => setFilterPurpose(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="all">All Purposes</option>
            {purposes.map((purpose) =>
            <option key={purpose} value={purpose}>{purpose}</option>
            )}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="creditScore">Sort by Credit Score</option>
          </select>
        </div>
      </Card>

      {/* Requests Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Request ID</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Borrower</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Purpose</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Terms</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Credit Score</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Risk</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Applied</th>
                <th className="text-left py-3 px-4 text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRequests.map((loan) => {
                const risk = getRiskLevel(loan.creditScore);
                return (
                  <tr key={loan.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="py-3 px-4 text-sm font-medium">{loan.id}</td>
                    <td className="py-3 px-4 text-sm">{loan.borrowerName}</td>
                    <td className="py-3 px-4 text-sm font-medium">${loan.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">{loan.purpose}</td>
                    <td className="py-3 px-4 text-sm">{loan.duration}mo @ {loan.interestRate}%</td>
                    <td className="py-3 px-4 text-sm">{loan.creditScore || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full bg-${risk.color}-100 text-${risk.color}-700`}>
                        {risk.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      loan.status === 'approved' || loan.status === 'active' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'}`
                      }>
                        {loan.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{loan.appliedDate}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedRequest(loan.id)}
                          className="p-1 hover:bg-secondary rounded"
                          title="View Details">
                          
                          <Eye size={16} />
                        </button>
                        {loan.status === 'pending' &&
                        <>
                            <button
                            onClick={() => handleApprove(loan.id, loan.borrowerName)}
                            className="p-1 hover:bg-green-100 text-green-600 rounded"
                            title="Approve">
                            
                              <CheckCircle size={16} />
                            </button>
                            <button
                            onClick={() => handleReject(loan.id, loan.borrowerName)}
                            className="p-1 hover:bg-red-100 text-red-600 rounded"
                            title="Reject">
                            
                              <XCircle size={16} />
                            </button>
                          </>
                        }
                      </div>
                    </td>
                  </tr>);

              })}
            </tbody>
          </table>

          {sortedRequests.length === 0 &&
          <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="mx-auto mb-4" size={48} />
              <p>No requests found matching your criteria</p>
            </div>
          }
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {sortedRequests.length} of {allRequests.length} requests</p>
          <p>Total pending amount: ${stats.totalAmount.toLocaleString()}</p>
        </div>
      </Card>

      {/* Detail Modal */}
      {selectedLoan &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">Request Details - {selectedLoan.id}</h2>
              <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-secondary rounded-lg">
                <XCircle size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Borrower Name</p>
                <p className="text-lg">{selectedLoan.borrowerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
                <p className="text-lg font-medium">${selectedLoan.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                <p className="text-lg">{selectedLoan.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="text-lg">{selectedLoan.duration} months</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Purpose</p>
                <p className="text-lg">{selectedLoan.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Credit Score</p>
                <p className="text-lg">{selectedLoan.creditScore || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Employment Status</p>
                <p className="text-lg">{selectedLoan.employmentStatus || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Applied Date</p>
                <p className="text-lg">{selectedLoan.appliedDate}</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-secondary rounded-lg">
              <h3 className="mb-3">Risk Assessment</h3>
              {selectedLoan.creditScore &&
            <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Credit Score: {selectedLoan.creditScore}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                getRiskLevel(selectedLoan.creditScore).color === 'green' ?
                'bg-green-100 text-green-700' :
                getRiskLevel(selectedLoan.creditScore).color === 'yellow' ?
                'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}`
                }>
                      {getRiskLevel(selectedLoan.creditScore).label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                  className={`h-full ${
                  getRiskLevel(selectedLoan.creditScore).color === 'green' ? 'bg-green-500' :
                  getRiskLevel(selectedLoan.creditScore).color === 'yellow' ? 'bg-yellow-500' :
                  'bg-red-500'}`
                  }
                  style={{ width: `${(selectedLoan.creditScore || 0) / 850 * 100}%` }} />
                
                  </div>
                </div>
            }
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly EMI (approx)</span>
                  <span className="font-medium">
                    ${(selectedLoan.amount * (selectedLoan.interestRate / 12 / 100) * Math.pow(1 + selectedLoan.interestRate / 12 / 100, selectedLoan.duration) / (Math.pow(1 + selectedLoan.interestRate / 12 / 100, selectedLoan.duration) - 1)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span className="font-medium">
                    ${(selectedLoan.amount * (selectedLoan.interestRate / 12 / 100) * Math.pow(1 + selectedLoan.interestRate / 12 / 100, selectedLoan.duration) / (Math.pow(1 + selectedLoan.interestRate / 12 / 100, selectedLoan.duration) - 1) * selectedLoan.duration - selectedLoan.amount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Repayment</span>
                  <span className="font-medium">
                    ${(selectedLoan.amount * (selectedLoan.interestRate / 12 / 100) * Math.pow(1 + selectedLoan.interestRate / 12 / 100, selectedLoan.duration) / (Math.pow(1 + selectedLoan.interestRate / 12 / 100, selectedLoan.duration) - 1) * selectedLoan.duration).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {selectedLoan.status === 'pending' &&
          <div className="flex gap-3">
                <button
              onClick={() => handleApprove(selectedLoan.id, selectedLoan.borrowerName)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              
                  <CheckCircle size={20} />
                  Approve Request
                </button>
                <button
              onClick={() => handleReject(selectedLoan.id, selectedLoan.borrowerName)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
              
                  <XCircle size={20} />
                  Reject Request
                </button>
              </div>
          }
          </Card>
        </div>
      }
    </div>);

}