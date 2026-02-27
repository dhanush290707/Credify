import { CreditCard, ArrowLeft } from 'lucide-react';





export function TermsOfService({ onBack }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="text-primary-foreground" size={24} />
              </div>
              <h1 className="text-xl font-semibold">Credify</h1>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl mb-2">Terms of Service</h2>
          <p className="text-muted-foreground">Last updated: February 26, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          {/* Section 1 */}
          <section>
            <h3 className="text-xl mb-3">1. Acceptance of Terms</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              By accessing and using Credify ("the Platform"), you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service ("Terms") govern your use of our loan management platform and services. 
              Please read them carefully before using our services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-xl mb-3">2. Description of Service</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Credify provides a comprehensive loan management platform that facilitates connections between lenders 
              and borrowers. Our services include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Loan application and processing</li>
              <li>Payment tracking and management</li>
              <li>Financial analytics and reporting</li>
              <li>Risk assessment and analysis</li>
              <li>User account management</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="text-xl mb-3">3. User Accounts and Registration</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              To access certain features of the Platform, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="text-xl mb-3">4. User Roles and Responsibilities</h3>
            
            <h4 className="font-semibold mb-2 mt-4">4.1 Borrowers</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              As a borrower, you agree to provide accurate financial information, make timely payments according to 
              agreed terms, and communicate any financial difficulties promptly.
            </p>

            <h4 className="font-semibold mb-2 mt-4">4.2 Lenders</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              As a lender, you agree to comply with all applicable lending laws and regulations, provide clear loan 
              terms, and maintain professional communication with borrowers.
            </p>

            <h4 className="font-semibold mb-2 mt-4">4.3 Admins and Analysts</h4>
            <p className="text-muted-foreground leading-relaxed">
              Platform administrators and financial analysts agree to maintain confidentiality of user data and use 
              their access privileges responsibly.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="text-xl mb-3">5. Financial Transactions</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              All loan agreements facilitated through Credify are binding contracts between lenders and borrowers. 
              Credify acts as a platform facilitator and is not a party to these agreements.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Users are responsible for understanding and agreeing to all terms of their loan agreements, including 
              interest rates, repayment schedules, and any applicable fees.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h3 className="text-xl mb-3">6. Platform Fees</h3>
            <p className="text-muted-foreground leading-relaxed">
              Credify may charge fees for certain services. All applicable fees will be clearly disclosed before you 
              incur them. We reserve the right to modify our fee structure with 30 days' notice to users.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h3 className="text-xl mb-3">7. Prohibited Activities</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Use the Platform for any illegal or fraudulent activities</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to gain unauthorized access to the Platform or user accounts</li>
              <li>Interfere with the proper functioning of the Platform</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use automated systems to access the Platform without permission</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h3 className="text-xl mb-3">8. Intellectual Property</h3>
            <p className="text-muted-foreground leading-relaxed">
              All content, features, and functionality of Credify, including but not limited to text, graphics, logos, 
              and software, are owned by Credify and protected by international copyright, trademark, and other 
              intellectual property laws.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h3 className="text-xl mb-3">9. Limitation of Liability</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Credify provides the Platform "as is" without warranties of any kind. We are not liable for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Any defaults or breaches by borrowers or lenders</li>
              <li>Investment losses or financial damages</li>
              <li>Interruptions or errors in service</li>
              <li>Loss of data or unauthorized access to your account</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section>
            <h3 className="text-xl mb-3">10. Termination</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms. 
              You may also terminate your account by contacting our support team. Termination does not affect existing 
              loan obligations.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h3 className="text-xl mb-3">11. Modifications to Terms</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may modify these Terms at any time. We will notify users of significant changes via email or platform 
              notification. Continued use of the Platform after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h3 className="text-xl mb-3">12. Governing Law</h3>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
              Credify operates, without regard to its conflict of law provisions.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h3 className="text-xl mb-3">13. Contact Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-2">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-muted-foreground">Email: support@credify.com</p>
              <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
              <p className="text-muted-foreground">Address: 123 Finance Street, Suite 100, New York, NY 10001</p>
            </div>
          </section>
        </div>
      </div>
    </div>);

}