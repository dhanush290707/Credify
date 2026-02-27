
import { LayoutDashboard, Users, CreditCard, ArrowLeftRight, FileText, Settings, TrendingUp, DollarSign, Calculator, AlertTriangle } from 'lucide-react';













const navigationMap = {
  admin: [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'dashboard' },
  { icon: <Users size={20} />, label: 'Users', id: 'users' },
  { icon: <CreditCard size={20} />, label: 'Loans', id: 'loans' },
  { icon: <AlertTriangle size={20} />, label: 'Requests', id: 'requests' },
  { icon: <DollarSign size={20} />, label: 'Payments', id: 'payments' },
  { icon: <ArrowLeftRight size={20} />, label: 'Transactions', id: 'transactions' },
  { icon: <TrendingUp size={20} />, label: 'Analytics', id: 'analytics' },
  { icon: <FileText size={20} />, label: 'Reports', id: 'reports' },
  { icon: <Settings size={20} />, label: 'Settings', id: 'settings' }],

  lender: [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'dashboard' },
  { icon: <TrendingUp size={20} />, label: 'Loan Offers', id: 'offers' },
  { icon: <Users size={20} />, label: 'Borrower Requests', id: 'requests' },
  { icon: <DollarSign size={20} />, label: 'Payments', id: 'payments' },
  { icon: <FileText size={20} />, label: 'Analytics', id: 'analytics' }],

  borrower: [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'dashboard' },
  { icon: <CreditCard size={20} />, label: 'My Loans', id: 'loans' },
  { icon: <DollarSign size={20} />, label: 'Payments', id: 'payments' },
  { icon: <Calculator size={20} />, label: 'EMI Calculator', id: 'calculator' }],

  analyst: [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', id: 'dashboard' },
  { icon: <TrendingUp size={20} />, label: 'Trends', id: 'trends' },
  { icon: <AlertTriangle size={20} />, label: 'Risk Analysis', id: 'risk' },
  { icon: <FileText size={20} />, label: 'Reports', id: 'reports' }]

};

export function Sidebar({ role, currentPage, onNavigate }) {
  const navItems = navigationMap[role] || [];

  return (
    <aside className="hidden lg:flex w-64 bg-card border-r border-border min-h-screen flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <CreditCard className="text-primary-foreground" size={24} />
          </div>
          <div>
            <h2 className="font-semibold">Credify</h2>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        {navItems.map((item) =>
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
          currentPage === item.id ?
          'bg-primary text-primary-foreground' :
          'text-foreground hover:bg-secondary'}`
          }>
          
            {item.icon}
            <span>{item.label}</span>
          </button>
        )}
      </nav>
    </aside>);

}