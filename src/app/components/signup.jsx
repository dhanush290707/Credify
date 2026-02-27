import { useState } from 'react';
import { CreditCard, Eye, EyeOff, Check, X } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Captcha } from './captcha';
import { toast } from 'sonner';
import { useApp } from '../context/AppContext';








export function Signup({ onSwitchToLogin, onSignupSuccess, onShowTerms, onShowPrivacy }) {
  const { signup } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'borrower',
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [touched, setTouched] = useState({});

  // Password validation
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
  };

  const isPasswordValid = Object.values(passwordValidation).every((v) => v);
  const doPasswordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      agreeToTerms: true
    });

    // Validate all fields
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (!doPasswordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (!isCaptchaValid) {
      toast.error('Please complete the security check (CAPTCHA)');
      return;
    }

    // Use context signup (adds to state + auto-logs in)
    const success = signup(formData.fullName, formData.email, formData.password, formData.role);
    if (success) {
      toast.success('Account created successfully!');
    } else {
      toast.error('An account with this email already exists');
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="text-primary-foreground" size={28} />
            </div>
            <h1 className="text-2xl">Credify</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl mb-2">Create your account</h2>
            <p className="text-muted-foreground">Join Credify to manage your loans efficiently</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                onBlur={() => handleBlur('fullName')}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 bg-input-background border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${touched.fullName && !formData.fullName.trim() ?
                  'border-red-500 focus:ring-red-500' :
                  'border-border focus:ring-primary'}`
                } />

              {touched.fullName && !formData.fullName.trim() &&
                <p className="text-xs text-red-600 mt-1">Full name is required</p>
              }
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-input-background border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${touched.email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) || !formData.email) ?
                  'border-red-500 focus:ring-red-500' :
                  'border-border focus:ring-primary'}`
                } />

              {touched.email && !formData.email &&
                <p className="text-xs text-red-600 mt-1">Email is required</p>
              }
              {touched.email && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
                <p className="text-xs text-red-600 mt-1">Please enter a valid email</p>
              }
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => handleBlur('password')}
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-3 pr-12 bg-input-background border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${touched.password && !isPasswordValid ?
                    'border-red-500 focus:ring-red-500' :
                    'border-border focus:ring-primary'}`
                  } />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded transition-colors">

                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password &&
                <div className="mt-2 p-3 bg-secondary rounded-lg space-y-1">
                  <p className="text-xs font-medium mb-2">Password must contain:</p>
                  <div className="space-y-1">
                    <PasswordRequirement met={passwordValidation.minLength} text="At least 8 characters" />
                    <PasswordRequirement met={passwordValidation.hasUpperCase} text="One uppercase letter" />
                    <PasswordRequirement met={passwordValidation.hasLowerCase} text="One lowercase letter" />
                    <PasswordRequirement met={passwordValidation.hasNumber} text="One number" />
                    <PasswordRequirement met={passwordValidation.hasSpecial} text="One special character" />
                  </div>
                </div>
              }
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 pr-12 bg-input-background border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${touched.confirmPassword && !doPasswordsMatch && formData.confirmPassword ?
                    'border-red-500 focus:ring-red-500' :
                    touched.confirmPassword && doPasswordsMatch ?
                      'border-green-500 focus:ring-green-500' :
                      'border-border focus:ring-primary'}`
                  } />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded transition-colors">

                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.confirmPassword && formData.confirmPassword && !doPasswordsMatch &&
                <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
              }
              {doPasswordsMatch &&
                <p className="text-xs text-green-600 mt-1">✓ Passwords match</p>
              }
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm mb-2">I want to join as</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-input-background border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">

                <option value="borrower">Borrower - Apply for loans</option>
                <option value="lender">Lender - Provide funding</option>
                <option value="analyst">Financial Analyst - Analyze data</option>
                <option value="admin">Admin - Manage platform</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                {formData.role === 'borrower' && 'Apply for loans and manage your borrowing'}
                {formData.role === 'lender' && 'Provide funding and manage your portfolio'}
                {formData.role === 'analyst' && 'Access analytics and risk assessment tools'}
                {formData.role === 'admin' && 'Full platform access and management'}
              </p>
            </div>

            {/* CAPTCHA */}
            <Captcha onValidate={setIsCaptchaValid} />

            {/* Terms and Conditions */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  onBlur={() => handleBlur('agreeToTerms')}
                  className={`mt-1 w-4 h-4 rounded border-2 ${touched.agreeToTerms && !formData.agreeToTerms ?
                    'border-red-500' :
                    'border-border'}`
                  } />

                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline" onClick={onShowTerms}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline" onClick={onShowPrivacy}>Privacy Policy</a>
                </span>
              </label>
              {touched.agreeToTerms && !formData.agreeToTerms &&
                <p className="text-xs text-red-600 mt-1">You must accept the terms and conditions</p>
              }
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg transition-colors font-medium ${isCaptchaValid && isPasswordValid && doPasswordsMatch && formData.agreeToTerms && formData.fullName && formData.email ?
                'bg-primary text-primary-foreground hover:bg-primary/90' :
                'bg-gray-300 text-gray-500 cursor-not-allowed'}`
              }
              disabled={!isCaptchaValid || !isPasswordValid || !doPasswordsMatch || !formData.agreeToTerms || !formData.fullName || !formData.email}>

              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button onClick={onSwitchToLogin} className="text-primary hover:underline font-medium">
              Sign in
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-12">
        <div className="max-w-lg">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya2luZyUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzcxNDk5MDczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Team collaboration"
            className="w-full h-auto rounded-2xl shadow-2xl" />

          <div className="mt-8 text-center">
            <h3 className="text-2xl mb-3">Join Our Community</h3>
            <p className="text-muted-foreground">
              Thousands of users trust Credify for their lending and borrowing needs
            </p>

            {/* Trust Indicators */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/60 backdrop-blur rounded-lg">
                <p className="text-2xl font-bold text-primary">10K+</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur rounded-lg">
                <p className="text-2xl font-bold text-primary">$50M+</p>
                <p className="text-xs text-muted-foreground">Loans Funded</p>
              </div>
              <div className="p-4 bg-white/60 backdrop-blur rounded-lg">
                <p className="text-2xl font-bold text-primary">99.9%</p>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}

// Helper component for password requirements
function PasswordRequirement({ met, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-green-500' : 'bg-gray-300'}`
      }>
        {met ? <Check size={12} className="text-white" /> : <X size={12} className="text-gray-500" />}
      </div>
      <span className={`text-xs ${met ? 'text-green-600' : 'text-muted-foreground'}`}>
        {text}
      </span>
    </div>);

}