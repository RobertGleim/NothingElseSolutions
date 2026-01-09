import { Link } from 'react-router-dom'
import { FiArrowRight, FiZap, FiShield, FiHeart } from 'react-icons/fi'
import './About.css'

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <div className="about-hero">
          <h1>About <span className="text-gradient">Nothing Else Solutions</span></h1>
          <p>
            We're on a mission to deliver quality products and innovative solutions. 
            Nothing more, nothing less – just what you need.
          </p>
        </div>

        {/* Story */}
        <div className="about-section">
          <div className="section-content">
            <h2>Our Story</h2>
            <p>
              Nothing Else Solutions was founded with a simple idea: provide customers 
              with quality products without the unnecessary complexity. We carefully 
              curate electronics, gadgets, and digital products that solve real problems.
            </p>
            <p>
              Our digital products, including n8n automation templates, help businesses 
              streamline their operations and focus on what matters most – growth.
            </p>
          </div>
          <div className="section-image">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" alt="Our Team" />
          </div>
        </div>

        {/* Values */}
        <div className="values-section">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <FiZap className="value-icon" />
              <h3>Innovation</h3>
              <p>Constantly exploring new technologies and solutions to bring you the best products.</p>
            </div>
            <div className="value-card">
              <FiShield className="value-icon" />
              <h3>Quality</h3>
              <p>Every product is carefully selected and tested to meet our high standards.</p>
            </div>
            <div className="value-card">
              <FiHeart className="value-icon" />
              <h3>Customer First</h3>
              <p>Your satisfaction is our priority. We're here to help every step of the way.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h2>Ready to Get Started?</h2>
          <p>Browse our collection of quality products and digital solutions.</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
