import { createContext, useContext, useState, useEffect } from 'react';

// Types


































































































const AppContext = createContext(undefined);

// Initial mock data
const initialUsers = [
  { id: 'U001', name: 'John Doe', email: 'john@example.com', password: 'Password1!', role: 'borrower', status: 'active', createdAt: '2026-01-15' },
  { id: 'U002', name: 'Sarah Smith', email: 'sarah@example.com', password: 'Password1!', role: 'lender', status: 'active', createdAt: '2026-01-10' },
  { id: 'U003', name: 'Mike Johnson', email: 'mike@example.com', password: 'Password1!', role: 'borrower', status: 'active', createdAt: '2026-02-01' },
  { id: 'U004', name: 'Emily Davis', email: 'emily@example.com', password: 'Password1!', role: 'borrower', status: 'pending', createdAt: '2026-02-10' },
  { id: 'U005', name: 'Admin User', email: 'admin@credify.com', password: 'Password1!', role: 'admin', status: 'active', createdAt: '2025-12-01' },
  { id: 'U006', name: 'Financial Analyst', email: 'analyst@credify.com', password: 'Password1!', role: 'analyst', status: 'active', createdAt: '2025-12-01' }];


const initialLoans = [
  {
    id: 'LN001',
    borrowerId: 'U001',
    borrowerName: 'John Doe',
    lenderId: 'U002',
    lenderName: 'Sarah Smith',
    amount: 25000,
    interestRate: 7.5,
    duration: 24,
    purpose: 'Business Expansion',
    status: 'active',
    appliedDate: '2026-01-20',
    approvedDate: '2026-01-22',
    remainingBalance: 18500,
    creditScore: 720
  },
  {
    id: 'LN002',
    borrowerId: 'U001',
    borrowerName: 'John Doe',
    amount: 10000,
    interestRate: 8.2,
    duration: 12,
    purpose: 'Personal Use',
    status: 'active',
    appliedDate: '2026-02-01',
    approvedDate: '2026-02-03',
    remainingBalance: 5200,
    creditScore: 720
  },
  {
    id: 'LN003',
    borrowerId: 'U003',
    borrowerName: 'Mike Johnson',
    amount: 50000,
    interestRate: 6.8,
    duration: 36,
    purpose: 'Home Renovation',
    status: 'pending',
    appliedDate: '2026-02-15',
    creditScore: 680
  },
  {
    id: 'LN004',
    borrowerId: 'U004',
    borrowerName: 'Emily Davis',
    amount: 15000,
    interestRate: 9.1,
    duration: 18,
    purpose: 'Debt Consolidation',
    status: 'pending',
    appliedDate: '2026-02-17',
    creditScore: 650
  }];


const initialLoanOffers = [
  { id: 'LO001', lenderId: 'U002', lenderName: 'Sarah Smith', amount: 50000, interestRate: 8.5, duration: 24, minCreditScore: 680, status: 'active', createdAt: '2026-01-05' },
  { id: 'LO002', lenderId: 'U002', lenderName: 'Sarah Smith', amount: 100000, interestRate: 7.2, duration: 36, minCreditScore: 720, status: 'active', createdAt: '2026-01-10' },
  { id: 'LO003', lenderId: 'U002', lenderName: 'Sarah Smith', amount: 25000, interestRate: 9.1, duration: 12, minCreditScore: 650, status: 'paused', createdAt: '2026-02-01' }];


const initialTransactions = [
  { id: 'TXN001', loanId: 'LN001', userId: 'U001', userName: 'John Doe', type: 'payment', amount: 5000, status: 'completed', date: '2026-02-18' },
  { id: 'TXN002', loanId: 'LN002', userId: 'U001', userName: 'John Doe', type: 'disbursement', amount: 25000, status: 'pending', date: '2026-02-18' },
  { id: 'TXN003', loanId: 'LN001', userId: 'U003', userName: 'Mike Johnson', type: 'payment', amount: 3200, status: 'completed', date: '2026-02-17' },
  { id: 'TXN004', loanId: 'LN001', userId: 'U004', userName: 'Emily Davis', type: 'payment', amount: 7500, status: 'completed', date: '2026-02-17' }];


const initialPayments = [
  { id: 'PAY001', loanId: 'LN001', borrowerId: 'U001', borrowerName: 'John Doe', amount: 1250, principal: 1050, interest: 200, dueDate: '2026-02-28', status: 'upcoming' },
  { id: 'PAY002', loanId: 'LN001', borrowerId: 'U001', borrowerName: 'John Doe', amount: 1250, principal: 1040, interest: 210, dueDate: '2026-01-28', paidDate: '2026-01-27', status: 'paid' },
  { id: 'PAY003', loanId: 'LN002', borrowerId: 'U001', borrowerName: 'John Doe', amount: 900, principal: 820, interest: 80, dueDate: '2026-02-25', status: 'upcoming' }];


export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loanOffers, setLoanOffers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('loanflow_users');
    const savedLoans = localStorage.getItem('loanflow_loans');
    const savedOffers = localStorage.getItem('loanflow_offers');
    const savedTransactions = localStorage.getItem('loanflow_transactions');
    const savedPayments = localStorage.getItem('loanflow_payments');
    const savedCurrentUser = localStorage.getItem('loanflow_current_user');

    let parsedUsers = savedUsers ? JSON.parse(savedUsers) : initialUsers;
    // ensure legacy users have a password so login doesn't permanently break
    parsedUsers = parsedUsers.map(u => u.password ? u : { ...u, password: 'Password1!' });

    setUsers(parsedUsers);
    setLoans(savedLoans ? JSON.parse(savedLoans) : initialLoans);
    setLoanOffers(savedOffers ? JSON.parse(savedOffers) : initialLoanOffers);
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : initialTransactions);
    setPayments(savedPayments ? JSON.parse(savedPayments) : initialPayments);
    setCurrentUser(savedCurrentUser ? JSON.parse(savedCurrentUser) : null);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('loanflow_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('loanflow_loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('loanflow_offers', JSON.stringify(loanOffers));
  }, [loanOffers]);

  useEffect(() => {
    localStorage.setItem('loanflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('loanflow_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('loanflow_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Auth functions
  const login = (email, password, role) => {
    const user = users.find((u) => u.email === email && u.password === password && u.role === role);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const signup = (name, email, password, role) => {
    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return false;
    }
    const newUser = {
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      name,
      email,
      password,
      role,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // User functions
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id, updates) => {
    setUsers(users.map((u) => u.id === id ? { ...u, ...updates } : u));
  };

  const deleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  // Loan functions
  const addLoan = (loanData) => {
    const newLoan = {
      ...loanData,
      id: `LN${String(loans.length + 1).padStart(3, '0')}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setLoans([...loans, newLoan]);

    // Add transaction
    addTransaction({
      loanId: newLoan.id,
      userId: loanData.borrowerId,
      userName: loanData.borrowerName,
      type: 'disbursement',
      amount: loanData.amount,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const updateLoan = (id, updates) => {
    setLoans(loans.map((l) => l.id === id ? { ...l, ...updates } : l));
  };

  const approveLoan = (id, lenderId, lenderName) => {
    const loan = loans.find((l) => l.id === id);
    if (!loan) return;

    updateLoan(id, {
      status: 'active',
      lenderId,
      lenderName,
      approvedDate: new Date().toISOString().split('T')[0],
      remainingBalance: loan.amount
    });

    // Update transaction status
    setTransactions(transactions.map((t) =>
      t.loanId === id && t.type === 'disbursement' ?
        { ...t, status: 'completed' } :
        t
    ));

    // Generate payment schedule
    generatePaymentSchedule(loan, lenderId);
  };

  const rejectLoan = (id) => {
    updateLoan(id, { status: 'rejected' });
    setTransactions(transactions.map((t) =>
      t.loanId === id && t.type === 'disbursement' ?
        { ...t, status: 'failed' } :
        t
    ));
  };

  const generatePaymentSchedule = (loan, lenderId) => {
    const monthlyRate = loan.interestRate / 12 / 100;
    const emi = loan.amount * monthlyRate * Math.pow(1 + monthlyRate, loan.duration) / (
      Math.pow(1 + monthlyRate, loan.duration) - 1);

    const newPayments = [];
    let remainingPrincipal = loan.amount;

    for (let i = 1; i <= loan.duration; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);

      const interest = remainingPrincipal * monthlyRate;
      const principal = emi - interest;
      remainingPrincipal -= principal;

      newPayments.push({
        id: `PAY${String(payments.length + newPayments.length + 1).padStart(3, '0')}`,
        loanId: loan.id,
        borrowerId: loan.borrowerId,
        borrowerName: loan.borrowerName,
        amount: Number(emi.toFixed(2)),
        principal: Number(principal.toFixed(2)),
        interest: Number(interest.toFixed(2)),
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'upcoming'
      });
    }

    setPayments([...payments, ...newPayments]);
  };

  // Loan Offer functions
  const addLoanOffer = (offerData) => {
    const newOffer = {
      ...offerData,
      id: `LO${String(loanOffers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLoanOffers([...loanOffers, newOffer]);
  };

  const updateLoanOffer = (id, updates) => {
    setLoanOffers(loanOffers.map((o) => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteLoanOffer = (id) => {
    setLoanOffers(loanOffers.filter((o) => o.id !== id));
  };

  // Transaction functions
  const addTransaction = (transactionData) => {
    const newTransaction = {
      ...transactionData,
      id: `TXN${String(transactions.length + 1).padStart(3, '0')}`
    };
    setTransactions([...transactions, newTransaction]);
  };

  // Payment functions
  const makePayment = (paymentId) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;

    setPayments(payments.map((p) =>
      p.id === paymentId ?
        { ...p, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } :
        p
    ));

    // Update loan remaining balance
    const loan = loans.find((l) => l.id === payment.loanId);
    if (loan && loan.remainingBalance) {
      updateLoan(loan.id, {
        remainingBalance: loan.remainingBalance - payment.principal
      });
    }

    // Add transaction
    addTransaction({
      loanId: payment.loanId,
      userId: payment.borrowerId,
      userName: payment.borrowerName,
      type: 'payment',
      amount: payment.amount,
      status: 'completed',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const value = {
    currentUser,
    users,
    loans,
    loanOffers,
    transactions,
    payments,
    login,
    signup,
    logout,
    addUser,
    updateUser,
    deleteUser,
    addLoan,
    updateLoan,
    approveLoan,
    rejectLoan,
    addLoanOffer,
    updateLoanOffer,
    deleteLoanOffer,
    addTransaction,
    makePayment
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}