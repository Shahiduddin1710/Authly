import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/terms.css'

function Terms() {
  return (
    <div className="terms-page">
      <Navbar />
      
      <main className="terms-main">
        <div className="terms-container">
          <div className="terms-header">
            <h1>Terms & Conditions</h1>
            <p className="last-updated">Last Updated: June 8, 2026</p>
            <p className="intro">Please read these terms carefully before using Authly</p>
          </div>
          
          <div className="terms-content">
            <div className="terms-section">
              <h2>1. Acceptance of Terms</h2>
              <p>By downloading, accessing, or using Authly ("the App"), you agree to be bound by these Terms & Conditions. If you disagree with any part of these terms, you may not use the App.</p>
            </div>
            
            <div className="terms-section">
              <h2>2. License to Use</h2>
              <p>We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes. You may not modify, reverse engineer, or create derivative works of the App.</p>
            </div>
            
            <div className="terms-section">
              <h2>3. User Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your login credentials. You agree to accept responsibility for all activities that occur under your account. Notify us immediately of any unauthorized use.</p>
            </div>
            
            <div className="terms-section">
              <h2>4. Privacy & Data Security</h2>
              <p>Your privacy matters. We collect and store your 2FA account data securely using Firebase Firestore with encryption. We do not sell or share your personal data with third parties. Our privacy practices comply with applicable data protection laws.</p>
            </div>
            
            <div className="terms-section">
              <h2>5. 2FA Secret Keys</h2>
              <p>You acknowledge that Authly stores Time-based One-Time Password (TOTP) secrets on your device and our cloud servers for sync purposes. We implement industry-standard encryption, but no method of transmission over the Internet is 100% secure.</p>
            </div>
            
            <div className="terms-section">
              <h2>6. User Responsibilities</h2>
              <p>You agree to use Authly only for lawful purposes. You shall not:</p>
              <ul>
                <li>Use the App for any illegal activity</li>
                <li>Attempt to bypass security features</li>
                <li>Share your account credentials with others</li>
                <li>Use the App to generate codes for unauthorized access</li>
              </ul>
            </div>
            
            <div className="terms-section">
              <h2>7. Backup & Sync</h2>
              <p>Authly provides cloud sync as a convenience feature. You are strongly encouraged to maintain backup codes provided by service providers when enabling 2FA. We are not liable for account lockouts due to lost devices or inaccessible sync data.</p>
            </div>
            
            <div className="terms-section">
              <h2>8. Termination</h2>
              <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that violates these Terms or is harmful to other users or the App.</p>
            </div>
            
            <div className="terms-section">
              <h2>9. Limitation of Liability</h2>
              <p>To the maximum extent permitted by law, Authly and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or access to third-party services.</p>
            </div>
            
            <div className="terms-section">
              <h2>10. Disclaimer of Warranties</h2>
              <p>The App is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or secure.</p>
            </div>
            
            <div className="terms-section">
              <h2>11. Changes to Terms</h2>
              <p>We may modify these Terms at any time. Continued use of the App after changes constitutes acceptance of the new Terms. We will notify users of material changes via email or in-app notification.</p>
            </div>
            
            <div className="terms-section">
              <h2>12. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>
            </div>
            
            <div className="terms-section">
              <h2>13. Contact Information</h2>
              <p>For questions about these Terms, please contact:</p>
              <p>Email: authlysupport@gmail.com</p>
            </div>
          </div>
          
         
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Terms