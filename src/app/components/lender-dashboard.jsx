import { useState } from 'react';
import { DollarSign, TrendingUp, Users, Plus } from 'lucide-react';
import { Card, StatsCard } from './card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function LenderDashboard() {
  const { currentUser, loans, loanOffers, addLoanOffer, updateLoanOffer, approveLoan, rejectLoan, payments } = useApp();
  const [showNewOfferForm, setShowNewOfferForm] = useState(false);

  if (!currentUser) return null;

  // Filter data for current lender
  const myOffers = loanOffers.filter((o) => o.lenderId === currentUser.id);
  const pendingRequests = loans.filter((l) => l.status === 'pending');
  const myLoans = loans.filter((l) => l.lenderId === currentUser.id);
  const myPayments = payments.filter((p) => myLoans.some((l) => l.id === p.loanId));

  // Calculate stats
  const totalDisbursed = myLoans.reduce((sum, l) => sum + l.amount, 0);
  const activeBorrowers = new Set(myLoans.map((l) => l.borrowerId)).size;

  // Loan distribution data
  const loansByPurpose = myLoans.reduce((acc, loan) => {
    acc[loan.purpose] = (acc[loan.purpose] || 0) + 1;
    return acc;
  }, {});

  const distributionData = Object.entries(loansByPurpose).map(([name, value], index) => ({
    name,
    value,
    color: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]
  }));

  const handleCreateOffer = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addLoanOffer({
      lenderId: currentUser.id,
      lenderName: currentUser.name,
      amount: Number(formData.get('amount')),
      interestRate: Number(formData.get('rate')),
      duration: Number(formData.get('duration')),
      minCreditScore: Number(formData.get('minScore')),
      status: 'active'
    });

    toast.success('Loan offer created successfully!');
    setShowNewOfferForm(false);
    e.currentTarget.reset();
  };

  const handleToggleOfferStatus = (offerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateLoanOffer(offerId, { status: newStatus });
    toast.success(`Offer ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`);
  };

  const handleApprove = (loanId) => {
    approveLoan(loanId, currentUser.id, currentUser.name);
    toast.success('Loan approved successfully!');
  };

  const handleReject = (loanId) => {
    if (confirm('Are you sure you want to reject this loan application?')) {
      rejectLoan(loanId);
      toast.success('Loan rejected.');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Lender Dashboard</h1>
          <p className="text-muted-foreground">Manage your loan offers and track performance</p>
        </div>
        <button
          onClick={() => setShowNewOfferForm(!showNewOfferForm)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-lg hover:bg-primary/90 w-full sm:w-auto justify-center">
          
          <Plus size={20} />
          Create Loan Offer
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Disbursed"
          value={`$${(totalDisbursed / 1000).toFixed(1)}K`}
          icon={<DollarSign size={24} />}
          trend="+15.3% from last month"
          trendUp={true} />
        
        <StatsCard
          title="Active Offers"
          value={myOffers.filter((o) => o.status === 'active').length.toString()}
          icon={<TrendingUp size={24} />} />
        
        <StatsCard
          title="Active Borrowers"
          value={activeBorrowers.toString()}
          icon={<Users size={24} />}
          trend="+6 new this month"
          trendUp={true} />
        
      </div>

      {showNewOfferForm &&
      <Card className="p-6 mb-6">
          <h3 className="mb-4">Create New Loan Offer</h3>
          <form onSubmit={handleCreateOffer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Loan Amount ($)</label>
              <input
              name="amount"
              type="number"
              placeholder="Enter amount"
              required
              min="1000"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>
            <div>
              <label className="block text-sm mb-2">Interest Rate (%)</label>
              <input
              name="rate"
              type="number"
              step="0.1"
              placeholder="Enter rate"
              required
              min="0"
              max="30"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>
            <div>
              <label className="block text-sm mb-2">Duration (months)</label>
              <input
              name="duration"
              type="number"
              placeholder="Enter duration"
              required
              min="6"
              max="360"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>
            <div>
              <label className="block text-sm mb-2">Minimum Credit Score</label>
              <input
              name="minScore"
              type="number"
              placeholder="Enter score"
              required
              min="300"
              max="850"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
              
                Submit Offer
              </button>
              <button
              type="button"
              onClick={() => setShowNewOfferForm(false)}
              className="bg-secondary px-6 py-2 rounded-lg hover:bg-secondary/80">
              
                Cancel
              </button>
            </div>
          </form>
        </Card>
      }

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Loan Offers */}
        <Card className="p-6">
          <h3 className="mb-4">My Loan Offers ({myOffers.length})</h3>
          <div className="space-y-3">
            {myOffers.length === 0 ?
            <p className="text-center py-8 text-muted-foreground">No loan offers yet. Create one to get started!</p> :

            myOffers.map((offer) =>
            <div key={offer.id} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{offer.id}</span>
                    <button
                  onClick={() => handleToggleOfferStatus(offer.id, offer.status)}
                  className={`text-xs px-2 py-1 rounded-full ${
                  offer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`
                  }>
                  
                      {offer.status}
                    </button>
                  </div>
                  <p className="text-xl mb-1">${offer.amount.toLocaleString()}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>Rate: {offer.interestRate}%</span>
                    <span>Duration: {offer.duration}mo</span>
                    <span>Min Score: {offer.minCreditScore}</span>
                  </div>
                </div>
            )
            }
          </div>
        </Card>

        {/* Loan Distribution Chart */}
        <Card className="p-6">
          <h3 className="mb-4">Loan Distribution by Purpose</h3>
          {distributionData.length > 0 ?
          <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}>
                
                  {distributionData.map((entry, index) =>
                <Cell key={`cell-${index}`} fill={entry.color} />
                )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer> :

          <p className="text-center py-12 text-muted-foreground">No loan data available</p>
          }
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Borrower Requests */}
        <Card className="p-6">
          <h3 className="mb-4">Pending Loan Requests ({pendingRequests.length})</h3>
          <div className="space-y-3">
            {pendingRequests.length === 0 ?
            <p className="text-center py-8 text-muted-foreground">No pending requests</p> :

            pendingRequests.map((request) =>
            <div key={request.id} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{request.borrowerName}</p>
                      <p className="text-xs text-muted-foreground">{request.purpose}</p>
                    </div>
                    <p className="text-sm font-medium">${request.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-muted-foreground">
                      <span>Credit: {request.creditScore}</span>
                      <span className="ml-3">{request.duration}mo @ {request.interestRate}%</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                    onClick={() => handleApprove(request.id)}
                    className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">
                    
                        Approve
                      </button>
                      <button
                    onClick={() => handleReject(request.id)}
                    className="text-xs bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive/90">
                    
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
            )
            }
          </div>
        </Card>

        {/* Payment Tracking */}
        <Card className="p-6">
          <h3 className="mb-4">Upcoming Payments</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-sm text-muted-foreground">Borrower</th>
                  <th className="text-left py-2 text-sm text-muted-foreground">Amount</th>
                  <th className="text-left py-2 text-sm text-muted-foreground">Due Date</th>
                  <th className="text-left py-2 text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {myPayments.filter((p) => p.status === 'upcoming').slice(0, 5).map((payment) =>
                <tr key={payment.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm">{payment.borrowerName}</td>
                    <td className="py-3 text-sm">${payment.amount.toLocaleString()}</td>
                    <td className="py-3 text-sm">{payment.dueDate}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`
                    }>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {myPayments.filter((p) => p.status === 'upcoming').length === 0 &&
            <p className="text-center py-8 text-muted-foreground">No upcoming payments</p>
            }
          </div>
        </Card>
      </div>
    </div>);

}