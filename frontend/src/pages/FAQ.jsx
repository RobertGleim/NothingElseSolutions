import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiHelpCircle, FiCode, FiCpu, FiCreditCard, FiSettings, FiShield, FiFileText, FiArrowRight } from 'react-icons/fi'
import './FAQ.css'

const FAQ = () => {
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const faqSections = [
    {
      title: 'General Questions',
      icon: FiHelpCircle,
      items: [
        {
          id: 'general-1',
          question: 'What kind of work do you specialize in?',
          answer: 'I specialize in full-stack development and AI-driven automation, focusing on building scalable, intelligent systems that improve efficiency, reduce manual work, and integrate seamlessly with web applications.'
        },
        {
          id: 'general-2',
          question: 'What technologies do you use for your projects?',
          answer: (
            <>
              <p>My core stack includes:</p>
              <ul>
                <li><strong>Frontend:</strong> React, HTML5, CSS, JavaScript, Figma</li>
                <li><strong>Backend:</strong> Python, Flask, Node.js, SQL</li>
                <li><strong>Automation:</strong> n8n, AI agents, custom API integrations</li>
                <li><strong>Deployment & Tools:</strong> Git, Vercel, Render, Auth0</li>
              </ul>
              <p>These tools allow me to create reliable, modern web applications that are responsive and automation-ready.</p>
            </>
          )
        },
        {
          id: 'general-3',
          question: 'What is n8n and how do you use it in your work?',
          answer: (
            <>
              <p>n8n is an open-source automation platform that lets me connect APIs, databases, and services without writing endless boilerplate code. I use it to:</p>
              <ul>
                <li>Automate repetitive workflows</li>
                <li>Integrate third-party tools and APIs</li>
                <li>Implement intelligent triggers and event-based logic</li>
                <li>Optimize performance by reducing manual tasks</li>
              </ul>
              <p>This approach allows websites and web apps to be more responsive, adaptive, and data-driven.</p>
            </>
          )
        }
      ]
    },
    {
      title: 'Web Development',
      icon: FiCode,
      items: [
        {
          id: 'web-1',
          question: 'What type of websites do you build?',
          answer: (
            <>
              <p>I design and develop custom full-stack web applications using React, Python, Flask, and SQL. My focus is on creating responsive, intuitive, and data-integrated solutions.</p>
              <p><strong>Notable projects:</strong></p>
              <ul>
                <li><strong>Grace Lutheran Website</strong> – A React + Python multipage site with interactive scripture content and admin management.</li>
                <li><strong>Cool X3 Mechanics Shop</strong> – A React-based portal managing customer data, inventory, and services efficiently.</li>
              </ul>
            </>
          )
        },
        {
          id: 'web-2',
          question: 'Can you integrate AI and automation into websites?',
          answer: 'Yes — I integrate AI features and automated workflows directly into web systems. Using tools like n8n, AI APIs, and custom backend logic, I connect web applications with intelligent services to automate data handling, notifications, and analytics.'
        },
        {
          id: 'web-3',
          question: 'Do you work with APIs and custom integrations?',
          answer: 'Absolutely. I frequently build and integrate APIs for automation, data synchronization, and AI interactions. My goal is to create connected systems that reduce human intervention and maximize performance.'
        }
      ]
    },
    {
      title: 'Automation & AI',
      icon: FiCpu,
      items: [
        {
          id: 'ai-1',
          question: 'How does automation benefit a business or project?',
          answer: (
            <>
              <p>Automation:</p>
              <ul>
                <li>Saves hours of repetitive work per week</li>
                <li>Increases consistency and accuracy</li>
                <li>Provides real-time synchronization between apps</li>
                <li>Improves overall productivity and response time</li>
              </ul>
              <p>Examples include automating reports, database updates, user notifications, and workflow monitoring.</p>
            </>
          )
        },
        {
          id: 'ai-2',
          question: 'Can you customize automation to fit my specific tools or apps?',
          answer: 'Yes — I design custom n8n workflows and API connectors that fit your exact stack. Whether you use Google Sheets, Slack, internal systems, or AI APIs, I can automate your unique processes.'
        }
      ]
    },
    {
      title: 'Payments & Hosting',
      icon: FiCreditCard,
      items: [
        {
          id: 'payment-1',
          question: 'What platforms do you use for deployment and hosting?',
          answer: 'I typically deploy on Vercel and Render, offering secure, scalable, and cost-effective hosting options. If preferred, I can also configure Hostinger or client-specific environments to match project needs.'
        },
        {
          id: 'payment-2',
          question: 'How do you handle payments for projects?',
          answer: 'Payments are securely processed through Stripe, ensuring encrypted transactions and no direct handling of financial data. I use this system for project billing and subscription-based SaaS setups.'
        }
      ]
    },
    {
      title: 'Work Process & Availability',
      icon: FiSettings,
      items: [
        {
          id: 'process-1',
          question: 'What is your typical workflow for a new project?',
          answer: (
            <>
              <p>Each project usually follows these steps:</p>
              <ol>
                <li><strong>Discovery & Planning</strong> – Define scope, goals, and integrations</li>
                <li><strong>Design & Development</strong> – Build responsive front and back ends</li>
                <li><strong>Automation Setup</strong> – Implement n8n workflows and testing</li>
                <li><strong>Deployment & Delivery</strong> – Host on preferred platform (e.g., Vercel or Hostinger)</li>
                <li><strong>Post-Launch Support</strong> – Provide debugging, optimization, and updates</li>
              </ol>
            </>
          )
        },
        // {
        //   id: 'process-2',
        //   question: 'How can I contact you for a project or collaboration?',
        //   answer: (
        //     <>
        //       <p>You can reach me directly by:</p>
        //       <ul>
        //         <li><strong>Email:</strong> <a href="mailto:Rgleim@outlook.com">Rgleim@outlook.com</a></li>
        //         <li><strong>Phone:</strong> 254-392-1740</li>
        //         <li><strong>LinkedIn / GitHub:</strong> Available on my <Link to="/about">professional profile</Link></li>
        //       </ul>
        //     </>
        //   )
        // },
        {
          id: 'process-3',
          question: 'Do you provide ongoing support or documentation?',
          answer: (
            <>
              <p>Yes — I ensure all projects include:</p>
              <ul>
                <li>Technical documentation</li>
                <li>Setup instructions for automation workflows</li>
                <li>Optional maintenance and version updates on request</li>
              </ul>
            </>
          )
        }
      ]
    }
  ]

  return (
    <div className="faq-page">
      <div className="container">
        {/* Hero Section */}
        <div className="faq-hero">
          <div className="faq-icon-wrapper">
            <FiHelpCircle className="faq-hero-icon" />
          </div>
          <h1>Frequently Asked <span className="text-gradient">Questions</span></h1>
          <p>Find answers to common questions about my services, process, and technologies.</p>
        </div>

        {/* FAQ Content */}
        <div className="faq-content">
          {faqSections.map((section) => (
            <div key={section.title} className="faq-section">
              <div className="faq-section-header">
                <section.icon className="section-icon" />
                <h2>{section.title}</h2>
              </div>
              <div className="faq-items">
                {section.items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`faq-item ${openItems[item.id] ? 'open' : ''}`}
                  >
                    <button 
                      className="faq-question"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={openItems[item.id]}
                    >
                      <span>{item.question}</span>
                      <FiChevronDown className="faq-chevron" />
                    </button>
                    <div className="faq-answer">
                      <div className="faq-answer-content">
                        {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Related Links */}
        <div className="faq-related">
          <h2><FiArrowRight /> Related Documents</h2>
          <div className="related-links">
            <Link to="/privacy" className="related-link">
              <FiShield />
              <span>Privacy Policy</span>
            </Link>
            <Link to="/terms" className="related-link">
              <FiFileText />
              <span>Terms of Service</span>
            </Link>
            <Link to="/about" className="related-link">
              <FiCode />
              <span>About Me</span>
            </Link>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="faq-cta">
          <h2>Still have questions?</h2>
          <p>Can't find what you're looking for? Feel free to reach out directly.</p>
          <div className="faq-cta-buttons">
            <Link to="/contact" className="btn btn-primary">
              Contact Me
            </Link>
            <Link to="/inquiry" className="btn btn-outline">
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
