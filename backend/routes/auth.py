from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token,
    jwt_required, 
    get_jwt_identity
)
from flask_bcrypt import Bcrypt
from datetime import timedelta
import hmac
import os

auth_bp = Blueprint('auth', __name__)
bcrypt = Bcrypt()

# In-memory user store (replace with Pinecone in production)
users = {}
# No defaults: admin login is disabled unless both env vars are set
admin_user = {
    'email': os.getenv('ADMIN_EMAIL', ''),
    'password': os.getenv('ADMIN_PASSWORD', ''),
    'is_admin': True
}

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    
    if not email or not password or not name:
        return jsonify({'error': 'Missing required fields'}), 400
    
    if email in users:
        return jsonify({'error': 'User already exists'}), 409
    
    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Store user
    users[email] = {
        'email': email,
        'password': hashed_password,
        'name': name,
        'is_admin': False,
        'wishlist': [],
        'orders': []
    }
    
    # Create tokens
    access_token = create_access_token(
        identity=email,
        additional_claims={'is_admin': False}
    )
    
    return jsonify({
        'token': access_token,
        'user': {
            'email': email,
            'name': name,
            'is_admin': False
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = users.get(email)
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Create token
    access_token = create_access_token(
        identity=email,
        additional_claims={'is_admin': user.get('is_admin', False)}
    )
    
    return jsonify({
        'token': access_token,
        'user': {
            'email': user['email'],
            'name': user['name'],
            'is_admin': user.get('is_admin', False)
        }
    })

@auth_bp.route('/admin/login', methods=['POST'])
def admin_login():
    """Admin login"""
    data = request.get_json(silent=True) or {}

    email = str(data.get('email') or '')
    password = str(data.get('password') or '')

    configured = admin_user['email'] and admin_user['password']
    email_ok = hmac.compare_digest(email.encode(), admin_user['email'].encode())
    password_ok = hmac.compare_digest(password.encode(), admin_user['password'].encode())
    if not (configured and email_ok and password_ok):
        return jsonify({'error': 'Invalid admin credentials'}), 401
    
    # Create admin token
    access_token = create_access_token(
        identity=email,
        additional_claims={'is_admin': True}
    )
    
    return jsonify({
        'token': access_token,
        'user': {
            'email': email,
            'name': 'Admin',
            'is_admin': True
        }
    })

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user info"""
    email = get_jwt_identity()
    user = users.get(email)
    
    if not user:
        if email == admin_user['email']:
            return jsonify({
                'email': email,
                'name': 'Admin',
                'is_admin': True
            })
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'email': user['email'],
        'name': user['name'],
        'is_admin': user.get('is_admin', False)
    })

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client should discard token)"""
    return jsonify({'message': 'Logged out successfully'})
