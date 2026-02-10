import { Link } from 'react-router-dom'
import { FiFileText, FiCheck } from 'react-icons/fi'
import './Terms.css'

const Terms = () => {
  const lastUpdated = 'February 10, 2026'

  return (
    <div className="terms-page">
      <div className="container">
        {/* Hero Section */}
        <div className="terms-hero">
          <div className="terms-icon-wrapper">
            <FiFileText className="terms-hero-icon" />
          </div>
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="terms-content">
          {/* Section 1 */}
          <section className="terms-section">
            <h2><span className="section-number">1.</span> Introduction</h2>
            <p>
              Welcome to <strong>Nothing Else Solutions</strong>, operated by Robert Gleim ("we," "our," "us").
              These Terms of Service ("Terms") govern your access to and use of our website development, 
              automation, and AI integration services (collectively, the "Services").
            </p>
            <div className="highlight-box">
              <FiCheck className="highlight-icon" />
              <p>By using our Services, you agree to these Terms. If you do not agree, please refrain from using them.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="terms-section">
            <h2><span className="section-number">2.</span> Services Overview</h2>
            <p>We provide:</p>
            <ul>
              <li><strong>Custom Website Development</strong> using technologies like React, Python, Flask, and SQL.</li>
              <li><strong>Automation Design</strong> using n8n for AI and workflow integration.</li>
              <li><strong>API Development & Integration</strong> for business systems and SaaS platforms.</li>
              <li><strong>Secure Payment Integration</strong> through Stripe.</li>
              <li><strong>Deployment & Hosting Assistance</strong> via Hostinger, Vercel, or Render.</li>
            </ul>
            <p>All projects are customized to each client's specifications and delivered under mutually agreed timelines.</p>
          </section>

          {/* Section 3 */}
          <section className="terms-section">
            <h2><span className="section-number">3.</span> Use of Services</h2>
            <p>By engaging with our Services, you agree to:</p>
            <ul>
              <li>Provide accurate and complete project or account information.</li>
              <li>Use the Services only for lawful purposes.</li>
              <li>Not engage in activities that may harm or interfere with system operations or security.</li>
              <li>Respect intellectual property rights and confidentiality.</li>
            </ul>
            <p className="disclaimer">
              We reserve the right to discontinue services or deny projects that violate legal, ethical, or platform policies.
            </p>
          </section>

          {/* Section 4 */}
          <section className="terms-section">
            <h2><span className="section-number">4.</span> Payment and Billing</h2>
            
            <h3>Payments</h3>
            <p>
              All payments are securely processed through Stripe. We never directly handle your financial data. 
              Payment terms and pricing are outlined in the service agreement prior to project start.
            </p>

            <h3>Invoices</h3>
            <p>
              Invoices are sent electronically and must be paid according to the due date listed. 
              Late payments may result in project delays or suspension.
            </p>

            <h3>Refund Policy</h3>
            <p>Due to the custom nature of the work:</p>
            <ul>
              <li>Deposits are non-refundable once design or development has begun.</li>
              <li>Full or partial refunds are considered only in cases where deliverables have not been initiated.</li>
              <li>Any approved refunds are processed back through Stripe within 5–10 business days.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="terms-section">
            <h2><span className="section-number">5.</span> Project Timelines and Responsibilities</h2>
            <p>Each project begins with a defined scope, schedule, and deliverable list.</p>
            <div className="responsibilities-grid">
              <div className="responsibility-card">
                <h4>Client Responsibilities</h4>
                <p>Provide timely input, content, and approvals.</p>
              </div>
              <div className="responsibility-card">
                <h4>Developer Responsibilities</h4>
                <p>Deliver work as agreed and maintain open communication throughout development.</p>
              </div>
            </div>
            <p className="note">
              Delays in feedback or content submission may extend project completion.
            </p>
          </section>

          {/* Section 6 */}
          <section className="terms-section">
            <h2><span className="section-number">6.</span> Hosting and Deployment</h2>
            <p>
              While Hostinger is a recommended hosting provider, deployment can also occur via other compatible 
              environments such as Vercel, Render, or custom VPS setups.
            </p>
            <p>We assist with:</p>
            <ul>
              <li>DNS configuration</li>
              <li>Domain linking</li>
              <li>SSL setup</li>
              <li>Post-launch monitoring</li>
            </ul>
            <div className="highlight-box success">
              <p><strong>Clients retain full ownership and access to their hosting accounts after project handoff.</strong></p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="terms-section">
            <h2><span className="section-number">7.</span> Intellectual Property</h2>
            <p>
              All code, designs, and deliverables produced remain the intellectual property of Robert Gleim 
              until full payment for the project has been received.
            </p>
            <p>Once payment is complete:</p>
            <ul>
              <li>Full ownership is transferred to the client.</li>
              <li>I may retain non-sensitive or anonymous components of the project for portfolio or educational purposes unless otherwise agreed in writing.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="terms-section">
            <h2><span className="section-number">8.</span> Confidentiality</h2>
            <p>
              All client data, credentials, and project details are treated as confidential.
              This includes source code, workflow logic, API keys, and proprietary ideas. 
              Confidentiality obligations remain in place even after project completion.
            </p>
          </section>

          {/* Section 9 */}
          <section className="terms-section">
            <h2><span className="section-number">9.</span> Warranties and Limitations</h2>
            <p>We strive for quality and reliability; however:</p>
            <ul>
              <li>The Services are provided "as is" without warranties of uninterrupted functionality.</li>
              <li>We are not liable for delays, data loss, or third-party service outages (including Stripe or Hostinger).</li>
              <li>Maintenance, updates, and future changes outside original scope may incur additional costs.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="terms-section">
            <h2><span className="section-number">10.</span> Modifications and Updates</h2>
            <p>
              We reserve the right to modify these Terms at any time. Updates will be posted on this page 
              with the revised effective date. Continued use of the Services after changes implies acceptance of the new Terms.
            </p>
          </section>

          {/* Section 11 */}
          <section className="terms-section">
            <h2><span className="section-number">11.</span> Termination</h2>
            <p>Either party may terminate project agreements with written notice.</p>
            <p>Upon termination:</p>
            <ul>
              <li>Clients are responsible for payment of work already completed.</li>
              <li>Source files or deliverables may not be provided until the balance is settled.</li>
            </ul>
          </section>

          {/* Section 12 - Contact */}
          <section className="terms-section contact-section">
            <h2><span className="section-number">12.</span> Contact Information</h2>
            <p>
              If you have questions about these Terms of Service, please reach out through our contact page.
            </p>
            {/* <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
            </div> */}
          </section>

          {/* Related Links */}
          <div className="terms-related">
            <h3>Related Policies</h3>
            <div className="related-links">
              <Link to="/privacy" className="related-link">
                Privacy Policy
              </Link>
              <Link to="/faq" className="related-link">
                FAQ
              </Link>
            </div>
          </div>

          {/* Back to Home */}
          <div className="terms-footer">
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
            <Link to="/contact" className="btn btn-primary">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Terms
