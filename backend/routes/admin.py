from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from functools import wraps
import uuid
from datetime import datetime
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

# In-memory stores (import from other modules in production)
from routes.products import products
from routes.orders import orders

# Contact submissions
contacts = {}

# Promo codes
promos = {
    '1': {
        'id': '1',
        'code': 'SAVE10',
        'type': 'percentage',
        'value': 10,
        'minPurchase': 50,
        'maxUses': 100,
        'usedCount': 45,
        'expiresAt': '2024-02-28',
        'isActive': True
    }
}

# Newsletter subscribers
subscribers = []

# ============ Dashboard ============

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required
def get_dashboard():
    """Get dashboard statistics"""
    total_revenue = sum(o['total'] for o in orders.values())
    total_orders = len(orders)
    
    return jsonify({
        'revenue': total_revenue,
        'orders': total_orders,
        'visitors': 2847,  # Would come from analytics
        'conversion': 5.5,
        'recentOrders': list(orders.values())[:5],
        'topProducts': [
            {'name': 'Smart Watch Series X', 'sales': 45, 'revenue': 13499.55},
            {'name': 'Wireless Earbuds Pro', 'sales': 38, 'revenue': 2279.62}
        ]
    })

# ============ Products ============

@admin_bp.route('/products', methods=['GET'])
@admin_required
def get_all_products():
    """Get all products (including inactive)"""
    return jsonify(list(products.values()))

@admin_bp.route('/products', methods=['POST'])
@admin_required
def create_product():
    """Create a new product"""
    data = request.get_json()
    
    product_id = str(uuid.uuid4())[:8]
    
    product = {
        'id': product_id,
        'name': data.get('name'),
        'description': data.get('description', ''),
        'price': data.get('price'),
        'salePrice': data.get('salePrice'),
        'category': data.get('category', 'electronics'),
        'images': data.get('images', []),
        'stock': data.get('stock', 0),
        'rating': 0,
        'reviewCount': 0,
        'features': data.get('features', []),
        'specifications': data.get('specifications', {}),
        'supplierSource': data.get('supplierSource'),
        'supplierUrl': data.get('supplierUrl'),
        'isDigital': data.get('isDigital', False),
        'status': 'active',
        'createdAt': datetime.utcnow().isoformat()
    }
    
    products[product_id] = product
    
    return jsonify(product), 201

@admin_bp.route('/products/<product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    """Update a product"""
    if product_id not in products:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    products[product_id].update(data)
    products[product_id]['updatedAt'] = datetime.utcnow().isoformat()
    
    return jsonify(products[product_id])

@admin_bp.route('/products/<product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    """Delete a product"""
    if product_id not in products:
        return jsonify({'error': 'Product not found'}), 404
    
    del products[product_id]
    
    return jsonify({'message': 'Product deleted'})

# ============ Orders ============

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_all_orders():
    """Get all orders"""
    status = request.args.get('status')
    result = list(orders.values())
    
    if status:
        result = [o for o in result if o['status'] == status]
    
    return jsonify(result)

@admin_bp.route('/orders/<order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    """Update order status"""
    if order_id not in orders:
        return jsonify({'error': 'Order not found'}), 404
    
    data = request.get_json()
    new_status = data.get('status')
    
    orders[order_id]['status'] = new_status
    
    if new_status == 'shipped':
        orders[order_id]['shippedAt'] = datetime.utcnow().isoformat()
        orders[order_id]['trackingNumber'] = data.get('trackingNumber')
    elif new_status == 'delivered':
        orders[order_id]['deliveredAt'] = datetime.utcnow().isoformat()
    
    return jsonify(orders[order_id])

# ============ Analytics ============

@admin_bp.route('/analytics', methods=['GET'])
@admin_required
def get_analytics():
    """Get analytics data"""
    return jsonify({
        'revenue': {
            'total': 12459.00,
            'byDay': [1200, 1900, 1500, 2100, 1800, 2400, 2000],
            'change': 12.5
        },
        'orders': {
            'total': 156,
            'byDay': [15, 24, 19, 26, 22, 31, 25],
            'change': 8.2
        },
        'visitors': {
            'total': 2847,
            'change': 23.1
        },
        'salesByCategory': [
            {'category': 'Electronics', 'value': 45},
            {'category': 'Accessories', 'value': 25},
            {'category': 'Digital', 'value': 20},
            {'category': 'Gadgets', 'value': 10}
        ],
        'topProducts': [
            {'name': 'Smart Watch Series X', 'sales': 45, 'revenue': 13499.55},
            {'name': 'Wireless Earbuds Pro', 'sales': 38, 'revenue': 2279.62}
        ]
    })

# ============ Promo Codes ============

@admin_bp.route('/promos', methods=['GET'])
@admin_required
def get_promos():
    """Get all promo codes"""
    return jsonify(list(promos.values()))

@admin_bp.route('/promos', methods=['POST'])
@admin_required
def create_promo():
    """Create a promo code"""
    data = request.get_json()
    
    promo_id = str(uuid.uuid4())[:8]
    
    promo = {
        'id': promo_id,
        'code': data.get('code', '').upper(),
        'type': data.get('type', 'percentage'),
        'value': data.get('value'),
        'minPurchase': data.get('minPurchase', 0),
        'maxUses': data.get('maxUses'),
        'usedCount': 0,
        'expiresAt': data.get('expiresAt'),
        'isActive': data.get('isActive', True)
    }
    
    promos[promo_id] = promo
    
    return jsonify(promo), 201

@admin_bp.route('/promos/<promo_id>', methods=['PUT'])
@admin_required
def update_promo(promo_id):
    """Update a promo code"""
    if promo_id not in promos:
        return jsonify({'error': 'Promo not found'}), 404
    
    data = request.get_json()
    promos[promo_id].update(data)
    
    return jsonify(promos[promo_id])

@admin_bp.route('/promos/<promo_id>', methods=['DELETE'])
@admin_required
def delete_promo(promo_id):
    """Delete a promo code"""
    if promo_id not in promos:
        return jsonify({'error': 'Promo not found'}), 404
    
    del promos[promo_id]
    
    return jsonify({'message': 'Promo deleted'})

# ============ Contacts ============

@admin_bp.route('/contacts', methods=['GET'])
@admin_required
def get_contacts():
    """Get all contact submissions"""
    return jsonify(list(contacts.values()))

@admin_bp.route('/contacts/<contact_id>/status', methods=['PUT'])
@admin_required
def update_contact_status(contact_id):
    """Update contact status"""
    if contact_id not in contacts:
        return jsonify({'error': 'Contact not found'}), 404
    
    data = request.get_json()
    contacts[contact_id]['status'] = data.get('status')
    
    return jsonify(contacts[contact_id])

@admin_bp.route('/contacts/<contact_id>', methods=['DELETE'])
@admin_required
def delete_contact(contact_id):
    """Delete a contact submission"""
    if contact_id not in contacts:
        return jsonify({'error': 'Contact not found'}), 404
    
    del contacts[contact_id]
    
    return jsonify({'message': 'Contact deleted'})

# ============ Social Posts ============

@admin_bp.route('/social/post', methods=['POST'])
@admin_required
def create_social_post():
    """Create a social media post via n8n"""
    data = request.get_json()
    
    # Trigger n8n webhook for social posting
    # This would be configured to post to Facebook, Instagram, TikTok
    n8n_social_webhook = os.getenv('N8N_SOCIAL_WEBHOOK')
    
    if n8n_social_webhook:
        try:
            response = requests.post(n8n_social_webhook, json=data, timeout=10)
            return jsonify({'message': 'Post scheduled successfully', 'platforms': data.get('platforms')})
        except Exception as e:
            return jsonify({'error': f'Failed to schedule post: {str(e)}'}), 500
    
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
    """Get store settings"""
    return jsonify(settings)

@admin_bp.route('/settings', methods=['PUT'])
@admin_required
def update_settings():
    """Update store settings"""
    data = request.get_json()
    settings.update(data)
    return jsonify(settings)

# ============ Newsletter ============

@admin_bp.route('/subscribers', methods=['GET'])
@admin_required
def get_subscribers():
    """Get newsletter subscribers"""
    return jsonify(subscribers)
