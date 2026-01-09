from flask import Blueprint, request, jsonify
import uuid
from datetime import datetime
import requests
import os

webhooks_bp = Blueprint('webhooks', __name__)

# Import stores from admin
from routes.admin import contacts, subscribers

@webhooks_bp.route('/contact', methods=['POST'])
def contact_webhook():
    """Handle contact form submissions"""
    data = request.get_json()
    
    contact_id = str(uuid.uuid4())[:8]
    
    contact = {
        'id': contact_id,
        'name': data.get('name'),
        'email': data.get('email'),
        'subject': data.get('subject'),
        'message': data.get('message'),
        'status': 'unread',
        'createdAt': datetime.utcnow().isoformat()
    }
    
    contacts[contact_id] = contact
    
    # Trigger n8n webhook for contact notification
    n8n_webhook = os.getenv('N8N_CONTACT_WEBHOOK')
    if n8n_webhook:
        try:
            requests.post(n8n_webhook, json=contact, timeout=5)
        except Exception as e:
            print(f"Failed to trigger n8n webhook: {e}")
    
    return jsonify({'message': 'Message sent successfully', 'id': contact_id}), 201

@webhooks_bp.route('/newsletter', methods=['POST'])
def newsletter_webhook():
    """Handle newsletter subscriptions"""
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
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

@webhooks_bp.route('/stripe', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events"""
    import stripe
    
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')
    
    if webhook_secret:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        except ValueError as e:
            return jsonify({'error': 'Invalid payload'}), 400
        except stripe.error.SignatureVerificationError as e:
            return jsonify({'error': 'Invalid signature'}), 400
    else:
        event = request.get_json()
    
    # Handle specific events
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        print(f"Payment succeeded: {payment_intent['id']}")
        # Update order status, send confirmation email, etc.
    
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        print(f"Payment failed: {payment_intent['id']}")
        # Handle failed payment
    
    return jsonify({'received': True})
