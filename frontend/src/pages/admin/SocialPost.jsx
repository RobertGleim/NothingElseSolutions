import { useState } from 'react'
import { FiFacebook, FiInstagram, FiSend, FiX, FiCheck } from 'react-icons/fi'
import { FaTiktok } from 'react-icons/fa'
import { adminAPI } from '../../services/api'
import { toast } from 'react-toastify'
import './Admin.css'
import './SocialPost.css'

const SocialPost = () => {
  const [platforms, setPlatforms] = useState({
    facebook: true,
    instagram: false,
    tiktok: false
  })
  const [postContent, setPostContent] = useState({
    title: '',
    description: '',
    hashtags: '',
    image: ''
  })
  const [isPosting, setIsPosting] = useState(false)
  const [recentPosts, setRecentPosts] = useState([])

  const handlePlatformToggle = (platform) => {
    setPlatforms(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }))
  }

  const handlePost = async () => {
    if (!postContent.title.trim()) {
      toast.error('Please add a post title')
      return
    }

    const activePlatforms = Object.entries(platforms)
      .filter(([_, active]) => active)
      .map(([platform]) => platform)

    if (activePlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    setIsPosting(true)

    try {
      // This would call your backend which triggers n8n workflow
      await adminAPI.postToSocial({
        platforms: activePlatforms,
        content: postContent
      })

      toast.success(`Post scheduled to ${activePlatforms.join(', ')}!`)
      
      // Add to recent posts
      setRecentPosts(prev => [{
        id: Date.now().toString(),
        title: postContent.title,
        platforms: activePlatforms,
        status: 'success',
        postedAt: new Date().toISOString()
      }, ...prev])

      // Reset form
      setPostContent({ title: '', description: '', hashtags: '', image: '' })
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setIsPosting(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="social-post-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Social Media Post</h1>
      </div>

      <div className="social-post-grid">
        {/* Post Content */}
        <div className="admin-card">
          <h3>1. Write Your Post</h3>
          
          <div className="form-group">
            <label className="form-label">Post Title</label>
            <input
              type="text"
              value={postContent.title}
              onChange={(e) => setPostContent({ ...postContent, title: e.target.value })}
              className="form-input"
              placeholder="Catchy title for your post"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              value={postContent.description}
              onChange={(e) => setPostContent({ ...postContent, description: e.target.value })}
              className="form-textarea"
              rows="4"
              placeholder="Post description"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hashtags</label>
            <input
              type="text"
              value={postContent.hashtags}
              onChange={(e) => setPostContent({ ...postContent, hashtags: e.target.value })}
              className="form-input"
              placeholder="#automation #webdesign #ai"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (optional)</label>
            <input
              type="url"
              value={postContent.image}
              onChange={(e) => setPostContent({ ...postContent, image: e.target.value })}
              className="form-input"
              placeholder="https://..."
            />
          </div>

          {postContent.image && (
            <div className="post-image-preview">
              <img src={postContent.image} alt="Post preview" />
              <button 
                className="remove-image"
                onClick={() => setPostContent({ ...postContent, image: '' })}
              >
                <FiX />
              </button>
            </div>
          )}
        </div>

        {/* Platform Selection */}
        <div className="admin-card">
          <h3>2. Select Platforms</h3>
          
          <div className="platform-toggles">
            <button 
              className={`platform-btn facebook ${platforms.facebook ? 'active' : ''}`}
              onClick={() => handlePlatformToggle('facebook')}
            >
              <FiFacebook />
              <span>Facebook</span>
              {platforms.facebook && <FiCheck className="platform-check" />}
            </button>

            <button 
              className={`platform-btn instagram ${platforms.instagram ? 'active' : ''}`}
              onClick={() => handlePlatformToggle('instagram')}
            >
              <FiInstagram />
              <span>Instagram</span>
              {platforms.instagram && <FiCheck className="platform-check" />}
            </button>

            <button 
              className={`platform-btn tiktok ${platforms.tiktok ? 'active' : ''}`}
              onClick={() => handlePlatformToggle('tiktok')}
            >
              <FaTiktok />
              <span>TikTok</span>
              {platforms.tiktok && <FiCheck className="platform-check" />}
            </button>
          </div>

          <button 
            className="btn btn-primary post-btn"
            onClick={handlePost}
            disabled={isPosting || !postContent.title.trim()}
          >
            <FiSend />
            {isPosting ? 'Posting...' : 'Post Now'}
          </button>
        </div>

        {/* Recent Posts */}
        <div className="admin-card recent-posts-card">
          <h3>Recent Posts</h3>
          
          {recentPosts.length === 0 ? (
            <p className="no-posts">No recent posts</p>
          ) : (
            <div className="recent-posts-list">
              {recentPosts.map(post => (
                <div key={post.id} className="recent-post-item">
                  <div className="post-info">
                    <span className="post-product">{post.title}</span>
                    <div className="post-platforms">
                      {post.platforms.map(p => (
                        <span key={p} className={`platform-badge ${p}`}>
                          {p === 'facebook' && <FiFacebook />}
                          {p === 'instagram' && <FiInstagram />}
                          {p === 'tiktok' && <FaTiktok />}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="post-meta">
                    <span className={`status-indicator ${post.status}`}></span>
                    <span className="post-date">{formatDate(post.postedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialPost
