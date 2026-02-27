import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell, X, CheckCircle, AlertTriangle, Info, DollarSign,
  CreditCard, Users, TrendingUp, Clock, XCircle, Check,
  Trash2, Settings, RefreshCw } from
'lucide-react';

import { toast } from 'sonner';
import { ConfirmDialog } from './dialog';


















export function NotificationPanel({ isOpen, onClose }) {
  const { currentUser, loans, payments } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Generate notifications based on system state
  useEffect(() => {
    const generatedNotifications = [];

    // Pending loan notifications (for admins and lenders)
    if (currentUser?.role === 'admin' || currentUser?.role === 'lender') {
      const pendingLoans = loans.filter((l) => l.status === 'pending');
      if (pendingLoans.length > 0) {
        generatedNotifications.push({
          id: `notif-pending-loans-${Date.now()}`,
          type: 'loan',
          title: 'Pending Loan Requests',
          message: `${pendingLoans.length} loan application${pendingLoans.length > 1 ? 's' : ''} awaiting review`,
          timestamp: new Date().toISOString(),
          read: false,
          actionable: true,
          actionUrl: '/requests',
          priority: 'high'
        });
      }
    }

    // Overdue payment notifications
    const overduePayments = payments.filter((p) => {
      return p.status === 'upcoming' && new Date(p.dueDate) < new Date();
    });

    if (overduePayments.length > 0 && (currentUser?.role === 'admin' || currentUser?.role === 'lender')) {
      generatedNotifications.push({
        id: `notif-overdue-${Date.now()}`,
        type: 'warning',
        title: 'Overdue Payments',
        message: `${overduePayments.length} payment${overduePayments.length > 1 ? 's' : ''} overdue. Total: $${overduePayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`,
        timestamp: new Date().toISOString(),
        read: false,
        actionable: true,
        actionUrl: '/payments',
        priority: 'urgent'
      });
    }

    // Upcoming payments (for borrowers)
    if (currentUser?.role === 'borrower') {
      const upcomingPayments = payments.filter((p) => {
        const dueDate = new Date(p.dueDate);
        const today = new Date();
        const daysUntil = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return p.status === 'upcoming' && daysUntil <= 7 && daysUntil >= 0;
      });

      upcomingPayments.forEach((payment, index) => {
        const daysUntil = Math.floor((new Date(payment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        generatedNotifications.push({
          id: `notif-payment-${payment.id}-${Date.now()}-${index}`,
          type: 'payment',
          title: 'Payment Due Soon',
          message: `Payment of $${payment.amount.toLocaleString()} due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''} for loan ${payment.loanId}`,
          timestamp: new Date().toISOString(),
          read: false,
          actionable: true,
          actionUrl: '/payments',
          priority: daysUntil <= 3 ? 'high' : 'medium'
        });
      });
    }

    // Recent loan approvals (for borrowers)
    if (currentUser?.role === 'borrower') {
      const recentApprovals = loans.filter((l) => {
        const approvedDate = new Date(l.approvedDate || '');
        const daysSince = Math.floor((new Date().getTime() - approvedDate.getTime()) / (1000 * 60 * 60 * 24));
        return l.status === 'approved' && daysSince <= 1;
      });

      recentApprovals.forEach((loan, index) => {
        generatedNotifications.push({
          id: `notif-approved-${loan.id}-${Date.now()}-${index}`,
          type: 'success',
          title: 'Loan Approved!',
          message: `Your loan application for $${loan.amount.toLocaleString()} has been approved`,
          timestamp: loan.approvedDate || new Date().toISOString(),
          read: false,
          actionable: true,
          actionUrl: '/loans',
          priority: 'high'
        });
      });
    }

    // System notifications
    const welcomeNotifications = [
    {
      id: `notif-welcome-${Date.now()}`,
      type: 'info',
      title: 'Welcome to Credify',
      message: `Welcome back, ${currentUser?.name}! You have access to all ${currentUser?.role} features.`,
      timestamp: new Date().toISOString(),
      read: false,
      priority: 'low'
    }];


    // Performance notifications (for analysts/admins)
    if (currentUser?.role === 'admin' || currentUser?.role === 'analyst') {
      const activeLoans = loans.filter((l) => l.status === 'active').length;
      generatedNotifications.push({
        id: `notif-portfolio-update-${Date.now()}`,
        type: 'system',
        title: 'Portfolio Update',
        message: `Portfolio contains ${activeLoans} active loan${activeLoans !== 1 ? 's' : ''}. Performance metrics updated.`,
        timestamp: new Date().toISOString(),
        read: true,
        priority: 'low'
      });
    }

    // Load saved notifications from localStorage and merge
    const savedNotifications = localStorage.getItem('loanflow_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Filter out old system notifications (older than 24 hours) to prevent buildup
        const recentSaved = parsed.filter((n) => {
          const notifDate = new Date(n.timestamp);
          const hoursSince = (new Date().getTime() - notifDate.getTime()) / (1000 * 60 * 60);
          // Keep user notifications, remove old system notifications
          return n.type !== 'system' && n.type !== 'info' || hoursSince < 24;
        });

        // Combine generated and saved, removing duplicates based on content
        const allNotifications = [...generatedNotifications, ...recentSaved];

        // Remove duplicates by creating a unique key from type+title+message
        const uniqueNotifications = allNotifications.filter((notif, index, self) =>
        index === self.findIndex((n) =>
        n.type === notif.type &&
        n.title === notif.title &&
        n.message === notif.message
        )
        );

        setNotifications(uniqueNotifications);
      } catch (e) {
        setNotifications(generatedNotifications);
      }
    } else {
      setNotifications(generatedNotifications);
    }
  }, [currentUser, loans, payments]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('loanflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600" size={20} />;
      case 'error':
        return <XCircle className="text-red-600" size={20} />;
      case 'payment':
        return <DollarSign className="text-blue-600" size={20} />;
      case 'loan':
        return <CreditCard className="text-purple-600" size={20} />;
      case 'user':
        return <Users className="text-indigo-600" size={20} />;
      case 'system':
        return <TrendingUp className="text-gray-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) =>
    n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setShowClearConfirm(true);
  };

  const handleClearConfirm = () => {
    setNotifications([]);
    setShowClearConfirm(false);
    toast.success('All notifications cleared');
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return time.toLocaleDateString();
  };

  const filteredNotifications = notifications.
  filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  }).
  filter((n) => {
    if (typeFilter === 'all') return true;
    return n.type === typeFilter;
  }).
  sort((a, b) => {
    // Sort by priority first, then timestamp
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in"
        onClick={onClose} />
      

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-background shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-xs text-muted-foreground">
                  {unreadCount} unread
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Close notifications">
              
              <X size={20} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={unreadCount === 0}>
              
              <Check size={14} />
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={notifications.length === 0}>
              
              <Trash2 size={14} />
              Clear all
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              aria-label="Settings">
              
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings &&
        <div className="p-4 bg-secondary border-b border-border">
            <h3 className="text-sm font-medium mb-3">Notification Preferences</h3>
            <div className="space-y-2">
              <label className="flex items-center justify-between text-sm">
                <span>Email Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span>Push Notifications</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span>Sound Alerts</span>
                <input type="checkbox" className="w-4 h-4" />
              </label>
            </div>
          </div>
        }

        {/* Filters */}
        <div className="p-4 border-b border-border bg-card/50">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 text-xs px-3 py-2 rounded-lg transition-colors font-medium ${
              filter === 'all' ?
              'bg-primary text-primary-foreground' :
              'bg-secondary/50 hover:bg-secondary'}`
              }>
              
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 text-xs px-3 py-2 rounded-lg transition-colors font-medium ${
              filter === 'unread' ?
              'bg-primary text-primary-foreground' :
              'bg-secondary/50 hover:bg-secondary'}`
              }>
              
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`flex-1 text-xs px-3 py-2 rounded-lg transition-colors font-medium ${
              filter === 'read' ?
              'bg-primary text-primary-foreground' :
              'bg-secondary/50 hover:bg-secondary'}`
              }>
              
              Read ({notifications.length - unreadCount})
            </button>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium">
            
            <option value="all">All Types</option>
            <option value="success">Success</option>
            <option value="warning">Warnings</option>
            <option value="error">Errors</option>
            <option value="payment">Payments</option>
            <option value="loan">Loans</option>
            <option value="user">Users</option>
            <option value="system">System</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto bg-secondary/20">
          {filteredNotifications.length === 0 ?
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                <Bell className="text-muted-foreground" size={32} />
              </div>
              <p className="text-base font-medium mb-1">No notifications</p>
              <p className="text-sm text-muted-foreground">
                {filter === 'unread' ?
              "You're all caught up!" :
              "No notifications to display"}
              </p>
            </div> :

          <div className="p-3 space-y-2">
              {filteredNotifications.map((notification) =>
            <div
              key={notification.id}
              className={`p-3 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
              notification.read ?
              'bg-card border-border opacity-60 hover:opacity-100' :
              'bg-card border-l-4 ' + (
              notification.priority === 'urgent' ? 'border-l-red-500 shadow-sm' :
              notification.priority === 'high' ? 'border-l-orange-500 shadow-sm' :
              notification.priority === 'medium' ? 'border-l-yellow-500' :
              'border-l-blue-500')}`

              }
              onClick={() => markAsRead(notification.id)}>
              
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold">{notification.title}</h4>
                        {!notification.read &&
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                    }
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          <span>{getTimeAgo(notification.timestamp)}</span>
                          {notification.priority === 'urgent' &&
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                              High
                            </span>
                      }
                        </div>
                        
                        <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                      aria-label="Delete notification">
                      
                          <X size={14} />
                        </button>
                      </div>

                      {notification.actionable &&
                  <button className="mt-2 text-xs text-primary hover:underline font-medium flex items-center gap-1">
                          View Details →
                        </button>
                  }
                    </div>
                  </div>
                </div>
            )}
            </div>
          }
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-card">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-1 text-primary hover:underline font-medium">
              
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearConfirm}
        title="Clear all notifications?"
        message="This will permanently remove all notifications from your list. This action cannot be undone."
        confirmText="Clear all"
        cancelText="Cancel" />
      
    </>);

}

// Badge component for notification count
export function NotificationBadge({ count }) {
  if (count === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>);

}