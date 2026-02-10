import { Link } from 'react-router-dom'
import { FiShield, FiLock, FiMail, FiPhone, FiMapPin, FiFileText, FiHelpCircle, FiArrowRight } from 'react-icons/fi'
import './Privacy.css'

const Privacy = () => {
  const lastUpdated = 'February 10, 2026'

  return (
    <div className="privacy-page">
      <div className="container">
        {/* Hero Section */}
        <div className="privacy-hero">
          <div className="privacy-icon-wrapper">
            <FiShield className="privacy-hero-icon" />
          </div>
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="privacy-content">
          {/* Section 1 */}
          <section className="privacy-section">
            <h2><span className="section-number">1.</span> Introduction</h2>
            <p>
              Welcome to <strong>Nothing Else Solutions</strong> ("we," "our," "us").
              We provide custom website development, n8n automation, and SaaS solutions 
              for businesses and individuals across Texas and the U.S.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, and protect personal information 
              under the Texas Data Privacy and Security Act (TDPSA), relevant U.S. federal laws, 
              and industry best practices.
            </p>
            <div className="highlight-box">
              <FiLock className="highlight-icon" />
              <p>By using our website or Services, you consent to this Privacy Policy.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="privacy-section">
            <h2><span className="section-number">2.</span> Information We Collect</h2>
            <p>We collect information to operate effectively, provide services, and comply with legal obligations.</p>
            
            <h3>A. Information You Provide</h3>
            <ul>
              <li><strong>Account & Business Information:</strong> Your name, business name, email, phone number, and login credentials.</li>
              <li><strong>Billing Information:</strong> Processed securely through Stripe; we do not store payment card numbers.</li>
              <li><strong>Project Data:</strong> Information about your website, automation workflows, or SaaS integration preferences.</li>
              <li><strong>Communications:</strong> Emails, forms, and chat messages.</li>
            </ul>

            <h3>B. Automatically Collected Information</h3>
            <ul>
              <li><strong>System Data:</strong> IP address, browser type, operating system, and device data.</li>
              <li><strong>Usage Data:</strong> Session duration, pages visited, and interactions with hosted services.</li>
              <li><strong>Cookies:</strong> Used to improve performance and remember preferences.</li>
            </ul>

            <h3>C. Third-Party Integrations</h3>
            <ul>
              <li><strong>Stripe</strong> (payment processor): Follows its own Privacy Policy.</li>
              <li><strong>Hostinger</strong> (hosting provider): See Hostinger Privacy Policy for server security and data handling.</li>
              <li><strong>Analytics:</strong> May use Google Analytics for service optimization.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="privacy-section">
            <h2><span className="section-number">3.</span> How We Use Your Information</h2>
            <p>We process personal data for legitimate business purposes:</p>
            <ul>
              <li>To provide and maintain SaaS functionalities;</li>
              <li>To manage accounts and subscriptions;</li>
              <li>To process payments and invoices;</li>
              <li>To communicate technical updates, promotions, or support;</li>
              <li>To comply with the Texas Data Privacy and Security Act;</li>
              <li>To detect and prevent fraud or misuse.</li>
            </ul>
            <div className="highlight-box success">
              <p><strong>We never sell personal information to third parties.</strong></p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="privacy-section">
            <h2><span className="section-number">4.</span> Legal Basis for Processing (TDPSA Compliance)</h2>
            <p>Under the Texas Data Privacy and Security Act (TDPSA), we collect and use data only when:</p>
            <ul>
              <li>Necessary to provide requested services;</li>
              <li>Required by legal obligations;</li>
              <li>Used with user consent (e.g., marketing emails);</li>
              <li>For legitimate business purposes aligned with user expectations.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="privacy-section">
            <h2><span className="section-number">5.</span> Data Retention</h2>
            <p>We retain data for as long as necessary:</p>
            <ul>
              <li>To maintain your subscription or active project;</li>
              <li>To comply with tax, legal, or business recordkeeping obligations;</li>
              <li>To resolve disputes or enforce contracts.</li>
            </ul>
            <p>When data is no longer required, we securely delete or anonymize it.</p>
          </section>

          {/* Section 6 */}
          <section className="privacy-section">
            <h2><span className="section-number">6.</span> Your Rights Under Texas Law</h2>
            <p>Under the TDPSA, Texas residents have specific privacy rights:</p>
            <div className="rights-grid">
              <div className="right-card">
                <h4>Access</h4>
                <p>You can request a copy of your personal data.</p>
              </div>
              <div className="right-card">
                <h4>Correction</h4>
                <p>You may update inaccurate information.</p>
              </div>
              <div className="right-card">
                <h4>Deletion</h4>
                <p>You may request deletion of your personal data.</p>
              </div>
              <div className="right-card">
                <h4>Opt-out</h4>
                <p>You may opt out of targeted advertising, data sales, and automated profiling.</p>
              </div>
            </div>
            <p className="rights-note">
              To exercise your rights, contact us at <a href="mailto:nothingelsestore@nothingelsesolutions.com">nothingelsestore@nothingelsesolutions.com</a> and 
              allow up to 45 days for a response, per TDPSA requirements.
            </p>
          </section>

          {/* Section 7 */}
          <section className="privacy-section">
            <h2><span className="section-number">7.</span> Data Storage and Security</h2>
            <ul>
              <li>Hosted on Hostinger data centers with encrypted storage.</li>
              <li>Protected via HTTPS, firewalls, and role-based access control.</li>
              <li>Regular audits and security updates maintain system integrity.</li>
            </ul>
            <p className="disclaimer">
              While we implement strong safeguards, no system is completely secure. Use at your own discretion.
            </p>
          </section>

          {/* Section 8 */}
          <section className="privacy-section">
            <h2><span className="section-number">8.</span> Sharing and Disclosure</h2>
            <p>We may share limited data with:</p>
            <ul>
              <li>Service providers such as Stripe and Hostinger;</li>
              <li>Legal authorities, when required by law;</li>
              <li>Business successors in the event of a merger, acquisition, or reorganization.</li>
            </ul>
            <p>All third parties adhere to strict confidentiality and data protection standards.</p>
          </section>

          {/* Section 9 */}
          <section className="privacy-section">
            <h2><span className="section-number">9.</span> Use of Cookies and Analytics</h2>
            <p>
              We use cookies for functionality, analytics, and marketing optimization.
              You can disable cookies in your browser settings, but some services may stop working properly.
            </p>
          </section>

          {/* Section 10 */}
          <section className="privacy-section">
            <h2><span className="section-number">10.</span> Children's Privacy</h2>
            <p>
              Our Services are not intended for children under 18. We do not knowingly collect 
              or store such information.
            </p>
          </section>

          {/* Section 11 */}
          <section className="privacy-section">
            <h2><span className="section-number">11.</span> Cross-Border Data Transfers</h2>
            <p>
              Data may be processed or stored outside Texas or the U.S. However, we ensure compliance 
              with standard data protection measures in those jurisdictions.
            </p>
          </section>

          {/* Section 12 */}
          <section className="privacy-section">
            <h2><span className="section-number">12.</span> Updates to the Privacy Policy</h2>
            <p>
              We may revise this policy periodically. Updates will be posted on this page with an 
              updated "Last Modified" date.
            </p>
          </section>

          {/* Section 13 - Contact */}
          {/* <section className="privacy-section contact-section">
            <h2><span className="section-number">13.</span> Contact Information</h2>
            <p>
              If you have concerns or requests related to privacy under the TDPSA or other applicable laws, 
              please contact us:
            </p>
            <div className="contact-card">
              <h3>Nothing Else Solutions</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <FiMapPin />
                  <span>Texas, United States</span>
                </div>
                <div className="contact-item">
                  <FiMail />
                  <a href="mailto:Rgleim@outlook.com">Rgleim@outlook.com</a>
                </div>
                <div className="contact-item">
                  <FiPhone />
                  <span>254-392-1740</span>
                </div>
              </div>
            </div>
          </section> */}

          {/* Related Links */}
          <section className="privacy-section related-section">
            <h2><FiArrowRight /> Related Documents</h2>
            <div className="related-links">
              <Link to="/terms" className="related-link">
                <FiFileText />
                <span>Terms of Service</span>
              </Link>
              <Link to="/faq" className="related-link">
                <FiHelpCircle />
                <span>FAQ</span>
              </Link>
              <Link to="/contact" className="related-link">
                <FiMail />
                <span>Contact Us</span>
              </Link>
            </div>
          </section>

          {/* Back to Home */}
          <div className="privacy-footer">
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
