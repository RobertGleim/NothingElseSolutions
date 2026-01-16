from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import uuid

products_bp = Blueprint('products', __name__)

# In-memory product store (replace with Pinecone)
products = {
    'test-stripe': {
        'id': 'test-stripe',
        'name': 'Stripe Test Product - $1.00',
        'description': 'This is a test product to verify Stripe payment integration. Use test card 4242 4242 4242 4242 with any future expiry and any CVC.',
        'price': 1.00,
        'salePrice': None,
        'category': 'digital',
        'images': ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'],
        'stock': 999,
        'rating': 5.0,
        'reviewCount': 1,
        'features': ['Test Stripe integration', 'Use card: 4242 4242 4242 4242', 'Any future date, any CVC'],
        'specifications': {'Type': 'Test Product', 'Price': '$1.00'},
        'isDigital': True,
        'downloadUrl': '/downloads/test-receipt.pdf',
        'status': 'active'
    },
    '1': {
        'id': '1',
        'name': 'Wireless Bluetooth Earbuds Pro',
        'description': 'Experience premium sound quality with our wireless earbuds. Features include active noise cancellation, 30-hour battery life, and seamless device switching.',
        'price': 79.99,
        'salePrice': 59.99,
        'category': 'electronics',
        'images': ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
        'stock': 45,
        'rating': 4.5,
        'reviewCount': 127,
        'features': ['Active Noise Cancellation', '30-hour battery life', 'Wireless charging case'],
        'specifications': {'Connectivity': 'Bluetooth 5.2', 'Battery': '6 hours', 'Driver': '10mm'},
        'supplierSource': 'amazon',
        'supplierUrl': 'https://amazon.com/example',
        'isDigital': False,
        'status': 'active'
    },
    '2': {
        'id': '2',
        'name': 'Smart Watch Series X',
        'description': 'Stay connected and track your fitness with our advanced smartwatch. Features health monitoring, GPS, and a stunning AMOLED display.',
        'price': 299.99,
        'salePrice': None,
        'category': 'electronics',
        'images': ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400'],
        'stock': 23,
        'rating': 4.8,
        'reviewCount': 89,
        'features': ['Heart rate monitoring', 'GPS tracking', 'Water resistant'],
        'specifications': {'Display': '1.4" AMOLED', 'Battery': '7 days', 'Water Resistance': '50m'},
        'supplierSource': 'amazon',
        'isDigital': False,
        'status': 'active'
    },
    '3': {
        'id': '3',
        'name': 'Portable Power Bank 20000mAh',
        'description': 'Never run out of battery with this high-capacity power bank. Fast charging support and multiple ports.',
        'price': 49.99,
        'salePrice': 39.99,
        'category': 'accessories',
        'images': ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400'],
        'stock': 67,
        'rating': 4.3,
        'reviewCount': 203,
        'features': ['20000mAh capacity', 'Fast charging', 'Multiple ports'],
        'specifications': {'Capacity': '20000mAh', 'Output': '65W', 'Ports': 'USB-C, 2x USB-A'},
        'isDigital': False,
        'status': 'active'
    },
    'd1': {
        'id': 'd1',
        'name': 'n8n E-commerce Automation Pack',
        'description': 'Complete automation workflow pack for e-commerce. Includes order processing, inventory management, and customer notification workflows.',
        'price': 49.99,
        'salePrice': 29.99,
        'category': 'digital',
        'images': ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'],
        'stock': 999,
        'rating': 4.9,
        'reviewCount': 45,
        'features': ['10+ ready-to-use workflows', 'Easy customization', 'Lifetime updates'],
        'specifications': {'Format': 'JSON', 'Compatibility': 'n8n Cloud & Self-hosted'},
        'isDigital': True,
        'downloadUrl': '/downloads/n8n-ecommerce-pack.zip',
        'status': 'active'
    },
    'd2': {
        'id': 'd2',
        'name': 'Social Media Automation Templates',
        'description': 'Automate your social media presence with these n8n workflows. Schedule posts, track engagement, and grow your audience.',
        'price': 39.99,
        'salePrice': None,
        'category': 'digital',
        'images': ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400'],
        'stock': 999,
        'rating': 4.7,
        'reviewCount': 32,
        'features': ['Multi-platform support', 'Scheduling workflows', 'Analytics integration'],
        'isDigital': True,
        'downloadUrl': '/downloads/social-automation.zip',
        'status': 'active'
    }
}

@products_bp.route('/', methods=['GET'])
def get_products():
    """Get all products with optional filters"""
    category = request.args.get('category')
    search = request.args.get('search', '').lower()
    digital = request.args.get('digital')
    
    result = list(products.values())
    
    # Filter by category
    if category and category != 'all':
        result = [p for p in result if p['category'] == category]
    
    # Filter digital products
    if digital == 'true':
        result = [p for p in result if p.get('isDigital')]
    elif digital == 'false':
        result = [p for p in result if not p.get('isDigital')]
    
    # Search filter
    if search:
        result = [p for p in result if search in p['name'].lower() or search in p.get('description', '').lower()]
    
    # Only return active products
    result = [p for p in result if p.get('status') == 'active']
    
    return jsonify(result)

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    product = products.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify(product)

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    categories = list(set(p['category'] for p in products.values()))
    return jsonify(categories)

@products_bp.route('/featured', methods=['GET'])
def get_featured():
    """Get featured products"""
    featured = [p for p in products.values() if p.get('status') == 'active'][:6]
    return jsonify(featured)

@products_bp.route('/<product_id>/reviews', methods=['GET'])
def get_reviews(product_id):
    """Get product reviews"""
    # Mock reviews
    reviews = [
        {
            'id': '1',
            'user': 'John D.',
            'rating': 5,
            'comment': 'Excellent product! Exceeded my expectations.',
            'date': '2024-01-10'
        },
        {
            'id': '2',
            'user': 'Sarah M.',
            'rating': 4,
            'comment': 'Great quality for the price.',
            'date': '2024-01-08'
        }
    ]
    return jsonify(reviews)

@products_bp.route('/<product_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(product_id):
    """Add a product review"""
    data = request.get_json()
    email = get_jwt_identity()
    
    review = {
        'id': str(uuid.uuid4()),
        'user': email.split('@')[0],
        'rating': data.get('rating'),
        'comment': data.get('comment'),
        'date': '2024-01-15'
    }
    
    return jsonify(review), 201
