import { CreditCard, ArrowRight, Shield, TrendingUp, Users, Clock, CheckCircle, BarChart3, Lock, Zap, Globe, Award, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';








export function LandingPage({ onShowLogin, onShowSignup, onShowTerms, onShowPrivacy }) {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="text-primary-foreground" size={24} />
              </div>
              <span className="text-xl font-semibold">Credify</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('benefits')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Benefits
              </button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onShowLogin}
                className="text-sm px-4 py-2 hover:bg-secondary rounded-lg transition-colors">

                Sign In
              </button>
              <button
                onClick={onShowSignup}
                className="text-sm px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">

                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-sm text-primary mb-6">
                <Zap size={16} />
                <span>Modern Loan Management Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
                Streamline Your Lending Operations
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Credify is the all-in-one platform that connects lenders and borrowers, simplifies loan management,
                and provides powerful analytics to make smarter financial decisions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={onShowSignup}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group">

                  Start Free Trial
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="px-8 py-4 bg-card border border-border rounded-lg hover:bg-secondary transition-colors">

                  See How It Works
                </button>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <div className="text-3xl mb-1">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div>
                  <div className="text-3xl mb-1">$2.5B+</div>
                  <div className="text-sm text-muted-foreground">Loans Processed</div>
                </div>
                <div className="w-px h-12 bg-border"></div>
                <div>
                  <div className="text-3xl mb-1">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 blur-3xl"></div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBhbmFseXRpY3N8ZW58MXx8fHwxNzQwNTQzNjcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Dashboard preview"
                className="relative rounded-2xl shadow-2xl border border-border" />

            </div>
          </div>
        </div>

        <button
          onClick={() => scrollToSection('features')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">

          <ChevronDown size={32} className="text-muted-foreground" />
        </button>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">Powerful Features for Modern Lending</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage loans efficiently, from application to repayment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="text-xl mb-3">Secure & Compliant</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bank-level security with 256-bit encryption. Fully compliant with financial regulations and data protection laws.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-primary" size={24} />
              </div>
              <h3 className="text-xl mb-3">Advanced Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Real-time insights, performance metrics, and predictive analytics to make data-driven decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-primary" size={24} />
              </div>
              <h3 className="text-xl mb-3">Multi-Role Access</h3>
              <p className="text-muted-foreground leading-relaxed">
                Tailored experiences for admins, lenders, borrowers, and analysts with role-based permissions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-primary" size={24} />
              </div>
              <h3 className="text-xl mb-3">Automated Workflows</h3>
              <p className="text-muted-foreground leading-relaxed">
                Streamline loan processing with automated approvals, payment reminders, and status updates.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="text-primary" size={24} />
              </div>
              <h3 className="text-xl mb-3">Risk Assessment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Proprietary risk scoring algorithms with credit analysis, stress testing, and portfolio monitoring.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card p-8 rounded-xl border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-primary" size={24} />
              </div>
              <h3 className="text-xl mb-3">Global Accessibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access your loan portfolio anywhere, anytime with our cloud-based platform and mobile-responsive design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">How Credify Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple, intuitive process
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl mb-3">Create Account</h3>
                <p className="text-muted-foreground">
                  Sign up and choose your role: Admin, Lender, Borrower, or Analyst
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"></div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl mb-3">Set Up Profile</h3>
                <p className="text-muted-foreground">
                  Complete your profile with business information and verification
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"></div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl mb-3">Start Lending/Borrowing</h3>
                <p className="text-muted-foreground">
                  Create loan offers or submit borrowing requests with ease
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"></div>
            </div>

            {/* Step 4 */}
            <div>
              <div className="bg-card p-8 rounded-xl border border-border text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-xl mb-3">Track & Manage</h3>
                <p className="text-muted-foreground">
                  Monitor payments, analyze performance, and grow your portfolio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
                Why Choose Credify?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of lenders and borrowers who trust Credify for their loan management needs
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">Save Time & Resources</h3>
                    <p className="text-muted-foreground">
                      Automate repetitive tasks and reduce manual processing by up to 80%
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">Reduce Default Risk</h3>
                    <p className="text-muted-foreground">
                      Advanced risk analytics help you make informed lending decisions
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">Improve Cash Flow</h3>
                    <p className="text-muted-foreground">
                      Real-time payment tracking and automated reminders ensure timely payments
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">Scale Your Business</h3>
                    <p className="text-muted-foreground">
                      Handle unlimited loans and users without compromising performance
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg mb-2">24/7 Support</h3>
                    <p className="text-muted-foreground">
                      Our dedicated support team is always here to help you succeed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGdyb3d0aCUyMGFuYWx5dGljc3xlbnwxfHx8fDE3NDA1NDM2NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Benefits illustration"
                className="rounded-2xl shadow-2xl border border-border" />

            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">Trusted by Industry Leaders</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our customers have to say about their experience with Credify
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card p-8 rounded-xl border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) =>
                  <Award key={i} className="text-yellow-500 fill-yellow-500" size={20} />
                )}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "Credify transformed our lending operations. We've reduced processing time by 70% and improved our loan approval rate significantly."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  SM
                </div>
                <div>
                  <div className="font-semibold">Sarah Martinez</div>
                  <div className="text-sm text-muted-foreground">CEO, Capital Partners</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card p-8 rounded-xl border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) =>
                  <Award key={i} className="text-yellow-500 fill-yellow-500" size={20} />
                )}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "The risk analytics feature is a game-changer. We can now make data-driven decisions and our default rate has dropped by 45%."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  JC
                </div>
                <div>
                  <div className="font-semibold">James Chen</div>
                  <div className="text-sm text-muted-foreground">CFO, FinTech Solutions</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card p-8 rounded-xl border border-border">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) =>
                  <Award key={i} className="text-yellow-500 fill-yellow-500" size={20} />
                )}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "As a borrower, Credify made getting a loan so simple. The interface is intuitive and the process was completed in just 2 days!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                  EP
                </div>
                <div>
                  <div className="font-semibold">Emily Parker</div>
                  <div className="text-sm text-muted-foreground">Small Business Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 lg:py-32 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-semibold mb-2">10,000+</div>
              <div className="text-lg opacity-90">Active Users</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-semibold mb-2">$2.5B+</div>
              <div className="text-lg opacity-90">Total Loans Processed</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-semibold mb-2">150+</div>
              <div className="text-lg opacity-90">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-semibold mb-2">99.9%</div>
              <div className="text-lg opacity-90">Platform Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 lg:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers.
            </p>
          </div>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-3">What is Credify?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Credify is a comprehensive loan management platform that connects lenders and borrowers, streamlines loan processing,
                and provides powerful analytics and risk assessment tools. It's designed for modern lending operations of all sizes.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-3">Who can use Credify?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Credify is built for four main user types: Admins (platform administrators), Lenders (individuals or institutions
                offering loans), Borrowers (individuals or businesses seeking loans), and Financial Analysts (professionals analyzing
                loan portfolios and risk).
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-3">Is Credify secure?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes. We use bank-level 256-bit encryption, comply with international financial regulations including GDPR and CCPA,
                and implement multiple layers of security to protect your data. Our platform undergoes regular security audits.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-3">How much does Credify cost?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We offer flexible pricing plans based on your needs, from individual lenders to large financial institutions.
                Contact our sales team for detailed pricing information. We also offer a free trial to get you started.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-3">Can I integrate Credify with my existing systems?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes. Credify offers robust API integrations and supports connections with popular accounting software, payment
                processors, and credit bureaus. Our technical team can help you with custom integrations.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-lg font-semibold mb-3">What kind of support do you offer?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We provide 24/7 customer support via email and chat, comprehensive documentation, video tutorials, and dedicated
                account managers for enterprise clients. Our average response time is under 2 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
            Ready to Transform Your Lending Operations?
          </h2>
          <p className="text-lg opacity-90 mb-8 leading-relaxed">
            Join thousands of lenders and borrowers who are already using Credify to streamline
            their loan management processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onShowSignup}
              className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors font-semibold">

              Start Free Trial
            </button>
            <button
              onClick={onShowLogin}
              className="px-8 py-4 bg-transparent border-2 border-white rounded-lg hover:bg-white/10 transition-colors font-semibold">

              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <CreditCard className="text-primary-foreground" size={24} />
                </div>
                <span className="text-xl font-semibold">Credify</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modern loan management platform for the digital age. Secure, efficient, and scalable.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-foreground transition-colors">How It Works</button></li>
                <li><button className="hover:text-foreground transition-colors">Pricing</button></li>
                <li><button className="hover:text-foreground transition-colors">API</button></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">About Us</button></li>
                <li><button className="hover:text-foreground transition-colors">Careers</button></li>
                <li><button className="hover:text-foreground transition-colors">Blog</button></li>
                <li><button className="hover:text-foreground transition-colors">Contact</button></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><button onClick={onShowPrivacy} className="hover:text-foreground transition-colors">Privacy Policy</button></li>
                <li><button onClick={onShowTerms} className="hover:text-foreground transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-foreground transition-colors">Security</button></li>
                <li><button className="hover:text-foreground transition-colors">Compliance</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 Credify. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Lock size={16} className="inline mr-1" />
                  Security
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Status
                </button>
                <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>);

}