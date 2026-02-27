import { useState } from 'react';
import { CreditCard, DollarSign, Calendar, Calculator } from 'lucide-react';
import { Card, StatsCard } from './card';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';

export function BorrowerDashboard() {
  const { currentUser, loans, payments, addLoan, makePayment } = useApp();
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [loanAmount, setLoanAmount] = useState(10000);
  const [loanDuration, setLoanDuration] = useState(12);
  const [interestRate] = useState(8.5);

  if (!currentUser) return null;

  // Filter data for current borrower
  const myLoans = loans.filter((l) => l.borrowerId === currentUser.id);
  const myActiveLoans = myLoans.filter((l) => l.status === 'active');
  const myPayments = payments.filter((p) => p.borrowerId === currentUser.id);

  // Calculate stats
  const totalBorrowed = myActiveLoans.reduce((sum, l) => sum + l.amount, 0);
  const outstandingBalance = myActiveLoans.reduce((sum, l) => sum + (l.remainingBalance || 0), 0);
  const upcomingPayments = myPayments.filter((p) => p.status === 'upcoming');
  const nextPayment = upcomingPayments.length > 0 ?
  upcomingPayments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0] :
  null;

  // Payment schedule (last 3)
  const paymentSchedule = [...myPayments].
  sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).
  slice(0, 5);

  const handleApplyLoan = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    addLoan({
      borrowerId: currentUser.id,
      borrowerName: currentUser.name,
      amount: Number(formData.get('amount')),
      interestRate: Number(formData.get('rate')),
      duration: Number(formData.get('duration')),
      purpose: formData.get('purpose'),
      creditScore: Number(formData.get('creditScore') || 700),
      employmentStatus: formData.get('employment')
    });

    toast.success('Loan application submitted successfully!');
    setShowLoanForm(false);
    e.currentTarget.reset();
  };

  const handleMakePayment = (paymentId, amount) => {
    if (confirm(`Confirm payment of $${amount.toLocaleString()}?`)) {
      makePayment(paymentId);
      toast.success('Payment successful!');
    }
  };

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanDuration) / (
    Math.pow(1 + monthlyRate, loanDuration) - 1);
    return emi.toFixed(2);
  };

  const getDaysUntilDue = (dueDate) => {
    const days = Math.floor((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl mb-2">Borrower Dashboard</h1>
          <p className="text-muted-foreground">Manage your loans and payments</p>
        </div>
        <button
          onClick={() => setShowLoanForm(!showLoanForm)}
          className="bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-lg hover:bg-primary/90 w-full sm:w-auto">
          
          Apply for Loan
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Borrowed"
          value={`$${totalBorrowed.toLocaleString()}`}
          icon={<CreditCard size={24} />} />
        
        <StatsCard
          title="Outstanding Balance"
          value={`$${outstandingBalance.toLocaleString()}`}
          icon={<DollarSign size={24} />} />
        
        <StatsCard
          title="Next Payment"
          value={nextPayment ? `$${nextPayment.amount.toLocaleString()}` : 'N/A'}
          icon={<Calendar size={24} />}
          trend={nextPayment ? `Due in ${getDaysUntilDue(nextPayment.dueDate)} days` : undefined} />
        
      </div>

      {/* Apply for Loan Form */}
      {showLoanForm &&
      <Card className="p-6 mb-6">
          <h3 className="mb-4">Apply for New Loan</h3>
          <form onSubmit={handleApplyLoan} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <label className="block text-sm mb-2">Interest Rate (%)</label>
              <input
              name="rate"
              type="number"
              step="0.1"
              defaultValue="8.5"
              required
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>
            <div>
              <label className="block text-sm mb-2">Credit Score</label>
              <input
              name="creditScore"
              type="number"
              defaultValue="700"
              min="300"
              max="850"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>
            <div>
              <label className="block text-sm mb-2">Purpose</label>
              <select
              name="purpose"
              required
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              
                <option>Personal Use</option>
                <option>Business Expansion</option>
                <option>Home Renovation</option>
                <option>Debt Consolidation</option>
                <option>Education</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">Employment Status</label>
              <select
              name="employment"
              required
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              
                <option>Full-time Employed</option>
                <option>Self-employed</option>
                <option>Part-time Employed</option>
                <option>Unemployed</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
              type="submit"
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
              
                Submit Application
              </button>
              <button
              type="button"
              onClick={() => setShowLoanForm(false)}
              className="bg-secondary px-6 py-2 rounded-lg hover:bg-secondary/80">
              
                Cancel
              </button>
            </div>
          </form>
        </Card>
      }

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Loans */}
        <Card className="p-6">
          <h3 className="mb-4">Active Loans ({myActiveLoans.length})</h3>
          <div className="space-y-4">
            {myActiveLoans.length === 0 ?
            <p className="text-center py-8 text-muted-foreground">No active loans. Apply for one to get started!</p> :

            myActiveLoans.map((loan) =>
            <div key={loan.id} className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">{loan.id}</span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full capitalize">
                      {loan.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground">Original Amount</p>
                    <p className="text-xl">${loan.amount.toLocaleString()}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground">Remaining Balance</p>
                    <p className="text-lg">${(loan.remainingBalance || 0).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Rate: {loan.interestRate}%</span>
                    <span>Duration: {loan.duration} months</span>
                  </div>
                </div>
            )
            }
          </div>
        </Card>

        {/* Loan Status Tracker */}
        <Card className="p-6">
          <h3 className="mb-4">Recent Applications</h3>
          <div className="space-y-4">
            {myLoans.length === 0 ?
            <p className="text-center py-8 text-muted-foreground">No loan applications yet</p> :

            myLoans.slice(0, 3).map((loan) =>
            <div
              key={loan.id}
              className={`p-4 border rounded-lg ${
              loan.status === 'approved' || loan.status === 'active' ?
              'bg-green-50 border-green-200' :
              loan.status === 'pending' ?
              'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'}`
              }>
              
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{loan.purpose} - ${loan.amount.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                loan.status === 'approved' || loan.status === 'active' ?
                'bg-green-100 text-green-700' :
                loan.status === 'pending' ?
                'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}`
                }>
                      {loan.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Applied on {loan.appliedDate}</p>
                  <p className={`text-xs mt-1 ${
              loan.status === 'approved' || loan.status === 'active' ?
              'text-green-700' :
              loan.status === 'pending' ?
              'text-yellow-700' :
              'text-red-700'}`
              }>
                    {loan.status === 'approved' || loan.status === 'active' ?
                'Disbursement processed' :
                loan.status === 'pending' ?
                'Under review' :
                'Application rejected'}
                  </p>
                </div>
            )
            }
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Schedule */}
        <Card className="p-6">
          <h3 className="mb-4">Payment Schedule</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-sm text-muted-foreground">Due Date</th>
                  <th className="text-left py-2 text-sm text-muted-foreground">Amount</th>
                  <th className="text-left py-2 text-sm text-muted-foreground">Status</th>
                  <th className="text-left py-2 text-sm text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {paymentSchedule.map((payment) =>
                <tr key={payment.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm">{payment.dueDate}</td>
                    <td className="py-3 text-sm">${payment.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    payment.status === 'paid' ?
                    'bg-green-100 text-green-700' :
                    'bg-blue-100 text-blue-700'}`
                    }>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-3">
                      {payment.status === 'upcoming' &&
                    <button
                      onClick={() => handleMakePayment(payment.id, payment.amount)}
                      className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90">
                      
                          Pay Now
                        </button>
                    }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {paymentSchedule.length === 0 &&
            <p className="text-center py-8 text-muted-foreground">No payment schedule available</p>
            }
          </div>
        </Card>

        {/* EMI Calculator */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator size={20} className="text-primary" />
            <h3>EMI Calculator</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Loan Amount</label>
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full" />
              
              <p className="text-right text-sm mt-1">${loanAmount.toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-sm mb-2">Duration (months)</label>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={loanDuration}
                onChange={(e) => setLoanDuration(Number(e.target.value))}
                className="w-full" />
              
              <p className="text-right text-sm mt-1">{loanDuration} months</p>
            </div>

            <div>
              <label className="block text-sm mb-2">Interest Rate (Annual)</label>
              <p className="text-right text-sm">{interestRate}%</p>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Monthly EMI</p>
                <p className="text-3xl text-primary">${calculateEMI()}</p>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Payment</span>
                  <span>${(Number(calculateEMI()) * loanDuration).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interest</span>
                  <span>${(Number(calculateEMI()) * loanDuration - loanAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}