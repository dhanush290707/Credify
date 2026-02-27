import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { Captcha } from './captcha';







export function Login({ onSwitchToSignup, onShowTerms, onShowPrivacy } = {}) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isCaptchaValid) {
      toast.error('Please complete the security check (CAPTCHA)');
      return;
    }

    const success = login(email, password, role);

    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Invalid credentials. Please check your email and role.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="text-primary-foreground" size={28} />
            </div>
            <h1 className="text-2xl">Credify</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required />

            </div>

            <div>
              <label className="block text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required />

            </div>

            <div>
              <label className="block text-sm mb-2">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">

                <option value="admin">Admin</option>
                <option value="lender">Lender</option>
                <option value="borrower">Borrower</option>
                <option value="analyst">Financial Analyst</option>
              </select>
            </div>

            {/* CAPTCHA Component */}
            <Captcha onValidate={setIsCaptchaValid} />

            <button
              type="submit"
              className={`w-full py-3 rounded-lg transition-colors ${isCaptchaValid ?
                  'bg-primary text-primary-foreground hover:bg-primary/90' :
                  'bg-gray-300 text-gray-500 cursor-not-allowed'}`
              }
              disabled={!isCaptchaValid}>

              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <a href="#" className="text-primary hover:underline" onClick={onSwitchToSignup}>Sign up</a>
          </p>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
            <button onClick={onShowTerms} className="hover:text-primary hover:underline">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={onShowPrivacy} className="hover:text-primary hover:underline">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-12">
        <div className="max-w-lg">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1592698765727-387c9464cd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNlJTIwZGlnaXRhbCUyMGJhbmtpbmclMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzcxNDkwMjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Finance illustration"
            className="w-full h-auto rounded-2xl shadow-2xl" />

          <div className="mt-8 text-center">
            <h3 className="text-2xl mb-3">Modern Loan Management</h3>
            <p className="text-muted-foreground">
              Streamline your lending operations with our comprehensive platform
            </p>
          </div>
        </div>
      </div>
    </div>);

}