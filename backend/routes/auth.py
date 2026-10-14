from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity
)
import hmac
import os

auth_bp = Blueprint('auth', __name__)

# No defaults: admin login is disabled unless both env vars are set
admin_user = {
    'email': os.getenv('ADMIN_EMAIL', ''),
    'password': os.getenv('ADMIN_PASSWORD', ''),
    'is_admin': True
}

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
    """Get current admin info"""
    email = get_jwt_identity()
    if admin_user['email'] and email == admin_user['email']:
        return jsonify({
            'email': email,
            'name': 'Admin',
            'is_admin': True
        })
    return jsonify({'error': 'User not found'}), 404

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (client should discard token)"""
    return jsonify({'message': 'Logged out successfully'})
