import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiSend, FiUser, FiMail, FiPhone, FiMessageSquare, FiCheck } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { contactAPI } from '../services/api'
import './CustomInquiry.css'

const CustomInquiry = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const serviceType = searchParams.get('service') || 'website'
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: serviceType,
    budget: '',
    timeline: '',
    projectDescription: '',
    currentWebsite: '',
    features: [],
    howDidYouHear: ''
  })

  const serviceInfo = {
    website: {
      title: 'Custom Website Development',
      subtitle: 'Let\'s build your dream website',
      description: 'Tell us about your vision and we\'ll create a stunning, modern website tailored to your business needs.',
      features: [
        'Responsive Web Design',
        'E-commerce Functionality',
        'Content Management System',
        'SEO Optimization',
        'Custom Animations',
        'API Integrations',
        'User Authentication',
        'Database Design',
        'Payment Processing',
        'Analytics Dashboard'
      ]
    },
    automation: {
      title: 'Custom Automation & AI Agents',
      subtitle: 'Automate your business workflows',
      description: 'Share your workflow challenges and we\'ll design intelligent automation solutions and AI agents to streamline your operations.',
      features: [
        'n8n Workflow Automation',
        'AI Chatbots & Agents',
        'CRM Integration',
        'Email Automation',
        'Social Media Automation',
        'Data Processing Pipelines',
        'API Integrations',
        'Custom AI Solutions',
        'Lead Generation Bots',
        'Report Automation'
      ]
    }
  }

  const currentService = serviceInfo[serviceType] || serviceInfo.website

  const budgetOptions = [
    { value: '', label: 'Select Budget Range' },
    { value: 'under-1k', label: 'Under $1,000' },
    { value: '1k-5k', label: '$1,000 - $5,000' },
    { value: '5k-10k', label: '$5,000 - $10,000' },
    { value: '10k-25k', label: '$10,000 - $25,000' },
    { value: '25k+', label: '$25,000+' },
    { value: 'discuss', label: 'Let\'s Discuss' }
  ]

  const timelineOptions = [
    { value: '', label: 'Select Timeline' },
    { value: 'asap', label: 'ASAP' },
    { value: '1-2-weeks', label: '1-2 Weeks' },
    { value: '1-month', label: '1 Month' },
    { value: '2-3-months', label: '2-3 Months' },
    { value: '3-6-months', label: '3-6 Months' },
    { value: 'flexible', label: 'Flexible' }
  ]

  const referralOptions = [
    { value: '', label: 'How did you hear about us?' },
    { value: 'google', label: 'Google Search' },
    { value: 'social', label: 'Social Media' },
    { value: 'referral', label: 'Referral' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'other', label: 'Other' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send inquiry to backend
      const inquiryData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: `${currentService.title} Inquiry`,
        message: `
Service Type: ${formData.serviceType}
Company: ${formData.company || 'N/A'}
Phone: ${formData.phone || 'N/A'}
Budget: ${formData.budget || 'Not specified'}
Timeline: ${formData.timeline || 'Not specified'}
Current Website: ${formData.currentWebsite || 'N/A'}
Features Requested: ${formData.features.join(', ') || 'None specified'}
How They Found Us: ${formData.howDidYouHear || 'Not specified'}

Project Description:
${formData.projectDescription}
        `.trim()
      }
      
      await contactAPI.submit(inquiryData)
      
      setSubmitted(true)
      toast.success('Your inquiry has been submitted! We\'ll be in touch soon.')
    } catch (error) {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="inquiry-page">
        <div className="container">
          <div className="success-message">
            <div className="success-icon">
              <FiCheck />
            </div>
            <h1>Thank You!</h1>
            <p>Your inquiry has been received. We'll review your project details and get back to you within 24-48 hours.</p>
            <div className="success-actions">
              <button onClick={() => navigate('/')} className="btn btn-primary">
                Back to Home
              </button>
              <button onClick={() => navigate('/about')} className="btn btn-outline">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="inquiry-page">
      <div className="container">
        {/* Header */}
        <div className="inquiry-header">
          <span className="inquiry-badge">
            {serviceType === 'automation' ? 'Automation & AI' : 'Web Development'}
          </span>
          <h1>{currentService.title}</h1>
          <p className="inquiry-subtitle">{currentService.subtitle}</p>
          <p className="inquiry-description">{currentService.description}</p>
        </div>

        <div className="inquiry-layout">
          {/* Form */}
          <form className="inquiry-form" onSubmit={handleSubmit}>
            {/* Contact Information */}
            <div className="form-section">
              <h2><FiUser /> Contact Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label"><FiMail /> Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label"><FiPhone /> Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company / Organization</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Your company name (if applicable)"
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="form-section">
              <h2><FiMessageSquare /> Project Details</h2>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Budget Range *</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {budgetOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Timeline *</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    {timelineOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {serviceType === 'website' && (
                <div className="form-group">
                  <label className="form-label">Current Website (if any)</label>
                  <input
                    type="url"
                    name="currentWebsite"
                    value={formData.currentWebsite}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Project Description *</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="5"
                  placeholder={serviceType === 'automation' 
                    ? "Describe the workflows you want to automate, current pain points, tools you use, and your goals..."
                    : "Describe your website vision, target audience, key features needed, and any design preferences..."
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Features You're Interested In</label>
                <div className="features-grid">
                  {currentService.features.map(feature => (
                    <label key={feature} className="feature-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                      />
                      <span className="checkbox-custom"></span>
                      <span>{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">How did you hear about us?</label>
                <select
                  name="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={handleChange}
                  className="form-select"
                >
                  {referralOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : (
                <>
                  <FiSend /> Submit Inquiry
                </>
              )}
            </button>
          </form>

          {/* Sidebar */}
          <aside className="inquiry-sidebar">
            <div className="sidebar-card">
              <h3>What Happens Next?</h3>
              <div className="timeline-steps">
                <div className="timeline-step">
                  <span className="step-number">1</span>
                  <div>
                    <h4>Review</h4>
                    <p>We'll review your project requirements within 24 hours</p>
                  </div>
                </div>
                <div className="timeline-step">
                  <span className="step-number">2</span>
                  <div>
                    <h4>Consultation</h4>
                    <p>Schedule a free consultation call to discuss details</p>
                  </div>
                </div>
                <div className="timeline-step">
                  <span className="step-number">3</span>
                  <div>
                    <h4>Proposal</h4>
                    <p>Receive a detailed proposal with timeline and pricing</p>
                  </div>
                </div>
                <div className="timeline-step">
                  <span className="step-number">4</span>
                  <div>
                    <h4>Build</h4>
                    <p>We start building your custom solution</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sidebar-card skills-card">
              <h3>Our Expertise</h3>
              {serviceType === 'website' ? (
                <div className="skills-list">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">Flask</span>
                  <span className="skill-tag">PostgreSQL</span>
                  <span className="skill-tag">MongoDB</span>
                  <span className="skill-tag">AWS</span>
                  <span className="skill-tag">Stripe</span>
                  <span className="skill-tag">REST APIs</span>
                  <span className="skill-tag">Responsive Design</span>
                </div>
              ) : (
                <div className="skills-list">
                  <span className="skill-tag">n8n</span>
                  <span className="skill-tag">AI/ML</span>
                  <span className="skill-tag">ChatGPT API</span>
                  <span className="skill-tag">Python</span>
                  <span className="skill-tag">Zapier</span>
                  <span className="skill-tag">Make.com</span>
                  <span className="skill-tag">API Integration</span>
                  <span className="skill-tag">Data Pipelines</span>
                  <span className="skill-tag">CRM Automation</span>
                  <span className="skill-tag">Custom Bots</span>
                </div>
              )}
            </div>

            <div className="sidebar-card guarantee-card">
              <h3>Our Promise</h3>
              <ul>
                <li>✓ 100% Custom Solutions</li>
                <li>✓ Clear Communication</li>
                <li>✓ On-Time Delivery</li>
                <li>✓ Post-Launch Support</li>
                <li>✓ Source Code Ownership</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default CustomInquiry
