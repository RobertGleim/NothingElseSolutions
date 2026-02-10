import { Link } from 'react-router-dom'
import { FiArrowRight, FiZap, FiCode, FiCpu, FiLayers, FiAward, FiLinkedin, FiGithub, FiMail, FiUser } from 'react-icons/fi'
import './About.css'

const About = () => {
  const skills = {
    frontend: ['React', 'JavaScript', 'HTML5', 'CSS', 'Figma'],
    backend: ['Python', 'Flask', 'SQL', 'Node.js'],
    automation: ['n8n', 'AI Agents', 'API Integration', 'Workflow Design'],
    tools: ['Git', 'Vercel', 'Render', 'Auth0', 'Unittest', 'Pytest']
  }

  const projects = [
    {
      title: 'n8n Automated Workflows',
      description: 'Designed an automation system with n8n integrating AI tools and multiple APIs to synchronize data, trigger actions, and handle routine tasks. Built event-based triggers, branching logic, error handling, and monitoring.',
      tech: ['n8n', 'AI Integration', 'API']
    },
    {
      title: 'Grace Lutheran Website',
      description: 'Designed and developed a full-stack web application with multipage navigation, a searchable API for Bible content, daily verse features, and an admin portal for content/user management.',
      // link: 'https://grace-lutheran.vercel.app/',
      tech: ['React', 'Python', 'SQL', 'CSS']
    },
    {
      title: 'Cool X3 Mechanics Shop',
      description: 'Built a React-based portal for inventory and services management, customer database, and admin section for employee/inventory management.',
      // link: 'https://mech-shop-react.vercel.app/',
      tech: ['React', 'Full-Stack']
    }
  ]

  const certifications = [
    { name: 'Software Engineer Certificate – Full Stack', issuer: 'Coding Temple' },
    { name: 'AI Fundamentals: Foundations for Understanding AI', issuer: 'IBM Skills Build' },
    { name: 'AI Literacy', issuer: 'IBM Skills Build' }
  ]

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <div className="about-hero">
          <div className="hero-badge">About Me</div>
          <h1>Hi, I'm <span className="text-gradient">Robert Gleim</span></h1>
          <p className="hero-title">Full-Stack Developer | AI Workflow & Automation Engineer</p>
          <p className="hero-description">
            Full-stack developer specializing in AI-driven automation, workflow orchestration, 
            and web application design. I build reliable, scalable solutions that streamline 
            processes and improve responsiveness, combining hands-on software engineering 
            with automation best practices.
          </p>
          <div className="hero-links">
            <a href="https://linkedin.com/in/robert-gleim" target="_blank" rel="noopener noreferrer" className="social-link">
              <FiLinkedin /> LinkedIn
            </a>
            <a href="https://github.com/rgleim" target="_blank" rel="noopener noreferrer" className="social-link">
              <FiGithub /> GitHub
            </a>
            <a href="mailto:Rgleim@outlook.com" className="social-link">
              <FiMail /> Email
            </a>
          </div>
        </div>

        {/* Skills Section */}
        <div className="skills-section">
          <h2>Technical <span className="text-gradient">Skills</span></h2>
          <div className="skills-grid">
            <div className="skill-category">
              <div className="skill-icon"><FiCode /></div>
              <h3>Frontend</h3>
              <div className="skill-tags">
                {skills.frontend.map(skill => <span key={skill}>{skill}</span>)}
              </div>
            </div>
            <div className="skill-category">
              <div className="skill-icon"><FiLayers /></div>
              <h3>Backend</h3>
              <div className="skill-tags">
                {skills.backend.map(skill => <span key={skill}>{skill}</span>)}
              </div>
            </div>
            <div className="skill-category">
              <div className="skill-icon"><FiCpu /></div>
              <h3>Automation & AI</h3>
              <div className="skill-tags">
                {skills.automation.map(skill => <span key={skill}>{skill}</span>)}
              </div>
            </div>
            <div className="skill-category">
              <div className="skill-icon"><FiZap /></div>
              <h3>Tools</h3>
              <div className="skill-tags">
                {skills.tools.map(skill => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="projects-section">
          <h2>Featured <span className="text-gradient">Projects</span></h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech.map(tech => <span key={tech}>{tech}</span>)}
                </div>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    View Project <FiArrowRight />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="experience-section">
          <h2>Professional <span className="text-gradient">Experience</span></h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>Software Engineer</h3>
                  {/* <span className="timeline-date">Jun 2025 – Dec 2025</span> */}
                </div>
                <p className="timeline-company">Coding Temple</p>
                <ul>
                  <li>Developed full stack projects using React, Flask, Python, and SQL</li>
                  <li>Created responsive web applications, integrating third-party APIs</li>
                  <li>Consistently met deadlines and delivered high-quality solutions</li>
                </ul>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3>Maintenance Manager</h3>
                  {/* <span className="timeline-date">Apr 2019 – May 2025</span> */}
                </div>
                <p className="timeline-company">Lane Enterprises</p>
                <ul>
                  <li>Led process optimization initiatives with data-driven solutions</li>
                  <li>Developed structured procedures and documentation</li>
                  <li>Managed multiple concurrent projects and mentored team members</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="certifications-section">
          <h2>Certifications & <span className="text-gradient">Education</span></h2>
          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="cert-card">
                <FiAward className="cert-icon" />
                <h3>{cert.name}</h3>
                <p>{cert.issuer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <h2>Let's Work Together</h2>
          <p>Ready to build something amazing? Get in touch to discuss your project.</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-primary btn-lg">
              Contact Me <FiArrowRight />
            </Link>
            <Link to="/inquiry" className="btn btn-outline btn-lg">
              Start a Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
