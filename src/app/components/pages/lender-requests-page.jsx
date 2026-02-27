import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import {
  Search, CheckCircle, XCircle, Eye,
  AlertCircle, Users, DollarSign } from
'lucide-react';
import { toast } from 'sonner';

export function LenderRequestsPage() {
  const { loans, currentUser, approveLoan, rejectLoan } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterAmount, setFilterAmount] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Get requests that match lender's criteria (pending loans)
  const availableRequests = loans.filter((loan) =>
  loan.status === 'pending' || loan.status === 'approved' || loan.status === 'rejected'
  );

  // Filter requests
  const filteredRequests = availableRequests.filter((loan) => {
    const matchesSearch = loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus;

    let matchesAmount = true;
    if (filterAmount === 'small') matchesAmount = loan.amount < 25000;else
    if (filterAmount === 'medium') matchesAmount = loan.amount >= 25000 && loan.amount < 75000;else
    if (filterAmount === 'large') matchesAmount = loan.amount >= 75000;

    return matchesSearch && matchesStatus && matchesAmount;
  });

  // Sort by date (newest first)
  const sortedRequests = [...filteredRequests].sort((a, b) =>
  new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  );

  // Statistics
  const stats = {
    available: availableRequests.filter((l) => l.status === 'pending').length,
    accepted: loans.filter((l) => l.lenderId === currentUser?.id && (l.status === 'approved' || l.status === 'active')).length,
    rejected: availableRequests.filter((l) => l.status === 'rejected').length,
    totalValue: availableRequests.filter((l) => l.status === 'pending').reduce((sum, l) => sum + l.amount, 0)
  };

  // Risk assessment
  const getRiskLevel = (creditScore) => {
    if (!creditScore) return { level: 'unknown', color: 'gray', label: 'Unknown', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
    if (creditScore >= 750) return { level: 'low', color: 'green', label: 'Low Risk', bgColor: 'bg-green-100', textColor: 'text-green-700' };
    if (creditScore >= 700) return { level: 'medium-low', color: 'lime', label: 'Medium-Low', bgColor: 'bg-lime-100', textColor: 'text-lime-700' };
    if (creditScore >= 650) return { level: 'medium', color: 'yellow', label: 'Medium Risk', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' };
    if (creditScore >= 600) return { level: 'medium-high', color: 'orange', label: 'Medium-High', bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
    return { level: 'high', color: 'red', label: 'High Risk', bgColor: 'bg-red-100', textColor: 'text-red-700' };
  };

  // Calculate potential return
  const calculateReturn = (amount, rate, duration) => {
    const monthlyRate = rate / 12 / 100;
    const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, duration) / (Math.pow(1 + monthlyRate, duration) - 1);
    const totalRepayment = emi * duration;
    const totalInterest = totalRepayment - amount;
    return {
      emi: emi.toFixed(2),
      totalRepayment: totalRepayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      roi: (totalInterest / amount * 100).toFixed(2)
    };
  };

  // Handle accept request
  const handleAccept = (loanId, borrowerName) => {
    if (!currentUser) return;

    if (confirm(`Accept loan request from ${borrowerName}?`)) {
      approveLoan(loanId, currentUser.id, currentUser.name);
      toast.success(`Request accepted! Loan approved for ${borrowerName}`);
      setSelectedRequest(null);
    }
  };

  // Handle reject request
  const handleReject = (loanId, borrowerName) => {
    const reason = prompt(`Reject request from ${borrowerName}. Enter reason (optional):`);
    if (reason !== null) {
      rejectLoan(loanId);
      toast.success(`Request rejected`);
      setSelectedRequest(null);
    }
  };

  const selectedLoan = selectedRequest ? loans.find((l) => l.id === selectedRequest) : null;
  const returns = selectedLoan ? calculateReturn(selectedLoan.amount, selectedLoan.interestRate, selectedLoan.duration) : null;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl mb-2">Borrower Requests</h1>
        <p className="text-muted-foreground">Review and accept loan requests from borrowers</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Available Requests</p>
            <Users className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl mb-1">{stats.available}</p>
          <p className="text-xs text-blue-600">Ready for review</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">My Accepted</p>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <p className="text-3xl mb-1">{stats.accepted}</p>
          <p className="text-xs text-green-600">Loans funded by you</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <DollarSign className="text-yellow-600" size={20} />
          </div>
          <p className="text-3xl mb-1">${(stats.totalValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-yellow-600">In pending requests</p>
        </Card>

        <Card className="p-6 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Rejected</p>
            <XCircle className="text-red-600" size={20} />
          </div>
          <p className="text-3xl mb-1">{stats.rejected}</p>
          <p className="text-xs text-red-600">Not funded</p>
        </Card>
      </div>

      {/* Info Banner */}
      <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">How Borrower Requests Work</h3>
            <p className="text-sm text-blue-700">
              Review loan applications from borrowers, assess their creditworthiness, and accept requests that match your investment criteria. 
              You'll receive regular payments with interest from accepted loans.
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by ID, borrower, or purpose..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg" />
            
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="all">All Status</option>
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterAmount}
            onChange={(e) => setFilterAmount(e.target.value)}
            className="px-4 py-2 bg-input-background border border-border rounded-lg">
            
            <option value="all">All Amounts</option>
            <option value="small">Small (&lt; $25K)</option>
            <option value="medium">Medium ($25K - $75K)</option>
            <option value="large">Large (&gt; $75K)</option>
          </select>
        </div>
      </Card>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedRequests.map((loan) => {
          const risk = getRiskLevel(loan.creditScore);
          const returns = calculateReturn(loan.amount, loan.interestRate, loan.duration);

          return (
            <Card key={loan.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">{loan.borrowerName}</h3>
                  <p className="text-sm text-muted-foreground">{loan.purpose}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                loan.status === 'approved' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'}`
                }>
                  {loan.status === 'pending' ? 'Awaiting Review' : loan.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Loan Amount</p>
                  <p className="text-xl font-medium">${loan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                  <p className="text-xl font-medium text-green-600">{loan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <p className="text-lg">{loan.duration} months</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Credit Score</p>
                  <p className="text-lg">{loan.creditScore || 'N/A'}</p>
                </div>
              </div>

              <div className="mb-4 p-3 bg-secondary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${risk.bgColor} ${risk.textColor}`}>
                    {risk.label}
                  </span>
                </div>
                {loan.creditScore &&
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                    className={`h-full ${
                    risk.color === 'green' ? 'bg-green-500' :
                    risk.color === 'lime' ? 'bg-lime-500' :
                    risk.color === 'yellow' ? 'bg-yellow-500' :
                    risk.color === 'orange' ? 'bg-orange-500' :
                    'bg-red-500'}`
                    }
                    style={{ width: `${(loan.creditScore || 0) / 850 * 100}%` }} />
                  
                  </div>
                }
              </div>

              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-900 mb-2 font-medium">Potential Returns</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Monthly EMI:</span>
                    <span className="ml-2 font-medium">${returns.emi}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Interest:</span>
                    <span className="ml-2 font-medium text-green-700">${returns.totalInterest}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">ROI:</span>
                    <span className="ml-2 font-medium text-green-700">{returns.roi}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <span>Request ID: {loan.id}</span>
                <span>Applied: {loan.appliedDate}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedRequest(loan.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary rounded-lg hover:bg-secondary/80">
                  
                  <Eye size={18} />
                  View Details
                </button>
                {loan.status === 'pending' &&
                <>
                    <button
                    onClick={() => handleAccept(loan.id, loan.borrowerName)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    
                      <CheckCircle size={18} />
                      Accept
                    </button>
                    <button
                    onClick={() => handleReject(loan.id, loan.borrowerName)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    
                      <XCircle size={18} />
                    </button>
                  </>
                }
              </div>
            </Card>);

        })}
      </div>

      {sortedRequests.length === 0 &&
      <Card className="p-12 text-center">
          <Users className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h3 className="text-lg mb-2">No Requests Found</h3>
          <p className="text-muted-foreground">
            {filterStatus !== 'all' || searchTerm ?
          'Try adjusting your filters' :
          'No borrower requests available at the moment'}
          </p>
        </Card>
      }

      {/* Detail Modal */}
      {selectedLoan && returns &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl">Loan Request Details</h2>
              <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-secondary rounded-lg">
                <XCircle size={20} />
              </button>
            </div>

            {/* Borrower Info */}
            <div className="mb-6 p-4 bg-secondary rounded-lg">
              <h3 className="mb-3 font-medium">Borrower Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{selectedLoan.borrowerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credit Score</p>
                  <p className="font-medium">{selectedLoan.creditScore || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Employment Status</p>
                  <p className="font-medium">{selectedLoan.employmentStatus || 'Not Specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Application Date</p>
                  <p className="font-medium">{selectedLoan.appliedDate}</p>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="mb-6 p-4 bg-secondary rounded-lg">
              <h3 className="mb-3 font-medium">Loan Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Loan Amount</p>
                  <p className="text-2xl font-medium">${selectedLoan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Interest Rate</p>
                  <p className="text-2xl font-medium text-green-600">{selectedLoan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Duration</p>
                  <p className="text-lg">{selectedLoan.duration} months</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Purpose</p>
                  <p className="text-lg">{selectedLoan.purpose}</p>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="mb-3 font-medium text-yellow-900">Risk Assessment</h3>
              {selectedLoan.creditScore ?
            <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm">Credit Score: {selectedLoan.creditScore}/850</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevel(selectedLoan.creditScore).bgColor} ${getRiskLevel(selectedLoan.creditScore).textColor}`}>
                      {getRiskLevel(selectedLoan.creditScore).label}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                    <div
                  className={`h-full ${
                  getRiskLevel(selectedLoan.creditScore).color === 'green' ? 'bg-green-500' :
                  getRiskLevel(selectedLoan.creditScore).color === 'lime' ? 'bg-lime-500' :
                  getRiskLevel(selectedLoan.creditScore).color === 'yellow' ? 'bg-yellow-500' :
                  getRiskLevel(selectedLoan.creditScore).color === 'orange' ? 'bg-orange-500' :
                  'bg-red-500'}`
                  }
                  style={{ width: `${(selectedLoan.creditScore || 0) / 850 * 100}%` }} />
                
                  </div>
                </> :

            <p className="text-sm text-yellow-700">Credit score not available</p>
            }
            </div>

            {/* Investment Returns */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="mb-3 font-medium text-green-900">Your Investment Returns</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-green-700 mb-1">Monthly EMI Received</p>
                  <p className="text-2xl font-medium text-green-900">${returns.emi}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Total Interest Earned</p>
                  <p className="text-2xl font-medium text-green-900">${returns.totalInterest}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Total Repayment</p>
                  <p className="text-xl font-medium text-green-900">${returns.totalRepayment}</p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Return on Investment</p>
                  <p className="text-xl font-medium text-green-900">{returns.roi}%</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedLoan.status === 'pending' &&
          <div className="flex gap-3">
                <button
              onClick={() => handleAccept(selectedLoan.id, selectedLoan.borrowerName)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              
                  <CheckCircle size={20} />
                  Accept & Fund This Loan
                </button>
                <button
              onClick={() => handleReject(selectedLoan.id, selectedLoan.borrowerName)}
              className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
              
                  <XCircle size={20} />
                  Reject
                </button>
              </div>
          }

            {selectedLoan.status === 'approved' &&
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <CheckCircle className="mx-auto mb-2 text-green-600" size={32} />
                <p className="text-green-900 font-medium">This loan has been approved and funded</p>
              </div>
          }

            {selectedLoan.status === 'rejected' &&
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <XCircle className="mx-auto mb-2 text-red-600" size={32} />
                <p className="text-red-900 font-medium">This loan request was rejected</p>
              </div>
          }
          </Card>
        </div>
      }
    </div>);

}