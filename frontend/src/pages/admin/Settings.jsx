import { useState, useEffect } from 'react'
import { FiSave, FiEye, FiEyeOff, FiRefreshCw } from 'react-icons/fi'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import './Admin.css'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [showKeys, setShowKeys] = useState({})
  const [settings, setSettings] = useState({
    // General
    storeName: 'Nothing Else Solutions',
    storeEmail: 'customerservice@nothingelsesolutions.com',
    supportEmail: 'customerservice@nothingelsesolutions.com',
    phone: '',
    address: '',
    
    // Social Media
    facebookAppId: '',
    facebookAppSecret: '',
    instagramAccessToken: '',
    tiktokClientKey: '',
    tiktokClientSecret: '',
    
    // n8n Integration
    n8nBaseUrl: '',
    n8nApiKey: '',
    n8nContactWebhook: '',
    n8nNewsletterWebhook: '',
    
    // Notifications
    emailNotifications: true
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Load from backend or local storage
      const savedSettings = localStorage.getItem('storeSettings')
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save to backend
      await adminAPI.updateSettings(settings)
      // Also save to local storage for quick access
      localStorage.setItem('storeSettings', JSON.stringify(settings))
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleShowKey = (key) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'social', label: 'Social Media' },
    { id: 'n8n', label: 'n8n Integration' },
    { id: 'notifications', label: 'Notifications' }
  ]

  const renderSecretInput = (label, key, placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="secret-input">
        <input
          type={showKeys[key] ? 'text' : 'password'}
          value={settings[key]}
          onChange={(e) => handleChange(key, e.target.value)}
          className="form-input"
          placeholder={placeholder}
        />
        <button 
          type="button"
          className="toggle-visibility"
          onClick={() => toggleShowKey(key)}
        >
          {showKeys[key] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  )

  return (
    <div className="admin-settings">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Settings</h1>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          <FiSave /> {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="settings-layout">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="settings-content">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>Store Information</h2>
              
              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Store Email</label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => handleChange('storeEmail', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Support Email</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="form-textarea"
                  rows="2"
                  placeholder="Business address"
                />
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <div className="settings-section">
              <h2>Facebook</h2>
              {renderSecretInput('App ID', 'facebookAppId')}
              {renderSecretInput('App Secret', 'facebookAppSecret')}

              <h2>Instagram</h2>
              {renderSecretInput('Access Token', 'instagramAccessToken')}

              <h2>TikTok</h2>
              {renderSecretInput('Client Key', 'tiktokClientKey')}
              {renderSecretInput('Client Secret', 'tiktokClientSecret')}

              <div className="info-box">
                <strong>Setup Guide:</strong> Configure these APIs in their respective developer portals to enable social media posting from the admin dashboard.
              </div>
            </div>
          )}

          {/* n8n Integration */}
          {activeTab === 'n8n' && (
            <div className="settings-section">
              <h2>n8n Cloud Configuration</h2>
              
              <div className="form-group">
                <label className="form-label">n8n Base URL</label>
                <input
                  type="url"
                  value={settings.n8nBaseUrl}
                  onChange={(e) => handleChange('n8nBaseUrl', e.target.value)}
                  className="form-input"
                  placeholder="https://your-instance.n8n.cloud"
                />
              </div>

              {renderSecretInput('API Key', 'n8nApiKey')}

              <h3>Webhook URLs</h3>
              
              <div className="form-group">
                <label className="form-label">Contact Form Webhook</label>
                <input
                  type="url"
                  value={settings.n8nContactWebhook}
                  onChange={(e) => handleChange('n8nContactWebhook', e.target.value)}
                  className="form-input"
                  placeholder="https://your-instance.n8n.cloud/webhook/contact"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Newsletter Webhook</label>
                <input
                  type="url"
                  value={settings.n8nNewsletterWebhook}
                  onChange={(e) => handleChange('n8nNewsletterWebhook', e.target.value)}
                  className="form-input"
                  placeholder="https://your-instance.n8n.cloud/webhook/newsletter"
                />
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Email Notifications</h2>
              
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  />
                  <span>Enable Email Notifications</span>
                </label>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
