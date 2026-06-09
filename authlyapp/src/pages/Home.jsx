import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import homeImg from '../assets/home.png'
import '../styles/home.css'

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <section className="home-hero">
        <div className="home-hero-text">
          <h1 className="home-hero-title">
            Authenticator<br />
            <strong>App - Authly</strong>
          </h1>
          <p className="home-hero-sub">
            Secure 2FA At Your Fingertips
          </p>
          <div className="home-hero-actions">
            <a href="https://expo.dev/accounts/shaho/projects/authly/builds/a73abd59-413b-4328-b465-b94aba9ddebf" className="home-btn-primary">Download App</a>
            <a href="/about" className="home-btn-secondary">Learn More</a>
          </div>
        </div>

      <div className="home-hero-visual">
  <div className="home-hero-blob" />
  <div className="home-hero-phone">
    <div className="home-hero-phone-inner">
      <div className="home-hero-phone-notch" />
      <img src={homeImg} alt="Authly App" className="home-hero-img" />
    </div>
  </div>
</div>
      </section>

    

      <Footer />
    </div>
  )
}

export default Home