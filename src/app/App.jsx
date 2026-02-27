import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LandingPage } from './components/landing-page';
import { Login } from './components/login';
import { Signup } from './components/signup';
import { TermsOfService } from './components/terms-of-service';
import { PrivacyPolicy } from './components/privacy-policy';
import { Sidebar } from './components/sidebar';
import { AdminDashboard } from './components/admin-dashboard';
import { LenderDashboard } from './components/lender-dashboard';
import { BorrowerDashboard } from './components/borrower-dashboard';
import { AnalystDashboard } from './components/analyst-dashboard';
import { UsersPage } from './components/pages/users-page';
import { LoansPage } from './components/pages/loans-page';
import { TransactionsPage } from './components/pages/transactions-page';
import { ReportsPage } from './components/pages/reports-page';
import { SettingsPage } from './components/pages/settings-page';
import { BorrowerRequestsPage } from './components/pages/borrower-requests-page';
import { LenderRequestsPage } from './components/pages/lender-requests-page';
import { PaymentsPage } from './components/pages/payments-page';
import { AnalyticsPage } from './components/pages/analytics-page';
import { RiskAnalysisPage } from './components/pages/risk-analysis-page';
import { NotificationPanel } from './components/notification-panel';
import { Bell, User, LogOut } from 'lucide-react';
import { Toaster } from 'sonner';

function AppContent() {
  const { currentUser, logout, loans, payments } = useApp();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Calculate unread notifications count
  const getUnreadCount = () => {
    let count = 0;

    // Pending loans
    if (currentUser?.role === 'admin' || currentUser?.role === 'lender') {
      count += loans.filter((l) => l.status === 'pending').length;
    }

    // Overdue payments
    const overduePayments = payments.filter((p) => {
      return p.status === 'upcoming' && new Date(p.dueDate) < new Date();
    });
    if (overduePayments.length > 0 && (currentUser?.role === 'admin' || currentUser?.role === 'lender')) {
      count += 1; // One notification for all overdue
    }

    // Upcoming payments for borrowers
    if (currentUser?.role === 'borrower') {
      const upcomingPayments = payments.filter((p) => {
        const daysUntil = Math.floor((new Date(p.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return p.status === 'upcoming' && daysUntil <= 7 && daysUntil >= 0;
      });
      count += upcomingPayments.length;
    }

    return count;
  };

  const unreadCount = getUnreadCount();

  const handleLogout = () => {
    logout();
    setCurrentPage('dashboard');
  };

  if (!currentUser) {
    let unauthContent;
    // Show Terms of Service page
    if (showTerms) {
      unauthContent = <TermsOfService onBack={() => setShowTerms(false)} />;
    } else if (showPrivacy) {
      unauthContent = <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
    } else if (showSignup) {
      unauthContent = (
        <Signup
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          onShowTerms={() => {
            setShowSignup(false);
            setShowTerms(true);
          }}
          onShowPrivacy={() => {
            setShowSignup(false);
            setShowPrivacy(true);
          }} />
      );
    } else if (showLogin) {
      unauthContent = (
        <Login
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onShowTerms={() => {
            setShowLogin(false);
            setShowTerms(true);
          }}
          onShowPrivacy={() => {
            setShowLogin(false);
            setShowPrivacy(true);
          }} />
      );
    } else {
      unauthContent = (
        <LandingPage
          onShowLogin={() => {
            setShowLanding(false);
            setShowLogin(true);
          }}
          onShowSignup={() => {
            setShowLanding(false);
            setShowSignup(true);
          }}
          onShowTerms={() => {
            setShowLanding(false);
            setShowTerms(true);
          }}
          onShowPrivacy={() => {
            setShowLanding(false);
            setShowPrivacy(true);
          }} />
      );
    }

    return (
      <>
        {unauthContent}
        <Toaster position="top-right" richColors />
      </>
    );
  }

  const renderContent = () => {
    // Common pages
    if (currentPage === 'users' && currentUser.role === 'admin') {
      return <UsersPage />;
    }
    if (currentPage === 'loans') {
      return <LoansPage />;
    }
    if (currentPage === 'transactions') {
      return <TransactionsPage />;
    }
    if (currentPage === 'reports') {
      return <ReportsPage />;
    }
    if (currentPage === 'settings') {
      return <SettingsPage />;
    }

    // Admin specific pages
    if (currentPage === 'requests' && currentUser.role === 'admin') {
      return <BorrowerRequestsPage />;
    }

    // Lender specific pages
    if (currentPage === 'requests' && currentUser.role === 'lender') {
      return <LenderRequestsPage />;
    }

    // Shared pages
    if (currentPage === 'payments') {
      return <PaymentsPage />;
    }
    if (currentPage === 'analytics') {
      return <AnalyticsPage />;
    }
    if (currentPage === 'risk') {
      return <RiskAnalysisPage />;
    }

    // Role-specific dashboards
    if (currentPage === 'dashboard') {
      switch (currentUser.role) {
        case 'admin':
          return <AdminDashboard />;
        case 'lender':
          return <LenderDashboard />;
        case 'borrower':
          return <BorrowerDashboard />;
        case 'analyst':
          return <AnalystDashboard />;
        default:
          return <AdminDashboard />;
      }
    }

    // Default to dashboard
    return <AdminDashboard />;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar role={currentUser.role} currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="bg-card border-b border-border px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl capitalize">{currentUser.role} Portal</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Welcome back, {currentUser.name}! Today is {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 hover:bg-secondary rounded-lg relative">

                <Bell size={20} />
                {unreadCount > 0 &&
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                }
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border">
                <div className="text-right">
                  <p className="text-sm">{currentUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <User size={20} className="text-primary-foreground" />
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground"
                title="Logout">

                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-background">
          {renderContent()}
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)} />


      <Toaster position="top-right" richColors />
    </div>);

}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>);

}