from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import stripe
import os
import uuid
from datetime import datetime
import requests

orders_bp = Blueprint('orders', __name__)

# Initialize Stripe
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# In-memory orders store
orders = {}

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    """Get orders for current user"""
    email = get_jwt_identity()
    user_orders = [o for o in orders.values() if o.get('customer', {}).get('email') == email]
    return jsonify(user_orders)

@orders_bp.route('/<order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    """Get a specific order"""
    email = get_jwt_identity()
    claims = get_jwt()
    
    order = orders.get(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    # Check if user owns the order or is admin
    if order['customer']['email'] != email and not claims.get('is_admin'):
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(order)

@orders_bp.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Create a Stripe payment intent"""
    try:
        data = request.get_json()
        amount = int(float(data['amount']) * 100)  # Convert to cents
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            automatic_payment_methods={'enabled': True},
            metadata={
                'customer_email': data.get('email'),
                'order_items': str(data.get('items', []))
            }
        )
        
        return jsonify({
            'clientSecret': intent.client_secret
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@orders_bp.route('/', methods=['POST'])
def create_order():
    """Create a new order"""
    data = request.get_json()
    
    order_id = f"ORD-{str(uuid.uuid4())[:8].upper()}"
    
    order = {
        'id': order_id,
        'customer': {
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone')
        },
        'items': data.get('items', []),
        'shippingAddress': data.get('shippingAddress'),
        'billingAddress': data.get('billingAddress'),
        'subtotal': data.get('subtotal'),
        'shipping': data.get('shipping'),
        'tax': data.get('tax'),
        'total': data.get('total'),
        'paymentIntentId': data.get('paymentIntentId'),
        'paymentMethod': 'card',
        'status': 'processing',
        'createdAt': datetime.utcnow().isoformat(),
        'isDigital': data.get('isDigital', False)
    }
    
    orders[order_id] = order
    
    # Trigger n8n webhook for order notification
    n8n_webhook = os.getenv('N8N_ORDER_WEBHOOK')
    if n8n_webhook:
        try:
            requests.post(n8n_webhook, json=order, timeout=5)
        except Exception as e:
            print(f"Failed to trigger n8n webhook: {e}")
    
    return jsonify(order), 201

@orders_bp.route('/<order_id>/track', methods=['GET'])
def track_order(order_id):
    """Get order tracking info"""
    order = orders.get(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    tracking = {
        'orderId': order_id,
        'status': order['status'],
        'trackingNumber': order.get('trackingNumber'),
        'carrier': order.get('carrier'),
        'estimatedDelivery': order.get('estimatedDelivery'),
        'timeline': [
            {'status': 'Order Placed', 'date': order['createdAt'], 'completed': True},
            {'status': 'Processing', 'date': order['createdAt'], 'completed': order['status'] in ['processing', 'shipped', 'delivered']},
            {'status': 'Shipped', 'date': order.get('shippedAt'), 'completed': order['status'] in ['shipped', 'delivered']},
            {'status': 'Delivered', 'date': order.get('deliveredAt'), 'completed': order['status'] == 'delivered'}
        ]
    }
    
    return jsonify(tracking)

@orders_bp.route('/guest/<order_id>', methods=['GET'])
def get_guest_order(order_id):
    """Get order for guest (requires email verification)"""
    email = request.args.get('email')
    
    order = orders.get(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    if order['customer']['email'].lower() != email.lower():
        return jsonify({'error': 'Email does not match order'}), 403
    
    return jsonify(order)

@orders_bp.route('/apply-promo', methods=['POST'])
def apply_promo():
    """Apply promo code to order"""
    data = request.get_json()
    code = data.get('code', '').upper()
    subtotal = data.get('subtotal', 0)
    
    # Mock promo codes
    promos = {
        'SAVE10': {'type': 'percentage', 'value': 10, 'minPurchase': 50},
        'FLAT20': {'type': 'fixed', 'value': 20, 'minPurchase': 100},
        'WELCOME15': {'type': 'percentage', 'value': 15, 'minPurchase': 0}
    }
    
    promo = promos.get(code)
    
    if not promo:
        return jsonify({'error': 'Invalid promo code'}), 400
    
    if subtotal < promo['minPurchase']:
        return jsonify({'error': f"Minimum purchase of ${promo['minPurchase']} required"}), 400
    
    if promo['type'] == 'percentage':
        discount = subtotal * (promo['value'] / 100)
    else:
        discount = promo['value']
    
    return jsonify({
        'code': code,
        'discount': round(discount, 2),
        'type': promo['type'],
        'value': promo['value']
    })
