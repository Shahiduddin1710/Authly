import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import aboutImg from '../assets/about.png'
import '../styles/about.css'

function About() {
  return (
    <div className="about-page">
      <Navbar />
      
      <main className="about-main">
<div className="about-container">
          <div className="about-hero-split">
            <div className="about-hero-left">
              <div className="about-header" style={{ textAlign: 'left', marginBottom: 32 }}>
                <h1>Authly</h1>
                <p className="about-tagline">Your Trusted 2FA Security Partner</p>
              </div>
              <div className="about-section" style={{ marginBottom: 0 }}>
                <p className="about-bold">We are not just an app, we are your security companion</p>
                <p>Trusted by individuals worldwide, Authly streamlines two-factor authentication management through one unified platform. With privacy, transparency, and real-time code generation, we make account security faster and easier.</p>
                <p className="about-bold">What makes us different?</p>
                <p>Authly eliminates the hassle of managing multiple authenticator apps and manual backup codes. Every account is encrypted, tracked, and secured with industry-standard protection. When you think 2FA security, think Authly.</p>
              </div>
            </div>
            <div className="about-hero-right">
              <img src={aboutImg} alt="Authly App Preview" className="about-phone-img" />
            </div>
          </div>
          
       <div className="about-image-section">
            <img src={aboutImg} alt="Authly App Preview" className="about-phone-img" />
          </div>

          <div className="about-section">
            <h2>The Story Behind Authly</h2>
            <p>In today's digital age, online accounts hold our most sensitive information. Yet many people still rely on SMS-based 2FA or skip security altogether due to complexity.</p>
            <p>Authly was born from a simple observation - existing authenticator apps lacked essential features like cloud sync, proper encryption, and user-friendly design. Many users lost access to their accounts when they lost their phones.</p>
            <p>We set out to build something better. A secure, modern authenticator app that gives you peace of mind without sacrificing convenience. Authly combines military-grade encryption with seamless cloud sync, so your 2FA codes are always accessible when you need them.</p>
            <p>Driven by innovation, dedication, and a commitment to digital security, Authly continues to enhance how people protect their online presence.</p>
          </div>
          
        
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default About