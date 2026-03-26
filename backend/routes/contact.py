from flask import Blueprint, request, jsonify
import re
import traceback

from models import db, Contact

contact_bp = Blueprint('contact', __name__)


@contact_bp.route('/', methods=['POST', 'OPTIONS'], strict_slashes=False)
def submit_contact():
    """Handle contact form submissions"""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        return response, 200
    
    try:
        # Parse JSON safely, with fallbacks for form-encoded bodies or malformed payloads.
        data = None
        try:
            data = request.get_json(silent=True)
        except Exception:
            data = None

        raw = None
        if not data:
            # Try reading raw body and decode as UTF-8 JSON
            try:
                raw = request.get_data(cache=True)
                if raw:
                    import json
                    try:
                        data = json.loads(raw.decode('utf-8'))
                    except Exception:
                        data = None
            except Exception:
                raw = None

        if not data:
            # Fallback to form data (application/x-www-form-urlencoded)
            try:
                data = request.form.to_dict() or {}
            except Exception:
                data = {}

        if not data:
            print(f"Invalid request body; raw bytes: {raw!r}")
            return jsonify({'error': 'Invalid JSON or empty body'}), 400

        # Basic validation and sanitization
        name = (data.get('name') or '').strip()
        email = (data.get('email') or '').strip()
        subject = (data.get('subject') or '').strip()
        message = (data.get('message') or '').strip()

        # Required checks
        if not name or not email or not subject or not message:
            return jsonify({'error': 'name, email, subject and message are required'}), 400

        # Length limits
        if len(name) > 200 or len(subject) > 200 or len(message) > 5000:
            return jsonify({'error': 'Input too long'}), 400

        # Simple email format validation
        email_re = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
        if not email_re.match(email) or len(email) > 254:
            return jsonify({'error': 'Invalid email address'}), 400

        # Prevent header injection
        for v in (name, email, subject):
            if '\n' in v or '\r' in v:
                return jsonify({'error': 'Invalid input'}), 400
        
        # Create contact record
        contact = Contact(
            name=name,
            email=email,
            subject=subject,
            message=message,
            status='new'
        )
        
        # Save contact to database
        try:
            db.session.add(contact)
            db.session.commit()
            print(f"Contact saved to database with ID: {contact.id}")
        except Exception as e:
            db.session.rollback()
            print(f"[DB ERROR] Failed to save contact: {e}")
            return jsonify({'error': 'Failed to save contact'}), 500
        
        # Log the contact submission
        print(f"New contact submission from {name} ({email})")
        print(f"Subject: {subject}")

        return jsonify({
            'success': True,
            'message': 'Thank you for your message. We will get back to you soon!',
            'delivery': 'backend-database'
        }), 201
        
    except Exception as e:
        print(f"Error processing contact form: {e}")
        traceback.print_exc()
        return jsonify({'error': 'Failed to process your message'}), 500


@contact_bp.route('/', methods=['GET'], strict_slashes=False)
def get_contacts():
    """Get all contacts (requires admin authentication to be added)"""
    try:
        # For now, return all contacts; add JWT check when auth is configured
        contacts = Contact.query.order_by(Contact.created_at.desc()).all()
        return jsonify({
            'success': True,
            'total': len(contacts),
            'contacts': [c.to_dict() for c in contacts]
        }), 200
    except Exception as e:
        print(f"Error retrieving contacts: {e}")
        return jsonify({'error': 'Failed to retrieve contacts'}), 500


@contact_bp.route('/<int:contact_id>', methods=['GET'], strict_slashes=False)
def get_contact(contact_id):
    """Get a single contact by ID"""
    try:
        contact = Contact.query.get(contact_id)
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        # Mark as read
        if contact.status == 'new':
            contact.status = 'read'
            db.session.commit()
        
        return jsonify({
            'success': True,
            'contact': contact.to_dict()
        }), 200
    except Exception as e:
        print(f"Error retrieving contact: {e}")
        return jsonify({'error': 'Failed to retrieve contact'}), 500


@contact_bp.route('/<int:contact_id>', methods=['PUT'], strict_slashes=False)
def update_contact(contact_id):
    """Update contact status (mark as read, responded, etc)"""
    try:
        contact = Contact.query.get(contact_id)
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        data = request.get_json() or {}
        if 'status' in data:
            valid_statuses = ['new', 'read', 'responded']
            if data['status'] in valid_statuses:
                contact.status = data['status']
                db.session.commit()
                print(f"Contact {contact_id} status updated to '{data['status']}'")
        
        return jsonify({
            'success': True,
            'contact': contact.to_dict()
        }), 200
    except Exception as e:
        print(f"Error updating contact: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to update contact'}), 500


@contact_bp.route('/<int:contact_id>', methods=['DELETE'], strict_slashes=False)
def delete_contact(contact_id):
    """Delete a contact"""
    try:
        contact = Contact.query.get(contact_id)
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        
        db.session.delete(contact)
        db.session.commit()
        print(f"Contact {contact_id} deleted")
        
        return jsonify({
            'success': True,
            'message': 'Contact deleted'
        }), 200
    except Exception as e:
        print(f"Error deleting contact: {e}")
        db.session.rollback()
        return jsonify({'error': 'Failed to delete contact'}), 500


