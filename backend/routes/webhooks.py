from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
import requests
import os
import re

webhooks_bp = Blueprint('webhooks', __name__)

# Import store from admin
from routes.admin import subscribers

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

@webhooks_bp.route('/newsletter', methods=['POST'])
def newsletter_webhook():
    """Handle newsletter subscriptions"""
    data = request.get_json(silent=True) or {}
    email = str(data.get('email') or '').strip()

    if not email or len(email) > 254 or not EMAIL_RE.match(email):
        return jsonify({'error': 'Valid email is required'}), 400

    # Check if already subscribed
    if any(s['email'] == email for s in subscribers):
        return jsonify({'message': 'Already subscribed'}), 200

    subscriber = {
        'id': str(uuid.uuid4())[:8],
        'email': email,
        'subscribedAt': datetime.utcnow().isoformat()
    }

    subscribers.append(subscriber)

    # Trigger n8n webhook for newsletter
    n8n_webhook = os.getenv('N8N_NEWSLETTER_WEBHOOK')
    if n8n_webhook:
        try:
            requests.post(n8n_webhook, json=subscriber, timeout=5)
        except Exception as e:
            print(f"Failed to trigger n8n webhook: {e}")

    return jsonify({'message': 'Subscribed successfully'}), 201
