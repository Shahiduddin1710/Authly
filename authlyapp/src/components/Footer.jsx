import '../styles/footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
        <div className="footer-brand">
            <img src="/icon.png" alt="Authly" style={{ height: '28px', width: '28px', objectFit: 'contain' }} />
            <span className="footer-brand-name">Authly</span>
          </div>
          <p className="footer-tagline">
            2 steps ahead
          </p>
        </div>

        <div className="footer-links-group">
          <h4>Platform</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms &amp; Conditions</a></li>
            <li><a href="/copyright">Copyright Policy</a></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Support</h4>
          <ul>
            <li><a href="mailto:authlysupport@gmail.com">authlysupport@gmail.com</a></li>
            <li><strong>Emergency:</strong> <a href="tel:+91987563230">+91 987563230</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">
          © {currentYear} Authly. All rights reserved.
        </span>
        <span className="footer-version">Authly Platform v1.0</span>
      </div>
    </footer>
  )
}

export default Footer