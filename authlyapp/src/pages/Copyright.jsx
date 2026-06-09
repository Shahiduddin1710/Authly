import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/copyright.css'

function Copyright() {
  return (
    <div className="copyright-page">
      <Navbar />
      
      <main className="copyright-main">
        <div className="copyright-container">
          <div className="copyright-header">
            <h1>Copyright Notice</h1>
            <p className="last-updated">Last Updated: June 8, 2026</p>
          </div>
          
          <div className="copyright-content">
            <div className="copyright-section">
              <h2>1. Ownership of Content</h2>
              <p>All content, features, and functionality of Authly, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Authly and are protected by Indian copyright laws and international copyright treaties.</p>
            </div>
            
            <div className="copyright-section">
              <h2>2. Copyright Protection</h2>
              <p>Authly and its original content, features, and functionality are owned by Authly and are protected by the Copyright Act, 1957 (India) and other intellectual property laws. Authly's name, logo, and related marks are registered or pending registration trademarks.</p>
            </div>
            
            <div className="copyright-section">
              <h2>3. Limited License</h2>
              <p>Authly grants you a personal, non-exclusive, non-transferable, revocable license to use the App for your personal, non-commercial use. You may not:</p>
              <ul>
                <li>Copy, modify, or distribute any part of the App without written permission</li>
                <li>Reverse engineer, decompile, or disassemble the App</li>
                <li>Remove any copyright or other proprietary notices from the App</li>
                <li>Use Authly's name, logo, or branding without permission</li>
              </ul>
            </div>
            
            <div className="copyright-section">
              <h2>4. User-Generated Content</h2>
              <p>By submitting, posting, or displaying content on or through Authly, you grant Authly a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute that content solely for the purpose of operating and improving the App.</p>
            </div>
            
            <div className="copyright-section">
              <h2>5. Copyright Infringement Claims</h2>
              <p>If you believe that any material available on or through Authly infringes upon any copyright you own or control, please immediately notify us. Your notice must include:</p>
              <ul>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing</li>
                <li>Your contact information (name, address, email, phone number)</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                <li>A statement that the information in the notice is accurate</li>
              </ul>
            </div>
            
            <div className="copyright-section">
              <h2>6. Reporting Copyright Violations</h2>
              <p>To report copyright violations, contact:</p>
              <p>Email: techshaho786@gmail.com</p>
              <p>Subject Line: Copyright Infringement</p>
            </div>
            
            <div className="copyright-section">
              <h2>7. Consequences of Infringement</h2>
              <p>Any violation of these copyright terms may result in:</p>
              <ul>
                <li>Immediate termination of your account</li>
                <li>Legal action under the Copyright Act, 1957</li>
                <li>Liability for damages and legal fees</li>
                <li>Criminal prosecution in appropriate cases</li>
              </ul>
            </div>
            
            <div className="copyright-section">
              <h2>8. Third-Party Copyrights</h2>
              <p>Authly respects the intellectual property rights of others. If you believe your work has been used in a way that constitutes copyright infringement, please contact us with the details.</p>
            </div>
            
            <div className="copyright-section">
              <h2>9. Permission Requests</h2>
              <p>For permission to use Authly's copyrighted material for commercial purposes, please send your request to:</p>
              <p>Email: techshaho786@gmail.com</p>
              <p>Allow 10-15 business days for response</p>
            </div>
            
            <div className="copyright-section">
              <h2>10. Fair Dealing Notice</h2>
              <p>Under the Indian Copyright Act, 1957, fair dealing for purposes of private or personal use, research, criticism, or review is permitted, provided proper acknowledgment is given to Authly as the source.</p>
            </div>
            
            <div className="copyright-section">
              <h2>11. International Copyright Protection</h2>
              <p>Authly's copyright protection extends internationally through various copyright treaties and conventions, including the Berne Convention for the Protection of Literary and Artistic Works.</p>
            </div>
            
            <div className="copyright-section">
              <h2>12. Updates to Copyright Notice</h2>
              <p>We reserve the right to update this Copyright Notice at any time. Changes will be effective immediately upon posting. Continued use of Authly constitutes acceptance of the updated notice.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default Copyright