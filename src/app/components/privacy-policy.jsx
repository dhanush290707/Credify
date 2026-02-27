import { CreditCard, ArrowLeft } from 'lucide-react';





export function PrivacyPolicy({ onBack }) {
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
          <h2 className="text-3xl mb-2">Privacy Policy</h2>
          <p className="text-muted-foreground">Last updated: February 26, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          {/* Section 1 */}
          <section>
            <h3 className="text-xl mb-3">1. Introduction</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              At Credify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you use our loan management platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the platform.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-xl mb-3">2. Information We Collect</h3>
            
            <h4 className="font-semibold mb-2 mt-4">2.1 Personal Information</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Name, email address, and contact information</li>
              <li>Financial information (income, credit history, employment details)</li>
              <li>Government-issued identification documents</li>
              <li>Bank account and payment information</li>
              <li>Loan application and transaction history</li>
            </ul>

            <h4 className="font-semibold mb-2 mt-4">2.2 Automatically Collected Information</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you access our platform, we automatically collect:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Usage data (pages viewed, time spent, click patterns)</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Location information (with your permission)</li>
            </ul>

            <h4 className="font-semibold mb-2 mt-4">2.3 Third-Party Information</h4>
            <p className="text-muted-foreground leading-relaxed">
              We may obtain information from third parties such as credit bureaus, identity verification services, 
              and financial institutions to verify your identity and assess creditworthiness.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="text-xl mb-3">3. How We Use Your Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>To create and manage your account</li>
              <li>To process loan applications and transactions</li>
              <li>To assess creditworthiness and manage risk</li>
              <li>To communicate with you about your account and services</li>
              <li>To comply with legal and regulatory requirements</li>
              <li>To improve our services and develop new features</li>
              <li>To prevent fraud and ensure platform security</li>
              <li>To send marketing communications (with your consent)</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="text-xl mb-3">4. How We Share Your Information</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may share your information in the following circumstances:
            </p>

            <h4 className="font-semibold mb-2 mt-4">4.1 With Lenders and Borrowers</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We share necessary information between lenders and borrowers to facilitate loan agreements and 
              ongoing loan management.
            </p>

            <h4 className="font-semibold mb-2 mt-4">4.2 With Service Providers</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We work with third-party service providers who perform services on our behalf, such as:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Payment processors</li>
              <li>Identity verification services</li>
              <li>Credit reporting agencies</li>
              <li>Cloud hosting providers</li>
              <li>Analytics and marketing services</li>
            </ul>

            <h4 className="font-semibold mb-2 mt-4">4.3 For Legal Compliance</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may disclose your information when required by law, legal process, or government request, or to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Comply with legal obligations</li>
              <li>Protect our rights and property</li>
              <li>Prevent fraud or illegal activities</li>
              <li>Protect the safety of our users or the public</li>
            </ul>

            <h4 className="font-semibold mb-2 mt-4">4.4 Business Transfers</h4>
            <p className="text-muted-foreground leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred to the 
              acquiring entity.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="text-xl mb-3">5. Data Security</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We implement appropriate technical and organizational security measures to protect your information, 
              including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and assessments</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your 
              information, we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h3 className="text-xl mb-3">6. Data Retention</h3>
            <p className="text-muted-foreground leading-relaxed">
              We retain your information for as long as necessary to provide our services, comply with legal 
              obligations, resolve disputes, and enforce our agreements. Loan-related information may be retained 
              for extended periods as required by financial regulations.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h3 className="text-xl mb-3">7. Your Privacy Rights</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to certain processing of your information</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, please contact us at privacy@credify.com.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h3 className="text-xl mb-3">8. Cookies and Tracking Technologies</h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground leading-relaxed space-y-2 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services and user experience</li>
              <li>Deliver relevant advertising</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              You can control cookies through your browser settings, but disabling cookies may affect platform 
              functionality.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h3 className="text-xl mb-3">9. Third-Party Links</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our platform may contain links to third-party websites. We are not responsible for the privacy 
              practices of these websites. We encourage you to review their privacy policies.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h3 className="text-xl mb-3">10. Children's Privacy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h3 className="text-xl mb-3">11. International Data Transfers</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure 
              appropriate safeguards are in place to protect your information in accordance with this privacy policy.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h3 className="text-xl mb-3">12. Updates to This Policy</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of significant changes via 
              email or platform notification. The "Last updated" date at the top indicates when the policy was last 
              revised.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h3 className="text-xl mb-3">13. California Privacy Rights (CCPA)</h3>
            <p className="text-muted-foreground leading-relaxed">
              California residents have additional rights under the California Consumer Privacy Act (CCPA), including 
              the right to know what personal information is collected, the right to delete personal information, and 
              the right to opt-out of the sale of personal information. Credify does not sell personal information.
            </p>
          </section>

          {/* Section 14 */}
          <section>
            <h3 className="text-xl mb-3">14. European Privacy Rights (GDPR)</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you are located in the European Economic Area (EEA), you have rights under the General Data 
              Protection Regulation (GDPR), including the right to access, rectify, erase, and restrict processing 
              of your personal data.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h3 className="text-xl mb-3">15. Contact Us</h3>
            <p className="text-muted-foreground leading-relaxed mb-2">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-secondary p-4 rounded-lg">
              <p className="text-muted-foreground font-semibold mb-2">Privacy Team</p>
              <p className="text-muted-foreground">Email: privacy@credify.com</p>
              <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
              <p className="text-muted-foreground">Address: 123 Finance Street, Suite 100, New York, NY 10001</p>
            </div>
          </section>
        </div>
      </div>
    </div>);

}