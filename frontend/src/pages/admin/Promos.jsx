import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCopy, FiPercent, FiDollarSign } from 'react-icons/fi'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import './Admin.css'
import './Promos.css'

const Promos = () => {
  const [promos, setPromos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPromo, setEditingPromo] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minPurchase: '',
    maxUses: '',
    expiresAt: '',
    isActive: true
  })

  useEffect(() => {
    loadPromos()
  }, [])

  const loadPromos = async () => {
    try {
      // TODO: Fetch promos from API
      // const response = await adminAPI.getPromos()
      // setPromos(response.data.promos || [])
      
      setPromos([])
    } catch (error) {
      console.error('Error loading promos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const openModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo)
      setFormData({
        code: promo.code,
        type: promo.type,
        value: promo.value.toString(),
        minPurchase: promo.minPurchase?.toString() || '',
        maxUses: promo.maxUses?.toString() || '',
        expiresAt: promo.expiresAt || '',
        isActive: promo.isActive
      })
    } else {
      setEditingPromo(null)
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minPurchase: '',
        maxUses: '',
        expiresAt: '',
        isActive: true
      })
    }
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const promoData = {
        ...formData,
        value: parseFloat(formData.value),
        minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase) : 0,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        expiresAt: formData.expiresAt || null
      }

      if (editingPromo) {
        await adminAPI.updatePromo(editingPromo.id, promoData)
        setPromos(promos.map(p => 
          p.id === editingPromo.id ? { ...p, ...promoData } : p
        ))
        toast.success('Promo code updated')
      } else {
        const newPromo = { ...promoData, id: Date.now().toString(), usedCount: 0 }
        setPromos([...promos, newPromo])
        toast.success('Promo code created')
      }

      setShowModal(false)
    } catch (error) {
      toast.error('Failed to save promo code')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return

    try {
      await adminAPI.deletePromo(id)
      setPromos(promos.filter(p => p.id !== id))
      toast.success('Promo code deleted')
    } catch (error) {
      toast.error('Failed to delete promo code')
    }
  }

  const toggleActive = async (promo) => {
    try {
      await adminAPI.updatePromo(promo.id, { isActive: !promo.isActive })
      setPromos(promos.map(p => 
        p.id === promo.id ? { ...p, isActive: !p.isActive } : p
      ))
      toast.success(`Promo code ${!promo.isActive ? 'activated' : 'deactivated'}`)
    } catch (error) {
      toast.error('Failed to update promo code')
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success('Code copied to clipboard')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="admin-promos">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Promo Codes</h1>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Add Promo Code
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table promos-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Min Purchase</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map(promo => (
              <tr key={promo.id}>
                <td>
                  <div className="code-cell">
                    <span className="promo-code">{promo.code}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => copyCode(promo.code)}
                    >
                      <FiCopy />
                    </button>
                  </div>
                </td>
                <td>
                  <span className="discount-value">
                    {promo.type === 'percentage' ? (
                      <><FiPercent /> {promo.value}%</>
                    ) : (
                      <><FiDollarSign /> ${promo.value}</>
                    )}
                  </span>
                </td>
                <td>
                  {promo.minPurchase > 0 ? `$${promo.minPurchase}` : 'None'}
                </td>
                <td>
                  <span className="usage-count">
                    {promo.usedCount} / {promo.maxUses || '∞'}
                  </span>
                </td>
                <td>{formatDate(promo.expiresAt)}</td>
                <td>
                  <button 
                    className={`status-toggle ${promo.isActive ? 'active' : ''}`}
                    onClick={() => toggleActive(promo)}
                  >
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit"
                      onClick={() => openModal(promo)}
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDelete(promo.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {promos.length === 0 && (
          <div className="empty-table">
            <p>No promo codes yet</p>
          </div>
        )}
      </div>

      {/* Promo Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal promo-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Promo Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="form-input"
                    placeholder="SAVE10"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Discount Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="form-select"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Value *</label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="form-input"
                      min="0"
                      step={formData.type === 'percentage' ? '1' : '0.01'}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Min Purchase ($)</label>
                    <input
                      type="number"
                      value={formData.minPurchase}
                      onChange={(e) => setFormData({ ...formData, minPurchase: e.target.value })}
                      className="form-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Max Uses</label>
                    <input
                      type="number"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                      className="form-input"
                      min="1"
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Expiration Date</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPromo ? 'Save Changes' : 'Create Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Promos
