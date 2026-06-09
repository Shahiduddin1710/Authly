import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Mail, Phone, User, MessageSquare, CheckCircle, XCircle } from 'lucide-react'
import '../styles/contact.css'

function Contact() {
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const showToast = (type) => {
    setToast(type)
    setTimeout(() => setToast(null), 4000)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/contact/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        showToast('success')
        setForm({ name: '', email: '', phone: '', message: '' })
      } else {
        showToast('error')
      }
    } catch {
      showToast('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      {toast && (
        <div className={`toast-msg ${toast === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast === 'success'
            ? <><CheckCircle size={18} /> Message Sent Successfully!</>
            : <><XCircle size={18} /> Failed to send. Please try again.</>}
        </div>
      )}
      
      <Navbar />
      
      <div className="contact-container">
        <div className="contact-left">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">Find help for your queries here:</p>

          <div className="contact-info">
            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={20} />
              </div>
              <div className="contact-info-content">
                <h4>Email Us</h4>
                <p><a href="mailto:authlysupport@gmail.com">authlysupport@gmail.com</a></p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={20} />
              </div>
              <div className="contact-info-content">
                <h4>Emergency Support</h4>
                <p><a href="tel:+91987563230">+91 987563230</a></p>
              </div>
            </div>
          </div>

          <div className="contact-find-us">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#" className="social-link" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="social-link" title="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="social-link" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Get in Touch</h3>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

            <div className="form-group">
              <label><User size={14} style={{ marginRight: '8px' }} /> Your Name <span>*</span></label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" required />
            </div>

            <div className="form-group">
              <label><Mail size={14} style={{ marginRight: '8px' }} /> Email Address <span>*</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email" required />
            </div>

            <div className="form-group">
              <label><Phone size={14} style={{ marginRight: '8px' }} /> Mobile Number (Optional)</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter your mobile number" />
            </div>

            <div className="form-group">
              <label><MessageSquare size={14} style={{ marginRight: '8px' }} /> Comment / Message <span>*</span></label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your query or feedback..." required></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Contact