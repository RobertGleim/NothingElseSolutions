from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps
import requests
import os

admin_bp = Blueprint('admin', __name__)

# Admin authorization decorator
def admin_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        claims = get_jwt()
        if not claims.get('is_admin'):
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function

# Newsletter subscribers (in-memory)
subscribers = []

# ============ Social Posts ============

@admin_bp.route('/social/post', methods=['POST'])
@admin_required
def create_social_post():
    """Create a social media post via n8n"""
    data = request.get_json(silent=True) or {}

    # Trigger n8n webhook for social posting
    # This would be configured to post to Facebook, Instagram, TikTok
    n8n_social_webhook = os.getenv('N8N_SOCIAL_WEBHOOK')

    if n8n_social_webhook:
        try:
            requests.post(n8n_social_webhook, json=data, timeout=10)
            return jsonify({'message': 'Post scheduled successfully', 'platforms': data.get('platforms')})
        except Exception as e:
            print(f"[SOCIAL ERROR] Failed to schedule post: {e}")
            return jsonify({'error': 'Failed to schedule post'}), 500

    # Mock response if webhook not configured
    return jsonify({
        'message': 'Post scheduled successfully (mock)',
        'platforms': data.get('platforms')
    })

# ============ Settings ============

settings = {}

@admin_bp.route('/settings', methods=['GET'])
@admin_required
def get_settings():
    """Get site settings"""
    return jsonify(settings)

@admin_bp.route('/settings', methods=['PUT'])
@admin_required
def update_settings():
    """Update site settings"""
    data = request.get_json(silent=True) or {}
    settings.update(data)
    return jsonify(settings)

# ============ Newsletter ============

@admin_bp.route('/subscribers', methods=['GET'])
@admin_required
def get_subscribers():
    """Get newsletter subscribers"""
    return jsonify(subscribers)
