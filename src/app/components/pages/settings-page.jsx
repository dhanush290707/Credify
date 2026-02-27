import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Card } from '../card';
import {
  Settings, User, Bell, Shield, DollarSign,
  Database, Save, RefreshCw, Trash2 } from
'lucide-react';
import { toast } from 'sonner';





































export function SettingsPage() {
  const { currentUser, updateUser } = useApp();
  const [activeTab, setActiveTab] = useState('general');

  // Platform Settings
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'Credify',
    platformEmail: 'support@credify.com',
    platformPhone: '+1 (555) 123-4567',
    currency: 'USD',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    maxLoanAmount: 500000,
    minLoanAmount: 1000,
    maxInterestRate: 30,
    minInterestRate: 3,
    maxLoanDuration: 360,
    minLoanDuration: 6,
    autoApprovalThreshold: 750,
    latePaymentFee: 50,
    processingFee: 2.5
  });

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    department: 'Administration',
    location: 'New York, USA'
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    loanApprovalNotif: true,
    paymentReminderNotif: true,
    paymentConfirmationNotif: true,
    systemUpdatesNotif: true,
    marketingNotif: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    ipWhitelist: ''
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedPlatformSettings = localStorage.getItem('loanflow_platform_settings');
    const savedNotificationSettings = localStorage.getItem('loanflow_notification_settings');
    const savedSecuritySettings = localStorage.getItem('loanflow_security_settings');

    if (savedPlatformSettings) setPlatformSettings(JSON.parse(savedPlatformSettings));
    if (savedNotificationSettings) setNotificationSettings(JSON.parse(savedNotificationSettings));
    if (savedSecuritySettings) setSecuritySettings(JSON.parse(savedSecuritySettings));
  }, []);

  // Save handlers
  const savePlatformSettings = () => {
    localStorage.setItem('loanflow_platform_settings', JSON.stringify(platformSettings));
    toast.success('Platform settings saved successfully!');
  };

  const saveProfileSettings = () => {
    if (currentUser) {
      updateUser(currentUser.id, {
        name: profileData.name,
        email: profileData.email
      });
      toast.success('Profile updated successfully!');
    }
  };

  const saveNotificationSettings = () => {
    localStorage.setItem('loanflow_notification_settings', JSON.stringify(notificationSettings));
    toast.success('Notification preferences saved!');
  };

  const saveSecuritySettings = () => {
    localStorage.setItem('loanflow_security_settings', JSON.stringify(securitySettings));
    toast.success('Security settings updated!');
  };

  const clearCache = () => {
    if (confirm('Are you sure you want to clear the application cache?')) {
      // Clear specific cache items, not user data
      sessionStorage.clear();
      toast.success('Cache cleared successfully!');
    }
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      localStorage.removeItem('loanflow_platform_settings');
      localStorage.removeItem('loanflow_notification_settings');
      localStorage.removeItem('loanflow_security_settings');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = {
      platformSettings,
      notificationSettings,
      securitySettings,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `loanflow_settings_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast.success('Settings exported successfully!');
  };

  const tabs = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'data', label: 'Data', icon: Database }];


  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage platform configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
          activeTab === tab.id ?
          'bg-primary text-primary-foreground' :
          'bg-secondary hover:bg-secondary/80'}`
          }>
          
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        )}
      </div>

      {/* General Settings */}
      {activeTab === 'general' &&
      <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">General Settings</h2>
            <button
            onClick={savePlatformSettings}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            
              <Save size={18} />
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Platform Name</label>
              <input
              type="text"
              value={platformSettings.platformName}
              onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Support Email</label>
              <input
              type="email"
              value={platformSettings.platformEmail}
              onChange={(e) => setPlatformSettings({ ...platformSettings, platformEmail: e.target.value })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Support Phone</label>
              <input
              type="tel"
              value={platformSettings.platformPhone}
              onChange={(e) => setPlatformSettings({ ...platformSettings, platformPhone: e.target.value })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Currency</label>
              <select
              value={platformSettings.currency}
              onChange={(e) => setPlatformSettings({ ...platformSettings, currency: e.target.value })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="INR">INR - Indian Rupee</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Timezone</label>
              <select
              value={platformSettings.timezone}
              onChange={(e) => setPlatformSettings({ ...platformSettings, timezone: e.target.value })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Date Format</label>
              <select
              value={platformSettings.dateFormat}
              onChange={(e) => setPlatformSettings({ ...platformSettings, dateFormat: e.target.value })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg">
              
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </Card>
      }

      {/* Profile Settings */}
      {activeTab === 'profile' &&
      <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Profile Settings</h2>
            <button
            onClick={saveProfileSettings}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            
              <Save size={18} />
              Save Changes
            </button>
          </div>

          <div className="max-w-2xl">
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-border">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl">
                {currentUser?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg mb-1">{currentUser?.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{currentUser?.role}</p>
                <button className="text-sm text-primary hover:underline mt-2">Change Avatar</button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>

              <div>
                <label className="block text-sm mb-2">Email Address</label>
                <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>

              <div>
                <label className="block text-sm mb-2">Phone Number</label>
                <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>

              <div>
                <label className="block text-sm mb-2">Department</label>
                <input
                type="text"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>

              <div>
                <label className="block text-sm mb-2">Location</label>
                <input
                type="text"
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-lg mb-4">Change Password</h3>
              <div className="space-y-4">
                <input
                type="password"
                placeholder="Current Password"
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
                <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
                <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
              
                <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* Notification Settings */}
      {activeTab === 'notifications' &&
      <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Notification Preferences</h2>
            <button
            onClick={saveNotificationSettings}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            
              <Save size={18} />
              Save Changes
            </button>
          </div>

          <div className="max-w-2xl space-y-6">
            <div className="pb-6 border-b border-border">
              <h3 className="text-lg mb-4">Notification Channels</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  className="w-5 h-5" />
                
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={notificationSettings.smsNotifications}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                  className="w-5 h-5" />
                
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg mb-4">Event Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Loan Approvals</p>
                    <p className="text-sm text-muted-foreground">Get notified when loans are approved/rejected</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={notificationSettings.loanApprovalNotif}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, loanApprovalNotif: e.target.checked })}
                  className="w-5 h-5" />
                
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Reminders</p>
                    <p className="text-sm text-muted-foreground">Reminders for upcoming payments</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={notificationSettings.paymentReminderNotif}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentReminderNotif: e.target.checked })}
                  className="w-5 h-5" />
                
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payment Confirmations</p>
                    <p className="text-sm text-muted-foreground">Confirmations when payments are received</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={notificationSettings.paymentConfirmationNotif}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, paymentConfirmationNotif: e.target.checked })}
                  className="w-5 h-5" />
                
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-muted-foreground">Important platform updates and maintenance</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={notificationSettings.systemUpdatesNotif}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, systemUpdatesNotif: e.target.checked })}
                  className="w-5 h-5" />
                
                </label>

                <label className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing & Promotions</p>
                    <p className="text-sm text-muted-foreground">News, tips, and promotional offers</p>
                  </div>
                  <input
                  type="checkbox"
                  checked={notificationSettings.marketingNotif}
                  onChange={(e) => setNotificationSettings({ ...notificationSettings, marketingNotif: e.target.checked })}
                  className="w-5 h-5" />
                
                </label>
              </div>
            </div>
          </div>
        </Card>
      }

      {/* Security Settings */}
      {activeTab === 'security' &&
      <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Security Settings</h2>
            <button
            onClick={saveSecuritySettings}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            
              <Save size={18} />
              Save Changes
            </button>
          </div>

          <div className="max-w-2xl space-y-6">
            <div className="pb-6 border-b border-border">
              <label className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                className="w-5 h-5" />
              
              </label>
              {securitySettings.twoFactorAuth &&
            <button className="text-sm bg-secondary px-4 py-2 rounded-lg hover:bg-secondary/80">
                  Configure 2FA
                </button>
            }
            </div>

            <div>
              <label className="block text-sm mb-2">Session Timeout (minutes)</label>
              <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: Number(e.target.value) })}
              min="5"
              max="120"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
              <p className="text-xs text-muted-foreground mt-1">Auto-logout after inactivity</p>
            </div>

            <div>
              <label className="block text-sm mb-2">Password Expiry (days)</label>
              <input
              type="number"
              value={securitySettings.passwordExpiry}
              onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: Number(e.target.value) })}
              min="0"
              max="365"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
              <p className="text-xs text-muted-foreground mt-1">0 = never expires</p>
            </div>

            <div>
              <label className="block text-sm mb-2">Max Login Attempts</label>
              <input
              type="number"
              value={securitySettings.loginAttempts}
              onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: Number(e.target.value) })}
              min="3"
              max="10"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
              <p className="text-xs text-muted-foreground mt-1">Account locked after failed attempts</p>
            </div>

            <div>
              <label className="block text-sm mb-2">IP Whitelist</label>
              <textarea
              value={securitySettings.ipWhitelist}
              onChange={(e) => setSecuritySettings({ ...securitySettings, ipWhitelist: e.target.value })}
              placeholder="Enter IP addresses (one per line)"
              rows={4}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
              <p className="text-xs text-muted-foreground mt-1">Leave empty to allow all IPs</p>
            </div>
          </div>
        </Card>
      }

      {/* Financial Settings */}
      {activeTab === 'financial' &&
      <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Financial Configuration</h2>
            <button
            onClick={savePlatformSettings}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            
              <Save size={18} />
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Minimum Loan Amount ($)</label>
              <input
              type="number"
              value={platformSettings.minLoanAmount}
              onChange={(e) => setPlatformSettings({ ...platformSettings, minLoanAmount: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Maximum Loan Amount ($)</label>
              <input
              type="number"
              value={platformSettings.maxLoanAmount}
              onChange={(e) => setPlatformSettings({ ...platformSettings, maxLoanAmount: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Minimum Interest Rate (%)</label>
              <input
              type="number"
              step="0.1"
              value={platformSettings.minInterestRate}
              onChange={(e) => setPlatformSettings({ ...platformSettings, minInterestRate: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Maximum Interest Rate (%)</label>
              <input
              type="number"
              step="0.1"
              value={platformSettings.maxInterestRate}
              onChange={(e) => setPlatformSettings({ ...platformSettings, maxInterestRate: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Minimum Loan Duration (months)</label>
              <input
              type="number"
              value={platformSettings.minLoanDuration}
              onChange={(e) => setPlatformSettings({ ...platformSettings, minLoanDuration: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Maximum Loan Duration (months)</label>
              <input
              type="number"
              value={platformSettings.maxLoanDuration}
              onChange={(e) => setPlatformSettings({ ...platformSettings, maxLoanDuration: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Auto-Approval Credit Score Threshold</label>
              <input
              type="number"
              value={platformSettings.autoApprovalThreshold}
              onChange={(e) => setPlatformSettings({ ...platformSettings, autoApprovalThreshold: Number(e.target.value) })}
              min="300"
              max="850"
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Late Payment Fee ($)</label>
              <input
              type="number"
              value={platformSettings.latePaymentFee}
              onChange={(e) => setPlatformSettings({ ...platformSettings, latePaymentFee: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>

            <div>
              <label className="block text-sm mb-2">Processing Fee (%)</label>
              <input
              type="number"
              step="0.1"
              value={platformSettings.processingFee}
              onChange={(e) => setPlatformSettings({ ...platformSettings, processingFee: Number(e.target.value) })}
              className="w-full px-4 py-2 bg-input-background border border-border rounded-lg" />
            
            </div>
          </div>
        </Card>
      }

      {/* Data Management */}
      {activeTab === 'data' &&
      <Card className="p-6">
          <h2 className="text-xl mb-6">Data Management</h2>

          <div className="space-y-6 max-w-2xl">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Database className="text-blue-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Export Settings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download all your platform settings and configurations
                  </p>
                  <button
                  onClick={exportData}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                  
                    <Download size={18} />
                    Export Data
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <RefreshCw className="text-yellow-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Clear Cache</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clear temporary data and improve performance
                  </p>
                  <button
                  onClick={clearCache}
                  className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
                  
                    <RefreshCw size={18} />
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Trash2 className="text-red-600 mt-1" size={20} />
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Reset Settings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Reset all settings to default values. This action cannot be undone.
                  </p>
                  <button
                  onClick={resetSettings}
                  className="flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90">
                  
                    <Trash2 size={18} />
                    Reset All Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      }
    </div>);

}