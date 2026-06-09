
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/privacy.css'

function Privacy() {
  return (
    <div className="privacy-page">
      <Navbar />
      
      <main className="privacy-main">
        <div className="privacy-container">
          <div className="privacy-header">
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last Updated: June 8, 2026</p>
            <p className="intro">Your privacy is important to us. This Privacy Policy explains how Authly collects, uses, and protects your personal information.</p>
          </div>
          
          <div className="privacy-content">
            <div className="privacy-section">
              <h2>1. Information We Collect</h2>
              <p>We collect the following types of information:</p>
              <p><strong>Account Information:</strong></p>
              <ul>
                <li>Email address</li>
                <li>Password (encrypted, never stored in plain text)</li>
                <li>Account creation date</li>
              </ul>
              <p><strong>2FA Data:</strong></p>
              <ul>
                <li>Service names (e.g., Google, GitHub)</li>
                <li>TOTP secret keys (encrypted)</li>
                <li>Account icons or logos</li>
              </ul>
              <p><strong>Device Information:</strong></p>
              <ul>
                <li>Device model</li>
                <li>Operating system version</li>
                <li>App version</li>
                <li>Unique device identifiers</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Authenticate your identity</li>
                <li>Generate one-time passwords for your 2FA accounts</li>
                <li>Sync your 2FA data across multiple devices</li>
                <li>Improve app performance and security</li>
                <li>Send important account notifications via email</li>
                <li>Respond to support requests</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>3. Data Storage & Security</h2>
              <p><strong>Local Storage:</strong> Your 2FA secrets are stored locally on your device using AsyncStorage with encryption.</p>
              <p><strong>Cloud Storage:</strong> When you enable cloud sync, your encrypted 2FA data is stored on Firebase Firestore. Secrets are encrypted before leaving your device.</p>
              <p><strong>Encryption:</strong> All sensitive data is encrypted using industry-standard AES-256 encryption. Your password is hashed using bcrypt.</p>
            </div>
            
            <div className="privacy-section">
              <h2>4. Data Sharing</h2>
              <p>We do not sell, trade, or transfer your personal information to third parties. We may share data only:</p>
              <ul>
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect against fraud or security threats</li>
                <li>With service providers who assist app operations (Firebase, email services)</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>5. Email Communications</h2>
              <p>We use your email address to send:</p>
              <ul>
                <li>Account verification codes</li>
                <li>Password reset links</li>
                <li>Security alerts</li>
                <li>Important app updates</li>
              </ul>
              <p>You cannot opt out of essential security emails.</p>
            </div>
            
            <div className="privacy-section">
              <h2>6. Data Retention</h2>
              <p>We retain your account data until you delete your account. When you delete your account:</p>
              <ul>
                <li>All 2FA secrets are permanently removed from our servers</li>
                <li>Local data on your device remains until manually cleared</li>
                <li>Email records may be retained for legal compliance</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and all associated data</li>
                <li>Export your 2FA data</li>
                <li>Disable cloud sync at any time</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>8. Third-Party Services</h2>
              <p>Authly integrates with:</p>
              <ul>
                <li><strong>Firebase Firestore</strong> - Cloud sync and authentication</li>
                <li><strong>Nodemailer</strong> - Email delivery service</li>
              </ul>
              <p>These services have their own privacy policies. We recommend reviewing them.</p>
            </div>
            
            <div className="privacy-section">
              <h2>9. Children's Privacy</h2>
              <p>Authly is not intended for users under 13 years of age. We do not knowingly collect information from children under 13.</p>
            </div>
            
            <div className="privacy-section">
              <h2>10. Security Breaches</h2>
              <p>In the event of a data breach, we will:</p>
              <ul>
                <li>Notify affected users within 72 hours</li>
                <li>Provide details of the breach</li>
                <li>Recommend protective actions</li>
                <li>Report to relevant authorities as required by law</li>
              </ul>
            </div>
            
            <div className="privacy-section">
              <h2>11. International Data Transfers</h2>
              <p>Your data may be stored on servers located outside your country of residence. We ensure appropriate safeguards are in place for international data transfers.</p>
            </div>
            
            <div className="privacy-section">
              <h2>12. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy periodically. Material changes will be notified via:</p>
              <ul>
                <li>Email notification</li>
                <li>In-app notification</li>
                <li>Updated "Last Updated" date at the top of this policy</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Privacy